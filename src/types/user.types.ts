export enum UserRole {
  USER = 'user',
  DEVELOPER = 'developer',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  githubId: string;
  balance: number;
  role: UserRole | string;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPermissions {
  canManageUsers: boolean;
  canManageModules: boolean;
  canManageRequests: boolean;
  canManageTransactions: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
}