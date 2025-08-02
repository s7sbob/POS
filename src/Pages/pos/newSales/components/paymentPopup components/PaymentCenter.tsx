// src/Pages/pos/newSales/components/paymentPopup components/PaymentCenter.tsx
import React from 'react';
import styles from './styles/PaymentCenter.module.css';

interface PaymentCenterProps {
  totalAmount: number;
  paidAmount: string;
  cashAmount: number; // إضافة مبلغ الكاش منفصل
  remainingForCustomer: number;
  selectedPaymentMethod: string | null;
  onAmountChange: (amount: string) => void;
  onQuickAmountSelect: (amount: number) => void;
}

const PaymentCenter: React.FC<PaymentCenterProps> = ({
  totalAmount,
  paidAmount,
  cashAmount, // مبلغ الكاش فقط
  remainingForCustomer,
  selectedPaymentMethod,
  onAmountChange,
  onQuickAmountSelect
}) => {
  // التحقق إذا كانت طريقة الدفع المختارة هي الكاش
  const isCashSelected = selectedPaymentMethod?.toLowerCase().includes('كاش') || 
                        selectedPaymentMethod?.toLowerCase().includes('cash');

  const handleKeypadClick = (value: string) => {
    if (value === 'c') {
      onAmountChange('0');
    } else if (value === 'erase') {
      const newValue = paidAmount.slice(0, -1);
      onAmountChange(newValue || '0');
    } else if (value === '.') {
      // إذا كان المبلغ 0 أو 0.00، ابدأ بـ 0.
      if (paidAmount === '0' || paidAmount === '0.00' || !paidAmount.includes('.')) {
        onAmountChange(paidAmount === '0' || paidAmount === '0.00' ? '0.' : paidAmount + '.');
      }
    } else {
      // إذا كان المبلغ الحالي هو نفس المبلغ الافتراضي، ابدأ من الصفر
      const currentPaymentAmount = parseFloat(paidAmount) || 0;
      const isDefaultAmount = !isCashSelected ? currentPaymentAmount === 0 : 
                             currentPaymentAmount === Math.max(0, totalAmount - getCashlessTotal());
      
      if (isDefaultAmount || paidAmount === '0' || paidAmount === '0.00') {
        onAmountChange(value);
      } else {
        onAmountChange(paidAmount + value);
      }
    }
  };

  // دالة للحصول على مجموع طرق الدفع غير الكاش (مؤقتة للاستخدام في المنطق)
  const getCashlessTotal = () => {
    // هذه دالة مؤقتة، سيتم تمرير القيمة الفعلية من الـ parent
    return 0;
  };

  const handleQuickAmountClick = (amount: number) => {
    onQuickAmountSelect(amount);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.balanceTitle}>
          إجمالي الفاتورة: {totalAmount.toFixed(2)} جنيه
        </h2>
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.fieldBlock}>
          <label className={styles.label}>المبلغ المتبقي (كاش)</label>
          <div className={styles.remainingBox}>
            {remainingForCustomer.toFixed(2)}
          </div>
        </div>

        <div className={styles.fieldBlock}>
          <label className={styles.label}>المدفوع كاش</label>
          <div className={styles.cashPaidBox}>
            {cashAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className={styles.quickButtons}>
        {[5, 10, 15, 20].map(val => (
          <button 
            key={val} 
            className={`${styles.quickBtn} ${!selectedPaymentMethod ? styles.disabled : ''}`}
            onClick={() => handleQuickAmountClick(val)}
            disabled={!selectedPaymentMethod}
          >
            {val} EGP
          </button>
        ))}
      </div>

      <div className={styles.keypad}>
        {[
          ['1','2','3','50'],
          ['4','5','6','100'],
          ['7','8','9','200'],
          ['c','0','.','erase']
        ].map((row, rowIndex) => (
          <div key={rowIndex} className={styles.keypadRow}>
            {row.map(key => (
              <button
                key={key}
                className={`${styles.keypadBtn} ${['50','100','200'].includes(key) ? styles.gray : ''} ${!selectedPaymentMethod ? styles.disabled : ''}`}
                onClick={() => selectedPaymentMethod && (key === 'erase' ? handleKeypadClick('erase') : handleKeypadClick(key))}
                disabled={!selectedPaymentMethod}
              >
                {key === 'erase' ? '×' : key === 'c' ? 'C' : key + (['50','100','200'].includes(key) ? ' EGP' : '')}
              </button>
            ))}
          </div>
        ))}
      </div>

      {!selectedPaymentMethod && (
        <div className={styles.noSelectionMessage}>
          اختر طريقة دفع من القائمة اليمين لبدء الإدخال
        </div>
      )}

      {/* {selectedPaymentMethod && (
        <div className={styles.selectedMethodInfo}>
          <span className={styles.selectedMethodName}>
            المبلغ المدفوع بـ {selectedPaymentMethod}: {paidAmount} جنيه
          </span>
          {!isCashSelected && (
            <span className={styles.limitWarning}>
              الحد الأقصى: {totalAmount.toFixed(2)} جنيه
            </span>
          )}
        </div>
      )} */}
    </div>
  );
};

export default PaymentCenter;
