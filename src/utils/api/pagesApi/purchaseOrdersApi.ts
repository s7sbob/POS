import api from '../../axios';

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
  status: number;
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
  productPriceID?: string; // ← إضافة معرف السعر
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
  const converted: PurchaseOrder = {
    id: raw.purchaseOrderID,
    code: raw.purchaseOrderCode,
    referenceDocNumber: raw.referanceDocNumber,
    date1: raw.date1,
    date2: raw.date2,
    warehouseId: raw.warehouseId,
    warehouse: raw.warehouse
      ? {
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
        }
      : undefined,
    supplierId: raw.supplierId,
    supplier: raw.supplier
      ? {
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
        }
      : undefined,
    discountPercent: raw.discountPercent,
    discountValue: raw.discountValue,
    taxPercent: raw.taxPercent,
    taxValue: raw.taxValue,
    subTotal: raw.subTotal,
    total: raw.total,
    status: raw.status,
    details: raw.details?.map(toPurchaseOrderDetail) || [],
    isActive: raw.isActive,
    createdOn: raw.createDate,
    lastModifiedOn: raw.lastModifyDate,
    createUser: raw.createUser,
    lastModifyUser: raw.lastModifyUser,
    createCompany: raw.createCompany,
    createBranch: raw.createBranch,
  };

  if (!converted.id) {
    }
  return converted;
};

const toPurchaseOrderDetail = (raw: any): PurchaseOrderDetail => ({
  id: raw.purchaseOrderDetailID,
  purchaseOrderId: raw.purchaseOrderID,
  productID: raw.productID,
  productPriceID: raw.productPriceId, // ← هنا الإصلاح - كان مفقود
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
  unitName: raw.unit?.unitName || raw.productPrice?.unit?.unitName || 'وحدة غير محددة'
});

/* ---------------- API ---------------- */

export const getAll = async (): Promise<PurchaseOrder[]> => {
  try {
    const response = await api.get('/GetAllPurchaseOrders');
    const converted = response.data.data.map(toPurchaseOrder);
    return converted;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<PurchaseOrder> => {
  try {
    const response = await api.get(`/GetPurchaseOrder?id=${id}`);
    return toPurchaseOrder(response.data.data);
  } catch (error) {
    throw error;
  }
};

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
    status: body.status,
    details: body.details.map((detail, index) => {
      // التحقق من البيانات المطلوبة
      if (!detail.productID) {
        throw new Error(`Detail ${index} is missing productID`);
      }
      if (!detail.productPriceID) {
        throw new Error(`Detail ${index} is missing ProductPriceID`);
      }

      return {
        productID: detail.productID,
        ProductPriceID: detail.productPriceID, // ← هنا الإصلاح المهم
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
      };
    })
  };

  // التحقق النهائي قبل الإرسال
  apiBody.details.forEach((d, idx) => {
    if (!d.productID) {
      throw new Error(`Detail ${idx} is missing productID`);
    }
    if (!d.ProductPriceID) {
      throw new Error(`Detail ${idx} is missing ProductPriceID`);
    }
  });

  const { data } = await api.post('/AddPurchaseOrder', apiBody);
  return toPurchaseOrder(data.data);
};

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
    status: body.status,
    details: body.details.map((detail, index) => {
      // التحقق من البيانات المطلوبة
      if (!detail.productID) {
        throw new Error(`Detail ${index} is missing productID`);
      }
      if (!detail.productPriceID) {
        throw new Error(`Detail ${index} is missing ProductPriceID`);
      }

      const detailData: any = {
        productID: detail.productID,
        ProductPriceID: detail.productPriceID,
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
      };

      // ← هنا الإصلاح المهم: إضافة purchaseOrderDetailID للسطور الموجودة
      if (detail.id && detail.id.trim() !== '') {
        detailData.purchaseOrderDetailID = detail.id;
        detailData.purchaseOrderID = body.id; // إضافة purchaseOrderID أيضاً
        } else {
        // سطر جديد - لا نضيف purchaseOrderDetailID
        }

      return detailData;
    })
  };

  // التحقق النهائي
  apiBody.details.forEach((d, idx) => {
    });

  const { data } = await api.post('/UpdatePurchaseOrder', apiBody);
  return toPurchaseOrder(data.data);
};

export const getByIdWithDetails = async (id: string): Promise<PurchaseOrder> => {
  try {
    const response = await api.get(`/GetPurchaseOrder?id=${id}`);
    return toPurchaseOrder(response.data.data);
  } catch (error) {
    throw error;
  }
};
