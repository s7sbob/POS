// File: src/hooks/useResponsiveScale.ts
import { useState, useEffect } from 'react';

export const useResponsiveScale = (baseWidth = 1920, baseHeight = 1080) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const widthScale = window.innerWidth / baseWidth;
      const heightScale = window.innerHeight / baseHeight;
      const newScale = Math.min(widthScale, heightScale);
      setScale(Math.max(0.6, Math.min(1.2, newScale))); // حد أدنى 60% وحد أقصى 120%
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth, baseHeight]);

  return scale;
};
