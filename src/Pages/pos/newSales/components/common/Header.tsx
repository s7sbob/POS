// src/Pages/pos/newSales/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Header.css';

interface HeaderProps {
  selectedOrderType: string;
  onOrderTypeChange: (type: string) => void;
  onResetOrder?: () => void;
}

interface OrderType {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  description: string;
}

interface DeliveryPartner {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  bgColor: string;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedOrderType, 
  onOrderTypeChange, 
  onResetOrder 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const orderTypes: OrderType[] = [
    {
      id: 1,
      name: 'Takeaway',
      displayName: 'Takeaway',
      icon: '/images/takeaway.png',
      color: '#28a745',
      description: 'عميل يأخذ الطلب'
    },
    {
      id: 2,
      name: 'Dine-in',
      displayName: 'Dine-in',
      icon: '/images/dine-in.png',
      color: '#007bff',
      description: 'تناول في المطعم'
    },
    {
      id: 3,
      name: 'Delivery',
      displayName: 'Delivery',
      icon: '/images/delivery.png',
      color: '#dc3545',
      description: 'توصيل للمنزل'
    },
    {
      id: 4,
      name: 'Pickup',
      displayName: 'Pickup',
      icon: '/images/pickup.png',
      color: '#ffc107',
      description: 'استلام من المطعم'
    }
  ];

  const deliveryPartners: DeliveryPartner[] = [
    {
      id: 1,
      name: 'talabat',
      displayName: 'طلبات',
      icon: '/images/talabat.png',
      color: '#ff6b35',
      bgColor: '#fff5f3'
    },
    {
      id: 2,
      name: 'elmenus',
      displayName: 'الميناس',
      icon: '/images/elmenus.png',
      color: '#00c851',
      bgColor: '#f3fff6'
    },
    {
      id: 3,
      name: 'uber-eats',
      displayName: 'أوبر إيتس',
      icon: '/images/uber-eats.png',
      color: '#000000',
      bgColor: '#f8f9fa'
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
    setSelectedDeliveryPartner(partner);
    console.log('Selected delivery partner:', partner);
    setIsDropdownOpen(false);
  };

  const handleOrderTypeReset = () => {
    if (onResetOrder) {
      onResetOrder();
    }
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
          
          <button 
            className="order-type-display clickable"
            onClick={handleOrderTypeReset}
          >
            {selectedOrderType}
          </button>
          
          <div className="menu-dropdown-container" ref={dropdownRef}>
            <button className="menu-button" onClick={handleMenuClick}>
              <img src="/images/img_menu_01.svg" alt="Menu" />
            </button>
            
            {isDropdownOpen && (
              <div className="professional-dropdown">
                {/* Order Types Section */}
                <div className="dropdown-section">
                  <div className="section-header">
                    <h3 className="section-title">نوع الطلب</h3>
                    <div className="section-divider"></div>
                  </div>
                  
                  <div className="order-types-grid">
                    {orderTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`order-type-card ${selectedOrderType === type.name ? 'selected' : ''}`}
                        onClick={() => handleOrderTypeSelect(type.name)}
                        style={{ '--accent-color': type.color } as React.CSSProperties}
                      >
                        <div className="card-icon-container">
                          <img src={type.icon} alt={type.displayName} className="card-icon" />
                        </div>
                        <div className="card-content">
                          <div className="card-title">{type.displayName}</div>
                        </div>
                        <div className="card-check">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Partners Section */}
                <div className="dropdown-section">
                  <div className="section-header">
                    <h3 className="section-title">شركاء التوصيل</h3>
                    <div className="section-divider"></div>
                  </div>
                  
                  <div className="delivery-partners-grid">
                    {deliveryPartners.map((partner) => (
                      <button
                        key={partner.id}
                        className={`delivery-partner-card ${selectedDeliveryPartner === partner.name ? 'selected' : ''}`}
                        onClick={() => handleDeliveryPartnerSelect(partner.name)}
                        style={{ 
                          '--partner-color': partner.color,
                          '--partner-bg': partner.bgColor 
                        } as React.CSSProperties}
                      >
                        <div className="partner-icon-container">
                          <img src={partner.icon} alt={partner.displayName} className="partner-icon" />
                        </div>
                        <div className="partner-content">
                          <div className="partner-name">{partner.displayName}</div>
                          <div className="partner-status">متاح</div>
                        </div>
                        <div className="partner-badge">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="6" fill="currentColor"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
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
