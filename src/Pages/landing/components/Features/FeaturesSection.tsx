// File: src/Pages/landing/components/Features/FeaturesSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Stack,
  Avatar,
} from '@mui/material';
import {
    IconCash,
    IconBarcode,
    IconUsers,
    IconChartBar,
    IconCloud,
    IconShield,
    IconDevices,
    IconHeadset,
    IconPalette,
} from '@tabler/icons-react';

const IconSupport = IconHeadset;
import { useTranslation } from 'react-i18next';

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: IconCash,
      title: t('landing.features.pos.title'),
      description: t('landing.features.pos.description'),
      color: theme.palette.primary.main,
    },
    {
      icon: IconBarcode,
      title: t('landing.features.inventory.title'),
      description: t('landing.features.inventory.description'),
      color: theme.palette.secondary.main,
    },
    {
      icon: IconUsers,
      title: t('landing.features.customers.title'),
      description: t('landing.features.customers.description'),
      color: theme.palette.success.main,
    },
    {
      icon: IconChartBar,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
      color: theme.palette.warning.main,
    },
    {
      icon: IconCloud,
      title: t('landing.features.cloud.title'),
      description: t('landing.features.cloud.description'),
      color: theme.palette.info.main,
    },
    {
      icon: IconShield,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description'),
      color: theme.palette.error.main,
    },
    {
      icon: IconDevices,
      title: t('landing.features.multiplatform.title'),
      description: t('landing.features.multiplatform.description'),
      color: theme.palette.primary.main,
    },
    {
      icon: IconSupport,
      title: t('landing.features.support.title'),
      description: t('landing.features.support.description'),
      color: theme.palette.secondary.main,
    },
    {
      icon: IconPalette,
      title: t('landing.features.customization.title'),
      description: t('landing.features.customization.description'),
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.5)
          : theme.palette.background.paper,
      }}
    >
      <Container maxWidth="xl">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            {t('landing.features.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            {t('landing.features.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                    borderColor: alpha(feature.color, 0.3),
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Stack spacing={3}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      <feature.icon size={28} />
                    </Avatar>

                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            {t('landing.features.cta.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('landing.features.cta.subtitle')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
