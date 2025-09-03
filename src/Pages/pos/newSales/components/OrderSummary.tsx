// src/Pages/pos/newSales/components/OrderSummary.tsx - تصحيح مشكلة إغلاق الـ dropdown
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderSummary as OrderSummaryType, OrderItem, SubItem } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import * as customersApi from 'src/utils/api/pagesApi/customersApi';
import * as deliveryZonesApi from 'src/utils/api/pagesApi/deliveryZonesApi';
import CustomerDetailsPopup from './CustomerDetailsPopup';
import CustomerForm from '../../customers/components/CustomerForm';
import styles from '../styles/OrderSummary.module.css';
import PaymentPopup from './PaymentPopup';
import SimplePaymentChoicePopup from './SimplePaymentChoicePopup';
import { useInvoiceManager } from '../hooks/useInvoiceManager';

interface OrderSummaryProps {
  orderSummary: OrderSummaryType;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveOrderItem: (itemId: string) => void;
  onRemoveSubItem: (orderItemId: string, subItemId: string) => void;
  selectedOrderItemId: string | null;
  onOrderItemSelect: (itemId: string) => void;
  onOrderItemDoubleClick?: (item: OrderItem) => void;
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  onCustomerSelect: (customer: Customer, address: CustomerAddress) => void;
  orderType: string;
  onDeliveryChargeChange: (charge: number) => void;
  readOnly: boolean;
  onOrderCompleted?: (result: any) => void;
  selectedTable?: any;
  selectedDeliveryCompany?: any;
  // إضافة الـ props المطلوبة لوضع التعديل
  isEditMode?: boolean;
  currentInvoiceId?: string | null;
  currentBackInvoiceCode?: string | null; // ✅ إضافة جديدة

}

export enum InvoiceStatus {
  SENT = 1,
  PRINTED = 2,
  PAID = 3
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveOrderItem,
  onRemoveSubItem,
  selectedOrderItemId,
  onOrderItemSelect,
  onOrderItemDoubleClick,
  selectedCustomer,
  selectedAddress,
  onCustomerSelect,
  onOrderCompleted,
  orderType,
  onDeliveryChargeChange,
  readOnly = false,
  selectedTable,
  selectedDeliveryCompany,
  // استقبال الـ props الجديدة مع قيم افتراضية
  isEditMode = false,
  currentInvoiceId = null,
  currentBackInvoiceCode = null // ✅ إضافة جديدة

}) => {
  const { t } = useTranslation();
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [zones, setZones] = useState<any[]>([]);
  const [, setSelectedResultIndex] = useState(-1);
  const [searchCache, setSearchCache] = useState<{[key: string]: Customer[]}>({});
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSimplePaymentChoice, setShowSimplePaymentChoice] = useState(false);
  const [pendingEnterAction, setPendingEnterAction] = useState<string | null>(null);
const { saveInvoice, isSubmitting, nextInvoiceCode, fetchNextInvoiceCode } = useInvoiceManager();

  // استخدام useRef بدلاً من state للمتغيرات المساعدة
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const lastSearchQuery = useRef<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
const [selectedActionType, setSelectedActionType] = useState<'send' | 'print' | 'pay'>('pay');

  // تحميل كود الفاتورة التالي عند تحميل المكون أو تغيير نوع الطلب
  useEffect(() => {
    const loadNextInvoiceCode = async () => {
      if (!isEditMode) {
        const invoiceType = getInvoiceType(orderType);
        await fetchNextInvoiceCode(invoiceType);
      }
    };
    
    loadNextInvoiceCode();
  }, [orderType, isEditMode, fetchNextInvoiceCode]);

  // دالة تحديد نوع الفاتورة
  const getInvoiceType = (orderType: string): number => {
    switch (orderType) {
      case 'Takeaway': return 1;
      case 'Dine-in': return 2;
      case 'Delivery': return 3;
      case 'Pickup': return 4;
      case 'DeliveryCompany': return 5;
      default: return 1;
    }
  };

  // تحميل المناطق عند بدء التشغيل
  useEffect(() => {
    const loadZones = async () => {
      try {
        const zonesData = await deliveryZonesApi.getAll();
        setZones(zonesData);
      } catch (error) {
        console.error('Error loading zones:', error);
      }
    };
    
    loadZones();
  }, []);




  // حساب رسوم التوصيل عند تغيير العنوان أو نوع الطلب
  useEffect(() => {
    if (orderType === 'Delivery' && selectedAddress && selectedAddress.zoneId) {
      const zone = zones.find(z => z.id === selectedAddress.zoneId);
      const charge = zone ? zone.deliveryCharge : 0;
      setDeliveryCharge(charge);
      onDeliveryChargeChange(charge);
    } else {
      setDeliveryCharge(0);
      onDeliveryChargeChange(0);
    }
  }, [orderType, selectedAddress, zones, onDeliveryChargeChange]);

  // دالة البحث المصححة
  const searchCustomers = useCallback(async (query: string): Promise<Customer[]> => {
    // التحقق من الكاش
    if (searchCache[query]) {
      return searchCache[query];
    }

    // إلغاء البحث السابق
    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }

    const newController = new AbortController();
    searchAbortController.current = newController;

    try {
      const results = await customersApi.searchByPhone(query);
      
      // حفظ في الكاش
      setSearchCache(prev => ({
        ...prev,
        [query]: results
      }));
      
      return results;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.error('Error searching customers:', error);
      throw error;
    }
  }, [searchCache]);

  // useEffect للبحث مع تحسين عرض الـ dropdown
  useEffect(() => {
    // إلغاء المؤقت السابق
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    const query = phoneInput.trim();
    
    // إذا النص فاضي، امسح النتائج ولكن لا تُخفي الـ dropdown إذا كان الـ input له focus
    if (!query) {
      setSearchResults([]);
      if (!inputHasFocus) {
        setShowDropdown(false);
      }
      setSelectedResultIndex(-1);
      setIsSearching(false);
      return;
    }

    // إذا النص أقل من 3 أحرف، ما تبحثش ولكن أظهر رسالة
    if (query.length < 3) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      // أظهر الـ dropdown مع رسالة "اكتب 3 أحرف على الأقل" إذا كان الـ input له focus
      if (inputHasFocus) {
        setShowDropdown(true);
      }
      return;
    }

    // إذا هو نفس البحث السابق والنتائج موجودة، أظهر النتائج فقط
    if (query === lastSearchQuery.current && searchResults.length >= 0) {
      if (inputHasFocus) {
        setShowDropdown(true);
      }
      return;
    }

    // بدء البحث مع تأخير
    const performSearch = async () => {
      // التأكد إن النص لسه نفسه (مش اتغير أثناء التأخير)
      if (phoneInput.trim() !== query) {
        return;
      }

      setIsSearching(true);
      lastSearchQuery.current = query;
      
      try {
        const results = await searchCustomers(query);
        
        // التأكد إن النص لسه نفسه بعد البحث
        if (phoneInput.trim() === query) {
          setSearchResults(results);
          // أظهر الـ dropdown فقط إذا كان الـ input له focus أو كان مفتوح من قبل
          if (inputHasFocus || showDropdown) {
            setShowDropdown(true);
          }
          setSelectedResultIndex(-1);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
          // عرض النتائج الفارغة فقط إذا النص لسه نفسه والـ input له focus
          if (phoneInput.trim() === query && inputHasFocus) {
            setSearchResults([]);
            setShowDropdown(true);
          }
        }
      } finally {
        // إيقاف مؤشر التحميل فقط إذا النص لسه نفسه
        if (phoneInput.trim() === query) {
          setIsSearching(false);
        }
      }
    };

    // تأخير البحث 500ms
    searchDebounceTimer.current = setTimeout(performSearch, 500);

    // تنظيف المؤقت عند التغيير
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [phoneInput, searchCustomers, inputHasFocus, showDropdown, searchResults.length]);

  // إغلاق الـ dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedResultIndex(-1);
        setInputHasFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تنظيف عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (searchAbortController.current) {
        searchAbortController.current.abort();
      }
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);


  // معالج Focus للـ input

  const canOpenPayment = orderSummary.items.length > 0;


  // معالج Blur للـ input

  const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomerForDetails(customer);
    setShowCustomerDetails(true);
    setShowDropdown(false);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, []);



// أضف دالة جديدة للتعامل مع Enter:
const handleEnterAction = useCallback(async (query: string) => {
  try {
    setIsSearching(true);
    const results = await searchCustomers(query);
    
    if (results.length > 0) {
      // تحقق من وجود مطابقة تامة للرقم الكامل
      const exactMatch = results.find(customer => 
        customer.phone1 === query || 
        customer.phone2 === query ||
        customer.phone3 === query ||
        customer.phone4 === query
      );
      
      setSearchResults(results);
      setShowDropdown(true);
      setSelectedResultIndex(-1);
      
      if (exactMatch) {
        // إذا وجدت مطابقة تامة، اختارها مباشرة
        handleCustomerSelect(exactMatch);
      } else {
        // إذا مفيش مطابقة تامة، أظهر النتائج فقط
        // المستخدم يختار بنفسه أو يضيف عميل جديد من الزر
      }
    } else {
      // مفيش نتائج، افتح عميل جديد
      setShowCustomerForm(true);
    }
  } catch (error) {
    console.error('Search failed:', error);
    setShowCustomerForm(true);
  } finally {
    setIsSearching(false);
  }
}, [searchCustomers, handleCustomerSelect]);

// أضف useEffect للتعامل مع الإجراءات المعلقة:
useEffect(() => {
  // إذا كان هناك إجراء معلق والبحث انتهى
  if (pendingEnterAction && !isSearching) {
    const query = pendingEnterAction;
    setPendingEnterAction(null);
    
    // تنفيذ الإجراء المعلق
    handleEnterAction(query);
  }
}, [isSearching, pendingEnterAction, handleEnterAction]);

// عدل useEffect الخاص بالبحث ليمنع الإجراءات أثناء البحث:
useEffect(() => {
  // إلغاء المؤقت السابق
  if (searchDebounceTimer.current) {
    clearTimeout(searchDebounceTimer.current);
  }

  const query = phoneInput.trim();
  
  // إذا النص فاضي، امسح النتائج ولكن لا تُخفي الـ dropdown إذا كان الـ input له focus
  if (!query) {
    setSearchResults([]);
    if (!inputHasFocus) {
      setShowDropdown(false);
    }
    setSelectedResultIndex(-1);
    setIsSearching(false);
    // إلغاء أي إجراء معلق
    setPendingEnterAction(null);
    return;
  }

  // إذا النص أقل من 3 أحرف، ما تبحثش ولكن أظهر رسالة
  if (query.length < 3) {
    setSearchResults([]);
    setSelectedResultIndex(-1);
    setPendingEnterAction(null);
    // أظهر الـ dropdown مع رسالة "اكتب 3 أحرف على الأقل" إذا كان الـ input له focus
    if (inputHasFocus) {
      setShowDropdown(true);
    }
    return;
  }

  // إذا هو نفس البحث السابق والنتائج موجودة، أظهر النتائج فقط
  if (query === lastSearchQuery.current && searchResults.length >= 0) {
    if (inputHasFocus) {
      setShowDropdown(true);
    }
    return;
  }

  // بدء البحث مع تأخير
  const performSearch = async () => {
    // التأكد إن النص لسه نفسه (مش اتغير أثناء التأخير)
    if (phoneInput.trim() !== query) {
      return;
    }

    setIsSearching(true);
    lastSearchQuery.current = query;
    
    try {
      const results = await searchCustomers(query);
      
      // التأكد إن النص لسه نفسه بعد البحث
      if (phoneInput.trim() === query) {
        setSearchResults(results);
        // أظهر الـ dropdown فقط إذا كان الـ input له focus أو كان مفتوح من قبل
        if (inputHasFocus || showDropdown) {
          setShowDropdown(true);
        }
        setSelectedResultIndex(-1);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Search failed:', error);
        // عرض النتائج الفارغة فقط إذا النص لسه نفسه والـ input له focus
        if (phoneInput.trim() === query && inputHasFocus) {
          setSearchResults([]);
          setShowDropdown(true);
        }
      }
    } finally {
      // إيقاف مؤشر التحميل فقط إذا النص لسه نفسه
      if (phoneInput.trim() === query) {
        setIsSearching(false);
      }
    }
  };

  // تأخير البحث 500ms
  searchDebounceTimer.current = setTimeout(performSearch, 500);

  // تنظيف المؤقت عند التغيير
  return () => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }
  };
}, [phoneInput, searchCustomers, inputHasFocus, showDropdown, searchResults.length]);
  const handleCustomerDetailsSelect = useCallback((customer: Customer, address: CustomerAddress) => {
    onCustomerSelect(customer, address);
    
    // إفراغ حقل البحث
    setPhoneInput('');
    setShowCustomerDetails(false);
    
    // إخفاء الـ dropdown
    setShowDropdown(false);
    setSearchResults([]);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, [onCustomerSelect]);


  const handleCustomerFormSubmit = useCallback(async (data: any) => {
    try {
      const newCustomer = await customersApi.add(data);
      if (newCustomer.addresses.length > 0) {
        onCustomerSelect(newCustomer, newCustomer.addresses[0]);
        // إفراغ حقل البحث
        setPhoneInput('');
      }
      setShowCustomerForm(false);
      
      // إخفاء الـ dropdown
      setShowDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }, [onCustomerSelect]);

  // إضافة معالج إغلاق نموذج العميل
  const handleCustomerFormClose = useCallback(() => {
    setShowCustomerForm(false);
  }, []);

  // إضافة معالج إغلاق تفاصيل العميل
  const handleCustomerDetailsClose = useCallback(() => {
    setShowCustomerDetails(false);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      // إفراغ حقل البحث عند اختيار عميل فقط
      setPhoneInput('');
      setShowDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    }
  }, [selectedCustomer]);

  // حساب الإجمالي النهائي
  const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
  const taxAmount = 0;
  const finalTotal = subtotalWithDelivery + taxAmount - orderSummary.discount;


  // دالة جديدة للحفظ المباشر لـ Send و Print
// دالة جديدة للحفظ المباشر لـ Send و Print
const handleDirectSave = useCallback(async (actionType: 'send' | 'print') => {
  try {
    console.log(`🔄 بدء معالجة ${actionType}...`);
    
    // ✅ تأكد من وجود items قبل المتابعة
    if (!orderSummary.items || orderSummary.items.length === 0) {
      console.error('❌ لا توجد عناصر في الطلب');
      return;
    }
    
    console.log(`📊 عدد العناصر في orderSummary: ${orderSummary.items.length}`);
    console.log('🔍 محتوى العناصر:', orderSummary.items.map(item => ({
      id: item.id,
      name: item.product.nameArabic,
      quantity: item.quantity,
      price: item.selectedPrice.price
    })));
    
    // إنشاء دفعة كاش افتراضية بقيمة 0
    const defaultPayments: { method: string; amount: number; isSelected: boolean }[] = [
      {
        method: 'cash',
        amount: 0,
        isSelected: true
      }
    ];
    
    const invoiceStatus = actionType === 'send' ? 1 : 2;
    
    // ✅ حفظ الفاتورة مع البيانات الكاملة
    const result = await saveInvoice(
      orderSummary, // هذا يحتوي على العناصر الجديدة
      orderType,
      defaultPayments,
      invoiceStatus,
      {
        isEditMode,
        invoiceId: currentInvoiceId,
        selectedCustomer,
        selectedAddress,
        selectedDeliveryCompany,
        selectedTable,
        servicePercentage: 0,
        taxPercentage: 0,
        discountPercentage: 0,
        notes: customerName,
        // عند تعديل فاتورة موجودة يجب إزالة المنتجات المحذوفة
        preserveMissingItems: !isEditMode ? true : false
      }
    );
    
    const actionName = actionType === 'send' ? 'إرسال' : 'طباعة';
    console.log(`✅ تم ${actionName} الطلب بنجاح! رقم الفاتورة: ${result.invoiceNumber}`);
    
    if (onOrderCompleted) {
      onOrderCompleted({
        success: true,
        invoice: result,
        actionType: actionType
      });
    }
    
  } catch (error) {
    console.error(`❌ خطأ في ${actionType}:`, error);
  }
}, [saveInvoice, orderSummary, orderType, isEditMode, currentInvoiceId, 
    selectedCustomer, selectedAddress, selectedDeliveryCompany, selectedTable, 
    customerName, onOrderCompleted]);

// دالة جديدة للدفع المباشر (cash أو visa)
const handleDirectPayment = useCallback(async (paymentType: 'cash' | 'visa') => {
  try {
    console.log(`🔄 بدء معالجة الدفع المباشر بـ ${paymentType}...`);
    
    // ✅ تأكد من وجود items قبل المتابعة
    if (!orderSummary.items || orderSummary.items.length === 0) {
      console.error('❌ لا توجد عناصر في الطلب');
      return;
    }
    
    // حساب المبلغ الإجمالي
    const deliveryCharge = 0;
    const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
    const taxAmount = 0;
    const finalTotal = subtotalWithDelivery + taxAmount - orderSummary.discount;
    
    // إنشاء دفعة بالنوع المحدد بالمبلغ الكامل
    const payments: { method: string; amount: number; isSelected: boolean }[] = [
      {
        method: paymentType,
        amount: finalTotal,
        isSelected: true
      }
    ];
    
    const invoiceStatus = 3; // PAID
    
    // ✅ حفظ الفاتورة مع البيانات الكاملة
    const result = await saveInvoice(
      orderSummary,
      orderType,
      payments,
      invoiceStatus,
      {
        isEditMode,
        invoiceId: currentInvoiceId,
        selectedCustomer,
        selectedAddress,
        selectedDeliveryCompany,
        selectedTable,
        servicePercentage: 0,
        taxPercentage: 0,
        discountPercentage: 0,
        notes: customerName,
        preserveMissingItems: !isEditMode ? true : false
      }
    );
    
    console.log(`✅ تم الدفع بـ ${paymentType} بنجاح! رقم الفاتورة: ${result.invoiceNumber}`);
    
    if (onOrderCompleted) {
      onOrderCompleted({
        success: true,
        invoice: result,
        actionType: 'pay',
        paymentType: paymentType
      });
    }
    
  } catch (error) {
    console.error(`❌ خطأ في الدفع بـ ${paymentType}:`, error);
  }
}, [saveInvoice, orderSummary, orderType, isEditMode, currentInvoiceId, 
    selectedCustomer, selectedAddress, selectedDeliveryCompany, selectedTable, 
    customerName, onOrderCompleted]);


const handleActionButtonClick = useCallback(async (actionType: 'send' | 'print' | 'pay') => {
  if (!canOpenPayment) {
    console.warn('❌ لا يمكن فتح الدفع - لا توجد عناصر');
    return;
  }
  
  console.log(`🔄 تم الضغط على زر ${actionType}`);
  console.log(`📊 عدد العناصر الحالي: ${orderSummary.items.length}`);
  
  if (actionType === 'pay') {
    setSelectedActionType(actionType);
    
    // التحقق من نوع الدفع لشركات التوصيل
    const isDeliveryCompany = orderType === 'DeliveryCompany';
    const deliveryCompanyPaymentType = selectedDeliveryCompany?.paymentType;
    
    if (isDeliveryCompany && deliveryCompanyPaymentType) {
      if (deliveryCompanyPaymentType.toLowerCase() === 'cash' || 
          deliveryCompanyPaymentType.toLowerCase() === 'visa') {
        // للـ cash و visa: حفظ مباشر بدون popup
        await handleDirectPayment(deliveryCompanyPaymentType.toLowerCase());
      } else if (deliveryCompanyPaymentType.toLowerCase() === 'inchoice') {
        // للـ inchoice: إظهار popup بسيط للاختيار
        setShowSimplePaymentChoice(true);
      } else {
        // أي نوع آخر: إظهار popup الدفع الكامل
        setShowPaymentPopup(true);
      }
    } else {
      // للطلبات العادية: إظهار popup الدفع الكامل
      setShowPaymentPopup(true);
    }
  } else {
    await handleDirectSave(actionType);
  }
}, [canOpenPayment, orderSummary.items.length, handleDirectSave, handleDirectPayment, orderType, selectedDeliveryCompany]);

// معالج اختيار نوع الدفع من الـ popup البسيط
const handleSimplePaymentChoice = useCallback(async (paymentType: 'cash' | 'visa') => {
  setShowSimplePaymentChoice(false);
  await handleDirectPayment(paymentType);
}, [handleDirectPayment]);

// معالج إغلاق الـ popup البسيط
const handleCloseSimplePaymentChoice = useCallback(() => {
  setShowSimplePaymentChoice(false);
}, []);




  // دوال العرض
  const renderSubItem = (subItem: SubItem, orderItemId: string) => {
    const canDelete = subItem.type === 'extra' || subItem.type === 'without';
    const isSelected = selectedSubItemId === subItem.id && canDelete;
    
    
    return (
      <div 
        key={subItem.id} 
        className={`${styles.subItem} ${isSelected ? styles.selectedSubItem : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          
          if (canDelete) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            if (isSelected && clickX <= 30) {
              onRemoveSubItem(orderItemId, subItem.id);
              setSelectedSubItemId(null);
            } else {
              setSelectedSubItemId(isSelected ? null : subItem.id);
            }
          }
        }}
        style={{
          cursor: canDelete ? 'pointer' : 'default'
        }}
      >
        <div className={styles.subItemDetails}>
          <div className={styles.subItemInfo}>
            {!isSelected && (
              <span className={`${styles.subItemBadge} ${styles[subItem.type]}`}>
                {subItem.type === 'extra' && '+'}
                {subItem.type === 'without' && '-'}
                {subItem.type === 'option' && '•'}
              </span>
            )}
            <div className={styles.subItemName}>
              {subItem.quantity} X {subItem.name}
            </div>
          </div>
        </div>
        
        <div className={styles.subItemPrices}>
          <div className={styles.subItemPrice}>
            {subItem.type === 'without' ? '0' : (subItem.price / subItem.quantity).toFixed(2)}
          </div>
          <div className={`${styles.subItemTotal} ${subItem.price < 0 ? styles.negative : ''}`}>
            {subItem.type === 'without' ? '0' : subItem.price.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = (options: any[]) => {
    return options.map((option: any, index: number) => (
      <div key={index} className={styles.optionDetail}>
        <span className={styles.optionText}>
          {option.quantity} X {option.itemName}
        </span>
        <div className={styles.optionPrices}>
          <div className={styles.optionPrice}>
            {option.extraPrice > 0 ? `+${option.extraPrice}` : '0'}
          </div>
          <div className={styles.optionTotal}>
            {(option.extraPrice * option.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    ));
  };

  const renderNotes = (notes: string) => {
    if (!notes || notes.trim() === '') return null;
    
    return (
      <div className={styles.commentsContainer}>
        <div className={styles.commentItem}>
          <span className={styles.commentIcon}>💬</span>
          <span className={styles.commentText}>{notes}</span>
        </div>
      </div>
    );
  };



  const shouldShowAllButtons = orderType !== 'Takeaway';
  const shouldShowPayOnly = orderType === 'Takeaway';

  return (
    <aside className={styles.orderSummary}>
      <div className={styles.orderHeader}>
<div className={styles.orderNumber}>
  {isEditMode && currentBackInvoiceCode ? 
    `#${currentBackInvoiceCode}` :  // ✅ استخدام backInvoiceCode
    (nextInvoiceCode ? `#${nextInvoiceCode}` : `#...`)
  }
</div>
        <div className={styles.orderTotal}>
          <span className={styles.amount}>{finalTotal.toFixed(2)}</span>
          <span className={styles.currency}>EGP</span>
        </div>
      </div>

      <div className={styles.orderContent}>
        {/* Order Items */}
        <div className={styles.orderItems}>
          {orderSummary.items.map((item) => (
            <div key={item.id} className={styles.orderItemContainer}>
              <div 
                className={`${styles.orderItem} ${selectedOrderItemId === item.id ? styles.selected : ''} ${item.isExtra ? styles.extraItem : ''} ${item.isWithout ? styles.withoutItem : ''}`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  
                  if (selectedOrderItemId === item.id && clickX <= 30) {
                    onRemoveOrderItem(item.id);
                  } else {
                    onOrderItemSelect(item.id);
                  }
                }}
                onDoubleClick={() => onOrderItemDoubleClick?.(item)}
              >
                <div className={styles.itemDetails}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {item.isExtra && <span className={styles.extraBadge}>+</span>}
                      {item.isWithout && <span className={styles.withoutBadge}>-</span>}
                      {item.quantity} X {item.product.nameArabic}
                      {item.product.hasMultiplePrices && (
                        <span className={styles.itemSizeInline}> - {item.selectedPrice.nameArabic}</span>
                      )}
                      {item.notes && (
                        <span className={styles.itemComment}> ({item.notes})</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.itemPrices}>
                  <div className={styles.itemPrice}>{item.selectedPrice.price}</div>
                  <div className={`${styles.itemTotal} ${item.isWithout ? styles.negative : ''}`}>
                    {item.totalPrice}
                  </div>
                </div>
              </div>
              
              {item.notes && renderNotes(item.notes)}
              
              {/* ✅ عرض الخيارات المختارة (selectedOptions) */}
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className={styles.itemOptions}>
                  <div className={styles.optionsHeader}>
                    {/* <span className={styles.optionsLabel}>{t('pos.newSales.orderSummary.options')}:</span> */}
                  </div>
                  {renderOptions(item.selectedOptions)}
                </div>
              )}
              
              {/* ✅ عرض الإضافات والحذوفات (subItems) */}
              {item.subItems && item.subItems.length > 0 && (
                <div className={styles.subItemsContainer}>
                  <div className={styles.subItemsHeader}>
                    {/* <span className={styles.subItemsLabel}>{t('pos.newSales.orderSummary.additions')}:</span> */}
                  </div>
                  {item.subItems.map(subItem => renderSubItem(subItem, item.id))}
                </div>
              )}
              
              {/* ✅ عرض معلومات الوحدة إذا كانت متوفرة */}
              {item.selectedPrice.name && item.selectedPrice.name !== item.selectedPrice.nameArabic && (
                <div className={styles.unitInfo}>
                  <span className={styles.unitLabel}>{t('pos.newSales.orderSummary.unit')}:</span>
                  <span className={styles.unitValue}>{item.selectedPrice.nameArabic}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.summaryRows}>
          <div className={styles.summaryRow}>
            <span>{t('pos.newSales.orderSummary.subtotal')}</span>
            <span>{orderSummary.subtotal.toFixed(2)} <small>EGP</small></span>
          </div>
          
          {deliveryCharge > 0 && (
            <div className={styles.summaryRow}>
              <span>{t('pos.newSales.orderSummary.delivery')}</span>
              <span>{deliveryCharge.toFixed(2)} <small>EGP</small></span>
            </div>
          )}
          
          <div className={styles.summaryRow}>
            <span>{t('pos.newSales.orderSummary.discount')}</span>
            <span>{orderSummary.discount.toFixed(2)} <small>EGP</small></span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>{t('pos.newSales.orderSummary.tax')}</span>
            <span>{taxAmount.toFixed(2)} <small>EGP</small></span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>{t('pos.newSales.orderSummary.service')}</span>
            <span>{orderSummary.service.toFixed(2)} <small>EGP</small></span>
          </div>
        </div>

        {/* <div className={styles.totalRow}>
          <span>{t('pos.newSales.orderSummary.total')}</span>
          <span>{finalTotal.toFixed(2)} <small>EGP</small></span>
        </div> */}

        {!readOnly && (
          <div className={`${styles.actionButtons} ${shouldShowPayOnly ? styles.takeawayButtons : ''}`}>
            {shouldShowAllButtons && (
              <>
<button 
  className={`${styles.actionButton} ${styles.send}`}
  onClick={() => handleActionButtonClick('send')}
  disabled={!canOpenPayment || isSubmitting}
>
  <img src="/images/img_tabler_send.svg" alt="Send" />
  <span>{isSubmitting ? t('pos.newSales.messages.loading') : t('pos.newSales.payment.send')}</span>
</button>
<button 
  className={`${styles.actionButton} ${styles.print}`}
  onClick={() => handleActionButtonClick('print')}
  disabled={!canOpenPayment || isSubmitting}
>
  <img src="/images/img_printer.svg" alt="Print" />
  <span>{isSubmitting ? t('pos.newSales.messages.loading') : t('pos.newSales.payment.print')}</span>
</button>
              </>
            )}
<button
  onClick={() => handleActionButtonClick('pay')}
  disabled={!canOpenPayment}
  className={`${styles.actionButton} ${styles.pay} ${shouldShowPayOnly ? styles.fullWidth : ''} ${!canOpenPayment ? styles.disabledBtn : ''}`}
>
  <img src="/images/img_payment_02.svg" alt="Pay" />
  <span>{t('pos.newSales.payment.pay')}</span>
</button>
          </div>
        )}
      </div>

      {/* Customer Details Popup */}
      <CustomerDetailsPopup
        open={showCustomerDetails}
        customer={selectedCustomerForDetails}
        onClose={handleCustomerDetailsClose}
        onSelectCustomer={handleCustomerDetailsSelect}
      />

      {/* Payment Popup مع الـ props المصححة */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        orderSummary={orderSummary}
        customerName={customerName}
        onCustomerNameChange={onCustomerNameChange}
        onRemoveOrderItem={onRemoveOrderItem}
        onRemoveSubItem={onRemoveSubItem}
        selectedOrderItemId={selectedOrderItemId}
        onOrderItemSelect={onOrderItemSelect}
        onOrderItemDoubleClick={onOrderItemDoubleClick}
        selectedCustomer={selectedCustomer}
        selectedAddress={selectedAddress}
        onCustomerSelect={onCustomerSelect}
        orderType={orderType}
        onDeliveryChargeChange={onDeliveryChargeChange}
        selectedTable={selectedTable}
        actionType={selectedActionType} // ✅ إضافة جديدة
        selectedDeliveryCompany={selectedDeliveryCompany}
        isEditMode={isEditMode} // ✅ تمرير صحيح
        currentInvoiceId={currentInvoiceId} // ✅ تمرير صحيح
        onPaymentComplete={(result) => {
          if (result.success) {
            console.log('تم معالجة الفاتورة بنجاح:', result.invoice);
            console.log('تفاصيل الدفع:', result.payments);
            
            setShowPaymentPopup(false);
            
            // إرسال إشارة للصفحة الرئيسية لإعادة التعيين
            if (onOrderCompleted) {
              onOrderCompleted(result);
            }
          }
        }}
      />

      {/* Customer Form Popup */}
      {showCustomerForm && (
        <CustomerForm
          key={phoneInput}
          open={showCustomerForm}
          mode="add"
          onClose={handleCustomerFormClose}
          onSubmit={handleCustomerFormSubmit}
          initialValues={{
            id: '',
            name: '',
            phone1: phoneInput.trim(),
            phone2: '',
            phone3: '',
            phone4: '',
            isVIP: false,
            isBlocked: false,
            isActive: true,
            addresses: []
          }}
        />
      )}

      {/* Simple Payment Choice Popup */}
      <SimplePaymentChoicePopup
        isOpen={showSimplePaymentChoice}
        onClose={handleCloseSimplePaymentChoice}
        onSelectPaymentType={handleSimplePaymentChoice}
        totalAmount={finalTotal}
      />
    </aside>
  );
};

export default OrderSummary;
