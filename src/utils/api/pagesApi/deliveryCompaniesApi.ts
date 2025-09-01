// File: src/utils/api/pagesApi/deliveryCompaniesApi.ts
import api from '../../axios';

export type DeliveryCompany = {
  id?: string|any;
  name: string;
  paymentType: string;
  companySharePercentage: number;
  visaCollectionCommissionPercentage: number;
  taxPercentage: number;
  phone: string;
  email: string;
  contactPerson: string;
  notes?: string;
  isActive: boolean;
  branchId?: string | null;
  companyID?: string | null;
};

export const getAll = async (): Promise<DeliveryCompany[]> => {
  const { data } = await api.get('/GetDeliveryCompanies');
  return data.data;
};

export const getById = async (id: string): Promise<DeliveryCompany> => {
  const { data } = await api.get(`/GetDeliveryCompany?id=${id}`);
  return data.data;
};

export const add = async (body: DeliveryCompany): Promise<DeliveryCompany> => {
  const { data } = await api.post('/AddDeliveryCompany', body);
  return data.data;
};

export const update = async (body: DeliveryCompany): Promise<DeliveryCompany> => {
  const { data } = await api.post('/UpdateDeliveryCompany', body);
  return data.data;
};
