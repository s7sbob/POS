import api from '../../axios';

export type Employee = {
  [x: string]: any;
  id: string;
  code: number;
  name: string;
  workingHours: string;
  hourSalary: string;
  isActive: boolean;
  createdOn: string;
  lastModifiedOn: string;
  createUser: string;
  lastModifyUser: string;
  createCompany: string;
  createBranch: string;
  lastSyncDate: string;
};

const toEmployee = (raw: any): Employee => ({
  id: raw.id,
  code: raw.employeeCode,
  name: raw.employeeName,
  workingHours: raw.workingHours,
  hourSalary: raw.hourSalary,
  isActive: raw.isActive,
  createdOn: raw.createDate,
  lastModifiedOn: raw.lastModifyDate,
  createUser: raw.createUser,
  lastModifyUser: raw.lastModifyUser,
  createCompany: raw.createCompany,
  createBranch: raw.createBranch,
  lastSyncDate: raw.lastSyncDate,
});

/* ---------------- API ---------------- */

export const getAll = async () => {
  const response = await api.get('/getEmployees');
  return response.data.data.map(toEmployee);
};

export const getById = async (id: string) => {
  const { data } = await api.get(`/getEmployee?EmployeeID=${id}`);
  return toEmployee(data.data);
};

export const add = async (body: { 
  name: string; 
  hourSalary: string;
  workingHours: string;
  isActive?: boolean;
}) => {
  const { data } = await api.post(
    '/addEmployee',
    {
      EmployeeName: body.name,
      HourSalary: body.hourSalary,
      WorkingHours: body.workingHours,
      IsActive: body.isActive ?? true
    }
  );
  return toEmployee(data.data);
};

export const update = async (employee: Employee) => {
  const { data } = await api.post(
    '/updateEmployee',
    {
      EmployeeID: employee.id,
      EmployeeName: employee.name,
      HourSalary: employee.hourSalary,
      WorkingHours: employee.workingHours,
      IsActive: employee.isActive
    }
  );
  return toEmployee(data.data);
};

