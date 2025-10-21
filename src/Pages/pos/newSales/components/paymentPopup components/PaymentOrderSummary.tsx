// src/Pages/pos/newSales/components/paymentPopup components/PaymentOrderSummary.tsx
import React from 'react';
import { OrderSummary as OrderSummaryType, SubItem } from '../../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import styles from './styles/PaymentOrderSummary.module.css';

interface PaymentOrderSummaryProps {
  orderSummary: OrderSummaryType;
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  orderType: string;
  deliveryCharge: number;
    onGoBack: () => void;

}

const PaymentOrderSummary: React.FC<PaymentOrderSummaryProps> = ({
  orderSummary,
  selectedCustomer,
  selectedAddress,
  deliveryCharge}) => {
  // حساب إجمالي خصم العناصر لعرضه مع الخصم الرأسى
  const itemDiscountTotal = orderSummary.items.reduce((sum, item) => {
    return sum + (item.discountAmount || 0);
  }, 0);
  const aggregatedDiscount = itemDiscountTotal + orderSummary.discount;
  // حساب الإجمالي النهائي
  const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
  const taxAmount = 0;
  const finalTotal = subtotalWithDelivery + taxAmount - orderSummary.discount;

  // دالة عرض SubItem
  const renderSubItem = (subItem: SubItem) => {
    return (
      <div key={subItem.id} className={styles.subItem}>
        <div className={styles.subItemDetails}>
          <div className={styles.subItemInfo}>
            <span className={`${styles.subItemBadge} ${styles[subItem.type]}`}>
              {subItem.type === 'extra' && '+'}
              {subItem.type === 'without' && '-'}
              {subItem.type === 'option' && '•'}
            </span>
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

  // دالة عرض Options
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

  // دالة عرض Notes
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
    <div className={styles.orderSummary}>
      {/* Header */}
      <div className={styles.orderHeader}>
        <div className={styles.orderNumber}>#123</div>
        <div className={styles.orderTotal}>
          <span className={styles.amount}>{finalTotal.toFixed(2)}</span>
          <span className={styles.currency}>EGP</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.orderContent}>
        {/* Customer Info */}
        {selectedCustomer && (
          <div className={styles.customerInfo}>
            <div className={styles.customerName}>
              👤 {selectedCustomer.name}
              {selectedCustomer.isVIP && <span className={styles.vipBadge}>VIP</span>}
            </div>
            <div className={styles.customerPhone}>
              📞 {selectedCustomer.phone1}
            </div>
            {selectedAddress && selectedAddress.addressLine && (
              <div className={styles.customerAddress}>
                📍 {selectedAddress.addressLine}
                {selectedAddress.zoneName && ` - ${selectedAddress.zoneName}`}
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className={styles.orderItems}>
          {orderSummary.items.map((item) => (
            <div key={item.id} className={styles.orderItemContainer}>
              <div className={`${styles.orderItem} ${item.isExtra ? styles.extraItem : ''} ${item.isWithout ? styles.withoutItem : ''}`}>
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
                    {item.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {item.notes && renderNotes(item.notes)}
              
              {item.subItems && item.subItems.length > 0 && (
                <div className={styles.subItemsContainer}>
                  {item.subItems.map(subItem => renderSubItem(subItem))}
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

      {/* Footer */}
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
            <span>{aggregatedDiscount.toFixed(2)} <small>EGP</small></span>
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

              {/* <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={onGoBack}>
          رجوع
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default PaymentOrderSummary;
