'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RequestsHero from '@/components/requests/RequestsHero/RequestsHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import RequestsFilter from '@/components/requests/RequestsFilter/RequestsFilter';
import RequestsSearchControls from '@/components/requests/RequestsSearchControls/RequestsSearchControls';
import RequestsList from '@/components/requests/RequestsList/RequestsList';
import requestsData from '@data/mock/requests.json';
import styles from './requests.module.css';

const ITEMS_PER_PAGE = 12;

export default function RequestsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState<{
    budgetRange: string[];
    requestType: string[];
    isUrgent: boolean | null;
    status: string[];
  }>({
    budgetRange: [],
    requestType: [],
    isUrgent: null,
    status: []
  });
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort requests
  const filteredRequests = requestsData.requests.filter(request => {
    // Category filter
    if (selectedCategory !== 'all' && request.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        request.title.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Budget filter
    if (filters.budgetRange.length > 0) {
      const matchesBudget = filters.budgetRange.some(range => {
        const [min, max] = range.split('-').map(Number);
        if (request.budget === null) return false;
        return request.budget >= min && request.budget <= max;
      });
      if (!matchesBudget) return false;
    }

    // Urgent filter (AND condition)
    if (filters.isUrgent === true && !request.isUrgent) {
      return false;
    }

    // Request type filter
    if (filters.requestType.length > 0) {
      const hasType = filters.requestType.some(type => {
        if (type === 'fixed' && request.type === 'FIXED_PRICE') return true;
        if (type === 'auction' && request.type === 'AUCTION') return true;
        return false;
      });
      if (!hasType) return false;
    }

    // Status filter
    if (filters.status.length > 0) {
      const matchesStatus = filters.status.some(status => {
        if (status === 'open' && request.status === 'OPEN') return true;
        if (status === 'completed' && request.status === 'COMPLETED') return true;
        return false;
      });
      if (!matchesStatus) return false;
    }


    return true;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'price-high':
        return (b.budget || 0) - (a.budget || 0);
      case 'price-low':
        return (a.budget || 0) - (b.budget || 0);
      default:
        return 0;
    }
  });

  const displayedRequests = sortedRequests.slice(0, displayedCount);

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
      
      <RequestsHero 
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
            <RequestsFilter 
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={filteredRequests.length}
            />
          </aside>
          
          <main className={styles.content}>
            <RequestsSearchControls 
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredRequests.length}
              displayedCount={displayedRequests.length}
            />
            
            <RequestsList requests={displayedRequests} />
            
            {displayedRequests.length < filteredRequests.length && (
              <div className={styles.loadMoreSection}>
                <button 
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.loadingText}>로딩 중...</span>
                  ) : (
                    <>더 보기 ({filteredRequests.length - displayedRequests.length}개 남음)</>
                  )}
                </button>
                <p className={styles.countInfo}>
                  전체 {filteredRequests.length}개 중 {displayedRequests.length}개 표시
                </p>
              </div>
            )}

            {filteredRequests.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>조건에 맞는 요청이 없습니다.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setFilters({
                      budgetRange: [],
                      requestType: [],
                      isUrgent: null,
                      status: []
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