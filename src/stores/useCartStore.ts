import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
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
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
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
          const existingItem = state.items.find(item => item.id === newItem.id);
          
          if (existingItem) {
            // 이미 장바구니에 있으면 수량 증가
            return {
              items: state.items.map(item =>
                item.id === newItem.id
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
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
      
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity > 0
            ? state.items.map(item =>
                item.id === id ? { ...item, quantity } : item
              )
            : state.items.filter(item => item.id !== id) // 수량이 0이면 제거
        })),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage에 저장될 key 이름
    }
  )
);

export default useCartStore;