export type Warehouse = {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdOn: string; // ISO date
};
