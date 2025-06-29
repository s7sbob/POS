// File: src/utils/api/pagesApi/deliveryZonesApi.ts
import api from '../../axios';

export interface DeliveryZone {
  id: string;
  name: string;
  deliveryCharge: number;
  defaultBonus: number;
  branchName?: string;
  branchId?: string;
  companyID?: string;
  isActive: boolean;
}

const toDeliveryZone = (raw: any): DeliveryZone => ({
  id: raw.id,
  name: raw.name || '',
  deliveryCharge: Number(raw.deliveryCharge) || 0,
  defaultBonus: Number(raw.defaultBonus) || 0,
  branchName: raw.branchName || null,
  branchId: raw.branchId || null,
  companyID: raw.companyID || null,
  isActive: Boolean(raw.isActive)
});

export const getAll = async (): Promise<DeliveryZone[]> => {
  try {
    const response = await api.get('/GetZones');
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toDeliveryZone);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<DeliveryZone> => {
  try {
    const response = await api.get(`/GetZone?id=${id}`);
    if (response.data?.isvalid && response.data?.data) {
      return toDeliveryZone(response.data.data);
    }
    throw new Error('Zone not found');
  } catch (error) {
    throw error;
  }
};

export const add = async (body: {
  name: string;
  deliveryCharge: number;
  defaultBonus: number;
}): Promise<DeliveryZone> => {
  try {
    const { data } = await api.post('/AddZone', body);
    return toDeliveryZone(data.data);
  } catch (error) {
    throw error;
  }
};

export const update = async (body: {
  id: string;
  name: string;
  deliveryCharge: number;
  defaultBonus: number;
  branchId?: string;
  isActive: boolean;
}): Promise<DeliveryZone> => {
  try {
    const { data } = await api.post('/UpdateZone', body);
    return toDeliveryZone(data.data);
  } catch (error) {
    throw error;
  }
};
