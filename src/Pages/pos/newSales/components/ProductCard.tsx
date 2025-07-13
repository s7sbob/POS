// src/Pages/pos/newSales/components/ProductCard.tsx
import React from 'react';
import { PosProduct } from '../types/PosSystem';
import * as posService from '../../../../services/posService';
import '../Styles/ProductCard.css';

interface ProductCardProps {
  product: PosProduct;
  onClick: (product: PosProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const hasOptions = posService.hasProductOptions(product);
  
  return (
    <button
      className={`product-card ${product.hasMultiplePrices ? 'multiple-prices' : ''}`}
      onClick={() => onClick(product)}
    >
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.nameArabic} 
          className="product-image" 
        />
        {hasOptions && (
          <div className="product-options-badge">
            <span>خيارات</span>
          </div>
        )}
      </div>
      
      <div className="product-info-section">
        <div className="product-details">
          <div className="product-name">
            {product.nameArabic}
          </div>
          
          {!product.hasMultiplePrices && product.displayPrice && (
            <div className="product-price-container">
              <span className="product-price">{product.displayPrice}</span>
              <span className="product-currency">EGP</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
