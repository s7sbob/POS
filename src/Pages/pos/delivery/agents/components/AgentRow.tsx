// File: src/pages/delivery/agents/components/AgentRow.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton,
  Stack, Divider, Tooltip
} from '@mui/material';
import { IconEdit, IconTrash, IconPhone } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DeliveryAgent } from 'src/utils/api/pagesApi/deliveryAgentsApi';

interface Props {
  agent: DeliveryAgent;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

const AgentRow: React.FC<Props> = ({ 
  agent, onEdit, onDelete, isSelected = false, canEdit = true, canDelete = true 
}) => {
  const { t } = useTranslation();

  const handlePhoneCall = () => {
    window.open(`tel:${agent.phone}`, '_self');
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        ...(isSelected && {
          borderColor: 'primary.main',
          backgroundColor: 'action.selected'
        })
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
              {agent.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {agent.branchName || t('common.notSpecified')}
            </Typography>
          </Box>
          
          <Chip
            label={agent.isActive ? t('common.active') : t('common.inactive')}
            color={agent.isActive ? 'success' : 'error'}
            size="small"
            variant={agent.isActive ? 'filled' : 'outlined'}
          />
        </Box>

        {/* Agent Info */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('deliveryAgents.form.phone')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                {agent.phone}
              </Typography>
              <IconButton
                size="small"
                onClick={handlePhoneCall}
                color="primary"
                sx={{ p: 0.5 }}
              >
                <IconPhone size={16} />
              </IconButton>
            </Box>
          </Box>
        </Stack>

        {/* Actions */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {canEdit && (
            <Tooltip title={t('common.edit')}>
              <IconButton
                size="small"
                onClick={onEdit}
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
                onClick={onDelete}
                color="error"
              >
                <IconTrash size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AgentRow;
