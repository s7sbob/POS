// File: src/utils/api/reportsApi.ts
import api from '../axios';

export type ProductBalance = {
  productID: string;
  unitId: string;
  warehouseID: string;
  wareHouseName: string;
  productName: string;
  cost: number;
  lastPurePrice: number;
  unitName: string;
  unitFactor: number;
  unitQuantity: number;
  remainder: number;
};

export type GroupedProductBalance = {
  productID: string;
  productName: string;
  warehouseID: string;
  wareHouseName: string;
  units: {
    unitId: string;
    unitName: string;
    unitFactor: number;
    unitQuantity: number;
    cost: number;
    lastPurePrice: number;
    totalCost: number;
    totalLastPurePrice: number;
  }[];
  totalQuantity: number;
  totalCost: number;
  totalLastPurePrice: number;
};

const toProductBalance = (raw: any): ProductBalance => ({
  productID: raw.productID,
  unitId: raw.unitId,
  warehouseID: raw.warehouseID,
  wareHouseName: raw.wareHouseName,
  productName: raw.productName,
  cost: raw.cost,
  lastPurePrice: raw.lastPurePrice,
  unitName: raw.unitName,
  unitFactor: raw.unitFactor,
  unitQuantity: raw.unitQuantity,
  remainder: raw.remainder,
});

export const getProductBalancesReport = async (): Promise<ProductBalance[]> => {
  try {
    const response = await api.get('/getProductbalancesreport');
    return response.data.data.map(toProductBalance);
  } catch (error) {
    throw error;
  }
};

// دالة لتجميع البيانات حسب المنتج والمخزن
export const groupProductBalances = (balances: ProductBalance[]): GroupedProductBalance[] => {
  const grouped = new Map<string, GroupedProductBalance>();

  balances.forEach(balance => {
    const key = `${balance.productID}-${balance.warehouseID}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, {
        productID: balance.productID,
        productName: balance.productName,
        warehouseID: balance.warehouseID,
        wareHouseName: balance.wareHouseName,
        units: [],
        totalQuantity: 0,
        totalCost: 0,
        totalLastPurePrice: 0,
      });
    }

    const group = grouped.get(key)!;
    
    // حساب إجمالي التكلفة وإجمالي آخر سعر شراء لكل وحدة
    const totalCost = balance.cost * balance.unitQuantity;
    const totalLastPurePrice = balance.lastPurePrice * balance.unitQuantity;
    
    group.units.push({
      unitId: balance.unitId,
      unitName: balance.unitName,
      unitFactor: balance.unitFactor,
      unitQuantity: balance.unitQuantity,
      cost: balance.cost,
      lastPurePrice: balance.lastPurePrice,
      totalCost: totalCost,
      totalLastPurePrice: totalLastPurePrice,
    });

    // حساب الإجماليات
    group.totalQuantity += balance.unitQuantity * balance.unitFactor;
    group.totalCost += totalCost;
    group.totalLastPurePrice += totalLastPurePrice;
  });

  return Array.from(grouped.values());
};
