// File: src/layouts/full/vertical/header/Profile.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { 
  IconListCheck, 
  IconMail, 
  IconUser, 
  IconSettings, 
  IconLogout, 
  IconBuilding 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/contexts/AuthContext';

const Profile = () => {
  const { t } = useTranslation();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, logout, selectedBranch } = useAuth();
  const navigate = useNavigate();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    handleClose2();
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '280px',
            p: 2,
          },
        }}
      >
        {/* User Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">
            {user?.userName || t('profile.user') || 'User'}
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
            fontSize="12px"
            fontWeight="400"
          >
            {user?.phoneNo || ''}
          </Typography>
          
          {/* ⭐ Optional Chaining للفرع والشركة */}
          {selectedBranch && (
            <Typography
              color="textSecondary"
              variant="caption"
              fontSize="11px"
              fontWeight="400"
              display="block"
              sx={{ mt: 0.5 }}
            >
              {selectedBranch.name}
              {selectedBranch.company?.name && ` - ${selectedBranch.company.name}`}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem component={Link} to="/users" onClick={handleClose2}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('profile.menu.userManagement') || 'User Management'}
          </ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/company" onClick={handleClose2}>
          <ListItemIcon>
            <IconBuilding width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('profile.menu.companySettings') || 'Company Settings'}
          </ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/permissions" onClick={handleClose2}>
          <ListItemIcon>
            <IconSettings width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('profile.menu.permissions') || 'Permissions'}
          </ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('profile.menu.inbox') || 'Inbox'}
          </ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('profile.menu.taskList') || 'Task List'}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IconLogout width={20} />
          </ListItemIcon>
          <ListItemText>
            {t('auth.logout') || 'Logout'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
