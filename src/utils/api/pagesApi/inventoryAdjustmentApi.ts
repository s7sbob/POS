// File: src/utils/api/pagesApi/inventoryAdjustmentApi.ts
import api from 'src/utils/axios';
import * as warehousesApi from './warehousesApi'; // استخدام نفس API المخازن

export type AdjustmentType = 0 | 1 | 2;

export interface AdjustmentDetail {
  barcode: string;
  detailsAdjustmentId: string;
  adjustmentId: string;
  productId: string;
  productPriceId: string;
  productName: string;
  unitName: string;
  oldQuantity: number;
  newQuantity: number;
  unitFactor: number;
  diffQty: number;
  notes: string | null;
  branchID: string | null;
  companyID: string | null;
  isActive: boolean;
}

export interface InventoryAdjustment {
  adjustmentId: string;
  adjustmentType: AdjustmentType;
  adjustmentDate: string;
  reason: string | null;
  referenceNumber: string | null;
  warehouseId: string;
  status: number;
  details: AdjustmentDetail[];
  branchID: string | null;
  companyID: string | null;
  isActive: boolean;
}

export interface AdjustmentListItem {
  [x: string]: any;
  warehouseName: string;
  adjustmentId: string;
  adjustmentType: number;
  adjustmentDate: string;
  reason: string | null;
  referenceNumber: string | null;
  warehouseId: string;
  status: number;
  details: Array<{
    detailsAdjustmentId: string;
    adjustmentId: string;
    productId: string;
    productPriceId: string;
    productName: string;
    unitName: string;
    oldQuantity: number;
    newQuantity: number;
    unitFactor: number;
    diffQty: number;
    notes: string | null;
    branchID: string | null;
    companyID: string | null;
    isActive: boolean;
  }>;
  branchID: string | null;
  companyID: string | null;
  isActive: boolean;
}

export const getAdjustmentById = async (adjustmentId: string): Promise<InventoryAdjustment> => {
  try {
    const response = await api.get(`/getAdjustment?adjustmentid=${adjustmentId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAdjustments = async (): Promise<AdjustmentListItem[]> => {
  try {
    // جلب التسويات
    const adjustmentsResponse = await api.get('/getAdjustments');
    const adjustments: AdjustmentListItem[] = adjustmentsResponse.data.data;
    
    // جلب المخازن باستخدام نفس API المخازن المستخدم في التسوية
    const warehouses = await warehousesApi.getAll();
    
    // إنشاء map للمخازن لسهولة البحث
    const warehousesMap = new Map<string, string>();
    warehouses.forEach((warehouse: { id: string; name: string; }) => {
      warehousesMap.set(warehouse.id, warehouse.name);
    });
    
    // ربط أسماء المخازن بالتسويات
    const adjustmentsWithWarehouseNames = adjustments.map(adjustment => ({
      ...adjustment,
      warehouseName: warehousesMap.get(adjustment.warehouseId) || 'مخزن غير معروف'
    }));
    
    return adjustmentsWithWarehouseNames;
  } catch (error) {
    throw error;
  }
};

// GET فقط لجلب البيانات
export const getOrCreatePendingAdjustment = async (warehouseId: string): Promise<InventoryAdjustment> => {
  try {
    const response = await api.post(`/GetOrCreatePendingAdjustment?warehouseid=${warehouseId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// POST الوحيد لجميع التحديثات
export const updateAdjustment = async (adjustmentData: {
  adjustmentId: string;
  adjustmentType: number;
  reason?: string;
  referenceNumber?: string;
  warehouseId: string;
  status: number; // 1 للحفظ، 3 للتأكيد
  details: any[];
}): Promise<InventoryAdjustment> => {
  try {
    const response = await api.post('/UpdateAdjustment', adjustmentData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

