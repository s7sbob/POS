/* --------------------------------------------------------------------------
 * Sidebar Menu Configuration
 * --------------------------------------------------------------------------
 * Match the visual hierarchy shown in the reference screenshots (Inventory →
 * Reports) while preserving the first two Admin Dashboard links.  All strings
 * are provided as i18n keys (eg. "sidebar.inventory") so that `react-i18next`
 * can supply Arabic ↔︎ English translations at runtime.
 * --------------------------------------------------------------------------*/

import { uniqueId } from 'lodash';
import {
  // IconDashboard,
  IconPackage,
  IconLayoutGridAdd,
  // IconClock,
  // IconTrendingDown,
  // IconCategory,
  // IconHierarchy2,
  // IconTrademark,
  // IconRuler,
  IconAdjustments,
  // IconCertificate,
  // IconBarcode,
  // IconQrcode,
  IconStack3,
  // IconArrowsShuffle,
  // IconShoppingCart,
  // IconFileInvoice,
  // IconRotate,
  // IconFileText,
  // IconPoint,
  // IconTicket,
  // IconGift,
  // IconDiscount2,
  // IconTruck,
  // IconBoxSeam,
  // IconArrowBackUp,
  // IconCash,
  // IconReport,
  // IconBan,
  // IconTransfer,
  // IconLane,
  // IconNews,
  // IconUsers,
  // IconBuildingStore,
  IconBuildingWarehouse,
  IconTruck,
  IconUsers,
  // IconUser,
  // IconBriefcase,
  // IconClockHour3,
  // IconCalendar,
  // IconWallet,
  // IconListDetails,
  // IconChartLine,
  // IconChartHistogram,
  // IconChartPie,
  // IconChartCandle
} from '@tabler/icons-react';

interface MenuItem {
  id: string;
  title?: string;
  // i18n translation key; if omitted, `title` is treated as the key itself
  tKey?: string;
  icon?: any;
  href?: string;
  navlabel?: boolean;
  subheader?: string; // i18n key for section heading
  children?: MenuItem[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  disabled?: boolean;
}


const SidebarConfig: MenuItem[] = [
  /* ---------------------------------------------------------------------- */
  /*  Core Dashboards                                                        */
  /* ---------------------------------------------------------------------- */
  // {
  //   id: uniqueId(),
  //   title: 'Admin dashboard',
  //   icon: IconDashboard,
  //   href: '/dashboards/modern',
  //   chip: 'New',
  //   chipColor: 'secondary'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Admin dashboard 2',
  //   icon: IconDashboard,
  //   href: '/dashboards/ecommerce'
  // },

  /* ---------------------------------------------------------------------- */
  /*  Inventory                                                             */
  /* ---------------------------------------------------------------------- */
  {  title: 'sidebar.inventory', id: uniqueId() ,    icon: IconBuildingWarehouse,
           href: '/inventory/warehouses'
, children: [

{    id: uniqueId(),
    title: 'sidebar.data',
    icon: IconLayoutGridAdd,
    href: '/inventory/data',
children: [
  {
    id: uniqueId(),
    title: 'sidebar.warehouses',
    icon: IconBuildingWarehouse,
    href: '/inventory/warehouses'
  },
  {
    id: uniqueId(),
    title: 'sidebar.units',
    icon: IconAdjustments,
    href: '/inventory/units'
  },
    {
    id: uniqueId(),
    title: 'groups.title',
    icon: IconLayoutGridAdd,
    href: '/inventory/groups'
  },
  {
    id: uniqueId(),
    title: 'sidebar.products',
    icon: IconPackage,
    href: '/inventory/products'
  },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.createProduct',
  //   icon: IconLayoutGridAdd,
  //   href: '/inventory/products/create'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.expiredProducts',
  //   icon: IconClock,
  //   href: '/inventory/products/expired'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.lowStocks',
  //   icon: IconTrendingDown,
  //   href: '/inventory/products/low-stock'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.category',
  //   icon: IconCategory,
  //   href: '/inventory/category'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.subCategory',
  //   icon: IconHierarchy2,
  //   href: '/inventory/sub-category'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.brands',
  //   icon: IconTrademark,
  //   href: '/inventory/brands'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.units',
  //   icon: IconRuler,
  //   href: '/inventory/units'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.variantAttributes',
  //   icon: IconAdjustments,
  //   href: '/inventory/variants'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.warranties',
  //   icon: IconCertificate,
  //   href: '/inventory/warranties'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.printBarcode',
  //   icon: IconBarcode,
  //   href: '/inventory/barcode'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.printQrCode',
  //   icon: IconQrcode,
  //   href: '/inventory/qrcode'
  // }
]
  },
  {
    id: uniqueId(),
    title: 'sidebar.transactions',
    icon: IconStack3,
    href: '/inventory/Transactions'
  },
  {
    id: uniqueId(),
    title: 'sidebar.reports',
    icon: IconAdjustments,
    href: '/inventory/reports'
  }
] },


  {  title: 'sidebar.purchases', id: uniqueId() ,    icon: IconTruck,
           href: '/inventory/purchases'
, children: [

{    id: uniqueId(),
    title: 'sidebar.data',
    icon: IconLayoutGridAdd,
    href: '/inventory/data',
children: [
  {
    id: uniqueId(),
    title: 'sidebar.suppliers',
    icon: IconUsers,
    href: '/inventory/suppliers'
  },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.createProduct',
  //   icon: IconLayoutGridAdd,
  //   href: '/inventory/products/create'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.expiredProducts',
  //   icon: IconClock,
  //   href: '/inventory/products/expired'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.lowStocks',
  //   icon: IconTrendingDown,
  //   href: '/inventory/products/low-stock'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.category',
  //   icon: IconCategory,
  //   href: '/inventory/category'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.subCategory',
  //   icon: IconHierarchy2,
  //   href: '/inventory/sub-category'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.brands',
  //   icon: IconTrademark,
  //   href: '/inventory/brands'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.units',
  //   icon: IconRuler,
  //   href: '/inventory/units'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.variantAttributes',
  //   icon: IconAdjustments,
  //   href: '/inventory/variants'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.warranties',
  //   icon: IconCertificate,
  //   href: '/inventory/warranties'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.printBarcode',
  //   icon: IconBarcode,
  //   href: '/inventory/barcode'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.printQrCode',
  //   icon: IconQrcode,
  //   href: '/inventory/qrcode'
  // }
]
  },
  {
    id: uniqueId(),
    title: 'sidebar.transactions',
    icon: IconStack3,
    href: '/inventory/Transactions'
  },
  {
    id: uniqueId(),
    title: 'sidebar.reports',
    icon: IconAdjustments,
    href: '/inventory/reports'
  }
] },



  // /* ---------------------------------------------------------------------- */
  // /*  Stock                                                                 */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.stock', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.manageStock',
  //   icon: IconStack3,
  //   href: '/stock/manage'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.stockAdjustment',
  //   icon: IconAdjustments,
  //   href: '/stock/adjustment'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.stockTransfer',
  //   icon: IconArrowsShuffle,
  //   href: '/stock/transfer'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Sales                                                                 */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.sales', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.sales',
  //   icon: IconShoppingCart,
  //   href: '/sales'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.invoices',
  //   icon: IconFileInvoice,
  //   href: '/sales/invoices'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.salesReturn',
  //   icon: IconRotate,
  //   href: '/sales/returns'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.quotation',
  //   icon: IconFileText,
  //   href: '/sales/quotation'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.pos',
  //   icon: IconPoint,
  //   href: '/pos'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Promo                                                                 */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.promo', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.coupons',
  //   icon: IconTicket,
  //   href: '/promo/coupons'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.giftCards',
  //   icon: IconGift,
  //   href: '/promo/gift-cards'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.discount',
  //   icon: IconDiscount2,
  //   href: '/promo/discount'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Purchases                                                             */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.purchases', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.purchases',
  //   icon: IconTruck,
  //   href: '/purchases'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.purchaseOrder',
  //   icon: IconBoxSeam,
  //   href: '/purchases/order'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.purchaseReturn',
  //   icon: IconArrowBackUp,
  //   href: '/purchases/return'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Finance & Accounts                                                    */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.finance', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.expenses',
  //   icon: IconCash,
  //   href: '/finance/expenses'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.income',
  //   icon: IconReport,
  //   href: '/finance/income'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.bankAccounts',
  //   icon: IconBan,
  //   href: '/finance/banks'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.moneyTransfer',
  //   icon: IconTransfer,
  //   href: '/finance/transfer'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.balanceSheet',
  //   icon: IconLane,
  //   href: '/finance/balance-sheet'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.trialBalance',
  //   icon: IconNews,
  //   href: '/finance/trial-balance'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.cashFlow',
  //   icon: IconWallet,
  //   href: '/finance/cash-flow'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.accountStatement',
  //   icon: IconListDetails,
  //   href: '/finance/account-statement'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Peoples                                                               */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.peoples', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.customers',
  //   icon: IconUsers,
  //   href: '/peoples/customers'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.billers',
  //   icon: IconUsers,
  //   href: '/peoples/billers'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.suppliers',
  //   icon: IconUsers,
  //   href: '/peoples/suppliers'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.stores',
  //   icon: IconBuildingStore,
  //   href: '/peoples/stores'
  // },


  // /* ---------------------------------------------------------------------- */
  // /*  HRM                                                                   */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.hrm', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.employees',
  //   icon: IconUser,
  //   href: '/hrm/employees'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.departments',
  //   icon: IconBriefcase,
  //   href: '/hrm/departments'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.designation',
  //   icon: IconBriefcase,
  //   href: '/hrm/designations'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.shifts',
  //   icon: IconClockHour3,
  //   href: '/hrm/shifts'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.attendance',
  //   icon: IconCalendar,
  //   href: '/hrm/attendance'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.leaves',
  //   icon: IconCalendar,
  //   href: '/hrm/leaves'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.holidays',
  //   icon: IconCalendar,
  //   href: '/hrm/holidays'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.payroll',
  //   icon: IconCash,
  //   href: '/hrm/payroll'
  // },

  // /* ---------------------------------------------------------------------- */
  // /*  Reports                                                               */
  // /* ---------------------------------------------------------------------- */
  // { navlabel: true, subheader: 'sidebar.reports', id: uniqueId() },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.salesReport',
  //   icon: IconChartLine,
  //   href: '/reports/sales'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.purchaseReport',
  //   icon: IconChartHistogram,
  //   href: '/reports/purchases'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.inventoryReport',
  //   icon: IconChartHistogram,
  //   href: '/reports/inventory'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.invoiceReport',
  //   icon: IconReport,
  //   href: '/reports/invoices'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.supplierReport',
  //   icon: IconReport,
  //   href: '/reports/suppliers'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.customerReport',
  //   icon: IconReport,
  //   href: '/reports/customers'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.productReport',
  //   icon: IconReport,
  //   href: '/reports/products'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.expenseReport',
  //   icon: IconChartPie,
  //   href: '/reports/expenses'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.incomeReport',
  //   icon: IconChartPie,
  //   href: '/reports/income'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.taxReport',
  //   icon: IconChartPie,
  //   href: '/reports/tax'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.profitLoss',
  //   icon: IconChartCandle,
  //   href: '/reports/profit-loss'
  // },
  // {
  //   id: uniqueId(),
  //   title: 'sidebar.annualReport',
  //   icon: IconChartCandle,
  //   href: '/reports/annual'
  // }
];

export default SidebarConfig;