// src/Pages/pos/newSales/hooks/useTableManager.tsx
import { useState, useCallback, useEffect } from 'react';
import { TableSection, Table, TableSelection } from '../types/TableSystem';
import * as tableSectionsApi from '../../../../utils/api/pagesApi/tableSectionsApi';
import { useError } from '../../../../contexts/ErrorContext';

export const useTableManager = () => {
  const [tableSections, setTableSections] = useState<TableSection[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableSelection | null>(null);
  const [isChooseTable] = useState<boolean>(true); // سيتم ملؤه من الإعدادات لاحقاً
  const [loading, setLoading] = useState(false);
  const { showSuccess, showWarning } = useError();

  // تحميل الأقسام والطاولات
const loadTableSections = useCallback(async () => {
  try {
    setLoading(true);
    const sections = await tableSectionsApi.getAll();
    
    // تحويل البيانات للنوع المطلوب
    const convertedSections: TableSection[] = sections.map(section => ({
      ...section,
      image: '/images/default-section.png', // صورة افتراضية للقسم
      tables: section.tables.map(table => ({
        ...table,
        isOccupied: false, // هنا يمكن جلب الحالة الحقيقية من API آخر
        image: '/images/default-table.png' // صورة افتراضية للطاولة
      }))
    }));
    
    setTableSections(convertedSections);
  } catch (error) {
    console.error('Error loading table sections:', error);
    setTableSections([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadTableSections();
  }, [loadTableSections]);

  const selectTable = useCallback((selection: TableSelection) => {
    setSelectedTable(selection);
        showSuccess(`تم اختيار طاولة ${selection.table.name} - ${selection.section.name}`);

  }, []);

  const clearSelectedTable = useCallback(() => {
    setSelectedTable(null);
  }, []);

  const getTableDisplayName = useCallback((): string => {
    if (!selectedTable) return 'Table';
    return `${selectedTable.section.name} / ${selectedTable.table.name}`;
  }, [selectedTable]);

  const getServiceCharge = useCallback((): number => {
    if (!selectedTable) return 0;
    return selectedTable.section.serviceCharge;
  }, [selectedTable]);

  const isTableRequired = useCallback((orderType: string): boolean => {
    return isChooseTable && orderType === 'Dine-in';
  }, [isChooseTable]);

  const canAddProduct = useCallback((orderType: string): boolean => {
    if (!isTableRequired(orderType)) return true;
    return selectedTable !== null;
  }, [selectedTable, isTableRequired]);


  // إضافة دالة للتحقق مع عرض الرسالة
  const checkTableSelection = useCallback((orderType: string): boolean => {
    if (!canAddProduct(orderType)) {
      showWarning('يجب اختيار الطاولة أولاً');
      return false;
    }
    return true;
  }, [canAddProduct, showWarning]);

  return {
    tableSections,
    selectedTable,
    isChooseTable,
    loading,
    selectTable,
    clearSelectedTable,
    getTableDisplayName,
    getServiceCharge,
    isTableRequired,
    canAddProduct,
    checkTableSelection, // إضافة الدالة الجديدة
    loadTableSections
  };
};





