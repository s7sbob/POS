// File: src/pages/groups/GroupsPage.tsx
import React from 'react';
import {
  Container, 
  Snackbar, Alert, useMediaQuery, useTheme, Box, Button, Fab, Badge
} from '@mui/material';
import { IconFilter, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import GroupTree from './components/GroupTree';
import GroupCards from './components/mobile/GroupCards';
import GroupForm from './components/GroupForm';
import MobileGroupsFilter, { GroupsFilterState } from './components/mobile/MobileGroupsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/groupsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';

const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [items, setItems] = React.useState<Group[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Group;
    parentGroup?: Group;
  }>({ open: false, mode: 'add' });

  // حالة الفلاتر للموبايل
  const [mobileFilters, setMobileFilters] = React.useState<GroupsFilterState>({
    searchQuery: '',
    status: '',
    parentFilter: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  /* ───── fetch all ───── */
  React.useEffect(() => {
    (async () => {
      try { 
        setItems(await apiSrv.getAll()); 
      }
      catch (e: any) { 
        setErr(e?.message || 'Load failed'); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, []);

  /* ───── filter for desktop ───── */
  const filterTree = (groups: Group[], searchQuery: string): Group[] => {
    if (!searchQuery) return groups;
    
    return groups.reduce((acc: Group[], group) => {
      const matchesQuery = group.name.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredChildren = group.children ? filterTree(group.children, searchQuery) : [];
      
      if (matchesQuery || filteredChildren.length > 0) {
        acc.push({
          ...group,
          children: filteredChildren
        });
      }
      
      return acc;
    }, []);
  };

  const desktopFiltered = React.useMemo(
    () => filterTree(items, query),
    [items, query]
  );

  /* ───── filter for mobile ───── */
  const mobileFiltered = React.useMemo(() => {
    let result = [...items];

    // تطبيق الفلاتر على الشجرة المسطحة
    const applyFiltersToTree = (groups: Group[]): Group[] => {
      return groups.reduce((acc: Group[], group) => {
        let includeGroup = true;

        // فلتر البحث
        if (mobileFilters.searchQuery.trim()) {
          const searchLower = mobileFilters.searchQuery.toLowerCase();
          const matchesSearch = group.name.toLowerCase().includes(searchLower) ||
                               group.code.toString().includes(searchLower);
          
          // البحث في المجموعات الفرعية أيضاً
          const hasMatchingChildren = group.children ? 
            applyFiltersToTree(group.children).length > 0 : false;
          
          includeGroup = matchesSearch || hasMatchingChildren;
        }

        // فلتر الحالة
        if (mobileFilters.status && includeGroup) {
          const isActive = mobileFilters.status === 'true';
          includeGroup = group.isActive === isActive;
        }

        // فلتر المجموعة الأب
        if (mobileFilters.parentFilter && includeGroup) {
          if (mobileFilters.parentFilter === 'root') {
            includeGroup = !group.parentId;
          } else {
            includeGroup = group.parentId === mobileFilters.parentFilter;
          }
        }

        if (includeGroup) {
          const filteredChildren = group.children ? 
            applyFiltersToTree(group.children) : [];
          
          acc.push({
            ...group,
            children: filteredChildren
          });
        }

        return acc;
      }, []);
    };

    result = applyFiltersToTree(result);

    // الترتيب
    const sortGroups = (groups: Group[]): Group[] => {
      const sorted = [...groups].sort((a, b) => {
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

      return sorted.map(group => ({
        ...group,
        children: group.children ? sortGroups(group.children) : []
      }));
    };

    return sortGroups(result);
  }, [items, mobileFilters]);

  // اختيار البيانات المفلترة حسب نوع الجهاز
  const filtered = isMobile ? mobileFiltered : desktopFiltered;

  // الحصول على المجموعات الأب للفلتر
  const getParentGroups = (groups: Group[]): Array<{ id: string; name: string }> => {
    const parents: Array<{ id: string; name: string }> = [];
    
    const extractParents = (groups: Group[]) => {
      groups.forEach(group => {
        if (group.children && group.children.length > 0) {
          parents.push({ id: group.id, name: group.name });
          extractParents(group.children);
        }
      });
    };
    
    extractParents(groups);
    return parents;
  };

  const parentGroups = getParentGroups(items);

  // حساب عدد الفلاتر النشطة للموبايل
  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.parentFilter) count++;
    return count;
  };

  // حساب العدد الإجمالي للمجموعات
  const getTotalCount = (groups: Group[]): number => {
    return groups.reduce((count, group) => {
      return count + 1 + (group.children ? getTotalCount(group.children) : 0);
    }, 0);
  };

  const totalCount = getTotalCount(items);
  const filteredCount = getTotalCount(filtered);

  /* ───── CRUD ───── */
  const handleAdd = async (body: { 
    name: string; 
    parentId?: string; 
    backgroundColor?: string; 
    fontColor?: string; 
  }) => {
    try {
      await apiSrv.add(body);
      setItems(await apiSrv.getAll());
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.GroupName?.[0] || e?.message || 'Add failed';
      setErr(msg);
    }
  };

  const handleUpdate = async (group: Group) => {
    try {
      await apiSrv.update(group);
      setItems(await apiSrv.getAll());
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.GroupName?.[0] || e?.message || 'Update failed';
      setErr(msg);
    }
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader exportData={filtered} loading={loading}/>
      
      {/* شريط الأدوات - يظهر فقط في الديسكتوب */}
      {!isMobile && (
        <ActionsBar
          query={query}
          onQueryChange={setQuery}
          onAdd={() => setDialog({ open: true, mode: 'add' })}
        />
      )}

      {/* زر الإضافة للموبايل */}
      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<IconPlus />}
            onClick={() => setDialog({ open: true, mode: 'add' })}
            fullWidth
            size="large"
            sx={{
              minHeight: 48,
              fontSize: '1rem'
            }}
          >
            {t('groups.add')}
          </Button>
        </Box>
      )}

      {/* عرض البيانات */}
      <Box sx={{ 
        width: '100%',
        overflow: 'hidden',
        '& .MuiPaper-root': {
          borderRadius: { xs: 1, sm: 2 },
        }
      }}>
        {isMobile ? (
          <GroupCards
            groups={filtered}
            onEdit={(group) => setDialog({ open: true, mode: 'edit', current: group })}
            onAddChild={(parentGroup) => setDialog({ 
              open: true, 
              mode: 'add', 
              parentGroup 
            })}
            loading={loading}
          />
        ) : (
          <GroupTree
            groups={filtered}
            onEdit={(group) => setDialog({ open: true, mode: 'edit', current: group })}
            onAddChild={(parentGroup) => setDialog({ 
              open: true, 
              mode: 'add', 
              parentGroup 
            })}
          />
        )}
      </Box>

      {/* زر الفلترة للموبايل */}
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

      {/* مكون الفلترة للموبايل */}
      {isMobile && (
        <MobileGroupsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          parentGroups={parentGroups}
          totalResults={totalCount}
          filteredResults={filteredCount}
        />
      )}

      {/* ------------ Form Dialog ------------ */}
      <GroupForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        parentGroup={dialog.parentGroup}
        allGroups={items}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd({ ...data, parentId: data.parentId ?? undefined }))
          : ((data) => handleUpdate(data as Group))
        }
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>

      {loading && <div>Loading…</div>}
    </Container>
  );
};

export default GroupsPage;
