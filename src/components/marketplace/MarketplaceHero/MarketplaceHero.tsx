'use client';

import { useState, useEffect } from 'react';
import styles from './MarketplaceHero.module.css';

interface MarketplaceHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MarketplaceHero({ searchQuery, onSearchChange }: MarketplaceHeroProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sync internal state with external search query
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    onSearchChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };
  return (
    <section className={styles.hero}>
      <div className={styles.heroPattern}>
        <div className={styles.patternCircle}></div>
        <div className={styles.patternCircle}></div>
        <div className={styles.patternCircle}></div>
      </div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          검증된 개발 모듈을 찾아보세요
        </h1>
        <p className={styles.heroSubtitle}>
          8개 카테고리, 1000+ 모듈로 개발 시간을 단축하세요
        </p>
        
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <svg 
              className={styles.searchIcon} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="모듈명, 태그, 설명으로 검색..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {inputValue && (
              <button 
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label="검색어 지우기"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button 
            className={styles.searchButton}
            onClick={handleSearch}
          >
            검색
          </button>
          <div className={styles.popularTags}>
            <span className={styles.tagLabel}>인기 태그:</span>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('React')}
            >
              React
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('Python')}
            >
              Python
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('AI')}
            >
              AI
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('API')}
            >
              API
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}