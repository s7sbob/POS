import React from 'react';
import { Grid, Box } from '@mui/material';
import { Control, UseFieldArrayReturn } from 'react-hook-form';
import { ProductPrice } from 'src/utils/api/purchaseProductsApi';
import ItemsToolbar from './ItemsToolbar';
import ItemsTable from './ItemsTable';
import ItemsMobileView from './ItemsMobileView';

interface Props {
  control: Control<any>;
  fields: UseFieldArrayReturn['fields'];
  watch: any;
  append: UseFieldArrayReturn['append'];
  remove: UseFieldArrayReturn['remove'];
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
  isMobile: boolean;
}

const ItemsSection: React.FC<Props> = ({
  control,
  fields,
  watch,
  remove,
  quickSearchQuery,
  setQuickSearchQuery,
  quickSearchResults,
  quickSearchOpen,
  setQuickSearchOpen,
  quickSearchSelectedIndex,
  setQuickSearchSelectedIndex,
  quickSearchInputRef,
  onProductSelect,
  onOpenDetailedSearch,
  onOpenScanner,
  isMobile
}) => {
  return (
    <Grid item xs={12}>
      {/* شريط الأدوات */}
      <ItemsToolbar
        quickSearchQuery={quickSearchQuery}
        setQuickSearchQuery={setQuickSearchQuery}
        quickSearchResults={quickSearchResults}
        quickSearchOpen={quickSearchOpen}
        setQuickSearchOpen={setQuickSearchOpen}
        quickSearchSelectedIndex={quickSearchSelectedIndex}
        setQuickSearchSelectedIndex={setQuickSearchSelectedIndex}
        quickSearchInputRef={quickSearchInputRef}
        onProductSelect={onProductSelect}
        onOpenDetailedSearch={onOpenDetailedSearch}
        onOpenScanner={onOpenScanner}
      />

      {/* منطقة الأصناف */}
      <Box 
        sx={{ 
          maxHeight: '40vh', 
          overflow: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1
        }}
      >
        {isMobile ? (
          <ItemsMobileView
            control={control}
            fields={fields}
            watch={watch}
            remove={remove}
            quickSearchInputRef={quickSearchInputRef}
          />
        ) : (
          <ItemsTable
            control={control}
            fields={fields}
            watch={watch}
            remove={remove}
            quickSearchInputRef={quickSearchInputRef}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ItemsSection;
