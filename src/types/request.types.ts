export interface Application {
  id: number;
  userId: number;
  requestId: number;
  message: string;
  createdAt: string;
}

export interface Bid {
  id: number;
  userId: number;
  requestId: number;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Request {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: 'FIXED_PRICE' | 'AUCTION';
  budget: number | null;
  isUrgent: boolean;
  status: string;
  category: string;
  deadline: string;
  createdAt: string;
  applications?: Application[];
  bids?: Bid[];
  categoryDisplay?: {
    name: string;
    gradient: string;
    icon: string;
  };
}

export interface RequestFilters {
  category?: string;
  type?: 'FIXED_PRICE' | 'AUCTION';
  searchQuery?: string;
  sortBy?: 'latest' | 'urgent' | 'deadline' | 'popular';
  status?: string[];
}