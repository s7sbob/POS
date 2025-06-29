// File: src/pages/delivery/zones/DeliveryZonesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge, Typography, Stack, TextField, 
  InputAdornment, IconButton, Chip
} from '@mui/material';
import { IconSearch, IconX, IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import ZoneTable from './components/ZoneTable';
import ZoneRow from './components/ZoneRow';
import ZoneForm from './components/ZoneForm';
import MobileZonesFilter, { ZonesFilterState } from './components/mobile/MobileZonesFilter';
import * as apiSrv from 'src/utils/api/pagesApi/deliveryZonesApi';
import { DeliveryZone } from 'src/utils/api/pagesApi/deliveryZonesApi';

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {}

const DeliveryZonesPage: React.FC<Props> = (props) => {
  const { canAdd = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [zones, setZones] = React.useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = React.useState<DeliveryZone | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: DeliveryZone;
  }>({ open: false, mode: 'add', current: undefined });

  const [mobileFilters, setMobileFilters] = React.useState<ZonesFilterState>({
    searchQuery: '',
    status: '',
    branchFilter: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchZones = async () => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll();
      setZones(data);
    } catch (e: any) {
      setErr(e?.message || t('deliveryZones.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchZones();
  }, []);

  const searchZones = (query: string) => {
    if (!query.trim()) {
      return zones;
    }
    
    const searchLower = query.toLowerCase();
    return zones.filter(zone => 
      zone.name.toLowerCase().includes(searchLower) ||
      zone.branchName?.toLowerCase().includes(searchLower)
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...zones];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(zone => 
        zone.name.toLowerCase().includes(searchLower) ||
        zone.branchName?.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(zone => zone.isActive === isActive);
    }

    if (mobileFilters.branchFilter) {
      result = result.filter(zone => zone.branchId === mobileFilters.branchFilter);
    }

    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (mobileFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [zones, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchZones(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.branchFilter) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchZones();
    } catch (e: any) {      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updatedZone = await apiSrv.update(data);
      setZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
      
      if (selectedZone && selectedZone.id === data.id) {
        setSelectedZone(updatedZone);
      }
      
      return updatedZone;
    } catch (e: any) {      throw e;
    }
  };

  const handleSubmit = async (data: any, saveAction: 'save' | 'saveAndNew') => {
    try {
      if (dialog.mode === 'add') {
        await handleAdd(data);
      } else {
        await handleUpdate(data);
      }
      
      if (saveAction === 'save') {
        setDialog({ open: false, mode: 'add', current: undefined });
      } else {
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (zone: DeliveryZone) => {
    setDialog({ open: true, mode: 'edit', current: zone });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
<PageHeader 
  exportData={zones} 
  loading={loading}
  onDataChange={fetchZones} // ⭐ إضافة callback
/>
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('deliveryZones.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <IconX size={16} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
            </Box>

            <ActionsBar
              onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
            />
          </Stack>

          {searchQuery && (
            <Box mt={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${t('deliveryZones.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('deliveryZones.resultsCount', { count: displayedData.length })}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {canAdd && (
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={() => setDialog({ open: true, mode: 'add', current: undefined })}
              fullWidth
              size="large"
              sx={{ minHeight: 48, fontSize: '1rem' }}
            >
              {t('deliveryZones.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('deliveryZones.title')} ({displayedData.length})
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('deliveryZones.noSearchResults') : t('deliveryZones.noZones')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(zone => (
                  <ZoneRow
                    key={zone.id}
                    zone={zone}
                    onEdit={() => handleEdit(zone)}
                    isSelected={selectedZone?.id === zone.id}
                  />
                ))
              : (
                  <ZoneTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    selectedZoneId={selectedZone?.id}
                  />
                )}
          </>
        )}
      </Box>

      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setFilterOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000
          }}
        >
          <Badge badgeContent={getActiveFiltersCount()} color="error">
            <IconFilter />
          </Badge>
        </Fab>
      )}

      {isMobile && (
        <MobileZonesFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={zones.length}
          filteredResults={displayedData.length}
        />
      )}

      <ZoneForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      /></Container>
  );
};

export default DeliveryZonesPage;
function setErr(_arg0: any) {
  throw new Error('Function not implemented.');
}

