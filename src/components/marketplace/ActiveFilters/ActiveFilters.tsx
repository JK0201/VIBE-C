import styles from './ActiveFilters.module.css';

interface FiltersState {
  priceRange: string[];
  language: string[];
  rating: number | null;
}

interface ActiveFiltersProps {
  filters: FiltersState;
  onRemoveFilter: (type: keyof FiltersState, value?: string | number) => void;
  onClearAll: () => void;
}

const priceRangeLabels: { [key: string]: string } = {
  '0-0': '무료',
  '1-50000': '~50,000P',
  '50001-100000': '50,000~100,000P',
  '100001-999999': '100,000P~',
};

const languageLabels: { [key: string]: string } = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'go': 'Go',
  'ruby': 'Ruby',
  'php': 'PHP',
  'csharp': 'C#',
};

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: keyof FiltersState; value: string | number; label: string }[] = [];

  // Collect all active filters
  filters.priceRange.forEach(range => {
    activeFilters.push({
      type: 'priceRange',
      value: range,
      label: priceRangeLabels[range] || range,
    });
  });

  filters.language.forEach(lang => {
    activeFilters.push({
      type: 'language',
      value: lang,
      label: languageLabels[lang] || lang,
    });
  });

  if (filters.rating !== null) {
    activeFilters.push({
      type: 'rating',
      value: filters.rating,
      label: filters.rating === 4 ? '⭐ 4점 이상' : `⭐ ${filters.rating}점대`,
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