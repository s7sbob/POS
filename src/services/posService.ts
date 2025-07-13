// src/services/posService.ts
import * as productsApi from '../utils/api/pagesApi/productsApi';
import * as posScreensApi from '../utils/api/pagesApi/posScreensApi';

export interface PosProduct {
  id: string;
  name: string;
  nameArabic: string;
  image: string;
  categoryId: string;
  productPrices: PosPrice[];
  hasMultiplePrices: boolean;
  displayPrice?: number; // للعرض عندما يكون سعر واحد فقط
}

export interface PosPrice {
  id: string;
  name: string;
  nameArabic: string;
  price: number;
  barcode: string;
}

export interface PosCategory {
  id: string;
  name: string;
  nameArabic: string;
  image: string;
  parentId?: string;
  children?: PosCategory[];
  hasChildren: boolean;
  hasProducts?: boolean;
}

// Default images
const DEFAULT_PRODUCT_IMAGE = '/images/img_rectangle_34624462.png';
const DEFAULT_CATEGORY_IMAGE = '/images/img_crepes_1.png';

// جلب كل المنتجات مرة واحدة
export const getAllPosProducts = async (): Promise<PosProduct[]> => {
  try {
    const allProducts: PosProduct[] = [];
    let pageNumber = 1;
    const pageSize = 100;
    let hasMoreData = true;

    // جلب منتجات نوع POS (1)
    while (hasMoreData) {
      const response = await productsApi.getByType(1, pageNumber, pageSize);
      const products = response.data.filter(product => product.isActive);
      
      products.forEach(product => {
        const posProduct = convertProductToPosProduct(product);
        allProducts.push(posProduct);
      });

      hasMoreData = response.pageNumber < response.pageCount;
      pageNumber++;
    }

    // جلب منتجات نوع Addition (3) أيضاً
    pageNumber = 1;
    hasMoreData = true;
    
    while (hasMoreData) {
      const response = await productsApi.getByType(3, pageNumber, pageSize);
      const products = response.data.filter(product => product.isActive);
      
      products.forEach(product => {
        const posProduct = convertProductToPosProduct(product);
        allProducts.push(posProduct);
      });

      hasMoreData = response.pageNumber < response.pageCount;
      pageNumber++;
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching all POS products:', error);
    return [];
  }
};

// تحويل Product إلى PosProduct
const convertProductToPosProduct = (product: productsApi.Product): PosProduct => {
  const prices: PosPrice[] = product.productPrices.map(price => ({
    id: price.id,
    name: price.posPriceName || 'السعر الافتراضي',
    nameArabic: price.posPriceName || 'السعر الافتراضي',
    price: price.price,
    barcode: price.barcode
  }));

  const hasMultiplePrices = prices.length > 1;
  const displayPrice = !hasMultiplePrices && prices.length > 0 ? prices[0].price : undefined;

  return {
    id: product.id,
    name: product.name,
    nameArabic: product.name,
    image: product.imageUrl || DEFAULT_PRODUCT_IMAGE,
    categoryId: product.posScreenId || 'default',
    productPrices: prices,
    hasMultiplePrices,
    displayPrice
  };
};

// جلب المنتجات حسب الفئة
export const getProductsByScreenId = (allProducts: PosProduct[], screenId: string): PosProduct[] => {
  return allProducts.filter(product => product.categoryId === screenId);
};

// البحث في المنتجات
export const searchProducts = (allProducts: PosProduct[], query: string): PosProduct[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  return allProducts.filter(product => 
    product.nameArabic.toLowerCase().includes(searchTerm) ||
    product.name.toLowerCase().includes(searchTerm)
  );
};

// التحقق من وجود منتجات في الـ screen
export const getScreenProductsCount = (allProducts: PosProduct[], screenId: string): number => {
  return allProducts.filter(product => product.categoryId === screenId).length;
};

// تحويل PosScreen إلى PosCategory
export const convertScreenToCategory = async (screen: posScreensApi.PosScreen, allProducts: PosProduct[]): Promise<PosCategory> => {
  const productsCount = getScreenProductsCount(allProducts, screen.id);
  
  return {
    id: screen.id,
    name: screen.name,
    nameArabic: screen.name,
    image: DEFAULT_CATEGORY_IMAGE,
    parentId: screen.parentId || undefined,
    children: screen.children ? await Promise.all(screen.children.map(child => convertScreenToCategory(child, allProducts))) : [],
    hasChildren: !!(screen.children && screen.children.length > 0),
    hasProducts: productsCount > 0
  };
};

// جلب كل الـ categories
export const getAllCategories = async (allProducts: PosProduct[]): Promise<PosCategory[]> => {
  try {
    const screens = await posScreensApi.getAll();
    const categories = await Promise.all(
      screens
        .filter(screen => screen.isActive && screen.isVisible)
        .map(screen => convertScreenToCategory(screen, allProducts))
    );
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
