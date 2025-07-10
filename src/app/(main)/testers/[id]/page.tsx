'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ImageGallery from '@/components/common/ImageGallery/ImageGallery';
import DetailPageSkeleton from '@/components/common/DetailPageSkeleton/DetailPageSkeleton';
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
  images?: string[];
}

export default function TesterDetailPage() {
  const params = useParams();
  const [tester, setTester] = useState<Tester | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Agreement detail toggle states
  const [agreementDetails, setAgreementDetails] = useState({
    privacy: false,
    nda: false,
    participation: false
  });
  
  // Form state
  const [formData, setFormData] = useState({
    devices: [] as string[],
    experience: '',
    availability: '',
    introduction: '',
    agreements: {
      privacy: false,
      nda: false,
      participation: false
    }
  });

  useEffect(() => {
    // Simulate API call
    const fetchTester = async () => {
      setIsLoading(true);
      try {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const testerId = parseInt(params.id as string);
        const foundTester = testersData.testers.find(t => t.id === testerId);
        
        if (foundTester) {
          setTester(foundTester);
        }
      } catch (error) {
        console.error('Failed to fetch tester:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTester();
  }, [params.id]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

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
  
  // Determine color based on progress
  const getProgressColor = () => {
    return progressPercentage >= 100 ? 'complete' : 'incomplete';
  };
  
  const isExpired = new Date(tester.deadline).getTime() < new Date().getTime();
  const isClosed = isExpired || tester.status === 'COMPLETED' || tester.applicants >= tester.requiredTesters;

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
              <span className={styles.urgentBadge}>긴급</span>
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
            
            {tester.images && tester.images.length > 0 && (
              <ImageGallery images={tester.images} title={tester.title} />
            )}
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
                <h3>필요 환경</h3>
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
                <span className={`${styles.progressCount} ${styles[getProgressColor()]}`}>
                  {tester.applicants}/{tester.requiredTesters}명
                </span>
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
              <span className={styles.rewardAmount}>
                {tester.reward.toLocaleString()}P
              </span>
            </div>
            <p className={styles.rewardNote}>
              테스트 완료 후 회사 승인 시 자동 지급됩니다.
            </p>
            
            <button 
              className={styles.applyButton}
              onClick={() => {
                // Reset form when opening modal
                setFormData({
                  devices: [],
                  experience: '',
                  availability: '',
                  introduction: '',
                  agreements: {
                    privacy: false,
                    nda: false,
                    participation: false
                  }
                });
                setShowApplyModal(true);
              }}
              disabled={isClosed}
            >
              {isClosed 
                ? '모집 마감' 
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
                <span className={`${styles.infoValue} ${isClosed ? styles.statusClosed : styles.statusOpen}`}>
                  {isClosed ? '마감' : '모집중'}
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>테스터 지원하기</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setShowApplyModal(false)}
                aria-label="닫기"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {/* 보유 기기 */}
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>
                  <span className={styles.required}>*</span> 이 테스트에 필요한 기기/플랫폼을 보유하고 있나요?
                </h3>
                <div className={styles.checkboxGroup}>
                  {tester.requirements.map(req => (
                    <label key={req} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        value={req}
                        checked={formData.devices.includes(req)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              devices: [...prev.devices, req]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              devices: prev.devices.filter(d => d !== req)
                            }));
                          }
                        }}
                      />
                      <span>{requirementKorean[req]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 테스트 경험 */}
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>
                  <span className={styles.required}>*</span> 관련 테스트 경험이 있나요?
                </h3>
                <div className={styles.radioGroup}>
                  {[
                    { value: 'none', label: '없음' },
                    { value: 'beginner', label: '1-3회' },
                    { value: 'intermediate', label: '4-10회' },
                    { value: 'expert', label: '10회 이상' }
                  ].map(option => (
                    <label key={option.value} className={styles.radio}>
                      <input
                        type="radio"
                        name="experience"
                        value={option.value}
                        checked={formData.experience === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 참여 가능 여부 */}
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>
                  <span className={styles.required}>*</span> 테스트 기간({durationKorean[tester.duration]}) 동안 참여 가능하신가요?
                </h3>
                <div className={styles.radioGroup}>
                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="availability"
                      value="full"
                      checked={formData.availability === 'full'}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    />
                    <span>전체 기간 가능</span>
                  </label>
                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="availability"
                      value="partial"
                      checked={formData.availability === 'partial'}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    />
                    <span>부분 참여 (최소 3일 이상)</span>
                  </label>
                </div>
              </div>

              {/* 자기소개 */}
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>
                  간단한 자기소개 <span className={styles.optional}>(선택)</span>
                </h3>
                <p className={styles.formHelp}>왜 이 테스트에 적합한지 간단히 설명해주세요</p>
                <textarea
                  className={styles.textarea}
                  placeholder="예: 평소 쇼핑앱을 자주 사용하며, UI/UX에 관심이 많습니다..."
                  value={formData.introduction}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setFormData(prev => ({ ...prev, introduction: e.target.value }));
                    }
                  }}
                  rows={4}
                />
                <div className={styles.charCount}>
                  {formData.introduction.length}/200
                </div>
              </div>

              {/* 동의사항 */}
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>
                  <span className={styles.required}>*</span> 동의사항
                </h3>
                <div className={styles.agreementGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.agreements.privacy}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        agreements: { ...prev.agreements, privacy: e.target.checked }
                      }))}
                    />
                    <span>
                      테스트 진행을 위한 개인정보 수집 및 기업 제공에 동의합니다
                      <button 
                        type="button"
                        className={styles.detailToggle}
                        onClick={(e) => {
                          e.preventDefault();
                          setAgreementDetails(prev => ({ ...prev, privacy: !prev.privacy }));
                        }}
                      >
                        <span>자세히</span>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor"
                          className={`${styles.toggleIcon} ${agreementDetails.privacy ? styles.open : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </span>
                  </label>
                  {agreementDetails.privacy && (
                    <div className={styles.detailContent}>
                      <h4>1. 수집항목</h4>
                      <p>필수: 이메일, 닉네임, 보유기기 정보, 테스트 경험</p>
                      <h4>2. 수집목적</h4>
                      <p>테스터 선발, 테스트 진행 및 커뮤니케이션</p>
                      <h4>3. 보유기간</h4>
                      <p>테스트 종료 후 1년 (법령에 따른 보관 의무 있을 시 해당 기간)</p>
                    </div>
                  )}
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.agreements.nda}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        agreements: { ...prev.agreements, nda: e.target.checked }
                      }))}
                    />
                    <span>
                      테스트 내용에 대한 비밀유지 의무를 준수하겠습니다
                      <button 
                        type="button"
                        className={styles.detailToggle}
                        onClick={(e) => {
                          e.preventDefault();
                          setAgreementDetails(prev => ({ ...prev, nda: !prev.nda }));
                        }}
                      >
                        <span>자세히</span>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor"
                          className={`${styles.toggleIcon} ${agreementDetails.nda ? styles.open : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </span>
                  </label>
                  {agreementDetails.nda && (
                    <div className={styles.detailContent}>
                      <p><strong>비밀유지 대상:</strong></p>
                      <ul>
                        <li>테스트 중 알게 된 앱/서비스의 기능, UI/UX 디자인</li>
                        <li>미공개 콘텐츠 및 비즈니스 정보</li>
                        <li>발견한 버그 및 취약점 정보</li>
                        <li>기타 테스트 과정에서 얻은 모든 정보</li>
                      </ul>
                      <p className={styles.warning}>⚠️ 위반 시 법적 책임을 질 수 있습니다.</p>
                    </div>
                  )}
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.agreements.participation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        agreements: { ...prev.agreements, participation: e.target.checked }
                      }))}
                    />
                    <span>
                      성실한 테스트 참여 및 상세한 버그 리포트 작성에 동의합니다
                      <button 
                        type="button"
                        className={styles.detailToggle}
                        onClick={(e) => {
                          e.preventDefault();
                          setAgreementDetails(prev => ({ ...prev, participation: !prev.participation }));
                        }}
                      >
                        <span>자세히</span>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor"
                          className={`${styles.toggleIcon} ${agreementDetails.participation ? styles.open : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </span>
                  </label>
                  {agreementDetails.participation && (
                    <div className={styles.detailContent}>
                      <p><strong>테스터의 의무:</strong></p>
                      <ul>
                        <li>테스트 가이드라인에 따른 성실한 테스트 수행</li>
                        <li>발견한 버그에 대한 상세하고 명확한 리포트 작성</li>
                        <li>테스트 기간 내 적극적인 참여</li>
                      </ul>
                      <p className={styles.warning}>⚠️ 불성실한 참여 또는 허위 리포트 작성 시 보상이 지급되지 않을 수 있습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalCancel}
                onClick={() => setShowApplyModal(false)}
              >
                취소
              </button>
              <button 
                className={styles.modalSubmit}
                onClick={() => {
                  // Validation
                  if (formData.devices.length === 0) {
                    alert('보유하신 기기를 선택해주세요.');
                    return;
                  }
                  if (!formData.experience) {
                    alert('테스트 경험을 선택해주세요.');
                    return;
                  }
                  if (!formData.availability) {
                    alert('참여 가능 여부를 선택해주세요.');
                    return;
                  }
                  if (!formData.agreements.privacy || !formData.agreements.nda || !formData.agreements.participation) {
                    alert('모든 동의사항에 체크해주세요.');
                    return;
                  }
                  
                  // Submit
                  console.log('Tester application submitted:', formData);
                  alert('지원이 완료되었습니다. 검토 후 연락드리겠습니다.');
                  
                  // Reset form and close modal
                  setFormData({
                    devices: [],
                    experience: '',
                    availability: '',
                    introduction: '',
                    agreements: {
                      privacy: false,
                      nda: false,
                      participation: false
                    }
                  });
                  setShowApplyModal(false);
                }}
              >
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}