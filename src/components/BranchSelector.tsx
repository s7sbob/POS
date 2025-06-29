// File: src/components/BranchSelector.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IconBuilding, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/contexts/AuthContext';
import { Branch } from 'src/utils/api/authApi';

interface Props {
  compact?: boolean;
}

const BranchSelector: React.FC<Props> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { selectedBranch, branches, selectBranch } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (branches.length > 1) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBranchSelect = async (branch: Branch) => {
    try {
      await selectBranch(branch);
      handleClose();
    } catch (error) {
      }
  };

  if (!selectedBranch) return null;

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{
          color: 'inherit',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: compact ? 1 : 2,
          py: 0.5,
          minWidth: compact ? 'auto' : 200,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          },
          borderRadius: 1
        }}
        disabled={branches.length <= 1}
      >
        <IconBuilding size={18} />
        {!compact && (
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                lineHeight: 1.2
              }}
              noWrap
            >
              {selectedBranch.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                lineHeight: 1
              }}
              noWrap
            >
              {selectedBranch.company.name}
            </Typography>
          </Box>
        )}
        {branches.length > 1 && <IconChevronDown size={14} />}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 280 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {t('branch.selectBranch')}
          </Typography>
        </Box>
        <Divider />
        
        {branches.map((branch) => (
          <MenuItem
            key={branch.id}
            onClick={() => handleBranchSelect(branch)}
            selected={branch.id === selectedBranch?.id}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              {branch.id === selectedBranch?.id ? (
                <IconCheck size={20} color="primary" />
              ) : (
                <IconBuilding size={20} />
              )}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {branch.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {branch.company.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default BranchSelector;
