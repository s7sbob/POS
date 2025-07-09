// import { useState, useEffect, useCallback } from 'react';

// interface ResponsiveConfig {
//   baseWidth: number;
//   baseHeight: number;
//   minScale: number;
//   maxScale: number;
// }

// export const useResponsiveScale = (config: ResponsiveConfig = {
//   baseWidth: 2000,
//   baseHeight: 1400,
//   minScale: 0.4,
//   maxScale: 2.0
// }) => {
//   const [scale, setScale] = useState(1);
//   const [dimensions, setDimensions] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight
//   });

//   const updateScale = useCallback(() => {
//     const currentWidth = window.innerWidth;
//     const currentHeight = window.innerHeight;
    
//     // تجنب التحديث إذا لم تتغير الأبعاد
//     if (currentWidth === dimensions.width && currentHeight === dimensions.height) {
//       return;
//     }
    
//     const widthScale = currentWidth / config.baseWidth;
//     const heightScale = currentHeight / config.baseHeight;
//     const newScale = Math.min(widthScale, heightScale);
//     const finalScale = Math.max(config.minScale, Math.min(config.maxScale, newScale));
    
//     setDimensions({ width: currentWidth, height: currentHeight });
//     setScale(finalScale);
    
//     // تحديث CSS variable
//     document.documentElement.style.setProperty('--responsive-scale', finalScale.toString());
//   }, [config.baseWidth, config.baseHeight, config.minScale, config.maxScale, dimensions.width, dimensions.height]);

//   useEffect(() => {
//     updateScale();

//     window.addEventListener('resize', updateScale);
//     window.addEventListener('orientationchange', updateScale);
    
//     return () => {
//       window.removeEventListener('resize', updateScale);
//       window.removeEventListener('orientationchange', updateScale);
//     };
//   }, [updateScale]);

//   return { scale, dimensions };
// };

// // Hook للحصول على أبعاد متجاوبة
// export const useResponsiveDimensions = () => {
//   const { scale } = useResponsiveScale();
  
//   const responsive = useCallback((value: number) => value * scale, [scale]);
//   const responsiveVW = useCallback((value: number) => `${value * scale}vw`, [scale]);
//   const responsiveVH = useCallback((value: number) => `${value * scale}vh`, [scale]);
//   const responsivePX = useCallback((value: number) => `${value * scale}px`, [scale]);
  
//   return { responsive, responsiveVW, responsiveVH, responsivePX, scale };
// };
