import styles from './ActiveFilters.module.css';

interface FiltersState {
  rewardRange: string[];
  testType: string[];
  isUrgent: boolean | null;
  requirements: string[];
  status: string[];
}

interface ActiveFiltersProps {
  filters: FiltersState;
  onRemoveFilter: (type: keyof FiltersState, value?: string | boolean) => void;
  onClearAll: () => void;
}

const rewardRangeLabels: { [key: string]: string } = {
  '0-30000': '~30,000P',
  '30001-50000': '30,000~50,000P',
  '50001-100000': '50,000~100,000P',
  '100001-999999': '100,000P~',
};

const testTypeLabels: { [key: string]: string } = {
  'functional': '기능 테스트',
  'ui-ux': 'UI/UX 테스트',
  'performance': '성능 테스트',
  'security': '보안 테스트',
};

const requirementLabels: { [key: string]: string } = {
  'iOS': 'iOS',
  'Android': 'Android',
  'Windows': 'Windows',
  'macOS': 'macOS',
};

const statusLabels: { [key: string]: string } = {
  'open': '모집중',
  'completed': '완료',
};

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: keyof FiltersState; value: string | boolean; label: string }[] = [];

  // Collect all active filters
  filters.rewardRange.forEach(range => {
    activeFilters.push({
      type: 'rewardRange',
      value: range,
      label: rewardRangeLabels[range] || range,
    });
  });

  filters.testType.forEach(type => {
    activeFilters.push({
      type: 'testType',
      value: type,
      label: testTypeLabels[type] || type,
    });
  });

  filters.requirements.forEach(req => {
    activeFilters.push({
      type: 'requirements',
      value: req,
      label: requirementLabels[req] || req,
    });
  });

  filters.status.forEach(status => {
    activeFilters.push({
      type: 'status',
      value: status,
      label: statusLabels[status] || status,
    });
  });

  if (filters.isUrgent === true) {
    activeFilters.push({
      type: 'isUrgent',
      value: true,
      label: '🔥 긴급 모집',
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