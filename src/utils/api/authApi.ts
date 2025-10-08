// File: src/utils/api/authApi.ts
import api from 'src/utils/axios';

export interface LoginResponse {
  token: string;
  expiration: string;
  branches: {
    isvalid: boolean;
    errors: string[] | null;
    data: Branch[];
  };
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  refCompanyId: string;
  defWareHouse: string | null; // ⭐ إضافة الحقل ده
  company: Company;
  assignedUsers?: any;
  assignedUserIds?: string[];
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  branches?: Branch[];
  branchID?: string;
  companyID?: string;
  isActive: boolean;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  phoneNo: string;
  password?: string;
  /**
   * Indicates whether the user account is active. When false, the user
   * will not appear in selection lists (e.g. on the POS page). This field
   * defaults to true when creating new users.
   */
  isActive?: boolean;
}

export interface UserPage {
  pageId: number;
  pageName: string;
  description: string;
  module: number;
  hasAccess: boolean;
}

export interface PagePermission {
  permissionId: number;
  permissionName: string;
  hasPermission: boolean;
}

// تسجيل الدخول
export const login = async (phoneNo: string, password: string, tenantId: string): Promise<LoginResponse> => {
  // ⭐ إضافة TenantId في الـ headers قبل الطلب
  const response = await api.post(`/login?PhoneNo=${phoneNo}&Password=${password}`, {}, {
    headers: {
      'TenantId': tenantId // ⭐ إرسال TenantId في الـ header
    }
  });
  return response.data;
};

// تسجيل مستخدم جديد
/**
 * Register a new user account. Accepts an optional `isActive` flag that
 * controls whether the user is active upon creation. Defaults to true if
 * omitted.
 */
export const register = async (
  userName: string,
  phoneNo: string,
  password: string,
  isActive: boolean = true
): Promise<boolean> => {
  const response = await api.post(
    `/Register?UserName=${userName}&PhoneNo=${phoneNo}&Password=${password}&isActive=${isActive}`
  );
  return response.data;
};

// الحصول على صفحات المستخدم
export const getUserPages = async (): Promise<UserPage[]> => {
  const response = await api.get('/GetUserPages');
  return response.data;
};

// الحصول على صلاحيات صفحة معينة
export const getUserPagePermission = async (pageId: number): Promise<PagePermission[]> => {
  const response = await api.get(`/GetUserPagePermission?pageid=${pageId}`);
  return response.data;
};

// الحصول على جميع المستخدمين
export const getAllUsers = async (): Promise<{isvalid: boolean; errors: string[] | null; data: User[]}> => {
  const response = await api.get('/GetAllUsers');
  return response.data;
};

// الحصول على فروع مستخدم معين
export const getUserBranches = async (userId: string): Promise<{isvalid: boolean; errors: string[] | null; data: Branch[]}> => {
  const response = await api.get(`/GetUserBranches?userid=${userId}`);
  return response.data;
};
