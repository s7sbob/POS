// File: src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthHeaders, clearAuthHeaders, isAuthenticated } from 'src/utils/axios';
import { login as loginApi, LoginResponse, Branch, User, UserPage } from 'src/utils/api/authApi';
import { useTranslation } from 'react-i18next';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  branches: Branch[];
  selectedBranch: Branch | null;
  userPages: UserPage[];
  login: (phoneNo: string, password: string, onSuccess?: (branches: Branch[], selectedBranch?: Branch) => void) => Promise<void>; // ⭐ إضافة callback
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

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
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
            
            // تأكد من تحديث headers
            setAuthHeaders(savedToken, branchData.refCompanyId, branchData.id);
            
            // ⭐ تحديث حالة المصادقة فوراً
            setIsAuthenticatedState(true);
            
            // تحميل صفحات المستخدم في الخلفية
            loadUserPages();
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
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
        console.log(`📄 Loading user pages (attempt ${attempt}/${retries})`);
        
        const { getUserPages } = await import('src/utils/api/authApi');
        const pages = await getUserPages();
        
        console.log('✅ User pages loaded:', pages);
        setUserPages(pages);
        return;
        
      } catch (error) {
        console.error(`❌ Error loading user pages (attempt ${attempt}):`, error);
        
        if (attempt < retries) {
          // انتظار متزايد بين المحاولات
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
        } else {
          console.error('❌ Failed to load user pages after all retries');
        }
      }
    }
  };

  // تسجيل الدخول مع redirect فوري

const login = async (phoneNo: string, password: string, onSuccess?: (branches: Branch[], selectedBranch?: Branch) => void) => {
  try {
    setIsLoading(true);
    console.log('🔐 Starting login process...');
    
    const response: LoginResponse = await loginApi(phoneNo, password);
    console.log('✅ Login response:', response);
    
    const branches = response.branches?.data || [];
    console.log('🏢 Branches found:', branches);
    
    if (branches.length === 0) {
    throw new Error(t('auth.errors.noBranches'));

    }

    // حفظ البيانات
    setToken(response.token);
    setBranches(branches);
    
    const userData: User = {
      id: 'a4fd8ce5-d4db-4d44-bbb9-5c797b0fbf7b',
      userName: 'Mahmoud Afify',
      email: '',
      phoneNo: phoneNo
    };
    setUser(userData);

    // حفظ في localStorage
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_branches', JSON.stringify(branches));

    // إذا كان فرع واحد، اختره تلقائياً
    if (branches.length === 1) {
      console.log('🏢 Single branch found, selecting automatically');
      const selectedBranch = branches[0];
      
      setSelectedBranch(selectedBranch);
      setAuthHeaders(response.token, selectedBranch.refCompanyId, selectedBranch.id);
      localStorage.setItem('selected_branch', JSON.stringify(selectedBranch));
      setIsAuthenticatedState(true);
      
      // ⭐ استدعاء callback مع البيانات
      if (onSuccess) {
        onSuccess(branches, selectedBranch);
      }
      
      // تحميل الصفحات في الخلفية
      setTimeout(() => loadUserPages(), 200);
      
    } else {
      console.log('🏢 Multiple branches found');
      const firstBranch = branches[0];
      setAuthHeaders(response.token, firstBranch.refCompanyId, firstBranch.id);
      setIsAuthenticatedState(true);
      
      // ⭐ استدعاء callback مع البيانات
      if (onSuccess) {
        onSuccess(branches);
      }
      
      setTimeout(() => loadUserPages(), 200);
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
  // دالة داخلية لاختيار الفرع
  const selectBranchInternal = async (branch: Branch, isFromLogin = false) => {
    try {
      console.log('🏢 Selecting branch:', branch.name);
      
      setSelectedBranch(branch);
      
      // تحديث headers في axios
      if (token) {
        setAuthHeaders(token, branch.refCompanyId, branch.id);
      }
      
      // حفظ الفرع المختار
      localStorage.setItem('selected_branch', JSON.stringify(branch));
      
      // ⭐ تحديث حالة المصادقة فوراً
      setIsAuthenticatedState(true);
      
      // تحميل الصفحات في الخلفية
      setTimeout(() => loadUserPages(), 200);
      
    } catch (error) {
      console.error('❌ Error selecting branch:', error);
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
    console.log('🚪 Logging out...');
    
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
