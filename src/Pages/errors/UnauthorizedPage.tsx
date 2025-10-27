// File: src/pages/errors/UnauthorizedPage.tsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { IconLock } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UnauthorizedPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Extract tenantId to construct tenant-aware navigation. Without
  // including this param the button would navigate to '/dashboard'
  // which is not defined and would trigger an auth redirect loop.
  const { tenantId } = useParams<{ tenantId: string }>();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <IconLock size={64} color="error" />
        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
          {t('errors.unauthorized.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('errors.unauthorized.message')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (tenantId) {
              navigate(`/${tenantId}/dashboard`);
            } else {
              navigate('/dashboard');
            }
          }}
        >
          {t('errors.unauthorized.backToDashboard')}
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
