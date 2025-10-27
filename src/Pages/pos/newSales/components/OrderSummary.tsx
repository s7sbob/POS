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

// Popups for selecting delivery agents and hall captains before printing or sending orders.
import SelectDeliveryAgentPopup from './SelectDeliveryAgentPopup';
import SelectHallCaptainPopup from './SelectHallCaptainPopup';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';
import { HallCaptain } from 'src/utils/api/pagesApi/hallCaptainsApi';

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
  // إضافة الحقول الجديدة لشركات التوصيل
  documentNumber?: string | null;
  defaultPaymentMethod?: string | null;
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
  currentBackInvoiceCode = null, // ✅ إضافة جديدة
  // الحقول الجديدة لشركات التوصيل
  documentNumber = null,
  defaultPaymentMethod = null
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
  const [searchCache, setSearchCache] = useState<{ [key: string]: Customer[] }>({});
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [pendingEnterAction, setPendingEnterAction] = useState<string | null>(null);
  const { saveInvoice, isSubmitting, nextInvoiceCode, fetchNextInvoiceCode } = useInvoiceManager();

  // استخدام useRef بدلاً من state للمتغيرات المساعدة
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const lastSearchQuery = useRef<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedActionType, setSelectedActionType] = useState<'send' | 'print' | 'pay'>('pay');

  // ================================
  // Delivery agent and hall captain selection
  // When printing or sending a Delivery or Dine‑in order the API requires
  // assigning a delivery agent or hall captain.  These state variables
  // track the currently selected values and control the popups.
  const [showDeliveryAgentPopup, setShowDeliveryAgentPopup] = useState(false);
  const [showHallCaptainPopup, setShowHallCaptainPopup] = useState(false);
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState<DeliveryAgent | null>(null);
  const [selectedHallCaptain, setSelectedHallCaptain] = useState<HallCaptain | null>(null);
  const [pendingActionType, setPendingActionType] = useState<'send' | 'print' | null>(null);

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

  // حساب إجمالي خصم العناصر لعرضه مع الخصم الرأسى
  const itemDiscountTotal = orderSummary.items.reduce((sum, item) => {
    return sum + (item.discountAmount || 0);
  }, 0);
  // الخصم الإجمالي المعروض هو مجموع خصومات العناصر والخصم الكلى للفاتورة
  const aggregatedDiscount = itemDiscountTotal + orderSummary.discount;

  // حساب الإجمالي النهائي: نطرح الخصم الرأسى فقط لأن خصومات العناصر تم احتسابها بالفعل فى subtotal
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
      // Calculate the applied discount percentage based on the current order summary.
      const discountPercentageForSave = orderSummary.subtotal > 0
        ? (orderSummary.discount / orderSummary.subtotal) * 100
        : 0;

      const result = await saveInvoice(
        orderSummary,
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
          discountPercentage: discountPercentageForSave,
          // Do not send the customer name in the notes field; it will be sent separately
          // When updating an existing invoice we remove deleted items if preserveMissingItems is false
          preserveMissingItems: !isEditMode ? true : false,
          // Additional fields for delivery companies
          documentNumber: orderType === 'DeliveryCompany' ? documentNumber : null,
          defaultPaymentMethod: orderType === 'DeliveryCompany' ? defaultPaymentMethod : null,
          // New: assign selected delivery agent or hall captain depending on order type
          deliveryAgentId: selectedDeliveryAgent ? selectedDeliveryAgent.id : null,
          hallCaptainId: selectedHallCaptain ? selectedHallCaptain.id : null,
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
    customerName, onOrderCompleted, selectedDeliveryAgent, selectedHallCaptain,
    documentNumber, defaultPaymentMethod]);


      // دالة الدفع المباشر لشركات التوصيل
  const handleDeliveryCompanyDirectPayment = useCallback(async () => {
    try {
      console.log('🚚 بدء الدفع المباشر لشركة التوصيل...');
      
      // ✅ تأكد من وجود items قبل المتابعة
      if (!orderSummary.items || orderSummary.items.length === 0) {
        console.error('❌ لا توجد عناصر في الطلب');
        return;
      }

      // التأكد من وجود البيانات المطلوبة
      if (!documentNumber) {
        console.error('❌ رقم الفاتورة مطلوب لشركات التوصيل');
        alert('يرجى اختيار شركة التوصيل وإدخال رقم الفاتورة أولاً');
        return;
      }

      if (!selectedDeliveryCompany) {
        console.error('❌ شركة التوصيل غير محددة');
        alert('يرجى اختيار شركة التوصيل أولاً');
        return;
      }

      // حساب المبلغ الإجمالي
      const deliveryCharge = 0;
      const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
      const taxAmount = 0;
      const finalTotal = subtotalWithDelivery + taxAmount - orderSummary.discount;
      
      // تحديد طريقة الدفع
      let paymentMethodId = 'cash'; // افتراضي
      if (defaultPaymentMethod) {
        paymentMethodId = defaultPaymentMethod.toLowerCase();
      } else if (selectedDeliveryCompany?.paymentType) {
        const companyPaymentType = selectedDeliveryCompany.paymentType.toLowerCase();
        if (companyPaymentType === 'cash' || companyPaymentType === 'visa') {
          paymentMethodId = companyPaymentType;
        }
      }

      // إنشاء دفعة بالمبلغ الكامل
      const payments: { method: string; amount: number; isSelected: boolean }[] = [
        {
          method: paymentMethodId,
          amount: finalTotal,
          isSelected: true
        }
      ];
      
      const invoiceStatus = 3; // PAID
      
      // ✅ حفظ الفاتورة مع البيانات الكاملة والحقول الجديدة
      // Calculate the applied discount percentage based on the current order summary.
      const discountPercentageForSave = orderSummary.subtotal > 0
        ? (orderSummary.discount / orderSummary.subtotal) * 100
        : 0;

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
          discountPercentage: discountPercentageForSave,
          // Do not send the customer name in the notes field; it will be sent separately
          preserveMissingItems: !isEditMode ? true : false,
          // Additional fields for delivery companies
          documentNumber: documentNumber,
          defaultPaymentMethod: paymentMethodId
        }
      );
      
      console.log(`✅ تم الدفع لشركة التوصيل بنجاح! رقم الفاتورة: ${result.invoiceNumber}`);
      
      if (onOrderCompleted) {
        onOrderCompleted({
          success: true,
          invoice: result,
          actionType: 'pay',
          paymentType: paymentMethodId,
          documentNumber: documentNumber
        });
      }
      
    } catch (error) {
      console.error('❌ خطأ في الدفع لشركة التوصيل:', error);
    }
  }, [saveInvoice, orderSummary, orderType, isEditMode, currentInvoiceId, 
      selectedCustomer, selectedAddress, selectedDeliveryCompany, selectedTable, 
      customerName, onOrderCompleted, documentNumber, defaultPaymentMethod]);
      
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
      // Calculate the applied discount percentage based on the current order summary.
      const discountPercentageForSave = orderSummary.subtotal > 0
        ? (orderSummary.discount / orderSummary.subtotal) * 100
        : 0;

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
          discountPercentage: discountPercentageForSave,
          // Do not send the customer name in the notes field; it will be sent separately
          preserveMissingItems: !isEditMode ? true : false,
          // Additional fields for delivery companies
          documentNumber: orderType === 'DeliveryCompany' ? documentNumber : null,
          defaultPaymentMethod: orderType === 'DeliveryCompany' ? defaultPaymentMethod : null
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

      if (isDeliveryCompany) {
        // لشركات التوصيل: دفع مباشر بدون فتح PaymentPopup
        // لأن الـ document number و payment method تم تحديدهما مسبقاً من الـ Header
        await handleDeliveryCompanyDirectPayment();
      } else {
        // للطلبات العادية: إظهار popup الدفع الكامل
        setShowPaymentPopup(true);
      }
    } else {
      // For send or print actions we need to ensure a delivery agent or hall
      // captain is selected depending on the order type.  The API will
      // reject updates to the status without these assignments.  When
      // necessary we open the appropriate popup and defer invoking
      // handleDirectSave until the selection is made.
      if ((actionType === 'send' || actionType === 'print') && orderType === 'Delivery') {
        setPendingActionType(actionType);
        setShowDeliveryAgentPopup(true);
        return;
      }
      if ((actionType === 'send' || actionType === 'print') && orderType === 'Dine-in') {
        setPendingActionType(actionType);
        setShowHallCaptainPopup(true);
        return;
      }
      await handleDirectSave(actionType);
    }
  }, [canOpenPayment, orderSummary.items.length, handleDirectSave, orderType, handleDeliveryCompanyDirectPayment]);


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

  /**
   * Callback invoked when a delivery agent is chosen from the selection popup.
   * Stores the selected agent and then proceeds with the pending action
   * (print or send) if one is queued.  After running the action the
   * pending flag is cleared.
   */
  const handleDeliveryAgentSelect = useCallback((agent: DeliveryAgent) => {
    setSelectedDeliveryAgent(agent);
    setShowDeliveryAgentPopup(false);
    if (pendingActionType) {
      // trigger the save now that we have a delivery agent
      handleDirectSave(pendingActionType);
      setPendingActionType(null);
    }
  }, [pendingActionType, handleDirectSave]);

  /**
   * Callback invoked when a hall captain is chosen from the selection popup.
   * Stores the selected captain and then proceeds with the pending action
   * (print or send) if one is queued.  After running the action the
   * pending flag is cleared.
   */
  const handleHallCaptainSelect = useCallback((captain: HallCaptain) => {
    setSelectedHallCaptain(captain);
    setShowHallCaptainPopup(false);
    if (pendingActionType) {
      handleDirectSave(pendingActionType);
      setPendingActionType(null);
    }
  }, [pendingActionType, handleDirectSave]);

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

{/* ✅ عرض تفاصيل العرض بنفس شكل الخيارات تماماً */}
{item.isOfferItem && item.selectedOfferItems && item.selectedOfferItems.length > 0 && (
  <div className={styles.itemOptions}>
    <div className={styles.optionsHeader}>
      <span className={styles.optionsLabel}>🏷️ مكونات العرض:</span>
    </div>
    {item.selectedOfferItems.map((offerItem, index) => (
      <div key={index} className={styles.optionDetail}>
        <span className={styles.optionText}>
          {offerItem.quantity} × {offerItem.productName} - {offerItem.priceName}
        </span>
        <div className={styles.optionPrices}>
          <div className={styles.optionPrice}>
            {offerItem.price > 0 ? `${offerItem.price.toFixed(2)}` : '0'}
          </div>
          <div className={styles.optionTotal}>
            {(offerItem.price * offerItem.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    ))}
  </div>
)}



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
            <span>{aggregatedDiscount.toFixed(2)} <small>EGP</small></span>
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

      {/* Delivery agent selection popup.  Appears when printing or sending a
          Delivery order before status update. */}
      <SelectDeliveryAgentPopup
        open={showDeliveryAgentPopup}
        onClose={() => setShowDeliveryAgentPopup(false)}
        onSelect={handleDeliveryAgentSelect}
      />
      {/* Hall captain selection popup.  Appears when printing or sending a
          Dine‑in order before status update. */}
      <SelectHallCaptainPopup
        open={showHallCaptainPopup}
        onClose={() => setShowHallCaptainPopup(false)}
        onSelect={handleHallCaptainSelect}
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


    </aside>
  );
};

export default OrderSummary;
