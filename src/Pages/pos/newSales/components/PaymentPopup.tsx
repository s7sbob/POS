import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/PaymentPopup.module.css';
import PaymentLeft from './paymentPopup components/PaymentLeft';
import PaymentCenter from './paymentPopup components/PaymentCenter';
import PaymentRight from './paymentPopup components/PaymentRight';

interface PaymentMethod {
  id: string;
  name: string;
  amount: number;
}

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: any;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveOrderItem: (itemId: string) => void;
  onRemoveSubItem: (orderItemId: string, subItemId: string) => void;
  selectedOrderItemId: string | null;
  onOrderItemSelect: (itemId: string) => void;
  onOrderItemDoubleClick?: (item: any) => void;
  selectedCustomer: any;
  selectedAddress: any;
  onCustomerSelect: (customer: any, address: any) => void;
  orderType: string;
  onDeliveryChargeChange: (charge: number) => void;
  onPaymentComplete: (payments: PaymentMethod[]) => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  orderSummary,
  customerName,
  onCustomerNameChange,
  onRemoveOrderItem,
  onRemoveSubItem,
  selectedOrderItemId,
  onOrderItemSelect,
  onOrderItemDoubleClick,
  selectedCustomer,
  selectedAddress,
  onCustomerSelect,
  orderType,
  onDeliveryChargeChange,
  onPaymentComplete
}) => {
  // States
  const [paidAmount, setPaidAmount] = useState('200.00');
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([]);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const handleGoBack = () => {
  onClose();
};

  // Calculations
  const totalAmount = orderSummary?.total || 200;
  const remainingAmount = totalAmount - parseFloat(paidAmount || '0');
  const currentInputAmount = parseFloat(paidAmount || '0');

  // إغلاق عند الضغط خارج النافذة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // إغلاق بـ ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Handlers for center section
  const handleAmountChange = (amount: string) => {
    setPaidAmount(amount);
  };

  const handleQuickAmountSelect = (amount: number) => {
    setPaidAmount(amount.toFixed(2));
  };

  // Handlers for right section
  const handlePaymentMethodAdd = (method: string, amount: number) => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      name: method,
      amount: amount
    };
    setSelectedPayments(prev => [...prev, newPayment]);
  };

  const handlePaymentMethodRemove = (id: string) => {
    setSelectedPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const handleFinishPayment = () => {
    if (selectedPayments.length > 0) {
      onPaymentComplete(selectedPayments);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} ref={overlayRef}>
      <div className={styles.popup}>
        
        {/* Header مع اللوجو وزر الإغلاق */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/images/logo.png" alt="Foodify" />
          </div>
          <h2 className={styles.title}>تأكيد الدفع</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* المحتوى الرئيسي - 3 أجزاء متساوية */}
        <div className={styles.content}>
          
          {/* الجانب الأيسر - OrderSummary */}
          <div className={styles.leftSection}>
 <PaymentLeft
              orderSummary={orderSummary}
              selectedCustomer={selectedCustomer}
              selectedAddress={selectedAddress}
              orderType={orderType}
               deliveryCharge={0}  />
          </div>

          {/* الوسط - المبالغ والكيبورد */}
          <div className={styles.centerSection}>
            <PaymentCenter
              totalAmount={totalAmount}
              paidAmount={paidAmount}
              remainingAmount={remainingAmount}
              onAmountChange={handleAmountChange}
              onQuickAmountSelect={handleQuickAmountSelect}
            />
          </div>

          {/* الجانب الأيمن - طرق الدفع */}
          <div className={styles.rightSection}>
            <PaymentRight
              availablePaymentMethods={['كاش', 'بطاقة ائتمان', 'فيزا', 'والت', 'خليط']}
              selectedPayments={selectedPayments}
              onPaymentMethodAdd={handlePaymentMethodAdd}
              onPaymentMethodRemove={handlePaymentMethodRemove}
              onFinishPayment={handleFinishPayment}
              currentAmount={currentInputAmount}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
