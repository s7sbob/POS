// src/Pages/pos/newSales/hooks/useDataManager.tsx
import { useState, useEffect, useCallback } from 'react';
import { PosProduct, CategoryItem } from '../types/PosSystem';
import * as posService from '../../../../services/posService';

interface DataState {
  // المنتجات الأساسية
  mainProducts: PosProduct[];
  mainCategories: CategoryItem[];
  
  // منتجات الإضافات
  additionProducts: PosProduct[];
  additionCategories: CategoryItem[];
  
  // حالة التحميل
  loading: boolean;
  error: string | null;
}

export const useDataManager = () => {
  const [dataState, setDataState] = useState<DataState>({
    mainProducts: [],
    mainCategories: [],
    additionProducts: [],
    additionCategories: [],
    loading: true,
    error: null
  });

  // تحميل جميع البيانات مرة واحدة
  const loadAllData = useCallback(async () => {
    try {
      setDataState(prev => ({ ...prev, loading: true, error: null }));

      // تحميل جميع البيانات بالتوازي
      const [mainProducts, additionProducts] = await Promise.all([
        posService.getAllPosProducts(), // Product Type = 1
        posService.getAdditionProducts() // Product Type = 3
      ]);

      // تحميل الفئات بناءً على المنتجات
      const [mainCategories, additionCategories] = await Promise.all([
        posService.getAllCategories(mainProducts),
        posService.getCategoriesByProductType(3)
      ]);

      setDataState({
        mainProducts,
        mainCategories,
        additionProducts,
        additionCategories,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading data:', error);
      setDataState(prev => ({
        ...prev,
        loading: false,
        error: 'فشل في تحميل البيانات'
      }));
    }
  }, []);

  // تحميل البيانات عند بداية التشغيل
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // دالة للحصول على المنتجات حسب النوع
  const getProducts = useCallback((isAdditionMode: boolean): PosProduct[] => {
    return isAdditionMode ? dataState.additionProducts : dataState.mainProducts;
  }, [dataState.additionProducts, dataState.mainProducts]);

  // دالة للحصول على الفئات حسب النوع
  const getCategories = useCallback((isAdditionMode: boolean): CategoryItem[] => {
    return isAdditionMode ? dataState.additionCategories : dataState.mainCategories;
  }, [dataState.additionCategories, dataState.mainCategories]);

  return {
    ...dataState,
    loadAllData,
    getProducts,
    getCategories
  };
};
