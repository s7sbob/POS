// File: src/pages/auth/LoginPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './components/AuthLogin';
import { useAuth } from 'src/contexts/AuthContext';
import { Branch } from 'src/utils/api/authApi';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [msg, setMsg] = React.useState('');

  const handleLogin = async (phone: string, password: string) => {
    try {
      await login(phone, password, (branches: Branch[], selectedBranch?: Branch) => {
        console.log('🚀 Login success callback triggered');
        console.log('- branches.length:', branches.length);
        console.log('- selectedBranch:', selectedBranch);
        
        if (branches.length === 1 && selectedBranch) {
          console.log('➡️ Redirecting to dashboard (single branch)');
          navigate('/dashboard', { replace: true });
        } else if (branches.length > 1) {
          console.log('➡️ Redirecting to branch selection (multiple branches)');
          navigate('/auth/branch-selection', { replace: true });
        } else {
          console.log('➡️ Redirecting to no branches page');
          navigate('/auth/no-branches', { replace: true });
        }
      });
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setMsg(err?.message || t('auth.login.failed'));
    }
  };

  return (
    <PageContainer title={t('auth.login.title')} description={t('auth.login.description')}>
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
          <Grid item xs={12} sm={8} md={5} lg={4} display="flex" alignItems="center">
            <Card elevation={9} sx={{ p: 4, width: '100%', zIndex: 1 }}>
              <Box textAlign="center" mb={2}>
                <Logo />
              </Box>

              <AuthLogin
                onSubmit={handleLogin}
                isLoading={isLoading}
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6">
                      {t('auth.login.newUser')}
                    </Typography>
                    <Typography component={Link} to="/auth/register" sx={{ color: 'primary.main' }}>
                      {t('auth.login.createAccount')}
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={!!msg} autoHideDuration={4000} onClose={() => setMsg('')}>
        <Alert severity="error" onClose={() => setMsg('')}>
          {msg}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default LoginPage;
