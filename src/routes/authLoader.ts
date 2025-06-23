// File: src/routes/authLoader.ts
import { redirect } from 'react-router-dom';
import { isAuthenticated } from 'src/utils/axios';

export const authLoader = () => {
  // التحقق من وجود مصادقة صحيحة
  if (!isAuthenticated()) {
    return redirect('/auth/login');
  }
  
  return null; // مسموح بالوصول
};
