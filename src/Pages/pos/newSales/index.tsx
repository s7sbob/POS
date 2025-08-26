// src/Pages/pos/newSales/index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PosProduct, CategoryItem, OrderSummary as OrderSummaryType, OrderItem, PosPrice, SelectedOption } from './types/PosSystem';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderItemDetailsPopup from './components/OrderItemDetailsPopup';
import TableSelectionPopup from './components/TableSelectionPopup';
import { useTableManager } from './hooks/useTableManager';
import { TableSelection } from './types/TableSystem';
import { useError } from '../../../contexts/ErrorContext';
import * as deliveryCompaniesApi from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { DeliveryCompany } from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import InvoiceDataConverter from '../../../utils/invoiceDataConverter';

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState('Takeaway');
  const [showTablePopup, setShowTablePopup] = useState(false);
const { showWarning, showError } = useError();
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
    setSelectedChips(prev => prev.includes('extra') ? prev : [...prev.filter(chip => chip !== 'without'), 'extra']);
    
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
    setSelectedChips(prev => prev.includes('without') ? prev : [...prev.filter(chip => chip !== 'extra'), 'without']);
    
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
      showWarning('يجب اختيار الطاولة أولاً');
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
  selectTable(selection);
  setShowTablePopup(false);
}, [selectTable]);




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

  // تعديل حساب ملخص الطلب ليشمل الخدمة
const calculateOrderSummary = useCallback((): OrderSummaryType => {
  console.log('🔄 حساب orderSummary مع:', orderItems.length, 'عنصر');
  
  orderItems.forEach((item, index) => {
    console.log(`   ${index + 1}: ${item.product.nameArabic} (الكمية: ${item.quantity}) - ID: ${item.id}`);
  });
  
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceCharge = getServiceCharge();
  const service = (subtotal * serviceCharge) / 100;
  const discountPercentage = 0;
  const discount = (subtotal * discountPercentage) / 100;
  const tax = 0;
  
  // حساب المجاميع بالترتيب الصحيح
  const totalAfterDiscount = subtotal - discount;
  const totalAfterTaxAndService = totalAfterDiscount + tax + service + deliveryCharge;
  
  const summary = {
    items: orderItems,
    subtotal,
    discount,
    tax,
    service,
    total: totalAfterTaxAndService,
    totalAfterDiscount,
    totalAfterTaxAndService
  };
  
  console.log('📊 orderSummary محسوب:', {
    itemsCount: summary.items.length,
    subtotal: summary.subtotal,
    total: summary.total
  });
  
  return summary;
}, [orderItems, getServiceCharge, deliveryCharge]);

// واستخدمه في كل مرة:
const orderSummary = calculateOrderSummary();

// معالج عرض الطلب من popup
const handleViewOrderFromPopup = useCallback(async (invoiceData: any) => {
  console.log('🔄 بدء معالجة الطلب للعرض:', invoiceData);
  
  try {
    setIsLoadingOrder(true); // ✅ استبدل setLoading بـ setIsLoadingOrder
    
    // استخدام المحول الجديد
    const convertedData = await InvoiceDataConverter.convertInvoiceForEdit(invoiceData);
    
    // تطبيق البيانات على الواجهة
    setOrderItems(convertedData.orderItems);
    setDeliveryCharge(convertedData.deliveryCharge);
     // تطبيق بيانات العميل
    if (convertedData.selectedCustomer) {
      setSelectedCustomer(convertedData.selectedCustomer);
      setCustomerName(`${convertedData.selectedCustomer.name} - ${convertedData.selectedCustomer.phone1}`);
      
      // تطبيق أول عنوان إذا كان متوفر
      if (convertedData.selectedCustomer.addresses.length > 0) {
        setSelectedAddress(convertedData.selectedCustomer.addresses[0]);
      }
    }
    
    // تطبيق نوع الطلب
    const orderTypeMap: { [key: number]: string } = {
      1: 'Takeaway',
      2: 'Dine-in', 
      3: 'Delivery',
      4: 'Pickup'
    };
    
    const newOrderType = orderTypeMap[invoiceData.invoiceType] || 'Takeaway';
    setSelectedOrderType(newOrderType);
    
    // تفعيل وضع التعديل
    setIsEditMode(true);
    setCurrentInvoiceId(invoiceData.id);
    
    console.log('✅ تم تطبيق بيانات الطلب بنجاح');
    
  } catch (error) {
    console.error('❌ خطأ في تحويل بيانات الطلب:', error);
    showError('فشل في تحميل بيانات الطلب للتعديل');
  } finally {
    setIsLoadingOrder(false); // ✅ استبدل setLoading بـ setIsLoadingOrder
  }
}, [setOrderItems, setSelectedCustomer, setCustomerName, setSelectedAddress, 
    setSelectedOrderType, setIsEditMode, setCurrentInvoiceId, showError]);


    const handleViewTableOrder = useCallback((invoiceData: any) => {
  setShowTablePopup(false);
  // استخدام نفس معالج عرض الطلب الموجود
  handleViewOrderFromPopup(invoiceData);
}, [handleViewOrderFromPopup]);

    useEffect(() => {
  // حفظ المنتجات المحملة في كاش المحول
  const allProducts = getProducts(false); // المنتجات العادية
  allProducts.forEach(product => {
    InvoiceDataConverter.cacheProduct(product);
  });
}, [getProducts]);

// أضف في معالج اختيار العميل
const handleCustomerSelect = useCallback((customer: Customer, address: CustomerAddress) => {
  // حفظ العميل في الكاش
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
      // التحقق من عدم وجود popup مفتوح
      const isAnyPopupOpen = showPricePopup || showOptionsPopup || showOrderDetailsPopup || showTablePopup;
      
      // التحقق من عدم وجود input مركز عليه - مع إصلاح خطأ contentEditable
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' || 
                            (activeElement as HTMLElement)?.contentEditable === 'true';
      
      // إذا كان هناك popup مفتوح أو input مركز عليه، لا نتدخل
      if (isAnyPopupOpen || isInputFocused) {
        return;
      }
      
      const key = event.key;
      
      // الأرقام والنقطة العشرية
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleNumberClick(key);
      } else if (key === '.') {
        event.preventDefault();
        handleNumberClick('.');
      } else if (key === 'Backspace') {
        event.preventDefault();
        // حذف آخر رقم
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
        // يمكن إضافة وظيفة معينة عند الضغط على Enter
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    keypadValue, 
    handleNumberClick, 
    handleClearClick, 
    validateKeypadInput,
    showPricePopup,
    showOptionsPopup,
    showOrderDetailsPopup,
    showTablePopup
  ]);

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
  
  // إعادة تعيين وضع التعديل
  setIsEditMode(false);
  setCurrentInvoiceId(null);
  
  clearSelectedTable();

  setIsExtraMode(false);
  setIsWithoutMode(false);
  setSelectedChips([]);
  
  handleBackToMainProducts();
  setSearchQuery('');
  
  // تنظيف الكاش عند الحاجة (اختياري)
  // InvoiceDataConverter.clearCache();
  
  console.log('Order reset successfully');
}, [handleBackToMainProducts, clearSelectedTable]);

    const handleOrderCompleted = useCallback((result: any) => {
  console.log('تم إنهاء الطلب بنجاح:', result);
  
  // إعادة تعيين جميع المتغيرات كما لو تم الضغط على Reset
  handleResetOrder();
  
  // يمكنك إضافة أي منطق إضافي هنا مثل عرض رسالة نجاح
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
    <div className="pos-system">
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
        onViewOrder={handleViewOrderFromPopup} // إضافة هذا

      />

      <main className="main-content">
        <section className="products-section">
          <div className="number-pad-bar">
            <div className="keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'].map((key) => (
                <button 
                  key={key}
                  className="keypad-key"
                  onClick={() => key === 'C' ? handleClearClick() : handleNumberClick(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="keypad-display">
              {keypadValue}
            </div>
          </div>

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
          onDeliveryChargeChange={handleDeliveryChargeChange} readOnly={false}   onOrderCompleted={handleOrderCompleted} 
          selectedTable={selectedTable} // ✅ إضافة هذا
          selectedDeliveryCompany={selectedDeliveryCompany} // ✅ إضافة هذا// إضافة المعالج الجديد
          isEditMode={isEditMode}
  currentInvoiceId={currentInvoiceId}
       />
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
  onViewOrder={handleViewTableOrder} // إضافة جديدة
  tableSections={tableSections}
/>

      
    </div>
  );
};

export default PosSystem;

