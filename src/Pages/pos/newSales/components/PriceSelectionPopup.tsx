// src/Pages/pos/newSales/components/PriceSelectionPopup.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PosProduct, PosPrice } from '../types/PosSystem';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/PriceSelectionPopup.module.css';

interface PriceSelectionPopupProps {
  product: PosProduct | null;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectPrice: (price: PosPrice) => void;
}

const PriceSelectionPopup: React.FC<PriceSelectionPopupProps> = ({
  product,
  isOpen,
  onClose,
  onSelectPrice
}) => {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className={styles.popupOverlay} ref={overlayRef}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h3 className={styles.popupTitle}>{product.nameArabic}</h3>
          <button className={styles.popupClose} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className={styles.popupBody}>
          
          <div className={styles.pricesGrid}>
            {product.productPrices.map((price) => (
              <button
                key={price.id}
                className={styles.priceCard}
                onClick={() => onSelectPrice(price)}
              >
                <div className={styles.priceName}>{price.nameArabic}</div>
                <div className={styles.priceValue}>
                  <span className={styles.price}>{price.price}</span>
                  <span className={styles.currency}>{t("pos.newSales.products.currency")}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSelectionPopup;
