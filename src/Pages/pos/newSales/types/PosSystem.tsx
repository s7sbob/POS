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
  productOptionGroups?: ProductOptionGroup[]; // إضافة المجموعات
}


export interface ProductOptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  minSelection: number;
  maxSelection: number;
  sortOrder: number;
  optionItems: ProductOptionItem[];
}

export interface ProductOptionItem {
  id: string;
  name: string;
  productPriceId?: string | null; // Change this line to support null
  useOriginalPrice: boolean;
  extraPrice: number;
  isCommentOnly: boolean;
  sortOrder: number;
}

export interface SelectedOption {
  groupId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  extraPrice: number;
  isCommentOnly: boolean;
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
  selectedOptions?: SelectedOption[]; // إضافة الخيارات المختارة
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