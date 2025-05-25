import React from 'react';
import { ListSubheader, styled, Theme } from '@mui/material';
import { IconDots } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

// -----------------------------------------------------------------------------
// NavGroup component: renders a section header inside the sidebar.
// If the sidebar is collapsed (hideMenu === true) we show a simple Dots icon.
// Otherwise we translate and display the sub‑header label using i18next.
// -----------------------------------------------------------------------------

interface NavGroupProps {
  item: {
    navlabel?: boolean;
    subheader?: string; // i18n key, e.g. 'sidebar.inventory'
  };
  hideMenu: boolean | string; // string when mui-breakpoint class, but treated as boolean
}

// Styled once (outside component) so it doesn’t recreate on every render
const ListSubheaderStyle = styled(ListSubheader)(({ theme }: { theme: Theme }) => ({
  ...theme.typography.overline,
  fontWeight: 700,
  marginTop: theme.spacing(3),
  marginBottom: 0,
  color: theme.palette.text.primary,
  lineHeight: '26px',
  padding: '3px 12px',
}));

const NavGroup: React.FC<NavGroupProps> = ({ item, hideMenu }) => {
  const { t } = useTranslation();

  return (
    <ListSubheaderStyle sx={{ ml: hideMenu ? 0 : '-10px' }} disableSticky>
      {hideMenu ? <IconDots size={14} /> : t(item.subheader ?? '')}
    </ListSubheaderStyle>
  );
};

export default NavGroup;
