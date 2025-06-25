// File: src/utils/api/pagesApi/productsApi.ts
import api from '../../axios';

export interface ProductOptionItem {
  id?: string;
  name: string;
  productPriceId?: string | null;
  useOriginalPrice: boolean;
  extraPrice: number;
  isCommentOnly: boolean;
  sortOrder: number;
}

export interface ProductOptionGroup {
  id?: string;
  productId?: string;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  minSelection: number;
  maxSelection: number;
  sortOrder: number;
  optionItems: ProductOptionItem[];
}

export interface ProductComponent {
  componentId: string;
  productPriceId: string;
  rawProductPriceId: string;
  quantity: number;
  notes: string;
  rawProductPrice?: ProductPrice;
}

export interface ProductPrice {
  id: string;
  productPriceId: string;
  barcode: string;
  isGenerated: boolean;
  productID: string;
  product?: Product;
  unitId: string;
  unit?: {
    unitID: string;
    unitName: string;
  };
  posPriceName: string; // ⭐ إضافة posPriceName
  price: number;
  unitFactor: number;
  productComponents: ProductComponent[];
}

export interface Product {
  id: string;
  productID: string;
  productCode: number;
  name: string;
  productName: string;
  code: number;
  groupId: string;
  group?: {
    groupID: string;
    groupCode: number;
    groupName: string;
    name: string;
  };
  productType: number;
  description: string;
  reorderLevel: number;
  cost: number;
  lastPurePrice: number;
  expirationDays: number;
  isActive: boolean; // ⭐ إضافة isActive
  posScreenId?: string;
  posScreen?: {
    id: string;
    name: string;
  };
  productPrices: ProductPrice[];
  productOptionGroups: ProductOptionGroup[]; // ⭐ إضافة productOptionGroups
  imageUrl: string | null;
  createDate: string;
  lastModifyDate: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
}

export interface ProductsResponse {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Product[];
}

// دالة تحويل ProductOptionItem
const toProductOptionItem = (raw: any): ProductOptionItem => ({
  id: raw.id,
  name: raw.name || '',
  productPriceId: raw.productPriceId || null,
  useOriginalPrice: Boolean(raw.useOriginalPrice),
  extraPrice: Number(raw.extraPrice) || 0,
  isCommentOnly: Boolean(raw.isCommentOnly),
  sortOrder: Number(raw.sortOrder) || 0
});

// دالة تحويل ProductOptionGroup
const toProductOptionGroup = (raw: any): ProductOptionGroup => ({
  id: raw.id,
  productId: raw.productId,
  name: raw.name || '',
  isRequired: Boolean(raw.isRequired),
  allowMultiple: Boolean(raw.allowMultiple),
  minSelection: Number(raw.minSelection) || 0,
  maxSelection: Number(raw.maxSelection) || 1,
  sortOrder: Number(raw.sortOrder) || 0,
  optionItems: raw.optionItems?.map(toProductOptionItem) || []
});

const toProductComponent = (raw: any): ProductComponent => ({
  componentId: String(raw.componentId || ''),
  productPriceId: String(raw.productPriceId || ''),
  rawProductPriceId: String(raw.rawProductPriceId || ''),
  quantity: Number(raw.quantity) || 0,
  notes: String(raw.notes || ''),
  rawProductPrice: raw.rawProductPrice ? toProductPrice(raw.rawProductPrice) : undefined
});

const toProductPrice = (raw: any): ProductPrice => ({
  id: String(raw.productPriceId || ''),
  productPriceId: String(raw.productPriceId || ''),
  barcode: String(raw.barcode || ''),
  isGenerated: Boolean(raw.isGenerated),
  productID: String(raw.productID || ''),
  product: raw.product ? toProduct(raw.product) : undefined,
  unitId: String(raw.unitId || ''),
  unit: raw.unit ? {
    unitID: raw.unit.unitID,
    unitName: raw.unit.unitName
  } : undefined,
  posPriceName: String(raw.posPriceName || ''), // ⭐ إضافة posPriceName
  price: Number(raw.price) || 0,
  unitFactor: Number(raw.unitFactor) || 1,
  productComponents: raw.productComponents?.map(toProductComponent) || []
});

const toProduct = (raw: any): Product => ({
  id: String(raw.productID || ''),
  productID: String(raw.productID || ''),
  productCode: Number(raw.productCode) || 0,
  name: String(raw.productName || ''),
  productName: String(raw.productName || ''),
  code: Number(raw.productCode) || 0,
  groupId: String(raw.groupId || ''),
  group: raw.group ? {
    groupID: raw.group.groupID,
    groupCode: raw.group.groupCode,
    groupName: raw.group.groupName,
    name: raw.group.groupName
  } : undefined,
  productType: Number(raw.productType) || 0,
  description: String(raw.description || ''),
  reorderLevel: Number(raw.reorderLevel) || 0,
  cost: Number(raw.cost) || 0,
  lastPurePrice: Number(raw.lastPurePrice) || 0,
  expirationDays: Number(raw.expirationDays) || 0,
  isActive: Boolean(raw.isActive), // ⭐ إضافة isActive
  posScreenId: raw.posScreenId || undefined,
  posScreen: raw.posScreen ? {
    id: raw.posScreen.id,
    name: raw.posScreen.name
  } : undefined,
  productPrices: raw.productPrices?.map(toProductPrice) || [],
  productOptionGroups: raw.productOptionGroups?.map(toProductOptionGroup) || [], // ⭐ إضافة productOptionGroups
  imageUrl: raw.imageUrl || null,
  createDate: String(raw.createDate || ''),
  lastModifyDate: String(raw.lastModifyDate || ''),
  createUser: String(raw.createUser || ''),
  lastModifyUser: String(raw.lastModifyUser || ''),
  createCompany: String(raw.createCompany || ''),
  createBranch: String(raw.createBranch || '')
});

/* ---------------- API Functions ---------------- */

export const getAll = async (pageNumber: number = 1, pageSize: number = 20): Promise<ProductsResponse> => {
  const response = await api.get('/getProducts', {
    params: { pageNumber, pageSize }
  });
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data.map(toProduct)
  };
};

export const getByType = async (
  productType: number, 
  pageNumber: number = 1, 
  pageSize: number = 20
): Promise<ProductsResponse> => {
  const response = await api.get('/getProductsByType', {
    params: { pageNumber, pageSize, productType }
  });
  return {
    totalCount: response.data.data.totalCount,
    pageCount: response.data.data.pageCount,
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    data: response.data.data.data.map(toProduct)
  };
};

export const getById = async (productId: string): Promise<Product> => {
  const response = await api.get('/getProduct', {
    params: { ProductId: productId }
  });
  return toProduct(response.data.data);
};

export const getByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const searchResponse = await searchProductPricesByNameOrBarcode(barcode, 1, 1);
    if (searchResponse.data.length > 0) {
      const productPrice = searchResponse.data[0];
      if (productPrice.product) {
        return productPrice.product;
      }
    }
    return null;
  } catch (error) {
    console.error('Error searching by barcode:', error);
    return null;
  }
};

export const searchByName = async (
  name: string, 
  pageNumber: number = 1, 
  pageSize: number = 50
): Promise<ProductsResponse> => {
  const response = await api.get('/getProductPricebyNameOrBarcode', {
    params: { FilterText: name, pageNumber, pageSize }
  });
  
  const uniqueProducts = new Map<string, Product>();
  
  response.data.data.forEach((item: any) => {
    if (item.product && !uniqueProducts.has(item.product.productID)) {
      uniqueProducts.set(item.product.productID, {
        ...item.product,
        id: item.product.productID,
        name: item.product.productName
      });
    }
  });
  
  return {
    totalCount: uniqueProducts.size,
    pageCount: Math.ceil(uniqueProducts.size / pageSize),
    pageNumber,
    pageSize,
    data: Array.from(uniqueProducts.values())
  };
};

export const searchProductPricesByNameOrBarcode = async (
  filterText: string,
  pageNumber: number = 1,
  pageSize: number = 50
) => {
  try {
    const response = await api.get('/getProductPricebyNameOrBarcode', {
      params: { FilterText: filterText, pageNumber, pageSize }
    });
    
    // ⭐ البيانات موجودة في response.data.data.data
    if (response.data && response.data.isvalid && response.data.data && response.data.data.data) {
      return {
        data: response.data.data.data // ⭐ الـ data الفعلي
      };
    }
    
    return { data: [] };
  } catch (error) {
    console.error('API Error:', error);
    return { data: [] };
  }
};


// File: src/utils/api/pagesApi/productsApi.ts
// في دالة add:

export const add = async (body: { 
  productName: string; 
  groupId: string;
  productType: number;
  description?: string;
  reorderLevel: number;
  cost: number;
  lastPurePrice: number;
  expirationDays: number;
  isActive: boolean;
  posScreenId?: string;
  productPrices: Array<{
    unitId?: string; // ⭐ اختياري للـ POS/Addition
    unitFactor?: number; // ⭐ اختياري للـ POS/Addition
    barcode: string;
    Price: number;
    posPriceName?: string;
    components?: Array<{
      rawProductPriceId: string;
      quantity: number;
      notes?: string;
    }>;
  }>;
  productOptionGroups?: ProductOptionGroup[];
}) => {
  const bodyWithCorrectFormat = {
    productName: body.productName,
    groupId: body.groupId,
    ProductType: body.productType,
    description: body.description || "",
    reorderLevel: Number(body.reorderLevel),
    cost: Number(body.cost),
    lastPurePrice: Number(body.lastPurePrice),
    expirationDays: Number(body.expirationDays),
    isActive: Boolean(body.isActive),
    // إرسال PosScreenId فقط للمنتجات من نوع POS (1)
    ...(body.productType === 1 && body.posScreenId && { PosScreenId: body.posScreenId }),
    productPrices: body.productPrices.map(price => {
      const priceData: any = {
        barcode: price.barcode,
        Price: Number(price.Price),
        components: price.components?.map(component => ({
          rawProductPriceId: component.rawProductPriceId,
          quantity: Number(component.quantity),
          notes: component.notes || ""
        })) || []
      };

      // ⭐ إضافة unitId و unitFactor فقط للـ Materials (type 2)
      if (body.productType === 2) {
        priceData.unitId = price.unitId;
        priceData.unitFactor = Number(price.unitFactor);
      }

      // ⭐ إضافة PosPriceName فقط للـ POS (1) أو Addition (3)
      if (body.productType === 1 || body.productType === 3) {
        priceData.PosPriceName = price.posPriceName || "";
      }

      return priceData;
    }),
    // إرسال productOptionGroups فقط للمنتجات من نوع POS (1) أو Addition (3)
    ...((body.productType === 1 || body.productType === 3) && 
        body.productOptionGroups && 
        body.productOptionGroups.length > 0 && {
      productOptionGroups: body.productOptionGroups.map(group => ({
        name: group.name,
        isRequired: group.isRequired,
        allowMultiple: group.allowMultiple,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        sortOrder: group.sortOrder,
        optionItems: group.optionItems.map(item => ({
          name: item.name,
          productPriceId: item.productPriceId || null,
          useOriginalPrice: item.useOriginalPrice,
          extraPrice: Number(item.extraPrice),
          isCommentOnly: item.isCommentOnly,
          sortOrder: item.sortOrder
        }))
      }))
    })
  };
  
  console.log('Adding product with correct format:', JSON.stringify(bodyWithCorrectFormat, null, 2));
  
  try {
    const { data } = await api.post('/addProduct', bodyWithCorrectFormat);
    return toProduct(data.data);
  } catch (error: any) {
    console.error('Add Product API Error:', error);
    if (error.response?.data) {
      throw {
        ...error,
        response: {
          ...error.response,
          data: error.response.data
        }
      };
    }
    throw error;
  }
};

// في دالة update:
export const update = async (body: {
  ProductId: string;
  productName: string;
  groupId: string;
  ProductType: number;
  description?: string;
  reorderLevel: number;
  lastPurePrice: number;
  expirationDays: number;
  isActive: boolean;
  posScreenId?: string;
  productPrices: Array<{
    productPriceId?: string;
    unitId?: string; // ⭐ اختياري للـ POS/Addition
    unitFactor?: number; // ⭐ اختياري للـ POS/Addition
    barcode: string;
    Price: number;
    posPriceName?: string;
    components?: Array<{
      componentId?: string;
      rawProductPriceId: string;
      quantity: number;
      notes?: string;
    }>;
  }>;
  productOptionGroups?: ProductOptionGroup[];
}) => {
  try {
    const updateBody = {
      ProductId: body.ProductId,
      productName: body.productName,
      groupId: body.groupId,
      ProductType: body.ProductType,
      description: body.description || "",
      reorderLevel: Number(body.reorderLevel),
      expirationDays: Number(body.expirationDays),
      isActive: Boolean(body.isActive),
      // إرسال PosScreenId فقط للمنتجات من نوع POS (1)
      ...(body.ProductType === 1 && body.posScreenId && { PosScreenId: body.posScreenId }),
      productPrices: body.productPrices.map(price => {
        const priceData: any = {
          ...(price.productPriceId && { productPriceId: price.productPriceId }),
          barcode: price.barcode,
          Price: Number(price.Price),
          components: price.components?.map(component => ({
            ...(component.componentId && { componentId: component.componentId }),
            rawProductPriceId: component.rawProductPriceId,
            quantity: Number(component.quantity),
            notes: component.notes || ""
          })) || []
        };

        // ⭐ إضافة unitId و unitFactor فقط للـ Materials (type 2)
        if (body.ProductType === 2) {
          priceData.unitId = price.unitId;
          priceData.unitFactor = Number(price.unitFactor);
        }

        // ⭐ إضافة PosPriceName فقط للـ POS (1) أو Addition (3)
        if (body.ProductType === 1 || body.ProductType === 3) {
          priceData.PosPriceName = price.posPriceName || "";
        }

        return priceData;
      }),
      // إرسال productOptionGroups فقط للمنتجات من نوع POS (1) أو Addition (3)
      ...((body.ProductType === 1 || body.ProductType === 3) && 
          body.productOptionGroups && 
          body.productOptionGroups.length > 0 && {
        productOptionGroups: body.productOptionGroups.map(group => ({
          ...(group.id && { id: group.id }),
          name: group.name,
          isRequired: group.isRequired,
          allowMultiple: group.allowMultiple,
          minSelection: group.minSelection,
          maxSelection: group.maxSelection,
          sortOrder: group.sortOrder,
          optionItems: group.optionItems.map(item => ({
            ...(item.id && { id: item.id }),
            name: item.name,
            productPriceId: item.productPriceId || null,
            useOriginalPrice: item.useOriginalPrice,
            extraPrice: Number(item.extraPrice),
            isCommentOnly: item.isCommentOnly,
            sortOrder: item.sortOrder
          }))
        }))
      })
    };
    
    console.log('Updating product with correct format:', JSON.stringify(updateBody, null, 2));
    
    const { data } = await api.post('/UpdateProduct', updateBody);
    console.log('Update response:', data);
    
    return await getById(body.ProductId);
  } catch (error: any) {
    console.error('Update API Error:', error);
    if (error.response?.data) {
      throw {
        ...error,
        response: {
          ...error.response,
          data: error.response.data
        }
      };
    }
    throw error;
  }
};

