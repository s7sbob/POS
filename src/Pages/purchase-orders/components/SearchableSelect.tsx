import React, { useState, useEffect, useRef } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  ListSubheader,
  MenuProps
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
  onSelectionComplete?: () => void; // موجود بالفعل
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
  autoFocusSearch = false,
  onSelectionComplete
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Recompute filteredOptions when options or searchText change:
  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
    setSelectedIndex(-1);
  }, [searchText, options]);

  // Whenever `open` becomes true and autoFocusSearch is set, focus the search input:
useEffect(() => {
  if (open && autoFocusSearch) {
    // تأكد من الـ focus فوراً
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        const inputElement = searchInputRef.current.querySelector('input') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select(); // تحديد النص الموجود
        }
      }
    }, 50); // وقت أقل للاستجابة الأسرع

    return () => clearTimeout(timer);
  }
}, [open, autoFocusSearch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText('');
    setSelectedIndex(-1);
  };

  const handleChange = (event: any) => {
    onChange(event.target.value);
    handleClose();
    
    // التعديل الوحيد هنا - إضافة callback
    if (onSelectionComplete) {
      setTimeout(() => {
        onSelectionComplete();
      }, 200);
    }
  };

  // Arrow-key navigation inside the search box:
const handleSearchKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    e.stopPropagation(); // منع انتقال الحدث
    setSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    // الحفاظ على الـ focus
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation(); // منع انتقال الحدث
    setSelectedIndex(prev => Math.max(prev - 1, -1));
    // الحفاظ على الـ focus
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  } else if (e.key === 'Enter' && selectedIndex >= 0) {
    e.preventDefault();
    e.stopPropagation();
    onChange(filteredOptions[selectedIndex].id);
    handleClose();
    
    // إضافة callback هنا كمان
    if (onSelectionComplete) {
      setTimeout(() => {
        onSelectionComplete();
      }, 200);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  }
};

  // If the closed Select is focused and the user starts typing a letter,
  // open the dropdown with that letter in the search field:
  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      setOpen(true);
      setSearchText(e.key);
      // Focus the search input after the dropdown appears:
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.setSelectionRange(1, 1);
        }
      }, 100);
    }
  };

  const customMenuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
    onClose: (_event, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        handleClose();
      }
    },
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={handleChange}
        onKeyDown={handleSelectKeyDown}
        MenuProps={customMenuProps}
      >
        <ListSubheader>
          <TextField
            ref={searchInputRef}
            size="small"
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
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            autoComplete="off"
          />
        </ListSubheader>

        {placeholder && !value && (
          <MenuItem value="" disabled>
            <Typography color="text.secondary">{placeholder}</Typography>
          </MenuItem>
        )}

        {filteredOptions.length === 0 ? (
          <MenuItem disabled>
            <Typography color="text.secondary">
              {t('common.noResults') || 'لا توجد نتائج'}
            </Typography>
          </MenuItem>
        ) : (
          filteredOptions.map((option, index) => (
            <MenuItem
              key={option.id}
              value={option.id}
              selected={index === selectedIndex}
              sx={{
                backgroundColor:
                  index === selectedIndex ? 'action.selected' : 'transparent',
              }}
            >
              {option.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default SearchableSelect;
