// File: src/Pages/landing/components/Pricing/PricingSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
  alpha,
} from '@mui/material';
import {
  IconCheck,
  IconStar,
  IconArrowRight,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      name: t('landing.pricing.plans.starter.name'),
      description: t('landing.pricing.plans.starter.description'),
      monthlyPrice: 29,
      yearlyPrice: 290,
      isPopular: false,
      features: [
        { included: true, text: t('landing.pricing.features.singleStore') },
        { included: true, text: t('landing.pricing.features.basicPOS') },
        { included: true, text: t('landing.pricing.features.inventory') },
        { included: true, text: t('landing.pricing.features.basicReports') },
        { included: true, text: t('landing.pricing.features.emailSupport') },
        { included: false, text: t('landing.pricing.features.multiStore') },
        { included: false, text: t('landing.pricing.features.advancedReports') },
        { included: false, text: t('landing.pricing.features.api') },
      ],
    },
    {
      name: t('landing.pricing.plans.professional.name'),
      description: t('landing.pricing.plans.professional.description'),
      monthlyPrice: 79,
      yearlyPrice: 790,
      isPopular: true,
      features: [
        { included: true, text: t('landing.pricing.features.multiStore') },
        { included: true, text: t('landing.pricing.features.advancedPOS') },
        { included: true, text: t('landing.pricing.features.fullInventory') },
        { included: true, text: t('landing.pricing.features.advancedReports') },
        { included: true, text: t('landing.pricing.features.prioritySupport') },
        { included: true, text: t('landing.pricing.features.api') },
        { included: true, text: t('landing.pricing.features.customization') },
        { included: false, text: t('landing.pricing.features.whiteLabel') },
      ],
    },
    {
      name: t('landing.pricing.plans.enterprise.name'),
      description: t('landing.pricing.plans.enterprise.description'),
      monthlyPrice: 199,
      yearlyPrice: 1990,
      isPopular: false,
      features: [
        { included: true, text: t('landing.pricing.features.unlimitedStores') },
        { included: true, text: t('landing.pricing.features.enterprisePOS') },
        { included: true, text: t('landing.pricing.features.fullSuite') },
        { included: true, text: t('landing.pricing.features.customReports') },
        { included: true, text: t('landing.pricing.features.dedicatedSupport') },
        { included: true, text: t('landing.pricing.features.fullAPI') },
        { included: true, text: t('landing.pricing.features.whiteLabel') },
        { included: true, text: t('landing.pricing.features.onPremise') },
      ],
    },
  ];

  const handleGetStarted = (planName: string) => {
    navigate('/auth/login');
  };

  return (
    <Box
      id="pricing"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.5)
          : theme.palette.background.paper,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
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
            {t('landing.pricing.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6, mb: 4 }}
          >
            {t('landing.pricing.subtitle')}
          </Typography>

          {/* Billing Toggle */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Typography variant="body1" color={!isYearly ? 'primary.main' : 'text.secondary'}>
              {t('landing.pricing.monthly')}
            </Typography>
            <Switch
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
              color="primary"
            />
            <Typography variant="body1" color={isYearly ? 'primary.main' : 'text.secondary'}>
              {t('landing.pricing.yearly')}
            </Typography>
            <Chip
              label={t('landing.pricing.save20')}
              size="small"
              color="success"
              sx={{ ml: 1 }}
            />
          </Stack>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={plan.isPopular ? 8 : 0}
                sx={{
                  height: '100%',
                  position: 'relative',
                  borderRadius: 4,
                  border: plan.isPopular 
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  background: plan.isPopular
                    ? theme.palette.mode === 'dark'
                      ? `linear-gradient(145deg, ${alpha(theme.palette.primary.dark, 0.1)}, ${alpha(theme.palette.background.paper, 0.9)})`
                      : `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.05)}, #ffffff)`
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                {plan.isPopular && (
                  <Chip
                    label={t('landing.pricing.mostPopular')}
                    color="primary"
                    icon={<IconStar size={16} />}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 600,
                    }}
                  />
                )}

                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    {/* Plan Header */}
                    <Box textAlign="center">
                      <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {plan.description}
                      </Typography>

                      {/* Price */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h3"
                          fontWeight="800"
                          sx={{
                            color: plan.isPopular ? theme.palette.primary.main : theme.palette.text.primary,
                          }}
                        >
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1rem', fontWeight: 400 }}
                          >
                            /{isYearly ? t('landing.pricing.year') : t('landing.pricing.month')}
                          </Typography>
                        </Typography>
                        {isYearly && (
                          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                            {t('landing.pricing.saveAmount', { 
                              amount: (plan.monthlyPrice * 12 - plan.yearlyPrice).toString() 
                            })}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Features */}
                    <List sx={{ p: 0 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {feature.included ? (
                              <IconCheck size={20} color={theme.palette.success.main} />
                            ) : (
                              <IconX size={20} color={theme.palette.text.disabled} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={feature.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.875rem',
                                color: feature.included ? theme.palette.text.primary : theme.palette.text.disabled,
                                textDecoration: feature.included ? 'none' : 'line-through',
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA Button */}
                    <Button
                      variant={plan.isPopular ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                      endIcon={<IconArrowRight size={18} />}
                      onClick={() => handleGetStarted(plan.name)}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        ...(plan.isPopular && {
                          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover': {
                            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                          },
                        }),
                      }}
                    >
                      {t('landing.pricing.getStarted')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Section */}
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
            {t('landing.pricing.needCustom.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            {t('landing.pricing.needCustom.description')}
          </Typography>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('landing.pricing.contactSales')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingSection;
