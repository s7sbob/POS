// File: src/hooks/usePermissions.ts
import { useState, useEffect } from 'react';
import { useAuth } from 'src/contexts/AuthContext';
import { getUserPagePermission, PagePermission } from 'src/utils/api/authApi';

interface UsePermissionsReturn {
  permissions: { [pageId: number]: PagePermission[] };
  loading: boolean;
  hasPermission: (pageId: number, permissionName: string) => boolean;
  canView: (pageId: number) => boolean;
  canAdd: (pageId: number) => boolean;
  canEdit: (pageId: number) => boolean;
  canDelete: (pageId: number) => boolean;
  canExport: (pageId: number) => boolean;
  canImport: (pageId: number) => boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { userPages } = useAuth();
  const [permissions, setPermissions] = useState<{ [pageId: number]: PagePermission[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setLoading(true);
        const permissionsData: { [pageId: number]: PagePermission[] } = {};
        
        for (const page of userPages) {
          if (page.hasAccess) {
            try {
              const pagePermissions = await getUserPagePermission(page.pageId);
              permissionsData[page.pageId] = pagePermissions;
            } catch (error) {
              console.error(`Error loading permissions for page ${page.pageId}:`, error);
              permissionsData[page.pageId] = [];
            }
          }
        }
        
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userPages.length > 0) {
      loadPermissions();
    } else {
      setLoading(false);
    }
  }, [userPages]);

  // التحقق من صلاحية معينة
  const hasPermission = (pageId: number, permissionName: string): boolean => {
    const pagePermissions = permissions[pageId];
    if (!pagePermissions) return false;
    
    const permission = pagePermissions.find(p => p.permissionName === permissionName);
    return permission?.hasPermission || false;
  };

  // صلاحيات شائعة
  const canView = (pageId: number) => hasPermission(pageId, 'View');
  const canAdd = (pageId: number) => hasPermission(pageId, 'Add');
  const canEdit = (pageId: number) => hasPermission(pageId, 'Edit');
  const canDelete = (pageId: number) => hasPermission(pageId, 'Delete');
  const canExport = (pageId: number) => hasPermission(pageId, 'Export');
  const canImport = (pageId: number) => hasPermission(pageId, 'Import');

  return {
    permissions,
    loading,
    hasPermission,
    canView,
    canAdd,
    canEdit,
    canDelete,
    canExport,
    canImport
  };
};
