import api from '../axios';

export type PurchaseOrder = {
  id?: string;
  code?: number;
  referenceDocNumber: string;
  date1: string;
  date2: string;
  warehouseId: string;
  warehouse?: {
    id: string;
    code: number;
    name: string;
    address: string;
    isActive: boolean;
    createdOn: string;
    lastModifiedOn: string;
    createUser: string;
    lastModifyUser: string;
    createCompany: string;
    createBranch: string;
  };
  supplierId: string;
  supplier?: {
    id: string;
    code: number;
    name: string;
    phone: string;
    address: string;
    notes: string;
    isActive: boolean;
    createdOn: string;
    lastModifiedOn: string;
    createUser: string;
    lastModifyUser: string;
    createCompany: string;
    createBranch: string;
  };
  discountPercent: number;
  discountValue: number;
  taxPercent: number;
  taxValue: number;
  subTotal: number;
  total: number;
  details: PurchaseOrderDetail[];
  isActive?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

export type PurchaseOrderDetail = {
  unitName: any;
  id?: string;
  purchaseOrderId?: string;
  productID: string;
  unitId: string;
  unitFactor: number;
  quantity: number;
  price: number;
  discountPercent: number;
  discountValue: number;
  taxPercent: number;
  taxValue: number;
  subTotal: number;
  total: number;
  isActive?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

const toPurchaseOrder = (raw: any): PurchaseOrder => {
  console.log('Converting raw purchase order:', raw); // ✅ للتأكد من البيانات الخام
  
  const converted = {
    id: raw.purchaseOrderID, // ✅ تأكد من التحويل الصحيح
    code: raw.purchaseOrderCode,
    referenceDocNumber: raw.referanceDocNumber,
    date1: raw.date1,
    date2: raw.date2,
    warehouseId: raw.warehouseId,
    warehouse: raw.warehouse ? {
      id: raw.warehouse.warehouseID,
      code: raw.warehouse.warehouseCode,
      name: raw.warehouse.warehouseName,
      address: raw.warehouse.address,
      isActive: raw.warehouse.isActive,
      createdOn: raw.warehouse.createDate,
      lastModifiedOn: raw.warehouse.lastModifyDate,
      createUser: raw.warehouse.createUser,
      lastModifyUser: raw.warehouse.lastModifyUser,
      createCompany: raw.warehouse.createCompany,
      createBranch: raw.warehouse.createBranch,
    } : undefined,
    supplierId: raw.supplierId,
    supplier: raw.supplier ? {
      id: raw.supplier.supplierId,
      code: raw.supplier.supplierCode,
      name: raw.supplier.supplierName,
      phone: raw.supplier.phone,
      address: raw.supplier.address,
      notes: raw.supplier.notes,
      isActive: raw.supplier.isActive,
      createdOn: raw.supplier.createDate,
      lastModifiedOn: raw.supplier.lastModifyDate,
      createUser: raw.supplier.createUser,
      lastModifyUser: raw.supplier.lastModifyUser,
      createCompany: raw.supplier.createCompany,
      createBranch: raw.supplier.createBranch,
    } : undefined,
    discountPercent: raw.discountPercent,
    discountValue: raw.discountValue,
    taxPercent: raw.taxPercent,
    taxValue: raw.taxValue,
    subTotal: raw.subTotal,
    total: raw.total,
    details: raw.details?.map(toPurchaseOrderDetail) || [],
    isActive: raw.isActive,
    createdOn: raw.createDate,
    lastModifiedOn: raw.lastModifyDate,
    createUser: raw.createUser,
    lastModifyUser: raw.lastModifyUser,
    createCompany: raw.createCompany,
    createBranch: raw.createBranch,
  };
  
  // ✅ تأكد من وجود id
  if (!converted.id) {
    console.error('Converted purchase order missing ID:', converted);
  }
  
  return converted;
};

const toPurchaseOrderDetail = (raw: any): PurchaseOrderDetail => ({
  id: raw.purchaseOrderDetailID,
  purchaseOrderId: raw.purchaseOrderID,
  productID: raw.productID, // ✅ تأكد من التحويل الصحيح
  unitId: raw.unitId,
  unitFactor: raw.unitFactor,
  quantity: raw.quantity,
  price: raw.price,
  discountPercent: raw.discountPercent,
  discountValue: raw.discountValue,
  taxPercent: raw.taxPercent,
  taxValue: raw.taxValue,
  subTotal: raw.subTotal,
  total: raw.total,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
  unitName: undefined
});

/* ---------------- API ---------------- */

// جلب جميع أوامر الشراء
export const getAll = async (): Promise<PurchaseOrder[]> => {
  try {
    const response = await api.get('/GetAllPurchaseOrders');
    console.log('Raw purchase orders from API:', response.data.data); // ✅ للتأكد من البيانات الخام
    
    const converted = response.data.data.map(toPurchaseOrder);
    console.log('Converted purchase orders:', converted); // ✅ للتأكد من التحويل
    
    return converted;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};
// جلب أمر شراء واحد
export const getById = async (id: string): Promise<PurchaseOrder> => {
  try {
    const response = await api.get(`/GetPurchaseOrder?id=${id}`);
    return toPurchaseOrder(response.data.data);
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    throw error;
  }
};

// إضافة أمر شراء جديد
export const add = async (body: PurchaseOrder) => {
  const apiBody = {
    referanceDocNumber: body.referenceDocNumber,
    date1: body.date1,
    date2: body.date2,
    warehouseId: body.warehouseId,
    supplierId: body.supplierId,
    discountPercent: body.discountPercent,
    discountValue: body.discountValue,
    taxPercent: body.taxPercent,
    taxValue: body.taxValue,
    subTotal: body.subTotal,
    total: body.total,
    details: body.details.map(detail => ({
      productID: detail.productID, // ✅ تأكد من وجوده
      unitId: detail.unitId,
      unitFactor: detail.unitFactor,
      quantity: detail.quantity,
      price: detail.price,
      discountPercent: detail.discountPercent,
      discountValue: detail.discountValue,
      taxPercent: detail.taxPercent,
      taxValue: detail.taxValue,
      subTotal: detail.subTotal,
      total: detail.total
    }))
  };

  // ✅ إضافة logging للتأكد من البيانات قبل الإرسال
  console.log('API Body before sending:', JSON.stringify(apiBody, null, 2));
  
  // ✅ تأكد من وجود productID في كل detail
  apiBody.details.forEach((detail, index) => {
    if (!detail.productID) {
      console.error(`Detail ${index} missing productID:`, detail);
      throw new Error(`Detail ${index} is missing productID`);
    }
  });

  const { data } = await api.post('/AddPurchaseOrder', apiBody);
  return toPurchaseOrder(data.data);
};

// تحديث أمر شراء
export const update = async (body: PurchaseOrder & { id: string }) => {
  const apiBody = {
    purchaseOrderID: body.id,
    referanceDocNumber: body.referenceDocNumber,
    date1: body.date1,
    date2: body.date2,
    warehouseId: body.warehouseId,
    supplierId: body.supplierId,
    discountPercent: body.discountPercent,
    discountValue: body.discountValue,
    taxPercent: body.taxPercent,
    taxValue: body.taxValue,
    subTotal: body.subTotal,
    total: body.total,
    details: body.details.map(detail => ({
      purchaseOrderDetailID: detail.id || "",
      productID: detail.productID,
      unitId: detail.unitId,
      unitFactor: detail.unitFactor,
      quantity: detail.quantity,
      price: detail.price,
      discountPercent: detail.discountPercent,
      discountValue: detail.discountValue,
      taxPercent: detail.taxPercent,
      taxValue: detail.taxValue,
      subTotal: detail.subTotal,
      total: detail.total
    }))
  };

  const { data } = await api.post('/UpdatePurchaseOrder', apiBody);
  return toPurchaseOrder(data.data);
};
