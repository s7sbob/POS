// File: src/utils/api/purchaseApi.ts (تحديث)
import api from '../../axios';

export type Purchase = {
  id?: string;
  code?: number;
  referenceDocNumber: string;
  purchaseOrderId?: string | null;
  purchaseOrder?: {
    id: string;
    code: number;
    referenceDocNumber: string;
    date1: string;
    date2: string;
    warehouseId: string;
    supplierId: string;
    discountPercent: number;
    taxPercent: number;
    total: number;
    details: any[];
  } | null;
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
  details: PurchaseDetail[];
  isActive?: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createUser?: string;
  lastModifyUser?: string;
  createCompany?: string;
  createBranch?: string;
};

export type PurchaseDetail = {
  id?: string;
  purchaseId?: string;
  purchaseOrderId?: string | null;
  productID: string;
  productPriceID?: string;
  unitId: string;
  unitName?: string;
  productName?: string;
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

// دالة لجلب أمر الشراء بالتفاصيل
const fetchPurchaseOrderDetails = async (purchaseOrderId: string) => {
  try {
    const response = await api.get(`/GetPurchaseOrder?id=${purchaseOrderId}`);
    if (response.data.isvalid && response.data.data) {
      const po = response.data.data;
      return {
        id: po.purchaseOrderID,
        code: po.purchaseOrderCode,
        referenceDocNumber: po.referanceDocNumber,
        date1: po.date1,
        date2: po.date2,
        warehouseId: po.warehouseId,
        supplierId: po.supplierId,
        discountPercent: po.discountPercent,
        taxPercent: po.taxPercent,
        total: po.total,
        details: po.details || []
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

const toPurchase = async (raw: any): Promise<Purchase> => {
  // جلب تفاصيل أمر الشراء إذا كان موجود
  let purchaseOrder = null;
  if (raw.purchaseOrderID && !raw.purchaseOrder) {
    purchaseOrder = await fetchPurchaseOrderDetails(raw.purchaseOrderID);
  } else if (raw.purchaseOrder) {
    purchaseOrder = {
      id: raw.purchaseOrder.purchaseOrderID,
      code: raw.purchaseOrder.purchaseOrderCode,
      referenceDocNumber: raw.purchaseOrder.referanceDocNumber,
      date1: raw.purchaseOrder.date1,
      date2: raw.purchaseOrder.date2,
      warehouseId: raw.purchaseOrder.warehouseId,
      supplierId: raw.purchaseOrder.supplierId,
      discountPercent: raw.purchaseOrder.discountPercent,
      taxPercent: raw.purchaseOrder.taxPercent,
      total: raw.purchaseOrder.total,
      details: raw.purchaseOrder.details || []
    };
  }

  return {
    id: raw.purchaseID,
    code: raw.purchaseCode,
    referenceDocNumber: raw.referanceDocNumber,
    purchaseOrderId: raw.purchaseOrderID,
    purchaseOrder: purchaseOrder,
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
    status: raw.status,
    details: raw.details?.map(toPurchaseDetail) || [],
    isActive: raw.isActive,
    createdOn: raw.createDate,
    lastModifiedOn: raw.lastModifyDate,
    createUser: raw.createUser,
    lastModifyUser: raw.lastModifyUser,
    createCompany: raw.createCompany,
    createBranch: raw.createBranch,
  };
};

const toPurchaseDetail = (raw: any): PurchaseDetail => ({
  id: raw.purchaseDetailID,
  purchaseId: raw.purchaseID,
  purchaseOrderId: raw.purchaseOrderID,
  productID: raw.productID,
  productPriceID: raw.productPriceId,
  unitId: raw.unitId,
  unitName: raw.unit?.unitName || raw.productPrice?.unit?.unitName || 'وحدة غير محددة',
  productName: raw.productPrice?.product?.productName || raw.product?.productName || 'منتج غير محدد',
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
});

/* ---------------- API Functions ---------------- */

export const getAll = async (): Promise<Purchase[]> => {
  try {
    const response = await api.get('/GetAllPurchase');
    const purchases = await Promise.all(
      response.data.data.map(async (item: any) => await toPurchase(item))
    );
    return purchases;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<Purchase> => {
  try {
    const response = await api.get(`/GetPurchase?id=${id}`);
    return await toPurchase(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const add = async (body: Purchase) => {
  const apiBody = {
    referanceDocNumber: body.referenceDocNumber,
    purchaseOrderID: body.purchaseOrderId,
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
    details: body.details.map((detail) => ({
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
    }))
  };

  const { data } = await api.post('/AddPurchase', apiBody);
  return await toPurchase(data.data);
};

export const update = async (body: Purchase & { id: string }) => {
  const apiBody = {
    purchaseID: body.id,
    purchaseOrderID: body.purchaseOrderId,
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
    details: body.details.map((detail) => {
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

      if (detail.id && detail.id.trim() !== '') {
        detailData.purchaseDetailID = detail.id;
        detailData.purchaseOrderID = detail.purchaseOrderId;
      }

      return detailData;
    })
  };

  const { data } = await api.post('/UpdatePurchase', apiBody);
  return await toPurchase(data.data);
};
