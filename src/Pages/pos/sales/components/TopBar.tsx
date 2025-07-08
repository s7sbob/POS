// File: src/pages/pos/sales/components/TopBar.tsx
import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, useMediaQuery, Theme
} from '@mui/material';
import { 
  IconShoppingCart, IconDiscount, IconReceipt, 
  IconTable, IconSettings 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Logo from 'src/layouts/full/shared/logo/Logo';

const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        height: '100%'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        height: '100%',
        minHeight: 'unset !important'
      }}>

        <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
          <Logo />
        </Box>

        {/* Center Buttons */}
        <Box sx={{ display: 'flex', gap: '1vw' }}>
          <Button
            startIcon={<IconShoppingCart size="1.2vw" />}
            variant="outlined"
            sx={{ 
              borderColor: '#2196F3',
              color: '#2196F3',
              fontSize: '0.8vw',
              padding: '0.5vh 1vw',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            {t('pos.todayOrders')}
          </Button>
          
          <Button
            startIcon={<IconTable size="1.2vw" />}
            variant="outlined"
            sx={{ 
              borderColor: '#2196F3',
              color: '#2196F3',
              fontSize: '0.8vw',
              padding: '0.5vh 1vw',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            {t('pos.table')}
          </Button>
          
          <Button
            startIcon={<IconDiscount size="1.2vw" />}
            variant="outlined"
            sx={{ 
              borderColor: '#2196F3',
              color: '#2196F3',
              fontSize: '0.8vw',
              padding: '0.5vh 1vw',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            {t('pos.discount')}
          </Button>
          
          <Button
            startIcon={<IconReceipt size="1.2vw" />}
            variant="outlined"
            sx={{ 
              borderColor: '#2196F3',
              color: '#2196F3',
              fontSize: '0.8vw',
              padding: '0.5vh 1vw',
              '&:hover': { backgroundColor: '#e3f2fd' }
            }}
          >
            {t('pos.void')}
          </Button>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
          <Typography sx={{ 
            color: 'text.secondary',
            fontSize: '0.8vw'
          }}>
            {t('pos.takeaway')}
          </Typography>
          <IconButton>
            <IconSettings size="1.5vw" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
