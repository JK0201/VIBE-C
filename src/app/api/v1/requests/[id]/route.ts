import { NextRequest, NextResponse } from 'next/server';
import requestsData from '@data/mock/requests.json';
import usersData from '@data/mock/users.json';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const params = await context.params;
    const requestId = parseInt(params.id);
    
    // Find the request by ID
    const requestItem = requestsData.requests.find(r => r.id === requestId);
    
    if (!requestItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
        },
        { status: 404 }
      );
    }

    // Find the requester information
    const requester = usersData.users.find(u => u.id === requestItem.userId);
    
    // Process applications with user information
    const applicationsWithUsers = requestItem.applications?.map(app => {
      const applicant = usersData.users.find(u => u.id === app.userId);
      return {
        ...app,
        user: applicant ? {
          id: applicant.id,
          name: applicant.nickname,
          profileImage: applicant.profileImage,
          rating: 4.5,
          transactionCount: 10,
          isVerified: true,
        } : null,
      };
    }) || [];

    // Process bids with user information (for auction type)
    const bidsWithUsers = requestItem.bids?.map(bid => {
      const bidder = usersData.users.find(u => u.id === bid.userId);
      return {
        ...bid,
        // Hide bid amount for blind auction
        amount: undefined,
        user: bidder ? {
          id: bidder.id,
          name: bidder.nickname,
          profileImage: bidder.profileImage,
          rating: 4.5,
          transactionCount: 10,
          isVerified: true,
        } : null,
      };
    }) || [];

    // Calculate bid statistics (only for requester or admin)
    const bidInfo = requestItem.type === 'AUCTION' && requestItem.bids ? {
      bidCount: requestItem.bids.length,
      // In a real app, these would be hidden from non-requesters
      lowestBid: requestItem.bids.reduce((min, bid) => 
        bid.amount < min ? bid.amount : min, 
        requestItem.bids[0]?.amount || 0
      ),
      highestBid: requestItem.bids.reduce((max, bid) => 
        bid.amount > max ? bid.amount : max, 
        requestItem.bids[0]?.amount || 0
      ),
      averageBid: requestItem.bids.length > 0 
        ? Math.round(requestItem.bids.reduce((sum, bid) => sum + bid.amount, 0) / requestItem.bids.length)
        : 0
    } : null;

    // Build the detailed response
    const detailedRequest = {
      id: requestItem.id,
      title: requestItem.title,
      description: requestItem.description,
      type: requestItem.type,
      budget: requestItem.budget,
      category: requestItem.category,
      isUrgent: requestItem.isUrgent,
      deadline: requestItem.deadline,
      createdAt: requestItem.createdAt,
      status: requestItem.status,
      images: (requestItem as any).images || [],
      requirements: [
        '개발 경험 3년 이상',
        '관련 포트폴리오 보유',
        '의사소통 원활'
      ],
      deliverables: [
        '완전한 소스 코드',
        '설치 및 배포 가이드',
        '기본 유지보수 문서'
      ],
      requester: requester ? {
        id: requester.id,
        name: requester.nickname,
        email: requester.email,
        profileImage: requester.profileImage,
        rating: 4.5,
        transactionCount: 10,
        isVerified: true,
        joinDate: requester.createdAt,
      } : null,
      applications: applicationsWithUsers,
      bids: bidsWithUsers,
      bidInfo: bidInfo,
      applicationCount: requestItem.applications?.length || 0,
      // Add display properties
      categoryDisplay: getCategoryDisplay(requestItem.category),
      deadlineDisplay: calculateDeadline(requestItem.deadline),
      isExpired: new Date(requestItem.deadline) < new Date(),
    };

    return NextResponse.json({
      success: true,
      data: detailedRequest,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch request details',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getCategoryDisplay(category: string): { name: string; color: string } {
  const categories: Record<string, { name: string; color: string }> = {
    // New category system
    'sns': { name: 'SNS', color: '#667EEA' },
    'automation': { name: 'Automation', color: '#FEB692' },
    'web-app': { name: 'Web/App', color: '#667EEA' },
    'mobile': { name: 'Mobile', color: '#F093FB' },
    'ui-ux': { name: 'UI/UX', color: '#4FACFE' },
    'data': { name: 'Data', color: '#8B5CF6' },
    'ai-ml': { name: 'AI/ML', color: '#FA709A' },
    'fintech': { name: 'Fintech', color: '#A8EDEA' },
    'b2b': { name: 'B2B', color: '#30CFD0' },
    // Old category system (for backward compatibility)
    'website': { name: 'Web/App', color: '#667EEA' },
    'ecommerce': { name: 'Web/App', color: '#4FACFE' },
    'ai': { name: 'AI/ML', color: '#FA709A' },
    'backend': { name: 'B2B', color: '#30CFD0' },
    'blockchain': { name: 'Fintech', color: '#A8EDEA' },
    'devops': { name: 'Automation', color: '#FEB692' },
  };
  
  // Convert to uppercase and replace hyphens with slashes for display
  const defaultName = category.toUpperCase().replace(/-/g, '/');
  
  return categories[category] || { name: defaultName, color: '#667EEA' };
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