import styles from './SearchControls.module.css';

interface SearchControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
  displayedCount: number;
}

const sortOptions = [
  { value: 'popular', label: '인기순' },
  { value: 'latest', label: '최신순' },
  { value: 'price-low', label: '가격 낮은순' },
  { value: 'price-high', label: '가격 높은순' },
  { value: 'rating', label: '평점순' },
];

export default function SearchControls({ 
  sortBy, 
  onSortChange, 
  totalCount, 
  displayedCount 
}: SearchControlsProps) {
  return (
    <div className={styles.searchControls}>
      <div className={styles.resultInfo}>
        <span className={styles.totalCount}>전체 {totalCount}개</span>
        {displayedCount < totalCount && (
          <span className={styles.displayedCount}>
            ({displayedCount}개 표시 중)
          </span>
        )}
      </div>
      
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
    </div>
  );
}