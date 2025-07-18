import Link from 'next/link';
import styles from './RequestsList.module.css';

interface Request {
  id: number;
  userId?: number;
  title: string;
  description: string;
  type: string;
  budget: number | null;
  isUrgent: boolean;
  status: string;
  category: string;
  deadline: string;
  createdAt: string;
  assignedTo?: number;
  completedAt?: string;
  bids?: Array<{
    id: number;
    userId: number;
    requestId: number;
    amount: number;
    message: string;
    createdAt: string;
  }>;
  applications?: Array<{
    id: number;
    userId: number;
    requestId: number;
    message: string;
    createdAt: string;
  }>;
}

interface RequestsListProps {
  requests: Request[];
}

export default function RequestsList({ requests }: RequestsListProps) {

  // 상태에 따른 표시 텍스트
  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return '모집중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      default: return status;
    }
  };

  // 요청 타입에 따른 표시 텍스트
  const getTypeText = (type: string) => {
    switch (type) {
      case 'FIXED_PRICE': return '고정가';
      case 'AUCTION': return '경매';
      default: return type;
    }
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

  // 카테고리 매핑
  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      // New category system
      'sns': 'SNS',
      'automation': 'Automation',
      'web-app': 'Web/App',
      'mobile': 'Mobile',
      'ui-ux': 'UI/UX',
      'data': 'Data',
      'ai-ml': 'AI/ML',
      'fintech': 'Fintech',
      'b2b': 'B2B',
      // Old category system (for backward compatibility)
      'website': 'Web/App',
      'ecommerce': 'Web/App',
      'ai': 'AI/ML',
      'backend': 'B2B',
      'blockchain': 'Fintech',
      'devops': 'Automation'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className={styles.requestsList}>
      {requests.map((request) => (
        <Link key={request.id} href={`/requests/${request.id}`} className={styles.requestItem}>
          <div className={styles.requestBadges}>
            {request.isUrgent && (
              <span className={styles.urgentBadge}>긴급</span>
            )}
            <span className={styles.categoryBadge}>{getCategoryText(request.category)}</span>
            {request.status !== 'COMPLETED' && !isExpired(request.deadline) && (
              <span className={`${styles.statusBadge} ${styles[`status${request.status}`]}`}>
                {getStatusText(request.status)}
              </span>
            )}
          </div>
          <h3 className={styles.requestTitle}>{request.title}</h3>
          <p className={styles.requestDesc}>{request.description}</p>
          <div className={styles.requestMeta}>
            <span className={styles.requestType}>{getTypeText(request.type)}</span>
            {request.budget ? (
              <span className={styles.requestBudget}>{request.budget.toLocaleString()}P</span>
            ) : (
              <span className={styles.requestBids}>
                입찰 {request.bids?.length || 0}건
              </span>
            )}
            <span className={styles.requestDeadline}>
              {getDeadlineText(request.deadline)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}