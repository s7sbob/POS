// src/Pages/pos/newSales/types/TableSystem.ts
export interface Table {
  id?: string;
  name: string;
  sectionId: string;
  sectionName?: string;
  capacity: number;
  isOccupied?: boolean;
  currentOrderId?: string;
    image?: string; // إضافة جديدة
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
    image?: string; // إضافة جديدة
}

export interface TableSelection {
  section: TableSection;
  table: Table;
}
