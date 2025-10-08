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
  type: any;
  createdOn: any;
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
  /** Whether the payment method is active. Defaults to true when omitted. */
  isActive?: boolean;
}

export interface UpdatePosPaymentMethodRequest {
  id: string;
  name: string;
  safeOrAccountID: string;
  safeOrAccount?: any;
  branches: PosPaymentMethodBranch[];
  /** Whether the payment method is active. Defaults to true when omitted. */
  isActive?: boolean;
}

export const getAll = async (): Promise<PosPaymentMethod[]> => {
  try {
    const response = await api.get('/GetAllPosPaymentMethods');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<PosPaymentMethod> => {
  try {
    const response = await api.get(`/GetPosPaymentMethod?id=${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const add = async (data: AddPosPaymentMethodRequest): Promise<PosPaymentMethod> => {
  try {
    // ensure the method includes an activation state
    const payload = { ...data, isActive: data.isActive ?? true };
    const response = await api.post('/AddPosPaymentMethod', payload);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (data: UpdatePosPaymentMethodRequest): Promise<PosPaymentMethod> => {
  try {
    // merge id and ensure active state is included
    const payload = { ...data, isActive: data.isActive ?? true };
    const response = await api.post('/UpdatePosPaymentMethod', payload);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
