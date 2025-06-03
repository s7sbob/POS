import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  IconDeviceFloppy, 
  IconPlus, 
  IconArrowLeft,
  IconHome
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  mode: 'add' | 'edit';
  isSubmitting: boolean;
  onBack: () => void;
  onSave: () => void;
  onSaveAndNew: () => void;
}

const FormHeader: React.FC<Props> = ({
  mode, isSubmitting, onBack, onSave, onSaveAndNew
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'background.paper',
        zIndex: 100,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 1,
        mb: 1
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 0.5, fontSize: '0.75rem' }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="/purchases/purchase-orders"
          onClick={(e) => {
            e.preventDefault();
            navigate('/purchases/purchase-orders');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <IconHome size={12} style={{ marginRight: 2 }} />
          {t('purchaseOrders.list')}
        </Link>
        <Typography color="text.primary" fontSize="0.75rem">
          {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
        </Typography>
      </Breadcrumbs>

      {/* Header مع الأزرار */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
          {mode === 'add' ? t('purchaseOrders.add') : t('purchaseOrders.edit')}
        </Typography>
        
        {/* أزرار الحفظ والإلغاء */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconArrowLeft size={14} />}
            onClick={onBack}
            disabled={isSubmitting}
          >
            {t('common.back')}
          </Button>
          
          <Button 
            variant="outlined"
            size="small"
            startIcon={<IconDeviceFloppy size={14} />}
            onClick={onSave}
            disabled={isSubmitting}
          >
            {t('common.save')}
          </Button>
          
          <Button 
            variant="contained"
            size="small"
            startIcon={<IconPlus size={14} />}
            onClick={onSaveAndNew}
            disabled={isSubmitting}
          >
            {t('purchaseOrders.saveAndNew')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default FormHeader;
