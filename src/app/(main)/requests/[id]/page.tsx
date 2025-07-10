'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DetailPageSkeleton from '@/components/common/DetailPageSkeleton/DetailPageSkeleton';
import { Request, User, Application, Bid } from '@/types';
import styles from './page.module.css';
import usersData from '@data/mock/users.json';
import { formatDate } from '@/lib/formatDate';

// Types are imported from @/types

export default function RequestDetailPage() {
  const params = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [requester, setRequester] = useState<User | null>(null);
  const [applicants, setApplicants] = useState<{ [key: number]: User }>({});
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/requests/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setRequest(data.data);
          const foundRequester = usersData.users.find(u => u.id === data.data.userId);
          setRequester(foundRequester || null);

          // Load applicants/bidders
          const applicantIds = data.data.type === 'FIXED_PRICE' 
            ? data.data.applications?.map((a: Application) => a.userId) || []
            : data.data.bids?.map((b: Bid) => b.userId) || [];
          
          const applicantMap: { [key: number]: User } = {};
          applicantIds.forEach((id: number) => {
            const user = usersData.users.find(u => u.id === id);
            if (user) applicantMap[id] = user;
          });
          setApplicants(applicantMap);
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [params.id]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!request) {
    return (
      <div className={styles.notFound}>
        <h2>요청을 찾을 수 없습니다</h2>
        <Link href="/requests" className={styles.backLink}>
          요청 게시판으로 돌아가기
        </Link>
      </div>
    );
  }

  // API response already includes categoryDisplay
  const getCategoryDisplay = () => {
    if (request && 'categoryDisplay' in request) {
      return (request as { categoryDisplay: { name: string } }).categoryDisplay.name;
    }
    // Fallback for old data
    return request?.category || '';
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(request.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isExpired = daysUntilDeadline < 0 || request.status !== 'OPEN';

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">홈</Link>
        <span>/</span>
        <Link href="/requests">개발 요청</Link>
        <span>/</span>
        <span>{request.title}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.header}>
            <div className={styles.badges}>
              {request.isUrgent && (
                <span className={styles.urgentBadge}>긴급</span>
              )}
              <span className={styles.categoryBadge}>
                {getCategoryDisplay()}
              </span>
            </div>
            
            <h1 className={styles.title}>{request.title}</h1>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>마감: {formatDate(request.deadline)} ({daysUntilDeadline}일 남음)</span>
              </div>
              <div className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>등록: {formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className={styles.description}>
            <h2>프로젝트 설명</h2>
            <p>{request.description}</p>
          </div>

          {request.type === 'FIXED_PRICE' && request.applications && (
            <div className={styles.applications}>
              <h2>지원자 ({request.applications.length}명)</h2>
              {request.applications.length === 0 ? (
                <p className={styles.noApplications}>아직 지원자가 없습니다.</p>
              ) : (
                <div className={styles.applicationList}>
                  {request.applications.map(app => {
                    const applicant = applicants[app.userId];
                    return applicant ? (
                      <div key={app.id} className={styles.applicationItem}>
                        <div className={styles.applicantInfo}>
                          <div className={styles.applicantAvatar}>
                            {applicant.nickname.charAt(0)}
                          </div>
                          <div className={styles.applicantDetails}>
                            <h4>{applicant.nickname}</h4>
                            <p>@{applicant.githubId}</p>
                          </div>
                        </div>
                        <p className={styles.applicationMessage}>{app.message}</p>
                        <span className={styles.applicationDate}>
                          {formatDate(app.createdAt)}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          {request.type === 'AUCTION' && request.bids && (
            <div className={styles.bids}>
              <h2>입찰 내역 ({request.bids.length}개)</h2>
              {request.bids.length === 0 ? (
                <p className={styles.noBids}>아직 입찰이 없습니다.</p>
              ) : (
                <div className={styles.applicationList}>
                  {request.bids.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((bid, index) => {
                    const bidder = applicants[bid.userId];
                    return bidder ? (
                      <div key={bid.id} className={styles.applicationItem}>
                        <div className={styles.applicantInfo}>
                          <div className={styles.applicantAvatar}>
                            {bidder.nickname.charAt(0)}
                          </div>
                          <div className={styles.applicantDetails}>
                            <h4>{index + 1}번째 입찰자</h4>
                            <p>익명</p>
                          </div>
                        </div>
                        <p className={styles.applicationMessage}>{bid.message}</p>
                        <span className={styles.applicationDate}>
                          {formatDate(bid.createdAt)}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.budgetCard}>
            <div className={styles.budgetHeader}>
              <h3>가격 정보</h3>
              <span className={styles.priceType}>
                {request.type === 'FIXED_PRICE' ? '고정가' : '경매'}
              </span>
            </div>
            {request.type === 'FIXED_PRICE' ? (
              <>
                <div className={styles.budget}>
                  <span className={styles.budgetAmount}>
                    {request.budget?.toLocaleString()}P
                  </span>
                </div>
                <p className={styles.budgetNote}>
                  가격은 고정되어 있으며, 지원 시 이 금액에 동의하게 됩니다.
                </p>
              </>
            ) : (
              <>
                <div className={styles.budget}>
                  <span className={styles.budgetAmount}>
                    {request.bids && request.bids.length > 0
                      ? `${request.bids.length}명 입찰`
                      : '입찰 없음'}
                  </span>
                </div>
                <p className={styles.budgetNote}>
                  블라인드 경매 방식으로 진행되며, 의뢰자가 적합한 개발자를 선택합니다.
                </p>
              </>
            )}
            
            <button 
              className={styles.applyButton}
              onClick={() => setShowApplyModal(true)}
              disabled={isExpired}
            >
              {isExpired 
                ? (request.type === 'FIXED_PRICE' ? '지원마감' : '경매마감')
                : (request.type === 'FIXED_PRICE' ? '지원하기' : '입찰하기')}
            </button>
          </div>

          {requester && (
            <div className={styles.requesterCard}>
              <h3>요청자 정보</h3>
              <div className={styles.requesterInfo}>
                <div className={styles.requesterAvatar}>
                  {requester.nickname.charAt(0)}
                </div>
                <div className={styles.requesterDetails}>
                  <h4>{requester.nickname}</h4>
                  <p>@{requester.githubId}</p>
                </div>
              </div>
              {requester.bio && (
                <p className={styles.requesterBio}>{requester.bio}</p>
              )}
            </div>
          )}

          <div className={styles.statusCard}>
            <h3>프로젝트 상태</h3>
            <div className={styles.statusInfo}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>상태</span>
                <span className={`${styles.statusValue} ${isExpired ? styles.closed : styles.open}`}>
                  {isExpired ? '마감' : '모집중'}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>카테고리</span>
                <span className={styles.statusValue}>
                  {getCategoryDisplay()}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>마감일</span>
                <span className={styles.statusValue}>
                  {formatDate(request.deadline)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>{request.type === 'FIXED_PRICE' ? '프로젝트 지원하기' : '입찰하기'}</h2>
            <p>이 기능은 아직 준비 중입니다.</p>
            <button onClick={() => setShowApplyModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}