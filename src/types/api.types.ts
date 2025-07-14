// API Types for Admin Routes

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
  balance: number;
  githubId?: string;
  profileImage?: string;
  createdAt?: string;
  password?: string;
  bio?: string;
}

export interface Module {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  tags: string[];
  githubUrl: string;
  rating: number;
  purchases: number;
  developer?: string;
  developerId?: number;
  imageUrl?: string;
  status?: string;
  reports?: number;
  createdAt?: string;
  sellerId?: number;
  images?: string[];
  demoUrl?: string;
  license?: string;
  features?: string[];
}

export interface Request {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: 'FIXED_PRICE' | 'AUCTION';
  budget?: number;
  deadline: string;
  status: 'OPEN' | 'COMPLETED' | 'CLOSED';
  isUrgent: boolean;
  category: string;
  technologies: string[];
  createdAt: string;
  bids?: Bid[];
  selectedBidId?: number;
}

export interface Bid {
  id: number;
  developerId: number;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Tester {
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
  recruitmentStatus: 'OPEN' | 'COMPLETED' | 'CLOSED';
  status: 'approved' | 'pending' | 'rejected';
  images?: string[];
  userId?: number;
}

export interface Transaction {
  id: number;
  type: string;
  status: string;
  amount: number;
  fee: number;
  netAmount: number;
  fromUserId: number;
  toUserId: number;
  moduleId?: number | null;
  requestId?: number | null;
  description: string;
  createdAt: string;
  completedAt?: string | null;
}