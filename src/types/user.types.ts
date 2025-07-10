export interface User {
  id: number;
  email: string;
  nickname: string;
  githubId: string;
  balance: number;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}