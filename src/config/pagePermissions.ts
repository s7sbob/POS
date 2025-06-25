// File: src/configs/pagePermissions.ts
export const PAGE_PERMISSIONS = {
  // System Admin
  USERS: { pageId: 8, pageName: 'UserManagement', moduleId: 4 },
  COMPANY: { pageId: 9, pageName: 'CompanySettings', moduleId: 4 },
  PERMISSIONS: { pageId: 10, pageName: 'Permissions', moduleId: 4 },
  
  // Inventory
  PRODUCTS: { pageId: 11, pageName: 'Products', moduleId: 3 },
  GROUPS: { pageId: 12, pageName: 'Groups', moduleId: 3 },
  UNITS: { pageId: 13, pageName: 'Units', moduleId: 3 },
  WAREHOUSES: { pageId: 14, pageName: 'Warehouses', moduleId: 3 },
  INVENTORY_ADJUSTMENTS: { pageId: 7, pageName: 'InventoryAdjustment', moduleId: 3 },
  
  // Purchases
  PURCHASE_ORDERS: { pageId: 1, pageName: 'Purchase Order', moduleId: 2 },
  PURCHASES: { pageId: 2, pageName: 'Purchase', moduleId: 2 },
  SUPPLIERS: { pageId: 15, pageName: 'Suppliers', moduleId: 2 },
  
  // POS
  POS_SCREENS: { pageId: 16, pageName: 'PosScreens', moduleId: 1 },
  PAYMENT_METHODS: { pageId: 17, pageName: 'PaymentMethods', moduleId: 1 },
  POS_PRODUCTS: { pageId: 21, pageName: 'PosProducts', moduleId: 1 },
 ADDITION_PRODUCTS: {pageId:22, pageName:'AddisionProducts', moduleId: 1 },
  // Accounting
  ACCOUNTS: { pageId: 18, pageName: 'Accounts', moduleId: 5 },
  SAFES: { pageId: 19, pageName: 'Safes', moduleId: 5 },
  
  // Reports
  REPORTS: { pageId: 20, pageName: 'Reports', moduleId: 6 },
  
  // Sales
  SALES: { pageId: 4, pageName: 'Sale', moduleId: 1 },
  SALE_RETURNS: { pageId: 5, pageName: 'SaleReturn', moduleId: 1 },
} as const;
