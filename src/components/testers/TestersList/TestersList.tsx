import styles from './TestersList.module.css';

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

interface TestersListProps {
  testers: Tester[];
}

export default function TestersList({ testers }: TestersListProps) {

  // 상태에 따른 표시 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return '모집중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      default: return status;
    }
  };

  // 테스트 타입에 따른 표시 텍스트
  const getTestTypeText = (types: string[]) => {
    const typeMap: Record<string, string> = {
      'functional': '기능',
      'ui': 'UI/UX',
      'performance': '성능',
      'security': '보안'
    };
    return types.map(type => typeMap[type] || type).join(', ');
  };

  // 마감일 계산
  const getDeadlineText = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) return '마감';
    if (diffHours < 24) return `${diffHours}시간 남음`;
    if (diffDays < 7) return `${diffDays}일 남음`;
    return deadlineDate.toLocaleDateString('ko-KR');
  };

  // 테스트 기간 표시
  const getDurationText = (duration: string) => {
    const durationMap: Record<string, string> = {
      '3days': '3일',
      '1week': '1주일',
      '2weeks': '2주일',
      '1month': '1개월'
    };
    return durationMap[duration] || duration;
  };

  // 필요 환경 표시
  const getRequirementsText = (requirements: string[]) => {
    return requirements.join(', ');
  };

  return (
    <div className={styles.testersList}>
      {testers.map((tester) => (
        <div key={tester.id} className={styles.testerItem}>
          <div className={styles.testerBadges}>
            {tester.isUrgent && (
              <span className={styles.urgentBadge}>긴급</span>
            )}
            <span className={styles.typeBadge}>{getTestTypeText(tester.testType)}</span>
            <span className={`${styles.statusBadge} ${styles[`status${tester.status}`]}`}>
              {getStatusText(tester.status)}
            </span>
          </div>
          <h3 className={styles.testerTitle}>{tester.title}</h3>
          <p className={styles.testerCompany}>{tester.company}</p>
          <p className={styles.testerDesc}>{tester.description}</p>
          <div className={styles.testerMeta}>
            <span className={styles.testerDuration}>테스트 기간: {getDurationText(tester.duration)}</span>
            <span className={styles.testerReward}>{tester.reward.toLocaleString()}P/명</span>
            <span className={styles.testerApplicants}>
              {tester.applicants}/{tester.requiredTesters}명 지원
            </span>
            <span className={styles.testerDeadline}>
              {getDeadlineText(tester.deadline)}
            </span>
          </div>
          <div className={styles.testerRequirements}>
            <span className={styles.requirementsLabel}>필요:</span>
            <span className={styles.requirementsList}>{getRequirementsText(tester.requirements)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}