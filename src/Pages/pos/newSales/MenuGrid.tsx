import React from 'react';
import { MenuItem } from './types/PosSystem';

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  className?: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  onItemClick,
  className = ''
}) => {
  return (
    <div className={`products-grid ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item)}
          className="product-card"
        >
          <img src={item.image} alt={item.name} className="product-image" />
          <div className="product-info">
            <div className="product-name">{item.nameArabic}</div>
            <div className="product-price">
              <span>{item.price}</span>
              <span className="currency">EGP</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MenuGrid;
