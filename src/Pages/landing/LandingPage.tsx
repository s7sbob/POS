// File: src/Pages/landing/LandingPage.tsx
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from './components/Header/Header';
import HeroSection from './components/Hero/HeroSection';
import FeaturesSection from './components/Features/FeaturesSection';
import AboutSection from './components/About/AboutSection';
import PricingSection from './components/Pricing/PricingSection';
import PartnersSection from './components/Partners/PartnersSection';
import ContactSection from './components/Contact/ContactSection';
import Footer from './components/Footer/Footer';

const LandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <CssBaseline />
      <Header />
      <Box component="main">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <PricingSection />
        <PartnersSection />
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
