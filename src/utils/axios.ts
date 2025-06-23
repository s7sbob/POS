// File: src/utils/axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

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
  
  config.headers.BranchID = branchId;
  config.headers.CompanyID = companyId;
  
  console.log('🔍 Request Headers:', {
    Authorization: config.headers.Authorization,
    BranchID: config.headers.BranchID,
    CompanyID: config.headers.CompanyID,
    url: config.url
  });
  
  return config;
});

/* ▸ رجّع رسالة واضحة عند الخطأ */
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response Success:', response.config.url);
    return response;
  },
  (err) => {
    console.error('❌ Response Error:', {
      url: err.config?.url,
      status: err.response?.status,
      message: err.response?.data
    });
    
    // إذا كان خطأ 401، امسح البيانات وارجع للـ login
    if (err.response?.status === 401) {
      console.log('🚪 Unauthorized - Clearing auth data');
      clearAuthHeaders();
      
      // إعادة توجيه للـ login إذا لم نكن فيه
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(
      (err.response && err.response.data) || 'Network / Server error'
    );
  }
);

// دوال مساعدة لإدارة البيانات - محسنة
export const setAuthHeaders = (token: string, companyId: string, branchId: string) => {
  console.log('🔐 Setting auth headers:', { token: token.substring(0, 20) + '...', companyId, branchId });
  
  // حفظ في localStorage أولاً (أولوية عالية)
  localStorage.setItem('auth_token', token);
  localStorage.setItem('company_id', companyId);
  localStorage.setItem('branch_id', branchId);
  
  // حفظ في Cookies كـ backup
  Cookies.set('token', token, { expires: 7 });
  
  // تحديث axios defaults فوراً
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  api.defaults.headers.common['BranchID'] = branchId;
  api.defaults.headers.common['CompanyID'] = companyId;
  
  console.log('✅ Auth headers set successfully');
};

export const clearAuthHeaders = () => {
  console.log('🗑️ Clearing auth headers');
  
  // مسح من localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('company_id');
  localStorage.removeItem('branch_id');
  localStorage.removeItem('user_data');
  localStorage.removeItem('selected_branch');
  localStorage.removeItem('user_branches');
  
  // مسح من Cookies
  Cookies.remove('token');
  
  // مسح من axios defaults
  delete api.defaults.headers.common['Authorization'];
  delete api.defaults.headers.common['BranchID'];
  delete api.defaults.headers.common['CompanyID'];
};

export const updateBranchHeaders = (branchId: string, companyId: string) => {
  console.log('🏢 Updating branch headers:', { branchId, companyId });
  
  localStorage.setItem('company_id', companyId);
  localStorage.setItem('branch_id', branchId);
  
  // تحديث axios defaults
  api.defaults.headers.common['BranchID'] = branchId;
  api.defaults.headers.common['CompanyID'] = companyId;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token') || Cookies.get('token');
  const branchId = localStorage.getItem('branch_id');
  const companyId = localStorage.getItem('company_id');
  const isAuth = !!(token && branchId && companyId);
  
  console.log('🔍 Auth check:', { hasToken: !!token, hasBranch: !!branchId, hasCompany: !!companyId, isAuth });
  
  return isAuth;
};

export default api;
