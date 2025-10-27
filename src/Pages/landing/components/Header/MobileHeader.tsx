// File: src/Pages/landing/components/Header/MobileHeader.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  useTheme,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Typography,
  Avatar,
  alpha,
} from '@mui/material';
import {
  IconMenu2,
  IconX,
  IconLogin,
  IconMoon,
  IconSun,
  IconWorld,
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'src/store/Store';
import { AppState } from 'src/store/Store';
import { setDarkMode, setLanguage } from 'src/store/customizer/CustomizerSlice';
import Logo from 'src/layouts/full/shared/logo/Logo';

const MobileHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  // Determine tenantId so that mobile login button keeps tenant prefix
  const { tenantId } = useParams<{ tenantId: string }>();
  const dispatch = useDispatch();
  const customizer = useSelector((state: AppState) => state.customizer);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: t('landing.nav.home'), href: '#home', icon: '🏠' },
    { label: t('landing.nav.features'), href: '#features', icon: '⚡' },
    { label: t('landing.nav.about'), href: '#about', icon: '👥' },
    { label: t('landing.nav.pricing'), href: '#pricing', icon: '💰' },
    { label: t('landing.nav.contact'), href: '#contact', icon: '📞' },
  ];

  const handleSignIn = () => {
    if (tenantId) {
      navigate(`/${tenantId}/auth/login`);
    } else {
      navigate('auth/login');
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    dispatch(setLanguage(newLang));
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              py: 1,
              px: { xs: 1, sm: 2 },
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Logo />
            </Box>

            {/* Mobile Actions */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              {/* Language Toggle */}
              <IconButton
                onClick={toggleLanguage}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                  width: 36,
                  height: 36,
                }}
              >
                <IconWorld size={18} />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton
                onClick={() => dispatch(setDarkMode(customizer.activeMode === 'light' ? 'dark' : 'light'))}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                  width: 36,
                  height: 36,
                }}
              >
                {customizer.activeMode === 'light' ? (
                  <IconMoon size={18} />
                ) : (
                  <IconSun size={18} />
                )}
              </IconButton>

              {/* Sign In Button */}
              <Button
                variant="contained"
                size="small"
                startIcon={<IconLogin size={16} />}
                onClick={handleSignIn}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.85rem',
                  ml: 1,
                }}
              >
                {t('landing.header.mobile.signIn')}
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  ml: 0.5, 
                  color: theme.palette.text.primary,
                  width: 36,
                  height: 36,
                }}
              >
                <IconMenu2 size={20} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: 320,
            backgroundColor: theme.palette.background.paper,
            backgroundImage: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Logo />
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <IconX size={24} />
            </IconButton>
          </Stack>
        </Box>
        
        <Divider />

        {/* Navigation Items */}
        <List sx={{ px: 1, flex: 1 }}>
          {navigationItems.map((item, index) => (
            <ListItem
              key={item.href}
              component="button"
              onClick={() => scrollToSection(item.href)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <Box sx={{ mr: 2, fontSize: '1.2rem' }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Drawer Footer */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {/* Quick Actions */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconWorld size={16} />}
                onClick={toggleLanguage}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontSize: '0.8rem',
                }}
              >
                {t('landing.header.mobile.language')}
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={customizer.activeMode === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
                onClick={() => dispatch(setDarkMode(customizer.activeMode === 'light' ? 'dark' : 'light'))}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontSize: '0.8rem',
                }}
              >
                {t('landing.header.mobile.theme')}
              </Button>
            </Stack>

            {/* Main CTA */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<IconLogin size={18} />}
              onClick={handleSignIn}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {t('landing.header.signIn')}
            </Button>

            {/* App Info */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {t('landing.header.mobile.description')}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileHeader;
