// File: src/Pages/landing/components/Header/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  IconMenu2,
  IconX,
  IconLogin,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'src/store/Store';
import { AppState } from 'src/store/Store';
import { setDarkMode } from 'src/store/customizer/CustomizerSlice';
import Logo from 'src/layouts/full/shared/logo/Logo';
import Language from 'src/layouts/full/vertical/header/Language';
import Navigation from './Navigation';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const customizer = useSelector((state: AppState) => state.customizer);
   const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: t('landing.nav.home'), href: '#home' },
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.about'), href: '#about' },
    { label: t('landing.nav.pricing'), href: '#pricing' },
    { label: t('landing.nav.contact'), href: '#contact' },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

 const handleSignIn = () => {
    navigate('/auth/login');
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
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
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              py: 1,
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Logo />
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <Navigation items={navigationItems} onItemClick={scrollToSection} />
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Language />
              
              <IconButton
                onClick={() => dispatch(setDarkMode(customizer.activeMode === 'light' ? 'dark' : 'light'))}
                color="inherit"
                sx={{ color: theme.palette.text.primary }}
              >
                {customizer.activeMode === 'light' ? (
                  <IconMoon size={20} />
                ) : (
                  <IconSun size={20} />
                )}
              </IconButton>

              <Button
                variant="contained"
                color="primary"
                startIcon={<IconLogin size={18} />}
                onClick={handleSignIn}
                sx={{
                  ml: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                {t('landing.header.signIn')}
              </Button>

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleMobileMenuToggle}
                  sx={{ ml: 1, color: theme.palette.text.primary }}
                >
                  <IconMenu2 size={24} />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo />
          <IconButton onClick={handleMobileMenuToggle}>
            <IconX />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton onClick={() => scrollToSection(item.href)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
