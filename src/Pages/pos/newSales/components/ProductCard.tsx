// src/Pages/pos/newSales/components/ProductCard.tsx
import React from 'react';
import { PosProduct } from '../types/PosSystem';
import styles from '../styles/ProductCard.module.css';

interface ProductCardProps {
  product: PosProduct;
  onClick: (product: PosProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    onClick(product);
  };

  // تحديد ما إذا كان المنتج له سعر واحد أم أكثر
  const hasMultiplePrices = product.hasMultiplePrices;
  const singlePrice = !hasMultiplePrices && product.productPrices.length > 0 
    ? product.productPrices[0].price 
    : null;

  return (
    <div className={styles.productCard} onClick={handleClick}>
      <div className={styles.productImageContainer}>
        <img 
          src={product.image} 
          alt={product.nameArabic} 
          className={styles.productImage}
        />
        
        {/* عرض السعر على الصورة إذا كان المنتج له سعر واحد */}
        {singlePrice !== null && (
          <div className={styles.priceOverlay}>
            {singlePrice.toFixed(2)} EGP
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          {product.nameArabic}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;
