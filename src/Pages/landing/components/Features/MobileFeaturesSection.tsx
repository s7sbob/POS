// File: src/Pages/landing/components/Features/MobileFeaturesSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Stack,
  Avatar,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import {
  IconCash,
  IconBarcode,
  IconUsers,
  IconChartBar,
  IconCloud,
  IconShield,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const MobileFeaturesSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const features = [
    {
      icon: IconCash,
      title: t('landing.features.pos.title'),
      description: t('landing.features.pos.description'),
      color: theme.palette.primary.main,
      highlights: [
        t('landing.features.pos.highlights.fast'),
        t('landing.features.pos.highlights.payment'),
        t('landing.features.pos.highlights.easy')
      ],
    },
    {
      icon: IconBarcode,
      title: t('landing.features.inventory.title'),
      description: t('landing.features.inventory.description'),
      color: theme.palette.secondary.main,
      highlights: [
        t('landing.features.inventory.highlights.realtime'),
        t('landing.features.inventory.highlights.alerts'),
        t('landing.features.inventory.highlights.reports')
      ],
    },
    {
      icon: IconUsers,
      title: t('landing.features.customers.title'),
      description: t('landing.features.customers.description'),
      color: theme.palette.success.main,
      highlights: [
        t('landing.features.customers.highlights.database'),
        t('landing.features.customers.highlights.loyalty'),
        t('landing.features.customers.highlights.discounts')
      ],
    },
    {
      icon: IconChartBar,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
      color: theme.palette.warning.main,
      highlights: [
        t('landing.features.analytics.highlights.advanced'),
        t('landing.features.analytics.highlights.insights'),
        t('landing.features.analytics.highlights.decisions')
      ],
    },
    {
      icon: IconCloud,
      title: t('landing.features.cloud.title'),
      description: t('landing.features.cloud.description'),
      color: theme.palette.info.main,
      highlights: [
        t('landing.features.cloud.highlights.secure'),
        t('landing.features.cloud.highlights.anywhere'),
        t('landing.features.cloud.highlights.backup')
      ],
    },
    {
      icon: IconShield,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description'),
      color: theme.palette.error.main,
      highlights: [
        t('landing.features.security.highlights.encryption'),
        t('landing.features.security.highlights.protection'),
        t('landing.features.security.highlights.guaranteed')
      ],
    },
  ];

  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 6, sm: 8 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.5)
          : theme.palette.background.paper,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: { xs: 4, sm: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              px: { xs: 1, sm: 0 },
            }}
          >
            {t('landing.features.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6,
              px: { xs: 2, sm: 1 },
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }}
          >
            {t('landing.features.subtitle')}
          </Typography>
        </Box>

        {/* Features Carousel for Mobile */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 4 }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            style={{ paddingBottom: '50px' }}
          >
            {features.slice(0, 4).map((feature, index) => (
              <SwiperSlide key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: 280,
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                    border: `1px solid ${alpha(feature.color, 0.2)}`,
                    mx: 1,
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={2} alignItems="center" textAlign="center" sx={{ flex: 1 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: alpha(feature.color, 0.1),
                          color: feature.color,
                        }}
                      >
                        <feature.icon size={28} />
                      </Avatar>

                      <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}
                      >
                        {feature.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        {feature.highlights.map((highlight, idx) => (
                          <Chip
                            key={idx}
                            label={highlight}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              height: 24,
                              borderColor: alpha(feature.color, 0.3),
                              color: feature.color,
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Expandable Features List */}
        <Stack spacing={2}>
          {features.map((feature, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(feature.color, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha(feature.color, 0.3),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box
                onClick={() => toggleFeature(index)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: alpha(feature.color, 0.1),
                      color: feature.color,
                    }}
                  >
                    <feature.icon size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ fontSize: '0.95rem' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {t('landing.features.mobile.clickForDetails')}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size="small">
                  <IconChevronDown
                    size={18}
                    style={{
                      transform: expandedFeature === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </IconButton>
              </Box>

              <Collapse in={expandedFeature === index}>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.5, fontSize: '0.9rem' }}
                  >
                    {feature.description}
                  </Typography>
                  <Stack spacing={1}>
                    {feature.highlights.map((highlight, idx) => (
                      <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <IconCheck size={16} color={feature.color} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {highlight}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default MobileFeaturesSection;
