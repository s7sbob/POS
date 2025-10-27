// File: src/hooks/useIsLandingPage.ts
import { useLocation } from 'react-router-dom';

/**
 * Determine whether the current page should be treated as a landing page.
 * A landing page may appear at the root ("/" or "/landing"), at
 * `/:tenantId` for a tenant's landing page, or at `/:tenantId/landing`.
 * This helper inspects the current pathname and infers whether it matches
 * one of these patterns without relying on route params (which are not
 * always available outside of route components).
 */
export const useIsLandingPage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  // Split the path into segments, ignoring leading/trailing slashes.
  const segments = pathname.split('/').filter(Boolean);
  // No segments => "/" => landing page.
  if (segments.length === 0) {
    return true;
  }
  // Single segment (e.g. "/:tenantId") => treat as landing page for that tenant.
  if (segments.length === 1) {
    return true;
  }
  // Two or more segments: if the second segment is "landing" then it's a landing page.
  if (segments[1] === 'landing') {
    return true;
  }
  return false;
};
