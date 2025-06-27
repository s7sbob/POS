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
    console.error('Error fetching delivery agents:', error);
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
    console.error('Error fetching delivery agent:', error);
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
    console.error('Error fetching agents by branch:', error);
    throw error;
  }
};

export const add = async (body: {
  name: string;
  phone: string;
  branchId: string;
}): Promise<DeliveryAgent> => {
  try {
    const { data } = await api.post('/AddAgent', body);
    return toDeliveryAgent(data.data);
  } catch (error) {
    console.error('Error adding delivery agent:', error);
    throw error;
  }
};

export const update = async (body: {
  id: string;
  name: string;
  phone: string;
  branchId: string;
}): Promise<DeliveryAgent> => {
  try {
    const { data } = await api.post('/UpdateAgent', body);
    return toDeliveryAgent(data.data);
  } catch (error) {
    console.error('Error updating delivery agent:', error);
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    await api.post('/DeleteAgent', id);
  } catch (error) {
    console.error('Error deleting delivery agent:', error);
    throw error;
  }
};
