import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Warehouse } from './types';
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';

interface Props {
  warehouse: Warehouse;
  onEdit: () => void;
  onDelete: () => void;
}

const WarehouseRow: React.FC<Props> = ({ warehouse, onEdit, onDelete }) => {
  useTranslation();

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">{warehouse.name}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <StatusPill status={warehouse.status} />
            <IconButton size="small" onClick={onEdit}>
              <IconEdit size={18} />
            </IconButton>
            <IconButton size="small" color="error" onClick={onDelete}>
              <IconTrash size={18} />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1 }} />
      </CardContent>
    </Card>
  );
};

export default WarehouseRow;
