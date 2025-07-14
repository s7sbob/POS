// src/Pages/pos/newSales/index.tsx - الكود الكامل المُحدث
import React, { useState, useCallback, useMemo } from 'react';
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
    getCategories
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
      return posService.searchProducts(currentProducts, searchQuery);
    }
    
    if (selectedCategory) {
      return posService.getProductsByScreenId(currentProducts, selectedCategory);
    }
    
    return [];
  }, [currentProducts, selectedCategory, searchQuery]);

  // تحديث دالة updateOrderItem

const updateOrderItem = useCallback((itemId: string, updateType: 'addSubItem' | 'removeSubItem', data: any) => {
  setOrderItems(prev => prev.map(item => {
    if (item.id === itemId) {
      if (updateType === 'addSubItem') {
        // إضافة sub-item جديد
        const newSubItems = [...(item.subItems || []), data];
        const newTotalPrice = item.totalPrice + data.price;
        return {
          ...item,
          subItems: newSubItems,
          totalPrice: newTotalPrice
        };
      } else if (updateType === 'removeSubItem') {
        // حذف sub-item
        const removedSubItem = item.subItems?.find(sub => sub.id === data);
        const newSubItems = item.subItems?.filter(sub => sub.id !== data) || [];
        const newTotalPrice = item.totalPrice - (removedSubItem?.price || 0);
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
  onOrderUpdate: updateOrderItem, // استخدام الدالة المُحدثة
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

  // معالج زر Extra
  const handleExtraClick = useCallback(() => {
    setIsExtraMode(true);
    setIsWithoutMode(false);
    setSelectedChips(prev => prev.includes('extra') ? prev : [...prev.filter(chip => chip !== 'without'), 'extra']);
    
    // تحديد أول فئة من فئات الإضافات
    const additionCategories = getCategories(true).filter(cat => !cat.parentId);
    if (additionCategories.length > 0) {
      setSelectedCategory(additionCategories[0].id);
    }
  }, [getCategories]);

  // معالج زر Without
  const handleWithoutClick = useCallback(() => {
    setIsWithoutMode(true);
    setIsExtraMode(false);
    setSelectedChips(prev => prev.includes('without') ? prev : [...prev.filter(chip => chip !== 'extra'), 'without']);
    
    // تحديد أول فئة من فئات الإضافات
    const additionCategories = getCategories(true).filter(cat => !cat.parentId);
    if (additionCategories.length > 0) {
      setSelectedCategory(additionCategories[0].id);
    }
  }, [getCategories]);

  // معالج الرجوع للمنتجات الأساسية
  const handleBackToMainProducts = useCallback(() => {
    setIsExtraMode(false);
    setIsWithoutMode(false);
    setSelectedOrderItemId(null);
    setSelectedChips(prev => prev.filter(chip => chip !== 'extra' && chip !== 'without'));
    
    // تحديد أول فئة من الفئات الأساسية
    const mainCategories = getCategories(false).filter(cat => !cat.parentId);
    if (mainCategories.length > 0) {
      setSelectedCategory(mainCategories[0].id);
    }
    
    setShowingChildren(null);
    setParentCategory(null);
  }, [getCategories]);

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
      
      if (posService.hasProductOptions(product)) {
        setSelectedProductForOptions(product);
        setSelectedPriceForOptions(price);
        setShowOptionsPopup(true);
      } else {
        addToOrder(product, price, []);
      }
    }
  }, [addToOrder]);

  // معالج اختيار السعر
  const handlePriceSelect = useCallback((price: PosPrice) => {
    if (selectedProduct) {
      if (posService.hasProductOptions(selectedProduct)) {
        setSelectedProductForOptions(selectedProduct);
        setSelectedPriceForOptions(price);
        setShowPricePopup(false);
        setShowOptionsPopup(true);
      } else {
        addToOrder(selectedProduct, price, []);
      }
    }
    setSelectedProduct(null);
  }, [selectedProduct, addToOrder]);

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
        />
      </main>

      <PriceSelectionPopup
        product={selectedProduct!}
        quantity={parseInt(keypadValue) || 1}
        isOpen={showPricePopup}
        onClose={() => setShowPricePopup(false)}
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
    </div>
  );
};

export default PosSystem;
