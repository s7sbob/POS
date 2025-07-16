// src/Pages/pos/newSales/index.tsx - الكود الكامل المُحدث
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

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState('Takeaway');
  
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

  // المنتجات المعروضة
  const displayedProducts = useMemo(() => {
  if (searchQuery.trim()) {
    // البحث في كل المنتجات بدون فلتر
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
        
        // ✅ العناصر "بدون" لا تؤثر على الإجمالي
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
        
        // ✅ العناصر "بدون" لا تؤثر على الإجمالي عند الحذف
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
      setKeypadValue('1');
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
      
      // ✅ إعادة حساب السعر الإجمالي مع تجاهل عناصر "بدون"
      const basePrice = item.selectedPrice.price * (updates.quantity || item.quantity);
      const subItemsTotal = item.subItems?.reduce((sum, subItem) => {
        // تجاهل عناصر "بدون" في الحساب
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
      
      // ✅ العناصر "بدون" لا تؤثر على الإجمالي
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
    // إذا لم يكن هناك منتج محدد، استخدم آخر منتج في السلة
    let targetItemId = selectedOrderItemId;
    
    if (!targetItemId && orderItems.length > 0) {
      targetItemId = orderItems[orderItems.length - 1].id;
      setSelectedOrderItemId(targetItemId);
    }
    
    // إذا لم يكن هناك منتجات في السلة، لا تفعل شيء
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
    // إذا لم يكن هناك منتج محدد، استخدم آخر منتج في السلة
    let targetItemId = selectedOrderItemId;
    
    if (!targetItemId && orderItems.length > 0) {
      targetItemId = orderItems[orderItems.length - 1].id;
      setSelectedOrderItemId(targetItemId);
    }
    
    // إذا لم يكن هناك منتجات في السلة، لا تفعل شيء
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
    
    // استخدام الفئة الافتراضية
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
  }, [addToOrder, hasProductOptions]);

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

  // حساب ملخص الطلب
  const orderSummary: OrderSummaryType = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = 0;
    const tax = 0;
    const service = 0;
    const total = subtotal - discount + tax + service;

    return {
      items: orderItems,
      subtotal,
      discount,
      tax,
      service,
      total
    };
  }, [orderItems]);

  // حذف منتج من الطلب
  const removeOrderItem = useCallback((itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const handleNumberClick = useCallback((number: string) => {
    if (keypadValue === '1' && number !== '.') {
      setKeypadValue(number);
    } else if (keypadValue !== '0') {
      setKeypadValue(prev => prev + number);
    }
  }, [keypadValue]);

  const handleClearClick = useCallback(() => {
    setKeypadValue('1');
  }, []);

  const handleChipClick = useCallback((chipType: string) => {
    setSelectedChips(prev => 
      prev.includes(chipType) 
        ? prev.filter(chip => chip !== chipType)
        : [...prev, chipType]
    );
  }, []);

  const handleResetOrder = useCallback(() => {
    // إعادة تعيين الفاتورة بالكامل
    setOrderItems([]);
    setSelectedOrderItemId(null);
    setCustomerName('');
    setKeypadValue('1');
    
    // إعادة تعيين الـ modes
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setSelectedChips([]);
    
    // الرجوع للمنتجات الأساسية
    handleBackToMainProducts();
    
    // إعادة تعيين البحث
    setSearchQuery('');
    
    // رسالة تأكيد (اختيارية)
    console.log('Order reset successfully');
  }, [handleBackToMainProducts]);

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
        onOrderTypeChange={setSelectedOrderType}
        onResetOrder={handleResetOrder}
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
            hasSelectedOrderItem={true} // ✅ دائماً true لإزالة الـ disabled
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
          onRemoveSubItem={removeSubItem}
          selectedOrderItemId={selectedOrderItemId}
          onOrderItemSelect={handleOrderItemSelect}
          onOrderItemDoubleClick={handleOrderItemDoubleClick}
        />
      </main>

      <PriceSelectionPopup
        product={selectedProduct}
        quantity={parseInt(keypadValue) || 1}
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
        quantity={parseInt(keypadValue) || 1}
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
    </div>
  );
};

export default PosSystem;
