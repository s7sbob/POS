export interface Product {
  id: string;
  sku: string;
  name: string;
  img: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  qty: number;
  createdBy: {
    name: string;
    avatar: string;
  };
    createdAt: string;
  status: 'active' | 'inactive';
    description?: string;
  imageUrl?: string;
  quantity?: number;
}