import React, { useState } from 'react';
import Dropdown from '../ui/Dropdown';

const Header: React.FC = () => {
  const [selectedOrderType, setSelectedOrderType] = useState('Takeaway');

  const orderTypes = ['Takeaway', 'Dine In', 'Delivery'];

  return (
    <header className="w-full bg-card shadow-sm h-full">
      <div className="w-full h-full flex items-center" style={{ padding: '0 min(1.5vw, 24px)' }}>
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/img_foodify_logo_2_78x166.png"
              alt="Foodify Logo"
              className="object-contain"
              style={{ 
                width: 'min(10vw, 120px)', 
                height: 'min(5vh, 56px)' 
              }}
            />
          </div>



          {/* Right Section */}
          <div className="flex items-center" style={{ gap: 'min(1vw, 16px)' }}>
            <button 
              className="flex items-center gap-2 text-blue font-nunito font-medium hover:opacity-80 transition-opacity"
              style={{ fontSize: 'min(1.2vw, 14px)' }}
            >
              <img 
                src="/images/img_sending_order.svg" 
                alt="" 
                style={{ width: 'min(1.2vw, 20px)', height: 'min(1.2vw, 20px)' }}
              />
              Today Orders
            </button>
            <button 
              className="flex items-center gap-2 text-primary font-nunito font-medium hover:opacity-80 transition-opacity"
              style={{ fontSize: 'min(1.2vw, 14px)' }}
            >
              <img 
                src="/images/img_table_02.svg" 
                alt="" 
                style={{ width: 'min(1.2vw, 20px)', height: 'min(1.2vw, 20px)' }}
              />
              Table
            </button>
            <button 
              className="flex items-center gap-2 text-primary font-nunito font-medium hover:opacity-80 transition-opacity"
              style={{ fontSize: 'min(1.2vw, 14px)' }}
            >
              <img 
                src="/images/img_discount_tag_01.svg" 
                alt="" 
                style={{ width: 'min(1.2vw, 20px)', height: 'min(1.2vw, 20px)' }}
              />
              Discount
            </button>
            <button 
              className="flex items-center gap-2 text-primary font-nunito font-medium hover:opacity-80 transition-opacity"
              style={{ fontSize: 'min(1.2vw, 14px)' }}
            >
              <img 
                src="/images/img_delete_01.svg" 
                alt="" 
                style={{ width: 'min(1.2vw, 20px)', height: 'min(1.2vw, 20px)' }}
              />
              Void
            </button>
            <div style={{ width: 'min(10vw, 160px)' }}>
              <div style={{ fontSize: 'min(1vw, 16px)' }}>
                <Dropdown
                  placeholder="Takeaway"
                  options={orderTypes}
                  value={selectedOrderType}
                  onChange={setSelectedOrderType}
                  rightImage={{
                    src: "/images/img_arrowdown.svg",
                    width: 24,
                    height: 24
                  }}
                />
              </div>
            </div>
            <button 
              className="hover:bg-gray-100 rounded-lg transition-colors"
              style={{ padding: 'min(0.5vh, 8px)' }}
            >
              <img 
                src="/images/img_menu_01.svg" 
                alt="Menu" 
                style={{ width: 'min(1.8vw, 28px)', height: 'min(1.8vw, 28px)' }}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
