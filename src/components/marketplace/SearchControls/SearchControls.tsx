import styles from './SearchControls.module.css';

interface SearchControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  activeFilterCount?: number;
  onFilterClick?: () => void;
}

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
];

export default function SearchControls({ 
  sortBy, 
  onSortChange, 
  totalCount,
  activeFilterCount = 0,
  onFilterClick
}: SearchControlsProps) {
  return (
    <div className={styles.searchControls}>
      <div className={styles.resultInfo}>
        <span className={styles.totalCount}>전체 {totalCount}개</span>
      </div>
      
      <div className={styles.controlsRight}>
        <div className={styles.sortOptions}>
        <span className={styles.sortLabel}>정렬:</span>
        <div className={styles.sortButtons}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.sortBtn} ${
                sortBy === option.value ? styles.active : ''
              }`}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Mobile dropdown */}
        <select
          className={styles.sortDropdown}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        </div>
        
        {/* Mobile Filter Button */}
        {onFilterClick && (
          <button className={styles.filterBtn} onClick={onFilterClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}