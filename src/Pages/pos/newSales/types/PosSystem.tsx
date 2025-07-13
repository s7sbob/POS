// src/Pages/pos/newSales/types/PosSystem.tsx
export interface PosProduct {
  id: string;
  name: string;
  nameArabic: string;
  image: string;
  categoryId: string;
  productPrices: PosPrice[];
  hasMultiplePrices: boolean;
  displayPrice?: number;
}

export interface PosPrice {
  id: string;
  name: string;
  nameArabic: string;
  price: number;
  barcode: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameArabic: string;
  image: string;
  parentId?: string;
  children?: CategoryItem[];
  hasChildren: boolean;
  hasProducts?: boolean;
  selected?: boolean;
}

export interface OrderItem {
  id: string;
  product: PosProduct;
  selectedPrice: PosPrice;
  quantity: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  service: number;
  total: number;
}
