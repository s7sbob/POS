// src/Pages/pos/newSales/components/ProductCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PosProduct } from '../types/PosSystem';
import styles from '../styles/ProductCard.module.css';

interface ProductCardProps {
  product: PosProduct;
  onClick: (product: PosProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t } = useTranslation();
  
  const handleClick = () => {
    onClick(product);
  };

  // تحديد ما إذا كان المنتج هو عرض
  const isOffer = product.id.startsWith('offer-');
  
  // تحديد ما إذا كان المنتج له سعر واحد أم أكثر
  const hasMultiplePrices = product.hasMultiplePrices;
  const singlePrice = !hasMultiplePrices && product.productPrices.length > 0 
    ? product.productPrices[0].price 
    : null;

  return (
    <div 
      className={styles.productCard} 
      onClick={handleClick}
      data-offer={isOffer ? 'true' : 'false'} // إضافة data attribute للعروض
    >
      <div className={styles.productImageContainer}>
        <img 
          src={product.image} 
          alt={product.nameArabic} 
          className={styles.productImage}
        />
        
        {/* عرض السعر على الصورة */}
        {singlePrice !== null && (
          <div className={styles.priceOverlay}>
            {singlePrice.toFixed(2)} {t("pos.newSales.products.currency")}
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          {isOffer && '🏷️ '}{product.nameArabic}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;
