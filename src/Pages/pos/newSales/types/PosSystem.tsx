export interface MenuItem {
  id: string;
  name: string;
  nameArabic: string;
  price: number;
  image: string;
  category: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  extras: OrderExtra[];
  totalPrice: number;
}

export interface OrderExtra {
  name: string;
  nameArabic: string;
  price: number;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameArabic: string;
  image: string;
  selected?: boolean;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  service: number;
  total: number;
}