import React, { useState } from 'react';
import Header from './components/common/Header';
import { ChipView, ChipItem } from './components/ui/ChipView';
import SearchView from './components/ui/SearchView';
import NumericKeypad from './NumericKeypad';
import MenuGrid from './MenuGrid';
import CategorySidebar from './CategorySidebar';
import OrderSummaryPanel from './OrderSummaryPanel';
import { MenuItem, CategoryItem, OrderSummary } from './types/PosSystem';
import './styles/index.css';

const PosSystem: React.FC = () => {
  const [keypadValue, setKeypadValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('crepe');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  // Mock data
  const categories: CategoryItem[] = [
    { id: 'crepe', name: 'Crepe', nameArabic: 'كريب', image: '/images/img_crepes_1.png', selected: true },
    { id: 'burger', name: 'Burger', nameArabic: 'برجر', image: '/images/img_burger_1.png' },
    { id: 'fries', name: 'Fries', nameArabic: 'بطاطس', image: '/images/img_french_fries_1.png' },
    { id: 'pasta', name: 'Pasta', nameArabic: 'باستا', image: '/images/img_pasta_1.png' },
    { id: 'pizza', name: 'Pizza', nameArabic: 'بيتزا', image: '/images/img_pizza_1.png' },
    { id: 'drinks', name: 'Drinks', nameArabic: 'مشروبات', image: '/images/img_drinks_1.png' },
    { id: 'desserts', name: 'Desserts', nameArabic: 'حلويات', image: '/images/img_desserts_1.png' },
  ];

  const menuItems: MenuItem[] = [
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
  ];

  const orderSummary: OrderSummary = {
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
  };

  const handleNumberClick = (number: string) => {
    if (keypadValue === '0' && number !== '.') {
      setKeypadValue(number);
    } else {
      setKeypadValue(prev => prev + number);
    }
  };

  const handleClearClick = () => {
    setKeypadValue('5');
  };

  const handleMenuItemClick = (item: MenuItem) => {
    console.log('Menu item clicked:', item);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleChipClick = (chipType: string) => {
    setSelectedChips(prev => 
      prev.includes(chipType) 
        ? prev.filter(chip => chip !== chipType)
        : [...prev, chipType]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    console.log('Remove item:', itemId);
  };

  const handleSendOrder = () => {
    console.log('Send order');
  };

  const handlePrintOrder = () => {
    console.log('Print order');
  };

  const handlePayOrder = () => {
    console.log('Pay order');
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.category === selectedCategory &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.nameArabic.includes(searchQuery))
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-main flex flex-col" style={{ minWidth: '1024px' }}>
      {/* Header - ثابت في الأعلى */}
      <div className="flex-shrink-0" style={{ height: '6vh' }}>
        <Header />
      </div>
      
      {/* Main Content - يأخذ باقي المساحة */}
      <div className="flex-1 flex overflow-hidden" style={{ height: '92vh' }}>
        {/* Left Section - Main Content - 70% */}
        <div className="flex flex-col overflow-hidden" style={{ width: '70vw' }}>
          {/* Numeric Keypad - ثابت الشكل والحجم */}
          <div className="flex-shrink-0" style={{ height: '15%', padding: 'min(1vw, 16px)' }}>
            <NumericKeypad
              onNumberClick={handleNumberClick}
              onClearClick={handleClearClick}
              currentValue={keypadValue}
            />
          </div>

          {/* Filter Chips and Search - ثابت */}
          <div className="flex-shrink-0" style={{ height: '10%', padding: '0 min(1vw, 16px)' }}>
            <div className="flex items-center justify-between gap-4 h-full">
              <ChipView className="flex-1">
                <ChipItem
                  variant="extra"
                  leftImage={{ src: '/images/img_addcircle.svg', width: 24, height: 24 }}
                  selected={selectedChips.includes('extra')}
                  onClick={() => handleChipClick('extra')}
                >
                  Extra
                </ChipItem>
                <ChipItem
                  variant="without"
                  leftImage={{ src: '/images/img_removecircle.svg', width: 24, height: 24 }}
                  selected={selectedChips.includes('without')}
                  onClick={() => handleChipClick('without')}
                >
                  Without
                </ChipItem>
                <ChipItem
                  variant="offer"
                  leftImage={{ src: '/images/img_tags.svg', width: 24, height: 24 }}
                  selected={selectedChips.includes('offer')}
                  onClick={() => handleChipClick('offer')}
                >
                  Offer
                </ChipItem>
              </ChipView>

              <div className="flex items-center gap-2">
                <SearchView
                  placeholder="Search"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  leftImage={{ src: '/images/img_search01.svg', width: 20, height: 20 }}
                  className="w-80"
                />
                <button className="p-4 bg-primary-blue rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-blue">
                  <img src="/images/img_group_7.svg" alt="Filter" className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Menu Grid - يأخذ باقي المساحة مع scroll */}
          <div className="flex-1 overflow-hidden" style={{ height: '75%', padding: '0 min(1vw, 16px) min(1vw, 16px)' }}>
            <MenuGrid
              items={filteredMenuItems}
              onItemClick={handleMenuItemClick}
              className="h-full overflow-auto hidden-scroll"
            />
          </div>
        </div>

        {/* Category Sidebar - 10% */}
        <div className="flex-shrink-0 overflow-hidden border-l border-r border-gray-200" style={{ width: '10vw' }}>
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            className="h-full overflow-auto hidden-scroll"
            style={{ padding: 'min(1vw, 16px)' }}
          />
        </div>

        {/* Right Section - Order Summary - 20% */}
        <div className="flex-shrink-0 overflow-hidden" style={{ width: '20vw', padding: 'min(1vw, 16px)' }}>
          <OrderSummaryPanel
            orderNumber="#123"
            totalAmount="1250 EGP"
            orderSummary={orderSummary}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            onRemoveItem={handleRemoveItem}
            onSendOrder={handleSendOrder}
            onPrintOrder={handlePrintOrder}
            onPayOrder={handlePayOrder}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PosSystem;
