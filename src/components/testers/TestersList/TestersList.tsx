import Link from 'next/link';
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
  const getStatusText = (status: string, applicants: number, required: number, deadline: string) => {
    // 마감일이 지났거나 COMPLETED 상태면 '완료'만 표시
    if (isExpired(deadline) || status === 'COMPLETED') {
      return '완료';
    }
    
    switch (status) {
      case 'OPEN': 
        // 모집 인원이 다 찼어도 완료
        if (applicants >= required) return '완료';
        return `모집중 ${applicants}/${required}`;
      case 'IN_PROGRESS': return '진행중';
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
  
  // 마감 여부 확인
  const isExpired = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate.getTime() < now.getTime();
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

  // 테스트 타입에 따른 아이콘 반환
  const getTestTypeIcon = (types: string[]) => {
    const iconMap: Record<string, string> = {
      'functional': '🧪',
      'ui': '🎨',
      'performance': '⚡',
      'security': '🔒'
    };
    // 첫 번째 타입의 아이콘 반환
    return iconMap[types[0]] || '🧪';
  };

  // 테스트 타입에 따른 그라디언트 반환
  const getTestTypeGradient = (types: string[]) => {
    const gradientMap: Record<string, string> = {
      'functional': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      'ui': 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      'performance': 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      'security': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    };
    // 첫 번째 타입의 그라디언트 반환
    return gradientMap[types[0]] || 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)';
  };

  return (
    <div className={styles.testersList}>
      {testers.map((tester) => (
        <Link key={tester.id} href={`/testers/${tester.id}`} className={styles.testerItem}>
          <div className={styles.testerBadges}>
            {tester.isUrgent && (
              <span className={styles.urgentBadge}>긴급</span>
            )}
            <span className={styles.typeBadge}>{getTestTypeText(tester.testType)}</span>
            {tester.status !== 'COMPLETED' && !isExpired(tester.deadline) && (
              <span className={`${styles.statusBadge} ${styles[`status${tester.status}`]}`}>
                {getStatusText(tester.status, tester.applicants, tester.requiredTesters, tester.deadline)}
              </span>
            )}
          </div>
          <h3 className={styles.testerTitle}>{tester.title}</h3>
          <p className={styles.testerCompany}>{tester.company}</p>
          <div className={styles.testerImage}>
            <div className={styles.imagePlaceholder} style={{ background: getTestTypeGradient(tester.testType) }}>
              <span className={styles.imageIcon}>{getTestTypeIcon(tester.testType)}</span>
            </div>
          </div>
          <p className={styles.testerDesc}>{tester.description}</p>
          <div className={styles.testerMeta}>
            <span className={styles.testerDuration}>테스트 기간: {getDurationText(tester.duration)}</span>
            <span className={styles.testerReward}>{tester.reward.toLocaleString()}P</span>
            <span className={styles.testerDeadline}>
              {getDeadlineText(tester.deadline)}
            </span>
          </div>
          <div className={styles.testerRequirements}>
            <span className={styles.requirementsLabel}>필요:</span>
            <span className={styles.requirementsList}>{getRequirementsText(tester.requirements)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}