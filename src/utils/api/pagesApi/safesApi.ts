// File: src/utils/api/pagesApi/safesApi.ts
import api from '../../axios';

export interface Safe {
  id: string;
  name: string;
  safeOrAccountType: number;
  typeName: string;
  accountNumber?: string;
  collectionFeePercent: number;
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export interface AddSafeRequest {
  name: string;
  typeName: string;
}

export interface UpdateSafeRequest {
  id: string;
  name: string;
  typeName: string;
  accountNumber?: string;
  collectionFeePercent: number;
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export const getAll = async (): Promise<Safe[]> => {
  try {
    const response = await api.get('/getSafes');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching safes:', error);
    throw error;
  }
};

export const getById = async (id: string): Promise<Safe> => {
  try {
    const response = await api.get(`/getSafe?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching safe by ID:', error);
    throw error;
  }
};

export const add = async (data: AddSafeRequest): Promise<Safe> => {
  try {
    const response = await api.post('/AddSafe', data);
    return response.data.data;
  } catch (error) {
    console.error('Error adding safe:', error);
    throw error;
  }
};

export const update = async (data: UpdateSafeRequest): Promise<Safe> => {
  try {
    const response = await api.put('/UpdateSafe', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating safe:', error);
    throw error;
  }
};
