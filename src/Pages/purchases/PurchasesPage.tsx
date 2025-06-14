// File: src/pages/purchases/PurchasesPage.tsx
import React from 'react';
import {
  Container, useMediaQuery,
  Snackbar, Alert, Box, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionsBar from '../purchase-orders/components/ActionsBar';
import PurchaseTable from './components/PurchaseTable';
import PurchaseRow from './components/PurchaseRow';
import * as apiSrv from 'src/utils/api/pagesApi/purchaseApi';
import { Purchase } from 'src/utils/api/pagesApi/purchaseApi';
import PageHeader from './components/PageHeader';

const PurchasesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [query, setQuery] = React.useState('');
  const [error, setErr] = React.useState('');
  const [loading, setLoad] = React.useState(true);

  const isDownSm = useMediaQuery((th: any) => th.breakpoints.down('sm'));

  const fetchPurchases = async () => {
    try {
      const purchasesData = await apiSrv.getAll();
      setPurchases(purchasesData);
    } catch (e: any) {
      setErr(e?.message || t('purchases.errors.loadFailed'));
    }
  };

  React.useEffect(() => {
    (async () => {
      try { 
        await fetchPurchases();
      }
      catch (e: any) { 
        setErr(e?.message || t('purchases.errors.loadFailed')); 
      }
      finally { 
        setLoad(false); 
      }
    })();
  }, [t]);

  const filtered = React.useMemo(
    () => query ? purchases.filter(p => 
      p.referenceDocNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.supplier?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.warehouse?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.purchaseOrder?.referenceDocNumber.toLowerCase().includes(query.toLowerCase())
    ) : purchases,
    [purchases, query]
  );

  const handleAdd = () => {
    navigate('/purchases/purchases/add');
  };

  const handleEdit = (purchase: Purchase) => {
    navigate(`/purchases/purchases/edit/${purchase.id}`);
  };

  const handleView = (purchase: Purchase) => {
    navigate(`/purchases/purchases/view/${purchase.id}`);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader exportData={filtered} loading={loading}/>


      <ActionsBar
        query={query}
        onQueryChange={setQuery}
        onAdd={handleAdd}
        searchPlaceholder={t('purchases.searchPlaceholder')}
        addButtonText={t('purchases.addButton')}
      />

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('purchases.listTitle')} {` (${filtered.length})`}
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {query ? t('common.noSearchResults') : t('purchases.noData')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? filtered.map(p => (
                  <PurchaseRow
                    key={p.id}
                    purchase={p}
                    onEdit={() => handleEdit(p)}
                    onView={() => handleView(p)}
                  />
                ))
              : (
                  <PurchaseTable
                    rows={filtered}
                    onEdit={handleEdit}
                    onView={handleView}
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

export default PurchasesPage;
