// src/Pages/pos/newSales/index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PosProduct, CategoryItem, OrderSummary, OrderItem, PosPrice, SelectedOption } from './types/PosSystem';
import * as posService from '../../../services/posService';
import PriceSelectionPopup from './components/PriceSelectionPopup';
import ProductOptionsPopup from './components/ProductOptionsPopup';
import './styles/responsive.css';
import './styles/popup.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from './components/ProductCard';

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('1');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  
  // API States
  const [allProducts, setAllProducts] = useState<PosProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(false);
  
  // إضافة states جديدة للتحكم في عرض الأطفال
  const [showingChildren, setShowingChildren] = useState<string | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryItem | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  
  // Popup States
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<PosProduct | null>(null);
  const [selectedPriceForOptions, setSelectedPriceForOptions] = useState<PosPrice | null>(null);
  
  // Order States
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Update displayed products when category or search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = posService.searchProducts(allProducts, searchQuery);
      setDisplayedProducts(searchResults);
    } else if (selectedCategory) {
      const categoryProducts = posService.getProductsByScreenId(allProducts, selectedCategory);
      setDisplayedProducts(categoryProducts);
    } else {
      setDisplayedProducts([]);
    }
  }, [selectedCategory, searchQuery, allProducts]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // جلب كل المنتجات أولاً
      const products = await posService.getAllPosProducts();
      setAllProducts(products);
      
      // ثم جلب الفئات
      const apiCategories = await posService.getAllCategories(products);
      setAllCategories(apiCategories); // حفظ جميع الفئات
      const rootCategories = apiCategories.filter(cat => !cat.parentId);
      setCategories(rootCategories);
      
      if (rootCategories.length > 0) {
        setSelectedCategory(rootCategories[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث handleCategorySelect للمنطق الجديد
  const handleCategorySelect = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category?.hasChildren && category.children) {
      // إخفاء كل الفئات وإظهار الأطفال فقط
      setShowingChildren(categoryId);
      setParentCategory(category);
      setCategories(category.children);
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
  const handleBackToParent = useCallback(async () => {
    setShowingChildren(null);
    setParentCategory(null);
    
    // إعادة تحميل الفئات الأساسية
    const rootCategories = allCategories.filter(cat => !cat.parentId);
    setCategories(rootCategories);
    
    if (rootCategories.length > 0) {
      setSelectedCategory(rootCategories[0].id);
    }
  }, [allCategories]);

  // التعامل مع ضغط المنتج - محدث لدعم المجموعات
  const handleProductClick = useCallback((product: PosProduct) => {
    if (product.hasMultiplePrices) {
      // فتح الـ popup لاختيار السعر
      setSelectedProduct(product);
      setShowPricePopup(true);
    } else if (product.productPrices.length > 0) {
      const price = product.productPrices[0];
      
      // التحقق من وجود مجموعات خيارات
      if (posService.hasProductOptions(product)) {
        setSelectedProductForOptions(product);
        setSelectedPriceForOptions(price);
        setShowOptionsPopup(true);
      } else {
        // إضافة للفاتورة مباشرة
        addToOrder(product, price, []);
      }
    }
  }, [keypadValue]);

  // إضافة منتج للفاتورة - محدث لدعم المجموعات
  const addToOrder = useCallback((product: PosProduct, price: PosPrice, selectedOptions: SelectedOption[]) => {
    const quantity = parseInt(keypadValue) || 1;
    const totalPrice = posService.calculateTotalPrice(price.price, selectedOptions, quantity);
    
    const orderItem: OrderItem = {
      id: `${product.id}_${price.id}_${Date.now()}`,
      product,
      selectedPrice: price,
      quantity,
      totalPrice,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
    };

    setOrderItems(prev => [...prev, orderItem]);
    setKeypadValue('1'); // إعادة تعيين الكمية
  }, [keypadValue]);

  // التعامل مع اختيار السعر من الـ popup - محدث لدعم المجموعات
  const handlePriceSelect = useCallback((price: PosPrice) => {
    if (selectedProduct) {
      // التحقق من وجود مجموعات خيارات
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

  // معالج إكمال اختيار المجموعات - جديد
  const handleOptionsComplete = useCallback((selectedOptions: SelectedOption[]) => {
    if (selectedProductForOptions && selectedPriceForOptions) {
      addToOrder(selectedProductForOptions, selectedPriceForOptions, selectedOptions);
    }
    setShowOptionsPopup(false);
    setSelectedProductForOptions(null);
    setSelectedPriceForOptions(null);
  }, [selectedProductForOptions, selectedPriceForOptions, addToOrder]);

  // حساب ملخص الطلب
  const orderSummary: OrderSummary = useMemo(() => {
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

  return (
    <div className="pos-system">
      {/* Top Header Bar */}
      <header className="top-bar">
        <div className="top-bar-content">
          <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="logo" />
          <nav className="nav-items">
            <a href="#" className="nav-item active">
              <img src="/images/img_sending_order.svg" alt="" />
              <span>Today Orders</span>
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_table_02.svg" alt="" />
              <span>Table</span>
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_discount_tag_01.svg" alt="" />
              <span>Discount</span>
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_delete_01.svg" alt="" />
              <span>Void</span>
            </a>
            <select className="order-type-select">
              <option>Takeaway</option>
              <option>Dine In</option>
              <option>Delivery</option>
            </select>
            <button className="menu-button">
              <img src="/images/img_menu_01.svg" alt="Menu" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Left Section - Products Area */}
        <section className="products-section">
          {/* Number Pad Bar */}
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

          {/* Action Buttons Bar */}
          <div className="action-buttons-bar">
            <div className="action-chips">
              <button 
                className={`action-chip extra ${selectedChips.includes('extra') ? 'active' : ''}`}
                onClick={() => handleChipClick('extra')}
              >
                <img src="/images/img_addcircle.svg" alt="" />
                <span>Extra</span>
              </button>
              <button 
                className={`action-chip without ${selectedChips.includes('without') ? 'active' : ''}`}
                onClick={() => handleChipClick('without')}
              >
                <img src="/images/img_removecircle.svg" alt="" />
                <span>Without</span>
              </button>
              <button 
                className={`action-chip offer ${selectedChips.includes('offer') ? 'active' : ''}`}
                onClick={() => handleChipClick('offer')}
              >
                <img src="/images/img_tags.svg" alt="" />
                <span>Offer</span>
              </button>
            </div>
            
            <div className="search-container">
              <img src="/images/img_search01.svg" alt="search" className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="filter-button">
                <img src="/images/img_group_7.svg" alt="Filter" />
              </button>
            </div>
          </div>

{/* Products Grid */}
{/* Products Grid */}
<div className="product-grid">
  {loading ? (
    <div className="loading-message">Loading...</div>
  ) : (
    displayedProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onClick={handleProductClick}
      />
    ))
  )}
</div>
        </section>

        {/* Categories Sidebar */}
        <aside className="categories-sidebar">
          <div className="categories-list">
            {/* زر الرجوع إذا كنا نعرض الأطفال */}
            {showingChildren && (
              <button
                onClick={handleBackToParent}
                className="category-item back-button"
              >
                <ArrowBackIcon />
                <span>رجوع</span>
              </button>
            )}
            
            {/* عرض الفئات */}
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

        {/* Order Summary */}
        <aside className="order-summary">
          <div className="order-header">
            <div className="order-number">#123</div>
            <div className="order-total">
              <span className="amount">{orderSummary.total.toFixed(2)}</span>
              <span className="currency">EGP</span>
            </div>
          </div>

          <div className="order-content">
            <h3 className="order-title">Order Details</h3>

            <div className="customer-input">
              <input
                type="text"
                placeholder="Walk in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-field"
              />
              <button className="customer-button">
                <img src="/images/img_group_1000004320.svg" alt="Add customer" />
              </button>
            </div>

            <div className="order-items">
              {orderSummary.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <button 
                      className="delete-button"
                      onClick={() => removeOrderItem(item.id)}
                    >
                      <img src="/images/img_delete_02.svg" alt="Remove" />
                    </button>
                    <div className="item-info">
                      <div className="item-name">
                        {item.quantity} X {item.product.nameArabic}
                        {/* إضافة اسم الحجم جنب اسم الصنف */}
                        {item.product.hasMultiplePrices && (
                          <span className="item-size-inline"> - {item.selectedPrice.nameArabic}</span>
                        )}
                      </div>
                      
                      {/* عرض الخيارات المختارة */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <div className="item-options">
                          {item.selectedOptions.map((option, index) => (
                            <div key={index} className="option-detail">
                              <span className="option-text">
                                {option.quantity > 1 ? `${option.quantity}x ` : ''}
                                {option.itemName}
                                {option.extraPrice > 0 && ` (+${option.extraPrice})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="item-prices">
                    <div className="item-price">{item.selectedPrice.price}</div>
                    <div className="item-total">{item.totalPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-footer">
            <div className="summary-rows">
              <div className="summary-row">
                <span>Sub Total</span>
                <span>{orderSummary.subtotal.toFixed(2)} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span>{orderSummary.discount.toFixed(2)} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>{orderSummary.tax.toFixed(2)} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Service</span>
                <span>{orderSummary.service.toFixed(2)} <small>EGP</small></span>
              </div>
            </div>

            <div className="total-row">
              <span>Total</span>
              <span>{orderSummary.total.toFixed(2)} <small>EGP</small></span>
            </div>

            <div className="action-buttons">
              <button className="action-button send">
                <img src="/images/img_tabler_send.svg" alt="Send" />
                <span>Send</span>
              </button>
              <button className="action-button print">
                <img src="/images/img_printer.svg" alt="Print" />
                <span>Print</span>
              </button>
              <button className="action-button pay">
                <img src="/images/img_payment_02.svg" alt="Pay" />
                <span>Pay</span>
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Price Selection Popup */}
      <PriceSelectionPopup
        product={selectedProduct!}
        quantity={parseInt(keypadValue) || 1}
        isOpen={showPricePopup}
        onClose={() => setShowPricePopup(false)}
        onSelectPrice={handlePriceSelect}
      />

      {/* Product Options Popup - جديد */}
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
