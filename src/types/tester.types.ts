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
  status: string;
  images?: string[];
}

export interface TesterFilters {
  testType?: string[];
  searchQuery?: string;
  sortBy?: 'latest' | 'reward' | 'deadline' | 'popular';
  duration?: string[];
  requirements?: string[];
}