// File: src/utils/api/pagesApi/offersApi.ts
import api from '../../axios';

export type OfferGroup = {
  id?: string;
  offerId?: string;
  title: string;
  minSelection: number;
  maxSelection: number;
  isMandatory: boolean;
  isActive?: boolean;
  branchId?: string | null;
  companyID?: string | null;
};

export type OfferItem = {
  id?: string;
  offerId?: string;
  productPriceId: string;
  offerGroupId?: string | null;
  quantity: number;
  isDefaultSelected: boolean;
  useOriginalPrice: boolean;
  customPrice?: number | null;
  isActive?: boolean;
  branchId?: string | null;
  companyID?: string | null;
};

export type Offer = {
  id?: string;
  name: string;
  priceType: 'Fixed' | 'Dynamic';
  fixedPrice?: number;
  startDate: string;
  endDate: string;
  orderTypeId: string;
  isActive: boolean;
  offerGroups: OfferGroup[];
  offerItems: OfferItem[];
  branchId?: string | null;
  companyID?: string | null;
};

export type OffersResponse = {
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
  data: Offer[];
};

export const getAll = async (pageNumber = 1, pageSize = 20): Promise<OffersResponse> => {
  const { data } = await api.get(`/GetOffers?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return data.data;
};

export const getById = async (id: string): Promise<Offer> => {
  const { data } = await api.get(`/GetOffer?id=${id}`);
  return data.data;
};

export const add = async (body: Offer): Promise<Offer> => {
  const { data } = await api.post('/AddOffer', body);
  return data.data;
};

export const update = async (body: Offer): Promise<Offer> => {
  const { data } = await api.post('/updateoffer', body);
  return data.data;
};
