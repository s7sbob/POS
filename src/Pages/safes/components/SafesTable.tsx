// File: src/pages/safes/components/SafesTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Safe } from 'src/utils/api/pagesApi/safesApi';

interface Props {
  rows: Safe[];
  onEdit: (safe: Safe) => void;
}

const SafesTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {t('safes.noSafes')}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('safes.name')}</TableCell>
              <TableCell>{t('safes.type')}</TableCell>
              <TableCell>{t('safes.accountNumber')}</TableCell>
              <TableCell>{t('safes.collectionFeePercent')}</TableCell>
              <TableCell>{t('safes.status')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((safe) => (
              <TableRow key={safe.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {safe.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`safes.types.${safe.typeName.toLowerCase()}`)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {safe.accountNumber || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {safe.collectionFeePercent}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={safe.isActive ? t('safes.active') : t('safes.inactive')}
                    color={safe.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(safe)}
                    color="primary"
                  >
                    <IconEdit size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SafesTable;
