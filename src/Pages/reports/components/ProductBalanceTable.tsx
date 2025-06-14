// File: src/pages/reports/components/ProductBalanceTable.tsx
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Collapse,
  IconButton,
  useTheme
} from '@mui/material';
import {
  IconChevronDown,
  IconChevronRight,
  IconAlertTriangle,
  IconCheck
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GroupedProductBalance } from 'src/utils/api/reportsApi';

interface Props {
  data: GroupedProductBalance[];
  loading: boolean;
}

const ProductBalanceTable: React.FC<Props> = ({ data, loading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        label: t('reports.stockStatus.outOfStock'),
        color: 'error' as const,
        icon: IconAlertTriangle
      };
    } else if (quantity < 10) {
      return {
        label: t('reports.stockStatus.lowStock'),
        color: 'warning' as const,
        icon: IconAlertTriangle
      };
    } else {
      return {
        label: t('reports.stockStatus.inStock'),
        color: 'success' as const,
        icon: IconCheck
      };
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>{t('common.loading')}</Typography>
      </Paper>
    );
  }

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {t('reports.noData')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell width={40}></TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.product')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.warehouse')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.totalQuantity')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.totalCostValue')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.totalLastPurePriceValue')}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight="bold" fontSize="0.8rem">
                  {t('reports.table.status')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => {
              const rowKey = `${item.productID}-${item.warehouseID}`;
              const isExpanded = expandedRows.has(rowKey);
              const status = getStockStatus(item.totalQuantity);

              return (
                <React.Fragment key={rowKey}>
                  <TableRow hover sx={{ '& td': { py: 1 } }}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(rowKey)}
                      >
                        {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" fontSize="0.8rem">
                        {item.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontSize="0.8rem">
                        {item.wareHouseName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium" fontSize="0.8rem">
                        {item.totalQuantity.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium" fontSize="0.8rem" color="success.main">
                        {item.totalCost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium" fontSize="0.8rem" color="warning.main">
                        {item.totalLastPurePrice.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={<status.icon size={12} />}
                        sx={{ fontSize: '0.65rem', height: '20px' }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 1.5, backgroundColor: theme.palette.grey[100] }}>
                          <Typography variant="subtitle2" gutterBottom fontSize="0.8rem">
                            {t('reports.table.unitBreakdown')}
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.unit')}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.quantity')}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.cost')}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.totalCost')}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.lastPurePrice')}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography variant="caption" fontWeight="bold">
                                    {t('reports.table.totalLastPurePrice')}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.units.map((unit, index) => (
                                <TableRow key={`${unit.unitId}-${index}`}>
                                  <TableCell sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      {unit.unitName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      {unit.unitQuantity}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      {unit.cost.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 0.5 }}>
                                    <Typography variant="caption" color="success.main" fontWeight="medium">
                                      {unit.totalCost.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      {unit.lastPurePrice.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right" sx={{ py: 0.5 }}>
                                    <Typography variant="caption" color="warning.main" fontWeight="medium">
                                      {unit.totalLastPurePrice.toFixed(2)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProductBalanceTable;
