// File: src/utils/api/pagesApi/tableSectionsApi.ts
import api from '../../axios';

export interface Table {
  id?: string;
  name: string;
  sectionId: string;
  sectionName?: string;
  capacity: number;
}

export interface TableSection {
  id: string;
  name: string;
  branchName?: string;
  serviceCharge: number;
  tables: Table[];
  branchId: string;
  companyID?: string;
  isActive: boolean;
}

const toTable = (raw: any): Table => ({
  id: raw.id,
  name: raw.name || '',
  sectionId: raw.sectionId || '',
  sectionName: raw.sectionName || '',
  capacity: Number(raw.capacity) || 1
});

const toTableSection = (raw: any): TableSection => ({
  id: raw.id,
  name: raw.name || '',
  branchName: raw.branchName || '',
  serviceCharge: Number(raw.serviceCharge) || 0,
  tables: raw.tables?.map(toTable) || [],
  branchId: raw.branchId || '',
  companyID: raw.companyID || null,
  isActive: Boolean(raw.isActive)
});

export const getAll = async (): Promise<TableSection[]> => {
  try {
    const response = await api.get('/GetSections');
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toTableSection);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getById = async (id: string): Promise<TableSection> => {
  try {
    const response = await api.get(`/GetSection?id=${id}`);
    if (response.data?.isvalid && response.data?.data) {
      return toTableSection(response.data.data);
    }
    throw new Error('Section not found');
  } catch (error) {
    throw error;
  }
};

export const getByBranch = async (branchId: string): Promise<TableSection[]> => {
  try {
    const response = await api.get(`/GetSectionsByBranch?branchId=${branchId}`);
    if (response.data?.isvalid && response.data?.data) {
      return response.data.data.map(toTableSection);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const add = async (body: {
  name: string;
  serviceCharge: number;
  tables: Table[];
  isActive?: boolean;
}): Promise<TableSection> => {
  try {
    const requestBody = {
      name: body.name,
      serviceCharge: Number(body.serviceCharge),
      tables: body.tables.map(table => ({
        name: table.name,
        capacity: Number(table.capacity)
      })),
      // include activation state; default to true
      isActive: body.isActive ?? true
    };
    
    const { data } = await api.post('/AddSection', requestBody);
    return toTableSection(data.data);
  } catch (error) {
    throw error;
  }
};

export const update = async (body: {
  id: string;
  name: string;
  serviceCharge: number;
  tables: Table[];
  isActive?: boolean;
}): Promise<TableSection> => {
  try {
    const requestBody = {
      id: body.id,
      name: body.name,
      serviceCharge: Number(body.serviceCharge),
      tables: body.tables.map(table => ({
        ...(table.id && { id: table.id }),
        name: table.name,
        sectionId: body.id,
        sectionName: body.name,
        capacity: Number(table.capacity)
      })),
      isActive: body.isActive ?? true
    };
    
    const { data } = await api.post('/UpdateSection', requestBody);
    return toTableSection(data.data);
  } catch (error) {
    throw error;
  }
};
