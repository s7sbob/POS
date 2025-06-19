// File: src/utils/api/pagesApi/accountsApi.ts
import  api  from '../../axios';

export interface Account {
  id: string;
  name: string;
  safeOrAccountType: number;
  typeName: string;
  accountNumber: string;
  collectionFeePercent: number;
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export interface AddAccountRequest {
  name: string;
  safeOrAccountType: number;
  typeName: string;
  accountNumber: string;
  collectionFeePercent: number;
}

export interface UpdateAccountRequest {
  id: string;
  name: string;
  typeName: string;
  accountNumber: string;
  collectionFeePercent: number;
}

export const getAll = async (): Promise<Account[]> => {
  try {
    const response = await api.get('/getAccounts');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const getById = async (id: string): Promise<Account> => {
  try {
    const response = await api.get(`/getAccount?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching account by ID:', error);
    throw error;
  }
};

export const add = async (data: AddAccountRequest): Promise<Account> => {
  try {
    const response = await api.post('/AddAccount', data);
    return response.data.data;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};

export const update = async (data: UpdateAccountRequest): Promise<Account> => {
  try {
    const response = await api.put('/UpdateAccount', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};
