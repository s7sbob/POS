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
}

const PaymentRight: React.FC<PaymentRightProps> = ({
  availablePaymentMethods = [],
  selectedPayments,
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onPaymentMethodToggle,
  onFinishPayment,
  canFinish}) => {
  const getPaymentData = (methodName: string) => {
    return selectedPayments.find(payment => payment.method === methodName);
  };

  const handleCardClick = (method: string) => {
    const paymentData = getPaymentData(method);
    const isCurrentlyActive = paymentData?.isSelected || false;
    
    if (!isCurrentlyActive) {
      // إذا لم تكن مفعلة، قم بتفعيلها أولاً ثم اختيارها للتعديل
      onPaymentMethodToggle(method);
      onPaymentMethodSelect(method);
    } else {
      // إذا كانت مفعلة، اختارها للتعديل فقط
      onPaymentMethodSelect(method);
    }
  };

  const handleCheckboxChange = (method: string, event: React.ChangeEvent<HTMLInputElement>) => {
    // منع تشغيل click الخاص بالكارد
    event.stopPropagation();
    
    // تبديل حالة التفعيل فقط
    onPaymentMethodToggle(method);
    
    const paymentData = getPaymentData(method);
    const willBeSelected = !(paymentData?.isSelected || false);
    
    if (!willBeSelected && selectedPaymentMethod === method) {
      // إذا تم إلغاء تفعيل الطريقة المحددة حالياً للتعديل، اختر طريقة أخرى
      const otherActiveMethod = selectedPayments.find(p => 
        p.method !== method && p.isSelected && p.amount > 0
      );
      if (otherActiveMethod) {
        onPaymentMethodSelect(otherActiveMethod.method);
      } else {
        // البحث عن الكاش كخيار احتياطي
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

  // تحديد إذا كان اسم طريقة الدفع طويل
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
      {/* زر الإنهاء في الأعلى */}
      <button 
        className={`${styles.finishBtn} ${!canFinish ? styles.disabled : ''}`}
        onClick={onFinishPayment}
        disabled={!canFinish}
      >
        إنهاء الدفع
      </button>
      
      {/* طرق الدفع في عمودين */}
      <div className={styles.methodsList}>
        {availablePaymentMethods.map((method) => {
          const paymentData = getPaymentData(method);
          const amount = paymentData?.amount || 0;
          const isActive = paymentData?.isSelected || false;
          const isSelectedForEdit = selectedPaymentMethod === method;
          const hasAmount = amount > 0;
          const longName = isLongName(method);
          
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
                  {amount.toFixed(2)} جنيه
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

      {/* معلومات الدفع */}
      <div className={styles.paymentSummary}>
        {/* <div className={styles.summaryRow}>
          <span>إجمالي المدفوع:</span>
          <span className={styles.totalPaid}>
            {totalPaidAllMethods.toFixed(2)} جنيه
          </span>
        </div> */}
        
        <div className={styles.summaryRow}>
          <span>طرق الدفع المستخدمة:</span>
          <span className={styles.methodsCount}>
            {selectedPayments.filter(p => p.isSelected && p.amount > 0).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentRight;
