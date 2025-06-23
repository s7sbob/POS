// File: src/components/PermissionGuard.tsx
import React from 'react';
import { usePermissions } from 'src/hooks/usePermissions';

interface Props {
  children: React.ReactNode;
  pageId: number;
  permission: string;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<Props> = ({ 
  children, 
  pageId, 
  permission, 
  fallback = null 
}) => {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!hasPermission(pageId, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
