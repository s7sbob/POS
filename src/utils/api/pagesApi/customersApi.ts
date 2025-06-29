// File: src/utils/api/pagesApi/customersApi.ts
import api from '../../axios';

export interface CustomerAddress {
  id?: string;
  addressLine: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  notes?: string;
  zoneId: string;
  zoneName?: string;
  branchId?: string;
  companyID?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  phone4?: string;
  isBlocked: boolean;
  isVIP: boolean;
  isActive: boolean;
  addresses: CustomerAddress[];
  branchId?: string;
  companyID?: string;
}

export interface CustomersResponse {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Customer[];
}

const toCustomerAddress = (raw: any): CustomerAddress => ({
  id: raw.id,
  addressLine: raw.addressLine || '',
  floor: raw.floor || '',
  apartment: raw.apartment || '',
  landmark: raw.landmark || '',
  notes: raw.notes || '',
  zoneId: raw.zoneId || '',
  zoneName: raw.zoneName || '',
  branchId: raw.branchId || null,
  companyID: raw.companyID || null,
  isActive: Boolean(raw.isActive)
});

const toCustomer = (raw: any): Customer => ({
  id: raw.id,
  name: raw.name || '',
  phone1: raw.phone1 || '',
  phone2: raw.phone2 || '',
  phone3: raw.phone3 || '',
  phone4: raw.phone4 || '',
  isBlocked: Boolean(raw.isBlocked),
  isVIP: Boolean(raw.isVIP),
  isActive: Boolean(raw.isActive),
  addresses: raw.addresses?.map(toCustomerAddress) || [],
  branchId: raw.branchId || null,
  companyID: raw.companyID || null
});

export const getAll = async (pageNumber: number = 1, pageSize: number = 25): Promise<CustomersResponse> => {
  try {
    const response = await api.get(`/GetCustomers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (response.data?.isvalid && response.data?.data) {
      return {
        totalCount: response.data.data.totalCount,
        pageCount: response.data.data.pageCount,
        pageNumber: response.data.data.pageNumber,
        pageSize: response.data.data.pageSize,
        data: response.data.data.data.map(toCustomer)
      };
    }
    return {
      totalCount: 0,
      pageCount: 0,
      pageNumber: 1,
      pageSize: 25,
      data: []
    };
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<Customer> => {
  try {
    const response = await api.get(`/GetCustomer?id=${id}`);
    if (response.data?.isvalid && response.data?.data) {
      return toCustomer(response.data.data);
    }
    throw new Error('Customer not found');
  } catch (error) {
    throw error;
  }
};

export const getByPhone = async (phone: string): Promise<Customer> => {
  try {
    const response = await api.get(`/GetCustomerByPhone?phone=${phone}`);
    if (response.data?.isvalid && response.data?.data) {
      return toCustomer(response.data.data);
    }
    throw new Error('Customer not found');
  } catch (error) {
    throw error;
  }
};

export const add = async (body: {
  name: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  phone4?: string;
  isVIP: boolean;
  isBlocked: boolean;
  isActive: boolean;
  addresses: Array<{
    addressLine: string;
    zoneId: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    notes?: string;
  }>;
}): Promise<Customer> => {
  try {
    const { data } = await api.post('/AddCustomer', body);
    return toCustomer(data.data);
  } catch (error) {
    throw error;
  }
};

export const update = async (body: {
  id: string;
  name: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  phone4?: string;
  isBlocked: boolean;
  isVIP: boolean;
  isActive: boolean;
  addresses: Array<{
    id?: string;
    addressLine: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    notes?: string;
    zoneId: string;
    zoneName?: string;
    branchId?: string;
    companyID?: string;
    isActive: boolean;
  }>;
}): Promise<Customer> => {
  try {
    const { data } = await api.post('/UpdateCustomer', body);
    return toCustomer(data.data);
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    await api.post('/DeleteCustomer', id);
  } catch (error) {
    throw error;
  }
};
