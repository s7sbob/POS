// File: src/utils/api/pagesApi/posPaymentMethodsApi.ts
import  api  from '../../axios';

export interface PosPaymentMethodBranch {
  id?: string;
  posPaymentMethodID?: string;
  safeOrAccountID: string;
  isVisible: boolean;
  posPaymentMethod?: any;
  safeOrAccount?: any;
  branchID: string;
  companyID?: string;
  isActive: boolean;
}

export interface PosPaymentMethod {
  id: string;
  name: string;
  safeOrAccountID?: string;
  safeOrAccount?: {
    id: string;
    name: string;
    safeOrAccountType: number;
    typeName: string;
    accountNumber?: string;
    collectionFeePercent: number;
    branchID?: string;
    companyID?: string;
    isActive: boolean;
  };
  branches?: PosPaymentMethodBranch[];
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export interface AddPosPaymentMethodRequest {
  name: string;
  safeOrAccountID: string;
  branches: Array<{
    branchId: string;
    safeOrAccountID: string;
    isVisible: boolean;
  }>;
}

export interface UpdatePosPaymentMethodRequest {
  id: string;
  name: string;
  safeOrAccountID: string;
  safeOrAccount?: any;
  branches: PosPaymentMethodBranch[];
}

export const getAll = async (): Promise<PosPaymentMethod[]> => {
  try {
    const response = await api.get('/GetAllPosPaymentMethods');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching POS payment methods:', error);
    throw error;
  }
};

export const getById = async (id: string): Promise<PosPaymentMethod> => {
  try {
    const response = await api.get(`/GetPosPaymentMethod?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching POS payment method by ID:', error);
    throw error;
  }
};

export const add = async (data: AddPosPaymentMethodRequest): Promise<PosPaymentMethod> => {
  try {
    const response = await api.post('/AddPosPaymentMethod', data);
    return response.data.data;
  } catch (error) {
    console.error('Error adding POS payment method:', error);
    throw error;
  }
};

export const update = async (data: UpdatePosPaymentMethodRequest): Promise<PosPaymentMethod> => {
  try {
    const response = await api.post('/UpdatePosPaymentMethod', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating POS payment method:', error);
    throw error;
  }
};
