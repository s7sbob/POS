// File: src/pages/inventory/adjustment-view/components/AdjustmentViewTable.tsx
import React from 'react';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

interface Props {
  details: any[];
}

const AdjustmentViewTable: React.FC<Props> = ({ details }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: t('adjustment.form.product'),
      width: isTablet ? 150 : 200,
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ 
          fontWeight: 'bold',
          fontSize: isTablet ? '0.75rem' : '0.875rem'
        }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'unitName',
      headerName: t('adjustment.form.unit'),
      width: isTablet ? 80 : 120,
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
          {params.value}
        </span>
      ),
    },
    ...(isTablet ? [] : [
      {
        field: 'barcode',
        headerName: t('adjustment.form.barcode'),
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <span style={{ color: '#666' }}>{params.value || '-'}</span>
        ),
      }
    ]),
    {
      field: 'unitFactor',
      headerName: t('adjustment.form.unitFactor'),
      width: isTablet ? 80 : 120,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'oldQuantity',
      headerName: t('adjustment.form.oldQuantity'),
      width: isTablet ? 100 : 130,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ fontSize: isTablet ? '0.75rem' : '0.875rem' }}>
          {params.value?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      field: 'newQuantity',
      headerName: t('adjustment.form.newQuantity'),
      width: isTablet ? 100 : 130,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <span style={{ 
          fontWeight: 'bold',
          fontSize: isTablet ? '0.75rem' : '0.875rem'
        }}>
          {params.value?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      field: 'diffQty',
      headerName: t('adjustment.form.difference'),
      width: isTablet ? 100 : 130,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value || 0;
        const color = value > 0 ? '#2e7d32' : value < 0 ? '#d32f2f' : '#666';
        return (
          <span style={{ 
            fontWeight: 'bold', 
            color,
            fontSize: isTablet ? '0.75rem' : '0.875rem'
          }}>
            {value > 0 ? '+' : ''}{value.toFixed(2)}
          </span>
        );
      },
    },
    ...(isTablet ? [] : [
      {
        field: 'notes',
        headerName: t('adjustment.form.notes'),
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <span>{params.value || '-'}</span>
        ),
      }
    ]),
  ];

  return (
    <Paper sx={{ 
      height: { xs: 400, sm: 500 }, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'grey.50',
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        minHeight: { xs: 40, sm: 48 }
      },
      '& .MuiDataGrid-cell': {
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        padding: { xs: '4px 8px', sm: '8px 16px' }
      },
      '& .MuiDataGrid-row': {
        minHeight: { xs: 40, sm: 52 }
      }
    }}>
      <DataGrid
        rows={details}
        columns={columns}
        getRowId={(row) => row.detailsAdjustmentId}
        pageSizeOptions={isTablet ? [5, 10, 25] : [10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: isTablet ? 5 : 10 },
          },
        }}
        disableRowSelectionOnClick
        density={isTablet ? 'compact' : 'standard'}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'grey.50',
            fontWeight: 'bold',
          },
        }}
        localeText={{
          noRowsLabel: t('adjustment.form.noItems'),
          toolbarDensity: t('common.density'),
          toolbarDensityLabel: t('common.density'),
          toolbarDensityCompact: t('common.compact'),
          toolbarDensityStandard: t('common.standard'),
          toolbarDensityComfortable: t('common.comfortable'),
          footerTotalRows: t('common.totalRows'),
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} ${t('common.of')} ${totalCount.toLocaleString()}`,
        }}
      />
    </Paper>
  );
};

export default AdjustmentViewTable;
