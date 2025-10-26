import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton, Stack, Chip } from '@mui/material';
import { IconEdit } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Employee } from 'src/utils/api/pagesApi/employeesApi';

interface Props {
  rows: Employee[];
  onEdit: (e: Employee) => void;
}

const EmployeeTable: React.FC<Props> = ({ rows, onEdit }) => {
  const { t } = useTranslation();

  const cols: GridColDef[] = [
    { field: 'code', headerName: t('hr.employees.code'), width: 120 },
    { field: 'name', headerName: t('hr.employees.name'), flex: 1, minWidth: 200 },
    { 
      field: 'workingHours', 
      headerName: t('hr.employees.workingHours'), 
      width: 150,
      renderCell: ({ value }) => `${value} ${t('hr.employees.hours')}`
    },
    { 
      field: 'hourSalary', 
      headerName: t('hr.employees.hourSalary'), 
      width: 150,
      renderCell: ({ value }) => `${value} ${t('hr.employees.currency')}`
    },
    {
      field: 'createdOn',
      headerName: t('hr.employees.created'),
      flex: 0.8,
      renderCell: ({ value }) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        } catch (error) {
          return '-';
        }
      },
    },
    { 
      field: 'isActive', 
      headerName: t('hr.employees.status'), 
      width: 110,
      renderCell: (p) => (
        <Chip
          label={p.value ? t('hr.employees.active') : t('hr.employees.inactive')}
          color={p.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions', 
      headerName: '', 
      width: 110, 
      sortable: false, 
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
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
      getRowId={(row) => row.id}
      autoHeight
      disableRowSelectionOnClick
      sx={{ mb: 2 }}
    />
  );
};

export default EmployeeTable;

