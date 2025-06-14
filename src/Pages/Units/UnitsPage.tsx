import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert
} from '@mui/material';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import UnitTable from './components/UnitTable';
import UnitRow from './components/UnitRow';
import UnitForm from './components/UnitForm';
import * as apiSrv from 'src/utils/api/pagesApi/unitsApi';
import { Unit } from 'src/utils/api/pagesApi/unitsApi';

const UnitsPage: React.FC = () => {
  const [items, setItems] = React.useState<Unit[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Unit;
  }>({ open: false, mode: 'add' });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ───── fetch all ───── */
  React.useEffect(() => {
    (async () => {
      try { setItems(await apiSrv.getAll()); }
      catch (e: any) { setErr(e?.message || 'Load failed'); }
      finally { setLoad(false); }
    })();
  }, []);

  /* ───── filter ───── */
  const filtered = React.useMemo(
    () => query ? items.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) : items,
    [items, query]
  );

  /* ───── CRUD ───── */
  const handleAdd = async (body: { name: string; }) => {
    try {
      const nw = await apiSrv.add(body);
      setItems(p => [nw, ...p]);
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.UnitName?.[0] || e?.message || 'Add failed';
      setErr(msg);
    }
  };

  const handleUpdate = async (u: Unit) => {
    try {
      const up = await apiSrv.update(u);
      setItems(p => p.map(x => x.id === up.id ? up : x));
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg =
        e?.errors?.UnitName?.[0] ||
        e?.message ||
        'Update failed';
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

      {isDownSm
        ? filtered.map(u => (
            <UnitRow
              key={u.id}
              unit={u}
              onEdit={() => setDialog({ open: true, mode: 'edit', current: u })}
            />
          ))
        : (
            <UnitTable
              rows={filtered}
              onEdit={(u) => setDialog({ open: true, mode: 'edit', current: u })}
            />
          )}

      {/* ------------ Form Dialog ------------ */}
      <UnitForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd(data as { name: string; }))
          : ((data) => handleUpdate(data as Unit))
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

export default UnitsPage;
