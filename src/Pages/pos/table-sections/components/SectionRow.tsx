// File: src/pages/pos/table-sections/components/SectionRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip, Grid
} from '@mui/material';
import { IconEdit, IconTable, IconUsers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { TableSection } from 'src/utils/api/pagesApi/tableSectionsApi';

interface Props {
  section: TableSection;
  onEdit: () => void;
  isSelected?: boolean;
}

const SectionRow: React.FC<Props> = ({ section, onEdit, isSelected = false }) => {
  const { t } = useTranslation();
  const totalCapacity = section.tables.reduce((sum, table) => sum + table.capacity, 0);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        ...(isSelected && {
          borderColor: 'primary.main',
          backgroundColor: 'action.selected'
        })
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {section.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {section.branchName || t('common.notSpecified')}
            </Typography>
          </Box>
          
          <Chip
            label={section.isActive ? t('common.active') : t('common.inactive')}
            color={section.isActive ? 'success' : 'error'}
            size="small"
            variant={section.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Section Info */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('tableSections.form.serviceCharge')}:
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight={600}>
                {section.serviceCharge.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconTable size={16} />
              <Typography variant="body2" fontWeight={500}>
                {section.tables.length} {t('tableSections.form.tables')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconUsers size={16} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                {totalCapacity} {t('tableSections.form.persons')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Tables */}
        {section.tables.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tableSections.form.tables')}:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {section.tables.map((table, index) => (
                <Chip
                  key={index}
                  label={`${table.name} (${table.capacity})`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={onEdit}
              color="primary"
            >
              <IconEdit size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SectionRow;
