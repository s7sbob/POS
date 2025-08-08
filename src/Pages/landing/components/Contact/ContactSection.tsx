// File: src/Pages/landing/components/Contact/ContactSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconSend,
  IconClock,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: IconMail,
      title: t('landing.contact.info.email.title'),
      value: 'info@posystem.com',
      description: t('landing.contact.info.email.description'),
      color: theme.palette.primary.main,
    },
    {
      icon: IconPhone,
      title: t('landing.contact.info.phone.title'),
      value: '+1 (555) 123-4567',
      description: t('landing.contact.info.phone.description'),
      color: theme.palette.secondary.main,
    },
    {
      icon: IconMapPin,
      title: t('landing.contact.info.address.title'),
      value: t('landing.contact.info.address.value'),
      description: t('landing.contact.info.address.description'),
      color: theme.palette.success.main,
    },
    {
      icon: IconClock,
      title: t('landing.contact.info.hours.title'),
      value: t('landing.contact.info.hours.value'),
      description: t('landing.contact.info.hours.description'),
      color: theme.palette.warning.main,
    },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitting(false);
      setShowSuccess(true);
      reset();
    }, 2000);
  };

  return (
    <Box
      id="contact"
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
            {t('landing.contact.title')}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            {t('landing.contact.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Contact Info */}
          <Grid item xs={12} lg={5}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h4" fontWeight="600" sx={{ mb: 2 }}>
                  {t('landing.contact.getInTouch')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, mb: 4 }}>
                  {t('landing.contact.description')}
                </Typography>
              </Box>

              <Stack spacing={3}>
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(info.color, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        boxShadow: `0 8px 32px ${alpha(info.color, 0.15)}`,
                        borderColor: alpha(info.color, 0.4),
                      },
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: alpha(info.color, 0.1),
                          color: info.color,
                        }}
                      >
                        <info.icon size={24} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                          {info.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          sx={{ mb: 0.5, color: theme.palette.text.primary }}
                        >
                          {info.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {info.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} lg={7}>
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.8)
                  : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="600" sx={{ mb: 2 }}>
                  {t('landing.contact.form.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('landing.contact.form.description')}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('landing.contact.form.firstName')}
                      fullWidth
                      {...register('firstName', { required: t('landing.contact.form.validation.firstNameRequired') })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message?.toString()}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('landing.contact.form.lastName')}
                      fullWidth
                      {...register('lastName', { required: t('landing.contact.form.validation.lastNameRequired') })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message?.toString()}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('landing.contact.form.email')}
                      type="email"
                      fullWidth
                      {...register('email', { 
                        required: t('landing.contact.form.validation.emailRequired'),
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: t('landing.contact.form.validation.emailInvalid')
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message?.toString()}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('landing.contact.form.phone')}
                      fullWidth
                      {...register('phone')}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t('landing.contact.form.company')}
                      fullWidth
                      {...register('company')}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t('landing.contact.form.message')}
                      multiline
                      rows={4}
                      fullWidth
                      {...register('message', { required: t('landing.contact.form.validation.messageRequired') })}
                      error={!!errors.message}
                      helperText={errors.message?.message?.toString()}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      endIcon={<IconSend size={18} />}
                      disabled={isSubmitting}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                      }}
                    >
                      {isSubmitting ? t('landing.contact.form.sending') : t('landing.contact.form.send')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Card
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
              <IconMessageCircle size={28} />
            </Avatar>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
              {t('landing.contact.cta.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              {t('landing.contact.cta.description')}
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('landing.contact.cta.schedule')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('landing.contact.cta.demo')}
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {t('landing.contact.form.success')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection;
