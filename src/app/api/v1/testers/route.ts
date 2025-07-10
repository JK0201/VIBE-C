import { NextRequest, NextResponse } from 'next/server';
import testersData from '@data/mock/testers.json';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'latest';
    const testType = searchParams.getAll('testType');
    const duration = searchParams.getAll('duration');
    const reward = searchParams.getAll('reward');
    const isUrgent = searchParams.get('isUrgent');
    const status = searchParams.getAll('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Filter testers
    let filteredTesters = testersData.testers.filter(tester => {
      // Search filter
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch = 
          tester.title.toLowerCase().includes(query) ||
          tester.description.toLowerCase().includes(query) ||
          tester.company.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Test type filter
      if (testType.length > 0) {
        const hasType = testType.some(type => 
          tester.testType.includes(type)
        );
        if (!hasType) return false;
      }

      // Duration filter
      if (duration.length > 0) {
        if (!duration.includes(tester.duration)) return false;
      }

      // Reward filter
      if (reward.length > 0) {
        const matchesReward = reward.some(range => {
          const [min, max] = range.split('-').map(Number);
          return tester.reward >= min && tester.reward <= max;
        });
        if (!matchesReward) return false;
      }

      // Urgent filter
      if (isUrgent === 'true' && !tester.isUrgent) {
        return false;
      }

      // Status filter
      if (status.length > 0) {
        const matchesStatus = status.some(s => {
          if (s === 'open' && tester.status === 'OPEN') return true;
          if (s === 'in_progress' && tester.status === 'IN_PROGRESS') return true;
          if (s === 'completed' && tester.status === 'COMPLETED') return true;
          return false;
        });
        if (!matchesStatus) return false;
      }

      return true;
    });

    // Sort testers
    filteredTesters = [...filteredTesters].sort((a, b) => {
      switch (sort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'reward-high':
          return b.reward - a.reward;
        case 'reward-low':
          return a.reward - b.reward;
        case 'popular':
          return b.applicants - a.applicants;
        default:
          return 0;
      }
    });

    // Calculate pagination
    const total = filteredTesters.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTesters = filteredTesters.slice(startIndex, endIndex);

    // Enhance testers with display information
    const enhancedTesters = paginatedTesters.map(tester => {
      return {
        ...tester,
        // Add display properties
        testTypeDisplay: getTestTypeDisplay(tester.testType),
        durationDisplay: getDurationDisplay(tester.duration),
        deadlineDisplay: calculateDeadline(tester.deadline),
        isExpired: new Date(tester.deadline) < new Date(),
        statusDisplay: getStatusDisplay(tester.status, tester.applicants, tester.requiredTesters, tester.deadline),
      };
    });

    return NextResponse.json({
      success: true,
      data: enhancedTesters,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testers',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getTestTypeDisplay(types: string[]): { names: string[]; icons: string[]; gradients: string[] } {
  const typeMap: Record<string, { name: string; icon: string; gradient: string }> = {
    'functional': { 
      name: '기능', 
      icon: '🧪',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    'ui': { 
      name: 'UI/UX', 
      icon: '🎨',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
    },
    'performance': { 
      name: '성능', 
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    },
    'security': { 
      name: '보안', 
      icon: '🔒',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    }
  };

  const names = types.map(type => typeMap[type]?.name || type);
  const icons = types.map(type => typeMap[type]?.icon || '🧪');
  const gradients = types.map(type => typeMap[type]?.gradient || 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)');

  return { names, icons, gradients };
}

function getDurationDisplay(duration: string): string {
  const durationMap: Record<string, string> = {
    '3days': '3일',
    '1week': '1주일',
    '2weeks': '2주일',
    '1month': '1개월'
  };
  return durationMap[duration] || duration;
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

function getStatusDisplay(status: string, applicants: number, required: number, deadline: string): string {
  const isExpired = new Date(deadline) < new Date();
  
  if (isExpired || status === 'COMPLETED') {
    return '완료';
  }
  
  switch (status) {
    case 'OPEN': 
      if (applicants >= required) return '완료';
      return `모집중 ${applicants}/${required}`;
    case 'IN_PROGRESS': 
      return '진행중';
    default: 
      return status;
  }
}