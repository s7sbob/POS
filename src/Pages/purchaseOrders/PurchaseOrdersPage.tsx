import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import PurchaseOrderTable from './components/PurchaseOrderTable';
import PurchaseOrderRow from './components/PurchaseOrderRow';
import * as apiSrv from 'src/utils/api/purchaseOrdersApi';
import { PurchaseOrder } from 'src/utils/api/purchaseOrdersApi';
import { t } from 'i18next';

const PurchaseOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrder[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  /* ───── fetch all ───── */
  const fetchPurchaseOrders = async () => {
    try {
      const purchaseOrdersData = await apiSrv.getAll();
      setPurchaseOrders(purchaseOrdersData);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load purchase orders');
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchPurchaseOrders();
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
    () => query ? purchaseOrders.filter(po => 
      po.referenceDocNumber.toLowerCase().includes(query.toLowerCase()) ||
      po.supplier?.name.toLowerCase().includes(query.toLowerCase()) ||
      po.warehouse?.name.toLowerCase().includes(query.toLowerCase())
    ) : purchaseOrders,
    [purchaseOrders, query]
  );

  /* ───── Navigation handlers ───── */
  const handleAdd = () => {
    navigate('/purchases/purchase-orders/add');
  };

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    navigate(`/purchases/purchase-orders/edit/${purchaseOrder.id}`);
  };

  /* ───── UI ───── */
  return (
    <Container maxWidth="xl">
      <PageHeader />
      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={handleAdd}
      />

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('purchaseOrders.title')} {` (${filtered.length})`}
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>جاري التحميل...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {query ? 'لا توجد نتائج للبحث' : 'لا توجد أوامر شراء'}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? filtered.map(po => (
                  <PurchaseOrderRow
                    key={po.id}
                    purchaseOrder={po}
                    onEdit={() => handleEdit(po)}
                  />
                ))
              : (
                  <PurchaseOrderTable
                    rows={filtered}
                    onEdit={handleEdit}
                  />
                )}
          </>
        )}
      </Box>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setErr('')}>
        <Alert severity="error" onClose={() => setErr('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PurchaseOrdersPage;
