'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import MarketplaceHero from '@/components/marketplace/MarketplaceHero/MarketplaceHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import FilterSidebar from '@/components/marketplace/FilterSidebar/FilterSidebar';
import SearchControls from '@/components/marketplace/SearchControls/SearchControls';
import ModuleGrid from '@/components/marketplace/ModuleGrid/ModuleGrid';
import componentsData from '@data/mock/components.json';
import styles from './marketplace.module.css';

const ITEMS_PER_PAGE = 12;

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState<{
    priceRange: string[];
    language: string[];
    rating: number | null;
  }>({
    priceRange: [],
    language: [],
    rating: null
  });
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort components
  const filteredComponents = componentsData.components.filter(component => {
    // Category filter
    if (selectedCategory !== 'all' && component.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Price filter
    if (filters.priceRange.length > 0) {
      const matchesPrice = filters.priceRange.some(range => {
        const [min, max] = range.split('-').map(Number);
        return component.price >= min && component.price <= max;
      });
      if (!matchesPrice) return false;
    }

    // Language filter
    if (filters.language.length > 0) {
      const matchesLanguage = filters.language.some(lang => 
        component.tags.some(tag => tag.toLowerCase() === lang.toLowerCase())
      );
      if (!matchesLanguage) return false;
    }

    // Rating filter
    if (filters.rating !== null) {
      if (filters.rating === 4) {
        // 4점 이상: 4.0 ~ 5.0
        if (component.rating < 4) return false;
      } else {
        // 1,2,3점대: n.0 ~ n.9
        if (component.rating < filters.rating || component.rating >= filters.rating + 1) return false;
      }
    }


    return true;
  });

  // Sort components
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.purchases - a.purchases;
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const displayedComponents = sortedComponents.slice(0, displayedCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchQuery, sortBy, filters]);

  return (
    <div className={styles.page}>
      <Header />
      
      <MarketplaceHero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <FilterSidebar 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>
          
          <main className={styles.content}>
            <SearchControls 
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredComponents.length}
              displayedCount={displayedComponents.length}
            />
            
            <ModuleGrid components={displayedComponents} />
            
            {displayedComponents.length < filteredComponents.length && (
              <div className={styles.loadMoreSection}>
                <button 
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.loadingText}>로딩 중...</span>
                  ) : (
                    <>더 보기 ({filteredComponents.length - displayedComponents.length}개 남음)</>
                  )}
                </button>
                <p className={styles.countInfo}>
                  전체 {filteredComponents.length}개 중 {displayedComponents.length}개 표시
                </p>
              </div>
            )}

            {filteredComponents.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>조건에 맞는 모듈이 없습니다.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setFilters({
                      priceRange: [],
                      language: [],
                      rating: null
                    });
                  }}
                >
                  필터 초기화
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}