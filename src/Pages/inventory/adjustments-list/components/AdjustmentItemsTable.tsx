// File: src/pages/inventory/adjustment/components/AdjustmentItemsTable.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  control: Control<any>;
  details: any[];
  itemsCount: number;
  onQuantityChange: (index: number, newQuantity: number) => void;
  watch: (path: string) => any;
  rawDetails?: any[];
  searchQuery?: string;
}

const AdjustmentItemsTable: React.FC<Props> = ({
  control,
  details,
  itemsCount,
  onQuantityChange,
  watch,
  rawDetails = [],
  searchQuery = ''
}) => {
  const { t } = useTranslation();

  const displayDetails = details.length > 0 ? details : rawDetails;
  const useFormData = details.length > 0;

  const filteredDisplayDetails = searchQuery.trim() 
    ? displayDetails.filter(detail => {
        const searchLower = searchQuery.toLowerCase();
        return (
          detail.productName.toLowerCase().includes(searchLower) ||
          detail.unitName.toLowerCase().includes(searchLower) ||
          (detail.barcode && detail.barcode.toLowerCase().includes(searchLower))
        );
      })
    : displayDetails;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('adjustment.form.items')} ({searchQuery ? filteredDisplayDetails.length : itemsCount})
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({t('adjustment.search.filteredFrom', { total: itemsCount })})
          </Typography>
        )}
      </Typography>

      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">{t('adjustment.form.product')}</TableCell>
                <TableCell align="center">{t('adjustment.form.unit')}</TableCell>
                <TableCell align="center">{t('adjustment.form.barcode')}</TableCell>
                <TableCell align="center">{t('adjustment.form.unitFactor')}</TableCell>
                <TableCell align="center">{t('adjustment.form.oldQuantity')}</TableCell>
                <TableCell align="center">{t('adjustment.form.newQuantity')}</TableCell>
                <TableCell align="center">{t('adjustment.form.difference')}</TableCell>
                <TableCell align="center">{t('adjustment.form.notes')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDisplayDetails.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      {searchQuery ? t('adjustment.search.noResults') : t('adjustment.form.noItems')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisplayDetails.map((detail, index) => (
                  <TableRow 
                    key={detail.detailsAdjustmentId || index}
                    id={`product-row-${detail.productId}`}
                  >
                    <TableCell align="center">
                      <Typography variant="body2">
                        {useFormData ? watch(`details.${index}.productName`) : detail.productName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {useFormData ? watch(`details.${index}.unitName`) : detail.unitName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {detail.barcode || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {useFormData ? watch(`details.${index}.unitFactor`) : detail.unitFactor}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {useFormData 
                          ? (watch(`details.${index}.oldQuantity`)?.toFixed(2) || '0.00')
                          : (detail.oldQuantity?.toFixed(2) || '0.00')
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {useFormData ? (
                        <Controller
                          name={`details.${index}.newQuantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              id={`quantity-${detail.productId}`}
                              onChange={(e) => onQuantityChange(index, parseFloat(e.target.value) || 0)}
                              sx={{
                                width: 120,
                                '& input[type=number]': {
                                  '-moz-appearance': 'textfield',
                                  textAlign: 'center',
                                },
                                '& input[type=number]::-webkit-outer-spin-button': {
                                  '-webkit-appearance': 'none',
                                  margin: 0,
                                },
                                '& input[type=number]::-webkit-inner-spin-button': {
                                  '-webkit-appearance': 'none',
                                  margin: 0,
                                },
                              }}
                              inputProps={{
                                step: "0.01",
                                inputMode: 'decimal'
                              }}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          type="number"
                          size="small"
                          id={`quantity-${detail.productId}`}
                          value={detail.newQuantity || 0}
                          onChange={(e) => onQuantityChange(index, parseFloat(e.target.value) || 0)}
                          sx={{
                            width: 120,
                            '& input[type=number]': {
                              '-moz-appearance': 'textfield',
                              textAlign: 'center',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              '-webkit-appearance': 'none',
                              margin: 0,
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                              '-webkit-appearance': 'none',
                              margin: 0,
                            },
                          }}
                          inputProps={{
                            step: "0.01",
                            inputMode: 'decimal'
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: (useFormData 
                            ? watch(`details.${index}.diffQty`) 
                            : detail.diffQty) > 0 ? 'success.main' : 
                                 (useFormData 
                                   ? watch(`details.${index}.diffQty`) 
                                   : detail.diffQty) < 0 ? 'error.main' : 'text.primary'
                        }}
                      >
                        {useFormData 
                          ? (watch(`details.${index}.diffQty`)?.toFixed(2) || '0.00')
                          : (detail.diffQty?.toFixed(2) || '0.00')
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {useFormData ? (
                        <Controller
                          name={`details.${index}.notes`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              multiline
                              rows={1}
                              sx={{ width: 150 }}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          size="small"
                          multiline
                          rows={1}
                          value={detail.notes || ''}
                          sx={{ width: 150 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default AdjustmentItemsTable;
