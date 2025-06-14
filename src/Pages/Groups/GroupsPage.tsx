import React from 'react';
import {
  Container, 
  Snackbar, Alert
} from '@mui/material';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import GroupTree from './components/GroupTree';
import GroupForm from './components/GroupForm';
import * as apiSrv from 'src/utils/api/pagesApi/groupsApi';
import { Group } from 'src/utils/api/pagesApi/groupsApi';

const GroupsPage: React.FC = () => {
  const [items, setItems] = React.useState<Group[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Group;
    parentGroup?: Group;
  }>({ open: false, mode: 'add' });

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

  /* ───── filter ───── */
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

  const filtered = React.useMemo(
    () => filterTree(items, query),
    [items, query]
  );

  /* ───── CRUD ───── */
  const handleAdd = async (body: { 
    name: string; 
    parentId?: string; 
    backgroundColor?: string; 
    fontColor?: string; 
  }) => {
    try {
      await apiSrv.add(body);
      // إعادة تحميل البيانات لضمان التحديث الصحيح للشجرة
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
      // إعادة تحميل البيانات لضمان التحديث الصحيح للشجرة
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
      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={() => setDialog({ open: true, mode: 'add' })}
      />

      <GroupTree
        groups={filtered}
        onEdit={(group) => setDialog({ open: true, mode: 'edit', current: group })}
        onAddChild={(parentGroup) => setDialog({ 
          open: true, 
          mode: 'add', 
          parentGroup 
        })}
      />

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
