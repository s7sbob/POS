/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import React, { useState } from 'react';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import * as dropdownData from './data';                // ↩︎ احتفِظ بملف data كما هو
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import unlimitedImg from 'src/assets/images/backgrounds/unlimited-bg.png';
import { clearAuth } from 'src/utils/auth';

const ProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  /* ------ تسجيل الخروج ------ */
  const handleLogout = () => {
    clearAuth();
    handleClose();
    navigate('/auth/login', { replace: true });
  };

  return (
    <Box>
      <IconButton
        size="large"
        color={open ? 'primary' : 'inherit'}
        onClick={handleOpen}
      >
        <Avatar src={ProfileImg} sx={{ width: 35, height: 35 }} />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{ '& .MuiMenu-paper': { width: 360, p: 4 } }}
      >
        {/* ---- Header ---- */}
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={ProfileImg} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography fontWeight={600}>Mathew Anderson</Typography>
            <Typography color="text.secondary">Designer</Typography>
            <Typography
              color="text.secondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} /> info@modernize.com
            </Typography>
          </Box>
        </Stack>
        <Divider />

        {/* ---- Links from data.ts ---- */}
        {dropdownData.profile.map((item) => (
          <Box key={item.title} py={2}>
            <RouterLink to={item.href} onClick={handleClose}>
              <Stack direction="row" spacing={2}>
                <Box
                  width={45}
                  height={45}
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar src={item.icon} sx={{ width: 24, height: 24, borderRadius: 0 }} />
                </Box>
                <Box>
                  <Typography fontWeight={600} noWrap width={240}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" noWrap width={240}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </RouterLink>
          </Box>
        ))}

        {/* ---- Upgrade Box ---- */}
        <Box mt={2}>
          <Box bgcolor="primary.light" p={3} mb={3} position="relative" overflow="hidden">
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" mb={2}>
                  Unlimited <br /> Access
                </Typography>
                <Button variant="contained">Upgrade</Button>
              </Box>
              <img src={unlimitedImg} alt="" className="signup-bg" />
            </Box>
          </Box>

          {/* ---- Logout ---- */}
          <Button variant="outlined" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
