import { NextRequest, NextResponse } from 'next/server';
import testersData from '@data/mock/testers.json';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const params = await context.params;
    const testerId = parseInt(params.id);
    
    // Find the tester recruitment by ID
    const testerItem = testersData.testers.find(t => t.id === testerId);
    
    if (!testerItem) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tester recruitment not found',
        },
        { status: 404 }
      );
    }

    // Build the detailed response
    const detailedTester = {
      id: testerItem.id,
      title: testerItem.title,
      company: testerItem.company,
      description: testerItem.description,
      testType: testerItem.testType,
      duration: testerItem.duration,
      requiredTesters: testerItem.requiredTesters,
      reward: testerItem.reward,
      requirements: testerItem.requirements,
      deadline: testerItem.deadline,
      createdAt: testerItem.createdAt,
      applicants: testerItem.applicants,
      isUrgent: testerItem.isUrgent,
      status: testerItem.status,
      // Additional details for detail page
      detailRequirements: [
        '테스트 경험 1년 이상',
        '버그 리포트 작성 능력',
        '요구사항에 맞는 디바이스 보유',
        '테스트 기간 동안 일정 시간 이상 참여 가능'
      ],
      testProcess: [
        '지원서 검토 후 선발',
        '테스트 가이드 및 접속 정보 제공',
        '지정된 기간 동안 테스트 수행',
        '버그 리포트 및 피드백 제출',
        '리워드 지급'
      ],
      benefits: [
        '테스트 참여 인증서 발급',
        '우수 테스터 추가 리워드',
        '차기 프로젝트 우선 참여 기회'
      ],
      // Add display properties
      testTypeDisplay: getTestTypeDisplay(testerItem.testType),
      durationDisplay: getDurationDisplay(testerItem.duration),
      deadlineDisplay: calculateDeadline(testerItem.deadline),
      isExpired: new Date(testerItem.deadline) < new Date(),
      applicationRate: Math.round((testerItem.applicants / testerItem.requiredTesters) * 100),
    };

    return NextResponse.json({
      success: true,
      data: detailedTester,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tester details',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getTestTypeDisplay(testTypes: string[]): { name: string; icon: string }[] {
  const typeMap: Record<string, { name: string; icon: string }> = {
    'functional': { name: '기능 테스트', icon: '⚙️' },
    'ui': { name: 'UI/UX 테스트', icon: '🎨' },
    'performance': { name: '성능 테스트', icon: '⚡' },
    'security': { name: '보안 테스트', icon: '🔒' },
  };
  
  return testTypes.map(type => typeMap[type] || { name: type, icon: '🧪' });
}

function getDurationDisplay(duration: string): string {
  const durationMap: Record<string, string> = {
    '3days': '3일',
    '1week': '1주일',
    '2weeks': '2주일',
    '1month': '1개월',
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