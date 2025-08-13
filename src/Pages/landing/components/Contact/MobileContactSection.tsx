// File: src/Pages/landing/components/Contact/MobileContactSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
} from '@mui/material';
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconSend,
  IconClock,
  IconMessageCircle,
  IconChevronDown,
  IconBrandWhatsapp,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

const MobileContactSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expanded, setExpanded] = useState<string | false>('form');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: IconMail,
      title: t('landing.contact.info.email.title'),
      value: 'info@posystem.com',
      description: t('landing.contact.info.email.description'),
      color: theme.palette.primary.main,
      action: () => window.location.href = 'mailto:info@posystem.com',
    },
    {
      icon: IconPhone,
      title: t('landing.contact.info.phone.title'),
      value: '+1 (555) 123-4567',
      description: t('landing.contact.info.phone.description'),
      color: theme.palette.secondary.main,
      action: () => window.location.href = 'tel:+15551234567',
    },
    {
      icon: IconMapPin,
      title: t('landing.contact.info.address.title'),
      value: t('landing.contact.info.address.value'),
      description: t('landing.contact.info.address.description'),
      color: theme.palette.success.main,
      action: () => window.open('https://maps.google.com', '_blank'),
    },
  ];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitting(false);
      setShowSuccess(true);
      reset();
      setExpanded('success');
    }, 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/15551234567', '_blank');
  };

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 6, sm: 8 },
        backgroundColor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.5)
          : theme.palette.background.paper,
        position: 'relative',
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
            {t('landing.contact.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 },
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }}
          >
            {t('landing.contact.subtitle')}
          </Typography>
        </Box>

        {/* Contact Methods - Quick Access */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              elevation={0}
              onClick={info.action}
              sx={{
                p: 2,
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(info.color, 0.2)}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 32px ${alpha(info.color, 0.15)}`,
                  borderColor: alpha(info.color, 0.4),
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: alpha(info.color, 0.1),
                    color: info.color,
                  }}
                >
                  <info.icon size={20} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: '0.9rem' }}>
                    {info.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="500"
                    sx={{ color: theme.palette.text.primary, fontSize: '0.85rem' }}
                  >
                    {info.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* Expandable Sections */}
        <Stack spacing={2}>
          {/* Contact Form */}
          <Accordion 
            expanded={expanded === 'form'} 
            onChange={() => setExpanded(expanded === 'form' ? false : 'form')}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<IconChevronDown />}
              sx={{
                borderRadius: 4,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2,
                }}
              >
                <IconMessageCircle size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
                  {t('landing.contact.form.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {t('landing.contact.mobile.sendDetailedMessage')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label={t('landing.contact.form.firstName')}
                      size="small"
                      fullWidth
                      {...register('firstName', { required: t('landing.contact.form.validation.firstNameRequired') })}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message?.toString()}
                      disabled={isSubmitting}
                    />
                    <TextField
                      label={t('landing.contact.form.lastName')}
                      size="small"
                      fullWidth
                      {...register('lastName', { required: t('landing.contact.form.validation.lastNameRequired') })}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message?.toString()}
                      disabled={isSubmitting}
                    />
                  </Stack>
                  
                  <TextField
                    label={t('landing.contact.form.email')}
                    type="email"
                    size="small"
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
                  
                  <TextField
                    label={t('landing.contact.form.phone')}
                    size="small"
                    fullWidth
                    {...register('phone')}
                    disabled={isSubmitting}
                  />
                  
                  <TextField
                    label={t('landing.contact.form.message')}
                    multiline
                    rows={3}
                    size="small"
                    fullWidth
                    {...register('message', { required: t('landing.contact.form.validation.messageRequired') })}
                    error={!!errors.message}
                    helperText={errors.message?.message?.toString()}
                    disabled={isSubmitting}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    endIcon={<IconSend size={16} />}
                    disabled={isSubmitting}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    {isSubmitting ? t('landing.contact.form.sending') : t('landing.contact.form.send')}
                  </Button>
                </Stack>
              </form>
            </AccordionDetails>
          </Accordion>

          {/* Business Hours */}
          <Accordion 
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<IconChevronDown />}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mr: 2,
                }}
              >
                <IconClock size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1rem' }}>
                  {t('landing.contact.info.hours.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {t('landing.contact.mobile.workingHoursAndResponse')}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {t('landing.contact.mobile.workingHours')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('landing.contact.info.hours.value')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {t('landing.contact.mobile.messageResponse')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('landing.contact.mobile.responseTime')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {t('landing.contact.mobile.emergencySupport')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('landing.contact.mobile.emergencyAvailability')}
                  </Typography>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Container>

      {/* Floating WhatsApp Button */}
      <Fab
        color="success"
        onClick={handleWhatsApp}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <IconBrandWhatsapp size={28} />
      </Fab>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)} sx={{ borderRadius: 2 }}>
          {t('landing.contact.form.success')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobileContactSection;
