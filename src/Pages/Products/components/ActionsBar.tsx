import React from 'react';
import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  MenuItem
} from '@mui/material';
import {
  IconSearch,
  IconPlus,
  IconUpload,
  IconDownload,
  IconFileSpreadsheet
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  brandFilter: string;
  onBrandChange: (v: string) => void;
}

export const ActionsBar: React.FC<Props> = ({
  query,
  onQueryChange,
  categoryFilter,
  onCategoryChange,
  brandFilter,
  onBrandChange
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      {/* -------- search + filters -------- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flex={1}>
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
        <TextField
          select
          size="small"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          label={t('products.category')}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Furnitures">Furnitures</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          value={brandFilter}
          onChange={(e) => onBrandChange(e.target.value)}
          label={t('products.brand')}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          <MenuItem value="Apple">Apple</MenuItem>
          <MenuItem value="Nike">Nike</MenuItem>
        </TextField>
      </Stack>

      {/* -------- actions -------- */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
      >
        <Button variant="outlined" startIcon={<IconDownload size={16} />}>
          CSV
        </Button>
        <Button variant="outlined" startIcon={<IconFileSpreadsheet size={16} />}>
          Excel
        </Button>
        <Button variant="outlined" startIcon={<IconUpload size={16} />}>
          {t('products.import')}
        </Button>

        {/* Add Product → route */}
        <Button
          variant="contained"
          startIcon={<IconPlus size={18} />}
          component={RouterLink}
          to="/inventory/products/add"
        >
          {t('products.addProduct')}
        </Button>
      </Stack>
    </Stack>
  );
};
