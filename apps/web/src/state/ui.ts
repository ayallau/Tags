import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useCallback } from 'react';

// Toast types
export type ToastType = 'info' | 'success' | 'warn' | 'error';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

// UI Store State
interface UIState {
  // Modals state
  modals: Record<string, boolean>;

  // Toasts queue
  toastsQueue: Toast[];

  // Filters state
  filters: Record<string, unknown>;
}

// UI Store Actions
interface UIActions {
  // Modal actions
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;

  // Toast actions
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Filter actions
  setFilter: (key: string, value: unknown) => void;
  resetFilters: () => void;
  clearFilter: (key: string) => void;
}

// Combined store type
type UIStore = UIState & UIActions;

// Initial state
const initialState: UIState = {
  modals: {},
  toastsQueue: [],
  filters: {},
};

// Generate unique ID for toasts
const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create the store with SSR safety
export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Modal actions
      openModal: (id: string) =>
        set(
          state => ({
            modals: { ...state.modals, [id]: true },
          }),
          false,
          `openModal/${id}`
        ),

      closeModal: (id: string) =>
        set(
          state => ({
            modals: { ...state.modals, [id]: false },
          }),
          false,
          `closeModal/${id}`
        ),

      toggleModal: (id: string) =>
        set(
          state => ({
            modals: { ...state.modals, [id]: !state.modals[id] },
          }),
          false,
          `toggleModal/${id}`
        ),

      // Toast actions
      pushToast: (toast: Omit<Toast, 'id'>) => {
        const newToast: Toast = {
          id: generateToastId(),
          duration: 5000, // Default 5 seconds
          ...toast,
        };

        set(
          state => ({
            toastsQueue: [...state.toastsQueue, newToast],
          }),
          false,
          `pushToast/${newToast.id}`
        );

        // Auto-remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(newToast.id);
          }, newToast.duration);
        }
      },

      removeToast: (id: string) =>
        set(
          state => ({
            toastsQueue: state.toastsQueue.filter(toast => toast.id !== id),
          }),
          false,
          `removeToast/${id}`
        ),

      clearToasts: () => set({ toastsQueue: [] }, false, 'clearToasts'),

      // Filter actions
      setFilter: (key: string, value: unknown) =>
        set(
          state => ({
            filters: { ...state.filters, [key]: value },
          }),
          false,
          `setFilter/${key}`
        ),

      resetFilters: () => set({ filters: {} }, false, 'resetFilters'),

      clearFilter: (key: string) =>
        set(
          state => {
            const newFilters = { ...state.filters };
            delete newFilters[key];
            return { filters: newFilters };
          },
          false,
          `clearFilter/${key}`
        ),
    }),
    {
      name: 'ui-store',
      // Only enable devtools in development
      enabled: typeof window !== 'undefined' && import.meta.env.DEV,
    }
  )
);

// Selectors for better performance
export const useModal = (id: string) => useUIStore(state => state.modals[id] || false);
export const useToasts = () => useUIStore(state => state.toastsQueue);
export const useFilters = () => useUIStore(state => state.filters);
export const useFilter = (key: string) => useUIStore(state => state.filters[key]);

// Action selectors - use useCallback to prevent infinite loops
export const useModalActions = () => {
  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);
  const toggleModal = useUIStore(state => state.toggleModal);

  return useCallback(
    () => ({
      openModal,
      closeModal,
      toggleModal,
    }),
    [openModal, closeModal, toggleModal]
  )();
};

export const useToastActions = () => {
  const pushToast = useUIStore(state => state.pushToast);
  const removeToast = useUIStore(state => state.removeToast);
  const clearToasts = useUIStore(state => state.clearToasts);

  return useCallback(
    () => ({
      pushToast,
      removeToast,
      clearToasts,
    }),
    [pushToast, removeToast, clearToasts]
  )();
};

export const useFilterActions = () => {
  const setFilter = useUIStore(state => state.setFilter);
  const resetFilters = useUIStore(state => state.resetFilters);
  const clearFilter = useUIStore(state => state.clearFilter);

  return useCallback(
    () => ({
      setFilter,
      resetFilters,
      clearFilter,
    }),
    [setFilter, resetFilters, clearFilter]
  )();
};
