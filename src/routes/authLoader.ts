// File: src/routes/authLoader.ts
import { redirect } from 'react-router-dom';
import { isAuthenticated } from 'src/utils/axios';

export const authLoader = () => {
  // التحقق من وجود مصادقة صحيحة
  if (!isAuthenticated()) {
    // When not authenticated, perform a relative redirect.  Because all
    // protected routes are nested under `/:tenantId` this relative redirect
    // will resolve to `/:tenantId/auth/login` instead of `/auth/login` which
    // would strip the tenant prefix.
    return redirect('auth/login');
  }
  
  return null; // مسموح بالوصول
};
