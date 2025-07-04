'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import RequestsHero from '@/components/requests/RequestsHero/RequestsHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import RequestsFilter from '@/components/requests/RequestsFilter/RequestsFilter';
import RequestsSearchControls from '@/components/requests/RequestsSearchControls/RequestsSearchControls';
import RequestsList from '@/components/requests/RequestsList/RequestsList';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<Request[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort', sortBy);
        filters.budgetRange.forEach(range => params.append('budgetRange', range));
        filters.requestType.forEach(type => params.append('requestType', type));
        if (filters.isUrgent !== null) params.append('isUrgent', String(filters.isUrgent));
        filters.status.forEach(s => params.append('status', s));
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
        console.error('Error fetching requests:', err);
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [selectedCategory, searchQuery, sortBy, filters, currentPage]);


  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
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
              totalCount={totalRequests}
            />
          </aside>
          
          <main className={styles.content}>
            <RequestsSearchControls 
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={totalRequests}
              displayedCount={requests.length}
            />
            
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
                  전체 {totalRequests}개 중 {requests.length}개 표시 (페이지 {currentPage}/{totalPages})
                </p>
              </div>
            )}

            {!isLoading && requests.length === 0 && (
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