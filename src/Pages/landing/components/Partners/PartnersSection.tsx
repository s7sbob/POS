// File: src/Pages/landing/components/Partners/PartnersSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  useTheme,
  alpha,
  Avatar,
  Stack,
} from '@mui/material';
import {
  IconBrandPaypal,
  IconBrandStripe,
  IconBrandAmazon,
  IconBrandGoogle,
  IconBrandMinecraft,
  IconBrandApple,
  IconBrandSpotify,
  IconBrandFoursquare,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const PartnersSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const partners = [
    { name: 'PayPal', icon: IconBrandPaypal, color: '#0070ba' },
    { name: 'Stripe', icon: IconBrandStripe, color: '#635bff' },
    { name: 'Amazon', icon: IconBrandAmazon, color: '#ff9900' },
    { name: 'Google', icon: IconBrandGoogle, color: '#4285f4' },
    { name: 'Microsoft', icon: IconBrandMinecraft, color: '#00a1f1' },
    { name: 'Apple', icon: IconBrandApple, color: '#000000' },
    { name: 'Shopify', icon: IconBrandSpotify, color: '#7ab55c' },
    { name: 'Square', icon: IconBrandFoursquare, color: '#3e4348' },
  ];

  const testimonials = [
    {
      name: 'أحمد محمد',
      company: 'متجر الإلكترونيات الذكية',
      avatar: '/images/avatars/avatar1.jpg',
      rating: 5,
      text: t('landing.partners.testimonials.testimonial1'),
    },
    {
      name: 'Sarah Johnson',
      company: 'Fashion Boutique',
      avatar: '/images/avatars/avatar2.jpg',
      rating: 5,
      text: t('landing.partners.testimonials.testimonial2'),
    },
    {
      name: 'محمد علي',
      company: 'مطعم الأصالة',
      avatar: '/images/avatars/avatar3.jpg',
      rating: 5,
      text: t('landing.partners.testimonials.testimonial3'),
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth="xl">
        {/* Partners Section */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('landing.partners.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6, mb: 6 }}
          >
            {t('landing.partners.subtitle')}
          </Typography>

          {/* Partners Grid */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
            {partners.map((partner, index) => (
              <Grid item xs={6} sm={4} md={3} lg={1.5} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 32px ${alpha(partner.color, 0.2)}`,
                      '& .partner-icon': {
                        color: partner.color,
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <partner.icon
                    size={40}
                    className="partner-icon"
                    style={{
                      color: theme.palette.text.secondary,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            {t('landing.partners.testimonials.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6, mb: 6 }}
          >
            {t('landing.partners.testimonials.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <Stack spacing={3} height="100%">
                  {/* Stars */}
                  <Box>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Typography
                        key={i}
                        component="span"
                        sx={{ color: theme.palette.warning.main, fontSize: '1.2rem' }}
                      >
                        ★
                      </Typography>
                    ))}
                  </Box>

                  {/* Testimonial Text */}
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      flex: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>

                  {/* Author */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.company}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats */}
        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                10,000+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('landing.partners.stats.businesses')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                $50M+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('landing.partners.stats.processed')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                99.9%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('landing.partners.stats.satisfaction')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PartnersSection;
