import { NextRequest, NextResponse } from 'next/server';
import requestsData from '@data/mock/requests.json';
import usersData from '@data/mock/users.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'latest';
    const budgetRange = searchParams.getAll('budgetRange');
    const requestType = searchParams.getAll('requestType');
    const isUrgent = searchParams.get('isUrgent');
    const status = searchParams.getAll('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Filter requests
    let filteredRequests = requestsData.requests.filter(request => {
      // Category filter
      if (category !== 'all' && request.category !== category) {
        return false;
      }

      // Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch = 
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Budget filter
      if (budgetRange.length > 0) {
        const matchesBudget = budgetRange.some(range => {
          const [min, max] = range.split('-').map(Number);
          if (request.budget === null) return false;
          return request.budget >= min && request.budget <= max;
        });
        if (!matchesBudget) return false;
      }

      // Urgent filter
      if (isUrgent === 'true' && !request.isUrgent) {
        return false;
      }

      // Request type filter
      if (requestType.length > 0) {
        const hasType = requestType.some(type => {
          if (type === 'fixed' && request.type === 'FIXED_PRICE') return true;
          if (type === 'auction' && request.type === 'AUCTION') return true;
          return false;
        });
        if (!hasType) return false;
      }

      // Status filter
      if (status.length > 0) {
        const matchesStatus = status.some(s => {
          if (s === 'open' && request.status === 'OPEN') return true;
          if (s === 'completed' && request.status === 'COMPLETED') return true;
          return false;
        });
        if (!matchesStatus) return false;
      }

      return true;
    });

    // Sort requests
    filteredRequests = [...filteredRequests].sort((a, b) => {
      switch (sort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'price-high':
          return (b.budget || 0) - (a.budget || 0);
        case 'price-low':
          return (a.budget || 0) - (b.budget || 0);
        default:
          return 0;
      }
    });

    // Calculate pagination
    const total = filteredRequests.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Enhance requests with author information
    const enhancedRequests = paginatedRequests.map(request => {
      const author = usersData.users.find(u => u.id === request.userId);
      
      return {
        id: request.id,
        title: request.title,
        description: request.description,
        type: request.type,
        budget: request.budget,
        category: request.category,
        isUrgent: request.isUrgent,
        deadline: request.deadline,
        status: request.status,
        createdAt: request.createdAt,
        applicationCount: request.applications?.length || 0,
        bidCount: request.bids?.length || 0,
        author: author ? {
          id: author.id,
          name: author.name,
          profileImage: author.profileImage,
        } : null,
        // Add display properties
        categoryDisplay: getCategoryDisplay(request.category),
        deadlineDisplay: calculateDeadline(request.deadline),
        isExpired: new Date(request.deadline) < new Date(),
      };
    });

    return NextResponse.json({
      success: true,
      data: enhancedRequests,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch requests',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getCategoryDisplay(category: string): { name: string; color: string } {
  const categories: Record<string, { name: string; color: string }> = {
    'website': { name: '웹사이트', color: '#667EEA' },
    'mobile': { name: '모바일 앱', color: '#F093FB' },
    'ecommerce': { name: '이커머스', color: '#4FACFE' },
    'ai': { name: 'AI/ML', color: '#FA709A' },
    'backend': { name: '백엔드/API', color: '#30CFD0' },
    'blockchain': { name: '블록체인', color: '#A8EDEA' },
    'data': { name: '데이터 분석', color: '#8B5CF6' },
    'devops': { name: 'DevOps', color: '#FEB692' },
  };
  return categories[category] || { name: category, color: '#667EEA' };
}

function calculateDeadline(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 0) {
    return '마감됨';
  } else if (diffHours < 24) {
    return `${diffHours}시간 남음`;
  } else if (diffDays < 7) {
    return `${diffDays}일 남음`;
  } else {
    return `${Math.floor(diffDays / 7)}주 남음`;
  }
}