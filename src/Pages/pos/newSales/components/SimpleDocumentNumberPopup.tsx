import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../styles/DocumentNumberPopup.module.css';

interface SimpleDocumentNumberPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (documentNumber: string) => void;
  deliveryCompanyName?: string;
}

const SimpleDocumentNumberPopup: React.FC<SimpleDocumentNumberPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deliveryCompanyName
}) => {
  // const { t } = useTranslation();
  const [documentNumber, setDocumentNumber] = useState('');
  const [error, setError] = useState('');

  // إعادة تعيين القيم عند فتح الـ popup
  useEffect(() => {
    if (isOpen) {
      setDocumentNumber('');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const trimmedNumber = documentNumber.trim();
    
    if (!trimmedNumber) {
      setError('رقم الفاتورة مطلوب');
      return;
    }

    if (trimmedNumber.length < 3) {
      setError('رقم الفاتورة يجب أن يكون 3 أحرف على الأقل');
      return;
    }

    onConfirm(trimmedNumber);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            رقم الفاتورة مطلوب
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {deliveryCompanyName && (
            <div className={styles.orderInfo}>
              <div className={styles.paymentMethod}>
                <span className={styles.label}>شركة التوصيل:</span>
                <span className={`${styles.method} ${styles.delivery}`}>
                  🚚 {deliveryCompanyName}
                </span>
              </div>
            </div>
          )}

          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>
              أدخل رقم الفاتورة:
            </label>
            <input
              type="text"
              className={`${styles.documentInput} ${error ? styles.error : ''}`}
              value={documentNumber}
              onChange={(e) => {
                setDocumentNumber(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyPress}
              placeholder="مثال: INV-2024-001"
              autoFocus
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={!documentNumber.trim()}
            >
              تأكيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDocumentNumberPopup;