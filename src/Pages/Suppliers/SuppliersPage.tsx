import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box} from '@mui/material';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import SupplierTable from './components/SupplierTable';
import SupplierRow from './components/SupplierRow';
import SupplierForm from './components/SupplierForm';
import * as apiSrv from 'src/utils/suppliersApi';
import { Supplier } from 'src/utils/suppliersApi';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: Supplier;
  }>({ open: false, mode: 'add', current: undefined });

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ───── fetch all ───── */
  const fetchSuppliers = async () => {
    try {
      const suppliersData = await apiSrv.getAll();
      setSuppliers(suppliersData);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load suppliers');
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchSuppliers();
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
  const filtered = React.useMemo(
    () => query ? suppliers.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.phone.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase())
    ) : suppliers,
    [suppliers, query]
  );

  /* ───── CRUD ───── */
  const handleAdd = async (data: any) => {
    try {
      console.log('Adding supplier:', data);
      await apiSrv.add(data);
      await fetchSuppliers();
    } catch (e: any) {
      const msg = e?.errors?.SupplierName?.[0] || e?.message || 'Add failed';
      setErr(msg);
      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      console.log('Updating supplier:', data);
      await apiSrv.update(data);
      await fetchSuppliers();
    } catch (e: any) {
      console.error('Update error:', e);
      const msg = e?.errors?.SupplierName?.[0] || e?.message || 'Update failed';
      setErr(msg);
      throw e;
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
        // saveAndNew - إعادة تعيين النموذج للإضافة
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      // في حالة الخطأ، لا نغلق المودال
      throw error;
    }
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="lg">
      <PageHeader />
      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
      />

      <Box mb={4}>
        {isDownSm
          ? filtered.map(s => (
              <SupplierRow
                key={s.id}
                supplier={s}
                onEdit={() => setDialog({ open: true, mode: 'edit', current: s })}
              />
            ))
          : (
              <SupplierTable
                rows={filtered}
                onEdit={(s) => setDialog({ open: true, mode: 'edit', current: s })}
              />
            )}
      </Box>

      {/* ------------ Form Dialog ------------ */}
      <SupplierForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
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

export default SuppliersPage;
