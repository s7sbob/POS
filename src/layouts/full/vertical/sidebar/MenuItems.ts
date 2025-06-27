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
  IconBuildingWarehouse,
  IconTruck,
  IconUsers,
  IconDots,
  IconBuilding,
  IconSettings,
  IconShield,
  IconWallet,
  IconPigMoney,
  IconDeviceDesktop,
  IconCreditCard,
  IconRuler,
  IconTags,
  IconChartBar,
  IconFileText,
  IconShoppingCart,
  IconClipboardList,
  IconComponents,
  IconMapPin
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
  /*  System Administration                                                 */
  /* ---------------------------------------------------------------------- */
  {
    title: 'sidebar.systemAdmin',
    id: uniqueId(),
    icon: IconSettings,
    href: '/admin',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.userManagement',
        icon: IconUsers,
        href: '/users'
      },
      {
        id: uniqueId(),
        title: 'sidebar.companySettings',
        icon: IconBuilding,
        href: '/company'
      },
      {
        id: uniqueId(),
        title: 'sidebar.permissions',
        icon: IconShield,
        href: '/permissions'
      }
    ]
  },

  /* ---------------------------------------------------------------------- */
  /*  Inventory                                                             */
  /* ---------------------------------------------------------------------- */
  {
    title: 'sidebar.inventory',
    id: uniqueId(),
    icon: IconBuildingWarehouse,
    href: '/inventory/warehouses',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.data',
        icon: IconDots,
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
            icon: IconRuler,
            href: '/inventory/units'
          },
          {
            id: uniqueId(),
            title: 'groups.title',
            icon: IconTags,
            href: '/inventory/groups'
          },
          {
            id: uniqueId(),
            title: 'sidebar.products',
            icon: IconPackage,
            href: '/inventory/products'
          }
        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.transactions',
        icon: IconDots,
        href: '/inventory/transactions',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.inventoryadjustments',
            icon: IconClipboardList,
            href: '/inventory/inventory-adjustments'
          }
        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.reports',
        icon: IconDots,
        href: '/inventory/reports',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.productBalance',
            icon: IconChartBar,
            href: '/reports/product-balance'
          }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------------- */
  /*  Purchases                                                             */
  /* ---------------------------------------------------------------------- */
  {
    title: 'sidebar.purchases',
    id: uniqueId(),
    icon: IconTruck,
    href: '/purchases/purchases',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.data',
        icon: IconDots,
        href: '/purchases/data',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.suppliers',
            icon: IconUsers,
            href: '/purchases/suppliers'
          }
        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.transactions',
        icon: IconDots,
        href: '/purchases/transactions',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.purchaseOrders',
            icon: IconFileText,
            href: '/purchases/purchase-orders'
          },
          {
            id: uniqueId(),
            title: 'sidebar.purchases',
            icon: IconShoppingCart,
            href: '/purchases/purchases'
          }
        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.reports',
        icon: IconDots,
        href: '/purchases/reports'
      }
    ]
  },

  /* ---------------------------------------------------------------------- */
  /*  Accounting                                                            */
  /* ---------------------------------------------------------------------- */
  {
    title: 'sidebar.accounting',
    id: uniqueId(),
    icon: IconWallet,
    href: '/accounting',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.data',
        icon: IconDots,
        href: '/accounting/data',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.accounts',
            icon: IconWallet,
            href: '/accounting/accounts'
          },
          {
            id: uniqueId(),
            title: 'sidebar.safes',
            icon: IconPigMoney,
            href: '/accounting/safes'
          }
        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.transactions',
        icon: IconDots,
        href: '/accounting/transactions'
      },
      {
        id: uniqueId(),
        title: 'sidebar.reports',
        icon: IconDots,
        href: '/accounting/reports'
      }
    ]
  },

  /* ---------------------------------------------------------------------- */
  /*  POS System                                                            */
  /* ---------------------------------------------------------------------- */
  {
    title: 'sidebar.pos',
    id: uniqueId(),
    icon: IconDeviceDesktop,
    href: '/pos',
    children: [
      {
        id: uniqueId(),
        title: 'sidebar.data',
        icon: IconDots,
        href: '/pos/data',
        children: [
          {
            id: uniqueId(),
            title: 'sidebar.paymentMethods',
            icon: IconCreditCard,
            href: '/pos/payment-methods'
          },
          {
            id: uniqueId(),
            title: 'sidebar.screens',
            icon: IconDeviceDesktop,
            href: '/pos/screens'
          },
          {
            id: uniqueId(),
            title: 'sidebar.posProducts',
            icon: IconPackage,
            href: '/pos/products'
          },
          {
            id: uniqueId(),
            title: 'sidebar.additionProducts',
            icon: IconComponents,
            href: '/addition/products'
          },
          {
            id: uniqueId(),
            title: 'sidebar.deliveryAgents',
            icon: IconTruck,
            href: '/pos/delivery/agents'
          },
                    {
            id: uniqueId(),
            title: 'sidebar.deliveryZones',
            icon: IconMapPin,
            href: '/pos/delivery/zones'
          },

        ]
      },
      {
        id: uniqueId(),
        title: 'sidebar.transactions',
        icon: IconDots,
        href: '/pos/transactions'
      },
      {
        id: uniqueId(),
        title: 'sidebar.reports',
        icon: IconDots,
        href: '/pos/reports'
      }
    ]
  }
];

export default SidebarConfig;
