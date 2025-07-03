import styles from './TestersFilter.module.css';

interface FiltersState {
  rewardRange: string[];
  testType: string[];
  isUrgent: boolean | null;
  requirements: string[];
}

interface TestersFilterProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  totalCount?: number;
}

const rewardRanges = [
  { id: 'low', label: '~30,000P', value: '0-30000' },
  { id: 'medium', label: '30,000~50,000P', value: '30001-50000' },
  { id: 'high', label: '50,000~100,000P', value: '50001-100000' },
  { id: 'premium', label: '100,000P~', value: '100001-999999' },
];

const testTypes = [
  { id: 'functional', label: '기능 테스트' },
  { id: 'ui', label: 'UI/UX 테스트' },
  { id: 'performance', label: '성능 테스트' },
  { id: 'security', label: '보안 테스트' },
];

const requirementOptions = [
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
];


export default function TestersFilter({ filters, onFiltersChange, totalCount }: TestersFilterProps) {
  const handleRewardChange = (value: string, checked: boolean) => {
    const newRewardRange = checked
      ? [...filters.rewardRange, value]
      : filters.rewardRange.filter(range => range !== value);
    
    onFiltersChange({ ...filters, rewardRange: newRewardRange });
  };


  const handleTypeChange = (value: string, checked: boolean) => {
    const newType = checked
      ? [...filters.testType, value]
      : filters.testType.filter(type => type !== value);
    
    onFiltersChange({ ...filters, testType: newType });
  };

  const handleRequirementChange = (value: string, checked: boolean) => {
    const newRequirements = checked
      ? [...filters.requirements, value]
      : filters.requirements.filter(req => req !== value);
    
    onFiltersChange({ ...filters, requirements: newRequirements });
  };


  const handleUrgentChange = (checked: boolean) => {
    onFiltersChange({ 
      ...filters, 
      isUrgent: checked ? true : null 
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      rewardRange: [],
      testType: [],
      isUrgent: null,
      requirements: []
    });
  };

  const hasActiveFilters = 
    filters.rewardRange.length > 0 ||
    filters.testType.length > 0 ||
    filters.isUrgent !== null ||
    filters.requirements.length > 0;

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
            긴급 모집
          </span>
        </label>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>보상 범위</h4>
        <div className={styles.filterOptions}>
          {rewardRanges.map((range) => (
            <label key={range.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.rewardRange.includes(range.value)}
                onChange={(e) => handleRewardChange(range.value, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.rewardRange.includes(range.value) && (
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
        <h4 className={styles.sectionTitle}>테스트 유형</h4>
        <div className={styles.filterOptions}>
          {testTypes.map((type) => (
            <label key={type.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.testType.includes(type.id)}
                onChange={(e) => handleTypeChange(type.id, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.testType.includes(type.id) && (
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
        <h4 className={styles.sectionTitle}>필요 환경</h4>
        <div className={styles.filterOptions}>
          {requirementOptions.map((req) => (
            <label key={req.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.requirements.includes(req.id)}
                onChange={(e) => handleRequirementChange(req.id, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.requirements.includes(req.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.checkboxLabel}>{req.label}</span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}