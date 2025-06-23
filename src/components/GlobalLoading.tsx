// File: src/components/GlobalLoading.tsx
import React, { useState, useEffect } from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const GlobalLoading: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (event: any) => {
      setLoading(event.detail?.loading || false);
    };

    window.addEventListener('apiLoading', handleLoading);
    
    return () => {
      window.removeEventListener('apiLoading', handleLoading);
    };
  }, []);

  if (!loading) return null;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2
      }}
      open={loading}
    >
      <CircularProgress color="inherit" />
      <Typography variant="body1">
        جاري التحميل...
      </Typography>
    </Backdrop>
  );
};

export default GlobalLoading;
