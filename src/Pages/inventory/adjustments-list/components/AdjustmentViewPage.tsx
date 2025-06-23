// File: src/pages/inventory/adjustment-view/AdjustmentViewPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Stack,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IconArrowLeft, IconHome } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as adjustmentApi from 'src/utils/api/pagesApi/inventoryAdjustmentApi';
import * as warehousesApi from 'src/utils/api/pagesApi/warehousesApi';
import AdjustmentViewTable from './AdjustmentViewTable';
import AdjustmentViewCards from './AdjustmentViewCards';

const AdjustmentViewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [adjustment, setAdjustment] = useState<adjustmentApi.InventoryAdjustment | null>(null);
  const [warehouseName, setWarehouseName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');

  useEffect(() => {
    if (id) {
      loadAdjustment(id);
    }
  }, [id]);

  const loadAdjustment = async (adjustmentId: string) => {
    try {
      setLoading(true);
      
      const adjustmentData = await adjustmentApi.getAdjustmentById(adjustmentId);
      setAdjustment(adjustmentData);
      
      if (adjustmentData.warehouseId) {
        try {
          const warehouses = await warehousesApi.getAll();
          const warehouse = warehouses.find((w: { id: string; }) => w.id === adjustmentData.warehouseId);
          setWarehouseName(warehouse?.name || 'مخزن غير معروف');
        } catch (warehouseError) {
          console.error('Error loading warehouse:', warehouseError);
          setWarehouseName('مخزن غير معروف');
        }
      }
      
    } catch (error) {
      console.error('Error loading adjustment:', error);
      setAlertMessage(t('adjustment.errors.loadAdjustmentFailed'));
      setAlertSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const getAdjustmentTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return t('adjustments.types.new');
      case 1:
        return t('adjustment.types.openingBalance');
      case 2:
        return t('adjustment.types.manualAdjustment');
      default:
        return t('adjustment.types.unknown');
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: t('adjustments.status.saved'), color: 'warning' as const };
      case 3:
        return { label: t('adjustments.status.submitted'), color: 'success' as const };
      default:
        return { label: t('adjustments.status.unknown'), color: 'default' as const };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') {
      return '-';
    }
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: { xs: '40vh', sm: '50vh' }
        }}>
          <CircularProgress />
          <Typography sx={{ ml: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {t('common.loading')}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!adjustment) {
    return (
      <Container 
        maxWidth={false} 
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 }
        }}
      >
        <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 } }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            color="error"
            sx={{ mb: { xs: 1, sm: 2 } }}
          >
            {t('adjustment.errors.notFound')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft size={isMobile ? 16 : 20} />}
            onClick={() => navigate('/inventory/inventory-adjustments')}
            size={isMobile ? 'medium' : 'large'}
          >
            {t('common.back')}
          </Button>
        </Box>
      </Container>
    );
  }

  const statusInfo = getStatusLabel(adjustment.status);

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        maxWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Breadcrumbs sx={{ 
          mb: { xs: 1, sm: 2 },
          '& .MuiBreadcrumbs-separator': {
            mx: { xs: 0.5, sm: 1 }
          }
        }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/inventory');
            }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            <IconHome size={isMobile ? 14 : 16} style={{ marginRight: 4 }} />
            {t('inventory.title')}
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/inventory/inventory-adjustments');
            }}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {t('adjustments.list.title')}
          </Link>
          <Typography 
            color="text.primary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {t('adjustments.view.title')}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 1, sm: 2 },
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            {t('adjustments.view.title')}
          </Typography>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 24, sm: 32 }
            }}
          />
        </Box>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft size={isMobile ? 16 : 20} />}
            onClick={() => navigate('/inventory/inventory-adjustments')}
            fullWidth={isMobile}
            size={isMobile ? 'medium' : 'large'}
            sx={{
              minHeight: { xs: 44, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {t('common.back')}
          </Button>
        </Stack>
      </Box>

      {/* معلومات التسوية */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 }
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ 
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '1.125rem', sm: '1.5rem' }
          }}
        >
          {t('adjustments.view.adjustmentInfo')}
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustments.table.adjustmentId')}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                fontFamily: 'monospace',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                wordBreak: 'break-all'
              }}
            >
              {adjustment.adjustmentId}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustments.table.warehouse')}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {warehouseName}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                wordBreak: 'break-all'
              }}
            >
              ID: {adjustment.warehouseId}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustment.form.adjustmentType')}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {getAdjustmentTypeLabel(adjustment.adjustmentType)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustments.table.date')}
            </Typography>
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {formatDate(adjustment.adjustmentDate)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustment.form.referenceNumber')}
            </Typography>
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {adjustment.referenceNumber || '-'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {t('adjustment.form.reason')}
            </Typography>
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {adjustment.reason || '-'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* جدول الأصناف */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 }
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ 
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '1.125rem', sm: '1.5rem' }
          }}
        >
          {t('adjustment.form.items')} ({adjustment.details.length})
        </Typography>
        
        {adjustment.details.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 4 } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {t('adjustment.form.noItems')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            width: '100%',
            overflow: 'hidden'
          }}>
            {isMobile ? (
              <AdjustmentViewCards details={adjustment.details} />
            ) : (
              <AdjustmentViewTable details={adjustment.details} />
            )}
          </Box>
        )}

        {/* ملخص التسوية */}
        {adjustment.details.length > 0 && (
          <Box sx={{ 
            mt: { xs: 2, sm: 3 }, 
            p: { xs: 1.5, sm: 2 }, 
            backgroundColor: 'grey.50', 
            borderRadius: { xs: 1, sm: 2 }
          }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {t('adjustments.summary.totalItems')}
                </Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.125rem', sm: '1.5rem' }
                  }}
                >
                  {adjustment.details.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {t('adjustments.summary.totalPositive')}
                </Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'success.main',
                    fontSize: { xs: '1.125rem', sm: '1.5rem' }
                  }}
                >
                  +{adjustment.details.filter(d => d.diffQty > 0).reduce((sum, d) => sum + d.diffQty, 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {t('adjustments.summary.totalNegative')}
                </Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'error.main',
                    fontSize: { xs: '1.125rem', sm: '1.5rem' }
                  }}
                >
                  {adjustment.details.filter(d => d.diffQty < 0).reduce((sum, d) => sum + d.diffQty, 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertMessage('')}
          severity={alertSeverity}
          sx={{ 
            width: '100%',
            maxWidth: { xs: '90vw', sm: 'auto' }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdjustmentViewPage;
