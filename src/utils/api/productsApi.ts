import api from '../axios';

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

export type ProductPrice = {
  id?: string;
  productId: string;
  unitId: string;
  unitFactor: number;
  barcode: string;
  price: number;
  posPriceName: string;
  isGenerated: boolean;
  isActive: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

export type ProductsResponse = {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Product[];
};

const toProduct = (raw: any): Product => ({
  id: raw.productID,
  code: raw.productCode,
  name: raw.productName,
  groupId: raw.groupId,
  group: raw.group ? {
    id: raw.group.groupID,
    code: raw.group.groupCode,
    name: raw.group.groupName,
    parentId: raw.group.parentID,
    parentGroup: raw.group.parentGroup,
    backgroundColor: raw.group.backcolor,
    fontColor: raw.group.fontColor,
    isActive: raw.group.isActive,
    createdOn: raw.group.createDate,
    lastModifiedOn: raw.group.lastModifyDate,
    createUser: raw.group.createUser,
    lastModifyUser: raw.group.lastModifyUser,
    createCompany: raw.group.createCompany,
    createBranch: raw.group.createBranch,
  } : null,
  productType: raw.productType,
  description: raw.description,
  reorderLevel: raw.reorderLevel,
  cost: raw.cost,
  lastPurePrice: raw.lastPurePrice,
  expirationDays: raw.expirationDays,
  imageUrl: raw.imageUrl,
  productPrices: raw.productPrices?.map(toProductPrice) || [],
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

const toProductPrice = (raw: any): ProductPrice => ({
  id: raw.productPriceId,
  productId: raw.productID,
  unitId: raw.unitId,
  unitFactor: raw.unitFactor,
  barcode: raw.barcode,
  price: raw.price,
  posPriceName: raw.posPriceName,
  isGenerated: raw.isGenerated,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

/* ---------------- API ---------------- */

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

export const getById = async (id: string) => {
  const { data } = await api.get(`/getProduct?ProductId=${id}`);
  return toProduct(data.data);
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
  }>;
}) => {
  const bodyWithPosPriceName = {
    ...body,
    description: body.description || "",
    productPrices: body.productPrices.map(price => ({
      ...price,
      PosPriceName: ""
    }))
  };
  
  const { data } = await api.post('/addProduct', bodyWithPosPriceName);
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
  }>;
}) => {
  try {
    const updateBody = {
      ProductId: body.ProductId,
      productName: body.productName,
      groupId: body.groupId,
      ProductType: body.ProductType,
      description: body.description || "",
      reorderLevel: Number(body.reorderLevel),
      lastPurePrice: Number(body.lastPurePrice),
      expirationDays: Number(body.expirationDays),
      productPrices: body.productPrices.map(price => ({
        ...(price.productPriceId && { productPriceId: price.productPriceId }),
        unitId: price.unitId,
        unitFactor: Number(price.unitFactor),
        barcode: price.barcode,
        Price: Number(price.Price),
        PosPriceName: ""
      }))
    };
    
    console.log('API Update Body:', updateBody);
    
    const { data } = await api.post('/UpdateProduct', updateBody);
    console.log('API Update Response:', data);
    
    if (!data.data.group) {
      console.log('Group data missing, fetching complete product data...');
      return await getById(body.ProductId);
    }
    
    return toProduct(data.data);
  } catch (error) {
    console.error('Update API Error:', error);
    throw error;
  }
};
