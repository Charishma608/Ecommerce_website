import { createSlice } from '@reduxjs/toolkit';

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (err) {
    console.warn('Failed to save cart to localStorage', err);
  }
};

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  try {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    console.warn('Failed to load cart from localStorage', err);
    return [];
  }
};

const initialState = {
  items: loadCartFromStorage(),
  lastUpdated: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const { id, title, price, image, category, description } = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          id, 
          title, 
          price, 
          image, 
          category, 
          description: description || '',
          quantity: 1 
        });
      }
      
      state.lastUpdated = new Date().toISOString();
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
      saveCartToLocalStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.min(Math.max(1, quantity), 10); // Limit quantity between 1-10
        state.lastUpdated = new Date().toISOString();
        saveCartToLocalStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
      localStorage.removeItem('cartItems');
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) => {
  return parseFloat(state.cart.items.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0).toFixed(2));
};

export const selectCartItemCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export const selectCartItemsWithDetails = (state) => {
  return state.cart.items.map(item => ({
    ...item,
    subtotal: (parseFloat(item.price) * item.quantity).toFixed(2)
  }));
};

export const selectCartLastUpdated = (state) => state.cart.lastUpdated;

export const selectIsItemInCart = (productId) => (state) => {
  return state.cart.items.some(item => item.id === productId);
};

export const selectCartItemQuantity = (productId) => (state) => {
  const item = state.cart.items.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
