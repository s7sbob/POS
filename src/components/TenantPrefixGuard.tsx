// File: src/components/TenantPrefixGuard.tsx
import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

/**
 * TenantPrefixGuard ensures that a tenant prefix is present in the URL.  When
 * the current route does not contain a `tenantId` parameter (e.g. the user
 * navigated directly to `/auth/login` or `/pos/sales`), this component
 * checks localStorage for a saved tenant identifier (`tenant_id`).  If one
 * exists it redirects the user to the same path but prefixed with the
 * saved tenant.  Otherwise it leaves the URL unchanged.  This allows
 * navigation throughout the app using relative or absolute paths even
 * when the tenant prefix is omitted.
 */
const TenantPrefixGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenantId } = useParams<{ tenantId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTenant = localStorage.getItem('tenant_id');
    // Define a list of reserved top-level path prefixes which should not be
    // interpreted as tenant identifiers.  These correspond to application
    // modules defined in the router (e.g. "inventory", "pos", "settings").
    const reservedPrefixes = [
      'auth', 'pos', 'inventory', 'settings', 'users', 'company', 'permissions',
      'hr', 'products', 'groups', 'units', 'addition', 'suppliers', 'purchases',
      'warehouses', 'accounts', 'accounting', 'safes', 'purchase-orders',
      'reports', 'print-test', 'dashboards', 'dashboard', 'purchase', 'purchases',
      'suppliers', 'warehouses'
    ];

    if (tenantId) {
      const tenantLower = tenantId.toLowerCase();
      if (reservedPrefixes.includes(tenantLower)) {
        // The first path segment matches a reserved route, so treat this as
        // missing tenantId and attempt to prefix the saved tenant (if any).
        if (savedTenant) {
          // Avoid duplicate prefix if it already exists.
          if (!location.pathname.startsWith(`/${savedTenant}`)) {
            const newPath = `/${savedTenant}${location.pathname}`;
            navigate(newPath, { replace: true });
          }
        }
        return;
      }
      // Not a reserved prefix: update the saved tenant if different.
      if (savedTenant !== tenantId) {
        localStorage.setItem('tenant_id', tenantId);
      }
    } else {
      // tenantId is not in URL.  If a tenant is saved, prefix it to the path.
      if (savedTenant) {
        if (!location.pathname.startsWith(`/${savedTenant}`)) {
          const newPath = `/${savedTenant}${location.pathname}`;
          navigate(newPath, { replace: true });
        }
      }
    }
  }, [tenantId, location.pathname, navigate]);

  return <>{children}</>;
};

export default TenantPrefixGuard;