// File: src/pages/products/components/ProductPriceSearchSelect.tsx
import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { searchProductPricesByNameOrBarcode } from 'src/utils/api/pagesApi/productsApi';

interface ProductPriceOption {
  productPriceId: string;
  product: {
    productID: string;
    productName: string;
  };
  unit: {
    unitName: string;
  };
  unitFactor: number;
  price: number;
  barcode: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: boolean;
  excludeProductId?: string;
}

const ProductPriceSearchSelect: React.FC<Props> = ({
  value,
  onChange,
  label,
  error = false,
  excludeProductId
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = React.useState<ProductPriceOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<ProductPriceOption | null>(null);
  const [open, setOpen] = React.useState(false);

  // البحث في المنتجات
  const searchProducts = React.useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await searchProductPricesByNameOrBarcode(searchTerm || '', 1, 50);
      let filteredData = response.data;

      // استبعاد المنتج الحالي إذا كان محدد
      if (excludeProductId) {
        filteredData = filteredData.filter(item => 
          item.product?.productID !== excludeProductId
        );
      }

      setOptions(filteredData);
    } catch (error) {
      console.error('Error searching products:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [excludeProductId]);

  // البحث عند فتح القائمة أو تغيير النص
  React.useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        searchProducts(inputValue);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [inputValue, searchProducts, open]);

  // تحديد الخيار المحدد عند تغيير القيمة
  React.useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(option => option.productPriceId === value);
      if (found) {
        setSelectedOption(found);
      }
    } else if (value && !selectedOption) {
      // إذا كان هناك قيمة محددة ولكن لا توجد في الخيارات، ابحث عنها
      searchProducts('');
    } else if (!value) {
      setSelectedOption(null);
    }
  }, [value, options, selectedOption, searchProducts]);

  // دالة عرض الخيار في القائمة
  const renderOption = (props: any, option: ProductPriceOption) => {
    const isSelected = selectedOption?.productPriceId === option.productPriceId;
    
    return (
      <Box 
        component="li" 
        {...props} 
        key={option.productPriceId}
        sx={{
          ...props.sx,
          backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          '&:hover': {
            backgroundColor: isSelected 
              ? 'rgba(25, 118, 210, 0.12)' 
              : 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option.product?.productName || 'منتج غير محدد'}
            </Typography>
            {isSelected && (
              <Chip 
                label="محدد" 
                size="small" 
                color="primary" 
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {option.unit?.unitName || 'وحدة غير محددة'} × {option.unitFactor}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {option.price?.toFixed(2)} جنيه
            </Typography>
          </Box>
          {option.barcode && (
            <Typography variant="caption" color="text.secondary">
              {option.barcode}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  // دالة عرض النص المحدد في الـ input
  const getOptionLabel = (option: ProductPriceOption | string) => {
    if (typeof option === 'string') return option;
    if (!option.product?.productName) return '';
    
    return `${option.product.productName} - ${option.unit?.unitName || 'وحدة'} × ${option.unitFactor} - ${option.price?.toFixed(2)} جنيه`;
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue?.productPriceId || '');
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={loading}
      loadingText={t('common.loading')}
      noOptionsText={inputValue ? t('products.noProductsFound') : t('products.startTyping')}
      isOptionEqualToValue={(option, value) => option.productPriceId === value.productPriceId}
      filterOptions={(x) => x} // تعطيل الفلترة المحلية
      PaperComponent={(props) => (
        <Paper 
          {...props} 
          sx={{ 
            '& .MuiAutocomplete-option': {
              '&[aria-selected="true"]': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&[aria-selected="true"].Mui-focused': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              }
            }
          }}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          size="small"
          placeholder={selectedOption ? selectedOption.product?.productName : t('products.searchPlaceholder')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={{
        '& .MuiAutocomplete-input': {
          fontSize: '0.875rem'
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 1,
          }
        }
      }}
    />
  );
};

export default ProductPriceSearchSelect;
