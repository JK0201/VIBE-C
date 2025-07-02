import styles from './FilterSidebar.module.css';

interface FiltersState {
  priceRange: string[];
  language: string[];
  rating: number | null;
}

interface FilterSidebarProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  totalCount: number;
}

const priceRanges = [
  { id: 'free', label: '무료', value: '0-0' },
  { id: 'low', label: '~50,000P', value: '1-50000' },
  { id: 'medium', label: '50,000~100,000P', value: '50001-100000' },
  { id: 'high', label: '100,000P~', value: '100001-999999' },
];


const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'php', label: 'PHP' },
  { id: 'csharp', label: 'C#' },
];

export default function FilterSidebar({ filters, onFiltersChange, totalCount }: FilterSidebarProps) {
  const handlePriceChange = (value: string, checked: boolean) => {
    const newPriceRange = checked
      ? [...filters.priceRange, value]
      : filters.priceRange.filter(range => range !== value);
    
    onFiltersChange({ ...filters, priceRange: newPriceRange });
  };


  const handleLanguageChange = (value: string, checked: boolean) => {
    const newLanguage = checked
      ? [...filters.language, value]
      : filters.language.filter(lang => lang !== value);
    
    onFiltersChange({ ...filters, language: newLanguage });
  };

  const handleRatingChange = (rating: number) => {
    const newRating = filters.rating === rating ? null : rating;
    onFiltersChange({ 
      ...filters, 
      rating: newRating
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [],
      language: [],
      rating: null
    });
  };

  const hasActiveFilters = 
    filters.priceRange.length > 0 ||
    filters.language.length > 0 ||
    filters.rating !== null;

  return (
    <aside className={styles.filterSidebar}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>필터</h3>
        <button 
          className={styles.resetBtn}
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          초기화
        </button>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>가격대</h4>
        <div className={styles.filterOptions}>
          {priceRanges.map((range) => (
            <label key={range.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.priceRange.includes(range.value)}
                onChange={(e) => handlePriceChange(range.value, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.priceRange.includes(range.value) && (
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
        <h4 className={styles.sectionTitle}>프로그래밍 언어</h4>
        <div className={styles.filterOptions}>
          {languages.map((lang) => (
            <label key={lang.id} className={styles.filterOption}>
              <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={filters.language.includes(lang.id)}
                onChange={(e) => handleLanguageChange(lang.id, e.target.checked)}
              />
              <span className={styles.customCheckbox}>
                {filters.language.includes(lang.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={styles.checkboxLabel}>{lang.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>평점</h4>
        <div className={styles.ratingOptions}>
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`${styles.ratingOption} ${
                filters.rating === rating ? styles.active : ''
              }`}
              onClick={() => handleRatingChange(rating)}
            >
              <span className={styles.stars}>
                {'⭐'.repeat(rating)}
              </span>
              <span className={styles.ratingText}>
                {rating === 4 ? '4점 이상' : `${rating}점대`}
              </span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}