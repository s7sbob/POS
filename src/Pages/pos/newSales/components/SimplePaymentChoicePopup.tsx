import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/SimplePaymentChoicePopup.module.css';
import DocumentNumberPopup from './DocumentNumberPopup';

interface SimplePaymentChoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPaymentType: (paymentType: 'cash' | 'visa') => void;
  totalAmount: number;
  // إضافة props جديدة للـ flow المحدث
  onCompletePayment?: (paymentType: 'cash' | 'visa', documentNumber: string) => void;
  requiresDocumentNumber?: boolean;
}

const SimplePaymentChoicePopup: React.FC<SimplePaymentChoicePopupProps> = ({
  isOpen,
  onClose,
  onSelectPaymentType,
  totalAmount,
  onCompletePayment,
  requiresDocumentNumber = false
}) => {
  // const { t } = useTranslation();
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'cash' | 'visa' | null>(null);

  const handlePaymentTypeSelect = (paymentType: 'cash' | 'visa') => {
    if (requiresDocumentNumber && onCompletePayment) {
      // للـ flow الجديد: إظهار popup رقم الفاتورة
      setSelectedPaymentType(paymentType);
      setShowDocumentPopup(true);
    } else {
      // للـ flow القديم: استدعاء الدالة مباشرة
      onSelectPaymentType(paymentType);
    }
  };

  const handleDocumentNumberConfirm = (documentNumber: string) => {
    if (selectedPaymentType && onCompletePayment) {
      onCompletePayment(selectedPaymentType, documentNumber);
      setShowDocumentPopup(false);
      setSelectedPaymentType(null);
    }
  };

  const handleDocumentNumberClose = () => {
    setShowDocumentPopup(false);
    setSelectedPaymentType(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              اختر طريقة الدفع
            </h2>
            <button className={styles.closeBtn} onClick={onClose}>×</button>
          </div>

          <div className={styles.content}>
            <div className={styles.totalAmount}>
              <span className={styles.label}>
                المبلغ الإجمالي:
              </span>
              <span className={styles.amount}>
                {totalAmount.toFixed(2)} EGP
              </span>
            </div>

            <div className={styles.question}>
              كيف تريد الدفع؟
            </div>

            <div className={styles.paymentOptions}>
              <button
                className={`${styles.paymentButton} ${styles.cashButton}`}
                onClick={() => handlePaymentTypeSelect('cash')}
              >
                <div className={styles.buttonIcon}>💵</div>
                <div className={styles.buttonText}>
                  كاش
                </div>
              </button>

              <button
                className={`${styles.paymentButton} ${styles.visaButton}`}
                onClick={() => handlePaymentTypeSelect('visa')}
              >
                <div className={styles.buttonIcon}>💳</div>
                <div className={styles.buttonText}>
                  فيزا
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Number Popup */}
      <DocumentNumberPopup
        isOpen={showDocumentPopup}
        onClose={handleDocumentNumberClose}
        onConfirm={handleDocumentNumberConfirm}
        totalAmount={totalAmount}
        paymentType={selectedPaymentType || 'cash'}
      />
    </>
  );
};

export default SimplePaymentChoicePopup;

