// File: src/pages/pos-payment-methods/components/PosPaymentMethodsTable.tsx
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
import { PosPaymentMethod } from 'src/utils/api/pagesApi/posPaymentMethodsApi';

interface Props {
  rows: PosPaymentMethod[];
  onEdit: (paymentMethod: PosPaymentMethod) => void;
}

const PosPaymentMethodsTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {t('posPaymentMethods.noPaymentMethods')}
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
              <TableCell>{t('posPaymentMethods.name')}</TableCell>
              <TableCell>{t('posPaymentMethods.safeOrAccount')}</TableCell>
              <TableCell>{t('posPaymentMethods.accountType')}</TableCell>
              <TableCell>{t('posPaymentMethods.accountNumber')}</TableCell>
              <TableCell>{t('posPaymentMethods.status')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((paymentMethod) => (
              <TableRow key={paymentMethod.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {paymentMethod.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {paymentMethod.safeOrAccount?.name || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {paymentMethod.safeOrAccount && (
                    <Chip
                      label={t(`accounts.types.${paymentMethod.safeOrAccount.typeName.toLowerCase()}`)}
                      color={paymentMethod.safeOrAccount.safeOrAccountType === 1 ? 'warning' : 'primary'}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {paymentMethod.safeOrAccount?.accountNumber || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={paymentMethod.isActive ? t('posPaymentMethods.active') : t('posPaymentMethods.inactive')}
                    color={paymentMethod.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(paymentMethod)}
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

export default PosPaymentMethodsTable;
