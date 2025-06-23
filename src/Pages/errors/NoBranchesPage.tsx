// File: src/pages/errors/NoBranchesPage.tsx
import React from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import { IconBuilding, IconLogout } from '@tabler/icons-react';
import { useAuth } from 'src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NoBranchesPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

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
        <IconBuilding size={64} color="warning" />
        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
          {t('errors.noBranches.title')}
        </Typography>
        
        <Alert severity="warning" sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body1">
            {t('errors.noBranches.message')}
          </Typography>
        </Alert>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<IconLogout />}
          onClick={handleLogout}
        >
          {t('auth.logout')}
        </Button>
      </Box>
    </Container>
  );
};

export default NoBranchesPage;
