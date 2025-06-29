// File: src/utils/pageWrapper.tsx
import React from 'react';
import withPermissions from 'src/hoc/withPermissions';
import { PAGE_PERMISSIONS } from 'src/config/pagePermissions';

// ⭐ مفتاح تعطيل مؤقت
const DISABLE_PROTECTION = true;

export const createProtectedPage = (
  Component: React.ComponentType<any>,
  permissionKey: keyof typeof PAGE_PERMISSIONS
) => {
  // إذا التحكم معطل، ارجع المكون بدون حماية
  if (DISABLE_PROTECTION) {
    const UnprotectedWrapper: React.FC<any> = (props) => {
      const allPermissions = {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
        canImport: true,
        canView: true,
      };
      
      return <Component {...props} {...allPermissions} />;
    };
    
    return UnprotectedWrapper;
  }
  
  // الحماية العادية
  const config = PAGE_PERMISSIONS[permissionKey];
  return withPermissions(Component, config);
};

export const createCustomProtectedPage = (
  Component: React.ComponentType<any>,
  config: {
    pageId?: number;
    pageName?: string;
    moduleId?: number;
    requiredPermissions?: string[];
  }
) => {
  if (DISABLE_PROTECTION) {
    const UnprotectedWrapper: React.FC<any> = (props) => {
      const allPermissions = {
        canAdd: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
        canImport: true,
        canView: true,
      };
      
      return <Component {...props} {...allPermissions} />;
    };
    
    return UnprotectedWrapper;
  }
  
  return withPermissions(Component, config);
};
