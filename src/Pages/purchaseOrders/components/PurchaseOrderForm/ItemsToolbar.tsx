import React from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener
} from '@mui/material';
import { IconSearch, IconBarcode, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ProductPrice } from 'src/utils/api/purchaseProductsApi';

interface Props {
  quickSearchQuery: string;
  setQuickSearchQuery: (value: string) => void;
  quickSearchResults: ProductPrice[];
  quickSearchOpen: boolean;
  setQuickSearchOpen: (value: boolean) => void;
  quickSearchSelectedIndex: number;
  setQuickSearchSelectedIndex: (value: number) => void;
  quickSearchInputRef: React.RefObject<HTMLInputElement>;
  onProductSelect: (product: ProductPrice) => void;
  onOpenDetailedSearch: () => void;
  onOpenScanner: () => void;
}

const ItemsToolbar: React.FC<Props> = ({
  quickSearchQuery,
  setQuickSearchQuery,
  quickSearchResults,
  quickSearchOpen,
  setQuickSearchOpen,
  quickSearchSelectedIndex,
  quickSearchInputRef,
  onProductSelect,
  onOpenDetailedSearch,
  onOpenScanner
}) => {
  const { t } = useTranslation();

  const handleQuickSearchKeyDown = () => {
    if (quickSearchResults.length === 0) return;

  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        backgroundColor: 'background.default',
        borderRadius: 1,
        mb: 0.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {/* كلمة الأصناف */}
      <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', minWidth: 'fit-content' }}>
        {t('purchaseOrders.items')}
      </Typography>
      
      {/* البحث السريع - يأخذ المساحة المتبقية */}
      <ClickAwayListener onClickAway={() => setQuickSearchOpen(false)}>
        <Box position="relative" sx={{ flex: 1, maxWidth: 400 }}>
          <TextField
            ref={quickSearchInputRef}
            size="small"
            placeholder={t('products.quickSearchPlaceholder')}
            value={quickSearchQuery}
            onChange={(e) => setQuickSearchQuery(e.target.value)}
            onKeyDown={handleQuickSearchKeyDown}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={14} />
                </InputAdornment>
              )
            }}
          />
          
          {/* Quick Search Results Dropdown */}
          {quickSearchOpen && quickSearchResults.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: 150,
                overflow: 'auto',
                mt: 0.5
              }}
            >
              <List dense sx={{ p: 0 }}>
                {quickSearchResults.map((price, index) => (
                  <ListItem key={`${price.id}-${index}`} disablePadding>
                    <ListItemButton 
                      onClick={() => onProductSelect(price)}
                      selected={index === quickSearchSelectedIndex}
                      sx={{ 
                        py: 0.25,
                        backgroundColor: index === quickSearchSelectedIndex ? 'action.selected' : 'transparent'
                      }}
                    >
                      <ListItemText
                        primary={`${price.productName} - ${price.unitName}`}
                        secondary={`${price.price.toFixed(2)} | ${t('products.unitFactor')}: ${price.unitFactor}`}
                        primaryTypographyProps={{ fontSize: '0.8rem' }}
                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>

      {/* الأزرار */}
      <Stack direction="row" spacing={0.5}>
        <Button
          size="small"
          variant="outlined"
          onClick={onOpenScanner}
          startIcon={<IconBarcode size={14} />}
          sx={{ fontSize: '0.75rem' }}
        >
          {t('barcode.scan')}
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<IconPlus size={14} />}
          onClick={onOpenDetailedSearch}
          sx={{ fontSize: '0.75rem' }}
        >
          {t('purchaseOrders.addItemWithSearch')}
        </Button>
      </Stack>
    </Box>
  );
};

export default ItemsToolbar;
