// File: src/hoc/withPermissions.tsx
import React from 'react';
import { useAuth } from 'src/contexts/AuthContext';
import { usePermissions } from 'src/hooks/usePermissions';
import UnauthorizedPage from 'src/Pages/errors/UnauthorizedPage';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PermissionConfig {
  pageName?: string;
  pageId?: number;
  moduleId?: number;
  requiredPermissions?: string[];
}

const withPermissions = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: PermissionConfig
) => {
  const PermissionWrapper: React.FC<P> = (props) => {
    const { hasPageAccess, canAccessModule, isLoading: authLoading } = useAuth();
    const { hasPermission, loading: permLoading } = usePermissions();

    // Loading state
    if (authLoading || permLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography>جاري التحقق من الصلاحيات...</Typography>
        </Box>
      );
    }

    // التحقق من صلاحية الصفحة
    if (config.pageName && !hasPageAccess(config.pageName)) {
      return <UnauthorizedPage />;
    }

    // التحقق من صلاحية الوحدة
    if (config.moduleId && !canAccessModule(config.moduleId)) {
      return <UnauthorizedPage />;
    }

    // التحقق من صلاحيات محددة
    if (config.pageId && config.requiredPermissions) {
      const hasAllPermissions = config.requiredPermissions.every(permission =>
        hasPermission(config.pageId!, permission)
      );
      
      if (!hasAllPermissions) {
        return <UnauthorizedPage />;
      }
    }

    // إضافة الصلاحيات كـ props للمكون
    const permissionProps = {
      canAdd: config.pageId ? hasPermission(config.pageId, 'Add') : true,
      canEdit: config.pageId ? hasPermission(config.pageId, 'Edit') : true,
      canDelete: config.pageId ? hasPermission(config.pageId, 'Delete') : true,
      canExport: config.pageId ? hasPermission(config.pageId, 'Export') : true,
      canImport: config.pageId ? hasPermission(config.pageId, 'Import') : true,
      canView: config.pageId ? hasPermission(config.pageId, 'View') : true,
    };

    return <WrappedComponent {...props} {...permissionProps} />;
  };

  PermissionWrapper.displayName = `withPermissions(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return PermissionWrapper;
};

export default withPermissions;
