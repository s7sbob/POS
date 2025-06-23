// File: src/utils/pageWrapper.tsx
import React from 'react';
import withPermissions from 'src/hoc/withPermissions';
import { PAGE_PERMISSIONS } from 'src/config/pagePermissions';

// دالة لتطبيق الصلاحيات تلقائياً على الصفحات
export const createProtectedPage = (
  Component: React.ComponentType<any>,
  permissionKey: keyof typeof PAGE_PERMISSIONS
) => {
  const config = PAGE_PERMISSIONS[permissionKey];
  return withPermissions(Component, config);
};

// دالة مساعدة لإنشاء صفحة محمية مع صلاحيات مخصصة
export const createCustomProtectedPage = (
  Component: React.ComponentType<any>,
  config: {
    pageId?: number;
    pageName?: string;
    moduleId?: number;
    requiredPermissions?: string[];
  }
) => {
  return withPermissions(Component, config);
};
