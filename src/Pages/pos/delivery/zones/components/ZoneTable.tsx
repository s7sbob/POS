// File: src/pages/delivery/zones/components/ZoneTable.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Typography, Box, Tooltip
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';

interface Props {
  rows: DeliveryZone[];
  onEdit: (zone: DeliveryZone) => void;
  selectedZoneId?: string;
}

const ZoneTable: React.FC<Props> = ({ rows, onEdit, selectedZoneId }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('deliveryZones.form.name')}</TableCell>
            <TableCell>{t('deliveryZones.form.deliveryCharge')}</TableCell>
            <TableCell>{t('deliveryZones.form.defaultBonus')}</TableCell>
            <TableCell>{t('deliveryZones.form.branch')}</TableCell>
            <TableCell>{t('deliveryZones.form.status')}</TableCell>
            <TableCell width={120}>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((zone) => (
            <TableRow
              key={zone.id}
              selected={selectedZoneId === zone.id}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                ...(selectedZoneId === zone.id && {
                  backgroundColor: 'action.selected',
                }),
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {zone.name}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  {zone.deliveryCharge.toFixed(2)} {t('common.currency')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  {zone.defaultBonus.toFixed(2)} {t('common.currency')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {zone.branchName || t('deliveryZones.form.allBranches')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={zone.isActive ? t('common.active') : t('common.inactive')}
                  color={zone.isActive ? 'success' : 'error'}
                  size="small"
                  variant={zone.isActive ? 'filled' : 'outlined'}
                />
              </TableCell>
              
              <TableCell>
                <Tooltip title={t('common.edit')}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(zone)}
                    color="primary"
                  >
                    <IconEdit size={18} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ZoneTable;
