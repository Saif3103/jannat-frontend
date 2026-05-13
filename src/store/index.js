import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import toast from 'react-hot-toast';

// AUTH STORE
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/users/login', { email, password });
          localStorage.setItem('jannat_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success(`Welcome back, ${data.user.name}! 👑`);
          return data.user;
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Login failed');
          throw err;
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/users/register', formData);
          localStorage.setItem('jannat_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          toast.success('Account created successfully! 🎉');
          return data.user;
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Registration failed');
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('jannat_token');
        set({ user: null, token: null });
        toast.success('Logged out successfully');
      },

      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),

      getProfile: async () => {
        try {
          const { data } = await api.get('/users/profile');
          set({ user: data.user });
        } catch (err) {}
      },
    }),
    { name: 'jannat_auth', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
);

// CART STORE
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1, size = '', color = '') => {
        const items = get().items;
        const existingIdx = items.findIndex(i => i._id === product._id && i.size === size && i.color === color);
        
        if (existingIdx > -1) {
          const updated = [...items];
          updated[existingIdx].quantity += quantity;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...product, quantity, size, color }] });
        }
        toast.success('Added to cart! 🛒');
      },

      removeFromCart: (productId, size, color) => {
        set({ items: get().items.filter(i => !(i._id === productId && i.size === size && i.color === color)) });
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity < 1) return;
        const updated = get().items.map(i => 
          (i._id === productId && i.size === size && i.color === color) ? { ...i, quantity } : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      get cartCount() { return get().items.reduce((a, i) => a + i.quantity, 0); },
      get subtotal() { return get().items.reduce((a, i) => a + ((i.discountPrice || i.price) * i.quantity), 0); },
    }),
    { name: 'jannat_cart' }
  )
);

// SETTINGS STORE
export const useSettingsStore = create((set) => ({
  settings: null,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/settings');
      set({ settings: data.settings, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },
}));

// WISHLIST STORE (synced with auth)
export const useWishlistStore = create((set, get) => ({
  wishlist: [],

  toggleWishlist: async (productId, isLoggedIn) => {
    if (!isLoggedIn) { toast.error('Please login to save to wishlist'); return; }
    try {
      const { data } = await api.put(`/users/wishlist/${productId}`);
      set({ wishlist: data.wishlist });
      toast.success(data.message);
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  },

  setWishlist: (wishlist) => set({ wishlist }),
  isInWishlist: (productId) => get().wishlist.includes(productId),
}));

// UI STORE
export const useUIStore = create((set, get) => ({
  isDarkMode: false,
  isMobileMenuOpen: false,
  isChatOpen: false,
  isSearchOpen: false,

  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    document.body.classList.toggle('light-mode', !newMode);
  },
  setMobileMenuOpen: (val) => set({ isMobileMenuOpen: val }),
  setChatOpen: (val) => set({ isChatOpen: val }),
  setSearchOpen: (val) => set({ isSearchOpen: val }),
}));
