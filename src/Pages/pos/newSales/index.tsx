// src/Pages/pos/newSales/index.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { MenuItem, CategoryItem, OrderSummary } from './types/PosSystem';
import './styles/responsive.css';

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('crepe');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Mock data (same as before)
  const categories: CategoryItem[] = useMemo(() => [
    { id: 'crepe', name: 'Crepe', nameArabic: 'كريب', image: '/images/img_crepes_1.png', selected: true },
    { id: 'burger', name: 'Burger', nameArabic: 'برجر', image: '/images/img_burger_1.png' },
    { id: 'fries', name: 'Fries', nameArabic: 'بطاطس', image: '/images/img_french_fries_1.png' },
    { id: 'pasta', name: 'Pasta', nameArabic: 'باستا', image: '/images/img_pasta_1.png' },
    { id: 'pizza', name: 'Pizza', nameArabic: 'بيتزا', image: '/images/img_pizza_1.png' },
    { id: 'drinks', name: 'Drinks', nameArabic: 'مشروبات', image: '/images/img_drinks_1.png' },
    { id: 'desserts', name: 'Desserts', nameArabic: 'حلويات', image: '/images/img_desserts_1.png' },
  ], []);

  const menuItems: MenuItem[] = useMemo(() => [
    // Same menu items as before
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    
  ], []);

  const orderSummary: OrderSummary = useMemo(() => ({
    items: [
      {
        id: '1',
        menuItem: menuItems[0],
        quantity: 2,
        extras: [{ name: 'Extra cheese', nameArabic: 'جبنة إضافية', price: 20, quantity: 2 }],
        totalPrice: 100
      },
      // ... rest of order items
    ],
    subtotal: 250,
    discount: 20,
    tax: 50,
    service: 70,
    total: 320
  }), [menuItems]);

  // Event handlers (same as before)
  const handleNumberClick = useCallback((number: string) => {
    if (keypadValue === '0' && number !== '.') {
      setKeypadValue(number);
    } else {
      setKeypadValue(prev => prev + number);
    }
  }, [keypadValue]);

  const handleClearClick = useCallback(() => {
    setKeypadValue('0');
  }, []);

  const handleMenuItemClick = useCallback((item: MenuItem) => {
    console.log('Menu item clicked:', item);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleChipClick = useCallback((chipType: string) => {
    setSelectedChips(prev => 
      prev.includes(chipType) 
        ? prev.filter(chip => chip !== chipType)
        : [...prev, chipType]
    );
  }, []);

  const filteredMenuItems = useMemo(() => 
    menuItems.filter(item => 
      item.category === selectedCategory &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.nameArabic.includes(searchQuery))
    ), [menuItems, selectedCategory, searchQuery]
  );

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
          <div className="product-grid">
            {filteredMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                className="product-card"
              >
                <img src={item.image} alt={item.name} className="product-image" />
                <div className="product-info">
                  <div className="product-name">{item.nameArabic}</div>
                  <div className="product-price">
                    <span className="price">{item.price}</span>
                    <span className="currency">EGP</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Categories Sidebar */}
        <aside className="categories-sidebar">
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
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
              <span className="amount">1250</span>
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
                    <button className="delete-button">
                      <img src="/images/img_delete_02.svg" alt="Remove" />
                    </button>
                    <div className="item-info">
                      <div className="item-name">
                        {item.quantity} X {item.menuItem.name}
                      </div>
                      {item.extras.map((extra, index) => (
                        <div key={index} className="item-extra">
                          {extra.quantity} X {extra.name}
                          <span className="extra-price">{extra.price}</span>
                          <span className="extra-total">{extra.price * extra.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="item-prices">
                    <div className="item-price">{item.menuItem.price * item.quantity}</div>
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
                <span>{orderSummary.subtotal} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <span>{orderSummary.discount} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>{orderSummary.tax} <small>EGP</small></span>
              </div>
              <div className="summary-row">
                <span>Service</span>
                <span>{orderSummary.service} <small>EGP</small></span>
              </div>
            </div>

            <div className="total-row">
              <span>Total</span>
              <span>{orderSummary.total} <small>EGP</small></span>
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
    </div>
  );
};

export default PosSystem;
