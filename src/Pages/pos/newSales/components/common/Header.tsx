// src/Pages/pos/newSales/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Header.css';

interface HeaderProps {
  selectedOrderType: string;
  onOrderTypeChange: (type: string) => void;
}

interface OrderType {
  id: number;
  name: string;
  displayName: string;
  icon: string;
}

interface DeliveryPartner {
  id: number;
  name: string;
  displayName: string;
  icon: string;
}

const Header: React.FC<HeaderProps> = ({ selectedOrderType, onOrderTypeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const orderTypes: OrderType[] = [
    {
      id: 1,
      name: 'Takeaway',
      displayName: 'Takeaway',
      icon: '/images/takeaway.png'
    },
    {
      id: 2,
      name: 'Dine-in',
      displayName: 'Dine-in',
      icon: '/images/dine-in.png'
    },
    {
      id: 3,
      name: 'Delivery',
      displayName: 'Delivery',
      icon: '/images/delivery.png'
    },
    {
      id: 4,
      name: 'Pickup',
      displayName: 'Pickup',
      icon: '/images/pickup.png'
    }
  ];

  const deliveryPartners: DeliveryPartner[] = [
    {
      id: 1,
      name: 'talabat',
      displayName: 'talabat',
      icon: '/images/talabat.png'
    },
    {
      id: 2,
      name: 'elmenus',
      displayName: 'Elmenus',
      icon: '/images/elmenus.png'
    },
    {
      id: 3,
      name: 'uber-eats',
      displayName: 'Uber Eats',
      icon: '/images/uber-eats.png'
    }
  ];

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOrderTypeSelect = (type: string) => {
    onOrderTypeChange(type);
    setIsDropdownOpen(false);
  };

  const handleDeliveryPartnerSelect = (partner: string) => {
    console.log('Selected delivery partner:', partner);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="pos-header">
      <div className="header-content">
        <img 
          src="/images/img_foodify_logo_2_78x166.png" 
          alt="Foodify Logo" 
          className="header-logo" 
        />

        <nav className="header-nav">
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
          
          <div className="order-type-display">
            {selectedOrderType}
          </div>
          
          <div className="menu-dropdown-container" ref={dropdownRef}>
            <button className="menu-button" onClick={handleMenuClick}>
              <img src="/images/img_menu_01.svg" alt="Menu" />
            </button>
            
            {isDropdownOpen && (
              <div className="figma-dropdown">
                {/* Order Types Section */}
                <div className="order-types-section">
                  {orderTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`figma-card ${selectedOrderType === type.name ? 'selected' : ''}`}
                      onClick={() => handleOrderTypeSelect(type.name)}
                    >
                      <div className="card-icon-section">
                        <img src={type.icon} alt={type.displayName} className="card-icon" />
                      </div>
                      <div className="card-label">{type.displayName}</div>
                    </button>
                  ))}
                </div>

                {/* Delivery Partners Section */}
                <div className="delivery-partners-section">
                  {deliveryPartners.map((partner) => (
                    <button
                      key={partner.id}
                      className="figma-card delivery-card"
                      onClick={() => handleDeliveryPartnerSelect(partner.name)}
                    >
                      <div className="card-icon-section">
                        <img src={partner.icon} alt={partner.displayName} className="delivery-icon" />
                      </div>
                      <div className="card-label">{partner.displayName}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
