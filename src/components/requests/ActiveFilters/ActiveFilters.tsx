import styles from './ActiveFilters.module.css';

interface FiltersState {
  budgetRange: string[];
  requestType: string[];
  isUrgent: boolean | null;
  status: string[];
}

interface ActiveFiltersProps {
  filters: FiltersState;
  onRemoveFilter: (type: keyof FiltersState, value?: string) => void;
  onClearAll: () => void;
}

const budgetRangeLabels: { [key: string]: string } = {
  '0-50000': '~50,000P',
  '50001-100000': '50,000~100,000P',
  '100001-200000': '100,000~200,000P',
  '200001-999999': '200,000P~',
};

const requestTypeLabels: { [key: string]: string } = {
  'fixed': '고정가',
  'auction': '경매',
};

const statusLabels: { [key: string]: string } = {
  'open': '모집중',
  'completed': '완료',
};

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: keyof FiltersState; value: string; label: string }[] = [];

  // Collect all active filters
  filters.budgetRange.forEach(range => {
    activeFilters.push({
      type: 'budgetRange',
      value: range,
      label: budgetRangeLabels[range] || range,
    });
  });

  filters.requestType.forEach(type => {
    activeFilters.push({
      type: 'requestType',
      value: type,
      label: requestTypeLabels[type] || type,
    });
  });

  filters.status.forEach(status => {
    activeFilters.push({
      type: 'status',
      value: status,
      label: statusLabels[status] || status,
    });
  });

  if (filters.isUrgent) {
    activeFilters.push({
      type: 'isUrgent',
      value: 'true',
      label: '긴급 요청',
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      <div className={styles.filterTags}>
        {activeFilters.map((filter, index) => (
          <div key={`${filter.type}-${filter.value}-${index}`} className={styles.filterTag}>
            <span className={styles.tagLabel}>{filter.label}</span>
            <button
              className={styles.removeBtn}
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              aria-label={`${filter.label} 필터 제거`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button className={styles.clearAllBtn} onClick={onClearAll}>
        전체 초기화
      </button>
    </div>
  );
}