// src/utils/api/pagesApi/unclosedTablesApi.ts
import api from '../../axios';
import { Invoice } from './invoicesApi';

export interface TableDTO {
  id: string;
  name: string;
  sectionId: string;
  sectionName: string;
  capacity: number;
  branchId?: string | null;
  companyID?: string | null;
  isActive: boolean;
}

export interface UnclosedTableInvoice extends Invoice {
  tableDTO: TableDTO;
}

export interface UnclosedTablesResponse {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: UnclosedTableInvoice[];
}

export const getBranchUnclosedTables = async (): Promise<UnclosedTablesResponse> => {
  try {
    const response = await api.get('/GetBranchUnclosedTables');
    
    if (response.data?.isvalid && response.data?.data) {
      return {
        totalCount: response.data.data.totalCount,
        pageCount: response.data.data.pageCount,
        pageNumber: response.data.data.pageNumber,
        pageSize: response.data.data.pageSize,
        data: response.data.data.data
      };
    }
    
    return {
      totalCount: 0,
      pageCount: 0,
      pageNumber: 0,
      pageSize: 0,
      data: []
    };
  } catch (error) {
    console.error('Error fetching unclosed tables:', error);
    throw error;
  }
};

// دالة مساعدة لحساب مدة فتح الطاولة محدثة
export const calculateTableOpenDuration = (createdAt: string): string => {
  // التحقق من صحة التاريخ
  if (!createdAt || createdAt === '0001-01-01T00:00:00') {
    return '00:00';
  }
  
  const now = new Date();
  const created = new Date(createdAt);
  
  // التحقق من صحة التاريخ المُحوّل
  if (isNaN(created.getTime())) {
    return '00:00';
  }
  
  const diffMs = now.getTime() - created.getTime();
  
  // إذا كان الفرق سالب (تاريخ في المستقبل)، أرجع 00:00
  if (diffMs < 0) {
    return '00:00';
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
