// File: src/utils/api/pagesApi/hallCaptainsApi.ts
import api from '../../axios';

export interface HallCaptain {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  branchName?: string;
  branchId: string;
  companyID?: string;
  isActive: boolean;
}

const toHallCaptain = (raw: any): HallCaptain => ({
  id: raw.id,
  name: raw.name || '',
  phone: raw.phone || '',
  notes: raw.notes || '',
  branchName: raw.branchName || null,
  branchId: raw.branchId || '',
  companyID: raw.companyID || null,
  isActive: Boolean(raw.isActive)
});

export const getAll = async (): Promise<HallCaptain[]> => {
  try {
    const response = await api.get('/GetCaptains');
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toHallCaptain);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<HallCaptain> => {
  try {
    const response = await api.get(`/GetCaptain?id=${id}`);
    if (response.data?.isvalid && response.data?.data) {
      return toHallCaptain(response.data.data);
    }
    throw new Error('Captain not found');
  } catch (error) {
    throw error;
  }
};

export const add = async (body: {
  name: string;
  phone: string;
  notes?: string;
  branchId: string;
  isActive: boolean;
}): Promise<HallCaptain> => {
  try {
    const { data } = await api.post('/AddCaptain', body);
    return toHallCaptain(data.data);
  } catch (error) {
    throw error;
  }
};

export const update = async (body: {
  id: string;
  name: string;
  phone: string;
  notes?: string;
  branchId: string;
  isActive: boolean;
}): Promise<HallCaptain> => {
  try {
    const { data } = await api.post('/UpdateCaptain', body);
    return toHallCaptain(data.data);
  } catch (error) {
    throw error;
  }
};
