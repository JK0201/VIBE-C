'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TestersHero from '@/components/testers/TestersHero/TestersHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import TestersFilter from '@/components/testers/TestersFilter/TestersFilter';
import TestersSearchControls from '@/components/testers/TestersSearchControls/TestersSearchControls';
import TestersList from '@/components/testers/TestersList/TestersList';
import styles from './testers.module.css';

const ITEMS_PER_PAGE = 12;

interface Tester {
  id: number;
  title: string;
  company: string;
  description: string;
  testType: string[];
  duration: string;
  requiredTesters: number;
  reward: number;
  requirements: string[];
  deadline: string;
  createdAt: string;
  applicants: number;
  isUrgent: boolean;
  status: string;
  testTypeDisplay: {
    names: string[];
    icons: string[];
    gradients: string[];
  };
  durationDisplay: string;
  deadlineDisplay: string;
  isExpired: boolean;
  statusDisplay: string;
}

export default function TestersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filters, setFilters] = useState<{
    rewardRange: string[];
    testType: string[];
    isUrgent: boolean | null;
    requirements: string[];
    status: string[];
  }>({
    rewardRange: [],
    testType: [],
    isUrgent: null,
    requirements: [],
    status: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [testers, setTesters] = useState<Tester[]>([]);
  const [totalTesters, setTotalTesters] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch testers from API
  useEffect(() => {
    const fetchTesters = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort', sortBy);
        
        // Handle test type filter based on selected category
        if (selectedCategory !== 'all') {
          params.append('testType', selectedCategory);
        } else if (filters.testType.length > 0) {
          filters.testType.forEach(type => params.append('testType', type));
        }
        
        filters.rewardRange.forEach(range => params.append('reward', range));
        if (filters.isUrgent !== null) params.append('isUrgent', String(filters.isUrgent));
        filters.status.forEach(s => params.append('status', s));
        params.append('page', String(currentPage));
        params.append('limit', String(ITEMS_PER_PAGE));
        
        const response = await fetch(`/api/v1/testers?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch testers');
        }
        
        const data = await response.json();
        if (data.success) {
          if (currentPage === 1) {
            setTesters(data.data);
          } else {
            setTesters(prev => [...prev, ...data.data]);
          }
          setTotalTesters(data.meta.total);
          setTotalPages(data.meta.totalPages);
        } else {
          throw new Error(data.error || 'Failed to fetch testers');
        }
      } catch (err) {
        console.error('Error fetching testers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load testers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTesters();
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

  // Sync category selection with testType filter
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilters(prev => ({ ...prev, testType: [] }));
    } else {
      setFilters(prev => ({ ...prev, testType: [selectedCategory] }));
    }
  }, [selectedCategory]);

  return (
    <div className={styles.page}>
      <Header />
      
      <TestersHero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        type="testers"
      />
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <TestersFilter 
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={totalTesters}
            />
          </aside>
          
          <main className={styles.content}>
            <TestersSearchControls 
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={totalTesters}
              displayedCount={testers.length}
            />
            
            {isLoading && currentPage === 1 ? (
              <div className={styles.loadingState}>
                <p>테스터 모집 프로젝트를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            ) : (
              <TestersList testers={testers} />
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
                  전체 {totalTesters}개 중 {testers.length}개 표시 (페이지 {currentPage}/{totalPages})
                </p>
              </div>
            )}

            {!isLoading && testers.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>조건에 맞는 테스트 프로젝트가 없습니다.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setFilters({
                      rewardRange: [],
                      testType: [],
                      isUrgent: null,
                      requirements: [],
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