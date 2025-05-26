// src/store/slices/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from 'src/Pages/Products/components/types';

interface ProductsState {
  products: any;
  items: Product[];
}

const initialState: ProductsState = {
    items: [],
    products: undefined
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    }
  }
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
