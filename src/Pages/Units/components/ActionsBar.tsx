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
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      mb={3}
    >
      <TextField
        placeholder={t('units.search')}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={20} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: '100%', sm: 250 } }}
      />

      <Button
        variant="contained"
        startIcon={<IconPlus size={20} />}
        onClick={onAdd}
      >
        {t('units.add')}
      </Button>
    </Stack>
  );
};

export default ActionsBar;
