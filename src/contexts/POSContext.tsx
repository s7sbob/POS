// File: src/contexts/POSContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PosScreen, getAll as getAllScreens } from 'src/utils/api/pagesApi/posScreensApi';
import { Product, getAll as getAllProducts } from 'src/utils/api/pagesApi/productsApi';

interface POSContextType {
  screens: PosScreen[];
  products: Product[];
  selectedScreen: PosScreen | null;
  selectedScreenPath: PosScreen[];
  loading: boolean;
  error: string | null;
  setSelectedScreen: (screen: PosScreen | null) => void;
  navigateToScreen: (screen: PosScreen) => void;
  navigateBack: () => void;
  getProductsByScreen: (screenId: string) => Product[];
  refreshData: () => Promise<void>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

interface POSProviderProps {
  children: ReactNode;
}

export const POSProvider: React.FC<POSProviderProps> = ({ children }) => {
  const [screens, setScreens] = useState<PosScreen[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<PosScreen | null>(null);
  const [selectedScreenPath, setSelectedScreenPath] = useState<PosScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات الأولية
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [screensData, productsData] = await Promise.all([
        getAllScreens(),
        getAllProducts(1, 1000) // جلب عدد كبير من المنتجات
      ]);
      
      setScreens(screensData);
      setProducts(productsData.data);
      
      // اختيار أول screen كافتراضي
      if (screensData.length > 0) {
        setSelectedScreen(screensData[0]);
        setSelectedScreenPath([screensData[0]]);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في تحميل البيانات');
      console.error('Error loading POS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // التنقل إلى screen معين
  const navigateToScreen = (screen: PosScreen) => {
    setSelectedScreen(screen);
    
    // إذا كان الـ screen له children، أضفه للمسار
    if (screen.children && screen.children.length > 0) {
      setSelectedScreenPath(prev => [...prev, screen]);
    } else {
      // إذا لم يكن له children، استبدل آخر عنصر في المسار
      setSelectedScreenPath(prev => {
        const newPath = [...prev];
        newPath[newPath.length - 1] = screen;
        return newPath;
      });
    }
  };

  // العودة للخلف في المسار
  const navigateBack = () => {
    if (selectedScreenPath.length > 1) {
      const newPath = selectedScreenPath.slice(0, -1);
      setSelectedScreenPath(newPath);
      setSelectedScreen(newPath[newPath.length - 1]);
    }
  };

  // الحصول على المنتجات الخاصة بـ screen معين
  const getProductsByScreen = (screenId: string): Product[] => {
    return products.filter(product => 
      product.posScreenId === screenId && 
      product.isActive &&
      product.productType === 1 // منتجات POS فقط
    );
  };

  const refreshData = async () => {
    await loadData();
  };

  const value: POSContextType = {
    screens,
    products,
    selectedScreen,
    selectedScreenPath,
    loading,
    error,
    setSelectedScreen,
    navigateToScreen,
    navigateBack,
    getProductsByScreen,
    refreshData
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
