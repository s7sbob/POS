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
  displayPrice?: number;
  productOptionGroups?: ProductOptionGroup[];
}

export interface PosPrice {
  id: string;
  name: string;
  nameArabic: string;
  price: number;
  barcode: string;
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
  productPriceId?: string | null;
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

// جلب المنتجات حسب النوع
export const getProductsByType = async (productType: number): Promise<PosProduct[]> => {
  try {
    const allProducts: PosProduct[] = [];
    let pageNumber = 1;
    const pageSize = 100;
    let hasMoreData = true;

    while (hasMoreData) {
      const response = await productsApi.getByType(productType, pageNumber, pageSize);
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
    console.error(`Error fetching products of type ${productType}:`, error);
    return [];
  }
};

// جلب كل المنتجات العادية (نوع 1)
export const getAllPosProducts = async (): Promise<PosProduct[]> => {
  return await getProductsByType(1);
};

// جلب منتجات الإضافات (نوع 3)
export const getAdditionProducts = async (): Promise<PosProduct[]> => {
  return await getProductsByType(3);
};

// جلب الفئات حسب نوع المنتج
export const getCategoriesByProductType = async (productType: number): Promise<PosCategory[]> => {
  try {
    const products = await getProductsByType(productType);
    const screens = await posScreensApi.getAll();
    
    // فلترة الشاشات التي تحتوي على منتجات من النوع المطلوب
    const relevantScreenIds = [...new Set(products.map(p => p.categoryId))];
    const relevantScreens = screens.filter(screen => 
      relevantScreenIds.includes(screen.id) && screen.isActive && screen.isVisible
    );
    
    const categories = await Promise.all(
      relevantScreens.map(screen => convertScreenToCategory(screen, products))
    );
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories by product type:', error);
    return [];
  }
};

// تحويل Product إلى PosProduct
const convertProductToPosProduct = (product: productsApi.Product): PosProduct => {
  const prices: PosPrice[] = product.productPrices.map(price => ({
    id: price.productPriceId || price.id,
    name: price.posPriceName || 'السعر الافتراضي',
    nameArabic: price.posPriceName || 'السعر الافتراضي',
    price: price.price,
    barcode: price.barcode
  }));

  const hasMultiplePrices = prices.length > 1;
  const displayPrice = !hasMultiplePrices && prices.length > 0 ? prices[0].price : undefined;

  const productOptionGroups: ProductOptionGroup[] = product.productOptionGroups?.map(group => ({
    id: group.id || '',
    name: group.name,
    isRequired: group.isRequired,
    allowMultiple: group.allowMultiple,
    minSelection: group.minSelection,
    maxSelection: group.maxSelection,
    sortOrder: group.sortOrder,
    optionItems: group.optionItems?.map(item => ({
      id: item.id || '',
      name: item.name,
      productPriceId: item.productPriceId,
      useOriginalPrice: item.useOriginalPrice,
      extraPrice: item.extraPrice,
      isCommentOnly: item.isCommentOnly,
      sortOrder: item.sortOrder
    })).sort((a, b) => a.sortOrder - b.sortOrder) || []
  })).sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return {
    id: product.productID || product.id,
    name: product.productName || product.name,
    nameArabic: product.productName || product.name,
    image: product.imageUrl || DEFAULT_PRODUCT_IMAGE,
    categoryId: product.posScreenId || 'default',
    productPrices: prices,
    hasMultiplePrices,
    displayPrice,
    productOptionGroups: productOptionGroups.length > 0 ? productOptionGroups : undefined
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

// جلب كل الـ categories العادية
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

// دالة مساعدة لحساب السعر الإجمالي مع الخيارات
export const calculateTotalPrice = (
  basePrice: number, 
  selectedOptions: SelectedOption[], 
  quantity: number = 1
): number => {
  const optionsPrice = selectedOptions.reduce((total, option) => {
    return total + (option.extraPrice * option.quantity);
  }, 0);
  
  return (basePrice + optionsPrice) * quantity;
};

// دالة مساعدة للتحقق من صحة اختيار المجموعة
export const validateGroupSelection = (
  group: ProductOptionGroup, 
  selections: {[itemId: string]: number}
): boolean => {
  const totalSelected = Object.values(selections).reduce((sum, count) => sum + count, 0);
  
  if (group.isRequired && totalSelected < group.minSelection) {
    return false;
  }
  
  if (totalSelected > group.maxSelection) {
    return false;
  }
  
  return totalSelected === 0 || totalSelected >= group.minSelection;
};

// دالة مساعدة لتنسيق عرض الخيارات
export const formatSelectedOptions = (selectedOptions: SelectedOption[]): string => {
  return selectedOptions.map(option => {
    const quantityText = option.quantity > 1 ? `${option.quantity}x ` : '';
    const priceText = option.extraPrice > 0 ? ` (+${option.extraPrice})` : '';
    return `${quantityText}${option.itemName}${priceText}`;
  }).join(', ');
};

// دالة مساعدة للحصول على نص ملخص المنتج مع الخيارات
export const getProductSummary = (
  product: PosProduct, 
  selectedPrice: PosPrice, 
  selectedOptions?: SelectedOption[]
): string => {
  let summary = product.nameArabic;
  
  if (product.hasMultiplePrices) {
    summary += ` - ${selectedPrice.nameArabic}`;
  }
  
  if (selectedOptions && selectedOptions.length > 0) {
    const optionsText = formatSelectedOptions(selectedOptions);
    summary += ` (${optionsText})`;
  }
  
  return summary;
};

// دالة للتحقق من وجود خيارات في المنتج
export const hasProductOptions = (product: PosProduct): boolean => {
  return !!(product.productOptionGroups && product.productOptionGroups.length > 0);
};

// دالة للحصول على عدد المجموعات المطلوبة
export const getRequiredGroupsCount = (product: PosProduct): number => {
  if (!product.productOptionGroups) return 0;
  return product.productOptionGroups.filter(group => group.isRequired).length;
};

// دالة للحصول على عدد المجموعات الاختيارية
export const getOptionalGroupsCount = (product: PosProduct): number => {
  if (!product.productOptionGroups) return 0;
  return product.productOptionGroups.filter(group => !group.isRequired).length;
};
