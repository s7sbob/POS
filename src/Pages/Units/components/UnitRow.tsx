import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton} from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { Unit } from 'src/utils/unitsApi'; // استخدم التعريف من unitsApi
import { StatusPill } from './StatusPill';
import { useTranslation } from 'react-i18next';

interface Props {
  unit: Unit;
  onEdit: () => void;
}

const UnitRow: React.FC<Props> = ({ unit, onEdit }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1} flex={1}>
            <Typography variant="h6" component="div">
              {unit.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('units.code')}: {unit.code}
            </Typography>
            <StatusPill status={unit.isActive ? 'active' : 'inactive'} />
          </Stack>
          
          <IconButton onClick={onEdit} size="small">
            <IconEdit size={18} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UnitRow;
