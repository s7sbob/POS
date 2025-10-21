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
import * as invoicesApi from '../../../utils/api/pagesApi/invoicesApi';
import { useInvoiceManager } from './hooks/useInvoiceManager';
import { useTableManager } from './hooks/useTableManager';
import { TableSelection } from './types/TableSystem';
import { useError } from '../../../contexts/ErrorContext';
import * as deliveryCompaniesApi from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { DeliveryCompany } from '../../../utils/api/pagesApi/deliveryCompaniesApi';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import InvoiceDataConverter from '../../../utils/invoiceDataConverter';
import * as offersApi from '../../../utils/api/pagesApi/offersApi';
import { Offer } from '../../../utils/api/pagesApi/offersApi';
import OfferOptionsPopup from './components/OfferOptionsPopup';
import { OfferData, SelectedOfferItem } from './types/PosSystem';
import HeaderDiscountPopup from './components/HeaderDiscountPopup';

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
  const [showOfferOptionsPopup, setShowOfferOptionsPopup] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);

  // إضافة states للحقول الجديدة لشركات التوصيل
  const [documentNumber, setDocumentNumber] = useState<string | null>(null);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string | null>(null);
  
  // إضافة trigger لإعادة فتح popup شركة التوصيل
  const [triggerReopenDeliveryPopup, setTriggerReopenDeliveryPopup] = useState(false);

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
  getOffers, // جديد
  searchOffers, // جديد
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

  // Extra/Without/Offer States
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [isWithoutMode, setIsWithoutMode] = useState(false);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);

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

  // =====================
  // Header Discount State
  // =====================
  /**
   * Controls the visibility of the discount popup that appears when
   * the user clicks the discount button in the header.  When true the
   * HeaderDiscountPopup component will be rendered; when false it is
   * hidden.  The popup allows entering a discount percentage or a
   * fixed amount and keeps them in sync.
   */
  const [showHeaderDiscountPopup, setShowHeaderDiscountPopup] = useState(false);
  /**
   * Holds the currently applied header discount percentage.  This
   * value is passed to the invoice API as HeaderDiscountPercentage.
   */
  const [headerDiscountPercentage, setHeaderDiscountPercentage] = useState<number>(0);
  /**
   * Holds the currently applied header discount value (absolute).  This
   * value is reflected in orderSummary.discount and sent to the API
   * via HeaderDiscountValue when saving an invoice.
   */
  const [headerDiscountValue, setHeaderDiscountValue] = useState<number>(0);

  // الحصول على البيانات الحالية
  const isAdditionMode = isExtraMode || isWithoutMode;
  const isSpecialMode = isAdditionMode || showOffers; // إضافة العروض للوضع الخاص
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



// دالة محسنة للحصول على بيانات المنتج من productPriceId
const getProductByPriceId = useCallback(async (priceId: string) => {
  console.log('🔍 البحث عن المنتج للسعر:', priceId);
  
  const allProducts = getProducts(false);
  
  // البحث في جميع المنتجات عن السعر المطلوب
  for (const product of allProducts) {
    const price = product.productPrices.find(p => p.id === priceId);
    if (price) {
      console.log('✅ تم العثور على المنتج:', {
        productName: product.nameArabic,
        priceName: price.nameArabic,
        price: price.price
      });
      return { product, price };
    }
  }
  
  console.warn('❌ لم يتم العثور على منتج للسعر:', priceId);
  return null;
}, [getProducts]);


  // تعديل حساب ملخص الطلب ليشمل الخدمة
  const calculateOrderSummary = useCallback((): OrderSummaryType => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const serviceCharge = getServiceCharge();
    const service = (subtotal * serviceCharge) / 100;
    // Item‑level discounts are already reflected in each item's totalPrice.
    // Apply the header discount value to the subtotal.  This value is
    // controlled via the HeaderDiscountPopup and stored in state.
    const discount = headerDiscountValue;
    const tax = 0;

    // Calculate totals in the correct order: discount first, then tax and service.
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
  }, [orderItems, getServiceCharge, deliveryCharge, headerDiscountValue]);
  // واستخدمه في كل مرة:
  const orderSummary = calculateOrderSummary();


  // دالة تحويل العرض إلى شكل منتج للعرض
const convertOfferToProduct = useCallback((offer: Offer): PosProduct => {
  return {
    id: `offer-${offer.id}`,
    name: offer.name,
    nameArabic: offer.name,
    image: '/images/offer-placeholder.png', // يمكنك تغيير هذا لصورة العرض الخاصة بك
    categoryId: 'offers',
    productType: 99, // نوع خاص للعروض
    productPrices: [{
      id: `offer-price-${offer.id}`,
      name: offer.name,
      nameArabic: offer.name,
      price: offer.fixedPrice || 0,
      barcode: `offer-${offer.id}`
    }],
    hasMultiplePrices: false,
    displayPrice: offer.fixedPrice,
    productOptionGroups: []
  };
}, []);



// المنتجات أو العروض المعروضة - محدث
const displayedProducts = useMemo(() => {
  // في حالة عرض العروض
  if (showOffers) {
    const offers = getOffers();
    if (searchQuery.trim()) {
      const filteredOffers = searchOffers(offers, searchQuery);
      return filteredOffers.map(offer => convertOfferToProduct(offer));
    }
    return offers.map(offer => convertOfferToProduct(offer));
  }
  
  // الكود الأصلي للمنتجات
  if (searchQuery.trim()) {
    return searchProducts(currentProducts, searchQuery);
  }
  
  if (selectedCategory) {
    return getProductsByScreenId(currentProducts, selectedCategory);
  }
  
  return [];
}, [showOffers, getOffers, searchOffers, searchQuery, convertOfferToProduct, searchProducts, currentProducts, selectedCategory, getProductsByScreenId]);

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
          // Pass through the applied header discount percentage so it
          // persists when moving the order to a new table
          discountPercentage: headerDiscountPercentage,
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
  }, [currentInvoiceId, calculateOrderSummary, selectedOrderType, currentInvoiceStatus, selectedCustomer, selectedAddress, selectedDeliveryCompany, selectTable, saveInvoice, showSuccess, showError, headerDiscountPercentage]);

  // معالج اختيار شركة التوصيل مع الحقول الإضافية
  const handleDeliveryCompanySelectWithDetails = useCallback((
    company: DeliveryCompany, 
    docNumber: string, 
    paymentMethod?: string
  ) => {
    console.log('🚚 تم اختيار شركة التوصيل مع التفاصيل:', {
      company: company.name,
      documentNumber: docNumber,
      defaultPaymentMethod: paymentMethod
    });
    
    // تعيين الشركة المختارة والحقول الإضافية
    setSelectedDeliveryCompany(company);
    setDocumentNumber(docNumber);
    setDefaultPaymentMethod(paymentMethod || null);
    
    showSuccess(`تم اختيار شركة ${company.name} برقم فاتورة: ${docNumber}`);
  }, [showSuccess]);

  // إضافة معالج double click
  const handleOrderItemDoubleClick = useCallback((item: OrderItem) => {
    setSelectedOrderItemForDetails(item);
    setShowOrderDetailsPopup(true);
  }, []);

  /**
   * Handler invoked when the discount button in the header is clicked.
   * If there are no items in the current order a warning is shown.  Otherwise
   * it opens the HeaderDiscountPopup for the user to enter a discount.
   */
  const handleHeaderDiscountClick = useCallback(() => {
    if (orderItems.length === 0) {
      showWarning('لا توجد عناصر لتطبيق الخصم عليها');
      return;
    }
    setShowHeaderDiscountPopup(true);
  }, [orderItems, showWarning]);

  /**
   * Callback executed when the user applies a discount in the popup.  It
   * updates both the percentage and absolute discount value so that the
   * order summary and invoice saving logic reflect the user choice.
   */
  const handleApplyHeaderDiscount = useCallback((percentage: number, amount: number) => {
    setHeaderDiscountPercentage(percentage);
    setHeaderDiscountValue(amount);
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

// معالج الرجوع للمنتجات الأساسية - محدث
const handleBackToMainProducts = useCallback(() => {
  setIsExtraMode(false);
  setIsWithoutMode(false);
  setShowOffers(false); // إضافة هذا السطر
  setSelectedOrderItemId(null);
  setSelectedChips(prev => prev.filter(chip => 
    chip !== 'extra' && 
    chip !== 'without' && 
    chip !== 'offer' // إضافة هذا السطر
  ));
  
  if (defaultCategoryId) {
    setSelectedCategory(defaultCategoryId);
  }
  
  setShowingChildren(null);
  setParentCategory(null);
}, [defaultCategoryId]);

  // معالج زر العروض
const handleOffersClick = useCallback(() => {
  if (!showOffers) {
    // تفعيل وضع العروض
    setShowOffers(true);
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setSelectedOrderItemId(null);
    setSelectedCategory('');
    setSearchQuery('');
    setShowingChildren(null);
    setParentCategory(null);
    setSelectedChips(prev => {
      const newChips = prev.filter(chip => 
        chip !== t('pos.newSales.actions.extraChip') && 
        chip !== t('pos.newSales.actions.withoutChip')
      );
      if (!newChips.includes('offer')) {
        newChips.push('offer');
      }
      return newChips;
    });
    
    console.log('🏷️ تم تفعيل وضع العروض');
  } else {
    // إلغاء وضع العروض والعودة للمنتجات العادية
    handleBackToMainProducts();
  }
}, [showOffers, handleBackToMainProducts, t]);

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



  // دالة للحصول على القيمة الرقمية
  const getNumericValue = useCallback((): number => {
    const value = parseFloat(keypadValue);
    return isNaN(value) || value <= 0 ? 1 : value;
  }, [keypadValue]);

// معالج إكمال اختيار العرض - محدث مع console.log للتتبع
const handleOfferComplete = useCallback((offerData: OfferData, selectedOfferItems: SelectedOfferItem[]) => {
  console.log('✅ تم إكمال اختيار العرض:', offerData.name);
  console.log('📋 العناصر المختارة:', selectedOfferItems);
  
  if (selectedOfferItems.length === 0) {
    console.error('❌ لا توجد عناصر مختارة في العرض');
    showError('لا توجد منتجات في هذا العرض');
    return;
  }
  
  // حساب السعر الإجمالي الصحيح للعرض
  const calculateOfferTotalPrice = () => {
    if (offerData.priceType === 'Fixed') {
      console.log('💰 عرض بسعر ثابت:', offerData.fixedPrice);
      return offerData.fixedPrice;
    }
    
    // للعروض الديناميكية: جمع أسعار كل المنتجات
    const dynamicTotal = selectedOfferItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(`💰 منتج ${item.productName}: ${item.price} × ${item.quantity} = ${itemTotal}`);
      return total + itemTotal;
    }, 0);
    
    console.log('💰 إجمالي العرض الديناميكي:', dynamicTotal);
    return dynamicTotal;
  };
  
  const offerTotalPrice = calculateOfferTotalPrice();
  
  // إنشاء منتج وهمي للعرض
  const offerAsProduct: PosProduct = {
    id: `offer-${offerData.id}`,
    name: offerData.name,
    nameArabic: offerData.name,
    image: '/images/offer-placeholder.png',
    categoryId: 'offers',
    productType: 99,
    productPrices: [{
      id: `offer-price-${offerData.id}`,
      name: offerData.name,
      nameArabic: offerData.name,
      price: offerTotalPrice,
      barcode: `offer-${offerData.id}`
    }],
    hasMultiplePrices: false,
    displayPrice: offerTotalPrice,
    productOptionGroups: []
  };
  
  // إنشاء OrderItem للعرض
  const orderItem: OrderItem = {
    id: `order-${Date.now()}-${Math.random()}`,
    product: offerAsProduct,
    selectedPrice: offerAsProduct.productPrices[0],
    quantity: getNumericValue(),
    totalPrice: offerTotalPrice * getNumericValue(),
    offerId: offerData.id,
    offerData: offerData,
    selectedOfferItems: selectedOfferItems,
    isOfferItem: true
  };
  
  console.log('📦 OrderItem تم إنشاؤه:', {
    name: orderItem.product.nameArabic,
    totalPrice: orderItem.totalPrice,
    selectedOfferItemsCount: selectedOfferItems.length,
    offerItems: selectedOfferItems.map(item => ({
      name: item.productName,
      price: item.price,
      quantity: item.quantity
    }))
  });
  
  // إضافة للطلب
  setOrderItems(prev => [...prev, orderItem]);
  
  showSuccess(`تم إضافة العرض: ${offerData.name} بسعر ${offerTotalPrice.toFixed(2)} ج.م`);
  
  // إغلاق الـ popup
  setShowOfferOptionsPopup(false);
  setSelectedOffer(null);
}, [getNumericValue, showSuccess, showError]);





// معالج اختيار العرض - محدث للتعامل مع العروض البسيطة
// معالج اختيار العرض - محدث للهيكل الجديد
const handleOfferSelect = useCallback(async (offer: any) => {
  console.log('🏷️ تم اختيار العرض:', offer.name);
  console.log('📋 هيكل العرض:', {
    offerGroups: offer.offerGroups?.length || 0,
    groupsWithItems: offer.offerGroups?.map((g: { title: any; items: string | any[]; }) => ({ title: g.title, itemsCount: g.items?.length || 0 })),
    fixedItems: offer.offerItems?.filter((item: { offerGroupId: any; }) => !item.offerGroupId).length || 0
  });
  
  // تحويل offer إلى OfferData
  const offerData: OfferData = {
    id: offer.id,
    name: offer.name,
    priceType: offer.priceType,
    fixedPrice: offer.fixedPrice,
    startDate: offer.startDate,
    endDate: offer.endDate,
    orderTypeId: offer.orderTypeId,
    isActive: offer.isActive,
    offerGroups: offer.offerGroups?.map((group: any) => ({
      id: group.id,
      offerId: group.offerId,
      title: group.title,
      minSelection: group.minSelection,
      maxSelection: group.maxSelection,
      isMandatory: group.isMandatory,
      items: group.items || [], // ✅ تمرير العناصر من داخل المجموعة
      isActive: group.isActive
    })) || [],
    offerItems: offer.offerItems || []
  };
  
  // التحقق من وجود مجموعات نشطة
  const activeGroups = offerData.offerGroups.filter(group => group.isActive && group.items.length > 0);
  
  if (activeGroups.length > 0) {
    console.log('🔄 فتح popup للعرض مع المجموعات');
    setSelectedOffer(offerData);
    setShowOfferOptionsPopup(true);
  } else {
    // ✅ للعروض البسيطة: أضف العناصر الثابتة فقط
    console.log('🔄 معالجة العرض البسيط...');
    
    // تحميل بيانات العناصر الثابتة (التي ليس لها offerGroupId)
    const selectedOfferItems: SelectedOfferItem[] = [];
    
    const fixedItems = offerData.offerItems.filter(item => 
      !item.offerGroupId && item.isDefaultSelected
    );
    
    console.log('📦 العناصر الثابتة المحددة:', fixedItems.length);
    
    for (const offerItem of fixedItems) {
      const productData = await getProductByPriceId(offerItem.productPriceId);
      if (productData) {
        // حساب السعر الصحيح
        const correctPrice = offerItem.useOriginalPrice 
          ? productData.price.price 
          : (offerItem.customPrice || 0);
          
        selectedOfferItems.push({
          groupId: null,
          offerItemId: offerItem.id,
          productPriceId: offerItem.productPriceId,
          quantity: offerItem.quantity,
          price: correctPrice,
          productName: productData.product.nameArabic,
          priceName: productData.price.nameArabic,
          isFixed: true
        });
        
        console.log(`✅ تم تحميل: ${productData.product.nameArabic} - ${productData.price.nameArabic} بسعر ${correctPrice}`);
      }
    }
    
    console.log('📋 إجمالي العناصر المحملة:', selectedOfferItems.length);
    
    if (selectedOfferItems.length > 0) {
      await handleOfferComplete(offerData, selectedOfferItems);
    } else {
      console.warn('⚠️ لا توجد عناصر في هذا العرض');
      showError('هذا العرض لا يحتوي على منتجات');
    }
  }
}, [getProductByPriceId, handleOfferComplete, showError]);




// معالج ضغط المنتج - محدث
const handleProductClick = useCallback((product: PosProduct) => {
  // التحقق من العروض
  if (product.id.startsWith('offer-')) {
    const offerId = product.id.replace('offer-', '');
    const offers = getOffers();
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      handleOfferSelect(offer);
      return;
    }
  }
  
  // الكود الأصلي للمنتجات
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
}, [getOffers, handleOfferSelect, addToOrder, showWarning, hasProductOptions, selectedOrderType, canAddProduct, t]);

  // معالج عرض الطلب من popup
  const handleViewOrderFromPopup = useCallback(async (invoiceData: any) => {
    try {
      setIsLoadingOrder(true);
      setCurrentBackInvoiceCode(invoiceData.backInvoiceCode || null);

      const convertedData = await InvoiceDataConverter.convertInvoiceForEdit(invoiceData);
      setOrderItems(convertedData.orderItems);
      setDeliveryCharge(convertedData.deliveryCharge);
      setCurrentInvoiceId(invoiceData.id);

      // عند تحميل الفاتورة قم بتعيين قيم الخصم الرأسية لتظهر بشكل صحيح فى الواجهة
      if (typeof invoiceData.headerDiscountPercentage === 'number') {
        setHeaderDiscountPercentage(invoiceData.headerDiscountPercentage);
      } else {
        setHeaderDiscountPercentage(0);
      }
      if (typeof invoiceData.headerDiscountValue === 'number') {
        setHeaderDiscountValue(invoiceData.headerDiscountValue);
      } else {
        setHeaderDiscountValue(0);
      }

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
    // قم بحفظ اسم العميل فقط لعرضه فى الواجهة؛ لا تدمج رقم الهاتف مع الاسم
    setCustomerName(customer.name);
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
    clearSelectedTable(); // ✅ مسح التربيزة المحددة
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setShowOffers(false); // إضافة هذا السطر

    // Reset any header discount when starting a fresh order
    setHeaderDiscountPercentage(0);
    setHeaderDiscountValue(0);
    setSelectedChips([]);
    handleBackToMainProducts();
    setSearchQuery('');
    
    // ✅ إعادة تعيين الحقول الجديدة لشركات التوصيل
    setDocumentNumber(null);
    setDefaultPaymentMethod(null);
    
    // ✅ إضافة: في حالة شركات التوصيل، مسح البيانات المدخلة فقط (الشركة تفضل مختارة)
    if (selectedOrderType === 'DeliveryCompany' && selectedDeliveryCompany) {
      const paymentType = selectedDeliveryCompany.paymentType?.toLowerCase();
      
      console.log('🔄 تم مسح بيانات الفاتورة لشركة التوصيل - الشركة لا تزال مختارة');
      console.log(`📋 نوع الدفع للشركة: ${paymentType}`);
      console.log(`🏢 الشركة المختارة: ${selectedDeliveryCompany.name}`);
      
      // الشركة تفضل مختارة، بس البيانات المدخلة (documentNumber & defaultPaymentMethod) اتمسحت
      // المستخدم هيحتاج يدخل البيانات تاني كأنه لسه مختار الشركة
      
      // إعادة تشغيل الـ flow حسب نوع الدفع للشركة
      setTimeout(() => {
        console.log('🔄 تفعيل إعادة فتح popup شركة التوصيل');
        setTriggerReopenDeliveryPopup(true);
        
        // إعادة تعيين الـ trigger بعد فترة قصيرة
        setTimeout(() => {
          setTriggerReopenDeliveryPopup(false);
        }, 100);
      }, 300); // تأخير بسيط للسماح بإتمام Reset
    }

    // ✅ إضافة: إذا كان النوع Dine-in، افتح popup اختيار التربيزات
    if (selectedOrderType === 'Dine-in') {
      setTimeout(() => {
        setShowTablePopup(true);
      }, 200); // تأخير بسيط للسماح بإتمام Reset
    }
  
    console.log('Order reset successfully');
  }, [handleBackToMainProducts, clearSelectedTable, selectedOrderType, selectedDeliveryCompany]);

  const handleOrderCompleted = useCallback((result: any) => {
    console.log('تم إنهاء الطلب بنجاح:', result);
    handleResetOrder();
    console.log('تم إعادة تعيين النظام بنجاح');
  }, [handleResetOrder]);


    /**
   * Handler invoked when the user clicks the void button in the header.  If
   * there is no active invoice the user is warned.  Otherwise the user is
   * prompted to enter a cancellation reason.  Upon confirmation the
   * cancelInvoice API is called and the current order is reset.
   */
  const handleVoidClick = useCallback(async () => {
    if (!currentInvoiceId) {
      showWarning('لا يوجد طلب لإلغائه');
      return;
    }
    const reason = window.prompt('سبب الإلغاء', '') ?? null;
    if (reason === null) {
      return;
    }
    try {
      await invoicesApi.cancelInvoice(currentInvoiceId, null, reason);
      showSuccess('تم إلغاء الفاتورة بنجاح');
      handleResetOrder();
    } catch (error) {
      console.error('خطأ أثناء إلغاء الفاتورة:', error);
      showError('فشل إلغاء الفاتورة');
    }
  }, [currentInvoiceId, showWarning, showSuccess, showError, handleResetOrder]);
  
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
        onDeliveryCompanySelectWithDetails={handleDeliveryCompanySelectWithDetails}
        triggerReopenDeliveryPopup={triggerReopenDeliveryPopup}
        // Pass discount and void handlers to the header.  When these props
        // are provided the header will call them instead of navigating.
        onDiscountClick={handleHeaderDiscountClick}
        onVoidClick={handleVoidClick}
      />
      <main className="main-content">
        <section className="products-section">
<ActionButtons
  selectedChips={selectedChips}
  onChipClick={handleChipClick}
  isExtraMode={isExtraMode}
  isWithoutMode={isWithoutMode}
  showOffers={showOffers} // إضافة جديدة
  onExtraClick={handleExtraClick}
  onWithoutClick={handleWithoutClick}
  onOffersClick={handleOffersClick} // إضافة جديدة
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  hasSelectedOrderItem={orderItems.length > 0} // تحسين
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
{showOffers && ( // إضافة زر رجوع للعروض
  <button
    onClick={handleBackToMainProducts}
    className="category-item back-button main-back offers-back"
  >
    <ArrowBackIcon />
    <span>رجوع للمنتجات</span>
  </button>
)}

{(isAdditionMode && !showOffers) && ( // تعديل الشرط
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
              documentNumber={documentNumber}
              defaultPaymentMethod={defaultPaymentMethod}
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
      <OfferOptionsPopup
  offer={selectedOffer}
  quantity={getNumericValue()}
  isOpen={showOfferOptionsPopup}
  onClose={() => {
    setShowOfferOptionsPopup(false);
    setSelectedOffer(null);
  }}
  onComplete={(selectedOfferItems) => {
    if (selectedOffer) {
      handleOfferComplete(selectedOffer, selectedOfferItems);
    }
  }}
  getProductByPriceId={getProductByPriceId}
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

      {/* Header discount popup.  This is shown when the user clicks the
          discount button in the header.  It allows entering either a
          percentage or a fixed amount and synchronizes the two.  The
          subtotal is passed so the popup can calculate the value from
          the percentage and vice versa. */}
      <HeaderDiscountPopup
        isOpen={showHeaderDiscountPopup}
        onClose={() => setShowHeaderDiscountPopup(false)}
        onApply={handleApplyHeaderDiscount}
        subtotal={orderSummary.subtotal}
        initialPercentage={headerDiscountPercentage}
        initialAmount={headerDiscountValue}
      />
    </div>
  );
};

export default PosSystem;