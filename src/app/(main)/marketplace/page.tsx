'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useFilterStore from '@/stores/useFilterStore';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import MarketplaceHero from '@/components/marketplace/MarketplaceHero/MarketplaceHero';
import CategoryFilter from '@/components/marketplace/CategoryFilter/CategoryFilter';
import FilterSidebar from '@/components/marketplace/FilterSidebar/FilterSidebar';
import SearchControls from '@/components/marketplace/SearchControls/SearchControls';
import ModuleGrid from '@/components/marketplace/ModuleGrid/ModuleGrid';
import styles from './marketplace.module.css';

const ITEMS_PER_PAGE = 12;

interface Module {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  purchases: number;
  githubUrl: string;
  createdAt: string;
  language: string;
  framework: string;
  license: string;
  sellerId: number;
  features: string[];
  comments: number;
  updatedAt: string;
  demoUrl?: string;
  author?: {
    id: number;
    name: string;
    profileImage: string;
    githubId: string;
  };
  categoryDisplay: {
    name: string;
    gradient: string;
    icon: string;
  };
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  // Zustand store에서 필터 상태 가져오기
  const { marketplaceFilters, setMarketplaceFilters } = useFilterStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState<Module[]>([]);
  const [totalModules, setTotalModules] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set category from URL parameter on mount and when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setMarketplaceFilters({ category: categoryFromUrl });
    }
  }, [categoryFromUrl, setMarketplaceFilters]);

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (marketplaceFilters.category && marketplaceFilters.category !== 'all') {
          params.append('category', marketplaceFilters.category);
        }
        if (marketplaceFilters.searchQuery) params.append('search', marketplaceFilters.searchQuery);
        params.append('sort', marketplaceFilters.sortBy || 'latest');
        marketplaceFilters.priceRange?.forEach(range => params.append('priceRange', range));
        marketplaceFilters.language?.forEach(lang => params.append('language', lang));
        if (marketplaceFilters.rating !== null && marketplaceFilters.rating !== undefined) {
          params.append('rating', String(marketplaceFilters.rating));
        }
        params.append('page', String(currentPage));
        params.append('limit', String(ITEMS_PER_PAGE));
        
        const response = await fetch(`/api/v1/modules?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const data = await response.json();
        if (data.success) {
          if (currentPage === 1) {
            setModules(data.data);
          } else {
            setModules(prev => [...prev, ...data.data]);
          }
          setTotalModules(data.meta.total);
          setTotalPages(data.meta.totalPages);
        } else {
          throw new Error(data.error || 'Failed to fetch modules');
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to load modules');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [marketplaceFilters, currentPage]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [marketplaceFilters]);

  return (
    <div className={styles.page}>
      <Header />
      
      <MarketplaceHero 
        searchQuery={marketplaceFilters.searchQuery || ''}
        onSearchChange={(query) => setMarketplaceFilters({ searchQuery: query })}
      />
      
      <CategoryFilter 
        selectedCategory={marketplaceFilters.category || 'all'}
        onCategoryChange={(category) => setMarketplaceFilters({ category })}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <FilterSidebar 
              filters={{
                priceRange: marketplaceFilters.priceRange || [],
                language: marketplaceFilters.language || [],
                rating: marketplaceFilters.rating || null
              }}
              onFiltersChange={(newFilters) => setMarketplaceFilters(newFilters)}
            />
          </aside>
          
          <main className={styles.content}>
            <SearchControls 
              sortBy={marketplaceFilters.sortBy || 'latest'}
              onSortChange={(sort) => setMarketplaceFilters({ sortBy: sort })}
              totalCount={totalModules}
              displayedCount={modules.length}
            />
            
            {isLoading && currentPage === 1 ? (
              <div className={styles.loadingState}>
                <p>모듈을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            ) : (
              <ModuleGrid components={modules} />
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
                  전체 {totalModules}개 중 {modules.length}개 표시 (페이지 {currentPage}/{totalPages})
                </p>
              </div>
            )}

            {!isLoading && modules.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>조건에 맞는 모듈이 없습니다.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    const { resetMarketplaceFilters } = useFilterStore.getState();
                    resetMarketplaceFilters();
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

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <Header />
        <MarketplaceHero searchQuery="" onSearchChange={() => {}} />
        <div className={styles.content}>
          <div className={styles.marketplace}>
            <aside className={styles.sidebar}>
              <div className={styles.filterContainer}>로딩 중...</div>
            </aside>
            <main className={styles.main}>
              <div className={styles.mainContent}>
                <div className={styles.loadingState}>
                  <p>모듈을 불러오는 중...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}