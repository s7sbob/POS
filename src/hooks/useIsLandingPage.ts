// File: src/hooks/useIsLandingPage.ts
import { useLocation } from 'react-router-dom';

export const useIsLandingPage = () => {
  const location = useLocation();
  return location.pathname === '/' || location.pathname === '/landing';
};
