// File: src/routes/Router.tsx
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { lazy } from 'react';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { authLoader } from './authLoader';
import { createProtectedPage } from 'src/utils/pageWrapper';
import DeliveryAgentsPage from 'src/Pages/pos/delivery/agents/DeliveryAgentsPage';
import DeliveryZonesPage from 'src/Pages/pos/delivery/zones/DeliveryZonesPage';
import TableSectionsPage from 'src/Pages/pos/table-sections/TableSectionsPage';
import PrinterSettingsPage from 'src/Pages/settings/components/PrinterSettings';
import HallCaptainsPage from 'src/Pages/pos/hall-captains/HallCaptainsPage';
import CustomersPage from 'src/Pages/pos/customers/CustomersPage';
import OffersPage from 'src/Pages/pos/offers/OffersPage';
import DeliveryCompaniesPage from 'src/Pages/pos/delivery/companies/DeliveryCompaniesPage';
import LandingPage from 'src/Pages/landing/LandingPage';
// import SalesPage from 'src/Pages/pos/sales/SalesPage';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Dashboard***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

/* ****Auth Pages***** */
const Login = Loadable(lazy(() => import('../Pages/auth/LoginPage')));
const BranchSelection = Loadable(lazy(() => import('../Pages/auth/BranchSelectionPage')));
const Register = Loadable(lazy(() => import('../Pages/auth/RegisterPage')));

/* ****Error Pages***** */
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Unauthorized = Loadable(lazy(() => import('../Pages/errors/UnauthorizedPage')));
const NoBranches = Loadable(lazy(() => import('../Pages/errors/NoBranchesPage')));

/* ****تحميل الصفحات الأصلية***** */
const UsersManagementOriginal = Loadable(lazy(() => import('../Pages/users/UsersManagementPage')));
const CompanySettingsOriginal = Loadable(lazy(() => import('../Pages/company/CompanySettingsPage')));
const PermissionsPageOriginal = Loadable(lazy(() => import('../Pages/permissions/PermissionsPage')));
const ProductsPageOriginal = Loadable(lazy(() => import('../Pages/products/ProductsPage')));
const GroupsPageOriginal = Loadable(lazy(() => import('../Pages/groups/GroupsPage')));
const UnitsPageOriginal = Loadable(lazy(() => import('../Pages/units/UnitsPage')));
const PosScreensPageOriginal = Loadable(lazy(() => import('../Pages/pos/screens/PosScreensPage')));
const PosPaymentMethodsPageOriginal = Loadable(lazy(() => import('../Pages/pos/payment-methods/PosPaymentMethodsPage')));
const SuppliersPageOriginal = Loadable(lazy(() => import('../Pages/suppliers/SuppliersPage')));
const WarehousesPageOriginal = Loadable(lazy(() => import('../Pages/warehouses/WarehousesPage')));
const AccountsPageOriginal = Loadable(lazy(() => import('../Pages/accounts/AccountsPage')));
const SafesPageOriginal = Loadable(lazy(() => import('../Pages/safes/SafesPage')));
const AdjustmentsListPageOriginal = Loadable(lazy(() => import('../Pages/inventory/adjustments-list/AdjustmentsListPage')));
const InventoryAdjustmentPageOriginal = Loadable(lazy(() => import('../Pages/inventory/adjustments-list/InventoryAdjustmentPage')));
const AdjustmentViewPageOriginal = Loadable(lazy(() => import('../Pages/inventory/adjustments-list/components/AdjustmentViewPage')));
const PurchaseOrdersPageOriginal = Loadable(lazy(() => import('../Pages/purchase-orders/PurchaseOrdersPage')));
const AddPurchaseOrderPageOriginal = Loadable(lazy(() => import('../Pages/purchase-orders/AddPurchaseOrderPage')));
const EditPurchaseOrderPageOriginal = Loadable(lazy(() => import('../Pages/purchase-orders/EditPurchaseOrderPage')));
const PurchasesPageOriginal = Loadable(lazy(() => import('../Pages/purchases/PurchasesPage')));
const AddPurchasePageOriginal = Loadable(lazy(() => import('../Pages/purchases/AddPurchasePage')));
const EditPurchasePageOriginal = Loadable(lazy(() => import('../Pages/purchases/EditPurchasePage')));
const ViewPurchasePageOriginal = Loadable(lazy(() => import('../Pages/purchases/components/ViewPurchasePage')));
const ProductBalanceReportPageOriginal = Loadable(lazy(() => import('../Pages/reports/ProductBalanceReportPage')));
const PosProductsPageOriginal = Loadable(lazy(() => import('../Pages/pos/products/PosProductsPage')));
const AdditionProductsPage = Loadable(lazy(() => import('../Pages/pos/additions/AdditionProductsPage')))
const SalesPage2 = Loadable(lazy(() => import('../Pages/pos/newSales/index')));
/* ****إنشاء الصفحات المحمية***** */
const UsersManagement = createProtectedPage(UsersManagementOriginal, 'USERS');
const CompanySettings = createProtectedPage(CompanySettingsOriginal, 'COMPANY');
const PermissionsPage = createProtectedPage(PermissionsPageOriginal, 'PERMISSIONS');
const ProductsPage = createProtectedPage(ProductsPageOriginal, 'PRODUCTS');
const GroupsPage = createProtectedPage(GroupsPageOriginal, 'GROUPS');
const UnitsPage = createProtectedPage(UnitsPageOriginal, 'UNITS');
const PosScreensPage = createProtectedPage(PosScreensPageOriginal, 'POS_SCREENS');
const PosPaymentMethodsPage = createProtectedPage(PosPaymentMethodsPageOriginal, 'PAYMENT_METHODS');
const SuppliersPage = createProtectedPage(SuppliersPageOriginal, 'SUPPLIERS');
const WarehousesPage = createProtectedPage(WarehousesPageOriginal, 'WAREHOUSES');
const AccountsPage = createProtectedPage(AccountsPageOriginal, 'ACCOUNTS');
const SafesPage = createProtectedPage(SafesPageOriginal, 'SAFES');
const AdjustmentsListPage = createProtectedPage(AdjustmentsListPageOriginal, 'INVENTORY_ADJUSTMENTS');
const InventoryAdjustmentPage = createProtectedPage(InventoryAdjustmentPageOriginal, 'INVENTORY_ADJUSTMENTS');
const AdjustmentViewPage = createProtectedPage(AdjustmentViewPageOriginal, 'INVENTORY_ADJUSTMENTS');
const PurchaseOrdersPage = createProtectedPage(PurchaseOrdersPageOriginal, 'PURCHASE_ORDERS');
const AddPurchaseOrderPage = createProtectedPage(AddPurchaseOrderPageOriginal, 'PURCHASE_ORDERS');
const EditPurchaseOrderPage = createProtectedPage(EditPurchaseOrderPageOriginal, 'PURCHASE_ORDERS');
const PurchasesPage = createProtectedPage(PurchasesPageOriginal, 'PURCHASES');
const AddPurchasePage = createProtectedPage(AddPurchasePageOriginal, 'PURCHASES');
const EditPurchasePage = createProtectedPage(EditPurchasePageOriginal, 'PURCHASES');
const ViewPurchasePage = createProtectedPage(ViewPurchasePageOriginal, 'PURCHASES');
const ProductBalanceReportPage = createProtectedPage(ProductBalanceReportPageOriginal, 'REPORTS');
const PosProductsPage = createProtectedPage(PosProductsPageOriginal, 'POS_PRODUCTS');
const AdditionProducts = createProtectedPage(AdditionProductsPage, 'ADDITION_PRODUCTS');
const Router = [

  {
  path: "/",
  element: <LandingPage />,
  exact: true
},
{
  path: "/landing",
  element: <LandingPage />,
},
{
  path: '/',
  element: <FullLayout />,
  loader: authLoader,
  children: [
      // Dashboard Routes
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', element: <ModernDash /> },
      { path: '/dashboards/modern', element: <ModernDash /> },
      {path: '/settings/printer', element: <PrinterSettingsPage />},

      // User Management Routes
      { path: '/users', element: <UsersManagement /> },
      { path: '/company', element: <CompanySettings /> },
      { path: '/permissions', element: <PermissionsPage /> },
 
      // Product Management Routes
      { path: '/products', element: <ProductsPage /> },
      { path: '/inventory/products', element: <ProductsPage /> },
      { path: '/groups', element: <GroupsPage /> },
      { path: '/inventory/groups', element: <GroupsPage /> },
      { path: '/units', element: <UnitsPage /> },
      { path: '/inventory/units', element: <UnitsPage /> },

      // POS System Routes
      { path: '/pos/screens', element: <PosScreensPage /> },
      { path: '/pos/payment-methods', element: <PosPaymentMethodsPage /> },
      { path: '/pos/products', element: <PosProductsPage /> },
      { path: '/addition/products', element: <AdditionProducts /> },
      { path: '/pos/delivery/agents', element: <DeliveryAgentsPage /> },
      { path: '/pos/delivery/zones', element: <DeliveryZonesPage /> },
      { path: '/pos/table-sections', element: <TableSectionsPage /> },
      { path: '/pos/hall-captains', element: <HallCaptainsPage /> },
      { path: '/pos/customers', element: <CustomersPage /> },
      // Offers and Delivery Companies
      { path: '/pos/offers', element: <OffersPage /> },
      { path: '/pos/delivery/companies', element: <DeliveryCompaniesPage /> },
      // Business Entities Routes
      { path: '/suppliers', element: <SuppliersPage /> },
      { path: '/purchases/suppliers', element: <SuppliersPage /> },
      { path: '/warehouses', element: <WarehousesPage /> },
      { path: '/inventory/warehouses', element: <WarehousesPage /> },

      // Financial Routes
      { path: '/accounts', element: <AccountsPage /> },
      { path: '/accounting/accounts', element: <AccountsPage /> },
      { path: '/safes', element: <SafesPage /> },
      { path: '/accounting/safes', element: <SafesPage /> },

      // Inventory Routes
      { path: '/inventory/adjustments', element: <AdjustmentsListPage /> },
      { path: '/inventory/inventory-adjustments', element: <AdjustmentsListPage /> },
      { path: '/inventory/inventory-adjustments/new', element: <InventoryAdjustmentPage /> },
      { path: '/inventory/inventory-adjustments/:id', element: <AdjustmentViewPage /> },

      // Purchase Routes
      { path: '/purchase-orders', element: <PurchaseOrdersPage /> },
      { path: '/purchases/purchase-orders', element: <PurchaseOrdersPage /> },
      { path: '/purchases/purchase-orders/add', element: <AddPurchaseOrderPage /> },
      { path: '/purchases/purchase-orders/edit/:id', element: <EditPurchaseOrderPage /> },
      { path: '/purchases', element: <PurchasesPage /> },
      { path: '/purchases/purchases', element: <PurchasesPage /> },
      { path: '/purchases/purchases/add', element: <AddPurchasePage /> },
      { path: '/purchases/purchases/edit/:id', element: <EditPurchasePage /> },
      { path: '/purchases/purchases/view/:id', element: <ViewPurchasePage /> },

      // Reports Routes
      { path: '/reports/product-balance', element: <ProductBalanceReportPage /> },

      // Fallback for protected routes
      { path: '*', element: <Navigate to="/dashboard" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      // Auth Routes
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/branch-selection', element: <BranchSelection /> },
      { path: '/auth/register', element: <Register /> },
      // { path: '/pos/sales', element: <SalesPage /> },
      // Error Routes
      { path: '/auth/404', element: <Error /> },
      { path: '/unauthorized', element: <Unauthorized /> },
      { path: '/auth/no-branches', element: <NoBranches /> },
      { path: '/pos/sales', element: <SalesPage2 /> },
      // Fallback for public routes
      { path: '*', element: <Navigate to="/auth/login" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
