// File: src/utils/api/pagesApi/inventoryAdjustmentApi.ts
import api from 'src/utils/axios';

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

// GET فقط لجلب البيانات
export const getOrCreatePendingAdjustment = async (warehouseId: string): Promise<InventoryAdjustment> => {
  try {
    const response = await api.post(`/GetOrCreatePendingAdjustment?warehouseid=${warehouseId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching adjustment:', error);
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
    console.error('Error updating adjustment:', error);
    throw error;
  }
};

