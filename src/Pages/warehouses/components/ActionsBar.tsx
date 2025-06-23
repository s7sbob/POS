import {
  Stack,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  onAdd: () => void;
}

const ActionsBar: React.FC<Props> = ({ query, onQueryChange, onAdd }) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <TextField
        size="small"
        placeholder={t('common.search')}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={16} />
            </InputAdornment>
          )
        }}
        sx={{ width: { xs: '100%', sm: 250 } }}
      />

      <Button
        variant="contained"
        startIcon={<IconPlus size={18} />}
        onClick={onAdd}
      >
        {t('warehouses.add')}
      </Button>
    </Stack>
  );
};

export default ActionsBar;
