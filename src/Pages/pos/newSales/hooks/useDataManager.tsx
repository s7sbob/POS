// src/Pages/pos/newSales/hooks/useDataManager.tsx
import { useState, useEffect, useCallback } from 'react';
import { PosProduct, CategoryItem } from '../types/PosSystem';
import * as posService from '../../../../services/posService';
import * as offersApi from '../../../../utils/api/pagesApi/offersApi';
import { Offer } from '../../../../utils/api/pagesApi/offersApi';

interface DataState {
  mainProducts: PosProduct[];
  mainCategories: CategoryItem[];
  additionProducts: PosProduct[];
  additionCategories: CategoryItem[];
  normalModeProducts: PosProduct[];
  normalModeCategories: CategoryItem[];
  offers: Offer[]; // إضافة العروض
  loading: boolean;
  error: string | null;
  defaultCategoryId: string | null;
}

export const useDataManager = () => {
  const [dataState, setDataState] = useState<DataState>({
    mainProducts: [],
    mainCategories: [],
    additionProducts: [],
    additionCategories: [],
    normalModeProducts: [],
    normalModeCategories: [],
    offers: [], // إضافة العروض
    loading: true,
    error: null,
    defaultCategoryId: null
  });

const loadAllData = useCallback(async () => {
  try {
    setDataState(prev => ({ ...prev, loading: true, error: null }));

    // تحميل البيانات من posService والعروض
    const [mainProducts, additionProducts, offersResponse] = await Promise.all([
      posService.getAllPosProducts(),
      posService.getAdditionProducts(),
      offersApi.getAll(1, 1000)
    ]);

    // ✅ استخراج العروض النشطة مرة واحدة فقط
    const activeOffers = offersResponse.data?.filter(offer => offer.isActive) || [];

    console.log(`✅ تم تحميل ${activeOffers.length} عرض بنجاح`);
    activeOffers.forEach(offer => {
      console.log(`📋 العرض: ${offer.name}`);
      console.log(`   - المجموعات: ${offer.offerGroups?.length || 0}`);
      offer.offerGroups?.forEach(group => {
        console.log(`     • ${group.title}: ${group.items?.length || 0} عناصر`);
      });
      const fixedItemsCount = offer.offerItems?.filter(item => !item.offerGroupId).length || 0;
      console.log(`   - العناصر الثابتة: ${fixedItemsCount}`);
    });

    // تحويل البيانات إلى النوع المطلوب
    const convertedMainProducts: PosProduct[] = mainProducts.map(product => ({
      ...product,
      productType: product.productType || 1
    }));

    const convertedAdditionProducts: PosProduct[] = additionProducts.map(product => ({
      ...product,
      productType: product.productType || 3
    }));

    const [mainCategories, additionCategories] = await Promise.all([
      posService.getAllCategories(mainProducts),
      posService.getCategoriesByProductType(3)
    ]);

    // تحويل الفئات إلى النوع المطلوب
    const convertedMainCategories: CategoryItem[] = mainCategories.map(category => ({
      ...category,
      products: category.products?.map(product => ({
        ...product,
        productType: product.productType || 1
      }))
    }));

    const convertedAdditionCategories: CategoryItem[] = additionCategories.map(category => ({
      ...category,
      products: category.products?.map(product => ({
        ...product,
        productType: product.productType || 3
      }))
    }));

    // دمج المنتجات للعرض العادي
    const normalModeProducts = [...convertedMainProducts, ...convertedAdditionProducts];
    const normalModeCategories = await posService.getAllCategories([...mainProducts, ...additionProducts]);
    
    const convertedNormalModeCategories: CategoryItem[] = normalModeCategories.map(category => ({
      ...category,
      products: category.products?.map(product => ({
        ...product,
        productType: product.productType || 1
      }))
    }));

    const rootMainCategories = convertedNormalModeCategories.filter(cat => !cat.parentId);
    const defaultCategoryId = rootMainCategories.length > 0 ? rootMainCategories[0].id : null;

    // ✅ استخدام activeOffers المعرف بالفعل (إزالة التكرار)
    setDataState({
      mainProducts: convertedMainProducts,
      mainCategories: convertedMainCategories,
      additionProducts: convertedAdditionProducts,
      additionCategories: convertedAdditionCategories,
      normalModeProducts,
      normalModeCategories: convertedNormalModeCategories,
      offers: activeOffers, // ✅ استخدام المتغير الموجود
      loading: false,
      error: null,
      defaultCategoryId
    });

    // ✅ إزالة console.log المكرر

  } catch (error) {
    console.error('Error loading data:', error);
    setDataState(prev => ({
      ...prev,
      loading: false,
      error: 'فشل في تحميل البيانات'
    }));
  }
}, []);


  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // دالة للحصول على المنتجات المفلترة حسب الوضع
  const getProducts = useCallback((isAdditionMode: boolean): PosProduct[] => {
    if (isAdditionMode) {
      return dataState.additionProducts.filter(product => product.productType === 3);
    }
    return dataState.normalModeProducts;
  }, [dataState.additionProducts, dataState.normalModeProducts]);

  // دالة للحصول على الفئات المفلترة حسب الوضع
  const getCategories = useCallback((isAdditionMode: boolean): CategoryItem[] => {
    if (isAdditionMode) {
      return dataState.additionCategories.filter(category => 
        category.products && category.products.some(product => product.productType === 3)
      );
    }
    return dataState.normalModeCategories;
  }, [dataState.additionCategories, dataState.normalModeCategories]);

  // دالة للحصول على العروض
  const getOffers = useCallback((): Offer[] => {
    return dataState.offers;
  }, [dataState.offers]);

  // دالة البحث في العروض
  const searchOffers = useCallback((offers: Offer[], query: string): Offer[] => {
    if (!query.trim()) return offers;
    
    const searchTerm = query.toLowerCase();
    return offers.filter(offer => 
      offer.name.toLowerCase().includes(searchTerm)
    );
  }, []);

  // إضافة دوال مساعدة متوافقة مع posService
  const searchProducts = useCallback((products: PosProduct[], query: string): PosProduct[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.nameArabic.toLowerCase().includes(searchTerm) ||
      product.name.toLowerCase().includes(searchTerm)
    );
  }, []);

  const getProductsByScreenId = useCallback((products: PosProduct[], screenId: string): PosProduct[] => {
    return products.filter(product => product.categoryId === screenId);
  }, []);

  const hasProductOptions = useCallback((product: PosProduct): boolean => {
    return !!(product.productOptionGroups && product.productOptionGroups.length > 0);
  }, []);

  return {
    ...dataState,
    loadAllData,
    getProducts,
    getCategories,
    getOffers, // إضافة العروض
    searchOffers, // إضافة البحث في العروض
    // إضافة الدوال المساعدة
    searchProducts,
    getProductsByScreenId,
    hasProductOptions,
    // مؤشرات الحالة
    isLoading: dataState.loading,
    hasError: !!dataState.error,
    isDataReady: !dataState.loading && !dataState.error && dataState.normalModeProducts.length > 0
  };
};
