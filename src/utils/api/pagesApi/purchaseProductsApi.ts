import api from '../../axios';

export type Product = {
  id: string;
  code: number;
  name: string;
  groupId: string | null;
  group: {
    id: string;
    code: number;
    name: string;
    parentId: string | null;
    parentGroup: string | null;
    backgroundColor: string;
    fontColor: string;
    isActive: boolean;
    createdOn: string;
    lastModifiedOn: string;
    createUser: string;
    lastModifyUser: string;
    createCompany: string;
    createBranch: string;
  } | null;
  productType: number;
  description: string | null;
  reorderLevel: number;
  cost: number;
  lastPurePrice: number;
  expirationDays: number;
  imageUrl: string | null;
  productPrices: ProductPrice[];
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
};

export type ProductPrice = {
  id: string;
  productId: string;
  productName: string;
  unitId: string | null;
  unitName?: string;
  unitFactor: number;
  barcode: string;
  price: number;
  cost: number;
  posPriceName: string | null;
  isGenerated: boolean;
  isActive: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

export type ProductPricesResponse = {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: ProductPrice[];
};

// تحويل البيانات من API format إلى التطبيق format
const toProductPrice = (raw: any): ProductPrice => ({
  id: raw.productPriceId,
  productId: raw.product?.productID || '',
  productName: raw.product?.productName || '',
  unitId: raw.unit?.unitID || null,
  unitName: raw.unit?.unitName || 'وحدة غير محددة',
  unitFactor: raw.unitFactor,
  barcode: raw.barcode,
  price: raw.price,
  cost: raw.product?.cost || 0,
  posPriceName: raw.posPriceName,
  isGenerated: raw.isGenerated,
  isActive: raw.product?.isActive ?? true,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

/* ---------------- API ---------------- */

// البحث في أسعار المنتجات - الـ API الوحيد المستخدم
export const searchProductPrices = async (
  filterText: string = '', 
  pageNumber: number = 1, 
  pageSize: number = 50
): Promise<ProductPricesResponse> => {
  try {
    let url = `/getProductPricebyNameOrBarcode?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    // إضافة FilterText فقط إذا كان موجود
    if (filterText.trim()) {
      url += `&FilterText=${encodeURIComponent(filterText)}`;
    }
    
    const response = await api.get(url);
    
    if (response.data?.data) {
      return {
        totalCount: response.data.data.totalCount || 0,
        pageCount: response.data.data.pageCount || 1,
        pageNumber: response.data.data.pageNumber || 1,
        pageSize: response.data.data.pageSize || pageSize,
        data: response.data.data.data.map(toProductPrice)
      };
    } else {
      return {
        totalCount: 0,
        pageCount: 0,
        pageNumber: pageNumber,
        pageSize: pageSize,
        data: []
      };
    }
  } catch (error) {
    console.error('Error searching product prices:', error);
    return {
      totalCount: 0,
      pageCount: 0,
      pageNumber: pageNumber,
      pageSize: pageSize,
      data: []
    };
  }
};

// للتوافق مع الكود القديم - استخدام نفس API
export const getProducts = async (pageNumber: number = 1, pageSize: number = 20): Promise<ProductPricesResponse> => {
  return searchProductPrices('', pageNumber, pageSize);
};
