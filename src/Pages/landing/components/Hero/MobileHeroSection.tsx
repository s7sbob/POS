// File: src/Pages/landing/components/Hero/MobileHeroSection.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  useTheme,
  alpha,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  IconArrowRight,
  IconPray,
  IconStar,
  IconUsers,
  IconBuildingStore,
  IconChartBar,
  IconChevronDown,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MobileHeroSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const stats = [
    { icon: IconUsers, value: '10,000+', label: t('landing.hero.stats.users') },
    { icon: IconBuildingStore, value: '500+', label: t('landing.hero.stats.stores') },
    { icon: IconChartBar, value: '99.9%', label: t('landing.hero.stats.uptime') },
  ];

  const handleGetStarted = () => {
    navigate('/auth/login');
  };

  return (
    <Box
      id="home"
      sx={{
        pt: { xs: 10, sm: 12 },
        pb: { xs: 6, sm: 8 },
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
          : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: { xs: 80, sm: 120 },
          height: { xs: 80, sm: 120 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          filter: 'blur(20px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '8%',
          width: { xs: 60, sm: 100 },
          height: { xs: 60, sm: 100 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          filter: 'blur(15px)',
          animation: 'float 6s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 3, sm: 4 }} alignItems="center" textAlign="center">
          {/* Badge */}
          <Chip
            label={t('landing.hero.badge')}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 20,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
              animation: 'pulse 3s infinite',
            }}
          />

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.2rem', sm: '2.8rem' },
              fontWeight: 800,
              lineHeight: { xs: 1.1, sm: 1.2 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              px: { xs: 1, sm: 0 },
            }}
          >
            {t('landing.hero.title')}
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              lineHeight: { xs: 1.5, sm: 1.6 },
              px: { xs: 1, sm: 2 },
              maxWidth: { xs: '100%', sm: 400 },
            }}
          >
            {t('landing.hero.subtitle')}
          </Typography>

          {/* CTA Buttons - Mobile Optimized */}
          <Stack
            spacing={2}
            sx={{ 
              width: '100%', 
              px: { xs: 1, sm: 0 },
              mt: { xs: 3, sm: 4 } 
            }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<IconArrowRight size={18} />}
              onClick={handleGetStarted}
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
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
              fullWidth
              startIcon={<IconPray size={18} />}
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
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

          {/* Stats - Collapsible on Mobile */}
          <Box sx={{ width: '100%', mt: { xs: 4, sm: 6 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                mb: 2,
              }}
              onClick={() => setExpanded(!expanded)}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {expanded ? t('landing.hero.mobile.hideStats') : t('landing.hero.mobile.showStats')}
              </Typography>
              <IconButton size="small">
                <IconChevronDown 
                  size={16} 
                  style={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }} 
                />
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Stack spacing={3}>
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <stat.icon size={20} />
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Collapse>
          </Box>

          {/* Mobile Dashboard Preview */}
          <Card
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 300,
              borderRadius: 4,
              overflow: 'hidden',
              mt: { xs: 4, sm: 6 },
              transform: 'perspective(800px) rotateY(-2deg) rotateX(2deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'perspective(800px) rotateY(0deg) rotateX(0deg)',
              },
            }}
          >
            <Box
              sx={{
                height: 250,
                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.light, 0.1)})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Simulated Mobile Dashboard */}
              <Box sx={{ width: '85%', height: '85%', p: 1 }}>
                <Box
                  sx={{
                    height: 30,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1.5,
                    mb: 1.5,
                  }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
                  {[1, 2, 3, 4].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        height: 50,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        borderRadius: 1.5,
                      }}
                    />
                  ))}
                </Box>
                <Box
                  sx={{
                    height: 120,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 1.5,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
              </Box>

              {/* Floating Success Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  animation: 'pulse 2s infinite',
                }}
              >
                <IconStar size={18} />
              </Box>
            </Box>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default MobileHeroSection;
