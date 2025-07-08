'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './RecentRequests.module.css';

interface Request {
  id: number;
  title: string;
  description: string;
  type: string;
  budget?: number;
  category: string;
  isUrgent: boolean;
  deadline: string;
  status: string;
  author?: {
    id: number;
    name: string;
    profileImage: string;
  };
  applicationCount?: number;
  bidInfo?: {
    bidCount: number;
    lowestBid: number;
    highestBid: number;
    averageBid: number;
  };
  categoryDisplay: {
    name: string;
    color: string;
  };
  bids?: number; // For display purposes
}

type RequestFromAPI = Request & {
  deadlineDisplay?: string;
};

const mockRequests = [
  {
    id: 1,
    isUrgent: true,
    category: '백엔드/API',
    title: '실시간 암호화폐 거래소 백엔드 API 개발',
    description: '실시간 호가 처리, 주문 매칭 엔진, WebSocket API 구현이 필요합니다.',
    type: '경매',
    bids: 2,
    deadline: '23시간 남음'
  },
  {
    id: 2,
    isUrgent: false,
    category: 'AI/ML',
    title: 'AI 기반 고객 상담 챗봇 개발 필요',
    description: '자사 쇼핑몰용 AI 챗봇 시스템이 필요합니다. 상품 추천, 주문 조회, FAQ 응답 기능 포함.',
    type: '고정가',
    budget: 150000,
    deadline: '5일 남음'
  },
  {
    id: 3,
    isUrgent: true,
    category: '모바일 앱',
    title: 'Flutter 쇼핑몰 앱 결제 모듈 개발',
    description: '토스페이먼츠, 카카오페이, 네이버페이 연동이 필요합니다.',
    type: '고정가',
    budget: 85000,
    deadline: '12시간 남음'
  },
  {
    id: 4,
    isUrgent: false,
    category: '웹사이트',
    title: 'React 기반 관리자 대시보드 개발',
    description: '실시간 데이터 시각화, 사용자 관리, 통계 분석 기능이 필요합니다.',
    type: '경매',
    bids: 5,
    deadline: '3일 남음'
  },
  {
    id: 5,
    isUrgent: true,
    category: '블록체인',
    title: 'NFT 마켓플레이스 스마트 컨트랙트 개발',
    description: 'ERC-721 기반 NFT 민팅, 거래, 로열티 시스템 구현이 필요합니다.',
    type: '고정가',
    budget: 200000,
    deadline: '18시간 남음'
  },
  {
    id: 6,
    isUrgent: false,
    category: '데이터 분석',
    title: 'Python 기반 매출 예측 모델 개발',
    description: '과거 판매 데이터를 기반으로 한 머신러닝 예측 모델이 필요합니다.',
    type: '고정가',
    budget: 120000,
    deadline: '7일 남음'
  }
];

export default function RecentRequests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRequests = async () => {
      setLoading(true);
      
      try {
        const type = activeTab === 'urgent' ? 'urgent' : activeTab === 'fixed' ? 'fixed' : activeTab === 'auction' ? 'auction' : 'all';
        const response = await fetch(`/api/v1/requests/recent?limit=6&type=${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        if (data.success) {
          // Transform API data to match component expectations
          const transformedRequests = data.data.map((request: RequestFromAPI) => ({
            ...request,
            category: request.categoryDisplay.name,
            deadline: calculateDeadline(request.deadline),
            bids: request.bidInfo?.bidCount || 0,
          }));
          setRequests(transformedRequests);
        } else {
          throw new Error(data.error || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('Error fetching recent requests:', err);
        // Fallback to mock data on error
        const transformedMockRequests = mockRequests.map(req => ({
          ...req,
          status: 'OPEN',
          categoryDisplay: getCategoryDisplay(req.category),
          budget: 'budget' in req ? req.budget : undefined,
          bids: 'bids' in req ? req.bids : undefined,
        }));
        setRequests(transformedMockRequests);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRequests();
  }, [activeTab]);

  const handleRequestClick = (requestId: number) => {
    router.push(`/requests/${requestId}`);
  };

  return (
    <section className={styles.recentRequests}>
      <div className={styles.requestsContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>💼</span>
            개발 요청
          </h2>
          <div className={styles.requestTabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'urgent' ? styles.active : ''}`}
              onClick={() => setActiveTab('urgent')}
            >
              <span className={styles.urgentDot}></span>
              긴급
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'fixed' ? styles.active : ''}`}
              onClick={() => setActiveTab('fixed')}
            >
              고정가
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'auction' ? styles.active : ''}`}
              onClick={() => setActiveTab('auction')}
            >
              경매
            </button>
          </div>
        </div>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>요청을 불러오는 중...</p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {requests.map((request) => (
            <div 
              key={request.id} 
              className={styles.requestItem}
              onClick={() => handleRequestClick(request.id)}
            >
              <div className={styles.requestBadges}>
                {request.isUrgent && (
                  <span className={styles.urgentBadge}>긴급</span>
                )}
                <span className={styles.categoryBadge}>{request.category}</span>
              </div>
              <h3 className={styles.requestTitle}>{request.title}</h3>
              <p className={styles.requestDesc}>{request.description}</p>
              <div className={styles.requestMeta}>
                <span className={styles.requestType}>{request.type}</span>
                {request.budget ? (
                  <span className={styles.requestBudget}>{request.budget.toLocaleString()}P</span>
                ) : (
                  <span className={styles.requestBids}>입찰 {request.bids}건</span>
                )}
                <span className={styles.requestDeadline}>{request.deadline}</span>
              </div>
            </div>
          ))}
          </div>
        )}
        <div className={styles.viewMore}>
          <Link href="/requests" className={styles.viewMoreLink}>
            모든 요청 보기
            <span className={styles.moreArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
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
    // Korean names (for backward compatibility)
    '백엔드/API': { name: 'B2B', color: '#30CFD0' },
    'AI/ML': { name: 'AI/ML', color: '#FA709A' },
    '모바일 앱': { name: 'MOBILE', color: '#F093FB' },
    '웹사이트': { name: 'WEB/APP', color: '#667EEA' },
    '블록체인': { name: 'FINTECH', color: '#A8EDEA' },
    '데이터 분석': { name: 'DATA', color: '#8B5CF6' },
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