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
import { debounce } from '@mui/material/utils';
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
  posPriceName?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: boolean;
  excludeProductId?: string;
  showPriceName?: boolean;
  hideUnitInfo?: boolean;
  placeholder?: string;
}

const ProductPriceSearchSelect: React.FC<Props> = ({
  value,
  onChange,
  label,
  error = false,
  excludeProductId,
  showPriceName = false,
  hideUnitInfo = false,
  placeholder
}) => {
  const { t } = useTranslation();
const [options, setOptions] = React.useState<ProductPriceOption[]>([]); // ✅ دايماً array فاضي
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState<ProductPriceOption | null>(null);
  const [open, setOpen] = React.useState(false);

  // إضافة AbortController لإلغاء الطلبات السابقة
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // ⭐ دالة لتحميل النتائج الأولية (أول 10)
const loadInitialResults = React.useCallback(async () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  abortControllerRef.current = new AbortController();
  setLoading(true);
  
  try {
    const response = await searchProductPricesByNameOrBarcode('', 1, 10);
    
    let filteredData: ProductPriceOption[] = [];
    // ⭐ تحديث المسار للبيانات
    const apiData = response.data;
    if (apiData && Array.isArray(apiData)) {
      filteredData = apiData
        .filter(item => item && item.product && item.productPriceId)
        .map(item => ({
          productPriceId: item.productPriceId,
          product: {
            productID: item.product.productID,
            productName: item.product.productName
          },
          unit: {
            unitName: item.unit?.unitName || 'قطعة'
          },
          unitFactor: item.unitFactor || 1,
          price: item.price || 0,
          barcode: item.barcode || '',
          posPriceName: item.posPriceName || ''
        }));
    }

    if (excludeProductId) {
      filteredData = filteredData.filter(item => 
        item.product?.productID !== excludeProductId
      );
    }

    setOptions(filteredData);
  } catch (error) {
    setOptions([]);
  } finally {
    setLoading(false);
  }
}, [excludeProductId]);

  // دالة البحث مع debounce
const debouncedSearch = React.useMemo(
  () => debounce(async (searchTerm: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (!searchTerm.trim()) {
      await loadInitialResults();
      return;
    }

    setLoading(true);
    try {
      const response = await searchProductPricesByNameOrBarcode(searchTerm, 1, 50);
      
      // ⭐ تحديد نوع البيانات
      let filteredData: ProductPriceOption[] = [];
      if (response.data && Array.isArray(response.data)) {
        filteredData = response.data
          .filter(item => item && item.product && item.productPriceId)
          .map(item => ({
            productPriceId: item.productPriceId,
            product: {
              productID: item.product.productID,
              productName: item.product.productName
            },
            unit: {
              unitName: item.unit?.unitName || 'قطعة'
            },
            unitFactor: item.unitFactor || 1,
            price: item.price || 0,
            barcode: item.barcode || '',
            posPriceName: item.posPriceName || ''
          }));
      }

      if (excludeProductId) {
        filteredData = filteredData.filter(item => 
          item.product?.productID !== excludeProductId
        );
      }

      setOptions(filteredData);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name !== 'AbortError') {
        setOptions([]);
      }
    } finally {
      setLoading(false);
    }
  }, 300),
  [excludeProductId, loadInitialResults]
);

  // ⭐ تحديث useEffect للبحث
  React.useEffect(() => {
    if (open) {
      if (inputValue.trim()) {
        debouncedSearch(inputValue);
      } else {
        // عرض أول 10 نتائج عند فتح القائمة بدون بحث
        loadInitialResults();
      }
    }
  }, [inputValue, debouncedSearch, open, loadInitialResults]);

  // تنظيف عند unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  // تحديد الخيار المحدد عند تغيير القيمة
  React.useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(option => option.productPriceId === value);
      if (found && (!selectedOption || selectedOption.productPriceId !== found.productPriceId)) {
        setSelectedOption(found);
      }
    } else if (!value && selectedOption) {
      setSelectedOption(null);
    }
  }, [value, options]);

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
              {showPriceName && option.posPriceName 
                ? option.posPriceName 
                : option.product?.productName || 'منتج غير محدد'
              }
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
          
          {!hideUnitInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {option.unit?.unitName || 'وحدة غير محددة'} × {option.unitFactor}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {option.price?.toFixed(2)} جنيه
              </Typography>
            </Box>
          )}
          
          {showPriceName && option.posPriceName && (
            <Typography variant="caption" color="text.secondary">
              {option.product?.productName} - {option.price?.toFixed(2)} جنيه
            </Typography>
          )}
          
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
    
    if (showPriceName && option.posPriceName) {
      return option.posPriceName;
    }
    
    if (hideUnitInfo) {
      return option.product.productName;
    }
    
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
      onInputChange={(_, newInputValue, reason) => {
        if (reason === 'input') {
          setInputValue(newInputValue);
        }
      }}
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      loading={loading}
      loadingText={t('common.loading')}
      noOptionsText={inputValue ? t('products.noProductsFound') : t('products.startTyping')}
      isOptionEqualToValue={(option, value) => option.productPriceId === value.productPriceId}
      filterOptions={(x) => x}
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
          placeholder={placeholder || (selectedOption ? selectedOption.product?.productName : t('products.searchPlaceholder'))}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          // ⭐ تحديد النص عند Focus
          onFocus={(e) => {
            if (e.target.value) {
              e.target.select();
            }
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
