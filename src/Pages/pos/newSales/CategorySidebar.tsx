import React from 'react';
import { CategoryItem } from './types/PosSystem';

interface CategorySidebarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = '',
  style
}) => {
  return (
    <div className={`flex flex-col gap-4 overflow-y-auto invisible-scroll ${className}`} style={style}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue flex-shrink-0 flex flex-col items-center justify-center"
          style={{ 
            width: '100%',
            background: 'white',
            borderRadius: 16,
            border: category.id === selectedCategory ? '2px #0373ED solid' : '2px transparent solid',
            minHeight: 'min(12vh, 120px)',
            padding: 'min(1vh, 12px)'
          }}
        >
          <div style={{ 
            width: 'min(3vw, 48px)', 
            height: 'min(3vw, 48px)',
            marginBottom: 'min(0.5vh, 8px)'
          }}>
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-contain"
            />
          </div>
          <span 
            className="font-cairo font-normal text-primary text-center"
            style={{ 
              fontSize: 'clamp(14px, 1.2vw, 18px)', // تكبير الخط من 12px إلى 14-18px
              lineHeight: 'clamp(18px, 1.5vw, 24px)',
              fontWeight: '600' // جعل الخط أكثر وضوحاً
            }}
          >
            {category.nameArabic}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategorySidebar;
