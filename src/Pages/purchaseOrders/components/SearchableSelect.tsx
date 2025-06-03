import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  ListSubheader
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { t } from 'i18next';

interface Option {
  id: string;
  name: string;
  [key: string]: any;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  autoFocusSearch?: boolean;
}

const SearchableSelect: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  fullWidth = true,
  size = 'medium',
  autoFocusSearch = false
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchText, options]);

  // ✅ إصلاح 8: Auto focus على البحث عند فتح الـ dropdown
  useEffect(() => {
    if (open && autoFocusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open, autoFocusSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText(''); // إعادة تعيين البحث عند الإغلاق
  };

  const handleChange = (event: any) => {
    onChange(event.target.value);
    setOpen(false);
  };

  return (
    <FormControl 
      fullWidth={fullWidth} 
      error={error} 
      disabled={disabled}
      size={size}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleClose}
        open={open}
        label={label}
        MenuProps={{
          autoFocus: false, // ✅ منع auto focus على الـ select نفسه
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        <ListSubheader>
          <TextField
            ref={searchInputRef}
            size="small"
            autoFocus={autoFocusSearch}
            placeholder={t('common.search') || 'البحث...'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            }}
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation();
              }
            }}
            onClick={(e) => e.stopPropagation()} // منع إغلاق الـ dropdown عند النقر على البحث
          />
        </ListSubheader>
        
        {placeholder && !value && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        
        {filteredOptions.length === 0 ? (
          <MenuItem disabled>
            <Typography color="text.secondary">
              {t('common.noResults') || 'لا توجد نتائج'}
            </Typography>
          </MenuItem>
        ) : (
          filteredOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default SearchableSelect;
