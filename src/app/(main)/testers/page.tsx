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
  }>({
    rewardRange: [],
    testType: [],
    isUrgent: null,
    requirements: []
  });
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort testers
  const filteredTesters = testersData.testers.filter(tester => {
    // Category filter
    if (selectedCategory !== 'all') {
      // Map test types to categories
      const categoryMap: Record<string, string[]> = {
        'mobile': ['functional', 'ui', 'performance', 'security'],
        'website': ['functional', 'ui', 'performance', 'security'],
        'ai': ['functional'],
        'blockchain': ['security'],
        'ecommerce': ['functional', 'ui'],
        'backend': ['functional', 'performance', 'security'],
        'data': ['functional', 'performance'],
        'devops': ['performance', 'security']
      };
      
      const hasMatchingType = tester.testType.some(type => 
        categoryMap[selectedCategory]?.includes(type)
      );
      
      if (!hasMatchingType) return false;
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

    // Test type filter
    if (filters.testType.length > 0) {
      const hasType = filters.testType.some(type => 
        tester.testType.includes(type)
      );
      if (!hasType) return false;
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
                      requirements: []
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