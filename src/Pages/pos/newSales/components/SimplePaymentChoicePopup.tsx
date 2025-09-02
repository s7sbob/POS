import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/SimplePaymentChoicePopup.module.css';

interface SimplePaymentChoicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPaymentType: (paymentType: 'cash' | 'visa') => void;
  totalAmount: number;
}

const SimplePaymentChoicePopup: React.FC<SimplePaymentChoicePopupProps> = ({
  isOpen,
  onClose,
  onSelectPaymentType,
  totalAmount
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('pos.newSales.simplePaymentChoice.title')}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.totalAmount}>
            <span className={styles.label}>
              {t('pos.newSales.simplePaymentChoice.totalAmount')}:
            </span>
            <span className={styles.amount}>
              {totalAmount.toFixed(2)} EGP
            </span>
          </div>

          <div className={styles.question}>
            {t('pos.newSales.simplePaymentChoice.question')}
          </div>

          <div className={styles.paymentOptions}>
            <button
              className={`${styles.paymentButton} ${styles.cashButton}`}
              onClick={() => onSelectPaymentType('cash')}
            >
              <div className={styles.buttonIcon}>💵</div>
              <div className={styles.buttonText}>
                {t('pos.newSales.simplePaymentChoice.cash')}
              </div>
            </button>

            <button
              className={`${styles.paymentButton} ${styles.visaButton}`}
              onClick={() => onSelectPaymentType('visa')}
            >
              <div className={styles.buttonIcon}>💳</div>
              <div className={styles.buttonText}>
                {t('pos.newSales.simplePaymentChoice.visa')}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePaymentChoicePopup;

