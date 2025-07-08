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
  // حساب scale factor بناءً على عرض الشاشة
  const getScaleFactor = () => {
    const baseWidth = 1920; // العرض المرجعي
    const currentWidth = window.innerWidth;
    return Math.max(0.6, Math.min(1.2, currentWidth / baseWidth)); // حد أدنى 60% وحد أقصى 120%
  };

  const scaleFactor = getScaleFactor();
  const cardWidth = 195 * scaleFactor;
  const cardHeight = 269 * scaleFactor;
  const imageHeight = 187 * scaleFactor;

  return (
    <div className={`h-full overflow-auto hidden-scroll ${className}`}>
      <div 
        className="grid gap-4 auto-rows-max justify-items-center"
        style={{ 
          gridTemplateColumns: `repeat(auto-fit, ${cardWidth}px)`,
          padding: '8px'
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue flex-shrink-0 relative"
            style={{ 
              width: cardWidth,
              height: cardHeight,
              borderRadius: 16 * scaleFactor
            }}
          >
            {/* الخلفية البيضاء */}
            <div 
              style={{
                width: cardWidth,
                height: cardHeight,
                position: 'absolute',
                left: 0,
                top: 0,
                background: 'white',
                borderRadius: 16 * scaleFactor,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            
            {/* الصورة */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: cardWidth,
                height: imageHeight,
                position: 'absolute',
                left: 0,
                top: 0,
                borderRadius: 16 * scaleFactor,
                objectFit: 'cover'
              }}
            />
            
            {/* اسم المنتج */}
            <div
              style={{
                position: 'absolute',
                right: 8 * scaleFactor,
                top: (202 * scaleFactor),
                color: 'black',
                fontSize: 16 * scaleFactor,
                fontFamily: 'Cairo',
                fontWeight: '600',
                textAlign: 'right'
              }}
            >
              {item.nameArabic}
            </div>
            
            {/* السعر */}
            <div
              style={{
                position: 'absolute',
                left: 8 * scaleFactor,
                top: (198 * scaleFactor)
              }}
            >
              <span
                style={{
                  color: 'black',
                  fontSize: 20 * scaleFactor,
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}
              >
                {item.price}{' '}
              </span>
              <span
                style={{
                  color: 'black',
                  fontSize: 12 * scaleFactor,
                  fontFamily: 'Cairo',
                  fontWeight: '600'
                }}
              >
                EGP
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
