import React, { useState, useCallback, useMemo } from 'react';
import { MenuItem, CategoryItem, OrderSummary } from './types/PosSystem';
import './styles/index.css';

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('crepe');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Mock data
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
    { id: '1', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462.png', category: 'crepe' },
    { id: '2', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_186x194.png', category: 'crepe' },
    { id: '3', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_1.png', category: 'crepe' },
    { id: '4', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_2.png', category: 'crepe' },
    { id: '5', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_3.png', category: 'crepe' },
    { id: '6', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_4.png', category: 'crepe' },
    { id: '7', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_5.png', category: 'crepe' },
    { id: '8', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_6.png', category: 'crepe' },
    { id: '9', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_7.png', category: 'crepe' },
    { id: '10', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_8.png', category: 'crepe' },
    { id: '11', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_9.png', category: 'crepe' },
    { id: '12', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_10.png', category: 'crepe' },
    { id: '13', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_11.png', category: 'crepe' },
    { id: '14', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_12.png', category: 'crepe' },
    { id: '15', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_13.png', category: 'crepe' },
    { id: '16', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_6.png', category: 'crepe' },
    { id: '17', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_14.png', category: 'crepe' },
    { id: '18', name: 'Crepe', nameArabic: 'كريب فراخ', price: 100, image: '/images/img_rectangle_34624462_15.png', category: 'crepe' },
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
      {
        id: '2',
        menuItem: menuItems[0],
        quantity: 2,
        extras: [{ name: 'Extra cheese', nameArabic: 'جبنة إضافية', price: 20, quantity: 2 }],
        totalPrice: 100
      },
      {
        id: '3',
        menuItem: menuItems[0],
        quantity: 2,
        extras: [{ name: 'Extra cheese', nameArabic: 'جبنة إضافية', price: 20, quantity: 2 }],
        totalPrice: 100
      },
      {
        id: '4',
        menuItem: menuItems[0],
        quantity: 2,
        extras: [{ name: 'Extra cheese', nameArabic: 'جبنة إضافية', price: 20, quantity: 2 }],
        totalPrice: 100
      }
    ],
    subtotal: 250,
    discount: 20,
    tax: 50,
    service: 70,
    total: 320
  }), [menuItems]);

  // Event handlers
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

  const handleRemoveItem = useCallback((itemId: string) => {
    console.log('Remove item:', itemId);
  }, []);

  const handleSendOrder = useCallback(() => {
    console.log('Send order');
  }, []);

  const handlePrintOrder = useCallback(() => {
    console.log('Print order');
  }, []);

  const handlePayOrder = useCallback(() => {
    console.log('Pay order');
  }, []);

  const filteredMenuItems = useMemo(() => 
    menuItems.filter(item => 
      item.category === selectedCategory &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.nameArabic.includes(searchQuery))
    ), [menuItems, selectedCategory, searchQuery]
  );

  return (
    <div className="pos-system-container">
      {/* Header */}
      <header className="site-header">
        <div className="header-content">
          <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="logo" />
          <nav className="nav-items">
            <a href="#" className="nav-item">
              <img src="/images/img_sending_order.svg" alt="" />
              Today Orders
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_table_02.svg" alt="" />
              Table
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_discount_tag_01.svg" alt="" />
              Discount
            </a>
            <a href="#" className="nav-item">
              <img src="/images/img_delete_01.svg" alt="" />
              Void
            </a>
            <select style={{ 
              padding: '0.6rem 1.2rem', 
              borderRadius: '0.4rem',
              border: '0.1rem solid #ccc',
              fontSize: '1.4rem'
            }}>
              <option>Takeaway</option>
              <option>Dine In</option>
              <option>Delivery</option>
            </select>
            <button style={{ 
              padding: '0.6rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              <img src="/images/img_menu_01.svg" alt="Menu" style={{ width: '2.4rem', height: '2.4rem' }} />
            </button>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Left Panel */}
        <section className="left-panel">
          {/* Numeric Keypad */}
          <div className="numeric-keypad">
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

          {/* Filter Section */}
          <div className="filter-section">
            <div className="chip-container">
              <button 
                className={`chip extra ${selectedChips.includes('extra') ? 'active' : ''}`}
                onClick={() => handleChipClick('extra')}
              >
                <img src="/images/img_addcircle.svg" alt="" />
                Extra
              </button>
              <button 
                className={`chip without ${selectedChips.includes('without') ? 'active' : ''}`}
                onClick={() => handleChipClick('without')}
              >
                <img src="/images/img_removecircle.svg" alt="" />
                Without
              </button>
              <button 
                className={`chip offer ${selectedChips.includes('offer') ? 'active' : ''}`}
                onClick={() => handleChipClick('offer')}
              >
                <img src="/images/img_tags.svg" alt="" />
                Offer
              </button>
            </div>
            
            <div className="search-container" style={{ position: 'relative' }}>
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
          <div className="products-grid">
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
                    <span>{item.price}</span>
                    <span className="currency">EGP</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Category Sidebar */}
        <aside className="category-sidebar">
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
        </aside>

        {/* Order Panel */}
        <aside className="order-panel">
          <div className="order-header">
            <div className="order-number">#123</div>
            <div className="order-total">
              <span>1250</span>
              <span style={{ fontSize: '1.2rem', marginLeft: '0.4rem' }}>EGP</span>
            </div>
          </div>

          <div className="order-body">
            <h3 className="order-title">Order Details</h3>

            <div className="customer-input-container">
              <input
                type="text"
                placeholder="Walk in Customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-input"
              />
              <button className="customer-button">
                <img src="/images/img_group_1000004320.svg" alt="Add customer" />
              </button>
            </div>

            <div className="order-items">
              {orderSummary.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <button onClick={() => handleRemoveItem(item.id)} className="delete-button">
                      <img src="/images/img_delete_02.svg" alt="Remove" />
                    </button>
                    <div className="item-info">
                      <div className="item-name">
                        {item.quantity} X {item.menuItem.name}
                      </div>
                      {item.extras.map((extra, index) => (
                        <div key={index} className="item-extras">
                          {extra.quantity} X {extra.name} ({extra.price})
                          <span style={{ marginLeft: '2.4rem' }}>{extra.price * extra.quantity}</span>
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

          <div className="order-summary">
            <div className="summary-rows">
              {[
                { label: 'Sub Total', value: orderSummary.subtotal },
                { label: 'Discount', value: orderSummary.discount },
                { label: 'Tax', value: orderSummary.tax },
                { label: 'Service', value: orderSummary.service }
              ].map(item => (
                <div key={item.label} className="summary-row">
                  <span>{item.label}</span>
                  <span className="value">{item.value} <small>EGP</small></span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{orderSummary.total} <small>EGP</small></span>
            </div>

            <div className="action-buttons">
              <button onClick={handleSendOrder} className="action-button send-button">
                <img src="/images/img_tabler_send.svg" alt="Send" />
                Send
              </button>
              <button onClick={handlePrintOrder} className="action-button print-button">
                <img src="/images/img_printer.svg" alt="Print" />
                Print
              </button>
              <button onClick={handlePayOrder} className="action-button pay-button">
                <img src="/images/img_payment_02.svg" alt="Pay" />
                Pay
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PosSystem;
