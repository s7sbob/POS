// File: src/Pages/landing/components/Hero/HeroSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  useTheme,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import {
  IconArrowRight,
  IconPray,
  IconStar,
  IconUsers,
  IconBuildingStore,
  IconChartBar,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  // Use tenantId from the current route (if present) so that the
  // Get Started button directs the user to the correct tenant login page.
  const { tenantId } = useParams<{ tenantId: string }>();

  const stats = [
    { icon: IconUsers, value: '10,000+', label: t('landing.hero.stats.users') },
    { icon: IconBuildingStore, value: '500+', label: t('landing.hero.stats.stores') },
    { icon: IconChartBar, value: '99.9%', label: t('landing.hero.stats.uptime') },
  ];

  const handleGetStarted = () => {
    if (tenantId) {
      navigate(`/${tenantId}/auth/login`);
    } else {
      // Use relative path if we are on tenant landing page without param
      navigate('auth/login');
    }
  };

  const handleWatchDemo = () => {
    // Handle demo video
    console.log('Watch demo clicked');
  };

  return (
    <Box
      id="home"
      sx={{
        pt: { xs: 12, md: 16 },
        pb: { xs: 8, md: 12 },
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          filter: 'blur(30px)',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Stack spacing={4}>
              {/* Badge */}
              <Box>
                <Chip
                  label={t('landing.hero.badge')}
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 20,
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                {t('landing.hero.title')}
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                {t('landing.hero.subtitle')}
              </Typography>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<IconArrowRight size={20} />}
                  onClick={handleGetStarted}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  }}
                >
                  {t('landing.hero.cta.primary')}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<IconPray size={20} />}
                  onClick={handleWatchDemo}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {t('landing.hero.cta.secondary')}
                </Button>
              </Stack>

              {/* Stats */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={4}
                sx={{ mt: 6 }}
              >
                {stats.map((stat, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <stat.icon size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              {/* Main Dashboard Preview */}
              <Card
                elevation={20}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                  },
                }}
              >
                <Box
                  sx={{
                    height: 400,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.light, 0.1)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Simulated Dashboard Content */}
                  <Box sx={{ width: '90%', height: '90%', p: 2 }}>
                    <Box
                      sx={{
                        height: 40,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={3} key={item}>
                          <Box
                            sx={{
                              height: 80,
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              borderRadius: 2,
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    />
                  </Box>

                  {/* Floating Elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      animation: 'pulse 2s infinite',
                    }}
                  >
                    <IconStar size={24} />
                  </Box>
                </Box>
              </Card>

              {/* Floating Cards */}
              <Card
                elevation={8}
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: -20,
                  width: 120,
                  height: 80,
                  borderRadius: 3,
                  backgroundColor: theme.palette.success.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    +25%
                  </Typography>
                  <Typography variant="caption">
                    {t('landing.hero.growth')}
                  </Typography>
                </Box>
              </Card>

              <Card
                elevation={8}
                sx={{
                  position: 'absolute',
                  bottom: 60,
                  right: -30,
                  width: 140,
                  height: 90,
                  borderRadius: 3,
                  backgroundColor: theme.palette.warning.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 4s ease-in-out infinite reverse',
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    24/7
                  </Typography>
                  <Typography variant="caption">
                    {t('landing.hero.support')}
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroSection;
