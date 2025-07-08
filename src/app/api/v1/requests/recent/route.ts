import { NextRequest, NextResponse } from 'next/server';
import requestsData from '@data/mock/requests.json';
import usersData from '@data/mock/users.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');
    const type = searchParams.get('type') || 'all';

    // Filter requests based on type and exclude expired ones
    const now = new Date();
    let filteredRequests = requestsData.requests.filter(req => {
      // Check if request is OPEN and not expired
      const isOpen = req.status === 'OPEN';
      const deadline = new Date(req.deadline);
      const isNotExpired = deadline > now;
      return isOpen && isNotExpired;
    });

    switch (type) {
      case 'urgent':
        filteredRequests = filteredRequests.filter(req => req.isUrgent);
        break;
      case 'fixed':
        filteredRequests = filteredRequests.filter(req => req.type === 'FIXED_PRICE');
        break;
      case 'auction':
        filteredRequests = filteredRequests.filter(req => req.type === 'AUCTION');
        break;
      // 'all' returns all open and not expired requests
    }

    // Sort by createdAt (most recent first) and limit
    const recentRequests = filteredRequests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(request => {
        // Find the user who created the request
        const user = usersData.users.find(u => u.id === request.userId);
        
        // For auction type, calculate bid information
        const bidInfo = request.type === 'AUCTION' && request.bids ? {
          bidCount: request.bids.length,
          lowestBid: request.bids.reduce((min, bid) => 
            bid.amount < min ? bid.amount : min, 
            request.bids[0]?.amount || 0
          ),
          highestBid: request.bids.reduce((max, bid) => 
            bid.amount > max ? bid.amount : max, 
            request.bids[0]?.amount || 0
          ),
          averageBid: request.bids.length > 0 
            ? Math.round(request.bids.reduce((sum, bid) => sum + bid.amount, 0) / request.bids.length)
            : 0
        } : null;

        return {
          id: request.id,
          title: request.title,
          description: request.description,
          type: request.type,
          budget: request.budget,
          category: request.category,
          isUrgent: request.isUrgent,
          deadline: request.deadline,
          createdAt: request.createdAt,
          status: request.status,
          author: user ? {
            id: user.id,
            name: user.nickname,
            profileImage: user.profileImage,
          } : null,
          applicationCount: request.applications?.length || 0,
          bidInfo: bidInfo,
          // Add display properties
          categoryDisplay: getCategoryDisplay(request.category),
        };
      });

    return NextResponse.json({
      success: true,
      data: recentRequests,
      meta: {
        total: recentRequests.length,
        limit: limit,
        type: type,
      }
    });
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recent requests',
      },
      { status: 500 }
    );
  }
}

// Helper function to get category display info
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