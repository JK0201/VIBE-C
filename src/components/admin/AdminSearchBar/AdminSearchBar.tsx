import { KeyboardEvent } from 'react';
import styles from './AdminSearchBar.module.css';
import { SearchBarProps } from '@/types/admin';

interface AdminSearchBarProps extends SearchBarProps {
  className?: string;
  onRefresh?: () => void;
}

export default function AdminSearchBar({
  placeholder = "검색...",
  value,
  onChange,
  onSearch,
  onRefresh,
  className
}: AdminSearchBarProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`${styles.searchWrapper} ${className || ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className={styles.searchButton}
        onClick={onSearch}
        type="button"
        aria-label="검색"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
      {onRefresh && (
        <button 
          className={styles.refreshButton}
          onClick={onRefresh}
          type="button"
          aria-label="새로고침"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}