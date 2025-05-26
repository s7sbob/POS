// === pages/products/components/Toolbar.tsx ====================================
import React from 'react';
import { Stack, Button, TextField, InputAdornment } from '@mui/material';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSearch: (value: string) => void;
  onAdd: () => void;
}

export const Toolbar: React.FC<Props> = ({ onSearch, onAdd }) => {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <TextField
        size="small"
        placeholder={t('common.search')}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={16} />
            </InputAdornment>
          ),
        }}
        sx={{ width: { xs: '100%', sm: 300 } }}
      />

      <Button
        variant="contained"
        startIcon={<IconPlus size={18} />}
        onClick={onAdd}
      >
        {t('products.addProduct')}
      </Button>
    </Stack>
  );
};