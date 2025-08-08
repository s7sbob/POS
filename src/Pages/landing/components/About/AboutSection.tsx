// File: src/Pages/landing/components/About/AboutSection.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  useTheme,
  alpha,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  IconTarget,
  IconEye,
  IconHeart,
  IconAward,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const values = [
    {
      icon: IconTarget,
      title: t('landing.about.values.mission.title'),
      description: t('landing.about.values.mission.description'),
    },
    {
      icon: IconEye,
      title: t('landing.about.values.vision.title'),
      description: t('landing.about.values.vision.description'),
    },
    {
      icon: IconHeart,
      title: t('landing.about.values.passion.title'),
      description: t('landing.about.values.passion.description'),
    },
  ];

  const achievements = [
    {
      icon: IconAward,
      value: '5+',
      label: t('landing.about.achievements.experience'),
      progress: 100,
    },
    {
      icon: IconUsers,
      value: '10K+',
      label: t('landing.about.achievements.customers'),
      progress: 85,
    },
    {
      icon: IconTrendingUp,
      value: '99.9%',
      label: t('landing.about.achievements.uptime'),
      progress: 95,
    },
  ];

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={8} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <Stack spacing={4}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 700,
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('landing.about.title')}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, mb: 4 }}
                >
                  {t('landing.about.description')}
                </Typography>
              </Box>

              {/* Company Values */}
              <Stack spacing={3}>
                {values.map((value, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(10px)',
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <value.icon size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                          {value.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {value.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right Content - Achievements */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                fontWeight="700"
                sx={{ mb: 6, color: theme.palette.text.primary }}
              >
                {t('landing.about.achievements.title')}
              </Typography>

              <Grid container spacing={4}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.8)
                          : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        <achievement.icon size={28} />
                      </Avatar>

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
                        {achievement.value}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, fontWeight: 500 }}
                      >
                        {achievement.label}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Company Story */}
              <Card
                elevation={0}
                sx={{
                  mt: 6,
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.primary.light, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  {t('landing.about.story.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('landing.about.story.content')}
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
