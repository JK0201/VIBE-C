import styles from './RequestsFilter.module.css';

interface FiltersState {
  budgetRange: string[];
  requestType: string[];
  isUrgent: boolean | null;
  status: string[];
}

interface RequestsFilterProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  totalCount?: number;
}

const budgetRanges = [
  { id: 'low', label: '~50,000P', value: '0-50000' },
  { id: 'medium', label: '50,000~100,000P', value: '50001-100000' },
  { id: 'high', label: '100,000~200,000P', value: '100001-200000' },
  { id: 'premium', label: '200,000P~', value: '200001-999999' },
];

const requestTypes = [
  { id: 'fixed', label: '고정가' },
  { id: 'auction', label: '경매' },
];

const statuses = [
  { id: 'open', label: '모집중' },
  { id: 'completed', label: '완료' },
];


export default function RequestsFilter({ filters, onFiltersChange, totalCount }: RequestsFilterProps) {
  const handleBudgetChange = (value: string, checked: boolean) => {
    const newBudgetRange = checked
      ? [...filters.budgetRange, value]
      : filters.budgetRange.filter(range => range !== value);
    
    onFiltersChange({ ...filters, budgetRange: newBudgetRange });
  };


  const handleTypeChange = (value: string, checked: boolean) => {
    const newType = checked
      ? [...filters.requestType, value]
      : filters.requestType.filter(type => type !== value);
    
    onFiltersChange({ ...filters, requestType: newType });
  };

  const handleStatusChange = (value: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, value]
      : filters.status.filter(status => status !== value);
    
    onFiltersChange({ ...filters, status: newStatus });
  };


  const handleUrgentChange = (checked: boolean) => {
    onFiltersChange({ 
      ...filters, 
      isUrgent: checked ? true : null 
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      budgetRange: [],
      requestType: [],
      isUrgent: null,
      status: []
    });
  };

  const hasActiveFilters = 
    filters.budgetRange.length > 0 ||
    filters.requestType.length > 0 ||
    filters.isUrgent !== null ||
    filters.status.length > 0;

  return (
    <aside className={styles.filterSidebar}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>필터</h3>
        {totalCount !== undefined && (
          <span className={styles.totalCount}>{totalCount}개</span>
        )}
        <button 
          className={styles.resetBtn}
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          초기화
        </button>
      </div>

      <div className={styles.urgentSection}>
        <label className={styles.urgentLabel}>
          <input
            type="checkbox"
            className={styles.hiddenCheckbox}
            checked={filters.isUrgent === true}
            onChange={(e) => handleUrgentChange(e.target.checked)}
          />
          <span className={styles.urgentCustomCheckbox}>
            {filters.isUrgent === true && (
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          <span className={styles.urgentText}>
            <span className={styles.urgentIcon}>🔥</span>
            긴급 요청
          </span>
        </label>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>가격 범위</h4>
        <div className={styles.filterOptions}>
          {budgetRanges.map((range) => (
            <label key={range.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.budgetRange.includes(range.value)}
                onChange={(e) => handleBudgetChange(range.value, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.budgetRange.includes(range.value) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.checkboxLabel}>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>요청 타입</h4>
        <div className={styles.filterOptions}>
          {requestTypes.map((type) => (
            <label key={type.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.requestType.includes(type.id)}
                onChange={(e) => handleTypeChange(type.id, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.requestType.includes(type.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.checkboxLabel}>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>상태</h4>
        <div className={styles.filterOptions}>
          {statuses.map((status) => (
            <label key={status.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.status.includes(status.id)}
                onChange={(e) => handleStatusChange(status.id, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.status.includes(status.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.checkboxLabel}>{status.label}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}