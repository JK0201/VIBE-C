import { NextRequest, NextResponse } from 'next/server';
import testersData from '@data/mock/testers.json';
import usersData from '@data/mock/users.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const testType = searchParams.get('testType') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let filteredTesters = [...testersData.testers];

    // Search filter (title or company)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTesters = filteredTesters.filter(
        tester => 
          tester.title.toLowerCase().includes(searchLower) ||
          tester.company.toLowerCase().includes(searchLower)
      );
    }

    // Test type filter
    if (testType) {
      filteredTesters = filteredTesters.filter(tester => 
        tester.testType.includes(testType)
      );
    }

    // Status filter
    if (status) {
      filteredTesters = filteredTesters.filter(tester => tester.status === status);
    }

    // Sort
    filteredTesters.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'reward' || sortBy === 'requiredTesters' || sortBy === 'applicants' || sortBy === 'id') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Add user information for admin view (if userId exists)
    const enrichedTesters = filteredTesters.map(tester => {
      const user = tester.userId ? usersData.users.find(u => u.id === tester.userId) : null;
      return {
        ...tester,
        userName: user?.nickname || 'Unknown',
        userEmail: user?.email || ''
      };
    });

    // Pagination
    const totalItems = enrichedTesters.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTesters = enrichedTesters.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      testers: paginatedTesters,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Admin testers route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testers',
      },
      { status: 500 }
    );
  }
}