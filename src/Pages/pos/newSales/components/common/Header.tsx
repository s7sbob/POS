// src/Pages/pos/newSales/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import { DeliveryCompany } from '../../../../../utils/api/pagesApi/deliveryCompaniesApi';
import { Invoice } from '../../../../../utils/api/pagesApi/invoicesApi'; // إضافة استيراد Invoice type
import '../../styles/Header.css';
import TodayOrdersPopup from '../TodayOrdersPopup';

interface HeaderProps {
  selectedOrderType: string;
  onOrderTypeChange: (type: string) => void;
  onResetOrder?: () => void;
  onTableClick?: () => void;
  tableDisplayName?: string;
  deliveryCompanies?: DeliveryCompany[];
  selectedDeliveryCompany?: DeliveryCompany | null;
  onDeliveryCompanySelect?: (company: DeliveryCompany) => void;
  selectedCustomer?: Customer | null;
  selectedAddress?: CustomerAddress | null;
  // ✅ إضافة prop مطلوب لعرض الطلب
  onViewOrder?: (invoiceData: Invoice & { isEditMode: boolean }) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedOrderType, 
  onOrderTypeChange, 
  onResetOrder,
  onTableClick,
  tableDisplayName = 'Table',
  deliveryCompanies = [],
  selectedDeliveryCompany,
  onDeliveryCompanySelect,
  selectedCustomer,
  selectedAddress,
  onViewOrder // ✅ إضافة في destructuring
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTodayOrders, setShowTodayOrders] = useState(false);

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

  const activeDeliveryCompanies = deliveryCompanies.filter(company => company.isActive);

  // معالج النقر على زر Today Orders
  const handleTodayOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTodayOrders(true);
  };

  // معالج عرض الطلب - تمرير البيانات للصفحة الرئيسية
  const handleViewOrder = (invoiceData: Invoice & { isEditMode: boolean }) => {
    console.log('Header: تم استقبال بيانات الطلب للعرض:', invoiceData);
    
    // تمرير البيانات للصفحة الرئيسية
    if (onViewOrder) {
      onViewOrder(invoiceData);
    } else {
      console.warn('Header: onViewOrder prop غير متوفر');
    }
    
    // إغلاق نافذة Today Orders
    setShowTodayOrders(false);
  };

  // إغلاق dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="pos-header">
        <div className="header-content">
          <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="header-logo" />

          {/* Customer Info Section */}
          {selectedCustomer && (
            <div className="customer-info-section">
              <div className="customer-info-card">
                <div className="customer-basic-info">
                  <div className="customer-name">
                    <span className="customer-icon">👤</span>
                    <span>{selectedCustomer.name}</span>
                    {selectedCustomer.isVIP && <span className="vip-badge">VIP</span>}
                  </div>
                  <div className="customer-phone">
                    <span className="phone-icon">📞</span>
                    <span>{selectedCustomer.phone1}</span>
                  </div>
                </div>

                {selectedAddress && selectedAddress.addressLine && (
                  <div className="customer-address">
                    <span className="address-icon">📍</span>
                    <span className="address-text">
                      {selectedAddress.addressLine}
                      {selectedAddress.zoneName && ` - ${selectedAddress.zoneName}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

            <nav className="header-nav">
              <a
                href="#"
                className="nav-item active today-orders-btn"
                onClick={handleTodayOrdersClick}
                title="عرض طلبات اليوم"
              >
                <img src="/images/img_sending_order.svg" alt="Today Orders" />
                <span>Today Orders</span>
              </a>

              {/* Delivery Order button - only show for Delivery and Pickup */}
              {(selectedOrderType === 'Delivery' || selectedOrderType === 'Pickup') && (
                <a 
                  href="#" 
                  className="nav-item delivery-order-btn" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    // Navigate to DeliveryManagementPage using React Router
                    navigate('/pos/delivery/management');
                  }}
                  title="إدارة التوصيل"
                >
                  <img src="/images/img_delivery_truck.svg" alt="Delivery Order" />
                  <span>Delivery Order</span>
                </a>
              )}

              {/* Table button - only show for Takeaway and Dine-in */}
              {(selectedOrderType === 'Takeaway' || selectedOrderType === 'Dine-in') && (
                <a 
                  href="#" 
                  className="nav-item" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (onTableClick) onTableClick(); 
                  }}
                  title="اختيار الطاولة"
                >
                  <img src="/images/img_table_02.svg" alt="Table" />
                  <span>{tableDisplayName}</span>
                </a>
              )}

            <a href="#" className="nav-item">
              <img src="/images/img_discount_tag_01.svg" alt="Discount" />
              <span>Discount</span>
            </a>

            <a href="#" className="nav-item">
              <img src="/images/img_delete_01.svg" alt="Void" />
              <span>Void</span>
            </a>

            <button 
              className="order-type-display clickable" 
              onClick={onResetOrder}
            >
              {selectedOrderType}
            </button>

            <div className="menu-dropdown-container" ref={dropdownRef}>
              <button 
                className="menu-button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                title="القائمة"
              >
                <img src="/images/img_menu_01.svg" alt="Menu" />
              </button>

              {isDropdownOpen && (
                <div className="professional-dropdown">
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
                          onClick={() => { 
                            onOrderTypeChange(type.name); 
                            setIsDropdownOpen(false); 
                          }}
                          style={{ '--accent-color': type.color } as React.CSSProperties}
                          title={type.description}
                        >
                          <div className="card-icon-container">
                            <img src={type.icon} alt={type.displayName} className="card-icon" />
                          </div>
                          <div className="card-content">
                            <div className="card-title">{type.displayName}</div>
                          </div>
                          <div className="card-check">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

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
                            title={`اختيار ${company.name} - ${company.paymentType}`}
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
                                <circle cx="6" cy="6" r="6" fill="currentColor" />
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

      {/* Today Orders Popup */}
      <TodayOrdersPopup
        isOpen={showTodayOrders}
        onClose={() => setShowTodayOrders(false)}
        currentOrderType={selectedOrderType}
        onViewOrder={handleViewOrder}
      />
    </>
  );
};

export default Header;
