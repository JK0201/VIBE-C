'use client';

import { useState, useEffect } from 'react';
import styles from './RequestsHero.module.css';

interface RequestsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function RequestsHero({ searchQuery, onSearchChange }: RequestsHeroProps) {
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
          개발 요청을 찾아보세요
        </h1>
        <p className={styles.heroSubtitle}>
          다양한 개발 요청을 확인하고 지원해보세요
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
              placeholder="요청 제목, 카테고리, 설명으로 검색..."
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
            <span className={styles.tagLabel}>인기 카테고리:</span>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('웹사이트')}
            >
              웹사이트
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('모바일')}
            >
              모바일 앱
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('AI')}
            >
              AI/ML
            </button>
            <button 
              className={styles.popularTag}
              onClick={() => onSearchChange('백엔드')}
            >
              백엔드/API
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}