import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/products`),
      axios.get(`${API_BASE_URL}/products/categories`)
    ]);
    return {
      products: productsResponse.data,
      categories: categoriesResponse.data
    };
  }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],               // All products
    categories: [],          // All categories
    selectedProduct: null,   // Product for detail page
    status: 'idle',          // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,             // Error message if fetch fails
    selectedCategory: 'all', // Currently selected category
    searchQuery: '',         // Current search query
  },
  reducers: {
    // You can add synchronous actions here if needed
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase();
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products and categories
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.categories = ['all', ...action.payload.categories];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
    
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectFilteredProducts = (state) => {
  const { items, searchQuery, selectedCategory } = state.products;
  
  return items.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || 
                          product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

export const { setSearchQuery, setSelectedCategory } = productsSlice.actions;

export default productsSlice.reducer;
