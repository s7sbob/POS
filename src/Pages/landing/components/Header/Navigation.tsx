// File: src/Pages/landing/components/Header/Navigation.tsx
import React from 'react';
import {
  Box,
  Button,
  useTheme,
} from '@mui/material';

interface NavigationItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  onItemClick: (href: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ items, onItemClick }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {items.map((item) => (
        <Button
          key={item.href}
          onClick={() => onItemClick(item.href)}
          sx={{
            color: theme.palette.text.primary,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              transform: 'translateY(-1px)',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};

export default Navigation;
