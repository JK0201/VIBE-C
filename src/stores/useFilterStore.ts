import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Marketplace filters
interface MarketplaceFilters {
  category?: string;
  priceRange?: string[];  // 가격 범위 배열 (예: ['0-0', '1-50000'])
  language?: string[];    // 언어 필터 (languages -> language로 통일)
  rating?: number | null; // 평점 필터
  tags?: string[];
  sortBy?: 'latest' | 'popular' | 'rating' | 'price' | 'priceDesc';
  searchQuery?: string;
}

// Request board filters
interface RequestFilters {
  category?: string;
  budgetRange?: string[];     // 예산 범위 배열
  requestType?: string[];     // 요청 타입 배열 (fixed, auction)
  isUrgent?: boolean | null;  // 긴급 여부
  status?: string[];          // 상태 배열
  sortBy?: 'latest' | 'budget' | 'bidCount' | 'deadline';
  searchQuery?: string;
}

// Tester recruitment filters
interface TesterFilters {
  category?: string;           // 카테고리 (testType 대신)
  rewardRange?: string[];      // 보상 범위 배열
  testType?: string[];         // 테스트 타입 배열
  isUrgent?: boolean | null;   // 긴급 여부
  requirements?: string[];     // 요구사항 (플랫폼)
  status?: string[];           // 상태 배열
  sortBy?: 'latest' | 'reward' | 'deadline' | 'applicants';
  searchQuery?: string;
}

interface FilterState {
  // Filter states
  marketplaceFilters: MarketplaceFilters;
  requestFilters: RequestFilters;
  testerFilters: TesterFilters;
  
  // Actions
  setMarketplaceFilters: (filters: Partial<MarketplaceFilters>) => void;
  setRequestFilters: (filters: Partial<RequestFilters>) => void;
  setTesterFilters: (filters: Partial<TesterFilters>) => void;
  
  // Reset actions
  resetMarketplaceFilters: () => void;
  resetRequestFilters: () => void;
  resetTesterFilters: () => void;
  resetAllFilters: () => void;
}

const defaultMarketplaceFilters: MarketplaceFilters = {
  category: 'all',
  priceRange: [],
  language: [],
  rating: null,
  sortBy: 'latest',
  searchQuery: '',
};

const defaultRequestFilters: RequestFilters = {
  category: 'all',
  budgetRange: [],
  requestType: [],
  isUrgent: null,
  status: [],
  sortBy: 'latest',
  searchQuery: '',
};

const defaultTesterFilters: TesterFilters = {
  category: 'all',
  rewardRange: [],
  testType: [],
  isUrgent: null,
  requirements: [],
  status: [],
  sortBy: 'latest',
  searchQuery: '',
};

const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // Initial states
      marketplaceFilters: defaultMarketplaceFilters,
      requestFilters: defaultRequestFilters,
      testerFilters: defaultTesterFilters,
      
      // Marketplace actions
      setMarketplaceFilters: (filters) =>
        set((state) => ({
          marketplaceFilters: { ...state.marketplaceFilters, ...filters }
        })),
      
      // Request board actions
      setRequestFilters: (filters) =>
        set((state) => ({
          requestFilters: { ...state.requestFilters, ...filters }
        })),
      
      // Tester recruitment actions
      setTesterFilters: (filters) =>
        set((state) => ({
          testerFilters: { ...state.testerFilters, ...filters }
        })),
      
      // Reset actions
      resetMarketplaceFilters: () =>
        set({ marketplaceFilters: defaultMarketplaceFilters }),
      
      resetRequestFilters: () =>
        set({ requestFilters: defaultRequestFilters }),
      
      resetTesterFilters: () =>
        set({ testerFilters: defaultTesterFilters }),
      
      resetAllFilters: () =>
        set({
          marketplaceFilters: defaultMarketplaceFilters,
          requestFilters: defaultRequestFilters,
          testerFilters: defaultTesterFilters,
        }),
    }),
    {
      name: 'filter-storage', // localStorage에 저장될 key 이름
    }
  )
);

export default useFilterStore;