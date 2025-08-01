import React from 'react';
import styles from './styles/PaymentRight.module.css';

interface PaymentMethod {
  id: string;
  name: string;
  amount: number;
}

interface PaymentRightProps {
  availablePaymentMethods: string[];
  selectedPayments: PaymentMethod[];
  onPaymentMethodAdd: (method: string, amount: number) => void;
  onPaymentMethodRemove: (id: string) => void;
  onFinishPayment: () => void;
  currentAmount: number;
  remainingAmount: number;
  onAmountReset: () => void; // إضافة function لتصفير المبلغ
}

const PaymentRight: React.FC<PaymentRightProps> = ({
  availablePaymentMethods = [],
  selectedPayments,
  onPaymentMethodAdd,
  onPaymentMethodRemove,
  onFinishPayment,
  currentAmount,
  remainingAmount,
  onAmountReset
}) => {
  const handleSelect = (method: string) => {
    // التأكد من وجود مبلغ قبل الإضافة
    if (currentAmount > 0) {
      onPaymentMethodAdd(method, currentAmount);
      onAmountReset(); // تصفير المبلغ بعد الإضافة
    }
  };

  // البحث عن طريقة دفع موجودة لتحديث مبلغها
  const getPaymentMethodTotal = (methodName: string) => {
    return selectedPayments
      .filter(payment => payment.name === methodName)
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  // التحقق من إمكانية إنهاء الدفع
  const canFinish = selectedPayments.length > 0;

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
      <div className={styles.methodGrid}>
        {availablePaymentMethods.map((method) => {
          const totalForMethod = getPaymentMethodTotal(method);
          const hasPayment = totalForMethod > 0;
          
          return (
            <button
              key={method}
              className={`${styles.methodBtn} ${hasPayment ? styles.hasPayment : ''}`}
              onClick={() => handleSelect(method)}
              disabled={currentAmount <= 0} // تعطيل الزر إذا لم يكن هناك مبلغ
            >
              <div className={styles.methodContent}>
                <span className={styles.methodType}>{method}</span>
                {hasPayment && (
                  <span className={styles.methodAmount}>
                    {totalForMethod.toFixed(2)} جنيه
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* عرض ملخص المدفوعات المحددة */}
      {selectedPayments.length > 0 && (
        <div className={styles.selectedPayments}>
          <h4 className={styles.paymentsTitle}>المدفوعات المحددة:</h4>
          <div className={styles.paymentsList}>
            {selectedPayments.map((payment) => (
              <div key={payment.id} className={styles.selectedPayment}>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentMethod}>{payment.name}</span>
                  <span className={styles.paymentAmount}>{payment.amount.toFixed(2)} جنيه</span>
                </div>
                <button 
                  onClick={() => onPaymentMethodRemove(payment.id)}
                  className={styles.removeBtn}
                  title="حذف"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className={styles.totalPayments}>
            <strong>
              إجمالي المدفوع: {selectedPayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)} جنيه
            </strong>
          </div>
        </div>
      )}

      {/* عرض معلومات المبلغ المتبقي */}
      <div className={styles.paymentSummary}>
        <div className={styles.summaryRow}>
          <span>المتبقي للدفع:</span>
          <span className={styles.remainingAmount}>{remainingAmount.toFixed(2)} جنيه</span>
        </div>
        {currentAmount > 0 && (
          <div className={styles.summaryRow}>
            <span>المبلغ الحالي:</span>
            <span className={styles.currentAmount}>{currentAmount.toFixed(2)} جنيه</span>
          </div>
        )}
      </div>

      {/* رسالة توضيحية */}
      {currentAmount <= 0 && (
        <div className={styles.instructionMessage}>
          <p>اكتب المبلغ أولاً ثم اختر طريقة الدفع</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRight;
