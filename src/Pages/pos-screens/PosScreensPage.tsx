// File: src/pages/pos-screens/PosScreensPage.tsx
import React from 'react';
import {
  Container, 
  Snackbar, Alert, useMediaQuery, useTheme, Box, Button, Fab, Badge
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import OptimizedDragTree from './components/OptimizedScreenTree';
import ScreenCards from './components/mobile/ScreenCards';
import ScreenForm from './components/ScreenForm';
import MobileScreensFilter, { ScreensFilterState } from './components/mobile/MobileScreensFilter';
import * as apiSrv from 'src/utils/api/pagesApi/posScreensApi';
import { PosScreen } from 'src/utils/api/pagesApi/posScreensApi';

const PosScreensPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [items, setItems] = React.useState<PosScreen[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: PosScreen;
    parentScreen?: PosScreen;
  }>({ open: false, mode: 'add' });

  const [mobileFilters, setMobileFilters] = React.useState<ScreensFilterState>({
    searchQuery: '',
    status: '',
    visibility: '',
    parentFilter: '',
    sortBy: 'displayOrder',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  const fetchScreens = React.useCallback(async () => {
    try {
      setLoad(true);
      const result = await apiSrv.getAll();
      setItems(result);
    } catch (e: any) {
      setErr(e?.message || 'Load failed');
    } finally {
      setLoad(false);
    }
  }, []);

  React.useEffect(() => {
    fetchScreens();
  }, [fetchScreens]);

  /* ───── filter for desktop ───── */
  const filterTree = React.useCallback((screens: PosScreen[], searchQuery: string): PosScreen[] => {
    if (!searchQuery) return screens;
    
    return screens.reduce((acc: PosScreen[], screen) => {
      const matchesQuery = screen.name.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredChildren = screen.children ? filterTree(screen.children, searchQuery) : [];
      
      if (matchesQuery || filteredChildren.length > 0) {
        acc.push({
          ...screen,
          children: filteredChildren
        });
      }
      
      return acc;
    }, []);
  }, []);

  const desktopFiltered = React.useMemo(
    () => filterTree(items, query),
    [items, query, filterTree]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...items];

    const applyFiltersToTree = (screens: PosScreen[]): PosScreen[] => {
      return screens.reduce((acc: PosScreen[], screen) => {
        let includeScreen = true;

        if (mobileFilters.searchQuery.trim()) {
          const searchLower = mobileFilters.searchQuery.toLowerCase();
          const matchesSearch = screen.name.toLowerCase().includes(searchLower) ||
                               screen.icon.toLowerCase().includes(searchLower);
          
          const hasMatchingChildren = screen.children ? 
            applyFiltersToTree(screen.children).length > 0 : false;
          
          includeScreen = matchesSearch || hasMatchingChildren;
        }

        if (mobileFilters.status && includeScreen) {
          const isActive = mobileFilters.status === 'true';
          includeScreen = screen.isActive === isActive;
        }

        if (mobileFilters.visibility && includeScreen) {
          const isVisible = mobileFilters.visibility === 'true';
          includeScreen = screen.isVisible === isVisible;
        }

        if (mobileFilters.parentFilter && includeScreen) {
          if (mobileFilters.parentFilter === 'root') {
            includeScreen = !screen.parentId;
          } else {
            includeScreen = screen.parentId === mobileFilters.parentFilter;
          }
        }

        if (includeScreen) {
          const filteredChildren = screen.children ? 
            applyFiltersToTree(screen.children) : [];
          
          acc.push({
            ...screen,
            children: filteredChildren
          });
        }

        return acc;
      }, []);
    };

    result = applyFiltersToTree(result);

    const sortScreens = (screens: PosScreen[]): PosScreen[] => {
      const sorted = [...screens].sort((a, b) => {
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

      return sorted.map(screen => ({
        ...screen,
        children: screen.children ? sortScreens(screen.children) : []
      }));
    };

    return sortScreens(result);
  }, [items, mobileFilters]);

  const filtered = isMobile ? mobileFiltered : desktopFiltered;

  const getParentScreens = React.useCallback((screens: PosScreen[]): Array<{ id: string; name: string }> => {
    const parents: Array<{ id: string; name: string }> = [];
    
    const extractParents = (screens: PosScreen[]) => {
      screens.forEach(screen => {
        if (screen.children && screen.children.length > 0) {
          parents.push({ id: screen.id, name: screen.name });
          extractParents(screen.children);
        }
      });
    };
    
    extractParents(screens);
    return parents;
  }, []);

  const parentScreens = React.useMemo(() => getParentScreens(items), [items, getParentScreens]);

  const getActiveFiltersCount = React.useCallback(() => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.visibility) count++;
    if (mobileFilters.parentFilter) count++;
    return count;
  }, [mobileFilters]);

  const getTotalCount = React.useCallback((screens: PosScreen[]): number => {
    return screens.reduce((count, screen) => {
      return count + 1 + (screen.children ? getTotalCount(screen.children) : 0);
    }, 0);
  }, []);

  const totalCount = React.useMemo(() => getTotalCount(items), [items, getTotalCount]);
  const filteredCount = React.useMemo(() => getTotalCount(filtered), [filtered, getTotalCount]);

  /* ───── Reorder Handler ───── */
  const handleReorder = React.useCallback(async (reorderedScreens: PosScreen[], parentId?: string) => {
    try {
      // تحديث الحالة المحلية أولاً
      const updateTreeWithNewOrder = (screens: PosScreen[]): PosScreen[] => {
        if (!parentId) {
          return reorderedScreens.map((screen, index) => ({
            ...screen,
            displayOrder: index + 1
          }));
        } else {
          return screens.map(screen => {
            if (screen.id === parentId) {
              return { 
                ...screen, 
                children: reorderedScreens.map((child, index) => ({
                  ...child,
                  displayOrder: index + 1
                }))
              };
            }
            return {
              ...screen,
              children: screen.children ? updateTreeWithNewOrder(screen.children) : []
            };
          });
        }
      };

      const newItems = updateTreeWithNewOrder(items);
      setItems(newItems);

      // إرسال التحديث للخادم
      const reorderData = reorderedScreens.map((screen, index) => ({
        screenId: screen.id,
        displayOrder: index + 1,
        parentScreenId: parentId,
        screenName: screen.name,
        isVisible: screen.isVisible,
        colorHex: screen.colorHex,
        icon: screen.icon
      }));

      await apiSrv.reorderScreens(reorderData);
      await fetchScreens();
    } catch (e: any) {
      setErr(e?.message || 'Reorder failed');
      await fetchScreens();
    }
  }, [items, fetchScreens]);

  /* ───── CRUD ───── */
  const handleAdd = React.useCallback(async (body: {
    screenName: string;
    ParentScreenId?: string;
    isVisible: boolean;
    displayOrder: number;
    colorHex: string;
    icon: string;
  }) => {
    try {
      await apiSrv.add(body);
      await fetchScreens();
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.screenName?.[0] || e?.message || 'Add failed';
      setErr(msg);
    }
  }, [fetchScreens]);

  const handleUpdate = React.useCallback(async (screen: PosScreen) => {
    try {
      await apiSrv.update({
        Screenid: screen.id,
        screenName: screen.name,
        ParentScreenId: screen.parentId || undefined,
        isVisible: screen.isVisible,
        displayOrder: screen.displayOrder,
        colorHex: screen.colorHex,
        icon: screen.icon
      });
      await fetchScreens();
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.screenName?.[0] || e?.message || 'Update failed';
      setErr(msg);
    }
  }, [fetchScreens]);

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader exportData={filtered} loading={loading}/>
      
      {!isMobile && (
        <ActionsBar
          query={query}
          onQueryChange={setQuery}
          onAdd={() => setDialog({ open: true, mode: 'add' })}
        />
      )}

      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={() => setDialog({ open: true, mode: 'add' })}
            fullWidth
            size="large"
            sx={{ minHeight: 48, fontSize: '1rem' }}
          >
            {t('posScreens.add')}
          </Button>
        </Box>
      )}

      <Box sx={{ 
        width: '100%',
        overflow: 'hidden',
        '& .MuiPaper-root': {
          borderRadius: { xs: 1, sm: 2 },
        }
      }}>
        {isMobile ? (
          <ScreenCards
            screens={filtered}
            onEdit={(screen) => setDialog({ open: true, mode: 'edit', current: screen })}
            onAddChild={(parentScreen) => setDialog({ 
              open: true, 
              mode: 'add', 
              parentScreen 
            })}
            loading={loading}
          />
        ) : (
<OptimizedDragTree
  screens={filtered}
  onEdit={(screen) => setDialog({ open: true, mode: 'edit', current: screen })}
  onAddChild={(parentScreen) => setDialog({ 
    open: true, 
    mode: 'add', 
    parentScreen 
  })}
  onReorder={handleReorder}
/>
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
        <MobileScreensFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          parentScreens={parentScreens}
          totalResults={totalCount}
          filteredResults={filteredCount}
        />
      )}

      <ScreenForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        parentScreen={dialog.parentScreen}
        allScreens={items}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd({
              ...data, ParentScreenId: (data as any).parentScreenId ?? undefined,
              screenName: ''
          }))
          : ((data) => handleUpdate(data as PosScreen))
        }
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PosScreensPage;
