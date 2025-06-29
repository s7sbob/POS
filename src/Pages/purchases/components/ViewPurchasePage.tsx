// File: src/pages/purchases/ViewPurchasePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
  Chip} from '@mui/material';
import { IconArrowLeft, IconHome, IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseApi';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';

const ViewPurchasePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        if (!id) {
          throw new Error(t('purchases.errors.idRequired'));
        }
        const purchaseData = await apiSrv.getById(id);
        setPurchase(purchaseData);
      } catch (e: any) {
        setError(e?.message || t('purchases.errors.dataLoadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [id, t]);

  const renderStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return { label: t('purchases.status.pending'), color: 'warning' };
      case 3:
        return { label: t('purchases.status.submitted'), color: 'success' };
      default:
        return { label: '-', color: 'default' };
    }
  };

  const handleEdit = () => {
    if (purchase?.status === 1) {
      navigate(`/purchases/purchases/edit/${purchase.id}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box textAlign="center" py={4}>
          <Typography>{t('common.loading')}</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !purchase) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box textAlign="center" py={4}>
          <Typography color="error">{error || t('purchases.errors.purchaseNotFound')}</Typography>
        </Box>
      </Container>
    );
  }

  const statusInfo = renderStatus(purchase.status);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/purchases/purchases');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <IconHome size={16} style={{ marginRight: 4 }} />
            {t('purchases.title')}
          </Link>
          <Typography color="text.primary">
            {purchase.status === 1 ? t('purchases.form.editTitle') : t('purchases.view.title')}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {purchase.status === 1 ? t('purchases.form.editTitle') : t('purchases.view.title')}
          </Typography>

          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {t('purchases.form.total')}: {purchase.total?.toFixed(2) || '0.00'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft />}
            onClick={() => navigate('/purchases/purchases')}
          >
            {t('common.back')}
          </Button>

          {purchase.status === 1 && (
            <Button
              variant="contained"
              startIcon={<IconEdit />}
              onClick={handleEdit}
            >
              {t('common.edit')}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Purchase Order Info */}
      {purchase.purchaseOrder && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: 'info.light' }}>
          <Typography variant="h6" gutterBottom>
            {t('purchases.form.linkedToPO')}: {purchase.purchaseOrder.referenceDocNumber}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.poDate')}:</strong> {purchase.purchaseOrder.date1 ? new Date(purchase.purchaseOrder.date1).toLocaleDateString() : t('common.notSpecified')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.poTotal')}:</strong> {purchase.purchaseOrder.total?.toFixed(2) || '0.00'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2">
                <strong>{t('purchases.form.itemsCount')}:</strong> {purchase.purchaseOrder.details?.length || 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Form Fields - Read Only */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label={t('purchases.form.invoiceNumber')}
            value={purchase.referenceDocNumber}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label={t('purchases.form.invoiceDate')}
            value={purchase.date1.split('T')[0]}
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label={t('purchases.form.supplier')}
            value={purchase.supplier?.name || 'N/A'}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label={t('purchases.form.warehouse')}
            value={purchase.warehouse?.name || 'N/A'}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Status and Discount & Tax - Read Only */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">{t('purchases.form.status')}:</Typography>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color as any}
              size="small"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label={t('purchases.form.totalDiscount') + ' %'}
            value={purchase.discountPercent}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label={t('purchases.form.totalTax') + ' %'}
            value={purchase.taxPercent}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {/* Summary */}
      <Paper sx={{ p: 1, mb: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.subTotal')}: {purchase.subTotal?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.discountValue')}: {purchase.discountValue?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary">
              {t('purchases.form.taxValue')}: {purchase.taxValue?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              {t('purchases.form.total')}: {purchase.total?.toFixed(2) || '0.00'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Items section - Read Only */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('purchases.form.items')}
        </Typography>

        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {isMobile ? (
            <Box>
              {purchase.details.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  {t('purchases.form.noItems')}
                </Typography>
              ) : (
                purchase.details.map((detail, index) => (
                  <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>#{index + 1}</Typography>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {detail.unitName} — {detail.unitName}
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.quantity')}: {detail.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.price')}: {detail.price.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.discount')}: {detail.discountPercent}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            {t('purchases.form.tax')}: {detail.taxPercent}%
                          </Typography>
                        </Grid>
                      </Grid>

                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'right', fontWeight: 'bold' }}>
                        {t('purchases.form.total')}: {detail.total?.toFixed(2) || '0.00'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('purchases.form.product')}</TableCell>
                    <TableCell>{t('purchases.form.unit')}</TableCell>
                    <TableCell align="right">{t('purchases.form.quantity')}</TableCell>
                    <TableCell align="right">{t('purchases.form.price')}</TableCell>
                    <TableCell align="right">{t('purchases.form.discount')} %</TableCell>
                    <TableCell align="right">{t('purchases.form.tax')} %</TableCell>
                    <TableCell align="right">{t('purchases.form.total')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchase.details.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          {t('purchases.form.noItems')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchase.details.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.unitName}</TableCell>
                        <TableCell>{detail.unitName}</TableCell>
                        <TableCell align="right">{detail.quantity}</TableCell>
                        <TableCell align="right">{detail.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{detail.discountPercent}%</TableCell>
                        <TableCell align="right">{detail.taxPercent}%</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {detail.total?.toFixed(2) || '0.00'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper></Container>
  );
};

export default ViewPurchasePage;
