// import React from 'react';
// import { CategoryItem } from './types/PosSystem';

// interface CategorySidebarProps {
//   categories: CategoryItem[];
//   selectedCategory: string;
//   onCategorySelect: (categoryId: string) => void;
//   className?: string;
// }

// const CategorySidebar: React.FC<CategorySidebarProps> = ({
//   categories,
//   selectedCategory,
//   onCategorySelect,
//   className = ''
// }) => {
//   return (
//     <div className={`category-sidebar ${className}`}>
//       {categories.map((category) => (
//         <button
//           key={category.id}
//           onClick={() => onCategorySelect(category.id)}
//           className={`category-item ${category.id === selectedCategory ? 'active' : ''}`}
//         >
//           <img src={category.image} alt={category.name} />
//           <span>{category.nameArabic}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default CategorySidebar;
