import React from 'react';
import { Container, useMediaQuery, Snackbar, Alert } from '@mui/material';

import PageHeader     from './components/PageHeader';
import ActionsBar     from './components/ActionsBar';
import WarehouseTable from './components/WarehouseTable';
import WarehouseRow   from './components/WarehouseRow';
import WarehouseForm  from './components/WarehouseForm';

import * as apiSrv from 'src/utils/warehousesApi';
import { Warehouse } from 'src/utils/warehousesApi';

const WarehousesPage: React.FC = () => {
  /* ─────────── State ─────────── */
  const [items, setItems]   = React.useState<Warehouse[]>([]);
  const [query, setQuery]   = React.useState('');
  const [loading, setLoad]  = React.useState(true);
  const [error , setErr]    = React.useState('');
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Warehouse;
  }>({ open: false, mode: 'add' });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ─────────── Fetch All ─────────── */
  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiSrv.getAll();
        setItems(data);
      } catch (e: any) {
        setErr(e?.message || 'Cannot load data');
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  /* ─────────── Search Filter ─────────── */
  const filtered = React.useMemo(() => {
    return query
      ? items.filter((w) =>
          w.name.toLowerCase().includes(query.toLowerCase())
        )
      : items;
  }, [items, query]);

  /* ─────────── Handlers ─────────── */
  const handleAdd = async (body: { name: string; address: string; code: number }) => {
    try {
      const newItem = await apiSrv.add(body);
      setItems((prev) => [newItem, ...prev]);
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      setErr(e?.message || 'Add failed');
    }
  };

  const handleUpdate = async (body: Warehouse) => {
    try {
      const updated = await apiSrv.update(body.id, {
        name: body.name,
        address: body.address,
        code: body.code,
        isActive: body.isActive,
      });
      setItems((p) => p.map((w) => (w.id === updated.id ? updated : w)));
      setDialog({ open: false, mode: 'add' });
    } catch (e: any) {
      setErr(e?.message || 'Update failed');
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <Container>
      <PageHeader />

      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={() => setDialog({ open: true, mode: 'add' })}
      />

      {isDownSm ? (
        filtered.map((w) => (
          <WarehouseRow
            key={w.id}
            warehouse={{
              ...w,
              status: w.isActive ? "active" : "inactive"
            }}
            onEdit={() => setDialog({ open: true, mode: 'edit', current: w })} onDelete={function (): void {
              throw new Error('Function not implemented.');
            } }          />
        ))
      ) : (
        <WarehouseTable
            rows={filtered}
            onEdit={(w) => setDialog({ open: true, mode: 'edit', current: w })} onDelete={function (): void {
              throw new Error('Function not implemented.');
            } }        />
      )}

      <WarehouseForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={async (data) => {
          if (dialog.mode === 'add') {
            // data is FormValues
            await handleAdd(data as { name: string; address: string; code: number });
          } else {
            // data is Warehouse
            await handleUpdate(data as Warehouse);
          }
        }}
      />

      <Snackbar open={!!error} onClose={() => setErr('')} autoHideDuration={4000}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {loading && <p>Loading…</p>}
    </Container>
  );
};

export default WarehousesPage;
