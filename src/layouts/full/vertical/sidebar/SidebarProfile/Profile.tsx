import React from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { IconPower } from '@tabler/icons-react';
import { useSelector } from 'src/store/Store';
import { AppState } from 'src/store/Store';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { clearAuth } from 'src/utils/auth';
import { useNavigate, useParams } from 'react-router-dom';

export const Profile: React.FC = () => {
  /* --------- collapse logic --------- */
  const { isCollapse, isSidebarHover } = useSelector(
    (s: AppState) => s.customizer
  );
  const lgUp = useMediaQuery((t: any) => t.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse && !isSidebarHover : false;

  const navigate = useNavigate();
  // Grab tenantId so we can redirect to the correct tenant login on logout
  const { tenantId } = useParams<{ tenantId: string }>();
  const logout = () => {
    clearAuth();
    if (tenantId) {
      navigate(`/${tenantId}/auth/login`, { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  };

  if (hideMenu) return null;

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ m: 3, p: 2, bgcolor: 'secondary.light' }}>
      <Avatar src={img1} alt="user" />
      <Box>
        <Typography variant="h6">Mathew</Typography>
        <Typography variant="caption">Designer</Typography>
      </Box>
      <Box sx={{ ml: 'auto' }}>
        <Tooltip title="Logout">
          <IconButton color="primary" onClick={logout} size="small">
            <IconPower size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Profile;
