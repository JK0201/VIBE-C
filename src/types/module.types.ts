export interface Module {
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
  images?: string[];
  author?: {
    id: number;
    name: string;
    profileImage: string;
    githubId: string;
  };
  categoryDisplay?: {
    name: string;
    gradient: string;
    icon: string;
  };
}

export interface ModuleFilters {
  category?: string;
  searchQuery?: string;
  sortBy?: 'latest' | 'popular' | 'rating' | 'price' | 'priceDesc';
  priceRange?: string[];
  language?: string[];
  rating?: number | null;
}