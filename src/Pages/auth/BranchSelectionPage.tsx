// File: src/pages/auth/BranchSelectionPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Box, 
  Card, 
  Stack, 
  Typography, 
  Button,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { IconBuilding, IconMapPin, IconPhone, IconLogout } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { useAuth } from 'src/contexts/AuthContext';
import { Branch } from 'src/utils/api/authApi';

const BranchSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { branches, selectBranch, logout, user, isLoading } = useAuth();
  const [selectedBranchId, setSelectedBranchId] = React.useState<string | null>(null);

  const handleBranchSelect = async (branch: Branch) => {
    try {
      setSelectedBranchId(branch.id);
      await selectBranch(branch);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error selecting branch:', error);
      setSelectedBranchId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  if (branches.length === 0) {
    return (
      <PageContainer title={t('auth.branchSelection.title')} description={t('auth.branchSelection.description')}>
        <Box sx={{ 
          position: 'relative', 
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute', 
            inset: 0, 
            opacity: 0.3 
          }
        }}>
          <Grid container justifyContent="center" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={5} display="flex" alignItems="center">
              <Card elevation={9} sx={{ p: 4, width: '100%', zIndex: 1 }}>
                <Box textAlign="center" mb={3}>
                  <Logo />
                </Box>

                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('auth.branchSelection.noBranches')}
                  </Typography>
                  <Typography variant="body2">
                    {t('auth.branchSelection.noBranchesMessage')}
                  </Typography>
                </Alert>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  startIcon={<IconLogout />}
                >
                  {t('auth.logout')}
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={t('auth.branchSelection.title')} description={t('auth.branchSelection.description')}>
      <Box sx={{ 
        position: 'relative', 
        '&:before': {
          content: '""',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute', 
          inset: 0, 
          opacity: 0.3 
        }
      }}>
        <Grid container justifyContent="center" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12} sm={10} md={8} lg={6} display="flex" alignItems="center">
            <Card elevation={9} sx={{ p: 4, width: '100%', zIndex: 1 }}>
              <Box textAlign="center" mb={3}>
                <Logo />
              </Box>

              <Typography variant="h4" textAlign="center" mb={1}>
                {t('auth.branchSelection.selectBranch')}
              </Typography>
              
              <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
                {t('auth.branchSelection.welcomeMessage', { userName: user?.userName })}
              </Typography>

              <Stack spacing={2}>
                {branches.map((branch) => (
                  <Card 
                    key={branch.id}
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                        borderColor: 'primary.main'
                      },
                      ...(selectedBranchId === branch.id && {
                        opacity: 0.7,
                        pointerEvents: 'none'
                      })
                    }}
                    onClick={() => handleBranchSelect(branch)}
                  >
                    <Box sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <IconBuilding size={24} color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">
                            {branch.name}
                          </Typography>
                        </Box>
                        <Chip 
                          label={branch.company.name} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Stack>

                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {branch.address && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconMapPin size={16} />
                            <Typography variant="body2" color="text.secondary">
                              {branch.address}
                            </Typography>
                          </Stack>
                        )}

                        {branch.phone && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <IconPhone size={16} />
                            <Typography variant="body2" color="text.secondary">
                              {branch.phone}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Button
                        fullWidth
                        variant="contained"
                        disabled={selectedBranchId === branch.id || isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBranchSelect(branch);
                        }}
                      >
                        {selectedBranchId === branch.id ? t('auth.branchSelection.selecting') : t('auth.branchSelection.selectThisBranch')}
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleLogout}
                startIcon={<IconLogout />}
              >
                {t('auth.logout')}
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default BranchSelectionPage;
