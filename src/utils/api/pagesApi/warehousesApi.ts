import api from '../../axios';

export type Warehouse = {
  [x: string]: any;
  id: string;
  /* code موجود لكن لا يُعرَض – نحتاجه فقط أثناء التعديل */
  code: number;
  name: string;
  address: string;
  isActive: boolean;
  createdOn: string;
};

const toWarehouse = (raw: any): Warehouse => ({
  id:        raw.warehouseID,
  code:      raw.warehouseCode,
  name:      raw.warehouseName,
  address:   raw.address,
  isActive:  raw.isActive,
  createdOn: raw.createDate,
});

/* ---------------- API ---------------- */
export const getAll   = async () => (await api.get('/getwarehouses')).data.data.map(toWarehouse);

export const add = async (body: { name: string; address: string; }) => {
  const { data } = await api.post(
    '/addwarehouse',
    null,
    { params: { warehousename: body.name, warehousecode: 0, address: body.address } }
  );
  return toWarehouse(data.data);
};

export const update = async (w: Warehouse) => {
  const { data } = await api.post(
    '/updatewarehouse',
    null,
    {
      params: {
        warehouseid:   w.id,
        warehouseCode: w.code,
        warehousename: w.name,
        address:   w.address,
        isActive:  w.isActive,
      },
    }
  );
  return toWarehouse(data.data);
};
