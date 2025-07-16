import React, { useState } from 'react';
import { OrderSummary as OrderSummaryType, OrderItem, SubItem } from '../types/PosSystem';
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
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveOrderItem,
  onRemoveSubItem,
  selectedOrderItemId,
  onOrderItemSelect,
  onOrderItemDoubleClick
}) => {
  
  // إضافة state للـ sub-item المحدد
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);
  
const renderSubItem = (subItem: SubItem, orderItemId: string) => {
  // فقط المنتجات من نوع extra و without يمكن حذفها أو تحديدها
  const canDelete = subItem.type === 'extra' || subItem.type === 'without';
  const isSelected = selectedSubItemId === subItem.id && canDelete;
  
  return (
    <div 
      key={subItem.id} 
      className={`${styles.subItem} ${isSelected ? styles.selectedSubItem : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        
        // فقط إذا كان من النوع القابل للحذف
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
        // إذا كان من نوع option، لا يحدث شيء
      }}
      style={{
        cursor: canDelete ? 'pointer' : 'default' // تغيير الـ cursor بناءً على القابلية للحذف
      }}
    >
      <div className={styles.subItemDetails}>
        <div className={styles.subItemInfo}>
          {/* إظهار الـ badge فقط إذا لم يكن محدد */}
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

  return (
    <aside className={styles.orderSummary}>
      <div className={styles.orderHeader}>
        <div className={styles.orderNumber}>#123</div>
        <div className={styles.orderTotal}>
          <span className={styles.amount}>{orderSummary.total.toFixed(2)}</span>
          <span className={styles.currency}>EGP</span>
        </div>
      </div>

      <div className={styles.orderContent}>
        <div className={styles.customerInput}>
          <input
            type="text"
            placeholder="Walk in Customer"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className={styles.customerField}
          />
          <button className={styles.customerButton}>
            <img src="/images/img_group_1000004320.svg" alt="Add customer" />
          </button>
        </div>

        <div className={styles.orderItems}>
          {orderSummary.items.map((item) => (
            <div key={item.id} className={styles.orderItemContainer}>
              <div 
                className={`${styles.orderItem} ${selectedOrderItemId === item.id ? styles.selected : ''} ${item.isExtra ? styles.extraItem : ''} ${item.isWithout ? styles.withoutItem : ''}`}
onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  
  // إذا كان محدد والضغط على أول 30px (منطقة الـ border)
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
              
              {/* عرض التعليقات */}
              {item.notes && renderNotes(item.notes)}
              
              {/* عرض Sub-items */}
              {item.subItems && item.subItems.length > 0 && (
                <div className={styles.subItemsContainer}>
                  {item.subItems.map(subItem => renderSubItem(subItem, item.id))}
                </div>
              )}
              
              {/* عرض الخيارات القديمة */}
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
          <div className={styles.summaryRow}>
            <span>Discount</span>
            <span>{orderSummary.discount.toFixed(2)} <small>EGP</small></span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax</span>
            <span>{orderSummary.tax.toFixed(2)} <small>EGP</small></span>
          </div>
          <div className={styles.summaryRow}>
            <span>Service</span>
            <span>{orderSummary.service.toFixed(2)} <small>EGP</small></span>
          </div>
        </div>

        <div className={styles.totalRow}>
          <span>Total</span>
          <span>{orderSummary.total.toFixed(2)} <small>EGP</small></span>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.actionButton} ${styles.send}`}>
            <img src="/images/img_tabler_send.svg" alt="Send" />
            <span>Send</span>
          </button>
          <button className={`${styles.actionButton} ${styles.print}`}>
            <img src="/images/img_printer.svg" alt="Print" />
            <span>Print</span>
          </button>
          <button className={`${styles.actionButton} ${styles.pay}`}>
            <img src="/images/img_payment_02.svg" alt="Pay" />
            <span>Pay</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
