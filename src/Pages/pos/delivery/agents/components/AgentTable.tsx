// File: src/pages/delivery/agents/components/AgentTable.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Typography, Box, Tooltip
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';

interface Props {
  rows: DeliveryAgent[];
  onEdit: (agent: DeliveryAgent) => void;
  onDelete: (agent: DeliveryAgent) => void;
  selectedAgentId?: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

const AgentTable: React.FC<Props> = ({ 
  rows, onEdit, onDelete, selectedAgentId, canEdit = true, canDelete = true 
}) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('deliveryAgents.form.name')}</TableCell>
            <TableCell>{t('deliveryAgents.form.phone')}</TableCell>
            <TableCell>{t('deliveryAgents.form.branch')}</TableCell>
            <TableCell>{t('deliveryAgents.form.status')}</TableCell>
            <TableCell width={120}>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((agent) => (
            <TableRow
              key={agent.id}
              selected={selectedAgentId === agent.id}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                ...(selectedAgentId === agent.id && {
                  backgroundColor: 'action.selected',
                }),
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {agent.name}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" fontFamily="monospace">
                  {agent.phone}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {agent.branchName || t('common.notSpecified')}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={agent.isActive ? t('common.active') : t('common.inactive')}
                  color={agent.isActive ? 'success' : 'error'}
                  size="small"
                  variant={agent.isActive ? 'filled' : 'outlined'}
                />
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {canEdit && (
                    <Tooltip title={t('common.edit')}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(agent)}
                        color="primary"
                      >
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {canDelete && (
                    <Tooltip title={t('common.delete')}>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(agent)}
                        color="error"
                      >
                        <IconTrash size={18} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AgentTable;
