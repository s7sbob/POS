// src/Pages/pos/newSales/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { DeliveryCompany } from '../../../../../utils/api/pagesApi/deliveryCompaniesApi';
import '../../styles/Header.css';

interface HeaderProps {
  selectedOrderType: string;
  onOrderTypeChange: (type: string) => void;
  onResetOrder?: () => void;
  onTableClick?: () => void;
  tableDisplayName?: string;
  deliveryCompanies?: DeliveryCompany[]; // ✅ تصحيح النوع
  selectedDeliveryCompany?: DeliveryCompany | null; // ✅ تصحيح النوع
  onDeliveryCompanySelect?: (company: DeliveryCompany) => void; // ✅ تصحيح النوع
}

const Header: React.FC<HeaderProps> = ({ 
  selectedOrderType, 
  onOrderTypeChange, 
  onResetOrder,
  onTableClick,
  tableDisplayName = 'Table',
  deliveryCompanies = [], // ✅ إضافة هذا
  selectedDeliveryCompany, // ✅ إضافة هذا
  onDeliveryCompanySelect // ✅ إضافة هذا
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // نفس الـ orderTypes الموجودة
  const orderTypes = [
    { id: 1, name: 'Takeaway', displayName: 'Takeaway', icon: '/images/takeaway.png', color: '#28a745', description: 'عميل يأخذ الطلب' },
    { id: 2, name: 'Dine-in', displayName: 'Dine-in', icon: '/images/dine-in.png', color: '#007bff', description: 'تناول في المطعم' },
    { id: 3, name: 'Delivery', displayName: 'Delivery', icon: '/images/delivery.png', color: '#dc3545', description: 'توصيل للمنزل' },
    { id: 4, name: 'Pickup', displayName: 'Pickup', icon: '/images/pickup.png', color: '#ffc107', description: 'استلام من المطعم' }
  ];

  const handleDeliveryCompanySelect = (company: DeliveryCompany) => {
    if (onDeliveryCompanySelect) {
      onDeliveryCompanySelect(company);
    }
    setIsDropdownOpen(false);
  };

  // ✅ تحويل الـ API data للـ format المطلوب
  const activeDeliveryCompanies = deliveryCompanies.filter(company => company.isActive);

  return (
    <header className="pos-header">
      <div className="header-content">
        <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="header-logo" />
        
        <nav className="header-nav">
          <a href="#" className="nav-item active">
            <img src="/images/img_sending_order.svg" alt="" />
            <span>Today Orders</span>
          </a>
          
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); if (onTableClick) onTableClick(); }}>
            <img src="/images/img_table_02.svg" alt="" />
            <span>{tableDisplayName}</span>
          </a>
          
          <a href="#" className="nav-item">
            <img src="/images/img_discount_tag_01.svg" alt="" />
            <span>Discount</span>
          </a>
          
          <a href="#" className="nav-item">
            <img src="/images/img_delete_01.svg" alt="" />
            <span>Void</span>
          </a>
          
          <button className="order-type-display clickable" onClick={onResetOrder}>
            {selectedOrderType}
          </button>
          
          <div className="menu-dropdown-container" ref={dropdownRef}>
            <button className="menu-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
                        onClick={() => { onOrderTypeChange(type.name); setIsDropdownOpen(false); }}
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

                {/* ✅ استبدال الـ static data بـ API data */}
                {activeDeliveryCompanies.length > 0 && (
                  <div className="dropdown-section">
                    <div className="section-header">
                      <h3 className="section-title">شركاء التوصيل</h3>
                      <div className="section-divider"></div>
                    </div>
                    
                    <div className="delivery-partners-grid">
                      {activeDeliveryCompanies.map((company) => (
                        <button
                          key={company.id}
                          className={`delivery-partner-card ${selectedDeliveryCompany?.id === company.id ? 'selected' : ''}`}
                          onClick={() => handleDeliveryCompanySelect(company)}
                          style={{ 
                            '--partner-color': '#0373ed',
                            '--partner-bg': '#f8f9fa' 
                          } as React.CSSProperties}
                        >
                          <div className="partner-icon-container">
                            <img src="/images/default-delivery.png" alt={company.name} className="partner-icon" />
                          </div>
                          <div className="partner-content">
                            <div className="partner-name">{company.name}</div>
                            <div className="partner-status">{company.paymentType}</div>
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
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
