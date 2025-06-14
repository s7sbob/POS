// File: src/layouts/sidebar/NavListing/NavListing.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import Menudata from '../Menudata';
import { useLocation } from 'react-router';
import { Box, List, Theme, useMediaQuery } from '@mui/material';
import { useSelector } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import NavItem from '../NavItem/NavItem';
import NavCollapse from '../NavCollapse/NavCollapse';
import { AppState } from 'src/store/Store';

const NavListing = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  // دالة لترجمة عناصر القائمة
  const translateMenuItems = (items: any[]): any[] => {
    return items.map(item => ({
      ...item,
      title: t(item.title), // ترجمة العنوان
      children: item.children ? translateMenuItems(item.children) : undefined
    }));
  };

  const translatedMenuData = translateMenuItems(Menudata);

  return (
    <Box>
      <List sx={{ p: 0, display: 'flex', gap: '3px', zIndex: '100' }}>
        {translatedMenuData.map((item) => {
          if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id} 
                onClick={undefined}              
              />
            );
          } else {
            return (
              <NavItem 
                item={item} 
                key={item.id} 
                pathDirect={pathDirect} 
                hideMenu={hideMenu} 
                onClick={function (): void {
                  throw new Error('Function not implemented.');
                }} 
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default NavListing;
