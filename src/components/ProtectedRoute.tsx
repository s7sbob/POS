// File: src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from 'src/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPage?: string;
  requiredModule?: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPage,
  requiredModule 
}) => {
  const { isAuthenticated, isLoading, selectedBranch, branches, hasPageAccess, canAccessModule } = useAuth();
  const location = useLocation();

  // إذا كان النظام يحمل، أظهر loading
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1">جاري التحميل...</Typography>
      </Box>
    );
  }

  // إذا لم يكن مسجل دخول، اذهب للـ login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // إذا كان مسجل دخول ولكن لا يوجد فرع محدد ولديه فروع متعددة
  if (isAuthenticated && !selectedBranch && branches.length > 1) {
    return <Navigate to="/auth/branch-selection" replace />;
  }

  // إذا كان مسجل دخول ولكن لا يوجد فروع
  if (isAuthenticated && branches.length === 0) {
    return <Navigate to="/auth/no-branches" replace />;
  }

  // التحقق من صلاحية الصفحة
  if (requiredPage && !hasPageAccess(requiredPage)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // التحقق من صلاحية الوحدة
  if (requiredModule && !canAccessModule(requiredModule)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
