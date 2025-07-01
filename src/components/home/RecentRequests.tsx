import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const requests = [
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
  }
];

export default function RecentRequests() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className={styles.recentRequests}>
      <div className={styles.requestsContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>💼</span>
            최신 개발 요청
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
        <div className={styles.requestsList}>
          {requests.map((request) => (
            <div key={request.id} className={styles.requestItem}>
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
        <div className={styles.viewMore}>
          <a href="#" className={styles.viewMoreLink}>
            모든 요청 보기
            <span className={styles.moreArrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}