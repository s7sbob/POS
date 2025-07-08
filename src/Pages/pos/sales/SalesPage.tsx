// File: src/pages/pos/sales/SalesPage.tsx
import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductGrid from './components/ProductGrid';
import CategorySidebar from './components/CategorySidebar';
import OrderSummary from './components/OrderSummary';
import TopBar from './components/TopBar';
import NumberPadBar from './components/NumberPadBar';
import ActionButtonsBar from './components/ActionButtonsBar';

const SalesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      width: '100vw',
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* Top Bar - 8% من الارتفاع */}
      <Box sx={{ 
        width: '100%',
        height: '8vh',
        flexShrink: 0
      }}>
        <TopBar />
      </Box>
      
      {/* Main Content - 92% من الارتفاع */}
      <Box sx={{ 
        width: '100%',
        height: '92vh',
        display: 'flex',
        flexDirection: 'row'
      }}>
        {/* Products Area - 70% من العرض */}
        <Box sx={{ 
          width: '72vw',
          height: '100%',
          display: 'flex', 
          flexDirection: 'column'
        }}>
          {/* Number Pad Bar - 15% من ارتفاع المنطقة */}
          <Box sx={{ 
            width: '100%',
            height: '10%',
            flexShrink: 0
          }}>
            <NumberPadBar />
          </Box>
          
          {/* Action Buttons Bar - 10% من ارتفاع المنطقة */}
          <Box sx={{ 
            width: '100%',
            height: '10%',
            flexShrink: 0
          }}>
            <ActionButtonsBar />
          </Box>
          
          {/* Products Grid - 75% من ارتفاع المنطقة */}
          <Box sx={{ 
            width: '100%',
            height: '80%'
          }}>
            <ProductGrid />
          </Box>
        </Box>

        {/* Category Sidebar - 10% من العرض */}
        <Box sx={{ 
          width: '8vw',
          height: '100%'
        }}>
          <CategorySidebar />
        </Box>

        {/* Order Summary - 20% من العرض */}
        <Box sx={{ 
          width: '20vw',
          height: '100%'
        }}>
          <OrderSummary />
        </Box>
      </Box>
    </Box>
  );
};

export default SalesPage;
