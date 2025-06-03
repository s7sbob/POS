import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
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

const ItemsMobileView: React.FC<Props> = ({ control, fields, watch, remove, quickSearchInputRef }) => {
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

  const MobileDetailCard: React.FC<{ index: number; onRemove: () => void }> = ({ index, onRemove }) => (
    <Card variant="outlined" sx={{ mb: 0.5 }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="primary">
              #{index + 1}
            </Typography>
            <IconButton size="small" color="error" onClick={onRemove}>
              <IconTrash size={14} />
            </IconButton>
          </Box>

          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
            {watch(`details.${index}.productName`)} - {watch(`details.${index}.unitName`)}
          </Typography>

          <Grid container spacing={0.5}>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.quantity')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.price`)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.price`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.price')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.discountPercent`)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={0.5}>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.discountPercent`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.discount')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    InputProps={{ 
                      endAdornment: '%',
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, `details.${index}.taxPercent`)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`details.${index}.taxPercent`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('purchaseOrders.tax')}
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    InputProps={{ 
                      endAdornment: '%',
                      sx: {
                        '& input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                        '& input[type=number]::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '& input[type=number]::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                      },
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary" align="center">
            {t('purchaseOrders.total')}: {watch(`details.${index}.total`)?.toFixed(2) || '0.00'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 0.5 }}>
      {fields.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 1, fontSize: '0.8rem' }}>
          {t('purchaseOrders.noItems')}
        </Typography>
      ) : (
        fields.map((field, index) => (
          <MobileDetailCard
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
          />
        ))
      )}
    </Box>
  );
};

export default ItemsMobileView;
