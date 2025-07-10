import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  moduleId: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  sellerId: number;
  sellerName: string;
}

interface CartState {
  items: CartItem[];
  
  // Computed values
  getTotalPrice: () => number;
  getTotalItems: () => number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (moduleId: number) => void;
  updateQuantity: (moduleId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Auth-related actions
  clearCartOnLogout: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      addItem: (newItem) => 
        set((state) => {
          const existingItem = state.items.find(item => item.moduleId === newItem.moduleId);
          
          if (existingItem) {
            // 이미 장바구니에 있으면 수량 증가
            return {
              items: state.items.map(item =>
                item.moduleId === newItem.moduleId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          
          // 새로운 아이템 추가
          return {
            items: [...state.items, { ...newItem, quantity: 1 }]
          };
        }),
      
      removeItem: (moduleId) =>
        set((state) => ({
          items: state.items.filter(item => item.moduleId !== moduleId)
        })),
      
      updateQuantity: (moduleId, quantity) =>
        set((state) => ({
          items: quantity > 0
            ? state.items.map(item =>
                item.moduleId === moduleId ? { ...item, quantity } : item
              )
            : state.items.filter(item => item.moduleId !== moduleId) // 수량이 0이면 제거
        })),
      
      clearCart: () => set({ items: [] }),
      
      clearCartOnLogout: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage에 저장될 key 이름
      skipHydration: true, // SSR hydration 에러 방지
    }
  )
);

// Hydration 수동 처리를 위한 함수
export const hydrateCartStore = () => {
  useCartStore.persist.rehydrate();
};

export default useCartStore;