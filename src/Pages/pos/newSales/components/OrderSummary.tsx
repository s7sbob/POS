// src/Pages/pos/newSales/components/OrderSummary.tsx - تصحيح مشكلة إغلاق الـ dropdown
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OrderSummary as OrderSummaryType, OrderItem, SubItem } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import * as customersApi from 'src/utils/api/pagesApi/customersApi';
import * as deliveryZonesApi from 'src/utils/api/pagesApi/deliveryZonesApi';
import CustomerDetailsPopup from './CustomerDetailsPopup';
import CustomerForm from '../../customers/components/CustomerForm';
import styles from '../styles/OrderSummary.module.css';

interface OrderSummaryProps {
  orderSummary: OrderSummaryType;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveOrderItem: (itemId: string) => void;
  onRemoveSubItem: (orderItemId: string, subItemId: string) => void;
  selectedOrderItemId: string | null;
  onOrderItemSelect: (itemId: string) => void;
  onOrderItemDoubleClick?: (item: OrderItem) => void;
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  onCustomerSelect: (customer: Customer, address: CustomerAddress) => void;
  orderType: string;
  onDeliveryChargeChange: (charge: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveOrderItem,
  onRemoveSubItem,
  selectedOrderItemId,
  onOrderItemSelect,
  onOrderItemDoubleClick,
  selectedCustomer,
  selectedAddress,
  onCustomerSelect,
  orderType,
  onDeliveryChargeChange
}) => {
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<Customer | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [searchCache, setSearchCache] = useState<{[key: string]: Customer[]}>({});
  const [inputHasFocus, setInputHasFocus] = useState(false); // إضافة حالة التركيز
  
  // استخدام useRef بدلاً من state للمتغيرات المساعدة
  const searchDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const lastSearchQuery = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // تحميل المناطق عند بدء التشغيل
  useEffect(() => {
    const loadZones = async () => {
      try {
        const zonesData = await deliveryZonesApi.getAll();
        setZones(zonesData);
      } catch (error) {
        console.error('Error loading zones:', error);
      }
    };
    
    loadZones();
  }, []);

  // حساب رسوم التوصيل عند تغيير العنوان أو نوع الطلب
  useEffect(() => {
    if (orderType === 'Delivery' && selectedAddress && selectedAddress.zoneId) {
      const zone = zones.find(z => z.id === selectedAddress.zoneId);
      const charge = zone ? zone.deliveryCharge : 0;
      setDeliveryCharge(charge);
      onDeliveryChargeChange(charge);
    } else {
      setDeliveryCharge(0);
      onDeliveryChargeChange(0);
    }
  }, [orderType, selectedAddress, zones, onDeliveryChargeChange]);

  // دالة البحث المصححة
  const searchCustomers = useCallback(async (query: string): Promise<Customer[]> => {
    // التحقق من الكاش
    if (searchCache[query]) {
      return searchCache[query];
    }

    // إلغاء البحث السابق
    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }

    const newController = new AbortController();
    searchAbortController.current = newController;

    try {
      const results = await customersApi.searchByPhone(query);
      
      // حفظ في الكاش
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

  // useEffect للبحث مع تحسين عرض الـ dropdown
  useEffect(() => {
    // إلغاء المؤقت السابق
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    const query = phoneInput.trim();
    
    // إذا النص فاضي، امسح النتائج ولكن لا تُخفي الـ dropdown إذا كان الـ input له focus
    if (!query) {
      setSearchResults([]);
      if (!inputHasFocus) {
        setShowDropdown(false);
      }
      setSelectedResultIndex(-1);
      setIsSearching(false);
      return;
    }

    // إذا النص أقل من 3 أحرف، ما تبحثش ولكن أظهر رسالة
    if (query.length < 3) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      // أظهر الـ dropdown مع رسالة "اكتب 3 أحرف على الأقل" إذا كان الـ input له focus
      if (inputHasFocus) {
        setShowDropdown(true);
      }
      return;
    }

    // إذا هو نفس البحث السابق والنتائج موجودة، أظهر النتائج فقط
    if (query === lastSearchQuery.current && searchResults.length >= 0) {
      if (inputHasFocus) {
        setShowDropdown(true);
      }
      return;
    }

    // بدء البحث مع تأخير
    const performSearch = async () => {
      // التأكد إن النص لسه نفسه (مش اتغير أثناء التأخير)
      if (phoneInput.trim() !== query) {
        return;
      }

      setIsSearching(true);
      lastSearchQuery.current = query;
      
      try {
        const results = await searchCustomers(query);
        
        // التأكد إن النص لسه نفسه بعد البحث
        if (phoneInput.trim() === query) {
          setSearchResults(results);
          // أظهر الـ dropdown فقط إذا كان الـ input له focus أو كان مفتوح من قبل
          if (inputHasFocus || showDropdown) {
            setShowDropdown(true);
          }
          setSelectedResultIndex(-1);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
          // عرض النتائج الفارغة فقط إذا النص لسه نفسه والـ input له focus
          if (phoneInput.trim() === query && inputHasFocus) {
            setSearchResults([]);
            setShowDropdown(true);
          }
        }
      } finally {
        // إيقاف مؤشر التحميل فقط إذا النص لسه نفسه
        if (phoneInput.trim() === query) {
          setIsSearching(false);
        }
      }
    };

    // تأخير البحث 500ms
    searchDebounceTimer.current = setTimeout(performSearch, 500);

    // تنظيف المؤقت عند التغيير
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [phoneInput, searchCustomers, inputHasFocus, showDropdown, searchResults.length]);

  // إغلاق الـ dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedResultIndex(-1);
        setInputHasFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تنظيف عند إلغاء المكون
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneInput(value);
    onCustomerNameChange(value);
    
    // إعادة تعيين الاختيار عند تغيير النص
    setSelectedResultIndex(-1);
    
    // أظهر الـ dropdown عند الكتابة
    if (value.trim().length > 0) {
      setShowDropdown(true);
    }
  }, [onCustomerNameChange]);

  // معالج Focus للـ input
  const handleInputFocus = useCallback(() => {
    setInputHasFocus(true);
    // أظهر الـ dropdown إذا كان هناك نص أو نتائج
    if (phoneInput.trim().length > 0 || searchResults.length > 0) {
      setShowDropdown(true);
    }
  }, [phoneInput, searchResults.length]);

  // معالج Blur للـ input
  const handleInputBlur = useCallback(() => {
    // تأخير إخفاء الـ dropdown للسماح بالنقر على النتائج
    setTimeout(() => {
      setInputHasFocus(false);
    }, 200);
  }, []);

  // معالج Enter محسن

    const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomerForDetails(customer);
    setShowCustomerDetails(true);
    setShowDropdown(false);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, []);

const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (showDropdown && searchResults.length > 0) {
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
        if (isSearching) {
          return;
        }
        // اختيار فقط إذا كان هناك عنصر محدد بالأسهم
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          handleCustomerSelect(searchResults[selectedResultIndex]);
        } else {
          // إذا مفيش اختيار بالأسهم، تحقق من وجود مطابقة تامة
          const query = phoneInput.trim();
          const exactMatch = searchResults.find(customer => 
            customer.phone1 === query || 
            customer.phone2 === query ||
            customer.phone3 === query ||
            customer.phone4 === query
          );
          
          if (!exactMatch) {
            // مفيش مطابقة تامة، افتح dialog الإضافة
            setShowCustomerForm(true);
            setShowDropdown(false);
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedResultIndex(-1);
        inputRef.current?.blur();
        break;
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    
    const query = phoneInput.trim();
    if (query.length >= 3) {
      if (isSearching) {
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCustomers(query);
        
        if (results.length > 0) {
          // تحقق من وجود مطابقة تامة
          const exactMatch = results.find(customer => 
            customer.phone1 === query || 
            customer.phone2 === query ||
            customer.phone3 === query ||
            customer.phone4 === query
          );
          
          setSearchResults(results);
          setShowDropdown(true);
          setSelectedResultIndex(-1);
          
          // إذا مفيش مطابقة تامة، افتح dialog الإضافة كمان
          if (!exactMatch) {
            setShowCustomerForm(true);
          }
        } else {
          setShowCustomerForm(true); // مفيش نتائج، افتح عميل جديد
        }
      } catch (error) {
        console.error('Immediate search failed:', error);
        setShowCustomerForm(true);
      } finally {
        setIsSearching(false);
      }
    }
  }
}, [showDropdown, searchResults, selectedResultIndex, phoneInput, isSearching, searchCustomers, handleCustomerSelect]);





  const handleCustomerDetailsSelect = useCallback((customer: Customer, address: CustomerAddress) => {
    onCustomerSelect(customer, address);
    
    // إفراغ حقل البحث
    setPhoneInput('');
    setShowCustomerDetails(false);
    
    // إخفاء الـ dropdown
    setShowDropdown(false);
    setSearchResults([]);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, [onCustomerSelect]);

  const handleAddCustomerClick = useCallback(() => {
    setShowCustomerForm(true);
    setShowDropdown(false);
    setSelectedResultIndex(-1);
    setInputHasFocus(false);
  }, []);

  const handleCustomerFormSubmit = useCallback(async (data: any) => {
    try {
      const newCustomer = await customersApi.add(data);
      if (newCustomer.addresses.length > 0) {
        onCustomerSelect(newCustomer, newCustomer.addresses[0]);
        // إفراغ حقل البحث
        setPhoneInput('');
      }
      setShowCustomerForm(false);
      
      // إخفاء الـ dropdown
      setShowDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }, [onCustomerSelect]);

  // إضافة معالج إغلاق نموذج العميل
  const handleCustomerFormClose = useCallback(() => {
    setShowCustomerForm(false);
  }, []);

  // إضافة معالج إغلاق تفاصيل العميل
  const handleCustomerDetailsClose = useCallback(() => {
    setShowCustomerDetails(false);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      // إفراغ حقل البحث عند اختيار عميل فقط
      setPhoneInput('');
      setShowDropdown(false);
      setSearchResults([]);
      setSelectedResultIndex(-1);
      setInputHasFocus(false);
    }
  }, [selectedCustomer]);

  // حساب الإجمالي النهائي
  const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
  const taxAmount = 0;
  const finalTotal = subtotalWithDelivery + taxAmount - orderSummary.discount;

  // دوال العرض
  const renderSubItem = (subItem: SubItem, orderItemId: string) => {
    const canDelete = subItem.type === 'extra' || subItem.type === 'without';
    const isSelected = selectedSubItemId === subItem.id && canDelete;
    
    return (
      <div 
        key={subItem.id} 
        className={`${styles.subItem} ${isSelected ? styles.selectedSubItem : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          
          if (canDelete) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            if (isSelected && clickX <= 30) {
              onRemoveSubItem(orderItemId, subItem.id);
              setSelectedSubItemId(null);
            } else {
              setSelectedSubItemId(isSelected ? null : subItem.id);
            }
          }
        }}
        style={{
          cursor: canDelete ? 'pointer' : 'default'
        }}
      >
        <div className={styles.subItemDetails}>
          <div className={styles.subItemInfo}>
            {!isSelected && (
              <span className={`${styles.subItemBadge} ${styles[subItem.type]}`}>
                {subItem.type === 'extra' && '+'}
                {subItem.type === 'without' && '-'}
                {subItem.type === 'option' && '•'}
              </span>
            )}
            <div className={styles.subItemName}>
              {subItem.quantity} X {subItem.name}
            </div>
          </div>
        </div>
        
        <div className={styles.subItemPrices}>
          <div className={styles.subItemPrice}>
            {subItem.type === 'without' ? '0' : (subItem.price / subItem.quantity).toFixed(2)}
          </div>
          <div className={`${styles.subItemTotal} ${subItem.price < 0 ? styles.negative : ''}`}>
            {subItem.type === 'without' ? '0' : subItem.price.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = (options: any[]) => {
    return options.map((option: any, index: number) => (
      <div key={index} className={styles.optionDetail}>
        <span className={styles.optionText}>
          {option.quantity} X {option.itemName}
        </span>
        <div className={styles.optionPrices}>
          <div className={styles.optionPrice}>
            {option.extraPrice > 0 ? `+${option.extraPrice}` : '0'}
          </div>
          <div className={styles.optionTotal}>
            {(option.extraPrice * option.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    ));
  };

  const renderNotes = (notes: string) => {
    if (!notes || notes.trim() === '') return null;
    
    return (
      <div className={styles.commentsContainer}>
        <div className={styles.commentItem}>
          <span className={styles.commentIcon}>💬</span>
          <span className={styles.commentText}>{notes}</span>
        </div>
      </div>
    );
  };

  // تحديد محتوى الـ dropdown
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


  const shouldShowAllButtons = orderType !== 'Takeaway';
const shouldShowPayOnly = orderType === 'Takeaway';

  return (
    <aside className={styles.orderSummary}>
      <div className={styles.orderHeader}>
        <div className={styles.orderNumber}>#123</div>
        <div className={styles.orderTotal}>
          <span className={styles.amount}>{finalTotal.toFixed(2)}</span>
          <span className={styles.currency}>EGP</span>
        </div>
      </div>

      <div className={styles.orderContent}>
        {/* Customer Search Input with Enhanced Dropdown */}
        <div className={styles.customerInputContainer} ref={dropdownRef}>
          <div className={styles.customerInput}>
<input
  ref={inputRef}
  type="text"
  placeholder="Customer Phone Number - رقم هاتف العميل"
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
            >
              <img src="/images/img_group_1000004320.svg" alt="Add customer" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (
            <div className={styles.customerDropdown}>
              {renderDropdownContent()}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className={styles.orderItems}>
          {orderSummary.items.map((item) => (
            <div key={item.id} className={styles.orderItemContainer}>
              <div 
                className={`${styles.orderItem} ${selectedOrderItemId === item.id ? styles.selected : ''} ${item.isExtra ? styles.extraItem : ''} ${item.isWithout ? styles.withoutItem : ''}`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  
                  if (selectedOrderItemId === item.id && clickX <= 30) {
                    onRemoveOrderItem(item.id);
                  } else {
                    onOrderItemSelect(item.id);
                  }
                }}
                onDoubleClick={() => onOrderItemDoubleClick?.(item)}
              >
                <div className={styles.itemDetails}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {item.isExtra && <span className={styles.extraBadge}>+</span>}
                      {item.isWithout && <span className={styles.withoutBadge}>-</span>}
                      {item.quantity} X {item.product.nameArabic}
                      {item.product.hasMultiplePrices && (
                        <span className={styles.itemSizeInline}> - {item.selectedPrice.nameArabic}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.itemPrices}>
                  <div className={styles.itemPrice}>{item.selectedPrice.price}</div>
                  <div className={`${styles.itemTotal} ${item.isWithout ? styles.negative : ''}`}>
                    {item.totalPrice}
                  </div>
                </div>
              </div>
              
              {item.notes && renderNotes(item.notes)}
              
              {item.subItems && item.subItems.length > 0 && (
                <div className={styles.subItemsContainer}>
                  {item.subItems.map(subItem => renderSubItem(subItem, item.id))}
                </div>
              )}
              
              {item.selectedOptions && item.selectedOptions.length > 0 && !item.subItems && (
                <div className={styles.itemOptions}>
                  {renderOptions(item.selectedOptions)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.summaryRows}>
          <div className={styles.summaryRow}>
            <span>Sub Total</span>
            <span>{orderSummary.subtotal.toFixed(2)} <small>EGP</small></span>
          </div>
          
          {deliveryCharge > 0 && (
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>{deliveryCharge.toFixed(2)} <small>EGP</small></span>
            </div>
          )}
          
          <div className={styles.summaryRow}>
            <span>Discount</span>
            <span>{orderSummary.discount.toFixed(2)} <small>EGP</small></span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Tax</span>
            <span>{taxAmount.toFixed(2)} <small>EGP</small></span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Service</span>
            <span>{orderSummary.service.toFixed(2)} <small>EGP</small></span>
          </div>
        </div>

        <div className={styles.totalRow}>
          <span>Total</span>
          <span>{finalTotal.toFixed(2)} <small>EGP</small></span>
        </div>

 <div className={`${styles.actionButtons} ${shouldShowPayOnly ? styles.takeawayButtons : ''}`}>
        {shouldShowAllButtons && (
          <>
            <button className={`${styles.actionButton} ${styles.send}`}>
              <img src="/images/img_tabler_send.svg" alt="Send" />
              <span>Send</span>
            </button>
            <button className={`${styles.actionButton} ${styles.print}`}>
              <img src="/images/img_printer.svg" alt="Print" />
              <span>Print</span>
            </button>
          </>
        )}
        <button className={`${styles.actionButton} ${styles.pay} ${shouldShowPayOnly ? styles.fullWidth : ''}`}>
          <img src="/images/img_payment_02.svg" alt="Pay" />
          <span>Pay</span>
        </button>
      </div>
    </div>

      {/* Customer Details Popup */}
      <CustomerDetailsPopup
        open={showCustomerDetails}
        customer={selectedCustomerForDetails}
        onClose={handleCustomerDetailsClose}
        onSelectCustomer={handleCustomerDetailsSelect}
      />

      {/* Customer Form Popup */}
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
    </aside>
  );
};

export default OrderSummary;
