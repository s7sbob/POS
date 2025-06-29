// File: src/pages/pos/table-sections/components/SectionTable.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip, Box, Typography } from '@mui/material';
import { IconEdit, IconTable, IconUsers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { TableSection } from 'src/utils/api/pagesApi/tableSectionsApi';

interface Props {
  rows: TableSection[];
  onEdit: (section: TableSection) => void;
  selectedSectionId?: string;
}

const SectionTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef<TableSection>[] = [
    { 
      field: 'name', 
      headerName: t('tableSections.form.name'), 
      flex: 1, 
      minWidth: 200 
    },
    { 
      field: 'serviceCharge', 
      headerName: t('tableSections.form.serviceCharge'), 
      width: 150,
      renderCell: ({ value }) => (
        <Box sx={{ color: 'primary.main', fontWeight: 600 }}>
          {value?.toFixed(2)} {t('common.currency')}
        </Box>
      )
    },
    { 
      field: 'tables', 
      headerName: t('tableSections.form.tables'), 
      width: 300,
      sortable: false,
      renderCell: ({ value }) => {
        const tables = value || [];
        const totalCapacity = tables.reduce((sum: number, table: any) => sum + table.capacity, 0);
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconTable size={16} />
              <Typography variant="body2" fontWeight={500}>
                {tables.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconUsers size={16} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                {totalCapacity}
              </Typography>
            </Box>
            {tables.length > 0 && (
              <Stack direction="row" spacing={0.5}>
                {tables.slice(0, 2).map((table: any, index: number) => (
                  <Chip
                    key={index}
                    label={`${table.name} (${table.capacity})`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                ))}
                {tables.length > 2 && (
                  <Chip
                    label={`+${tables.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            )}
          </Box>
        );
      }
    },
    { 
      field: 'branchName', 
      headerName: t('tableSections.form.branch'), 
      width: 200,
      renderCell: ({ value }) => value || t('common.notSpecified')
    },
    { 
      field: 'isActive', 
      headerName: t('common.status'), 
      width: 120,
      renderCell: ({ value }) => (
        <Chip 
          label={value ? t('common.active') : t('common.inactive')} 
          color={value ? 'success' : 'error'} 
          size="small"
          variant={value ? 'filled' : 'outlined'}
        />
      )
    },
    {
      field: 'actions', 
      headerName: t('common.actions'), 
      width: 120, 
      sortable: false, 
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <IconEdit size={18} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={cols}
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
      sx={{
        '& .MuiDataGrid-cell:focus': {
          outline: 'none'
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    />
  );
};

export default SectionTable;
