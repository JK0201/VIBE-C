'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import TestersHero from '@/components/testers/TestersHero/TestersHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import TestersFilter from '@/components/testers/TestersFilter/TestersFilter';
import TestersSearchControls from '@/components/testers/TestersSearchControls/TestersSearchControls';
import TestersList from '@/components/testers/TestersList/TestersList';
import testersData from '@data/mock/testers.json';
import styles from './testers.module.css';

const ITEMS_PER_PAGE = 12;

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
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort testers
  const filteredTesters = testersData.testers.filter(tester => {
    // Category filter (now using test types directly)
    if (selectedCategory !== 'all') {
      if (!tester.testType.includes(selectedCategory)) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tester.title.toLowerCase().includes(query) ||
        tester.company.toLowerCase().includes(query) ||
        tester.description.toLowerCase().includes(query) ||
        tester.requirements.some(req => req.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Reward filter
    if (filters.rewardRange.length > 0) {
      const matchesReward = filters.rewardRange.some(range => {
        const [min, max] = range.split('-').map(Number);
        return tester.reward >= min && tester.reward <= max;
      });
      if (!matchesReward) return false;
    }

    // Urgent filter (AND condition)
    if (filters.isUrgent === true && !tester.isUrgent) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0) {
      const now = new Date();
      const deadline = new Date(tester.deadline);
      const isExpired = deadline.getTime() < now.getTime();
      const isCompleted = tester.status === 'COMPLETED' || isExpired || tester.applicants >= tester.requiredTesters;
      
      const matchesStatus = filters.status.some(status => {
        if (status === 'open') return !isCompleted;
        if (status === 'completed') return isCompleted;
        return false;
      });
      
      if (!matchesStatus) return false;
    }

    // Requirements filter
    if (filters.requirements.length > 0) {
      const hasRequirement = filters.requirements.some(req => 
        tester.requirements.includes(req)
      );
      if (!hasRequirement) return false;
    }


    return true;
  });

  // Sort testers
  const sortedTesters = [...filteredTesters].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'reward-high':
        return b.reward - a.reward;
      case 'reward-low':
        return a.reward - b.reward;
      default:
        return 0;
    }
  });

  const displayedTesters = sortedTesters.slice(0, displayedCount);

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
              totalCount={filteredTesters.length}
            />
          </aside>
          
          <main className={styles.content}>
            <TestersSearchControls 
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredTesters.length}
              displayedCount={displayedTesters.length}
            />
            
            <TestersList testers={displayedTesters} />
            
            {displayedTesters.length < filteredTesters.length && (
              <div className={styles.loadMoreSection}>
                <button 
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.loadingText}>로딩 중...</span>
                  ) : (
                    <>더 보기 ({filteredTesters.length - displayedTesters.length}개 남음)</>
                  )}
                </button>
                <p className={styles.countInfo}>
                  전체 {filteredTesters.length}개 중 {displayedTesters.length}개 표시
                </p>
              </div>
            )}

            {filteredTesters.length === 0 && (
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