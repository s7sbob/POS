// File: src/layouts/full/vertical/sidebar/NavGroup/NavGroup.tsx
import React from 'react';
import { ListSubheader, styled, Theme } from '@mui/material';
import { IconDots } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface NavGroupProps {
  item: {
    navlabel?: boolean;
    subheader?: string;
  };
  hideMenu: boolean | string;
}

const ListSubheaderStyle = styled(ListSubheader)(({ theme }: { theme: Theme }) => ({
  ...theme.typography.overline,
  fontWeight: 700,
  marginTop: theme.spacing(1.5), // تقليل من 3 إلى 1.5
  marginBottom: 0,
  color: theme.palette.text.primary,
  lineHeight: '20px', // تقليل من 26px إلى 20px
  padding: '2px 8px', // تقليل من 3px 12px إلى 2px 8px
  fontSize: '0.75rem', // تصغير حجم الخط
}));

const NavGroup: React.FC<NavGroupProps> = ({ item, hideMenu }) => {
  const { t } = useTranslation();

  return (
    <ListSubheaderStyle sx={{ ml: hideMenu ? 0 : '-8px' }} disableSticky>
      {hideMenu ? <IconDots size={12} /> : t(item.subheader ?? '')}
    </ListSubheaderStyle>
  );
};

export default NavGroup;
