// src/Pages/pos/newSales/components/Header.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import * as customersApi from 'src/utils/api/pagesApi/customersApi';
import { DeliveryCompany } from '../../../../../utils/api/pagesApi/deliveryCompaniesApi';
import { Invoice } from '../../../../../utils/api/pagesApi/invoicesApi';
import CustomerDetailsPopup from '../CustomerDetailsPopup';
import CustomerForm from '../../../customers/components/CustomerForm';
import '../../styles/Header.css';
// import '../../styles/LanguageSwitcher.css';
import styles from '../../styles/OrderSummary.module.css';
import TodayOrdersPopup from '../TodayOrdersPopup';
import DeliveryManagementPopup from '../DeliveryManagementPopup';

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
  onViewOrder?: (invoiceData: Invoice & { isEditMode: boolean }) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onCustomerSelect: (customer: Customer, address: CustomerAddress) => void;

  /**
   * Callback executed when the user chooses to move the current order to another table.
   * Only provided when the POS is in Dine‑in mode and there is an active order.
   */
  onMoveTable?: () => void;
  /**
   * Callback executed when the user chooses to split the current check into multiple receipts.
   * Only provided when the POS is in Dine‑in mode and there is an active order.
   */
  onSplitReceipt?: () => void;
  /**
   * Indicates whether there is an active order on the current table. When true and
   * the order type is “Dine‑in”, a Tools menu will be displayed in the header.
   */
  hasCurrentOrder?: boolean;
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
  onViewOrder,
  customerName,
  onCustomerNameChange,
  onCustomerSelect,
  onMoveTable,
  onSplitReceipt,
  hasCurrentOrder
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Ref for the tools menu container to detect outside clicks
  const toolsRef = useRef<HTMLDivElement>(null);
  const [showTodayOrders, setShowTodayOrders] = useState(false);
  const [showDeliveryManagement, setShowDeliveryManagement] = useState(false);

  // State to control the visibility of the tools dropdown
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // ✅ States لإدارة Customer Search
  const [showCustomerSearch, setShowCustomerSearch] = useState(!selectedCustomer);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [searchCache, setSearchCache] = useState<{[key: string]: Customer[]}>({});
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const [pendingEnterAction, setPendingEnterAction] = useState<string | null>(null);

  // ✅ useRef للمتغيرات المساعدة
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const lastSearchQuery = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // ✅ تحديث حالة البحث عند تغيير العميل
  useEffect(() => {
    setShowCustomerSearch(!selectedCustomer);
    if (selectedCustomer) {
      setPhoneInput('');
      setShowSearchDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    }
  }, [selectedCustomer]);

  // Close the tools dropdown when clicking anywhere outside of it
  useEffect(() => {
    if (!isToolsOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close the dropdown if the click is outside the dropdown container
      // If the click is not inside the tools container, close the dropdown
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isToolsOpen]);

  // ✅ دالة البحث
  const searchCustomers = useCallback(async (query: string): Promise<Customer[]> => {
    if (searchCache[query]) {
      return searchCache[query];
    }

    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }

    const newController = new AbortController();
    searchAbortController.current = newController;

    try {
      const results = await customersApi.searchByPhone(query);
      
      setSearchCache(prev => ({
        ...prev,
        [query]: results
      }));
      
      return results;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.error('Error searching customers:', error);
      throw error;
    }
  }, [searchCache]);

  // ✅ useEffect للبحث
  useEffect(() => {
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    const query = phoneInput.trim();
    
    if (!query) {
      setSearchResults([]);
      if (!inputHasFocus) {
        setShowSearchDropdown(false);
      }
      setSelectedResultIndex(-1);
      setIsSearching(false);
      setPendingEnterAction(null);
      return;
    }

    if (query.length < 3) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setPendingEnterAction(null);
      if (inputHasFocus) {
        setShowSearchDropdown(true);
      }
      return;
    }

    if (query === lastSearchQuery.current && searchResults.length >= 0) {
      if (inputHasFocus) {
        setShowSearchDropdown(true);
      }
      return;
    }

    const performSearch = async () => {
      if (phoneInput.trim() !== query) {
        return;
      }

      setIsSearching(true);
      lastSearchQuery.current = query;
      
      try {
        const results = await searchCustomers(query);
        
        if (phoneInput.trim() === query) {
          setSearchResults(results);
          if (inputHasFocus || showSearchDropdown) {
            setShowSearchDropdown(true);
          }
          setSelectedResultIndex(-1);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
          if (phoneInput.trim() === query && inputHasFocus) {
            setSearchResults([]);
            setShowSearchDropdown(true);
          }
        }
      } finally {
        if (phoneInput.trim() === query) {
          setIsSearching(false);
        }
      }
    };

    searchDebounceTimer.current = setTimeout(performSearch, 500);

    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [phoneInput, searchCustomers, inputHasFocus, showSearchDropdown, searchResults.length]);

  // ✅ إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
        setSelectedResultIndex(-1);
        setInputHasFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ تنظيف عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (searchAbortController.current) {
        searchAbortController.current.abort();
      }
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, []);

  // ✅ معالجات الأحداث
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneInput(value);
    onCustomerNameChange(value);
    
    setSelectedResultIndex(-1);
    
    if (value.trim().length > 0) {
      setShowSearchDropdown(true);
    }
  }, [onCustomerNameChange]);

  const handleInputFocus = useCallback(() => {
    setInputHasFocus(true);
    if (phoneInput.trim().length > 0 || searchResults.length > 0) {
      setShowSearchDropdown(true);
    }
  }, [phoneInput, searchResults.length]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setInputHasFocus(false);
    }, 200);
  }, []);

  const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomerForDetails(customer);
    setShowCustomerDetails(true);
    setShowSearchDropdown(false);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, []);

  const handleEnterAction = useCallback(async (query: string) => {
    try {
      setIsSearching(true);
      const results = await searchCustomers(query);
      
      if (results.length > 0) {
        const exactMatch = results.find(customer => 
          customer.phone1 === query || 
          customer.phone2 === query ||
          customer.phone3 === query ||
          customer.phone4 === query
        );
        
        setSearchResults(results);
        setShowSearchDropdown(true);
        setSelectedResultIndex(-1);
        
        if (exactMatch) {
          handleCustomerSelect(exactMatch);
        }
      } else {
        setShowCustomerForm(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setShowCustomerForm(true);
    } finally {
      setIsSearching(false);
    }
  }, [searchCustomers, handleCustomerSelect]);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSearchDropdown && searchResults.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedResultIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedResultIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          
          if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
            handleCustomerSelect(searchResults[selectedResultIndex]);
          } else {
            const query = phoneInput.trim();
            const exactMatch = searchResults.find(customer => 
              customer.phone1 === query || 
              customer.phone2 === query ||
              customer.phone3 === query ||
              customer.phone4 === query
            );
            
            if (exactMatch) {
              handleCustomerSelect(exactMatch);
            } else if (!isSearching) {
              setShowCustomerForm(true);
              setShowSearchDropdown(false);
            }
          }
          break;
        case 'Escape':
          setShowSearchDropdown(false);
          setSelectedResultIndex(-1);
          inputRef.current?.blur();
          break;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      const query = phoneInput.trim();
      if (query.length >= 3) {
        if (isSearching) {
          setPendingEnterAction(query);
          return;
        }
        await handleEnterAction(query);
      }
    }
  }, [showSearchDropdown, searchResults, selectedResultIndex, phoneInput, isSearching, handleCustomerSelect]);

  useEffect(() => {
    if (pendingEnterAction && !isSearching) {
      const query = pendingEnterAction;
      setPendingEnterAction(null);
      handleEnterAction(query);
    }
  }, [isSearching, pendingEnterAction, handleEnterAction]);

  const handleCustomerDetailsSelect = useCallback((customer: Customer, address: CustomerAddress) => {
    onCustomerSelect(customer, address);
    setPhoneInput('');
    setShowCustomerDetails(false);
    setShowSearchDropdown(false);
    setSearchResults([]);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, [onCustomerSelect]);

  const handleAddCustomerClick = useCallback(() => {
    setShowCustomerForm(true);
    setShowSearchDropdown(false);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, []);

  const handleCustomerFormSubmit = useCallback(async (data: any) => {
    try {
      const newCustomer = await customersApi.add(data);
      if (newCustomer.addresses.length > 0) {
        onCustomerSelect(newCustomer, newCustomer.addresses[0]);
        setPhoneInput('');
      }
      setShowCustomerForm(false);
      setShowSearchDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }, [onCustomerSelect]);

  const handleCustomerFormClose = useCallback(() => {
    setShowCustomerForm(false);
  }, []);

  const handleCustomerDetailsClose = useCallback(() => {
    setShowCustomerDetails(false);
  }, []);

  // ✅ دالة لتحريك العرض للبحث
  const handleEditCustomer = () => {
    setShowCustomerSearch(true);
    setPhoneInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // ✅ تعديل: إزالة DeliveryCompany من قائمة أنواع الطلبات
  const orderTypes = [
    { id: 1, name: 'Takeaway', displayName: t('pos.newSales.orderTypes.takeaway'), icon: '/images/takeaway.png', color: '#28a745', description: t('pos.newSales.orderTypes.takeawayDesc') },
    { id: 2, name: 'Dine-in', displayName: t('pos.newSales.orderTypes.dineIn'), icon: '/images/dine-in.png', color: '#007bff', description: t('pos.newSales.orderTypes.dineInDesc') },
    { id: 3, name: 'Delivery', displayName: t('pos.newSales.orderTypes.delivery'), icon: '/images/delivery.png', color: '#dc3545', description: t('pos.newSales.orderTypes.deliveryDesc') },
    { id: 4, name: 'Pickup', displayName: t('pos.newSales.orderTypes.pickup'), icon: '/images/pickup.png', color: '#ffc107', description: t('pos.newSales.orderTypes.pickupDesc') }
  ];

  // ✅ تعديل: معالج اختيار شركة التوصيل - يقوم بتعيين نوع الطلب إلى DeliveryCompany تلقائياً
  const handleDeliveryCompanySelect = (company: DeliveryCompany) => {
    // تعيين نوع الطلب إلى DeliveryCompany (invoiceType = 5)
    onOrderTypeChange('DeliveryCompany');
    
    if (onDeliveryCompanySelect) {
      onDeliveryCompanySelect(company);
    }
    setIsDropdownOpen(false);
  };

  const activeDeliveryCompanies = deliveryCompanies.filter(company => company.isActive);

  const handleTodayOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTodayOrders(true);
  };

  const handleViewOrder = (invoiceData: Invoice & { isEditMode: boolean }) => {
    console.log('Header: تم استقبال بيانات الطلب للعرض:', invoiceData);
    
    if (onViewOrder) {
      onViewOrder(invoiceData);
    } else {
      console.warn('Header: onViewOrder prop غير متوفر');
    }
    
    setShowTodayOrders(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ دالة عرض محتوى الـ dropdown
  const renderDropdownContent = () => {
    const query = phoneInput.trim();
    
    if (isSearching) {
      return (
        <div className={styles.searchingMessage}>
          <div className={styles.loadingSpinner}></div>
          <span>جاري البحث...</span>
        </div>
      );
    }
    
    if (query.length < 3) {
      return (
        <div className={styles.minLengthMessage}>
          <span>اكتب 3 أرقام على الأقل للبحث</span>
        </div>
      );
    }
    
    if (searchResults.length > 0) {
      return (
        <>
          <div className={styles.dropdownHeader}>
            <span>نتائج البحث ({searchResults.length})</span>
          </div>
          {searchResults.map((customer, index) => (
            <div
              key={customer.id}
              className={`${styles.customerOption} ${
                index === selectedResultIndex ? styles.selectedOption : ''
              }`}
              onClick={() => handleCustomerSelect(customer)}
            >
              <div className={styles.customerInfo}>
                <div className={styles.customerName}>{customer.name}</div>
                <div className={styles.customerPhone}>
                  {customer.phone1}
                  {customer.phone2 && ` - ${customer.phone2}`}
                </div>
                <div className={styles.customerDetails}>
                  {customer.addresses.length} عنوان
                  {customer.isVIP && ' • VIP'}
                  {customer.isBlocked && ' • محظور'}
                </div>
              </div>
            </div>
          ))}
        </>
      );
    }
    
    return (
      <div className={styles.noResults}>
        <span>لا توجد نتائج لهذا الرقم</span>
        <button 
          className={styles.addNewCustomerBtn}
          onClick={handleAddCustomerClick}
          disabled={isSearching}
        >
          إضافة عميل جديد
        </button>
      </div>
    );
  };

  return (
    <>
      <header className="pos-header">
        <div className="header-content">
          <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify Logo" className="header-logo" />

          {/* ✅ Customer Section - مخفي لشركات التوصيل */}
          {selectedOrderType !== 'DeliveryCompany' && (
            <div className="customer-section">
              {showCustomerSearch ? (
                <div className={styles.customerInputContainer} ref={searchDropdownRef}>
                  <div className={styles.customerInput}>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={t('pos.newSales.header.customerPhone')}
                      value={phoneInput}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={handleKeyDown}
                      className={styles.customerField}
                    />
                    <button 
                      className={styles.customerButton}
                      onClick={handleAddCustomerClick}
                      disabled={isSearching}
                      title={t('pos.newSales.header.addCustomer')}
                    >
                      <img src="/images/img_group_1000004320.svg" alt="Add customer" />
                    </button>
                  </div>

                  {showSearchDropdown && (
                    <div className={styles.customerDropdown}>
                      {renderDropdownContent()}
                    </div>
                  )}
                </div>
              ) : (
                selectedCustomer && (
                  <div className="customer-info-section">
                    <div className="customer-info-card">
                      <div className="customer-basic-info">
                        <div className="customer-name">
                          <span className="customer-icon">👤</span>
                          <span>{selectedCustomer.name}</span>
                          {selectedCustomer.isVIP && <span className="vip-badge">{t('pos.newSales.header.vip')}</span>}
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

                      <button 
                        className="edit-customer-btn"
                        onClick={handleEditCustomer}
                        title={t('pos.newSales.header.editCustomer')}
                      >
                        <img src="/images/img_edit.png" alt="Edit" />
                        <span>{t('pos.newSales.customer.edit')}</span>
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <nav className="header-nav">
            {/* <div className="language-switcher">
              <button 
                className="language-btn"
                onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
                title={t('pos.newSales.language.switchTo') + ' ' + (i18n.language === 'ar' ? 'English' : 'العربية')}
              >
                <span className="language-icon">🌐</span>
                <span className="language-text">
                  {i18n.language === 'ar' ? 'EN' : 'عر'}
                </span>
              </button>
            </div> */}

            <a
              href="#"
              className="nav-item active today-orders-btn"
              onClick={handleTodayOrdersClick}
              title={t('pos.newSales.header.todayOrders')}
            >
              <img src="/images/img_sending_order.svg" alt="Today Orders" />
              <span>{t('pos.newSales.header.todayOrders')}</span>
            </a>

            {(selectedOrderType === 'Delivery' || selectedOrderType === 'Pickup') && (
              <a 
                href="#" 
                className="nav-item delivery-order-btn" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowDeliveryManagement(true);
                }}
                title={t('pos.newSales.header.deliveryOrder')}
              >
                <img src="/images/img_delivery_truck.svg" alt="Delivery Order" />
                <span>{t('pos.newSales.header.deliveryOrder')}</span>
              </a>
            )}

            {(selectedOrderType === 'Takeaway' || selectedOrderType === 'Dine-in') && (
              <a 
                href="#" 
                className="nav-item" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (onTableClick) onTableClick(); 
                }}
                title={t('pos.newSales.header.table')}
              >
                <img src="/images/img_table_02.svg" alt="Table" />
                <span>{tableDisplayName}</span>
              </a>
            )}

            <a href="#" className="nav-item">
              <img src="/images/img_discount_tag_01.svg" alt="Discount" />
              <span>{t('pos.newSales.header.discount')}</span>
            </a>

            <a href="#" className="nav-item">
              <img src="/images/img_delete_01.svg" alt="Void" />
              <span>{t('pos.newSales.header.void')}</span>
            </a>

            {/* أدوات: تظهر فقط فى حالة Dine‑in مع وجود طلب حالي */}
            {selectedOrderType === 'Dine-in' && hasCurrentOrder && (
              <div ref={toolsRef} className="tools-container" style={{ position: 'relative' }}>
                <button
                  className="nav-item"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsToolsOpen(!isToolsOpen);
                  }}
                  title="أدوات"
                  style={{
                    background: isToolsOpen ? '#f8f9ff' : 'transparent',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src="/images/img_menu_01.svg" alt="Tools" />
                  <span>أدوات</span>
                </button>
                {isToolsOpen && (
                  <div
                    className="tools-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: '#ffffff',
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 8px 25px rgba(93, 135, 255, 0.15)',
                      zIndex: 1000,
                      minWidth: '200px',
                      animation: 'fadeInDown 0.2s ease-out'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px'
                    }}>
                      <div
                        className="tools-option-card"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsToolsOpen(false);
                          onMoveTable && onMoveTable();
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '16px 12px',
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f8f9ff';
                          e.currentTarget.style.borderColor = '#5D87FF';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 135, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                          e.currentTarget.style.borderColor = '#e9ecef';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#5D87FF',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#2A3547',
                          lineHeight: '1.2'
                        }}>
                          نقل ترابيزة
                        </span>
                      </div>

                      <div
                        className="tools-option-card"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsToolsOpen(false);
                          onSplitReceipt && onSplitReceipt();
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '16px 12px',
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f8f9ff';
                          e.currentTarget.style.borderColor = '#5D87FF';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 135, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8f9fa';
                          e.currentTarget.style.borderColor = '#e9ecef';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#28a745',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8" stroke="white" strokeWidth="2"/>
                            <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="white" strokeWidth="2"/>
                            <path d="M12 11V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 14L12 11L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#2A3547',
                          lineHeight: '1.2'
                        }}>
                          فصل الشيك
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button 
              className="order-type-display clickable" 
              onClick={onResetOrder}
            >
              {/* ✅ عرض اسم شركة التوصيل بدلاً من DeliveryCompany */}
              {selectedOrderType === 'DeliveryCompany' && selectedDeliveryCompany 
                ? selectedDeliveryCompany.name 
                : selectedOrderType}
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
                  {/* ✅ قسم أنواع الطلبات العادية */}
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

                  {/* ✅ قسم شركات التوصيل - ثابت ومنفصل */}
                  {activeDeliveryCompanies.length > 0 && (
                    <div className="dropdown-section">
                      <div className="section-header">
                        <h3 className="section-title">{t('pos.newSales.deliveryCompanies.title')}</h3>
                        <div className="section-divider"></div>
                      </div>

                      <div className="delivery-partners-grid">
                        {activeDeliveryCompanies.map((company) => (
                          <button
                            key={company.id}
                            className={`delivery-partner-card ${
                              selectedOrderType === 'DeliveryCompany' && selectedDeliveryCompany?.id === company.id ? 'selected' : ''
                            }`}
                            onClick={() => handleDeliveryCompanySelect(company)}
                            style={{
                              '--partner-color': '#0373ed',
                              '--partner-bg': '#f8f9fa'
                            } as React.CSSProperties}
                            title={`${t('pos.newSales.deliveryCompanies.select')} ${company.name} - ${company.paymentType}`}
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

      {/* ✅ Popups */}
      <TodayOrdersPopup
        isOpen={showTodayOrders}
        onClose={() => setShowTodayOrders(false)}
        currentOrderType={selectedOrderType}
        onViewOrder={handleViewOrder}
      />

      <DeliveryManagementPopup
        isOpen={showDeliveryManagement}
        onClose={() => setShowDeliveryManagement(false)}
      />

      <CustomerDetailsPopup
        open={showCustomerDetails}
        customer={selectedCustomerForDetails}
        onClose={handleCustomerDetailsClose}
        onSelectCustomer={handleCustomerDetailsSelect}
      />

      {showCustomerForm && (
        <CustomerForm
          key={phoneInput}
          open={showCustomerForm}
          mode="add"
          onClose={handleCustomerFormClose}
          onSubmit={handleCustomerFormSubmit}
          initialValues={{
            id: '',
            name: '',
            phone1: phoneInput.trim(),
            phone2: '',
            phone3: '',
            phone4: '',
            isVIP: false,
            isBlocked: false,
            isActive: true,
            addresses: []
          }}
        />
      )}
    </>
  );
};

export default Header;
