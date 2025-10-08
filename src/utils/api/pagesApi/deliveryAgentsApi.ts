// File: src/utils/api/pagesApi/deliveryAgentsApi.ts
import api from '../../axios';

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  branchName?: string;
  branchId: string;
  companyID?: string;
  isActive: boolean;
}

export interface DeliveryAgentPendingOrder {
  id: string;
  backInvoiceCode: string | null;
  androidInvoiceCode: string | null;
  invoiceType: number;
  invoiceStatus: number;
  wareHouseId: string;
  rawBranchId: string;
  customerId: string | null;
  deliveryAgentId: string | null;
  deliveryCompanyId: string | null;
  tableId: string | null;
  hallCaptainId: string | null;
  customerName: string | null;
  customerAddress: string | null;
  tableGuestsCount: number | null;
  shiftCode: string | null;
  dayCode: string | null;
  returnShiftCode: string | null;
  notes: string | null;
  itemDiscountTotal: number;
  headerDiscountPercentage: number;
  headerDiscountValue: number;
  taxPercentage: number;
  taxAmount: number;
  servicePercentage: number;
  serviceAmount: number;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalAfterTaxAndService: number;
  totalCost: number;
  grossProfit: number;
  createdAt: string;
  printedAt: string | null;
  preparedAt: string;
  completedAt: string;
  createdByUserId: string | null;
  cancelledByUserId: string | null;
  cancelReason: string | null;
  refundedAmount: number | null;
  tableDTO: any | null;
  items: DeliveryOrderItem[];
  payments: any[];
  branchId: string | null;
  companyID: string | null;
  isActive: boolean;
}

export interface DeliveryOrderItem {
  id: string;
  productId: string;
  productPriceId: string;
  barcode: string;
  unitId: string | null;
  posPriceName: string;
  unitFactor: number;
  qty: number;
  unitPrice: number;
  unitCost: number;
  subTotal: number;
  total: number;
  wareHouseId: string;
  itemDiscountPercentage: number;
  itemDiscountValue: number;
  headerDiscountPercentage: number;
  headerDiscountValue: number;
  itemTaxPercentage: number;
  itemTaxAmount: number;
  servicePercentage: number;
  serviceValue: number;
  offerId: string | null;
  offerGroupId: string | null;
  parentLineId: string | null;
  returnToStock: boolean;
  wasteOnReturn: boolean;
  components: any[];
  preparedQty: number;
  preparedAt: string | null;
  deliveredQty: number;
  deliveredAt: string | null;
  expectedPreparationDuration: string | null;
  branchId: string | null;
  companyID: string | null;
  isActive: boolean;
}

export interface DeliveryAgentPendingOrdersResponse {
  isvalid: boolean;
  errors: any[];
  data: {
    totalCount: number;
    pageCount: number;
    pageNumber: number;
    pageSize: number;
    data: DeliveryAgentPendingOrder[];
  };
}

const toDeliveryAgent = (raw: any): DeliveryAgent => ({
  id: raw.id,
  name: raw.name || '',
  phone: raw.phone || '',
  branchName: raw.branchName || null,
  branchId: raw.branchId || '',
  companyID: raw.companyID || null,
  isActive: Boolean(raw.isActive)
});

export const getAll = async (): Promise<DeliveryAgent[]> => {
  try {
    const response = await api.get('/GetAgents');
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toDeliveryAgent);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<DeliveryAgent> => {
  try {
    const response = await api.get(`/GetAgent?id=${id}`);
    if (response.data?.isvalid && response.data?.data) {
      return toDeliveryAgent(response.data.data);
    }
    throw new Error('Agent not found');
  } catch (error) {
    throw error;
  }
};

export const getByBranch = async (branchId: string): Promise<DeliveryAgent[]> => {
  try {
    const response = await api.post('/GetAgentsByBranch', branchId);
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toDeliveryAgent);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

/**
 * Add a new delivery agent. If `isActive` is not supplied it defaults to true.
 */
export const add = async (body: {
  name: string;
  phone: string;
  branchId: string;
  isActive?: boolean;
}): Promise<DeliveryAgent> => {
  try {
    const payload = {
      name: body.name,
      phone: body.phone,
      branchId: body.branchId,
      // ensure agents are active by default
      isActive: body.isActive ?? true
    };
    const { data } = await api.post('/AddAgent', payload);
    return toDeliveryAgent(data.data);
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing delivery agent. When `isActive` is provided it
 * determines whether the agent remains active; otherwise it defaults to true.
 */
export const update = async (body: {
  id: string;
  name: string;
  phone: string;
  branchId: string;
  isActive?: boolean;
}): Promise<DeliveryAgent> => {
  try {
    const payload = {
      id: body.id,
      name: body.name,
      phone: body.phone,
      branchId: body.branchId,
      isActive: body.isActive ?? true
    };
    const { data } = await api.post('/UpdateAgent', payload);
    return toDeliveryAgent(data.data);
  } catch (error) {
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    await api.post('/DeleteAgent', id);
  } catch (error) {
    throw error;
  }
};

// دالة جديدة للحصول على الطلبات المعلقة للطيار
export const getDeliveryAgentPendingOrders = async (deliveryManId: string): Promise<DeliveryAgentPendingOrder[]> => {
  try {
    const response = await api.get(`/GetDeliveryAgentPendingOrders?DeliveryManId=${deliveryManId}`);
    
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.data || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching delivery agent pending orders:', error);
    throw error;
  }
};
