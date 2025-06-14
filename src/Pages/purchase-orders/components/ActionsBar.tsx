import {
  Stack,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  onAdd: () => void;
  searchPlaceholder?: string;
  addButtonText?: string;
};

const ActionsBar: React.FC<Props> = ({ 
  query, 
  onQueryChange, 
  onAdd, 
  searchPlaceholder,
  addButtonText 
}) => {
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
        placeholder={searchPlaceholder || t('purchaseOrders.search')}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={20} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: '100%', sm: 300 } }}
      />

      <Button
        variant="contained"
        startIcon={<IconPlus size={20} />}
        onClick={onAdd}
      >
        {addButtonText || t('purchaseOrders.add')}
      </Button>
    </Stack>
  );
};

export default ActionsBar;
