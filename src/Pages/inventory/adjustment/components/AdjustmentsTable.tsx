// File: src/pages/inventory/adjustments-list/components/AdjustmentsTable.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AdjustmentListItem } from 'src/utils/api/pagesApi/inventoryAdjustmentApi';

interface Props {
  adjustments: AdjustmentListItem[];
  loading: boolean;
}

const AdjustmentsTable: React.FC<Props> = ({ adjustments, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const getAdjustmentTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return t('adjustments.types.new');
      case 1:
        return t('adjustments.types.openingBalance');
      case 2:
        return t('adjustments.types.manualAdjustment');
      default:
        return t('adjustments.types.unknown');
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: t('adjustments.status.saved'), color: 'warning' as const };
      case 3:
        return { label: t('adjustments.status.submitted'), color: 'success' as const };
      default:
        return { label: t('adjustments.status.unknown'), color: 'default' as const };
    }
  };

  const handleViewAdjustment = (adjustmentId: string) => {
    navigate(`/inventory/inventory-adjustments/${adjustmentId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') {
      return '-';
    }
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalItems = (details: any[]) => {
    return details.length;
  };

  const getTotalDifference = (details: any[]) => {
    return details.reduce((sum, detail) => sum + Math.abs(detail.diffQty), 0);
  };

  const columns: GridColDef[] = [
    {
      field: 'warehouseName',
      headerName: t('adjustments.table.warehouse'),
      width: isTablet ? 150 : 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: 1.2
          }}>
            {params.value}
          </Typography>

        </Box>
      ),
    },
    {
      field: 'adjustmentType',
      headerName: t('adjustments.table.type'),
      width: isTablet ? 120 : 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {getAdjustmentTypeLabel(params.value)}
        </Typography>
      ),
    },
    {
      field: 'adjustmentDate',
      headerName: t('adjustments.table.date'),
      width: isTablet ? 100 : 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    ...(isTablet ? [] : [
      {
        field: 'referenceNumber',
        headerName: t('adjustments.table.referenceNumber'),
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2">
            {params.value || '-'}
          </Typography>
        ),
      },
      {
        field: 'reason',
        headerName: t('adjustments.table.reason'),
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <Typography variant="body2">
            {params.value || '-'}
          </Typography>
        ),
      }
    ]),
    {
      field: 'details',
      headerName: t('adjustments.table.totalItems'),
      width: isTablet ? 80 : 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {getTotalItems(params.value)}
        </Typography>
      ),
    },
    {
      field: 'totalDifference',
      headerName: t('adjustments.table.totalDifference'),
      width: isTablet ? 100 : 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}>
          {getTotalDifference(params.row.details).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: t('adjustments.table.status'),
      width: isTablet ? 100 : 120,
      renderCell: (params: GridRenderCellParams) => {
        const statusInfo = getStatusLabel(params.value);
        return (
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: isTablet ? 80 : 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={t('adjustments.actions.view')}>
          <IconButton
            size="small"
            onClick={() => handleViewAdjustment(params.row.adjustmentId)}
            color="primary"
          >
            <IconEye size={isTablet ? 16 : 18} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Paper sx={{ 
      height: { xs: 400, sm: 500, md: 600 }, 
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
        rows={adjustments}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.adjustmentId}
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
          noRowsLabel: t('adjustments.list.noAdjustments'),
          toolbarDensity: t('common.density'),
          toolbarDensityLabel: t('common.density'),
          toolbarDensityCompact: t('common.compact'),
          toolbarDensityStandard: t('common.standard'),
          toolbarDensityComfortable: t('common.comfortable'),
          toolbarExport: t('common.export'),
          toolbarExportLabel: t('common.export'),
          toolbarExportCSV: t('common.exportCSV'),
          toolbarExportPrint: t('common.print'),
          toolbarColumns: t('common.columns'),
          toolbarColumnsLabel: t('common.columns'),
          toolbarFilters: t('common.filters'),
          toolbarFiltersLabel: t('common.filters'),
          toolbarFiltersTooltipHide: t('common.hideFilters'),
          toolbarFiltersTooltipShow: t('common.showFilters'),
          filterPanelAddFilter: t('common.addFilter'),
          filterPanelDeleteIconLabel: t('common.delete'),
          filterPanelOperatorAnd: t('common.and'),
          filterPanelOperatorOr: t('common.or'),
          filterPanelColumns: t('common.columns'),
          filterPanelInputLabel: t('common.value'),
          filterPanelInputPlaceholder: t('common.filterValue'),
          filterOperatorContains: t('common.contains'),
          filterOperatorEquals: t('common.equals'),
          filterOperatorStartsWith: t('common.startsWith'),
          filterOperatorEndsWith: t('common.endsWith'),
          filterOperatorIs: t('common.is'),
          filterOperatorNot: t('common.isNot'),
          filterOperatorAfter: t('common.isAfter'),
          filterOperatorOnOrAfter: t('common.isOnOrAfter'),
          filterOperatorBefore: t('common.isBefore'),
          filterOperatorOnOrBefore: t('common.isOnOrBefore'),
          filterOperatorIsEmpty: t('common.isEmpty'),
          filterOperatorIsNotEmpty: t('common.isNotEmpty'),
          columnMenuLabel: t('common.menu'),
          columnMenuShowColumns: t('common.showColumns'),
          columnMenuFilter: t('common.filter'),
          columnMenuHideColumn: t('common.hide'),
          columnMenuUnsort: t('common.unsort'),
          columnMenuSortAsc: t('common.sortAsc'),
          columnMenuSortDesc: t('common.sortDesc'),
          columnHeaderFiltersTooltipActive: (count) =>
            count !== 1 ? `${count} ${t('common.activeFilters')}` : `${count} ${t('common.activeFilter')}`,
          columnHeaderFiltersLabel: t('common.showFilters'),
          columnHeaderSortIconLabel: t('common.sort'),
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} ${t('common.rowsSelected')}`
              : `${count.toLocaleString()} ${t('common.rowSelected')}`,
          footerTotalRows: t('common.totalRows'),
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} ${t('common.of')} ${totalCount.toLocaleString()}`,
          checkboxSelectionHeaderName: t('common.checkboxSelection'),
          booleanCellTrueLabel: t('common.yes'),
          booleanCellFalseLabel: t('common.no'),
        }}
      />
    </Paper>
  );
};

export default AdjustmentsTable;
