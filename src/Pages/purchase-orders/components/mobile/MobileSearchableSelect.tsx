// File: src/pages/purchases/purchase-orders/components/mobile/MobileSearchableSelect.tsx
import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { IconX, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Option {
  id: string;
  name: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const MobileSearchableSelect: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id === value);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setOpen(false);
    setSearchText('');
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText('');
  };

  return (
    <>
      <FormControl fullWidth error={error} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onClick={() => setOpen(true)}
          readOnly
        >
          <MenuItem value={value}>
            {selectedOption ? selectedOption.name : placeholder}
          </MenuItem>
        </Select>
      </FormControl>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {label}
            <IconButton onClick={handleClose}>
              <IconX size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            placeholder={t('common.search')}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={20} style={{ marginRight: 8 }} />
            }}
            sx={{ mb: 2 }}
          />

          <List>
            {filteredOptions.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography color="text.secondary" textAlign="center">
                      {t('common.noResults')}
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              filteredOptions.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelect(option.id)}
                    selected={option.id === value}
                    sx={{
                      border: 1,
                      borderColor: option.id === value ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: option.id === value ? 'action.selected' : 'transparent'
                    }}
                  >
                    <ListItemText
                      primary={option.name}
                      primaryTypographyProps={{
                        fontWeight: option.id === value ? 'bold' : 'normal'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} fullWidth>
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MobileSearchableSelect;
