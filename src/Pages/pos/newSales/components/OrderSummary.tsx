// src/Pages/pos/newSales/components/OrderSummary.tsx - الكود الكامل المُحدث
import React from 'react';
import { OrderSummary as OrderSummaryType, OrderItem, SubItem } from '../types/PosSystem';

interface OrderSummaryProps {
  orderSummary: OrderSummaryType;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveOrderItem: (itemId: string) => void;
  onRemoveSubItem: (orderItemId: string, subItemId: string) => void;
  selectedOrderItemId: string | null;
  onOrderItemSelect: (itemId: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveOrderItem,
  onRemoveSubItem,
  selectedOrderItemId,
  onOrderItemSelect
}) => {
  
  const renderSubItem = (subItem: SubItem, orderItemId: string) => {
    const canDelete = subItem.type !== 'option' || !subItem.isRequired;
    
    return (
      <div key={subItem.id} className="sub-item">
        <div className="sub-item-content">
          <div className="sub-item-info">
            <span className={`sub-item-badge ${subItem.type}`}>
              {subItem.type === 'extra' && '+'}
              {subItem.type === 'without' && '-'}
              {subItem.type === 'option' && '•'}
            </span>
            <span className="sub-item-text">
              {subItem.quantity > 1 && `${subItem.quantity}x `}
              {subItem.name}
              {subItem.price !== 0 && ` (${subItem.price > 0 ? '+' : ''}${subItem.price})`}
            </span>
          </div>
          
          {canDelete && (
            <button
              className="sub-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSubItem(orderItemId, subItem.id);
              }}
              title="حذف"
            >
              <img src="/images/img_delete_02.svg" alt="Remove" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="order-summary">
      <div className="order-header">
        <div className="order-number">#123</div>
        <div className="order-total">
          <span className="amount">{orderSummary.total.toFixed(2)}</span>
          <span className="currency">EGP</span>
        </div>
      </div>

      <div className="order-content">
        <h3 className="order-title">Order Details</h3>

        <div className="customer-input">
          <input
            type="text"
            placeholder="Walk in Customer"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="customer-field"
          />
          <button className="customer-button">
            <img src="/images/img_group_1000004320.svg" alt="Add customer" />
          </button>
        </div>

        <div className="order-items">
          {orderSummary.items.map((item) => (
            <div 
              key={item.id} 
              className={`order-item ${selectedOrderItemId === item.id ? 'selected' : ''} ${item.isExtra ? 'extra-item' : ''} ${item.isWithout ? 'without-item' : ''}`}
              onClick={() => onOrderItemSelect(item.id)}
            >
              <div className="item-details">
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveOrderItem(item.id);
                  }}
                >
                  <img src="/images/img_delete_02.svg" alt="Remove" />
                </button>
                
                <div className="item-info">
                  <div className="item-main">
                    <div className="item-name">
                      {item.isExtra && <span className="extra-badge">+</span>}
                      {item.isWithout && <span className="without-badge">-</span>}
                      {item.quantity} X {item.product.nameArabic}
                      {item.product.hasMultiplePrices && (
                        <span className="item-size-inline"> - {item.selectedPrice.nameArabic}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* عرض Sub-items */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className="sub-items-container">
                      {item.subItems.map(subItem => renderSubItem(subItem, item.id))}
                    </div>
                  )}
                  
                  {/* عرض الخيارات القديمة (للتوافق مع النظام القديم) */}
                  {item.selectedOptions && item.selectedOptions.length > 0 && !item.subItems && (
                    <div className="item-options">
                      {item.selectedOptions.map((option, index) => (
                        <div key={index} className="option-detail">
                          <span className="option-text">
                            {option.quantity > 1 ? `${option.quantity}x ` : ''}
                            {option.itemName}
                            {option.extraPrice > 0 && ` (+${option.extraPrice})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="item-prices">
                <div className="item-price">{item.selectedPrice.price}</div>
                <div className={`item-total ${item.isWithout ? 'negative' : ''}`}>
                  {item.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-footer">
        <div className="summary-rows">
          <div className="summary-row">
            <span>Sub Total</span>
            <span>{orderSummary.subtotal.toFixed(2)} <small>EGP</small></span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span>{orderSummary.discount.toFixed(2)} <small>EGP</small></span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{orderSummary.tax.toFixed(2)} <small>EGP</small></span>
          </div>
          <div className="summary-row">
            <span>Service</span>
            <span>{orderSummary.service.toFixed(2)} <small>EGP</small></span>
          </div>
        </div>

        <div className="total-row">
          <span>Total</span>
          <span>{orderSummary.total.toFixed(2)} <small>EGP</small></span>
        </div>

        <div className="action-buttons">
          <button className="action-button send">
            <img src="/images/img_tabler_send.svg" alt="Send" />
            <span>Send</span>
          </button>
          <button className="action-button print">
            <img src="/images/img_printer.svg" alt="Print" />
            <span>Print</span>
          </button>
          <button className="action-button pay">
            <img src="/images/img_payment_02.svg" alt="Pay" />
            <span>Pay</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
