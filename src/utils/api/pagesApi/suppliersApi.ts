import api from '../../axios';

export type Supplier = {
  id: string;
  code: number;
  name: string;
  phone: string;
  address: string;
  notes: string;
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
};

const toSupplier = (raw: any): Supplier => ({
  id: raw.supplierId,
  code: raw.supplierCode,
  name: raw.supplierName,
  phone: raw.phone,
  address: raw.address,
  notes: raw.notes,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

/* ---------------- API ---------------- */

export const getAll = async () => {
  const response = await api.get('/getSuppliers');
  return response.data.data.map(toSupplier);
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/getsupplier?SupplierId=${id}`);
  return toSupplier(data.data);
};

export const add = async (body: { 
  name: string; 
  phone: string;
  address: string;
  notes: string;
  isActive?: boolean;
}) => {
  const { data } = await api.post(
    '/addsupplier',
    null,
    { 
      params: { 
        SupplierName: body.name,
        Phone: body.phone,
        Address: body.address,
        Notes: body.notes,
        isactive: body.isActive ?? true
      } 
    }
  );
  return toSupplier(data.data);
};

export const update = async (supplier: Supplier) => {
  const { data } = await api.post(
    '/updatesupplier',
    null,
    {
      params: {
        SupplierId: supplier.id,
        SupplierName: supplier.name,
        Phone: supplier.phone,
        Address: supplier.address,
        Notes: supplier.notes,
        IsActive: supplier.isActive
      },
    }
  );
  return toSupplier(data.data);
};
