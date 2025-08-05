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
  totalAmount: number;
  nonCashTotal: number;
  onShowWarning?: (message: string) => void;
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
  nonCashTotal,
  onShowWarning
}) => {
  const getPaymentData = (methodName: string) => {
    return selectedPayments.find(payment => payment.method === methodName);
  };

  // دالة لحساب المبلغ الفعلي المساهم في الأوردر لكل طريقة دفع
  const getActualContributionAmount = (method: string, amount: number) => {
    const isCash = method.toLowerCase().includes('كاش') || 
                   method.toLowerCase().includes('cash');
    
    if (!isCash) {
      // طرق الدفع غير الكاش: عرض المبلغ الفعلي فقط
      return Math.min(amount, totalAmount);
    } else {
      // للكاش: عرض المساهمة الفعلية في الأوردر فقط
      const actualCashContribution = Math.max(0, totalAmount - nonCashTotal);
      return Math.min(amount, actualCashContribution);
    }
  };

  // دالة النقر على الكارد مع التحقق من الحد الأقصى
  const handleCardClick = (method: string) => {
    const paymentData = getPaymentData(method);
    const isCurrentlyActive = paymentData?.isSelected || false;
    const isCash = method.toLowerCase().includes('كاش') || 
                   method.toLowerCase().includes('cash');
    
    if (!isCurrentlyActive && !isCash) {
      // تحقق من عدد الطرق النشطة غير النقدية
      const activeNonCashCount = selectedPayments.filter(p => {
        const isNonCash = !(p.method.toLowerCase().includes('كاش') || 
                           p.method.toLowerCase().includes('cash'));
        return isNonCash && p.isSelected && p.amount > 0;
      }).length;
      
      if (activeNonCashCount >= 2) {
        onShowWarning?.('لا يمكن استخدام أكثر من وسيلتي دفع غير نقدية');
        return;
      }
    }
    
    if (!isCurrentlyActive) {
      onPaymentMethodToggle(method);
      onPaymentMethodSelect(method);
    } else {
      onPaymentMethodSelect(method);
    }
  };

  // دالة تغيير الـ checkbox
  const handleCheckboxChange = (method: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    
    const isCash = method.toLowerCase().includes('كاش') || 
                   method.toLowerCase().includes('cash');
    const paymentData = getPaymentData(method);
    const isCurrentlyActive = paymentData?.isSelected || false;
    
    if (!isCurrentlyActive && !isCash) {
      // تحقق من عدد الطرق النشطة غير النقدية
      const activeNonCashCount = selectedPayments.filter(p => {
        const isNonCash = !(p.method.toLowerCase().includes('كاش') || 
                           p.method.toLowerCase().includes('cash'));
        return isNonCash && p.isSelected && p.amount > 0;
      }).length;
      
      if (activeNonCashCount >= 2) {
        onShowWarning?.('لا يمكن استخدام أكثر من وسيلتي دفع غير نقدية');
        return;
      }
    }
    
    onPaymentMethodToggle(method);
    
    const willBeSelected = !isCurrentlyActive;
    
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
        <div className={styles.summaryRow}>
          <span>طرق الدفع المستخدمة:</span>
          <span className={styles.methodsCount}>
            {selectedPayments.filter(p => p.isSelected && getActualContributionAmount(p.method, p.amount) > 0).length}
          </span>
        </div>
        {/* <div className={styles.summaryRow}>
          <span className={styles.limitText}>
            الحد الأقصى: وسيلتان غير نقدية + كاش
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentRight;
