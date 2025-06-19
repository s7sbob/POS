// File: src/pages/safes/components/ActionsBar.tsx
import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment
} from '@mui/material';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
  onAdd: () => void;
}

const ActionsBar: React.FC<Props> = ({
  query,
  onQueryChange,
  onAdd
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        alignItems="center" 
        justifyContent="space-between"
      >
        <TextField
          placeholder={t('safes.searchPlaceholder')}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={20} />
              </InputAdornment>
            )
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
        
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={onAdd}
          sx={{ minWidth: 150 }}
        >
          {t('safes.add')}
        </Button>
      </Stack>
    </Box>
  );
};

export default ActionsBar;
