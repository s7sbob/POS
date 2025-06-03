import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TextField,
  IconButton
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { Controller, Control, UseFieldArrayReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  control: Control<any>;
  fields: UseFieldArrayReturn['fields'];
  watch: any;
  remove: UseFieldArrayReturn['remove'];
  quickSearchInputRef: React.RefObject<HTMLInputElement>;
}

const ItemsTable: React.FC<Props> = ({ control, fields, watch, remove, quickSearchInputRef }) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent, nextInputName?: string) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      
      if (nextInputName) {
        const nextInput = document.querySelector(`input[name="${nextInputName}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      } else if (e.key === 'Enter') {
        if (quickSearchInputRef.current) {
          quickSearchInputRef.current.focus();
        }
      }
    }
  };

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '40vh' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.product')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.unit')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.quantity')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.price')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.discount')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.tax')}</TableCell>
            <TableCell sx={{ py: 0.25, fontSize: '0.8rem' }}>{t('purchaseOrders.total')}</TableCell>
            <TableCell width={30}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 1 }}>
                <Typography color="text.secondary" fontSize="0.8rem">
                  {t('purchaseOrders.noItems')}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell sx={{ py: 0.25 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                    {watch(`details.${index}.productName`)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {watch(`details.${index}.unitName`)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {t('products.unitFactor')}: {watch(`details.${index}.unitFactor`)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Controller
                    name={`details.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ 
                          width: 60,
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                            fontSize: '0.8rem'
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
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDown(e, `details.${index}.price`)}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Controller
                    name={`details.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ 
                          width: 70,
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                            fontSize: '0.8rem'
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
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDown(e, `details.${index}.discountPercent`)}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Controller
                    name={`details.${index}.discountPercent`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        sx={{ 
                          width: 60,
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                            fontSize: '0.8rem'
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
                        InputProps={{ endAdornment: '%' }}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDown(e, `details.${index}.taxPercent`)}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Controller
                    name={`details.${index}.taxPercent`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        sx={{ 
                          width: 60,
                          '& input[type=number]': {
                            '-moz-appearance': 'textfield',
                            fontSize: '0.8rem'
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
                        InputProps={{ endAdornment: '%' }}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                    {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.25 }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    <IconTrash size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;
