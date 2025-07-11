import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';

async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Load users
    const data = await loadUsers();
    let users = [...data.users];

    // Apply filters
    if (search) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.nickname.toLowerCase().includes(search.toLowerCase()) ||
        user.githubId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      users = users.filter(user => user.role === role);
    }

    // Sort users
    users.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue || '2024-01-01').getTime();
        bValue = new Date(bValue || '2024-01-01').getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated users
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Remove sensitive data
    const sanitizedUsers = paginatedUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}