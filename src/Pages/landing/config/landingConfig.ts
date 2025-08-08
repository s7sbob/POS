// File: src/Pages/landing/config/landingConfig.ts
export const landingConfig = {
  hero: {
    animationDuration: 6000,
    typingSpeed: 100,
  },
  features: {
    itemsPerRow: {
      xs: 1,
      sm: 2,
      lg: 3,
    },
  },
  testimonials: {
    autoplaySpeed: 5000,
    showDots: true,
  },
  contact: {
    maxMessageLength: 500,
    requiredFields: ['firstName', 'lastName', 'email', 'message'],
  },
  animations: {
    fadeInDuration: 0.6,
    slideInDuration: 0.8,
    hoverTransition: 0.3,
  },
};
