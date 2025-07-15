'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useFilterStore from '@/stores/useFilterStore';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RequestsHero from '@/components/requests/RequestsHero/RequestsHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import RequestsFilter from '@/components/requests/RequestsFilter/RequestsFilter';
import RequestsSearchControls from '@/components/requests/RequestsSearchControls/RequestsSearchControls';
import RequestsList from '@/components/requests/RequestsList/RequestsList';
import ActiveFilters from '@/components/requests/ActiveFilters/ActiveFilters';
import styles from './requests.module.css';

const ITEMS_PER_PAGE = 12;

interface Request {
  id: number;
  title: string;
  description: string;
  type: string;
  budget: number | null;
  category: string;
  isUrgent: boolean;
  deadline: string;
  status: string;
  createdAt: string;
  applicationCount: number;
  bidCount: number;
  author?: {
    id: number;
    name: string;
    profileImage: string;
  };
  categoryDisplay: {
    name: string;
    color: string;
  };
  deadlineDisplay: string;
  isExpired: boolean;
}

function RequestsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  // Zustand store에서 필터 상태 가져오기
  const { requestFilters, setRequestFilters } = useFilterStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setRequestFilters({ category: categoryFromUrl });
    }
  }, [categoryFromUrl, setRequestFilters]);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (requestFilters.category && requestFilters.category !== 'all') {
          params.append('category', requestFilters.category);
        }
        if (requestFilters.searchQuery) params.append('search', requestFilters.searchQuery);
        params.append('sort', requestFilters.sortBy || 'latest');
        requestFilters.budgetRange?.forEach(range => params.append('budgetRange', range));
        requestFilters.requestType?.forEach(type => params.append('requestType', type));
        if (requestFilters.isUrgent !== null && requestFilters.isUrgent !== undefined) {
          params.append('isUrgent', String(requestFilters.isUrgent));
        }
        requestFilters.status?.forEach(s => params.append('status', s));
        params.append('page', String(currentPage));
        params.append('limit', String(ITEMS_PER_PAGE));
        
        const response = await fetch(`/api/v1/requests?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        
        const data = await response.json();
        if (data.success) {
          if (currentPage === 1) {
            setRequests(data.data);
          } else {
            setRequests(prev => [...prev, ...data.data]);
          }
          setTotalRequests(data.meta.total);
          setTotalPages(data.meta.totalPages);
        } else {
          throw new Error(data.error || 'Failed to fetch requests');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [requestFilters, currentPage]);


  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [requestFilters]);

  // Calculate active filter count
  const activeFilterCount = 
    (requestFilters.budgetRange?.length || 0) +
    (requestFilters.requestType?.length || 0) +
    (requestFilters.isUrgent ? 1 : 0) +
    (requestFilters.status?.length || 0);

  // Handle removing individual filters
  const handleRemoveFilter = (type: keyof typeof requestFilters, value?: string) => {
    if (type === 'isUrgent') {
      setRequestFilters({ isUrgent: null });
    } else if (type === 'budgetRange' || type === 'requestType' || type === 'status') {
      const currentValues = requestFilters[type] || [];
      const newValues = currentValues.filter(v => v !== value);
      setRequestFilters({ [type]: newValues });
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      
      <RequestsHero 
        searchQuery={requestFilters.searchQuery || ''}
        onSearchChange={(query) => setRequestFilters({ searchQuery: query })}
      />
      
      <CategoryFilter 
        selectedCategory={requestFilters.category || 'all'}
        onCategoryChange={(category) => setRequestFilters({ category })}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <RequestsFilter 
              filters={{
                budgetRange: requestFilters.budgetRange || [],
                requestType: requestFilters.requestType || [],
                isUrgent: requestFilters.isUrgent || null,
                status: requestFilters.status || []
              }}
              onFiltersChange={(newFilters) => setRequestFilters(newFilters)}
              totalCount={totalRequests}
            />
          </aside>
          
          <main className={styles.content}>
            <RequestsSearchControls 
              sortBy={requestFilters.sortBy || 'latest'}
              onSortChange={(sort) => setRequestFilters({ sortBy: sort as 'latest' | 'budget' | 'bidCount' | 'deadline' })}
              totalCount={totalRequests}
              activeFilterCount={activeFilterCount}
              onFilterClick={() => setIsFilterOpen(true)}
            />
            
            {activeFilterCount > 0 && (
              <ActiveFilters
                filters={{
                  budgetRange: requestFilters.budgetRange || [],
                  requestType: requestFilters.requestType || [],
                  isUrgent: requestFilters.isUrgent || null,
                  status: requestFilters.status || []
                }}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={() => {
                  const { resetRequestFilters } = useFilterStore.getState();
                  resetRequestFilters();
                }}
              />
            )}
            
            {isLoading && currentPage === 1 ? (
              <div className={styles.loadingState}>
                <p>요청을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            ) : (
              <RequestsList requests={requests} />
            )}
            
            {currentPage < totalPages && (
              <div className={styles.loadMoreSection}>
                <button 
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading && currentPage > 1 ? (
                    <span className={styles.loadingText}>로딩 중...</span>
                  ) : (
                    <>더 보기</>
                  )}
                </button>
                <p className={styles.countInfo}>
                  페이지 {currentPage} / {totalPages}
                </p>
              </div>
            )}

            {!isLoading && requests.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>조건에 맞는 요청이 없습니다.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    const { resetRequestFilters } = useFilterStore.getState();
                    resetRequestFilters();
                  }}
                >
                  필터 초기화
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Mobile Filter Modal */}
      <RequestsFilter 
        filters={{
          budgetRange: requestFilters.budgetRange || [],
          requestType: requestFilters.requestType || [],
          isUrgent: requestFilters.isUrgent || null,
          status: requestFilters.status || []
        }}
        onFiltersChange={(newFilters) => setRequestFilters(newFilters)}
        totalCount={totalRequests}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      
      <Footer />
    </div>
  );
}

export default function RequestsPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <Header />
        <RequestsHero searchQuery="" onSearchChange={() => {}} />
        <div className={styles.content}>
          <div className={styles.marketplace}>
            <aside className={styles.sidebar}>
              <div className={styles.filterContainer}>로딩 중...</div>
            </aside>
            <main className={styles.main}>
              <div className={styles.mainContent}>
                <div className={styles.loadingState}>
                  <p>요청을 불러오는 중...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <RequestsContent />
    </Suspense>
  );
}