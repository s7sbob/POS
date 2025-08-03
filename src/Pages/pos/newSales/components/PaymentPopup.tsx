// src/Pages/pos/newSales/components/PaymentPopup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import PaymentLeft from './paymentPopup components/PaymentLeft';
import PaymentCenter from './paymentPopup components/PaymentCenter';
import PaymentRight from './paymentPopup components/PaymentRight';
import styles from '../styles/PaymentPopup.module.css';
import { usePosPaymentMethods } from '../hooks/usePosPaymentMethods';

interface PaymentMethodData {
  method: string;
  amount: number;
  isSelected: boolean;
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
  onPaymentComplete: (payments: PaymentMethodData[]) => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  orderSummary,
  selectedCustomer,
  selectedAddress,
  orderType,
  onPaymentComplete
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { paymentMethods, loading, error } = usePosPaymentMethods();
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethodData[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState('0');
  const [lastNonCashTotal, setLastNonCashTotal] = useState(0);
  const [isFirstInput, setIsFirstInput] = useState(true); // لتتبع الإدخال الأول

  // حساب المبالغ
  const deliveryCharge = 0;
  const subtotalWithDelivery = orderSummary.subtotal + deliveryCharge;
  const taxAmount = 0;
  const totalAmount = subtotalWithDelivery + taxAmount - orderSummary.discount;

  // العثور على طريقة دفع الكاش
  const getCashMethod = () => {
    return paymentMethods.find(
      m => m.name.toLowerCase().includes('كاش') || m.name.toLowerCase().includes('cash')
    );
  };

  // حساب إجمالي المدفوع بطرق الدفع غير الكاش
  const nonCashTotal = selectedPayments
    .filter(payment => {
      const isCash = payment.method.toLowerCase().includes('كاش') || 
                     payment.method.toLowerCase().includes('cash');
      return !isCash && payment.amount > 0;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  // الحصول على مبلغ الكاش الحالي
  const getCurrentCashAmount = () => {
    const cashPayment = selectedPayments.find(payment => {
      const isCash = payment.method.toLowerCase().includes('كاش') || 
                     payment.method.toLowerCase().includes('cash');
      return isCash;
    });
    return cashPayment?.amount || 0;
  };

  const cashAmount = getCurrentCashAmount();
  
  // حساب المبلغ المتبقي للعميل (فقط من الكاش)
  const remainingForCustomer = Math.max(0, cashAmount - Math.max(0, totalAmount - nonCashTotal));

  // دالة التبديل مع منع التجاوز
  const handlePaymentMethodToggle = (method: string) => {
    setSelectedPayments(prevPayments => {
      return prevPayments.map(payment => {
        if (payment.method === method) {
          const newIsSelected = !payment.isSelected;
          const isCash = method.toLowerCase().includes('كاش') || 
                         method.toLowerCase().includes('cash');
          
          if (isCash && newIsSelected) {
            const currentNonCashTotal = prevPayments
              .filter(p => {
                const isOtherCash = p.method.toLowerCase().includes('كاش') || 
                                 p.method.toLowerCase().includes('cash');
                return !isOtherCash && p.isSelected && p.amount > 0;
              })
              .reduce((sum, p) => sum + p.amount, 0);
            
            const remainingAmount = Math.max(0, totalAmount - currentNonCashTotal);
            
            return {
              ...payment,
              isSelected: true,
              amount: remainingAmount
            };
          } else {
            return {
              ...payment,
              isSelected: newIsSelected,
              amount: newIsSelected ? payment.amount : 0
            };
          }
        }
        return payment;
      });
    });
  };

  // تحديث مبلغ الكاش تلقائياً عند تغيير طرق الدفع غير الكاش
  useEffect(() => {
    const cashMethod = getCashMethod();
    if (!cashMethod) return;

    if (nonCashTotal !== lastNonCashTotal) {
      const autoCalculatedCashAmount = Math.max(0, totalAmount - nonCashTotal);

      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          const isCash = payment.method.toLowerCase().includes('كاش') || 
                         payment.method.toLowerCase().includes('cash');
          
          if (isCash) {
            return {
              ...payment,
              amount: autoCalculatedCashAmount,
              isSelected: autoCalculatedCashAmount > 0
            };
          }
          return payment;
        });
      });

      const selectedCash = selectedPaymentMethod?.toLowerCase().includes('كاش') || 
                          selectedPaymentMethod?.toLowerCase().includes('cash');
      if (selectedCash) {
        setPaidAmount(autoCalculatedCashAmount === 0 ? '0' : autoCalculatedCashAmount.toFixed(2));
        setIsFirstInput(true); // إعادة تعيين حالة الإدخال الأول
      }

      setLastNonCashTotal(nonCashTotal);
    }
  }, [nonCashTotal, totalAmount, selectedPaymentMethod, lastNonCashTotal]);

  // تهيئة طرق الدفع
  useEffect(() => {
    if (!isOpen || !paymentMethods?.length) return;
    
    const cashMethod = getCashMethod();
    const initialPayments = paymentMethods.map(method => {
      const isCash = method.name.toLowerCase().includes('كاش') || 
                     method.name.toLowerCase().includes('cash');
      
      return {
        method: method.name,
        amount: isCash ? totalAmount : 0,
        isSelected: isCash
      };
    });
    
    setSelectedPayments(initialPayments);
    
    if (cashMethod) {
      setSelectedPaymentMethod(cashMethod.name);
      setPaidAmount(totalAmount.toFixed(2));
      setIsFirstInput(true); // تعيين حالة الإدخال الأول
    }
    
    setLastNonCashTotal(0);
  }, [isOpen, paymentMethods, totalAmount]);

  // معالج تغيير المبلغ مع منع التجاوز
const handleAmountChange = (amount: string) => {
  setIsFirstInput(false);
  setPaidAmount(amount);
  
  if (selectedPaymentMethod) {
    const numericAmount = parseFloat(amount) || 0;
    const isCashSelected = selectedPaymentMethod.toLowerCase().includes('كاش') || 
                          selectedPaymentMethod.toLowerCase().includes('cash');
    
    if (!isCashSelected) {
      // لطرق الدفع غير الكاش: تحديث المبلغ وحساب الكاش المتبقي
      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          if (payment.method === selectedPaymentMethod) {
            return {
              ...payment,
              amount: numericAmount,
              isSelected: numericAmount > 0
            };
          } else {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            
            if (isCash) {
              // حساب المبلغ المتبقي للكاش
              const remainingAmount = Math.max(0, totalAmount - numericAmount);
              return {
                ...payment,
                amount: remainingAmount,
                isSelected: remainingAmount > 0
              };
            }
            return payment;
          }
        });
      });
    } else {
      // للكاش: يمكن أن يكون أي مبلغ بدون التأثير على طرق الدفع الأخرى
      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          if (payment.method === selectedPaymentMethod) {
            return {
              ...payment,
              amount: numericAmount,
              isSelected: numericAmount > 0
            };
          }
          // لا تغيير على طرق الدفع الأخرى عند كتابة في الكاش
          return payment;
        });
      });
    }
  }
};



const handleQuickAmountSelect = (amount: number) => {
  setIsFirstInput(false);
  
  if (selectedPaymentMethod) {
    const isCashSelected = selectedPaymentMethod.toLowerCase().includes('كاش') || 
                          selectedPaymentMethod.toLowerCase().includes('cash');
    
    setPaidAmount(amount.toFixed(2));
    
    if (!isCashSelected) {
      // لطرق الدفع غير الكاش
      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          if (payment.method === selectedPaymentMethod) {
            return {
              ...payment,
              amount: amount,
              isSelected: true
            };
          } else {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            
            if (isCash) {
              const remainingAmount = Math.max(0, totalAmount - amount);
              return {
                ...payment,
                amount: remainingAmount,
                isSelected: remainingAmount > 0
              };
            }
            return payment;
          }
        });
      });
    } else {
      // للكاش: لا تأثير على طرق الدفع الأخرى
      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          if (payment.method === selectedPaymentMethod) {
            return {
              ...payment,
              amount: amount,
              isSelected: true
            };
          }
          // الحفاظ على طرق الدفع الأخرى كما هي
          return payment;
        });
      });
    }
  }
};

const handlePaymentMethodSelect = (method: string) => {
  setSelectedPaymentMethod(method);
  
  const isCashSelected = method.toLowerCase().includes('كاش') || 
                        method.toLowerCase().includes('cash');
  
  if (!isCashSelected) {
    // حساب المبلغ المتبقي للأوردر
    const currentNonCashTotal = selectedPayments
      .filter(payment => {
        const isCash = payment.method.toLowerCase().includes('كاش') || 
                       payment.method.toLowerCase().includes('cash');
        return !isCash && payment.method !== method && payment.amount > 0;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const remainingAmountForOrder = Math.max(0, totalAmount - currentNonCashTotal);
    
    // إذا كان هناك مبلغ متبقي، ضعه في الطريقة المختارة
    if (remainingAmountForOrder > 0) {
      setSelectedPayments(prevPayments => {
        return prevPayments.map(payment => {
          if (payment.method === method) {
            return {
              ...payment,
              amount: remainingAmountForOrder,
              isSelected: true
            };
          } else {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            
            if (isCash) {
              // صفر الكاش إذا تم تغطية الأوردر بالكامل
              return {
                ...payment,
                amount: 0,
                isSelected: false
              };
            }
            // الحفاظ على طرق الدفع الأخرى كما هي
            return payment;
          }
        });
      });
      
      setPaidAmount(remainingAmountForOrder.toFixed(2));
    } else {
      // إذا لم يكن هناك مبلغ متبقي، ابدأ من الصفر
      const currentPayment = selectedPayments.find(p => p.method === method);
      const amount = currentPayment?.amount || 0;
      setPaidAmount(amount === 0 ? '0' : amount.toFixed(2));
    }
    
    setIsFirstInput(true);
  } else {
    // للكاش: لا تغيير - فقط اعرض المبلغ الحالي
    const currentPayment = selectedPayments.find(p => p.method === method);
    const amount = currentPayment?.amount || 0;
    setPaidAmount(amount === 0 ? '0' : amount.toFixed(2));
    setIsFirstInput(true);
  }
};

  const handleFinishPayment = () => {
    const finalPayments = selectedPayments.filter(payment => 
      payment.amount > 0
    );
    
    onPaymentComplete(finalPayments);
    onClose();
  };

  const canFinish = (nonCashTotal + cashAmount) >= totalAmount;

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
  cashAmount={cashAmount}
  remainingForCustomer={remainingForCustomer}
  selectedPaymentMethod={selectedPaymentMethod}
  onAmountChange={handleAmountChange}
  onQuickAmountSelect={handleQuickAmountSelect}
  isFirstInput={isFirstInput} // إضافة المعطى الجديد
  nonCashTotal={nonCashTotal}
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
  selectedPaymentMethod={selectedPaymentMethod}
  onPaymentMethodSelect={handlePaymentMethodSelect}
  onPaymentMethodToggle={handlePaymentMethodToggle}
  onFinishPayment={handleFinishPayment}
  canFinish={canFinish}
  totalPaidAllMethods={nonCashTotal + cashAmount}
  totalAmount={totalAmount} // إضافة قيمة الأوردر
  nonCashTotal={nonCashTotal} // إضافة مجموع طرق الدفع غير الكاش
/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
