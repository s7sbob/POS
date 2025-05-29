export type Warehouse = {
  status: "active" | "inactive";
  id: string;
  code: number;
  name: string;
  address: string;
  isActive: boolean;
  createdOn: string;
};
