import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  balance: number;
  githubId?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateBalance: (newBalance: number) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      
      updateBalance: (newBalance) => 
        set((state) => ({
          user: state.user ? { ...state.user, balance: newBalance } : null
        })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 key 이름
      partialize: (state) => ({ user: state.user }), // user 정보만 persist
    }
  )
);

export default useAuthStore;