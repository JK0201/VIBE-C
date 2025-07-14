import styles from './AdminBadge.module.css';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'default';

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function AdminBadge({ 
  children, 
  variant = 'default',
  className 
}: AdminBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className || ''}`}>
      {children}
    </span>
  );
}

// Preset badge components for common use cases
export const StatusBadge = {
  // General statuses
  open: () => <AdminBadge variant="primary">진행 중</AdminBadge>,
  completed: () => <AdminBadge variant="success">완료</AdminBadge>,
  closed: () => <AdminBadge variant="secondary">종료</AdminBadge>,
  pending: () => <AdminBadge variant="warning">대기 중</AdminBadge>,
  approved: () => <AdminBadge variant="success">승인됨</AdminBadge>,
  rejected: () => <AdminBadge variant="danger">거부됨</AdminBadge>,
  
  // User roles
  admin: () => <AdminBadge variant="danger">관리자</AdminBadge>,
  developer: () => <AdminBadge variant="primary">개발자</AdminBadge>,
  user: () => <AdminBadge variant="secondary">사용자</AdminBadge>,
  
  // Request types
  fixedPrice: () => <AdminBadge variant="info">고정가격</AdminBadge>,
  auction: () => <AdminBadge variant="warning">경매</AdminBadge>,
  
  // Test types
  functional: () => <AdminBadge variant="primary">기능</AdminBadge>,
  ui: () => <AdminBadge variant="info">UI/UX</AdminBadge>,
  performance: () => <AdminBadge variant="warning">성능</AdminBadge>,
  security: () => <AdminBadge variant="danger">보안</AdminBadge>,
  
  // Transaction statuses
  failed: () => <AdminBadge variant="danger">실패</AdminBadge>,
  refunded: () => <AdminBadge variant="warning">환불됨</AdminBadge>,
};