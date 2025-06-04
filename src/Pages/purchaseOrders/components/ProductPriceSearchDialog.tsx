import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip
} from '@mui/material';
import { IconSearch, IconBarcode, IconX, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import BarcodeScanner from './BarcodeScanner';
import * as productsApi from 'src/utils/api/purchaseProductsApi';
import { ProductPrice } from 'src/utils/api/purchaseProductsApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (productPrice: ProductPrice) => void;
}

// Debounce hook to avoid querying on every keystroke
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ProductPriceSearchDialog: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [allPrices, setAllPrices] = useState<ProductPrice[]>([]);
  const [displayItems, setDisplayItems] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Focus on the search field when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setAllPrices([]);
      setDisplayItems([]);
      setCurrentPage(1);
      setHasMore(true);
      setIsSearchMode(false);
      setSelectedIndex(0);
    }
  }, [open]);

  // Initial load of products
  useEffect(() => {
    if (open && !isSearchMode && allPrices.length === 0) {
      loadInitialProducts();
    }
  }, [open, isSearchMode, allPrices.length]);

  // Debounced search logic
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      handleDebouncedSearch(debouncedSearchQuery);
    } else {
      setIsSearchMode(false);
      setDisplayItems(allPrices);
      setSelectedIndex(0);
    }
  }, [debouncedSearchQuery, allPrices]);

  const loadInitialProducts = async () => {
    try {
      setLoading(true);
      const result = await productsApi.searchProductPrices('', 1, 20);
      setAllPrices(result.data);
      setDisplayItems(result.data);
      setHasMore(result.pageNumber < result.pageCount);
      setCurrentPage(1);
      setSelectedIndex(0);
    } catch (err) {
      console.error('Error loading initial products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || isSearchMode) return;
    try {
      setLoadingMore(true);
      const result = await productsApi.searchProductPrices('', currentPage + 1, 20);
      setAllPrices(prev => [...prev, ...result.data]);
      setDisplayItems(prev => [...prev, ...result.data]);
      setHasMore(result.pageNumber < result.pageCount);
      setCurrentPage(result.pageNumber);
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, isSearchMode, loadingMore]);

  const handleDebouncedSearch = async (q: string) => {
    try {
      setLoading(true);
      setIsSearchMode(true);
      const result = await productsApi.searchProductPrices(q, 1, 50);
      setDisplayItems(result.data);
      setSelectedIndex(0);
    } catch (err) {
      console.error('Search error:', err);
      setDisplayItems([]);
    } finally {
      setLoading(false);
    }
  };

  // دالة محسنة للـ scroll - الحل الأساسي للمشكلة
  const scrollToItem = useCallback((index: number) => {
    if (!listRef.current) return;
    
    const listElement = listRef.current;
    const itemElement = listElement.children[0]?.children[index] as HTMLElement; // الوصول للعنصر الصحيح داخل الـ List
    
    if (itemElement) {
      // استخدام scrollIntoView مع خيارات محددة
      itemElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // هذا هو المهم - يمنع القفز للأعلى أو الأسفل
        inline: 'nearest'
      });
    }
  }, []);

  // Arrow key handling on the search input, without ever losing focus
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (displayItems.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const nxt = Math.min(prev + 1, displayItems.length - 1);
          // تأخير بسيط للتأكد من تحديث الـ state أولاً
          setTimeout(() => scrollToItem(nxt), 0);
          return nxt;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const nxt = Math.max(prev - 1, 0);
          // تأخير بسيط للتأكد من تحديث الـ state أولاً
          setTimeout(() => scrollToItem(nxt), 0);
          return nxt;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (displayItems[selectedIndex]) {
          handleSelect(displayItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(0);
  };

  // Ensure selectedIndex is reset if items change
  useEffect(() => {
    if (displayItems.length > 0 && selectedIndex >= displayItems.length) {
      setSelectedIndex(0);
    }
  }, [displayItems.length, selectedIndex]);

  // useEffect لمراقبة تغيير selectedIndex
  useEffect(() => {
    if (selectedIndex >= 0 && displayItems.length > 0) {
      scrollToItem(selectedIndex);
    }
  }, [selectedIndex, scrollToItem, displayItems.length]);

  const handleSelect = (item: ProductPrice) => {
    if (!item.productId) {
      console.error('ProductPrice missing productId:', item);
      return;
    }
    onSelect(item);
    onClose();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      loadMoreProducts();
    }
  };

  const handleScanResult = (barcode: string) => {
    setSearchQuery(barcode);
    setScannerOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {t('products.selectPriceTitle')}
            <IconButton onClick={onClose}>
              <IconX size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          {/* Search field */}
          <Box mb={1}>
            <TextField
              inputRef={searchInputRef}
              fullWidth
              placeholder={t('products.searchPricesPlaceholder')}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleSearchKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setScannerOpen(true)}
                      startIcon={<IconBarcode size={16} />}
                    >
                      {t('barcode.scan')}
                    </Button>
                  </InputAdornment>
                )
              }}
              autoFocus
            />
          </Box>

          {/* Results info */}
          <Box mb={1}>
            <Typography variant="body2" color="text.secondary">
              {t('products.searchResults')}: {displayItems.length}
              {displayItems.length > 0 && (
                <Typography component="span" sx={{ ml: 2, color: 'primary.main' }}>
                  ({selectedIndex + 1} / {displayItems.length} {t('products.selected')})
                </Typography>
              )}
              {loading && (
                <Typography component="span" sx={{ ml: 2, color: 'info.main' }}>
                  - {t('common.searching')}...
                </Typography>
              )}
            </Typography>
          </Box>

          {/* Results list */}
          <Box
            ref={listRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              // إضافة scroll behavior محسن
              scrollBehavior: 'smooth'
            }}
            onScroll={handleScroll}
          >
            {loading && displayItems.length === 0 ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>{t('common.loading')}</Typography>
              </Box>
            ) : displayItems.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  {searchQuery
                    ? t('products.noSearchResults')
                    : t('products.startTypingPrices')}
                </Typography>
              </Box>
            ) : (
              <>
                <List dense sx={{ p: 0 }}>
                  {displayItems.map((price, index) => (
                    <ListItem key={`${price.id}-${index}`} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelect(price)}
                        selected={index === selectedIndex}
                        onMouseEnter={() => setSelectedIndex(index)} // تحديث الاختيار عند hover
                        sx={{
                          border: index === selectedIndex ? 2 : 1,
                          borderColor:
                            index === selectedIndex ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          mb: 0.5,
                          mx: 1,
                          backgroundColor:
                            index === selectedIndex
                              ? 'action.selected'
                              : 'transparent',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: 'primary.main'
                          },
                          py: 0.5,
                          // إضافة ارتفاع ثابت للعناصر لتحسين الـ scroll
                          minHeight: 80
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{ mb: 0.5, fontSize: '0.9rem' }}
                              >
                                {price.productName} – {price.unitName}
                              </Typography>
                              <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  {t('products.barcode')}: {price.barcode || '-'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  {t('products.unitFactor')}: {price.unitFactor}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  {t('products.cost')}:{' '}
                                  {price.cost?.toFixed(2) || '0.00'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                  sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                                >
                                  {t('products.salePrice')}: {price.price.toFixed(2)}
                                </Typography>
                                <Chip
                                  label={
                                    price.isActive
                                      ? t('products.active')
                                      : t('products.inactive')
                                  }
                                  color={price.isActive ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontSize: '0.65rem', height: '18px' }}
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                {/* Loading more indicator */}
                {loadingMore && (
                  <Box textAlign="center" py={1}>
                    <CircularProgress size={20} />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {t('products.loadingMore')}
                    </Typography>
                  </Box>
                )}

                {/* All results loaded */}
                {!hasMore && !isSearchMode && displayItems.length > 0 && (
                  <Box textAlign="center" py={1}>
                    <Typography variant="caption" color="text.secondary">
                      {t('products.allResultsLoaded')}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Navigation hints */}
          {displayItems.length > 0 && (
            <Box mt={1} sx={{ backgroundColor: 'background.default', p: 0.5, borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <IconArrowUp size={14} style={{ verticalAlign: 'middle' }} /> /{' '}
                <IconArrowDown size={14} style={{ verticalAlign: 'middle' }} />{' '}
                {t('products.navigateWithArrows')} | {t('products.selectWithEnter')} |{' '}
                Esc {t('common.close')}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanResult}
      />
    </>
  );
};

export default ProductPriceSearchDialog;
