// File: src/pages/delivery/agents/DeliveryAgentsPage.tsx
import React from 'react';
import {
  Container, useMediaQuery, useTheme, Box, Button, Fab, Badge, Typography, Stack, TextField, 
  InputAdornment, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { IconSearch, IconX, IconFilter, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageHeader from './components/PageHeader';
import ActionsBar from './components/ActionsBar';
import AgentTable from './components/AgentTable';
import AgentRow from './components/AgentRow';
import AgentForm from './components/AgentForm';
import MobileAgentsFilter, { AgentsFilterState } from './components/mobile/MobileAgentsFilter';
import * as apiSrv from 'src/utils/api/pagesApi/deliveryAgentsApi';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';

interface PermissionProps {
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canView?: boolean;
}

interface Props extends PermissionProps {}

const DeliveryAgentsPage: React.FC<Props> = (props) => {
  const { canAdd = true, canEdit = true, canDelete = true } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [agents, setAgents] = React.useState<DeliveryAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = React.useState<DeliveryAgent | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');  const [loading, setLoad] = React.useState(true);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    mode: 'add' | 'edit';
    current?: DeliveryAgent;
  }>({ open: false, mode: 'add', current: undefined });

  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    agent?: DeliveryAgent;
  }>({ open: false });

  const [mobileFilters, setMobileFilters] = React.useState<AgentsFilterState>({
    searchQuery: '',
    status: '',
    branchFilter: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const fetchAgents = async () => {
    try {
      setLoad(true);
      const data = await apiSrv.getAll();
      setAgents(data);
    } catch (e: any) {
      setErr(e?.message || t('deliveryAgents.errors.loadFailed'));
    } finally {
      setLoad(false);
    }
  };

  React.useEffect(() => {
    fetchAgents();
  }, []);

  const searchAgents = (query: string) => {
    if (!query.trim()) {
      return agents;
    }
    
    const searchLower = query.toLowerCase();
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(searchLower) ||
      agent.phone.toLowerCase().includes(searchLower) ||
      agent.branchName?.toLowerCase().includes(searchLower)
    );
  };

  const mobileFilteredData = React.useMemo(() => {
    let result = [...agents];

    if (mobileFilters.searchQuery.trim()) {
      const searchLower = mobileFilters.searchQuery.toLowerCase();
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(searchLower) ||
        agent.phone.toLowerCase().includes(searchLower) ||
        agent.branchName?.toLowerCase().includes(searchLower)
      );
    }

    if (mobileFilters.status) {
      const isActive = mobileFilters.status === 'true';
      result = result.filter(agent => agent.isActive === isActive);
    }

    if (mobileFilters.branchFilter) {
      result = result.filter(agent => agent.branchId === mobileFilters.branchFilter);
    }

    result.sort((a, b) => {
      let aValue: any = a[mobileFilters.sortBy as keyof typeof a];
      let bValue: any = b[mobileFilters.sortBy as keyof typeof b];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (mobileFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [agents, mobileFilters]);

  const displayedData = isMobile ? mobileFilteredData : searchAgents(searchQuery);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (mobileFilters.searchQuery) count++;
    if (mobileFilters.status) count++;
    if (mobileFilters.branchFilter) count++;
    return count;
  };

  const handleAdd = async (data: any) => {
    try {
      await apiSrv.add(data);
      await fetchAgents();
    } catch (e: any) {      throw e;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const updatedAgent = await apiSrv.update(data);
      setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
      
      if (selectedAgent && selectedAgent.id === data.id) {
        setSelectedAgent(updatedAgent);
      }
      
      return updatedAgent;
    } catch (e: any) {      throw e;
    }
  };

  const handleDelete = async (agent: DeliveryAgent) => {
    try {
      await apiSrv.deleteAgent(agent.id);
      setAgents(prev => prev.filter(a => a.id !== agent.id));
      setDeleteDialog({ open: false });
      
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent(null);
      }
    } catch (e: any) {    }
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
        setDialog({ open: true, mode: 'add', current: undefined });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (agent: DeliveryAgent) => {
    setDialog({ open: true, mode: 'edit', current: agent });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl">
<PageHeader 
  exportData={agents} 
  loading={loading}
  onDataChange={fetchAgents} // ⭐ إضافة callback
/>
      
      {!isMobile && (
        <Box mb={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder={t('deliveryAgents.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <IconX size={16} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
            </Box>

            <ActionsBar
              onAdd={() => setDialog({ open: true, mode: 'add', current: undefined })}
            />
          </Stack>

          {searchQuery && (
            <Box mt={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`${t('deliveryAgents.searchResults')}: ${searchQuery}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('deliveryAgents.resultsCount', { count: displayedData.length })}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {isMobile && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {canAdd && (
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={() => setDialog({ open: true, mode: 'add', current: undefined })}
              fullWidth
              size="large"
              sx={{ minHeight: 48, fontSize: '1rem' }}
            >
              {t('deliveryAgents.add')}
            </Button>
          )}
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          {t('deliveryAgents.title')} ({displayedData.length})
        </Typography>
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography>{t('common.loading')}</Typography>
          </Box>
        ) : displayedData.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {searchQuery || getActiveFiltersCount() > 0 ? t('deliveryAgents.noSearchResults') : t('deliveryAgents.noAgents')}
            </Typography>
          </Box>
        ) : (
          <>
            {isDownSm
              ? displayedData.map(agent => (
                  <AgentRow
                    key={agent.id}
                    agent={agent}
                    onEdit={() => handleEdit(agent)}
                    onDelete={() => setDeleteDialog({ open: true, agent })}
                    isSelected={selectedAgent?.id === agent.id}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))
              : (
                  <AgentTable
                    rows={displayedData}
                    onEdit={handleEdit}
                    onDelete={(agent) => setDeleteDialog({ open: true, agent })}
                    selectedAgentId={selectedAgent?.id}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                )}
          </>
        )}
      </Box>

      {isMobile && (
        <Fab
          color="primary"
          onClick={() => setFilterOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000
          }}
        >
          <Badge badgeContent={getActiveFiltersCount()} color="error">
            <IconFilter />
          </Badge>
        </Fab>
      )}

      {isMobile && (
        <MobileAgentsFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={mobileFilters}
          onFiltersChange={setMobileFilters}
          totalResults={agents.length}
          filteredResults={displayedData.length}
        />
      )}

      <AgentForm
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.current}
        onClose={() => setDialog({ open: false, mode: 'add', current: undefined })}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
        <DialogTitle>{t('deliveryAgents.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deliveryAgents.deleteConfirmMessage', { name: deleteDialog.agent?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false })}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => deleteDialog.agent && handleDelete(deleteDialog.agent)}
            color="error"
            variant="contained"
            startIcon={<IconTrash />}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog></Container>
  );
};

export default DeliveryAgentsPage;

function setErr(_arg0: any) {
  throw new Error('Function not implemented.');
}
