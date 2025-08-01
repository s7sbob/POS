// src/Pages/pos/newSales/components/PaymentPopup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import PaymentLeft from './paymentPopup components/PaymentLeft';
import PaymentCenter from './paymentPopup components/PaymentCenter';
import PaymentRight from './paymentPopup components/PaymentRight';
import * as posPaymentMethodsApi from '../../../../utils/api/pagesApi/posPaymentMethodsApi';
import styles from '../styles/PaymentPopup.module.css';
import { usePosPaymentMethods } from '../hooks/usePosPaymentMethods';

interface PaymentMethod {
  id: string;
  name: string;
  amount: number;
}

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderSummary: OrderSummaryType;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  onRemoveOrderItem: (itemId: string) => void;
  onRemoveSubItem: (orderItemId: string, subItemId: string) => void;
  selectedOrderItemId: string | null;
  onOrderItemSelect: (itemId: string) => void;
  onOrderItemDoubleClick?: (item: any) => void;
  selectedCustomer: Customer | null;
  selectedAddress: CustomerAddress | null;
  onCustomerSelect: (customer: Customer, address: CustomerAddress) => void;
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
  const overlayRef = useRef<HTMLDivElement>(null);

   // استدعاء hook طرق الدفع الموحدة
  const { paymentMethods, loading, error } = usePosPaymentMethods();
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([]);
  const [paidAmount, setPaidAmount] = useState('0');

  // حساب المبالغ
  const deliveryCharge = 0; // يمكن تمريره من props
  const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
  const taxAmount = 0;
  const totalAmount = subtotalWithDelivery + taxAmount - orderSummary.discount;
  
  // حساب المبلغ المدفوع من طرق الدفع المحددة
  const totalPaidFromMethods = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // حساب المبلغ المتبقي (يجب أن يُدفع نقداً)
  const remainingAmount = Math.max(0, totalAmount - totalPaidFromMethods);
  
  // المبلغ الحالي من الكيبورد
  const currentInputAmount = parseFloat(paidAmount) || 0;
  
  // حساب الباقي للعميل (التغيير) - فقط للكاش
  const changeAmount = Math.max(0, currentInputAmount - remainingAmount);

  // إغلاق عند الضغط على الخلفية
  useEffect(() => {
    const handleOverlayClick = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOverlayClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOverlayClick);
    };
  }, [isOpen, onClose]);

 // **تهيئة الدفع الافتراضي بالكاش بقيمة الفاتورة**  
  useEffect(() => {
    if (!isOpen || !paymentMethods?.length) return;
    // إذا لا يوجد مدفوعات حالية، اجعل الكاش جاهز وحدد المبلغ افتراضاً.
    setSelectedPayments([]);
    setPaidAmount(totalAmount.toFixed(2));
    // لا نضيف فعليًا PaymentMethod، بل فقط نجهز الـ paidAmount وزر الكاش مفعّل.
  }, [isOpen, totalAmount, paymentMethods]);

  // Handlers للقسم الأوسط
  const handleAmountChange = (amount: string) => setPaidAmount(amount);
  const handleQuickAmountSelect = (amount: number) => setPaidAmount(amount.toFixed(2));

  // Handlers للقسم الأيمن
  const handlePaymentMethodAdd = (method: string, amount: number) => {
    if (amount <= 0) return;
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      name: method,
      amount: amount
    };
    setSelectedPayments(prev => [...prev, newPayment]);
    const newRemainingAmount = Math.max(0, totalAmount - totalPaidFromMethods - amount);
    setPaidAmount(newRemainingAmount.toFixed(2));
  };

  const handlePaymentMethodRemove = (id: string) => {
    setSelectedPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const handleAmountReset = () => setPaidAmount('0');

  const handleFinishPayment = () => {
    let finalPayments = [...selectedPayments];
    if (currentInputAmount > 0) {
      // أول طريقة دفع = الكاش إن وجدت وإلا أول طريقة متاحة
      const cashMethod = paymentMethods.find(
        m => m.id.toLowerCase() === 'cash' || m.name.toLowerCase() === 'كاش'
      );
      finalPayments.push({
        id: Date.now().toString(),
        name: cashMethod?.name || paymentMethods[0]?.name || 'كاش',
        amount: currentInputAmount
      });
    }
    onPaymentComplete(finalPayments);
    onClose();
  };

  if (!isOpen) return null;


  return (
    <div className={styles.overlay} ref={overlayRef}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/images/img_foodify_logo_2_78x166.png" alt="Foodify" />
          </div>
          <h2 className={styles.title}>تأكيد الدفع</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.leftSection}>
            <PaymentLeft
              orderSummary={orderSummary}
              selectedCustomer={selectedCustomer}
              selectedAddress={selectedAddress}
              orderType={orderType}
              deliveryCharge={deliveryCharge}
            />
          </div>
          <div className={styles.centerSection}>
            <PaymentCenter
              totalAmount={totalAmount}
              paidAmount={paidAmount}
              remainingAmount={remainingAmount}
              changeAmount={changeAmount}
              totalPaidFromMethods={totalPaidFromMethods}
              onAmountChange={handleAmountChange}
              onQuickAmountSelect={handleQuickAmountSelect}
            />
          </div>
          <div className={styles.rightSection}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                fontFamily: 'Cairo, sans-serif'
              }}>
                جاري تحميل طرق الدفع...
              </div>
            ) : error ? (
              <div style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</div>
            ) : (
              <PaymentRight
                availablePaymentMethods={paymentMethods.map(m => m.name)}
                selectedPayments={selectedPayments}
                onPaymentMethodAdd={handlePaymentMethodAdd}
                onPaymentMethodRemove={handlePaymentMethodRemove}
                onFinishPayment={handleFinishPayment}
                currentAmount={currentInputAmount}
                remainingAmount={remainingAmount}
                onAmountReset={handleAmountReset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;