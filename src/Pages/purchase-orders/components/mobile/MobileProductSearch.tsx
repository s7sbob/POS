// File: src/pages/purchases/purchase-orders/components/mobile/MobileProductSearch.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import { IconSearch, IconX, IconBarcode } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as productsApi from 'src/utils/api/pagesApi/purchaseProductsApi';
import { ProductPrice } from 'src/utils/api/pagesApi/purchaseProductsApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (productPrice: ProductPrice) => void;
}

const MobileProductSearch: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const result = await productsApi.searchProductPrices(searchQuery, 1, 50);
      setSearchResults(result.data);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: ProductPrice) => {
    onSelect(item);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('products.selectProduct')}
          <IconButton onClick={onClose}>
            <IconX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* شريط البحث */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder={t('products.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <IconBarcode size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={!searchQuery.trim() || loading}
            size="large"
          >
            {loading ? <CircularProgress size={20} /> : t('common.search')}
          </Button>
        </Box>

        {/* النتائج */}
        <Box>
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>{t('common.searching')}</Typography>
            </Box>
          ) : hasSearched && searchResults.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                {t('products.noSearchResults')}
              </Typography>
            </Box>
          ) : !hasSearched ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                {t('products.enterSearchTerm')}
              </Typography>
            </Box>
          ) : (
            <List>
              {searchResults.map((price) => (
                <ListItem key={price.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelect(price)}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      p: 2
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {price.productName}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {t('products.unit')}: {price.unitName}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            <Chip
                              label={`${t('products.price')}: ${price.price.toFixed(2)}`}
                              color="primary"
                              size="small"
                            />
                            <Chip
                              label={`${t('products.unitFactor')}: ${price.unitFactor}`}
                              variant="outlined"
                              size="small"
                            />
                            {price.barcode && (
                              <Chip
                                label={`${t('products.barcode')}: ${price.barcode}`}
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Box>
                          
                          <Chip
                            label={price.isActive ? t('products.active') : t('products.inactive')}
                            color={price.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} fullWidth>
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileProductSearch;
