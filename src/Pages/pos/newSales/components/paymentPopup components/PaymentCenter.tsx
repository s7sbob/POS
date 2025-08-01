// src/Pages/pos/newSales/components/paymentPopup components/PaymentCenter.tsx
import React from 'react';
import styles from './styles/PaymentCenter.module.css';

interface PaymentCenterProps {
  totalAmount: number;
  paidAmount: string;
  remainingAmount: number;
  changeAmount: number;
  totalPaidFromMethods: number;
  onAmountChange: (amount: string) => void;
  onQuickAmountSelect: (amount: number) => void;
}

const PaymentCenter: React.FC<PaymentCenterProps> = ({
  totalAmount,
  paidAmount,
  remainingAmount,
  changeAmount,
  totalPaidFromMethods,
  onAmountChange,
  onQuickAmountSelect
}) => {
  const handleKeypadClick = (value: string) => {
    if (value === 'c') {
      onAmountChange('0');
    } else if (value === 'erase') {
      const newValue = paidAmount.slice(0, -1);
      onAmountChange(newValue || '0');
    } else if (value === '.') {
      if (!paidAmount.includes('.')) {
        onAmountChange(paidAmount === '0' ? '0.' : paidAmount + '.');
      }
    } else {
      const newValue = paidAmount === '0' ? value : paidAmount + value;
      onAmountChange(newValue);
    }
  };

  // حساب إجمالي المدفوع (من الطرق + النقدي الحالي)
  const currentInputAmount = parseFloat(paidAmount) || 0;
  const totalPaidAmount = totalPaidFromMethods + currentInputAmount;
  
  // حساب الباقي للعميل (إذا كان المدفوع أكبر من المطلوب)
  const customerChange = Math.max(0, totalPaidAmount - totalAmount);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.balanceTitle}>
          إجمالي الفاتورة: {totalAmount.toFixed(2)} جنيه
        </h2>
      </div>

      {/* عرض المبلغ المدفوع من طرق أخرى */}
      {/* {totalPaidFromMethods > 0 && (
        <div className={styles.paidMethodsRow}>
          <div className={styles.paidMethodsInfo}>
            <span className={styles.paidMethodsLabel}>مدفوع بطرق أخرى:</span>
            <span className={styles.paidMethodsAmount}>{totalPaidFromMethods.toFixed(2)} جنيه</span>
          </div>
        </div>
      )} */}

      <div className={styles.fieldsRow}>
        <div className={styles.fieldBlock}>
          <label className={styles.label}>المبلغ المتبقي (كاش)</label>
          <div className={styles.remainingBox}>{remainingAmount.toFixed(2)}</div>
        </div>

        <div className={styles.fieldBlock}>
          <label className={styles.label}>المدفوع نقداً</label>
          <input 
            type="text" 
            readOnly 
            value={paidAmount} 
            className={styles.input} 
          />
        </div>
      </div>

      <div className={styles.quickButtons}>
        {[5, 10, 15, 20].map(val => (
          <button key={val} className={styles.quickBtn} onClick={() => onQuickAmountSelect(val)}>
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
                className={`${styles.keypadBtn} ${['50','100','200'].includes(key) ? styles.gray : ''}`}
                onClick={() => key === 'erase' ? handleKeypadClick('erase') : handleKeypadClick(key)}
              >
                {key === 'erase' ? '×' : key === 'c' ? 'C' : key + (['50','100','200'].includes(key) ? ' EGP' : '')}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* قسم الباقي للعميل - يظهر دائماً */}
      <div className={styles.changeSection}>
        {/* <div className={styles.changeHeader}>
          <div className={styles.changeSummary}>
            <span className={styles.summaryLabel}>إجمالي المدفوع:</span>
            <span className={styles.summaryValue}>{totalPaidAmount.toFixed(2)} جنيه</span>
          </div>
        </div> */}
        
        <div className={styles.changeDisplay}>
          <div className={styles.changeLabel}>الباقي للعميل</div>
          <div className={`${styles.changeAmount} ${customerChange > 0 ? styles.hasChange : styles.noChange}`}>
            {customerChange.toFixed(2)} جنيه
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCenter;
