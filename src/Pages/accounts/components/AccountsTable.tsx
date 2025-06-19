// File: src/pages/accounts/components/AccountsTable.tsx
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
import { Account } from 'src/utils/api/pagesApi/accountsApi';

interface Props {
  rows: Account[];
  onEdit: (account: Account) => void;
}

const AccountsTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {t('accounts.noAccounts')}
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
              <TableCell>{t('accounts.name')}</TableCell>
              <TableCell>{t('accounts.type')}</TableCell>
              <TableCell>{t('accounts.accountNumber')}</TableCell>
              <TableCell>{t('accounts.collectionFeePercent')}</TableCell>
              <TableCell>{t('accounts.status')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((account) => (
              <TableRow key={account.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {account.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`accounts.types.${account.typeName.toLowerCase()}`)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {account.accountNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {account.collectionFeePercent}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={account.isActive ? t('accounts.active') : t('accounts.inactive')}
                    color={account.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(account)}
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

export default AccountsTable;
