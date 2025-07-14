import styles from './AdminPagination.module.css';
import { PaginationProps } from '@/types/admin';

interface AdminPaginationProps extends PaginationProps {
  className?: string;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: AdminPaginationProps) {
  return (
    <div className={`${styles.pagination} ${className || ''}`}>
      <button
        className={styles.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>
      
      <span className={styles.pageInfo}>
        {currentPage} / {totalPages}
      </span>
      
      <button
        className={styles.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
}