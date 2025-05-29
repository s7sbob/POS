/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Snackbar, Alert } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import api from 'src/utils/axios';
import { saveAuth } from 'src/utils/auth';

const Login2: React.FC = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = React.useState('');

  /* هذه الدالة يستدعيها AuthLogin عبر prop */
  const handleLogin = async (phone: string, password: string) => {
    try {
      const { data } = await api.post('/login?PhoneNo=' + phone + '&Password=' + password, {
      });
      saveAuth(data.token, data.expiration);
      navigate('/dashboards/modern', { replace: true });
    } catch (err: any) {
      setMsg(err?.message || 'Login failed');
    }
  };

  return (
    <PageContainer title="Login" description="Login page">
      <Box sx={{ position: 'relative', '&:before': {
        content: '""',
        background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        position: 'absolute', inset: 0, opacity: 0.3 }}}>
        <Grid container justifyContent="center" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12} sm={8} md={5} lg={4} display="flex" alignItems="center">
            <Card elevation={9} sx={{ p: 4, width: '100%', zIndex: 1 }}>
              <Box textAlign="center" mb={2}><Logo /></Box>

              <AuthLogin
                onSubmit={handleLogin}
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="textSecondary" variant="h6">
                      New user?
                    </Typography>
                    <Typography component={Link} to="/auth/register" sx={{ color: 'primary.main' }}>
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={!!msg} autoHideDuration={4000} onClose={() => setMsg('')}>
        <Alert severity="error" onClose={() => setMsg('')}>{msg}</Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Login2;
