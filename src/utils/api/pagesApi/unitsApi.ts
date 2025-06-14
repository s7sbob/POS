import api from '../../axios';

export type Unit = {
  id: string;
  code: number;
  name: string;
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
};

const toUnit = (raw: any): Unit => ({
  id: raw.unitID,
  code: raw.unitCode,
  name: raw.unitName,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
});

/* ---------------- API ---------------- */

export const getAll = async () => (await api.get('/getUnits')).data.data.map(toUnit);

export const add = async (body: { name: string; }) => {
  const { data } = await api.post(
    '/addUnit',
    null,
    { params: { UnitName: body.name, UnitCode: 0, isActive: true } }
  );
  return toUnit(data.data);
};

export const update = async (u: Unit) => {
  const { data } = await api.post(
    '/UpdateUnit',
    null,
    {
      params: {
        UnitID: u.id,
        UnitCode: u.code,
        UnitName: u.name,
        isActive: u.isActive,
      },
    }
  );
  return toUnit(data.data);
};
