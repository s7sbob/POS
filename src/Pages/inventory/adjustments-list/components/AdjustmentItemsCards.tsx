// File: src/pages/inventory/adjustment/components/AdjustmentItemsCards.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
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
}

const AdjustmentItemsCards: React.FC<Props> = ({
  control,
  details,
  itemsCount,
  onQuantityChange,
  watch
}) => {
  const { t } = useTranslation();

  const MobileDetailCard: React.FC<{ index: number }> = ({ index }) => (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {watch(`details.${index}.productName`)} — {watch(`details.${index}.unitName`)}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label={t('adjustment.form.oldQuantity')}
              value={watch(`details.${index}.oldQuantity`)}
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name={`details.${index}.newQuantity`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('adjustment.form.newQuantity')}
                  type="number"
                  size="small"
                  fullWidth
                  onChange={(e) => onQuantityChange(index, parseFloat(e.target.value) || 0)}
                  inputProps={{
                    style: { textAlign: 'right' },
                    step: "0.01",
                    inputMode: 'decimal'
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={t('adjustment.form.difference')}
              value={watch(`details.${index}.diffQty`)?.toFixed(2) || '0.00'}
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
              variant="filled"
              sx={{
                '& .MuiInputBase-input': {
                  color: watch(`details.${index}.diffQty`) > 0 ? 'success.main' : 
                         watch(`details.${index}.diffQty`) < 0 ? 'error.main' : 'text.primary'
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={t('adjustment.form.unitFactor')}
              value={watch(`details.${index}.unitFactor`)}
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name={`details.${index}.notes`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('adjustment.form.notes')}
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('adjustment.form.items')} ({itemsCount})
      </Typography>

      <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {details.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {t('adjustment.form.noItems')}
          </Typography>
        ) : (
          details.map((_, index) => (
            <MobileDetailCard key={index} index={index} />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default AdjustmentItemsCards;
