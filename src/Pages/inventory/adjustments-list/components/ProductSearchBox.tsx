// File: src/pages/inventory/adjustment/components/ProductSearchBox.tsx
import React, { useState, useRef } from 'react';
import {
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  ClickAwayListener,
  IconButton
} from '@mui/material';
import { IconSearch, IconBarcode } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import BarcodeScanner from './BarcodeScanner';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredDetails: any[];
  onProductSelect: (productId: string) => void;
  onProductFocus: (productId: string) => void; // إضافة جديدة
}

const ProductSearchBox: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  filteredDetails,
  onProductSelect,
  onProductFocus
}) => {
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setShowResults(value.trim().length > 0 && filteredDetails.length > 0);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || filteredDetails.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredDetails.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredDetails[selectedIndex]) {
          handleProductSelect(filteredDetails[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  const handleProductSelect = (product: any) => {
    onProductSelect(product.productId);
    // التركيز على حقل الكمية للمنتج المحدد
    onProductFocus(product.productId);
    setShowResults(false);
    onSearchChange('');
  };

  const handleBarcodeScanned = (barcode: string) => {
    onSearchChange(barcode);
    setScannerOpen(false);
    
    const foundProduct = filteredDetails.find(detail => 
      detail.barcode && detail.barcode.toLowerCase() === barcode.toLowerCase()
    );
    
    if (foundProduct) {
      setTimeout(() => {
        handleProductSelect(foundProduct);
      }, 100);
    }
  };

  return (
    <Box sx={{ mb: 2, position: 'relative' }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('adjustment.search.title')}
        </Typography>
        
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
          <Box ref={searchRef}>
            <TextField
              fullWidth
              placeholder={t('adjustment.search.placeholder')}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowResults(searchQuery.trim().length > 0 && filteredDetails.length > 0)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setScannerOpen(true)}
                      size="small"
                      title={t('adjustment.search.scanBarcode')}
                    >
                      <IconBarcode size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {showResults && filteredDetails.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: 300,
                  overflow: 'auto',
                  mt: 1
                }}
              >
                <List dense>
                  {filteredDetails.slice(0, 10).map((product, index) => (
                    <ListItem key={product.productId} disablePadding>
                      <ListItemButton
                        onClick={() => handleProductSelect(product)}
                        selected={index === selectedIndex}
                        sx={{
                          backgroundColor: index === selectedIndex ? 'action.selected' : 'transparent'
                        }}
                      >
                        <ListItemText
                          primary={`${product.productName} — ${product.unitName}`}
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {t('adjustment.search.currentQuantity')}: {product.oldQuantity?.toFixed(2) || '0.00'}
                              </Typography>
                              {product.barcode && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                  {t('adjustment.search.barcode')}: {product.barcode}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Paper>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />
    </Box>
  );
};

export default ProductSearchBox;
