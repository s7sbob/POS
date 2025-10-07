// File: src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthHeaders, clearAuthHeaders, isAuthenticated } from 'src/utils/axios';
import { login as loginApi, LoginResponse, Branch, User, UserPage } from 'src/utils/api/authApi';
import { useTranslation } from 'react-i18next';
import { useGlobalErrorHandler } from '../hooks/useGlobalErrorHandler';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  branches: Branch[];
  selectedBranch: Branch | null;
  userPages: UserPage[];
  login: (phoneNo: string, password: string, tenantId: string, onSuccess?: (branches: Branch[], selectedBranch?: Branch) => void) => Promise<void>;
  logout: () => void;
  selectBranch: (branch: Branch) => void;
  hasPageAccess: (pageName: string) => boolean;
  canAccessModule: (moduleId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [userPages, setUserPages] = useState<UserPage[]>([]);
  const { t } = useTranslation();
  useGlobalErrorHandler();

  // تحميل البيانات من localStorage عند بدء التطبيق
useEffect(() => {
  const initAuth = async () => {
    try {
      if (isAuthenticated()) {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user_data');
        const savedBranch = localStorage.getItem('selected_branch');
        const savedBranches = localStorage.getItem('user_branches');

        if (savedToken && savedUser && savedBranch) {
          const userData = JSON.parse(savedUser);
          const branchData = JSON.parse(savedBranch);
          const branchesData = savedBranches ? JSON.parse(savedBranches) : [];

          setToken(savedToken);
          setUser(userData);
          setSelectedBranch(branchData);
          setBranches(branchesData);
          
          const savedTenantId = localStorage.getItem('tenant_id');
          setAuthHeaders(savedToken, branchData.refCompanyId, branchData.id, savedTenantId || '');
          
          // ⭐ التأكد من حفظ warehouse_id
          if (branchData.defWareHouse) {
            localStorage.setItem('warehouse_id', branchData.defWareHouse);
          }
          
          setIsAuthenticatedState(true);
          loadUserPages();
        }
      }
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []);


  // تحميل صفحات المستخدم مع retry mechanism
  const loadUserPages = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { getUserPages } = await import('src/utils/api/authApi');
        const pages = await getUserPages();
        
        setUserPages(pages);
        return;
        
      } catch (error) {
        if (attempt < retries) {
          // انتظار متزايد بين المحاولات
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
        } else {
          }
      }
    }
  };

  // تسجيل الدخول مع redirect فوري

const login = async (phoneNo: string, password: string, tenantId: string, onSuccess?: (branches: Branch[], selectedBranch?: Branch) => void) => {
  try {
    setIsLoading(true);
    const response: LoginResponse = await loginApi(phoneNo, password, tenantId);
    const branches = response.branches?.data || [];
    
    if (branches.length === 0) {
      throw new Error(t('auth.errors.noBranches'));
    }

    setToken(response.token);
    setBranches(branches);
    
    const userData: User = {
      id: 'a4fd8ce5-d4db-4d44-bbb9-5c797b0fbf7b',
      userName: 'Mahmoud Afify',
      email: '',
      phoneNo: phoneNo
    };
    setUser(userData);

    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_branches', JSON.stringify(branches));

    // إذا كان فرع واحد
    if (branches.length === 1) {
      const selectedBranch = branches[0];
      
      setSelectedBranch(selectedBranch);
      setAuthHeaders(response.token, selectedBranch.refCompanyId, selectedBranch.id, tenantId);
      
      // ⭐ حفظ الـ DefaultWarehouse
      if (selectedBranch.defWareHouse) {
        localStorage.setItem('warehouse_id', selectedBranch.defWareHouse);
      }
      
      localStorage.setItem('selected_branch', JSON.stringify(selectedBranch));
      setIsAuthenticatedState(true);
      
      if (onSuccess) {
        onSuccess(branches, selectedBranch);
      }
      
      setTimeout(() => loadUserPages(), 200);
      
    } else {
      const firstBranch = branches[0];
      setAuthHeaders(response.token, firstBranch.refCompanyId, firstBranch.id, tenantId);
      
      // ⭐ حفظ الـ warehouse من أول فرع مؤقتاً
      if (firstBranch.defWareHouse) {
        localStorage.setItem('warehouse_id', firstBranch.defWareHouse);
      }
      
      setIsAuthenticatedState(true);
      
      if (onSuccess) {
        onSuccess(branches);
      }
      
      setTimeout(() => loadUserPages(), 200);
    }
    
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  // دالة داخلية لاختيار الفرع
const selectBranchInternal = async (branch: Branch, isFromLogin = false) => {
  try {
    setSelectedBranch(branch);
    
    if (token) {
      const savedTenantId = localStorage.getItem('tenant_id') || '';
      setAuthHeaders(token, branch.refCompanyId, branch.id, savedTenantId);
    }
    
    // ⭐ حفظ الـ warehouse الخاص بالفرع المختار
    if (branch.defWareHouse) {
      localStorage.setItem('warehouse_id', branch.defWareHouse);
    } else {
      // إزالة warehouse_id إذا مكانش موجود
      localStorage.removeItem('warehouse_id');
    }
    
    localStorage.setItem('selected_branch', JSON.stringify(branch));
    setIsAuthenticatedState(true);
    
    setTimeout(() => loadUserPages(), 200);
    
  } catch (error) {
    if (!isFromLogin) {
      throw error;
    }
  }
};


  // اختيار فرع (للاستخدام الخارجي)
  const selectBranch = (branch: Branch) => {
    return selectBranchInternal(branch, false);
  };

  // تسجيل الخروج
  const logout = () => {
    setIsAuthenticatedState(false);
    setUser(null);
    setToken(null);
    setBranches([]);
    setSelectedBranch(null);
    setUserPages([]);
    
    // مسح البيانات من axios و localStorage
    clearAuthHeaders();
  };

  // التحقق من صلاحية الوصول لصفحة
  const hasPageAccess = (pageName: string): boolean => {
    return userPages.some(page => page.pageName === pageName && page.hasAccess);
  };

  // التحقق من صلاحية الوصول لوحدة
  const canAccessModule = (moduleId: number): boolean => {
    return userPages.some(page => page.module === moduleId && page.hasAccess);
  };

  const value: AuthContextType = {
    isAuthenticated: isAuthenticatedState,
    isLoading,
    user,
    token,
    branches,
    selectedBranch,
    userPages,
    login,
    logout,
    selectBranch,
    hasPageAccess,
    canAccessModule
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
