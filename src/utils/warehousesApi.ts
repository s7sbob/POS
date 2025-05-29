import api from '../utils/axios';

/* النوع الموّحد الذى سنستخدمه فى الـ UI */
export type Warehouse = {
  id: string;           // storeID
  code: number;         // storeCode
  name: string;         // storeName
  address: string;
  isActive: boolean;
  createdOn: string;    // createDate
};

/* محوِّل من شكل الـ API إلى شكل الـ UI */
const toWarehouse = (raw: any): Warehouse => ({
  id:        raw.storeID,
  code:      raw.storeCode,
  name:      raw.storeName,
  address:   raw.address,
  isActive:  raw.isActive,
  createdOn: raw.createDate,
});

/* --------- CRUD --------- */
export const getAll = async (): Promise<Warehouse[]> => {
  const { data } = await api.get('/getstores');
  return (data.data as any[]).map(toWarehouse);
};

export const getOne = async (id: string): Promise<Warehouse> => {
  const { data } = await api.get('/getstore', { params: { StoreID: id } });
  return toWarehouse(data.data);
};

type AddBody = { name: string; code: number; address: string };
export const add = async (body: AddBody): Promise<Warehouse> => {
  const { data } = await api.post(
    '/addstore',
    null,
    { params: { storename: body.name, storecode: body.code, address: body.address } }
  );
  return toWarehouse(data.data);
};

type UpdateBody = { name: string; code: number; address: string; isActive: boolean };
export const update = async (id: string, body: UpdateBody): Promise<Warehouse> => {
  const { data } = await api.post(
    '/updatestore',
    null,
    {
      params: {
        storeid: id,
        storeCode: body.code,
        storename: body.name,
        address: body.address,
        isActive: body.isActive,
      },
    }
  );
  return toWarehouse(data.data);
};
