// File: src/utils/axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Global error handler function - سيتم تعيينها من ErrorProvider
let globalErrorHandler: ((error: any) => void) | null = null;
let globalSuccessHandler: ((message: string) => void) | null = null;

export const setGlobalErrorHandler = (handler: (error: any) => void) => {
  globalErrorHandler = handler;
};

export const setGlobalSuccessHandler = (handler: (message: string) => void) => {
  globalSuccessHandler = handler;
};

const api = axios.create({
  baseURL: 'https://horexapi.watsorder.com',
  headers: { 'Content-Type': 'application/json' }
});

/* ▸ أضف التوكين مع كل Request */
api.interceptors.request.use((config) => {
  // ترتيب الأولوية: localStorage ثم Cookies
  const token = localStorage.getItem('auth_token') || Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // إضافة BranchID و CompanyID من localStorage
  const branchId = localStorage.getItem('branch_id') || 'branch_1';
  const companyId = localStorage.getItem('company_id') || 'company_1';
  const tenantId = localStorage.getItem('tenant_id');
  
  config.headers.BranchID = branchId;
  config.headers.CompanyID = companyId;
  
  if (tenantId) {
    config.headers.TenantId = tenantId;
  }
  
  return config;
});

/* ▸ معالجة الأخطاء والنجاح */
api.interceptors.response.use(
  (response) => {
    // ⭐ فحص الاستجابة للتأكد من صحة البيانات
    if (response.data && typeof response.data === 'object') {
      // إذا كانت الاستجابة تحتوي على isvalid = false
      if (response.data.isvalid === false && response.data.errors) {
        // عرض الأخطاء باستخدام Global Error Handler
        if (globalErrorHandler) {
          globalErrorHandler(response.data.errors);
        }
        
        // رفض الـ Promise مع الأخطاء
        return Promise.reject({
          isApiValidationError: true,
          errors: response.data.errors,
          message: response.data.errors[0]?.errorMessage || 'خطأ في التحقق من البيانات'
        });
      }
      
      // إذا كانت العملية ناجحة وتحتوي على رسالة نجاح
      if (response.data.isvalid === true && response.data.message && globalSuccessHandler) {
        globalSuccessHandler(response.data.message);
      }
    }
    
    return response;
  },
  (err) => {
    // معالجة أخطاء HTTP المختلفة
    if (err.response) {
      const { status, data } = err.response;
      
      // إذا كان خطأ 401، امسح البيانات وارجع للـ login
      if (status === 401) {
        clearAuthHeaders();
        
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(err);
      }
      
      // معالجة الأخطاء الأخرى
      let errorMessage = 'حدث خطأ غير متوقع';
      let errorCode = status;
      
      if (data && typeof data === 'object') {
        if (data.isvalid === false && data.errors) {
          // خطأ من API مع تفاصيل
          if (globalErrorHandler) {
            globalErrorHandler(data.errors);
          }
          return Promise.reject({
            isApiValidationError: true,
            errors: data.errors,
            message: data.errors[0]?.errorMessage || errorMessage
          });
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
      
      // عرض الخطأ باستخدام Global Error Handler
      if (globalErrorHandler) {
        globalErrorHandler([{ errorCode, errorMessage }]);
      }
      
      return Promise.reject({
        status,
        message: errorMessage,
        isNetworkError: false
      });
    }
    
    // خطأ في الشبكة
    const networkError = {
      errorCode: 0,
      errorMessage: 'خطأ في الاتصال بالخادم'
    };
    
    if (globalErrorHandler) {
      globalErrorHandler([networkError]);
    }
    
    return Promise.reject({
      message: 'Network / Server error',
      isNetworkError: true
    });
  }
);

export const setAuthHeaders = (token: string, companyId: string, branchId: string, tenantId: string) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('company_id', companyId);
  localStorage.setItem('branch_id', branchId);
  localStorage.setItem('tenant_id', tenantId);
  
  Cookies.set('token', token, { expires: 7 });
  
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  api.defaults.headers.common['BranchID'] = branchId;
  api.defaults.headers.common['CompanyID'] = companyId;
  api.defaults.headers.common['TenantId'] = tenantId;
};

export const clearAuthHeaders = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('company_id');
  localStorage.removeItem('branch_id');
  localStorage.removeItem('tenant_id');
  localStorage.removeItem('user_data');
  localStorage.removeItem('selected_branch');
  localStorage.removeItem('user_branches');
  
  Cookies.remove('token');
  
  delete api.defaults.headers.common['Authorization'];
  delete api.defaults.headers.common['BranchID'];
  delete api.defaults.headers.common['CompanyID'];
  delete api.defaults.headers.common['TenantId'];
};

export const updateBranchHeaders = (branchId: string, companyId: string) => {
  localStorage.setItem('company_id', companyId);
  localStorage.setItem('branch_id', branchId);
  
  api.defaults.headers.common['BranchID'] = branchId;
  api.defaults.headers.common['CompanyID'] = companyId;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token') || Cookies.get('token');
  const branchId = localStorage.getItem('branch_id');
  const companyId = localStorage.getItem('company_id');
  const tenantId = localStorage.getItem('tenant_id');
  const isAuth = !!(token && branchId && companyId && tenantId);
  
  return isAuth;
};

export default api;
