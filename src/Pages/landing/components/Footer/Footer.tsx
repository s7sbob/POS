// File: src/Pages/landing/components/Footer/Footer.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Link,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUp,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Logo from 'src/layouts/full/shared/logo/Logo';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const footerLinks = {
    product: [
      { label: t('landing.footer.product.features'), href: '#features' },
      { label: t('landing.footer.product.pricing'), href: '#pricing' },
      { label: t('landing.footer.product.integrations'), href: '#' },
      { label: t('landing.footer.product.api'), href: '#' },
      { label: t('landing.footer.product.security'), href: '#' },
    ],
    company: [
      { label: t('landing.footer.company.about'), href: '#about' },
      { label: t('landing.footer.company.careers'), href: '#' },
      { label: t('landing.footer.company.blog'), href: '#' },
      { label: t('landing.footer.company.news'), href: '#' },
      { label: t('landing.footer.company.investors'), href: '#' },
    ],
    support: [
      { label: t('landing.footer.support.help'), href: '#' },
      { label: t('landing.footer.support.documentation'), href: '#' },
      { label: t('landing.footer.support.contact'), href: '#contact' },
      { label: t('landing.footer.support.training'), href: '#' },
      { label: t('landing.footer.support.status'), href: '#' },
    ],
    legal: [
      { label: t('landing.footer.legal.privacy'), href: '#' },
      { label: t('landing.footer.legal.terms'), href: '#' },
      { label: t('landing.footer.legal.cookies'), href: '#' },
      { label: t('landing.footer.legal.licenses'), href: '#' },
    ],
  };

  const socialLinks = [
    { icon: IconBrandFacebook, href: '#', color: '#1877f2' },
    { icon: IconBrandTwitter, href: '#', color: '#1da1f2' },
    { icon: IconBrandLinkedin, href: '#', color: '#0077b5' },
    { icon: IconBrandInstagram, href: '#', color: '#e4405f' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'white',
        pt: 8,
        pb: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box>
                <Logo />
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.7, maxWidth: 350 }}>
                {t('landing.footer.description')}
              </Typography>
              
              {/* Contact Info */}
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconMail size={18} />
                  <Typography variant="body2">info@posystem.com</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconPhone size={18} />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <IconMapPin size={18} style={{ marginTop: 2 }} />
                  <Typography variant="body2">
                    {t('landing.footer.address')}
                  </Typography>
                </Stack>
              </Stack>

              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component={Link}
                    href={social.href}
                    sx={{
                      color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        color: social.color,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <social.icon size={20} />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={3}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  {t('landing.footer.product.title')}
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.product.map((link, index) => (
                    <Link
                      key={index}
                      component="button"
                      variant="body2"
                      onClick={() => handleLinkClick(link.href)}
                      sx={{
                        color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  {t('landing.footer.company.title')}
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.company.map((link, index) => (
                    <Link
                      key={index}
                      component="button"
                      variant="body2"
                      onClick={() => handleLinkClick(link.href)}
                      sx={{
                        color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  {t('landing.footer.support.title')}
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.support.map((link, index) => (
                    <Link
                      key={index}
                      component="button"
                      variant="body2"
                      onClick={() => handleLinkClick(link.href)}
                      sx={{
                        color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  {t('landing.footer.legal.title')}
                </Typography>
                <Stack spacing={2}>
                  {footerLinks.legal.map((link, index) => (
                    <Link
                      key={index}
                      component="button"
                      variant="body2"
                      onClick={() => handleLinkClick(link.href)}
                      sx={{
                        color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.common.white, 0.1) }} />

        {/* Bottom Footer */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t('landing.footer.copyright')}
          </Typography>
          
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t('landing.footer.madeWith')} ❤️ {t('landing.footer.madeIn')}
            </Typography>
          </Stack>
        </Stack>
      </Container>

      {/* Scroll to Top Button */}
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            transform: 'translateY(-2px)',
          },
          zIndex: 1000,
        }}
      >
        <IconArrowUp size={24} />
      </IconButton>
    </Box>
  );
};

export default Footer;
