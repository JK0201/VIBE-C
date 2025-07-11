import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Simulated recent activities
    const activities = [
      {
        id: 1,
        icon: '🆕',
        description: '새로운 사용자 가입: test@example.com',
        timestamp: '5분 전',
        type: 'user_signup',
        userId: 32
      },
      {
        id: 2,
        icon: '📦',
        description: 'AI 챗봇 모듈이 등록되었습니다',
        timestamp: '15분 전',
        type: 'module_created',
        moduleId: 21
      },
      {
        id: 3,
        icon: '💰',
        description: '120,000P 거래가 완료되었습니다',
        timestamp: '30분 전',
        type: 'transaction',
        amount: 120000
      },
      {
        id: 4,
        icon: '📝',
        description: '긴급 개발 요청이 등록되었습니다',
        timestamp: '1시간 전',
        type: 'urgent_request',
        requestId: 15
      },
      {
        id: 5,
        icon: '⭐',
        description: '새로운 리뷰가 작성되었습니다 (5점)',
        timestamp: '2시간 전',
        type: 'review',
        rating: 5
      },
      {
        id: 6,
        icon: '🚨',
        description: '부적절한 콘텐츠 신고가 접수되었습니다',
        timestamp: '3시간 전',
        type: 'report',
        reportId: 8
      },
      {
        id: 7,
        icon: '✅',
        description: '모듈 검토가 완료되었습니다',
        timestamp: '4시간 전',
        type: 'module_approved',
        moduleId: 19
      },
      {
        id: 8,
        icon: '👥',
        description: '개발자 레벨이 업그레이드되었습니다',
        timestamp: '5시간 전',
        type: 'user_upgrade',
        userId: 15
      },
      {
        id: 9,
        icon: '💸',
        description: '정산 요청이 처리되었습니다',
        timestamp: '6시간 전',
        type: 'payout',
        amount: 500000
      },
      {
        id: 10,
        icon: '🔄',
        description: '시스템 백업이 완료되었습니다',
        timestamp: '12시간 전',
        type: 'system',
        status: 'success'
      }
    ];

    // Apply limit
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json({
      activities: limitedActivities,
      total: activities.length
    });
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}