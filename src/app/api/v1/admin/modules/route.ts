import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

async function loadModules() {
  const filePath = path.join(process.cwd(), 'data/mock/components.json');
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
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Load modules
    const data = await loadModules();
    let modules = [...data.components];

    // Add default values for modules
    modules = modules.map((module: any) => ({
      ...module,
      status: module.status || 'approved',
      createdAt: module.createdAt || '2024-01-01T00:00:00Z',
      reports: module.reports || 0 // Use actual reports from mock data
    }));

    // Apply filters
    if (search) {
      modules = modules.filter((module: any) => 
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.description?.toLowerCase().includes(search.toLowerCase()) ||
        module.developer?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      modules = modules.filter((module: any) => module.category === category);
    }

    if (status) {
      modules = modules.filter((module: any) => module.status === status);
    }

    // Sort modules
    modules.sort((a: any, b: any) => {
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
    const totalModules = modules.length;
    const totalPages = Math.ceil(totalModules / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated modules
    const paginatedModules = modules.slice(startIndex, endIndex);

    return NextResponse.json({
      modules: paginatedModules,
      pagination: {
        page,
        limit,
        totalModules,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Failed to fetch modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}