// File: src/utils/api/pagesApi/productsApi.ts
import api from '../../axios';

export type ProductComponent = {
  componentId?: string;
  productPriceId: string;
  rawProductPriceId: string;
  quantity: number;
  notes?: string;
  productPrice?: any;
  rawProductPrice?: {
    productPriceId: string;
    barcode: string;
    isGenerated: boolean;
    productID: string;
    product?: {
      productID: string;
      productCode: number;
      productName: string;
      groupId: string;
      group: any;
      productType: number;
      reorderLevel: number;
      cost: number;
      lastPurePrice: number;
      expirationDays: number;
      description: string;
      imageUrl: string | null;
      isActive: boolean;
      createdOn: string;
      lastModifiedOn: string;
    };
    unitId: string;
    posPriceName: string;
    unit: any;
    price: number;
    unitFactor: number;
    isActive: boolean;
    createdOn: string;
    lastModifiedOn: string;
  };
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
};

export type ProductPrice = {
  id?: string;
  productId: string;
  unitId: string;
  unitFactor: number;
  barcode: string;
  price: number;
  posPriceName: string;
  isGenerated: boolean;
  productComponents?: ProductComponent[];
  isActive: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

export type Product = {
  id: string;
  code: number;
  name: string;
  groupId: string;
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

export type ProductsResponse = {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Product[];
};

// إضافة type جديد للـ search response
export type ProductPriceSearchResponse = {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Array<{
    productPriceId: string;
    barcode: string;
    unitId?: string;
    unit: {
      unitID: string;
      unitCode: number;
      unitName: string;
      branchID?: string;
      companyID?: string;
      isActive: boolean;
    };
    price: number;
    posPriceName?: string;
    unitFactor: number;
    isGenerated: boolean;
    product: {
      productID: string;
      productName: string;
      groupId?: string;
      productType: number;
      cost: number;
      description?: string;
      imageUrl?: string;
      reorderLevel: number;
      lastPurePrice: number;
      expirationDays: number;
      productPrices: any[];
    };
    productPrices: any[];
    components: any[];
  }>;
};

const toProductComponent = (raw: any): ProductComponent => ({
  componentId: raw.componentId,
  productPriceId: raw.productPriceId || '',
  rawProductPriceId: raw.rawProductPriceId || '',
  quantity: Number(raw.quantity) || 0,
  notes: raw.notes || '',
  productPrice: raw.productPrice,
  rawProductPrice: raw.rawProductPrice ? {
    productPriceId: String(raw.rawProductPrice.productPriceId || ''),
    barcode: String(raw.rawProductPrice.barcode || ''),
    isGenerated: Boolean(raw.rawProductPrice.isGenerated),
    productID: String(raw.rawProductPrice.productID || ''),
    product: raw.rawProductPrice.product ? {
      productID: String(raw.rawProductPrice.product.productID || ''),
      productCode: Number(raw.rawProductPrice.product.productCode) || 0,
      productName: String(raw.rawProductPrice.product.productName || ''),
      groupId: String(raw.rawProductPrice.product.groupId || ''),
      group: raw.rawProductPrice.product.group,
      productType: Number(raw.rawProductPrice.product.productType) || 0,
      reorderLevel: Number(raw.rawProductPrice.product.reorderLevel) || 0,
      cost: Number(raw.rawProductPrice.product.cost) || 0,
      lastPurePrice: Number(raw.rawProductPrice.product.lastPurePrice) || 0,
      expirationDays: Number(raw.rawProductPrice.product.expirationDays) || 0,
      description: String(raw.rawProductPrice.product.description || ''),
      imageUrl: raw.rawProductPrice.product.imageUrl || null,
      isActive: Boolean(raw.rawProductPrice.product.isActive),
      createdOn: String(raw.rawProductPrice.product.createDate || ''),
      lastModifiedOn: String(raw.rawProductPrice.product.lastModifyDate || ''),
    } : undefined,
    unitId: String(raw.rawProductPrice.unitId || ''),
    posPriceName: String(raw.rawProductPrice.posPriceName || ''),
    unit: raw.rawProductPrice.unit,
    price: Number(raw.rawProductPrice.price) || 0,
    unitFactor: Number(raw.rawProductPrice.unitFactor) || 1,
    isActive: Boolean(raw.rawProductPrice.isActive),
    createdOn: String(raw.rawProductPrice.createDate || ''),
    lastModifiedOn: String(raw.rawProductPrice.lastModifyDate || ''),
  } : undefined,
  isActive: Boolean(raw.isActive),
  createdOn: String(raw.createDate || ''),
  lastModifiedOn: String(raw.lastModifyDate || ''),
});

const toProductPrice = (raw: any): ProductPrice => ({
  id: raw.productPriceId || '',
  productId: String(raw.productID || ''),
  unitId: String(raw.unitId || ''),
  unitFactor: Number(raw.unitFactor) || 1,
  barcode: String(raw.barcode || ''),
  price: Number(raw.price) || 0,
  posPriceName: String(raw.posPriceName || ''),
  isGenerated: Boolean(raw.isGenerated),
  productComponents: raw.productComponents?.map(toProductComponent) || [],
  isActive: Boolean(raw.isActive),
  createdOn: raw.createDate || '',
  lastModifiedOn: raw.lastModifyDate || '',
  createUser: raw.createUser || '',
  lastModifyUser: raw.lastModifyUser || '',
  createCompany: raw.createCompany || '',
  createBranch: raw.createBranch || '',
});

const toProduct = (raw: any): Product => ({
  id: String(raw.productID || ''),
  code: Number(raw.productCode) || 0,
  name: String(raw.productName || ''),
  groupId: String(raw.groupId || ''),
  group: raw.group ? {
    id: String(raw.group.groupID || ''),
    code: Number(raw.group.groupCode) || 0,
    name: String(raw.group.groupName || ''),
    parentId: raw.group.parentID || null,
    parentGroup: raw.group.parentGroup || null,
    backgroundColor: String(raw.group.backcolor || ''),
    fontColor: String(raw.group.fontColor || ''),
    isActive: Boolean(raw.group.isActive),
    createdOn: String(raw.group.createDate || ''),
    lastModifiedOn: String(raw.group.lastModifyDate || ''),
    createUser: String(raw.group.createUser || ''),
    lastModifyUser: String(raw.group.lastModifyUser || ''),
    createCompany: String(raw.group.createCompany || ''),
    createBranch: String(raw.group.createBranch || ''),
  } : null,
  productType: Number(raw.productType) || 0,
  description: raw.description || null,
  reorderLevel: Number(raw.reorderLevel) || 0,
  cost: Number(raw.cost) || 0,
  lastPurePrice: Number(raw.lastPurePrice) || 0,
  expirationDays: Number(raw.expirationDays) || 0,
  imageUrl: raw.imageUrl || null,
  productPrices: raw.productPrices?.map(toProductPrice) || [],
  isActive: Boolean(raw.isActive),
  createdOn: String(raw.createDate || ''),
  lastModifiedOn: String(raw.lastModifyDate || ''),
  createUser: String(raw.createUser || ''),
  lastModifyUser: String(raw.lastModifyUser || ''),
  createCompany: String(raw.createCompany || ''),
  createBranch: String(raw.createBranch || ''),
});

/* ---------------- API Functions ---------------- */

export const getAll = async (pageNumber: number = 1, pageSize: number = 20): Promise<ProductsResponse> => {
  const response = await api.get(`/getProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data.map(toProduct)
  };
};

export const searchByName = async (name: string, pageNumber: number = 1, pageSize: number = 50): Promise<ProductsResponse> => {
  const response = await api.get(`/getProductsByName?name=${encodeURIComponent(name)}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data.map(toProduct)
  };
};

export const getByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await api.get(`/getProductByBarcode?barcode=${encodeURIComponent(barcode)}`);
    return toProduct(response.data.data);
  } catch (error) {
    return null;
  }
};

// استخدام الـ API الصحيح لجلب منتج واحد
export const getById = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/getProduct?ProductId=${id}`);
  return toProduct(data.data);
};

// APIs للبحث والـ pagination
export const getProductPricesWithPagination = async (pageNumber: number = 1, pageSize: number = 20): Promise<ProductsResponse> => {
  const response = await api.get(`/getProducts?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data.map(toProduct)
  };
};

export const searchProductPricesByNameOrBarcode = async (filterText: string, pageNumber: number = 1, pageSize: number = 50): Promise<ProductPriceSearchResponse> => {
  const response = await api.get(`/getProductPricebyNameOrBarcode?FilterText=${encodeURIComponent(filterText)}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data
  };
};

export const add = async (body: { 
  productName: string; 
  groupId: string;
  productType: number;
  description?: string;
  reorderLevel: number;
  cost: number;
  lastPurePrice: number;
  expirationDays: number;
  productPrices: Array<{
    unitId: string;
    unitFactor: number;
    barcode: string;
    Price: number;
    productComponents?: Array<{
      rawProductPriceId: string;
      quantity: number;
      notes?: string;
    }>;
  }>;
}) => {
  // تنسيق البيانات حسب الـ API المطلوب
  const bodyWithCorrectFormat = {
    productName: body.productName,
    groupId: body.groupId,
    ProductType: body.productType, // تأكد من الكتابة الصحيحة
    description: body.description || "",
    reorderLevel: Number(body.reorderLevel),
    cost: Number(body.cost),
    lastPurePrice: Number(body.lastPurePrice),
    expirationDays: Number(body.expirationDays),
    productPrices: body.productPrices.map(price => ({
      unitId: price.unitId,
      unitFactor: Number(price.unitFactor),
      barcode: price.barcode,
      Price: Number(price.Price),
      PosPriceName: "",
      // استخدام "components" بدلاً من "productComponents"
      components: price.productComponents?.map(component => ({
        rawProductPriceId: component.rawProductPriceId,
        quantity: Number(component.quantity),
        notes: component.notes || ""
      })) || []
    }))
  };
  
  console.log('Adding product with correct format:', JSON.stringify(bodyWithCorrectFormat, null, 2));
  
  const { data } = await api.post('/addProduct', bodyWithCorrectFormat);
  return toProduct(data.data);
};

export const update = async (body: {
  ProductId: string;
  productName: string;
  groupId: string;
  ProductType: number;
  description?: string;
  reorderLevel: number;
  lastPurePrice: number;
  expirationDays: number;
  productPrices: Array<{
    productPriceId?: string;
    unitId: string;
    unitFactor: number;
    barcode: string;
    Price: number;
    productComponents?: Array<{
      componentId?: string;
      rawProductPriceId: string;
      quantity: number;
      notes?: string;
    }>;
  }>;
}) => {
  try {
    // تنسيق البيانات حسب الـ API المطلوب للتحديث
    const updateBody = {
      ProductId: body.ProductId,
      productName: body.productName,
      groupId: body.groupId,
      ProductType: body.ProductType,
      description: body.description || "",
      reorderLevel: Number(body.reorderLevel),
      expirationDays: Number(body.expirationDays),
      // لا نرسل lastPurePrice في التحديث
      productPrices: body.productPrices.map(price => ({
        ...(price.productPriceId && { productPriceId: price.productPriceId }),
        unitId: price.unitId,
        unitFactor: Number(price.unitFactor),
        barcode: price.barcode,
        Price: Number(price.Price),
        PosPriceName: "",
        // استخدام "components" بدلاً من "productComponents"
        components: price.productComponents?.map(component => ({
          ...(component.componentId && { componentId: component.componentId }),
          rawProductPriceId: component.rawProductPriceId,
          quantity: Number(component.quantity),
          notes: component.notes || ""
        })) || []
      }))
    };
    
    console.log('Updating product with correct format:', JSON.stringify(updateBody, null, 2));
    
    const { data } = await api.post('/UpdateProduct', updateBody);
    console.log('Update response:', data);
    
    // استخدام getById لجلب البيانات الكاملة بعد التحديث
    return await getById(body.ProductId);
  } catch (error) {
    console.error('Update API Error:', error);
    throw error;
  }
};
