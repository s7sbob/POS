// src/Pages/pos/newSales/components/paymentPopup components/PaymentRight.tsx
import React from 'react';
import styles from './styles/PaymentRight.module.css';

interface PaymentMethodData {
  method: string;
  amount: number;
  isSelected: boolean;
}

interface PaymentRightProps {
  availablePaymentMethods: string[];
  selectedPayments: PaymentMethodData[];
  selectedPaymentMethod: string | null;
  onPaymentMethodSelect: (method: string) => void;
  onPaymentMethodToggle: (method: string) => void;
  onFinishPayment: () => void;
  canFinish: boolean;
  totalPaidAllMethods: number;
  totalAmount: number; // إضافة قيمة الأوردر لحساب المساهمة الفعلية
  nonCashTotal: number; // إضافة مجموع طرق الدفع غير الكاش
}

const PaymentRight: React.FC<PaymentRightProps> = ({
  availablePaymentMethods = [],
  selectedPayments,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onPaymentMethodToggle,
  onFinishPayment,
  canFinish,
  totalPaidAllMethods,
  totalAmount,
  nonCashTotal
}) => {
  const getPaymentData = (methodName: string) => {
    return selectedPayments.find(payment => payment.method === methodName);
  };

  // دالة لحساب المبلغ الفعلي المساهم في الأوردر لكل طريقة دفع
const getActualContributionAmount = (method: string, amount: number) => {
  const isCash = method.toLowerCase().includes('كاش') || 
                 method.toLowerCase().includes('cash');
  
  if (!isCash) {
    // طرق الدفع غير الكاش تظهر كما هي
    return amount;
  } else {
    // للكاش: اعرض المبلغ الفعلي المساهم في الأوردر فقط
    const actualCashContribution = Math.max(0, totalAmount - nonCashTotal);
    return Math.min(amount, actualCashContribution);
  }
};

  const handleCardClick = (method: string) => {
    const paymentData = getPaymentData(method);
    const isCurrentlyActive = paymentData?.isSelected || false;
    
    if (!isCurrentlyActive) {
      onPaymentMethodToggle(method);
      onPaymentMethodSelect(method);
    } else {
      onPaymentMethodSelect(method);
    }
  };

  const handleCheckboxChange = (method: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onPaymentMethodToggle(method);
    
    const paymentData = getPaymentData(method);
    const willBeSelected = !(paymentData?.isSelected || false);
    
    if (!willBeSelected && selectedPaymentMethod === method) {
      const otherActiveMethod = selectedPayments.find(p => 
        p.method !== method && p.isSelected && p.amount > 0
      );
      if (otherActiveMethod) {
        onPaymentMethodSelect(otherActiveMethod.method);
      } else {
        const cashMethod = selectedPayments.find(p => 
          (p.method.toLowerCase().includes('كاش') || p.method.toLowerCase().includes('cash')) && 
          p.method !== method &&
          p.isSelected
        );
        if (cashMethod) {
          onPaymentMethodSelect(cashMethod.method);
        }
      }
    }
  };

  const isLongName = (name: string) => name.length > 15;

  if (availablePaymentMethods.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          fontFamily: 'Cairo, sans-serif',
          color: '#666'
        }}>
          جاري تحميل طرق الدفع...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.finishBtn} ${!canFinish ? styles.disabled : ''}`}
        onClick={onFinishPayment}
        disabled={!canFinish}
      >
        إنهاء الدفع
      </button>
      
      <div className={styles.methodsList}>
        {availablePaymentMethods.map((method) => {
          const paymentData = getPaymentData(method);
          const amount = paymentData?.amount || 0;
          const isActive = paymentData?.isSelected || false;
          const isSelectedForEdit = selectedPaymentMethod === method;
          const longName = isLongName(method);
          
          // حساب المبلغ الفعلي المساهم في الأوردر
          const actualContribution = getActualContributionAmount(method, amount);
          const hasAmount = actualContribution > 0;
          
          // التحقق إذا كان كاش وله مبلغ أكبر من المساهمة (أي له فكة)
          const isCash = method.toLowerCase().includes('كاش') || 
                         method.toLowerCase().includes('cash');
          const hasChange = isCash && amount > actualContribution;
          
          return (
            <div 
              key={method} 
              className={`${styles.methodItem} ${isActive ? styles.active : ''} ${isSelectedForEdit ? styles.selectedForEdit : ''} ${hasAmount ? styles.hasAmount : ''} ${longName ? styles.longName : ''}`}
              onClick={() => handleCardClick(method)}
            >
              <div className={styles.methodHeader}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => handleCheckboxChange(method, e)}
                  className={styles.methodCheckbox}
                />
                <span className={styles.methodName}>{method}</span>
              </div>
              
{hasAmount && (
  <div className={styles.methodAmount}>
    {actualContribution.toFixed(2)} جنيه
  </div>
)}
              
              {isSelectedForEdit && (
                <div className={styles.editIndicator}>
                  يتم التعديل عليها الآن
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.paymentSummary}>
        {/* <div className={styles.summaryRow}>
          <span>قيمة الأوردر:</span>
          <span className={styles.orderValue}>
            {totalAmount.toFixed(2)} جنيه
          </span>
        </div>
        
        <div className={styles.summaryRow}>
          <span>إجمالي المدفوع:</span>
          <span className={styles.totalPaid}>
            {totalPaidAllMethods.toFixed(2)} جنيه
          </span>
        </div> */}
        
        <div className={styles.summaryRow}>
          <span>طرق الدفع المستخدمة:</span>
          <span className={styles.methodsCount}>
            {selectedPayments.filter(p => p.isSelected && getActualContributionAmount(p.method, p.amount) > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentRight;
