// src/Pages/pos/newSales/index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PosProduct, CategoryItem, OrderSummary as OrderSummaryType, OrderItem, PosPrice, SelectedOption } from './types/PosSystem';
import { useTranslation } from 'react-i18next';
import * as posService from '../../../services/posService';
import PriceSelectionPopup from './components/PriceSelectionPopup';
import ProductOptionsPopup from './components/ProductOptionsPopup';
import ProductCard from './components/ProductCard';
import Header from './components/common/Header';
import ActionButtons from './components/ActionButtons';
import OrderSummary from './components/OrderSummary';
import { useOrderManager } from './components/OrderManager';
import { useDataManager } from './hooks/useDataManager';
import './styles/responsive.css';
import './styles/popup.css';
import './styles/numberpad.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderItemDetailsPopup from './components/OrderItemDetailsPopup';
import TableSelectionPopup from './components/TableSelectionPopup';
import InvoiceSelectionPopup from './components/InvoiceSelectionPopup';
import SplitReceiptPopup from './components/SplitReceiptPopup';
import { Invoice } from '../../../utils/api/pagesApi/invoicesApi';
import { useInvoiceManager } from './hooks/useInvoiceManager';
import { useTableManager } from './hooks/useTableManager';
import { TableSelection } from './types/TableSystem';
import { useError } from '../../../contexts/ErrorContext';
import * as deliveryCompaniesApi from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { DeliveryCompany } from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import InvoiceDataConverter from '../../../utils/invoiceDataConverter';

const PosSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // RTL/LTR Support
  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  const [keypadValue, setKeypadValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState('Takeaway');
  const [showTablePopup, setShowTablePopup] = useState(false);
  const { showWarning, showError, showSuccess } = useError();
  const [deliveryCompanies, setDeliveryCompanies] = useState<DeliveryCompany[]>([]);
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState<DeliveryCompany | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // إضافة Table Manager Hook
  const {
    tableSections,
    selectedTable,
    isChooseTable,
    selectTable,
    clearSelectedTable,
    getTableDisplayName,
    getServiceCharge,
    isTableRequired,
    canAddProduct
  } = useTableManager();

  // استخدام Data Manager الجديد
  const {
    loading,
    error,
    getProducts,
    getCategories,
    defaultCategoryId,
    searchProducts,
    getProductsByScreenId,
    hasProductOptions
  } = useDataManager();

  // دالة لجلب رسوم التوصيل من الـ zone
  const getDeliveryCharge = useCallback((): number => {
    if (selectedOrderType === 'Delivery' && selectedAddress && selectedAddress.zoneId) {
      return 15; // يمكن تحديثها من API
    }
    return 0;
  }, [selectedOrderType, selectedAddress]);


  const handleDeliveryChargeChange = useCallback((charge: number) => {
    setDeliveryCharge(charge);
  }, []);

  // Extra/Without States
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [isWithoutMode, setIsWithoutMode] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  
  // Categories States
  const [showingChildren, setShowingChildren] = useState<string | null>(null);
  const [, setParentCategory] = useState<CategoryItem | null>(null);
  
  // Popup States
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<PosProduct | null>(null);
  const [selectedPriceForOptions, setSelectedPriceForOptions] = useState<PosPrice | null>(null);
  
  // Order Details Popup States
  const [showOrderDetailsPopup, setShowOrderDetailsPopup] = useState(false);
  const [selectedOrderItemForDetails, setSelectedOrderItemForDetails] = useState<OrderItem | null>(null);
  
  // Order States
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // الحصول على البيانات الحالية
  const isAdditionMode = isExtraMode || isWithoutMode;
  const currentProducts = getProducts(isAdditionMode);
  const currentCategories = getCategories(isAdditionMode);
  const rootCategories = currentCategories.filter(cat => !cat.parentId);
  const categories = showingChildren 
    ? currentCategories.find(cat => cat.id === showingChildren)?.children || []
    : rootCategories;

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [currentBackInvoiceCode, setCurrentBackInvoiceCode] = useState<string | null>(null);
  const [currentInvoiceStatus, setCurrentInvoiceStatus] = useState<number>(1);

  // إدارة الانقسام والنقل
  const [showSplitPopup, setShowSplitPopup] = useState(false);
  const [showInvoiceSelectPopup, setShowInvoiceSelectPopup] = useState(false);
  const [invoiceOptions, setInvoiceOptions] = useState<Invoice[]>([]);
  const [moveTableMode, setMoveTableMode] = useState(false);

  // استخدم مدير الفاتورة لإنشاء وتحديث الفواتير خارج الـ OrderSummary
  const { saveInvoice } = useInvoiceManager();

  /**
   * تنفيذ عملية النقل عند الضغط على زر الأدوات فى الهيدر.
   * يقوم بالتحقق من وجود فاتورة حالية ثم يفتح شاشة اختيار الطاولة.
   */
  const handleToolsMoveTable = useCallback(() => {
    if (!currentInvoiceId) {
      showWarning('لا يوجد طلب لنقله');
      return;
    }
    setMoveTableMode(true);
    setShowTablePopup(true);
  }, [currentInvoiceId, showWarning]);

  /**
   * تنفيذ عملية فصل الشيك عند الضغط على زر الأدوات فى الهيدر.
   * يقوم بالتحقق من وجود عناصر فى الطلب الحالى ثم يفتح شاشة الفصل.
   */
  const handleToolsSplitReceipt = useCallback(() => {
    if (orderItems.length === 0) {
      showWarning('لا توجد عناصر لفصلها');
      return;
    }
    setShowSplitPopup(true);
  }, [orderItems, showWarning]);

  // تحميل البيانات مرة واحدة
  useEffect(() => {
    const loadDeliveryCompanies = async () => {
      try {
        const companies = await deliveryCompaniesApi.getAll();
        setDeliveryCompanies(companies);
      } catch (error) {
        console.error('Error loading delivery companies:', error);
      }
    };
    loadDeliveryCompanies();
  }, []);

  // المنتجات المعروضة
  const displayedProducts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchProducts(currentProducts, searchQuery);
    }
    
    if (selectedCategory) {
      return getProductsByScreenId(currentProducts, selectedCategory);
    }
    
    return [];
  }, [currentProducts, selectedCategory, searchQuery, searchProducts, getProductsByScreenId]);

  // تحديث دالة updateOrderItem
  const updateOrderItem = useCallback((itemId: string, updateType: 'addSubItem' | 'removeSubItem', data: any) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === itemId) {
        if (updateType === 'addSubItem') {
          const newSubItems = [...(item.subItems || []), data];
          
          const priceImpact = data.type === 'without' ? 0 : data.price;
          const newTotalPrice = item.totalPrice + priceImpact;
          
          return {
            ...item,
            subItems: newSubItems,
            totalPrice: newTotalPrice
          };
        } else if (updateType === 'removeSubItem') {
          const removedSubItem = item.subItems?.find(sub => sub.id === data);
          const newSubItems = item.subItems?.filter(sub => sub.id !== data) || [];
          
          const priceImpact = removedSubItem?.type === 'without' ? 0 : (removedSubItem?.price || 0);
          const newTotalPrice = item.totalPrice - priceImpact;
          
          return {
            ...item,
            subItems: newSubItems.length > 0 ? newSubItems : undefined,
            totalPrice: newTotalPrice
          };
        }
      }
      return item;
    }));
  }, []);

  // Order Manager Hook
  const { addToOrder, removeSubItem } = useOrderManager({
    keypadValue,
    isExtraMode,
    isWithoutMode,
    selectedOrderItemId,
    onOrderAdd: (orderItem) => setOrderItems(prev => [...prev, orderItem]),
    onOrderUpdate: updateOrderItem,
    onModeReset: () => {
      setIsExtraMode(false);
      setIsWithoutMode(false);
      setSelectedOrderItemId(null);
      setKeypadValue('0');
    },
    onLoadNormalProducts: () => {
      // لا نحتاج لإعادة تحميل البيانات لأنها محملة مسبقاً
    }
  });

  // تعديل حساب ملخص الطلب ليشمل الخدمة
  const calculateOrderSummary = useCallback((): OrderSummaryType => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const serviceCharge = getServiceCharge();
    const service = (subtotal * serviceCharge) / 100;
    const discountPercentage = 0;
    const discount = (subtotal * discountPercentage) / 100;
    const tax = 0;
    
    // حساب المجاميع بالترتيب الصحيح
    const totalAfterDiscount = subtotal - discount;
    const totalAfterTaxAndService = totalAfterDiscount + tax + service + deliveryCharge;
    
    return {
      items: orderItems,
      subtotal,
      discount,
      tax,
      service,
      total: totalAfterTaxAndService,
      totalAfterDiscount,
      totalAfterTaxAndService
    };
  }, [orderItems, getServiceCharge, deliveryCharge]);

  // واستخدمه في كل مرة:
  const orderSummary = calculateOrderSummary();

  // معالج نقل الطلب لطاولة جديدة
  const handleMoveToTable = useCallback(async (selection: TableSelection) => {
    try {
      // فى حالة عدم وجود فاتورة حالية، فقط قم باختيار الطاولة الجديدة
      if (!currentInvoiceId) {
        selectTable(selection);
        setShowTablePopup(false);
        return;
      }
      // حساب ملخص الطلب الحالى
      const summary = calculateOrderSummary();
      await saveInvoice(
        summary,
        selectedOrderType,
        [],
        currentInvoiceStatus,
        {
          isEditMode: true,
          invoiceId: currentInvoiceId,
          selectedCustomer,
          selectedAddress,
          selectedDeliveryCompany,
          selectedTable: selection,
          servicePercentage: selection.section.serviceCharge || 0,
          taxPercentage: 0,
          discountPercentage: 0,
          notes: undefined
        }
      );
      // تحديث الطاولة المختارة فى الواجهة
      selectTable(selection);
      showSuccess('تم نقل الطلب إلى الطاولة الجديدة بنجاح');
    } catch (error) {
      console.error('❌ خطأ فى نقل الطلب للطاولة الجديدة:', error);
      showError('فشل نقل الطلب للطاولة الجديدة');
    } finally {
      setShowTablePopup(false);
    }
  }, [currentInvoiceId, calculateOrderSummary, selectedOrderType, currentInvoiceStatus, selectedCustomer, selectedAddress, selectedDeliveryCompany, selectTable, saveInvoice, showSuccess, showError]);

  // إضافة معالج double click
  const handleOrderItemDoubleClick = useCallback((item: OrderItem) => {
    setSelectedOrderItemForDetails(item);
    setShowOrderDetailsPopup(true);
  }, []);

  // إضافة معالج تحديث المنتج للـ OrderItemDetailsPopup
  const handleUpdateOrderItem = useCallback((itemId: string, updates: {
    quantity?: number;
    notes?: string;
    discountPercentage?: number;
    discountAmount?: number;
  }) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item };
        
        if (updates.quantity !== undefined) {
          updatedItem.quantity = updates.quantity;
        }
        
        if (updates.notes !== undefined) {
          updatedItem.notes = updates.notes;
        }
        
        if (updates.discountPercentage !== undefined) {
          updatedItem.discountPercentage = updates.discountPercentage;
        }
        
        if (updates.discountAmount !== undefined) {
          updatedItem.discountAmount = updates.discountAmount;
        }
        
        const basePrice = item.selectedPrice.price * (updates.quantity || item.quantity);
        const subItemsTotal = item.subItems?.reduce((sum, subItem) => {
          return sum + (subItem.type === 'without' ? 0 : subItem.price);
        }, 0) || 0;
        
        const totalBeforeDiscount = basePrice + subItemsTotal;
        const discountAmount = updates.discountAmount || item.discountAmount || 0;
        updatedItem.totalPrice = totalBeforeDiscount - discountAmount;
        
        return updatedItem;
      }
      return item;
    }));
  }, []);

  // إضافة معالج حذف sub-item
  const handleRemoveSubItem = useCallback((orderItemId: string, subItemId: string) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === orderItemId && item.subItems) {
        const removedSubItem = item.subItems.find(sub => sub.id === subItemId);
        const newSubItems = item.subItems.filter(sub => sub.id !== subItemId);
        
        const priceImpact = removedSubItem?.type === 'without' ? 0 : (removedSubItem?.price || 0);
        const newTotalPrice = item.totalPrice - priceImpact;
        
        return {
          ...item,
          subItems: newSubItems.length > 0 ? newSubItems : undefined,
          totalPrice: newTotalPrice
        };
      }
      return item;
    }));
  }, []);

  // إضافة useEffect لتحديد الفئة الافتراضية
  useEffect(() => {
    if (defaultCategoryId && !selectedCategory && !isAdditionMode) {
      setSelectedCategory(defaultCategoryId);
    }
  }, [defaultCategoryId, selectedCategory, isAdditionMode]);

  // معالج زر Extra - التحديث الجديد
  const handleExtraClick = useCallback(() => {
    let targetItemId = selectedOrderItemId;
    
    if (!targetItemId && orderItems.length > 0) {
      targetItemId = orderItems[orderItems.length - 1].id;
      setSelectedOrderItemId(targetItemId);
    }
    
    if (!targetItemId) {
      return;
    }
    
    setIsExtraMode(true);
    setIsWithoutMode(false);
    setSelectedChips(prev => prev.includes(t('pos.newSales.actions.extraChip')) ? prev : [...prev.filter(chip => chip !== t('pos.newSales.actions.withoutChip')), t('pos.newSales.actions.extraChip')]);
    
    const additionCategories = getCategories(true).filter(cat => !cat.parentId);
    if (additionCategories.length > 0) {
      setSelectedCategory(additionCategories[0].id);
    }
  }, [selectedOrderItemId, orderItems, getCategories]);

  // معالج زر Without - التحديث الجديد
  const handleWithoutClick = useCallback(() => {
    let targetItemId = selectedOrderItemId;
    
    if (!targetItemId && orderItems.length > 0) {
      targetItemId = orderItems[orderItems.length - 1].id;
      setSelectedOrderItemId(targetItemId);
    }
    
    if (!targetItemId) {
      return;
    }
    
    setIsWithoutMode(true);
    setIsExtraMode(false);
    setSelectedChips(prev => prev.includes(t("pos.newSales.actions.withoutChip")) ? prev : [...prev.filter(chip => chip !== t("pos.newSales.actions.extraChip")), t("pos.newSales.actions.withoutChip")]);
    
    const additionCategories = getCategories(true).filter(cat => !cat.parentId);
    if (additionCategories.length > 0) {
      setSelectedCategory(additionCategories[0].id);
    }
  }, [selectedOrderItemId, orderItems, getCategories]);

  // معالج الرجوع للمنتجات الأساسية
  const handleBackToMainProducts = useCallback(() => {
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setSelectedOrderItemId(null);
    setSelectedChips(prev => prev.filter(chip => chip !== 'extra' && chip !== 'without'));
    
    if (defaultCategoryId) {
      setSelectedCategory(defaultCategoryId);
    }
    
    setShowingChildren(null);
    setParentCategory(null);
  }, [defaultCategoryId]);

  // معالج اختيار منتج في الفاتورة
  const handleOrderItemSelect = useCallback((itemId: string) => {
    if (selectedOrderItemId === itemId) {
      setSelectedOrderItemId(null);
    } else {
      setSelectedOrderItemId(itemId);
    }
  }, [selectedOrderItemId]);

  // معالج اختيار الفئة
  const handleCategorySelect = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category?.hasChildren && category.children) {
      setShowingChildren(categoryId);
      setParentCategory(category);
      if (category.children.length > 0) {
        setSelectedCategory(category.children[0].id);
      }
    } else {
      setSelectedCategory(categoryId);
    }
    setSearchQuery('');
  }, [categories]);

  const handleChildCategorySelect = useCallback((childId: string) => {
    setSelectedCategory(childId);
    setSearchQuery('');
  }, []);

  // دالة الرجوع للفئة الأب
  const handleBackToParent = useCallback(() => {
    setShowingChildren(null);
    setParentCategory(null);
    
    if (rootCategories.length > 0) {
      setSelectedCategory(rootCategories[0].id);
    }
  }, [rootCategories]);

  // معالج ضغط المنتج
  const handleProductClick = useCallback((product: PosProduct) => {
    if (!canAddProduct(selectedOrderType)) {
      showWarning(t("pos.newSales.messages.selectTable"));
      return;
    }

    if (product.hasMultiplePrices) {
      setSelectedProduct(product);
      setShowPricePopup(true);
    } else if (product.productPrices.length > 0) {
      const price = product.productPrices[0];
      
      if (hasProductOptions(product)) {
        setSelectedProductForOptions(product);
        setSelectedPriceForOptions(price);
        setShowOptionsPopup(true);
      } else {
        addToOrder(product, price, []);
      }
    }
  }, [addToOrder, showWarning, hasProductOptions, selectedOrderType, canAddProduct]);

  // إضافة معالج اختيار الطاولة
  const handleTableSelect = useCallback((selection: TableSelection) => {
    if (moveTableMode) {
      // إذا كنا فى وضع النقل، قم بنقل الطلب للطاولة الجديدة
      handleMoveToTable(selection);
      setMoveTableMode(false);
    } else {
      selectTable(selection);
      setShowTablePopup(false);
    }
  }, [moveTableMode, handleMoveToTable, selectTable]);

  // إضافة معالج فتح popup الطاولة
  const handleTableClick = useCallback(() => {
    setShowTablePopup(true);
  }, []);

  // تعديل معالج تغيير نوع الطلب
  const handleOrderTypeChange = useCallback((type: string) => {
    setSelectedOrderType(type);
    
    if (type === 'Dine-in' && isTableRequired(type)) {
      setShowTablePopup(true);
    }
    
    if (type !== 'Dine-in') {
      clearSelectedTable();
    }
  }, [isTableRequired, clearSelectedTable]);

  // معالج اختيار السعر
  const handlePriceSelect = useCallback((price: PosPrice) => {
    if (selectedProduct) {
      if (hasProductOptions(selectedProduct)) {
        setSelectedProductForOptions(selectedProduct);
        setSelectedPriceForOptions(price);
        setShowPricePopup(false);
        setShowOptionsPopup(true);
      } else {
        addToOrder(selectedProduct, price, []);
      }
    }
    setSelectedProduct(null);
  }, [selectedProduct, addToOrder, hasProductOptions]);

  // معالج إكمال اختيار المجموعات
  const handleOptionsComplete = useCallback((selectedOptions: SelectedOption[]) => {
    if (selectedProductForOptions && selectedPriceForOptions) {
      addToOrder(selectedProductForOptions, selectedPriceForOptions, selectedOptions);
    }
    setShowOptionsPopup(false);
    setSelectedProductForOptions(null);
    setSelectedPriceForOptions(null);
  }, [selectedProductForOptions, selectedPriceForOptions, addToOrder]);

  // معالج عرض الطلب من popup
  const handleViewOrderFromPopup = useCallback(async (invoiceData: any) => {
    try {
      setIsLoadingOrder(true);
      setCurrentBackInvoiceCode(invoiceData.backInvoiceCode || null);

      const convertedData = await InvoiceDataConverter.convertInvoiceForEdit(invoiceData);
      setOrderItems(convertedData.orderItems);
      setDeliveryCharge(convertedData.deliveryCharge);
      setCurrentInvoiceId(invoiceData.id);

      if (convertedData.selectedCustomer) {
        setSelectedCustomer(convertedData.selectedCustomer);
        setCustomerName(`${convertedData.selectedCustomer.name} - ${convertedData.selectedCustomer.phone1}`);
        if (convertedData.selectedCustomer.addresses.length > 0) {
          setSelectedAddress(convertedData.selectedCustomer.addresses[0]);
        }
      }

      const orderTypeMap: { [key: number]: string } = {
        1: 'Takeaway',
        2: 'Dine-in', 
        3: 'Delivery',
        4: 'Pickup',
        5: 'DeliveryCompany'
      };
      
      const newOrderType = orderTypeMap[invoiceData.invoiceType] || 'Takeaway';
      setSelectedOrderType(newOrderType);
      
      if (invoiceData.invoiceType === 5 && invoiceData.deliveryCompanyId) {
        const company = deliveryCompanies.find(c => c.id === invoiceData.deliveryCompanyId);
        if (company) {
          setSelectedDeliveryCompany(company);
        }
      }
      
      setIsEditMode(true);
      setCurrentInvoiceId(invoiceData.id);
      if (typeof invoiceData.invoiceStatus === 'number') {
        setCurrentInvoiceStatus(invoiceData.invoiceStatus);
      } else {
        setCurrentInvoiceStatus(1);
      }
    } catch (error) {
      console.error('❌ خطأ في تحويل بيانات الطلب:', error);
      showError('فشل في تحميل بيانات الطلب للتعديل');
    } finally {
      setIsLoadingOrder(false);
    }
  }, [setOrderItems, setSelectedCustomer, setCustomerName, setSelectedAddress, setSelectedOrderType, setIsEditMode, setCurrentInvoiceId, showError]);

  const handleViewTableOrder = useCallback((invoiceData: any) => {
    setShowTablePopup(false);
    
    if (invoiceData.isNewInvoice) {
      setOrderItems([]);
      setIsEditMode(false);
      setCurrentInvoiceId(null);
      setSelectedCustomer(null);
      setSelectedAddress(null);
      setCustomerName('');
      setCurrentInvoiceStatus(1);
      return;
    }

    if (invoiceData.isMultiInvoice && invoiceData.invoices) {
      setInvoiceOptions(invoiceData.invoices);
      setShowInvoiceSelectPopup(true);
      return;
    }
    handleViewOrderFromPopup(invoiceData);
  }, [handleViewOrderFromPopup]);

  useEffect(() => {
    const allProducts = getProducts(false);
    allProducts.forEach(product => {
      InvoiceDataConverter.cacheProduct(product);
    });
  }, [getProducts]);

  // أضف في معالج اختيار العميل
  const handleCustomerSelect = useCallback((customer: Customer, address: CustomerAddress) => {
    InvoiceDataConverter.cacheCustomer(customer);
    setSelectedCustomer(customer);
    setSelectedAddress(address);
    setCustomerName(`${customer.name} - ${customer.phone1}`);
  }, []);

  // حذف منتج من الطلب
  const removeOrderItem = useCallback((itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  // دالة التحقق من صحة الإدخال
  const validateKeypadInput = useCallback((value: string): boolean => {
    if (!value || value.trim() === '') return false;
    if (value === '.') return true;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (numValue < 0) return false;
    
    const decimalPlaces = value.split('.')[1]?.length || 0;
    if (decimalPlaces > 3) return false;
    if (numValue > 999999) return false;
    
    return true;
  }, []);

  // معالج إدخال الأرقام المحسن
  const handleNumberClick = useCallback((number: string) => {
    let newValue = keypadValue;
    
    if (number === '.') {
      if (!keypadValue.includes('.')) {
        newValue = keypadValue + '.';
      } else {
        return;
      }
    } else {
      if (keypadValue === '0' && number !== '0') {
        newValue = number;
      } else {
        newValue = keypadValue + number;
      }
    }
    
    if (validateKeypadInput(newValue)) {
      setKeypadValue(newValue);
    }
  }, [keypadValue, validateKeypadInput]);

  // دالة للحصول على القيمة الرقمية
  const getNumericValue = useCallback((): number => {
    const value = parseFloat(keypadValue);
    return isNaN(value) || value <= 0 ? 1 : value;
  }, [keypadValue]);

  // دالة المسح
  const handleClearClick = useCallback(() => {
    setKeypadValue('0');
  }, []);

  // ✅ إصلاح دعم لوحة المفاتيح العادية مع حل خطأ contentEditable
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const isAnyPopupOpen = showPricePopup || showOptionsPopup || showOrderDetailsPopup || showTablePopup;
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' || 
                            (activeElement as HTMLElement)?.contentEditable === 'true';
      if (isAnyPopupOpen || isInputFocused) {
        return;
      }
      const key = event.key;
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleNumberClick(key);
      } else if (key === '.') {
        event.preventDefault();
        handleNumberClick('.');
      } else if (key === 'Backspace') {
        event.preventDefault();
        if (keypadValue.length > 1) {
          const newValue = keypadValue.slice(0, -1);
          if (validateKeypadInput(newValue)) {
            setKeypadValue(newValue);
          }
        } else {
          setKeypadValue('0');
        }
      } else if (key === 'Delete' || key === 'Escape') {
        event.preventDefault();
        handleClearClick();
      } else if (key === 'Enter') {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [keypadValue, handleNumberClick, handleClearClick, validateKeypadInput, showPricePopup, showOptionsPopup, showOrderDetailsPopup, showTablePopup]);

  const handleChipClick = useCallback((chipType: string) => {
    setSelectedChips(prev => 
      prev.includes(chipType) 
        ? prev.filter(chip => chip !== chipType)
        : [...prev, chipType]
    );
  }, []);

  const handleResetOrder = useCallback(() => {
    setOrderItems([]);
    setSelectedOrderItemId(null);
    setCustomerName('');
    setKeypadValue('0');
    setSelectedCustomer(null);
    setSelectedAddress(null);
    setDeliveryCharge(0);
    setIsEditMode(false);
    setCurrentInvoiceId(null);
    clearSelectedTable();
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setSelectedChips([]);
    handleBackToMainProducts();
    setSearchQuery('');
    console.log('Order reset successfully');
  }, [handleBackToMainProducts, clearSelectedTable]);

  const handleOrderCompleted = useCallback((result: any) => {
    console.log('تم إنهاء الطلب بنجاح:', result);
    handleResetOrder();
    console.log('تم إعادة تعيين النظام بنجاح');
  }, [handleResetOrder]);

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="pos-system loading">
        <div className="loading-spinner">جاري تحميل البيانات...</div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="pos-system error">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="pos-system" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header
        selectedOrderType={selectedOrderType}
        onOrderTypeChange={handleOrderTypeChange}
        onResetOrder={handleResetOrder}
        onTableClick={handleTableClick}
        tableDisplayName={getTableDisplayName()}
        deliveryCompanies={deliveryCompanies}
        selectedDeliveryCompany={selectedDeliveryCompany}
        onDeliveryCompanySelect={setSelectedDeliveryCompany}
        selectedCustomer={selectedCustomer}
        selectedAddress={selectedAddress}
        onViewOrder={handleViewOrderFromPopup}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        onCustomerSelect={handleCustomerSelect}
        onMoveTable={handleToolsMoveTable}
        onSplitReceipt={handleToolsSplitReceipt}
        hasCurrentOrder={!!currentInvoiceId}
      />
      <main className="main-content">
        <section className="products-section">
          <ActionButtons
            selectedChips={selectedChips}
            onChipClick={handleChipClick}
            isExtraMode={isExtraMode}
            isWithoutMode={isWithoutMode}
            onExtraClick={handleExtraClick}
            onWithoutClick={handleWithoutClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            hasSelectedOrderItem={true}
          />
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        </section>
        <aside className="categories-sidebar">
          <div className="categories-list">
            {isAdditionMode && (
              <button
                onClick={handleBackToMainProducts}
                className="category-item back-button main-back"
              >
                <ArrowBackIcon />
                <span>رجوع للمنتجات الأساسية</span>
              </button>
            )}
            {showingChildren && (
              <button
                onClick={handleBackToParent}
                className="category-item back-button"
              >
                <ArrowBackIcon />
                <span>رجوع</span>
              </button>
            )}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => showingChildren ? handleChildCategorySelect(category.id) : handleCategorySelect(category.id)}
                className={`category-item ${category.id === selectedCategory ? 'active' : ''}`}
              >
                <img src={category.image} alt={category.name} />
                <span>{category.nameArabic}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="order-section">
          <div className="order-summary-container">
            <OrderSummary
              orderSummary={orderSummary}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              onRemoveOrderItem={removeOrderItem}
              onRemoveSubItem={handleRemoveSubItem}
              selectedOrderItemId={selectedOrderItemId}
              onOrderItemSelect={handleOrderItemSelect}
              onOrderItemDoubleClick={handleOrderItemDoubleClick}
              selectedCustomer={selectedCustomer}
              selectedAddress={selectedAddress}
              onCustomerSelect={handleCustomerSelect}
              orderType={selectedOrderType}
              onDeliveryChargeChange={handleDeliveryChargeChange}
              readOnly={false}
              onOrderCompleted={handleOrderCompleted}
              selectedTable={selectedTable}
              selectedDeliveryCompany={selectedDeliveryCompany}
              isEditMode={isEditMode}
              currentInvoiceId={currentInvoiceId}
              currentBackInvoiceCode={currentBackInvoiceCode}
            />
          </div>
          <div className="number-pad-section">
            <div className="keypad-grid">
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '.'].map((key) => (
                <button 
                  key={key}
                  className={`keypad-key ${key === 'C' ? 'clear-key' : ''}`}
                  onClick={() => key === 'C' ? handleClearClick() : handleNumberClick(key)}
                >
                  {key === 'C' ? `C (${keypadValue})` : key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <PriceSelectionPopup
        product={selectedProduct}
        quantity={getNumericValue()}
        isOpen={showPricePopup}
        onClose={() => {
          setShowPricePopup(false);
          setSelectedProduct(null);
        }}
        onSelectPrice={handlePriceSelect}
      />
      <ProductOptionsPopup
        product={selectedProductForOptions}
        selectedPrice={selectedPriceForOptions}
        quantity={getNumericValue()}
        isOpen={showOptionsPopup}
        onClose={() => {
          setShowOptionsPopup(false);
          setSelectedProductForOptions(null);
          setSelectedPriceForOptions(null);
        }}
        onComplete={handleOptionsComplete}
      />
      <OrderItemDetailsPopup
        orderItem={selectedOrderItemForDetails}
        isOpen={showOrderDetailsPopup}
        onClose={() => {
          setShowOrderDetailsPopup(false);
          setSelectedOrderItemForDetails(null);
        }}
        onUpdateItem={handleUpdateOrderItem}
        onRemoveItem={removeOrderItem}
      />
      <TableSelectionPopup
        isOpen={showTablePopup}
        onClose={() => setShowTablePopup(false)}
        onSelectTable={handleTableSelect}
        onViewOrder={handleViewTableOrder}
        tableSections={tableSections}
      />
      <InvoiceSelectionPopup
        isOpen={showInvoiceSelectPopup}
        invoices={invoiceOptions as any}
        onSelect={(invoice) => {
          setShowInvoiceSelectPopup(false);
          handleViewOrderFromPopup(invoice);
        }}
        onClose={() => setShowInvoiceSelectPopup(false)}
      />
      <SplitReceiptPopup
        isOpen={showSplitPopup}
        onClose={() => setShowSplitPopup(false)}
        orderItems={orderItems}
        orderType={selectedOrderType}
        currentInvoiceId={currentInvoiceId}
        currentInvoiceStatus={currentInvoiceStatus}
        selectedTable={selectedTable}
        selectedCustomer={selectedCustomer}
        selectedAddress={selectedAddress}
        selectedDeliveryCompany={selectedDeliveryCompany}
        onSplitComplete={(remainingItems) => {
          setOrderItems(remainingItems);
        }}
      />
    </div>
  );
};

export default PosSystem;