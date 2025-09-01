// src/Pages/pos/newSales/components/OrderItemDetailsPopup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderItem } from '../types/PosSystem';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from '../styles/OrderItemDetailsPopup.module.css';

interface OrderItemDetailsPopupProps {
  orderItem: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateItem: (itemId: string, updates: {
    quantity?: number;
    notes?: string;
    discountPercentage?: number;
    discountAmount?: number;
  }) => void;
  onRemoveItem: (itemId: string) => void;
}

const OrderItemDetailsPopup: React.FC<OrderItemDetailsPopupProps> = ({
  orderItem,
  isOpen,
  onClose,
  onUpdateItem
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // States مؤقتة للتحكم في التحديث
  const [tempDiscountPercentage, setTempDiscountPercentage] = useState('0');
  const [tempDiscountAmount, setTempDiscountAmount] = useState('0');
  
  // Refs للـ inputs
  const percentageInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (orderItem) {
      setQuantity(orderItem.quantity);
      setNotes(orderItem.notes || '');
      const currentDiscount = orderItem.discountAmount || 0;
      const baseTotal = orderItem.selectedPrice.price * orderItem.quantity;
      const currentDiscountPercentage = baseTotal > 0 ? (currentDiscount / baseTotal) * 100 : 0;
      setDiscountAmount(currentDiscount);
      setDiscountPercentage(currentDiscountPercentage);
      setTempDiscountAmount(currentDiscount.toFixed(2));
      setTempDiscountPercentage(currentDiscountPercentage.toFixed(1));
    }
  }, [orderItem]);

  if (!isOpen || !orderItem) return null;

  const unitPrice = orderItem.selectedPrice.price;
  const subItemsTotal = orderItem.subItems?.reduce((sum, item) => sum + item.price, 0) || 0;
  const baseTotal = (unitPrice * quantity) + subItemsTotal;
  const finalTotal = baseTotal - discountAmount;

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
    
    const newBaseTotal = (unitPrice * newQuantity) + subItemsTotal;
    const newDiscountAmount = (newBaseTotal * discountPercentage) / 100;
    setDiscountAmount(newDiscountAmount);
    setTempDiscountAmount(newDiscountAmount.toFixed(2));
  };

  // معالج تغيير نسبة الخصم
  const handleDiscountPercentageChange = (value: number) => {
    const percentage = Math.max(0, Math.min(100, value));
    setDiscountPercentage(percentage);
    const newDiscountAmount = (baseTotal * percentage) / 100;
    setDiscountAmount(newDiscountAmount);
    setTempDiscountAmount(newDiscountAmount.toFixed(2));
  };

  // معالج تغيير قيمة الخصم
  const handleDiscountAmountChange = (value: number) => {
    const amount = Math.max(0, Math.min(baseTotal, value));
    setDiscountAmount(amount);
    const newDiscountPercentage = baseTotal > 0 ? (amount / baseTotal) * 100 : 0;
    setDiscountPercentage(newDiscountPercentage);
    setTempDiscountPercentage(newDiscountPercentage.toFixed(1));
  };

  // معالج Focus للنسبة المئوية
  const handlePercentageFocus = () => {
    if (percentageInputRef.current) {
      percentageInputRef.current.select();
    }
  };

  // معالج Focus لقيمة الخصم
  const handleAmountFocus = () => {
    if (amountInputRef.current) {
      amountInputRef.current.select();
    }
  };

  // معالج Blur للنسبة المئوية
  const handlePercentageBlur = () => {
    const value = parseFloat(tempDiscountPercentage) || 0;
    handleDiscountPercentageChange(value);
  };

  // معالج Blur لقيمة الخصم
  const handleAmountBlur = () => {
    const value = parseFloat(tempDiscountAmount) || 0;
    handleDiscountAmountChange(value);
  };

  // معالج Enter للنسبة المئوية
  const handlePercentageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const value = parseFloat(tempDiscountPercentage) || 0;
      handleDiscountPercentageChange(value);
      percentageInputRef.current?.blur();
    }
  };

  // معالج Enter لقيمة الخصم
  const handleAmountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const value = parseFloat(tempDiscountAmount) || 0;
      handleDiscountAmountChange(value);
      amountInputRef.current?.blur();
    }
  };

  const handleConfirm = () => {
    onUpdateItem(orderItem.id, {
      quantity,
      notes,
      discountPercentage,
      discountAmount
    });
    onClose();
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.orderItemDetails}>
        
        {/* سطر واحد فقط: اسم المنتج + السعر + الكمية + الإجمالي */}
        <div className={styles.mainRow}>
          {/* اسم المنتج والسعر على اليمين */}
          <div className={styles.productInfo}>
            <span className={styles.productName}>{orderItem.product.nameArabic}</span>
            {orderItem.product.hasMultiplePrices && (
              <span className={styles.productSize}> - {orderItem.selectedPrice.nameArabic}</span>
            )}
            <span className={styles.unitPrice}>{unitPrice} {t("pos.newSales.products.currency")}</span>
          </div>

          {/* الكمية في النص */}
          <div className={styles.quantityControls}>
            <button
              className={styles.quantityBtn}
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon />
            </button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button
              className={styles.quantityBtn}
              onClick={() => handleQuantityChange(1)}
            >
              <AddIcon />
            </button>
          </div>
          
          {/* الإجمالي على الشمال */}
          <div className={styles.totalDisplay}>
            <span className={styles.totalAmount}>{finalTotal.toFixed(2)} {t("pos.newSales.products.currency")}</span>
          </div>
        </div>

        {/* حقل الملاحظات */}
        <div className={styles.notesSection}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("pos.newSales.orderSummary.notesPlaceholder")}
            className={styles.notesInput}
            rows={3}
          />
        </div>

        {/* قسم الخصم */}
        <div className={styles.discountSection}>
          <div className={styles.discountInputs}>
            <div className={styles.discountField}>
              <label>{t("pos.newSales.orderSummary.discountPercentage")}</label>
              <input
                ref={percentageInputRef}
                type="number"
                value={tempDiscountPercentage}
                onChange={(e) => setTempDiscountPercentage(e.target.value)}
                onFocus={handlePercentageFocus}
                onBlur={handlePercentageBlur}
                onKeyDown={handlePercentageKeyDown}
                min="0"
                max="100"
                step="0.1"
                className={styles.discountInput}
              />
            </div>
            
            <div className={styles.discountField}>
              <label>{t("pos.newSales.orderSummary.discountAmount")}</label>
              <input
                ref={amountInputRef}
                type="number"
                value={tempDiscountAmount}
                onChange={(e) => setTempDiscountAmount(e.target.value)}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                onKeyDown={handleAmountKeyDown}
                min="0"
                max={baseTotal}
                step="0.01"
                className={styles.discountInput}
              />
            </div>
          </div>
        </div>

        {/* أزرار التأكيد والإلغاء */}
        <div className={styles.actionButtons}>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            {t("pos.newSales.actions.confirm")}
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("pos.newSales.actions.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItemDetailsPopup;
