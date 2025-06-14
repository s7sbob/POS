// File: src/pages/reports/components/ProductBalanceStats.tsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import {
  IconPackage,
  IconBuilding,
  IconAlertTriangle,
  IconCheck
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GroupedProductBalance } from 'src/utils/api/reportsApi';

interface Props {
  data: GroupedProductBalance[];
}

const ProductBalanceStats: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const stats = React.useMemo(() => {
    const totalProducts = new Set(data.map(item => item.productID)).size;
    const totalWarehouses = new Set(data.map(item => item.warehouseID)).size;
     const inStockProducts = data.filter(item => item.totalQuantity > 0).length;
    const outOfStockProducts = data.filter(item => item.totalQuantity === 0).length;
    return {
      totalProducts,
      totalWarehouses,
      inStockProducts,
      outOfStockProducts
    };
  }, [data]);

  const statCards = [
    {
      title: t('reports.stats.totalProducts'),
      value: stats.totalProducts,
      icon: IconPackage,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light + '20',
      isNumber: true
    },
    {
      title: t('reports.stats.totalWarehouses'),
      value: stats.totalWarehouses,
      icon: IconBuilding,
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light + '20',
      isNumber: true
    },
    {
      title: t('reports.stats.inStock'),
      value: stats.inStockProducts,
      icon: IconCheck,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + '20'
    },
    {
      title: t('reports.stats.outOfStock'),
      value: stats.outOfStockProducts,
      icon: IconAlertTriangle,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light + '20'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '75%' }}>
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    p: 0.5,
                    borderRadius: 1.5,
                    backgroundColor: stat.bgColor,
                    mr: 1
                  }}
                >
                  <stat.icon size={20} color={stat.color} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: stat.color, fontSize: '1.1rem' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductBalanceStats;
