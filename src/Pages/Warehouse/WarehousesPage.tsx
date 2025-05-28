import React from 'react';
import { Container, useMediaQuery } from '@mui/material';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import WarehouseTable from './components/WarehouseTable';
import WarehouseRow from './components/WarehouseRow';
import WarehouseForm from './components/WarehouseForm';
import { warehousesMock } from './mock';
import { Warehouse } from './components/types';

const WarehousesPage: React.FC = () => {
  /* -------------------------------- state -------------------------------- */
  const [items, setItems] = React.useState<Warehouse[]>(warehousesMock);
  const [query, setQuery] = React.useState('');
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Warehouse;
  }>({ open: false, mode: 'add' });

  const isDownSm = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  /* --------------------------- search / filter --------------------------- */
  const filtered = React.useMemo(() => {
    if (!query) return items;
    return items.filter((w) =>
      w.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  /* --------------------------- CRUD handlers ----------------------------- */
  const handleAdd = (data: Omit<Warehouse, 'id' | 'createdOn'>) => {
    setItems((prev) => [
      {
        ...data,
        id: crypto.randomUUID(),
        createdOn: new Date().toISOString()
      },
      ...prev
    ]);
    setDialog({ open: false, mode: 'add' });
  };

  const handleUpdate = (data: Warehouse | any) => {
    // If data is missing id or createdOn, use current dialog values
    const updated: Warehouse = {
      ...(dialog.current as Warehouse),
      ...data,
    };
    setItems((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setDialog({ open: false, mode: 'add' });
  };

  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((w) => w.id !== id));

  /* -------------------------------- render ------------------------------- */
  return (
    <Container>
      <PageHeader />
      <ActionsBar query={query} onQueryChange={setQuery} onAdd={() => setDialog({ open: true, mode: 'add' })} />

      {isDownSm ? (
        filtered.map((w) => (
          <WarehouseRow
            key={w.id}
            warehouse={w}
            onEdit={() => setDialog({ open: true, mode: 'edit', current: w })}
            onDelete={() => handleDelete(w.id)}
          />
        ))
      ) : (
        <WarehouseTable
          rows={filtered}
          onEdit={(w) => setDialog({ open: true, mode: 'edit', current: w })}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {/* dialog */}
      <WarehouseForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add' })}
        onSubmit={dialog.mode === 'add' ? handleAdd : handleUpdate}
      />
    </Container>
  );
};

export default WarehousesPage;
