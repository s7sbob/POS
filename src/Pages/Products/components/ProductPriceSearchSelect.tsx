// File: src/pages/products/components/ProductPriceSearchSelect.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Popper,
  ListSubheader
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { 
  getProductPricesWithPagination, 
  searchProductPricesByNameOrBarcode,
  Product
} from 'src/utils/api/pagesApi/productsApi';

interface ProductPriceOption {
  id: string;
  productId: string;
  productName: string;
  unitName: string;
  unitFactor: number;
  price: number;
  barcode: string;
  posPriceName: string;
  isGenerated: boolean;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: boolean;
  disabled?: boolean;
  excludeProductId?: string;
}

// تعريف أنواع البيانات للـ API response
interface SearchResultItem {
  productPriceId: string;
  barcode: string;
  unitId?: string;
  unit?: {
    unitID: string;
    unitCode: number;
    unitName: string;
    branchID?: string;
    companyID?: string;
    isActive: boolean;
  };
  price: number;
  posPriceName?: string;
  unitFactor: number;
  isGenerated: boolean;
  product?: {
    productID: string;
    productName: string;
    groupId?: string;
    productType: number;
    cost: number;
    description?: string;
    imageUrl?: string;
    reorderLevel: number;
    lastPurePrice: number;
    expirationDays: number;
    productPrices: any[];
  };
  productPrices: any[];
  components: any[];
}

const ProductPriceSearchSelect: React.FC<Props> = ({
  value,
  onChange,
  label,
  error = false,
  disabled = false,
  excludeProductId
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ProductPriceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptionCache, setSelectedOptionCache] = useState<ProductPriceOption | null>(null);

  // تحويل المنتجات العادية إلى خيارات (للتحميل الأولي)
  const convertProductsToOptions = (products: Product[]): ProductPriceOption[] => {
    const allOptions: ProductPriceOption[] = [];
    
    products.forEach(product => {
      if (excludeProductId && product.id === excludeProductId) {
        return; // تجاهل المنتج الحالي
      }
      
      product.productPrices?.forEach(price => {
        allOptions.push({
          id: price.id || '',
          productId: product.id,
          productName: product.name,
          unitName: 'وحدة', // سيتم تحديثها من الـ units API
          unitFactor: price.unitFactor,
          price: price.price,
          barcode: price.barcode,
          posPriceName: price.posPriceName,
          isGenerated: price.isGenerated
        });
      });
    });
    
    return allOptions;
  };

  // تحويل نتائج البحث إلى خيارات مع التحقق من الأنواع
  const convertSearchResultsToOptions = (searchData: SearchResultItem[]): ProductPriceOption[] => {
    return searchData
      .filter(item => {
        // تجاهل المنتج الحالي
        if (excludeProductId && item.product?.productID === excludeProductId) {
          return false;
        }
        return true;
      })
      .map(item => ({
        id: String(item.productPriceId || ''),
        productId: String(item.product?.productID || ''),
        productName: String(item.product?.productName || 'منتج غير محدد'),
        unitName: String(item.unit?.unitName || 'وحدة غير محددة'),
        unitFactor: Number(item.unitFactor || 1),
        price: Number(item.price || 0),
        barcode: String(item.barcode || ''),
        posPriceName: String(item.posPriceName || ''),
        isGenerated: Boolean(item.isGenerated)
      }))
      .filter(option => option.id && option.productId); // فلترة العناصر التي لها IDs صحيحة
  };

  // تحميل البيانات الأولية
  const loadInitialData = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await getProductPricesWithPagination(1, 20);
      const newOptions = convertProductsToOptions(response.data);
      setOptions(newOptions);
      setCurrentPage(1);
      setHasMore(response.pageNumber < response.pageCount);
    } catch (error) {
      console.error('Error loading initial product prices:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // تحميل المزيد من البيانات (pagination)
  const loadMoreData = async () => {
    if (loading || !hasMore || searchQuery) return;
    
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getProductPricesWithPagination(nextPage, 20);
      const newOptions = convertProductsToOptions(response.data);
      setOptions(prev => [...prev, ...newOptions]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.pageCount);
    } catch (error) {
      console.error('Error loading more product prices:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب تفاصيل سعر محدد
  const fetchSpecificPrice = async (priceId: string) => {
    try {
      const searchResponse = await searchProductPricesByNameOrBarcode(priceId, 1, 10);
      const foundItem = searchResponse.data.find(item => item.productPriceId === priceId);
      
      if (foundItem) {
        const option: ProductPriceOption = {
          id: String(foundItem.productPriceId || ''),
          productId: String(foundItem.product?.productID || ''),
          productName: String(foundItem.product?.productName || 'منتج غير محدد'),
          unitName: String(foundItem.unit?.unitName || 'وحدة غير محددة'),
          unitFactor: Number(foundItem.unitFactor || 1),
          price: Number(foundItem.price || 0),
          barcode: String(foundItem.barcode || ''),
          posPriceName: String(foundItem.posPriceName || ''),
          isGenerated: Boolean(foundItem.isGenerated)
        };
        
        setSelectedOptionCache(option);
        // أضف إلى الخيارات إذا لم تكن موجودة
        setOptions(prev => {
          const exists = prev.find(opt => opt.id === option.id);
          if (!exists) {
            return [option, ...prev];
          }
          return prev;
        });
        
        return option;
      }
    } catch (error) {
      console.error('Error fetching specific price:', error);
    }
    return null;
  };

  // البحث مع debounce
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchQuery('');
        await loadInitialData();
        return;
      }

      setLoading(true);
      setSearchQuery(query);
      try {
        console.log('Searching for:', query);
        
        const response = await searchProductPricesByNameOrBarcode(query, 1, 50);
        console.log('Search response:', response);
        
        // التحقق من وجود البيانات
        if (response && response.data && Array.isArray(response.data)) {
          const searchOptions = convertSearchResultsToOptions(response.data);
          console.log('Converted options:', searchOptions);
          setOptions(searchOptions);
        } else {
          console.warn('Invalid search response structure:', response);
          setOptions([]);
        }
        
        setCurrentPage(1);
        setHasMore(false); // في البحث لا نحتاج pagination إضافي
      } catch (error) {
        console.error('Error searching product prices:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [excludeProductId]
  );

  // تحميل البيانات عند فتح القائمة
  useEffect(() => {
    if (open && options.length === 0) {
      loadInitialData();
    }
  }, [open]);

  // البحث عند تغيير النص
  useEffect(() => {
    if (open) {
      debouncedSearch(inputValue);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, open, debouncedSearch]);

  // جلب تفاصيل القيمة المحددة عند التحميل
  useEffect(() => {
    if (value && !selectedOptionCache && !loading) {
      fetchSpecificPrice(value);
    }
  }, [value]);

  // العثور على القيمة المحددة مع cache
  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    
    // البحث في الخيارات المحملة أولاً
    const foundInOptions = options.find(option => option.id === value);
    if (foundInOptions) {
      setSelectedOptionCache(foundInOptions);
      return foundInOptions;
    }
    
    // إذا لم نجدها، استخدم الـ cache
    if (selectedOptionCache && selectedOptionCache.id === value) {
      return selectedOptionCache;
    }
    
    return null;
  }, [value, options, selectedOptionCache]);

  const handleChange = (_event: any, newValue: ProductPriceOption | null) => {
    onChange(newValue ? newValue.id : '');
  };

  const getOptionLabel = (option: ProductPriceOption | string) => {
    if (typeof option === 'string') {
      const found = options.find(opt => opt.id === option);
      return found ? `${found.productName} - ${found.unitName} (${found.unitFactor}) - ${found.price}` : '';
    }
    return `${option.productName} - ${option.unitName} (${option.unitFactor}) - ${option.price}`;
  };

  // مكون Popper مخصص للتعامل مع scroll loading
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        style={{ width: props.anchorEl ? props.anchorEl.clientWidth : undefined }}
        placement="bottom-start"
      />
    );
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedOption}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={getOptionLabel}
      loading={loading}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      PopperComponent={CustomPopper}
      ListboxProps={{
        onScroll: (event: React.SyntheticEvent) => {
          const listboxNode = event.currentTarget;
          if (
            listboxNode.scrollTop + listboxNode.clientHeight >=
            listboxNode.scrollHeight - 5
          ) {
            loadMoreData();
          }
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          placeholder={t('products.searchProductPrices')}
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
      renderOption={(props, option, { index }) => {
        const isLastItem = index === options.length - 1;
        
        return (
          <React.Fragment key={option.id}>
            <Box component="li" {...props}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {option.productName}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                    {option.price.toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={`${option.unitName} × ${option.unitFactor}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  
                  {option.barcode && (
                    <Chip
                      label={option.barcode}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                  
                  {option.isGenerated && (
                    <Chip
                      label={t('products.autoGenerated')}
                      size="small"
                      color="info"
                    />
                  )}
                </Box>
                
                {option.posPriceName && (
                  <Typography variant="caption" color="text.secondary">
                    {option.posPriceName}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* مؤشر التحميل في النهاية */}
            {isLastItem && hasMore && !searchQuery && (
              <ListSubheader sx={{ textAlign: 'center', py: 1 }}>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t('products.scrollForMore')}
                  </Typography>
                )}
              </ListSubheader>
            )}
          </React.Fragment>
        );
      }}
      noOptionsText={
        searchQuery 
          ? t('products.noSearchResults') 
          : t('products.noProductPricesFound')
      }
      loadingText={t('common.loading')}
    />
  );
};

export default ProductPriceSearchSelect;
