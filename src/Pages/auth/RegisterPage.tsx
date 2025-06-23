// File: src/pages/auth/RegisterPage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';
import UsersManagementPage from 'src/Pages/users/UsersManagementPage';

const RegisterPage: React.FC = () => {
  const { hasPageAccess } = useAuth();

  // التحقق من صلاحية إضافة مستخدمين
  if (!hasPageAccess('UserManagement')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // إعادة توجيه لصفحة إدارة المستخدمين
  return <UsersManagementPage />;
};

export default RegisterPage;
