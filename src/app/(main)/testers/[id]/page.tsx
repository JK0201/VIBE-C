'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import testersData from '@data/mock/testers.json';
import { formatDate } from '@/lib/formatDate';

interface Tester {
  id: number;
  title: string;
  company: string;
  description: string;
  testType: string[];
  duration: string;
  requiredTesters: number;
  reward: number;
  requirements: string[];
  deadline: string;
  createdAt: string;
  applicants: number;
  isUrgent: boolean;
  status: string;
}

export default function TesterDetailPage() {
  const params = useParams();
  const [tester, setTester] = useState<Tester | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const testerId = parseInt(params.id as string);
    const foundTester = testersData.testers.find(t => t.id === testerId);
    
    if (foundTester) {
      setTester(foundTester);
    }
  }, [params.id]);

  if (!tester) {
    return (
      <div className={styles.notFound}>
        <h2>테스터 모집을 찾을 수 없습니다</h2>
        <Link href="/testers" className={styles.backLink}>
          테스터 모집 게시판으로 돌아가기
        </Link>
      </div>
    );
  }

  const testTypeKorean: { [key: string]: string } = {
    functional: '기능 테스트',
    ui: 'UI/UX 테스트',
    performance: '성능 테스트',
    security: '보안 테스트'
  };

  const durationKorean: { [key: string]: string } = {
    '3days': '3일',
    '1week': '1주일',
    '2weeks': '2주',
    '1month': '1개월'
  };

  const requirementKorean: { [key: string]: string } = {
    iOS: 'iOS',
    Android: 'Android',
    Windows: 'Windows',
    macOS: 'macOS'
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(tester.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const progressPercentage = Math.round((tester.applicants / tester.requiredTesters) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">홈</Link>
        <span>/</span>
        <Link href="/testers">테스터 모집</Link>
        <span>/</span>
        <span>{tester.title}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.header}>
            <div className={styles.company}>
              <div className={styles.companyAvatar}>
                {tester.company.charAt(0)}
              </div>
              <span>{tester.company}</span>
            </div>
            
            {tester.isUrgent && (
              <span className={styles.urgentBadge}>긴급 모집</span>
            )}
            
            <h1 className={styles.title}>{tester.title}</h1>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>마감: {formatDate(tester.deadline)} ({daysUntilDeadline}일 남음)</span>
              </div>
              <div className={styles.metaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>기간: {durationKorean[tester.duration]}</span>
              </div>
            </div>
          </div>

          <div className={styles.description}>
            <h2>프로젝트 설명</h2>
            <p>{tester.description}</p>
          </div>

          <div className={styles.requirements}>
            <h2>테스트 요구사항</h2>
            <div className={styles.requirementGrid}>
              <div className={styles.requirementItem}>
                <h3>테스트 유형</h3>
                <div className={styles.tags}>
                  {tester.testType.map(type => (
                    <span key={type} className={styles.tag}>
                      {testTypeKorean[type]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.requirementItem}>
                <h3>지원 플랫폼</h3>
                <div className={styles.tags}>
                  {tester.requirements.map(req => (
                    <span key={req} className={styles.tag}>
                      {requirementKorean[req]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.progress}>
            <h2>모집 현황</h2>
            <div className={styles.progressInfo}>
              <div className={styles.progressNumbers}>
                <span className={styles.current}>{tester.applicants}명</span>
                <span className={styles.divider}>/</span>
                <span className={styles.required}>{tester.requiredTesters}명</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <p className={styles.progressText}>
                {tester.requiredTesters - tester.applicants > 0
                  ? `${tester.requiredTesters - tester.applicants}명 더 필요합니다`
                  : '모집이 완료되었습니다'}
              </p>
            </div>
          </div>

          <div className={styles.timeline}>
            <h2>테스트 일정</h2>
            <div className={styles.timelineItems}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div className={styles.timelineContent}>
                  <h4>모집 시작</h4>
                  <p>{formatDate(tester.createdAt)}</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className={styles.timelineContent}>
                  <h4>모집 마감</h4>
                  <p>{formatDate(tester.deadline)}</p>
                </div>
              </div>
              
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className={styles.timelineContent}>
                  <h4>테스트 기간</h4>
                  <p>{durationKorean[tester.duration]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.rewardCard}>
            <h3>보상 정보</h3>
            <div className={styles.reward}>
              <span className={styles.rewardLabel}>테스터 보상</span>
              <span className={styles.rewardAmount}>
                ₩{tester.reward.toLocaleString()}
              </span>
            </div>
            <p className={styles.rewardNote}>
              테스트 완료 후 리포트 제출 시 지급됩니다.
            </p>
            
            <button 
              className={styles.applyButton}
              onClick={() => setShowApplyModal(true)}
              disabled={tester.applicants >= tester.requiredTesters}
            >
              {tester.applicants >= tester.requiredTesters 
                ? '모집 완료' 
                : '테스터 지원하기'}
            </button>
          </div>

          <div className={styles.infoCard}>
            <h3>테스트 정보</h3>
            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>테스트 기간</span>
                <span className={styles.infoValue}>
                  {durationKorean[tester.duration]}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>필요 인원</span>
                <span className={styles.infoValue}>
                  {tester.requiredTesters}명
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>지원자 수</span>
                <span className={styles.infoValue}>
                  {tester.applicants}명
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>모집 상태</span>
                <span className={`${styles.infoValue} ${styles.statusOpen}`}>
                  {tester.status === 'OPEN' ? '모집중' : '마감'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.noticeCard}>
            <h3>주의사항</h3>
            <ul className={styles.noticeList}>
              <li>테스트 기간 동안 성실히 참여해주세요</li>
              <li>상세한 버그 리포트 작성이 필요합니다</li>
              <li>NDA 동의가 필요할 수 있습니다</li>
              <li>보상은 테스트 완료 후 지급됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowApplyModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>테스터 지원하기</h2>
            <p>이 기능은 아직 준비 중입니다.</p>
            <button onClick={() => setShowApplyModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}