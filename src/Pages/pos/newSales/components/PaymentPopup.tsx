import React, { useState, useEffect, useRef } from 'react';
import { OrderSummary as OrderSummaryType } from '../types/PosSystem';
import { Customer, CustomerAddress } from 'src/utils/api/pagesApi/customersApi';
import PaymentLeft from './paymentPopup components/PaymentLeft';
import PaymentCenter from './paymentPopup components/PaymentCenter';
import PaymentRight from './paymentPopup components/PaymentRight';
import styles from '../styles/PaymentPopup.module.css';
import { usePosPaymentMethods } from '../hooks/usePosPaymentMethods';
import { Snackbar, Alert } from '@mui/material';

interface PaymentMethodData {
  method: string;
  amount: number;
  isSelected: boolean;
  wasModified?: boolean;
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
  
  // إضافة state للإشعارات المحلية
  const [localAlert, setLocalAlert] = useState({
    open: false,
    message: '',
    severity: 'warning' as 'warning' | 'error' | 'success' | 'info'
  });

  const [selectedPayments, setSelectedPayments] = useState<PaymentMethodData[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState('0');
  const [lastNonCashTotal, setLastNonCashTotal] = useState(0);
  const [isFirstInput, setIsFirstInput] = useState(true);

  // دالة عرض التحذير المحلي
  const showLocalWarning = (message: string) => {
    setLocalAlert({
      open: true,
      message,
      severity: 'warning'
    });
  };

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

  // دالة لحساب طرق الدفع النشطة غير الكاش
  const getActiveNonCashPayments = () => {
    return selectedPayments.filter(payment => {
      const isCash = payment.method.toLowerCase().includes('كاش') || 
                     payment.method.toLowerCase().includes('cash');
      return !isCash && payment.isSelected && payment.amount > 0;
    });
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

  // دالة التبديل مع منطق النقل الذكي
  const handlePaymentMethodToggle = (method: string) => {
    const isCash = method.toLowerCase().includes('كاش') || 
                   method.toLowerCase().includes('cash');
    
    // للطرق غير النقدية: تحقق من العدد المسموح
    if (!isCash) {
      const activeNonCashPayments = getActiveNonCashPayments();
      const isCurrentlyActive = selectedPayments.find(p => p.method === method)?.isSelected || false;
      
      // إذا كان يحاول تفعيل طريقة ثالثة غير نقدية
      if (!isCurrentlyActive && activeNonCashPayments.length >= 2) {
        showLocalWarning('لا يمكن استخدام أكثر من وسيلتي دفع غير نقدية');
        return;
      }
    }

    setSelectedPayments(prevPayments => {
      return prevPayments.map(payment => {
        if (payment.method === method) {
          const newIsSelected = !payment.isSelected;
          
          if (isCash && newIsSelected) {
            // للكاش: حساب المبلغ المتبقي فقط
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
              amount: remainingAmount,
              wasModified: false
            };
          } else if (!isCash && newIsSelected) {
            // للطرق غير النقدية الجديدة: تطبيق المنطق الذكي
            const currentActiveNonCash = prevPayments.find(p => {
              const isOtherCash = p.method.toLowerCase().includes('كاش') || 
                               p.method.toLowerCase().includes('cash');
              return !isOtherCash && p.method !== method && p.isSelected && p.amount > 0;
            });
            
            let amountToAssign = 0;
            
            if (currentActiveNonCash) {
              // إذا كان هناك طريقة نشطة أخرى
              if (currentActiveNonCash.wasModified) {
                // إذا تم تعديلها: أخذ المبلغ المتبقي من الكاش
                const currentCash = prevPayments.find(p => {
                  const isCashPayment = p.method.toLowerCase().includes('كاش') || 
                                       p.method.toLowerCase().includes('cash');
                  return isCashPayment;
                });
                amountToAssign = currentCash?.amount || 0;
              } else {
                // إذا لم يتم تعديلها: نقل كامل القيمة
                amountToAssign = currentActiveNonCash.amount;
              }
            } else {
              // لا توجد طريقة نشطة أخرى: أخذ كامل المبلغ
              amountToAssign = totalAmount;
            }
            
            return {
              ...payment,
              isSelected: true,
              amount: amountToAssign,
              wasModified: false
            };
          } else {
            // إلغاء التفعيل
            return {
              ...payment,
              isSelected: false,
              amount: 0,
              wasModified: false
            };
          }
        } else {
          // معالجة الطرق الأخرى عند تفعيل طريقة جديدة
          const newMethodData = prevPayments.find(p => p.method === method);
          const isNewMethodBeingActivated = newMethodData && !newMethodData.isSelected;
          
          if (isNewMethodBeingActivated && !isCash) {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            const isCurrentNonCash = !(payment.method.toLowerCase().includes('كاش') || 
                                     payment.method.toLowerCase().includes('cash'));
            
            // إذا كانت الطريقة الحالية غير نقدية ونشطة
            if (isCurrentNonCash && payment.isSelected) {
              if (payment.wasModified) {
                // إذا تم تعديلها: احتفظ بها وقلل من الكاش
                return payment;
              } else {
                // إذا لم يتم تعديلها: انقل قيمتها للطريقة الجديدة
                return {
                  ...payment,
                  isSelected: false,
                  amount: 0,
                  wasModified: false
                };
              }
            } else if (isCash) {
              // تحديث الكاش بناءً على الحالة
              const currentActiveNonCash = prevPayments.find(p => {
                const isOtherCash = p.method.toLowerCase().includes('كاش') || 
                                   p.method.toLowerCase().includes('cash');
                return !isOtherCash && p.method !== method && p.isSelected && p.amount > 0;
              });
              
              if (currentActiveNonCash?.wasModified) {
                // إذا كانت الطريقة النشطة معدلة: الكاش يفقد قيمته للطريقة الجديدة
                const newMethodAmount = payment.amount;
                return {
                  ...payment,
                  amount: Math.max(0, payment.amount - newMethodAmount),
                  isSelected: Math.max(0, payment.amount - newMethodAmount) > 0
                };
              } else {
                // إذا لم تكن معدلة: الكاش يأخذ المبلغ المتبقي
                const newAmount = Math.max(0, totalAmount - (currentActiveNonCash?.amount || totalAmount));
                return {
                  ...payment,
                  amount: newAmount,
                  isSelected: newAmount > 0
                };
              }
            }
          }
          
          return payment;
        }
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
        setIsFirstInput(true);
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
        isSelected: isCash,
        wasModified: false
      };
    });
    
    setSelectedPayments(initialPayments);
    
    if (cashMethod) {
      setSelectedPaymentMethod(cashMethod.name);
      setPaidAmount(totalAmount.toFixed(2));
      setIsFirstInput(true);
    }
    
    setLastNonCashTotal(0);
  }, [isOpen, paymentMethods, totalAmount]);

  // معالج تغيير المبلغ مع تحديد flag التعديل
  const handleAmountChange = (amount: string) => {
    setIsFirstInput(false);
    setPaidAmount(amount);
    
    if (selectedPaymentMethod) {
      const numericAmount = parseFloat(amount) || 0;
      const isCashSelected = selectedPaymentMethod.toLowerCase().includes('كاش') || 
                            selectedPaymentMethod.toLowerCase().includes('cash');
      
      if (!isCashSelected) {
        // للطرق غير النقدية: منع التجاوز عن المبلغ المتبقي وتحديد wasModified
        const currentOtherNonCashTotal = selectedPayments
          .filter(payment => {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            return !isCash && payment.method !== selectedPaymentMethod && payment.amount > 0;
          })
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        const maxAllowed = Math.max(0, totalAmount - currentOtherNonCashTotal);
        const finalAmount = Math.min(numericAmount, maxAllowed);
        
        // تحديث المبلغ المدخل إذا تم تقليله
        if (finalAmount !== numericAmount) {
          setPaidAmount(finalAmount.toFixed(2));
        }
        
        setSelectedPayments(prevPayments => {
          return prevPayments.map(payment => {
            if (payment.method === selectedPaymentMethod) {
              return {
                ...payment,
                amount: finalAmount,
                isSelected: finalAmount > 0,
                wasModified: true // تحديد أنه تم التعديل
              };
            } else {
              const isCash = payment.method.toLowerCase().includes('كاش') || 
                             payment.method.toLowerCase().includes('cash');
              
              if (isCash) {
                const remainingAmount = Math.max(0, totalAmount - currentOtherNonCashTotal - finalAmount);
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
        // للكاش: يمكن أي مبلغ
        setSelectedPayments(prevPayments => {
          return prevPayments.map(payment => {
            if (payment.method === selectedPaymentMethod) {
              return {
                ...payment,
                amount: numericAmount,
                isSelected: numericAmount > 0,
                wasModified: true // تحديد أنه تم التعديل
              };
            }
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
        // للطرق غير النقدية: منع التجاوز وتحديد wasModified
        const currentOtherNonCashTotal = selectedPayments
          .filter(payment => {
            const isCash = payment.method.toLowerCase().includes('كاش') || 
                           payment.method.toLowerCase().includes('cash');
            return !isCash && payment.method !== selectedPaymentMethod && payment.amount > 0;
          })
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        const maxAllowed = Math.max(0, totalAmount - currentOtherNonCashTotal);
        const finalAmount = Math.min(amount, maxAllowed);
        
        if (finalAmount !== amount) {
          setPaidAmount(finalAmount.toFixed(2));
        }
        
        setSelectedPayments(prevPayments => {
          return prevPayments.map(payment => {
            if (payment.method === selectedPaymentMethod) {
              return {
                ...payment,
                amount: finalAmount,
                isSelected: true,
                wasModified: true // تحديد أنه تم التعديل
              };
            } else {
              const isCash = payment.method.toLowerCase().includes('كاش') || 
                             payment.method.toLowerCase().includes('cash');
              
              if (isCash) {
                const remainingAmount = Math.max(0, totalAmount - currentOtherNonCashTotal - finalAmount);
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
        // للكاش: لا تأثير على طرق الدفع الأخرى وتحديد wasModified
        setSelectedPayments(prevPayments => {
          return prevPayments.map(payment => {
            if (payment.method === selectedPaymentMethod) {
              return {
                ...payment,
                amount: amount,
                isSelected: true,
                wasModified: true // تحديد أنه تم التعديل
              };
            }
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
                isSelected: true,
                wasModified: false // إعادة تعيين عند الاختيار
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
              return payment;
            }
          });
        });
        
        setPaidAmount(remainingAmountForOrder.toFixed(2));
      } else {
        const currentPayment = selectedPayments.find(p => p.method === method);
        const amount = currentPayment?.amount || 0;
        setPaidAmount(amount === 0 ? '0' : amount.toFixed(2));
      }
      
      setIsFirstInput(true);
    } else {
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
              isFirstInput={isFirstInput}
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
                totalAmount={totalAmount}
                nonCashTotal={nonCashTotal}
                onShowWarning={showLocalWarning}
              />
            )}
          </div>
        </div>

        {/* إضافة الـ Snackbar المحلي داخل الـ popup */}
        <Snackbar
          open={localAlert.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={4000}
          onClose={() => setLocalAlert(prev => ({ ...prev, open: false }))}
          sx={{ 
            position: 'absolute', // مهم: نسبي لموضع الـ popup
            zIndex: 10 // فوق محتوى الـ popup
          }}
        >
          <Alert
            onClose={() => setLocalAlert(prev => ({ ...prev, open: false }))}
            severity={localAlert.severity}
            variant="filled"
            sx={{ 
              width: '100%',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            {localAlert.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default PaymentPopup;
