import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface Modal {
  isOpen: boolean;
  type: 'confirm' | 'alert' | 'custom' | null;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  customContent?: React.ReactNode;
}

interface UIState {
  // Loading states
  isPageLoading: boolean;
  loadingMessage?: string;
  
  // Toast notifications
  toasts: Toast[];
  
  // Modal state
  modal: Modal;
  
  // Mobile menu state
  isMobileMenuOpen: boolean;
  
  // Actions
  setPageLoading: (loading: boolean, message?: string) => void;
  
  // Toast actions
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modal actions
  showModal: (options: Omit<Modal, 'isOpen'>) => void;
  hideModal: () => void;
  
  // Mobile menu actions
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Convenience methods
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showConfirmModal: (title: string, message: string, onConfirm: () => void) => void;
}

const useUIStore = create<UIState>((set, get) => ({
  // Initial states
  isPageLoading: false,
  loadingMessage: undefined,
  toasts: [],
  modal: {
    isOpen: false,
    type: null,
  },
  isMobileMenuOpen: false,
  
  // Loading actions
  setPageLoading: (loading, message) => 
    set({ isPageLoading: loading, loadingMessage: message }),
  
  // Toast actions
  showToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    set((state) => ({ toasts: [...state.toasts, toast] }));
    
    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    })),
  
  clearToasts: () => set({ toasts: [] }),
  
  // Modal actions
  showModal: (options) =>
    set({ modal: { ...options, isOpen: true } }),
  
  hideModal: () =>
    set({ 
      modal: { 
        isOpen: false, 
        type: null,
        title: undefined,
        message: undefined,
        onConfirm: undefined,
        onCancel: undefined,
        customContent: undefined
      } 
    }),
  
  // Mobile menu actions
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  closeMobileMenu: () =>
    set({ isMobileMenuOpen: false }),
  
  // Convenience methods
  showSuccessToast: (message) => 
    get().showToast(message, 'success'),
  
  showErrorToast: (message) => 
    get().showToast(message, 'error'),
  
  showConfirmModal: (title, message, onConfirm) =>
    get().showModal({
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel: () => get().hideModal()
    }),
}));

export default useUIStore;