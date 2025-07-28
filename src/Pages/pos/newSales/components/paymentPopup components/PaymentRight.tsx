// ✅ Final PaymentRight.tsx matching Figma design with Finish button and 2-column layout
import React, { useState } from 'react';
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
}

const PaymentRight: React.FC<PaymentRightProps> = ({
  availablePaymentMethods = ['كاش', 'بطاقة ائتمان'],
  selectedPayments,
  onPaymentMethodAdd,
  onPaymentMethodRemove,
  onFinishPayment,
  currentAmount
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('كاش');

  const handleSelect = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodAdd(method, currentAmount);
  };

  return (
    <div className={styles.container}>
            <button className={styles.finishBtn} onClick={onFinishPayment}>
        إنهاء
      </button>
      <div className={styles.methodList}>
        {availablePaymentMethods.map((method) => (
          <button
            key={method}
            className={`${styles.methodBtn} ${selectedMethod === method ? styles.active : ''}`}
            onClick={() => handleSelect(method)}
          >
            <span className={styles.methodAmount}>{currentAmount.toFixed(2)}</span>
            <span className={styles.methodType}>{method}</span>
            {selectedMethod === method && <span className={styles.check}>✓</span>}
          </button>
        ))}
      </div>


    </div>
  );
};

export default PaymentRight;