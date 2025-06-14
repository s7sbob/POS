import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert
} from '@mui/material';

import PageHeader     from './components/PageHeader';
import ActionsBar     from './components/ActionsBar';
import WarehouseTable from './components/WarehouseTable';
import WarehouseRow   from './components/WarehouseRow';
import WarehouseForm  from './components/WarehouseForm';

import * as apiSrv from 'src/utils/api/pagesApi/warehousesApi';
import { Warehouse } from 'src/utils/api/pagesApi/warehousesApi';

const WarehousesPage: React.FC = () => {
  const [items, setItems] = React.useState<Warehouse[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr]   = React.useState('');
  const [loading, setLoad] = React.useState(true);

  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Warehouse;
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
    () => query ? items.filter(w => w.name.toLowerCase().includes(query.toLowerCase())) : items,
    [items, query]
  );

  /* ───── CRUD ───── */
  const handleAdd = async (body: { name: string; address: string }) => {
    try {
      const nw = await apiSrv.add(body);
      setItems(p => [nw, ...p]);
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg = e?.errors?.WarehouseName?.[0] || e?.message || 'Add failed';
      setErr(msg)
    }
  };

  const handleUpdate = async (w: Warehouse) => {
    try {
      const up = await apiSrv.update(w);
      setItems(p => p.map(x => x.id === up.id ? up : x));
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      const msg =
        e?.errors?.WarehouseName?.[0] ||
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
        ? filtered.map(w => (
            <WarehouseRow
              key={w.id}
              warehouse={{
                ...w,
                status: w.isActive ? "active" : "inactive"
              }}
              onEdit={() => setDialog({ open: true, mode: 'edit', current: w })}
            />
          ))
        : (
          <WarehouseTable
            rows={filtered}
            onEdit={w => setDialog({ open: true, mode: 'edit', current: w })}
          />
        )}

      {/* ------------ Form Dialog ------------ */}
      <WarehouseForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add'
          ? ((data) => handleAdd(data as { name: string; address: string }))
          : ((data) => handleUpdate(data as Warehouse))
        }
      />

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setErr('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {loading && <p>Loading…</p>}
    </Container>
  );
};

export default WarehousesPage;
