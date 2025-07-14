import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';
import { User, Bid } from '@/types/api.types';

async function loadRequests() {
  const filePath = path.join(process.cwd(), 'data/mock/requests.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Load data
    const [requestsData, usersData] = await Promise.all([
      loadRequests(),
      loadUsers()
    ]);
    
    let requests = [...requestsData.requests];

    // Enhance requests with user info
    requests = requests.map(request => {
      const user = usersData.users.find((u: User) => u.id === request.userId);
      return {
        ...request,
        userName: user?.nickname || 'Unknown User',
        userEmail: user?.email || '',
        bidCount: request.bids?.length || 0,
        totalBidAmount: request.bids?.reduce((sum: number, bid: Bid) => sum + (bid.amount || 0), 0) || 0
      };
    });

    // Apply filters
    if (search) {
      requests = requests.filter(request => 
        request.title.toLowerCase().includes(search.toLowerCase()) ||
        request.description?.toLowerCase().includes(search.toLowerCase()) ||
        request.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      requests = requests.filter(request => request.type === type);
    }

    if (status) {
      requests = requests.filter(request => request.status === status);
    }

    // Sort requests
    requests.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'deadline') {
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
    const totalRequests = requests.length;
    const totalPages = Math.ceil(totalRequests / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated requests
    const paginatedRequests = requests.slice(startIndex, endIndex);

    return NextResponse.json({
      requests: paginatedRequests,
      pagination: {
        page,
        limit,
        totalRequests,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Failed to fetch requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}