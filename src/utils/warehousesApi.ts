import api from '../utils/axios';

export type Warehouse = {
  id: string;
  /* code موجود لكن لا يُعرَض – نحتاجه فقط أثناء التعديل */
  code: number;
  name: string;
  address: string;
  isActive: boolean;
  createdOn: string;
};

const toWarehouse = (raw: any): Warehouse => ({
  id:        raw.storeID,
  code:      raw.storeCode,
  name:      raw.storeName,
  address:   raw.address,
  isActive:  raw.isActive,
  createdOn: raw.createDate,
});

/* ---------------- API ---------------- */
export const getAll   = async () => (await api.get('/getstores')).data.data.map(toWarehouse);

export const add = async (body: { name: string; address: string; }) => {
  const { data } = await api.post(
    '/addstore',
    null,
    { params: { storename: body.name, storecode: 0, address: body.address } }
  );
  return toWarehouse(data.data);
};

export const update = async (w: Warehouse) => {
  const { data } = await api.post(
    '/updatestore',
    null,
    {
      params: {
        storeid:   w.id,
        storeCode: w.code,
        storename: w.name,
        address:   w.address,
        isActive:  w.isActive,
      },
    }
  );
  return toWarehouse(data.data);
};
