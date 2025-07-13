// src/Pages/pos/newSales/components/PriceSelectionPopup.tsx
import React, { useEffect, useRef } from 'react';
import { PosProduct, PosPrice } from '../types/PosSystem';
import CloseIcon from '@mui/icons-material/Close';

interface PriceSelectionPopupProps {
  product: PosProduct;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectPrice: (price: PosPrice) => void;
}

const PriceSelectionPopup: React.FC<PriceSelectionPopupProps> = ({
  product,
  quantity,
  isOpen,
  onClose,
  onSelectPrice
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // إقفال الـ popup عند الضغط خارجه
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

  // إقفال الـ popup عند الضغط على Escape
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

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" ref={overlayRef}>
      <div className="popup-content">
        <div className="popup-header">
          <h3 className="popup-title">{product.nameArabic}</h3>
          <button className="popup-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="popup-body">
          <div className="quantity-display">
            الكمية: {quantity}
          </div>
          
          <div className="prices-grid">
            {product.productPrices.map((price) => (
              <button
                key={price.id}
                className="price-card"
                onClick={() => onSelectPrice(price)}
              >
                <div className="price-name">{price.nameArabic}</div>
                <div className="price-value">
                  <span className="price">{price.price}</span>
                  <span className="currency">EGP</span>
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
