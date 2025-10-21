// src/Pages/pos/newSales/components/HeaderDiscountPopup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/DiscountPopup.module.css';

interface HeaderDiscountPopupProps {
  /**
   * Determines whether the popup is visible. When false the component
   * returns null and does not render anything into the DOM.
   */
  isOpen: boolean;
  /**
   * Callback invoked when the user clicks the close button or cancels
   * the operation. The parent component should pass a function that
   * toggles the `isOpen` flag back to false.
   */
  onClose: () => void;
  /**
   * Called when the user confirms the discount values. The callback
   * receives both the percentage and the absolute amount. The amount
   * will always be capped between 0 and the subtotal. The percentage
   * will always be capped between 0 and 100.
   */
  onApply: (discountPercentage: number, discountAmount: number) => void;
  /**
   * The current subtotal of the order before any header discount is
   * applied. Used to cap the discount amount and to calculate the
   * percentage when the user enters an absolute value.
   */
  subtotal: number;
  /**
   * Optional initial percentage to prefill the input when editing an
   * existing invoice. Default is 0.
   */
  initialPercentage?: number;
  /**
   * Optional initial amount to prefill the input when editing an
   * existing invoice. Default is 0.
   */
  initialAmount?: number;
}

/**
 * Popup component that allows the user to specify a discount on the
 * entire invoice.  It presents two inputs – one for percentage and
 * another for absolute value – and keeps them in sync.  The user can
 * also view the order subtotal and the recalculated total after the
 * discount.  Once confirmed, the entered values are propagated back to
 * the parent component via the `onApply` callback.
 */
const HeaderDiscountPopup: React.FC<HeaderDiscountPopupProps> = ({
  isOpen,
  onClose,
  onApply,
  subtotal,
  initialPercentage = 0,
  initialAmount = 0
}) => {
  const { t } = useTranslation();
  const [percentage, setPercentage] = useState(initialPercentage);
  const [amount, setAmount] = useState(initialAmount);
  const [tempPercentage, setTempPercentage] = useState(initialPercentage.toString());
  const [tempAmount, setTempAmount] = useState(initialAmount.toFixed(2));
  const percentageRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Reset internal state whenever the popup is reopened or when initial
  // values change.  This ensures editing an existing invoice starts
  // from the persisted discount values instead of the last used ones.
  useEffect(() => {
    if (isOpen) {
      setPercentage(initialPercentage);
      setAmount(initialAmount);
      setTempPercentage(initialPercentage.toString());
      setTempAmount(initialAmount.toFixed(2));
    }
  }, [isOpen, initialPercentage, initialAmount]);

  // When the percentage changes the amount must be recalculated.  The
  // percentage value is clamped between 0 and 100.  The computed
  // amount is clamped at the subtotal in case rounding errors occur.
  const computeFromPercentage = (val: number) => {
    const perc = Math.max(0, Math.min(100, val));
    const amt = (subtotal * perc) / 100;
    // Ensure amount never exceeds subtotal due to floating point
    const clampedAmt = Math.min(subtotal, amt);
    setPercentage(perc);
    setAmount(clampedAmt);
    setTempAmount(clampedAmt.toFixed(2));
  };

  // When the amount changes the percentage must be recalculated.  The
  // amount value is clamped between 0 and the subtotal.  The computed
  // percentage is capped at 100 to avoid invalid values when subtotal
  // is zero.
  const computeFromAmount = (val: number) => {
    const amt = Math.max(0, Math.min(subtotal, val));
    const percVal = subtotal > 0 ? (amt / subtotal) * 100 : 0;
    const clampedPerc = Math.min(100, percVal);
    setAmount(amt);
    setPercentage(clampedPerc);
    setTempPercentage(clampedPerc.toFixed(1));
  };

  const handlePercentageBlur = () => {
    const val = parseFloat(tempPercentage) || 0;
    computeFromPercentage(val);
  };

  const handleAmountBlur = () => {
    const val = parseFloat(tempAmount) || 0;
    computeFromAmount(val);
  };

  // Confirm the discount and propagate values to parent.  Also close
  // the popup.  The parent component is responsible for storing the
  // discount state and recomputing the order summary.
  const handleConfirm = () => {
    onApply(percentage, amount);
    onClose();
  };

  // Do not render anything if the popup is closed; this avoids
  // unnecessary DOM nodes that may interfere with keyboard events.
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('pos.newSales.discount.popupTitle') || 'خصم الفاتورة'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          {/* عرض إجمالي الطلب قبل الخصم */}
          <div className={styles.orderInfo}>
            <div className={styles.totalAmount}>
              <span className={styles.label}>
                {t('pos.newSales.discount.orderTotal') || 'إجمالي الطلب'}
              </span>
              <span className={styles.amount}>
                {subtotal.toFixed(2)} {t('pos.newSales.products.currency') || 'EGP'}
              </span>
            </div>
          </div>
          {/* إدخال نسبة الخصم */}
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>
              {t('pos.newSales.discount.percentage') || 'نسبة الخصم (%)'}
            </label>
            <input
              type="number"
              ref={percentageRef}
              className={styles.discountInput}
              value={tempPercentage}
              min="0"
              max="100"
              step="0.1"
              onChange={(e) => setTempPercentage(e.target.value)}
              onBlur={handlePercentageBlur}
            />
          </div>
          {/* إدخال قيمة الخصم */}
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>
              {t('pos.newSales.discount.amount') || 'قيمة الخصم'}
            </label>
            <input
              type="number"
              ref={amountRef}
              className={styles.discountInput}
              value={tempAmount}
              min="0"
              max={subtotal.toFixed(2)}
              step="0.01"
              onChange={(e) => setTempAmount(e.target.value)}
              onBlur={handleAmountBlur}
            />
          </div>
          {/* عرض الإجمالي بعد الخصم */}
          <div className={styles.summaryRow}>
            <span className={styles.label}>
              {t('pos.newSales.discount.totalAfter') || 'الإجمالي بعد الخصم'}
            </span>
            <span className={styles.amount}>
              {(subtotal - amount).toFixed(2)} {t('pos.newSales.products.currency') || 'EGP'}
            </span>
          </div>
          {/* أزرار الإجراءات */}
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              {t('pos.newSales.discount.cancel') || 'إلغاء'}
            </button>
            <button className={styles.confirmBtn} onClick={handleConfirm}>
              {t('pos.newSales.discount.apply') || 'تطبيق'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDiscountPopup;