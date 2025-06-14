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
  IconPackage,
  IconLayoutGridAdd,
  IconAdjustments,
  IconStack3,
  IconBuildingWarehouse,
  IconTruck,
  IconUsers,

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
, children: [
      {
        id: uniqueId(),
        title: 'sidebar.productBalance',
        icon: IconPackage,
        href: '/reports/product-balance'
      },
    ]
  }
] },


  {  title: 'sidebar.purchases', id: uniqueId() ,    icon: IconTruck,
           href: '/purchases/purchases'
, children: [

{    id: uniqueId(),
    title: 'sidebar.data',
    icon: IconLayoutGridAdd,
    href: '/purchases/data',
children: [
  {
    id: uniqueId(),
    title: 'sidebar.suppliers',
    icon: IconUsers,
    href: '/purchases/suppliers'
  },


]
  },
  {
    id: uniqueId(),
    title: 'sidebar.transactions',
    icon: IconStack3,
    href: '/inventory/Transactions',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.purchaseOrders',
        icon: IconLayoutGridAdd,
        href: '/purchases/purchase-orders'
      },
      {
        id: uniqueId(),
        title: 'sidebar.purchases',
        icon: IconLayoutGridAdd,
        href: '/purchases/purchases'
      }]
  },
  {
    id: uniqueId(),
    title: 'sidebar.reports',
    icon: IconAdjustments,
    href: '/inventory/reports'
  }
] },

];

export default SidebarConfig;