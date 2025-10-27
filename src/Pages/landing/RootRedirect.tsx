// File: src/Pages/landing/RootRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';

/**
 * RootRedirect is used for the top-level "/" and "/landing" routes.  When a tenantId
 * has been saved in localStorage under the key `tenant_id`, the component
 * automatically redirects to the tenant-specific landing page (e.g. `/mycompany`).
 * Otherwise it simply renders the public LandingPage.  This ensures that
 * returning visitors are always taken to their company environment even
 * when they access the base URL.
 */
const RootRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedTenantId = localStorage.getItem('tenant_id');
    if (savedTenantId) {
      // Redirect to the saved tenant's landing page.  Use replace to avoid
      // creating a new entry in the history stack.
      navigate(`/${savedTenantId}`, { replace: true });
    }
    // If no tenant is saved we fall through and render the LandingPage.
  }, [navigate]);

  return <LandingPage />;
};

export default RootRedirect;