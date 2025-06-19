// File: src/utils/api/pagesApi/safesAndAccountsApi.ts
import  api  from '../../axios';

export interface SafeOrAccount {
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

export const getAllSafesAndAccounts = async (): Promise<SafeOrAccount[]> => {
  try {
    const response = await api.get('/GetAllSafesAndAccounts');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching safes and accounts:', error);
    throw error;
  }
};
