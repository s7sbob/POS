// File: src/layouts/full/vertical/sidebar/NavCollapse/NavCollapse.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { useState } from 'react';
import { useSelector } from 'src/store/Store';
import { useLocation } from 'react-router';
import {
  ListItemIcon,
  ListItemButton,
  Collapse,
  styled,
  ListItemText,
  useTheme,
  Box,
} from '@mui/material';
import NavItem from '../NavItem';
import { IconChevronDown, IconChevronUp, IconDots } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AppState } from 'src/store/Store';

type NavGroupProps = {
  [x: string]: any;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
};

interface NavCollapseProps {
  menu: NavGroupProps;
  level: number;
  pathWithoutLastPart: any;
  pathDirect: any;
  hideMenu: any;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const NavCollapse = ({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick
}: NavCollapseProps) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const Icon = menu?.icon;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  
  const [open, setOpen] = useState(() => {
    return menu?.children?.some((item: any) => {
      if (item.children) {
        return item.children.some((child: any) => pathname.includes(child.href));
      }
      return pathname.includes(item.href);
    }) || false;
  });

  // تحديد الأيقونة حسب المستوى
  const getMenuIcon = () => {
    if (level === 1) {
      // المستوى الأول - الأيقونة العادية
      return <Icon stroke={1.5} size="1.1rem" />;
    } else {
      // تحديد ما إذا كان هذا العنصر له أطفال أم لا
      const hasChildren = menu?.children && menu.children.length > 0;
      const isLastLevel = !hasChildren || !menu.children.some((child: any) => child.children);
      
      if (isLastLevel) {
        // المستوى الأخير - أيقونة عادية
        return <Icon stroke={1.5} size="1rem" />;
      } else {
        // المستوى الأوسط - 3 نقاط
        return <IconDots size="1rem" />;
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  React.useEffect(() => {
    const shouldBeOpen = menu?.children?.some((item: any) => {
      if (item.children) {
        return item.children.some((child: any) => pathname === child.href);
      }
      return pathname === item.href;
    });

    if (shouldBeOpen && !open) {
      setOpen(true);
    }
  }, [pathname, menu.children, open]);

  const ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: '1px',
    padding: '4px 8px',
    paddingLeft: hideMenu 
      ? '8px' 
      : level === 1 
        ? '8px'
        : level === 2 
          ? '24px'
          : `${level * 16}px`,
    backgroundColor: open && level < 2 ? theme.palette.primary.main : '',
    whiteSpace: 'nowrap',
    minHeight: '32px',
    '&:hover': {
      backgroundColor: pathname.includes(menu.href) || open
        ? theme.palette.primary.main
        : theme.palette.primary.light,
      color: pathname.includes(menu.href) || open ? 'white' : theme.palette.primary.main,
    },
    color:
      open && level < 2
        ? 'white'
        : level > 1 && open
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
    borderRadius: `${customizer.borderRadius}px`,
    ...(level > 1 && {
      borderLeft: `2px solid ${theme.palette.divider}`,
      marginLeft: '8px',
    }),
  }));

  const submenus = menu.children?.map((item: any) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    }
  });

  return (
    <>
      <ListItemStyled
        onClick={handleClick}
        selected={pathWithoutLastPart === menu.href}
        key={menu?.id}
      >
        <ListItemIcon
          sx={{
            minWidth: level === 1 ? '28px' : '20px',
            p: '2px 0',
            color: 'inherit',
          }}
        >
          {getMenuIcon()}
        </ListItemIcon>
        <ListItemText 
          color="inherit"
          sx={{
            '& .MuiListItemText-primary': {
              fontSize: level === 1 ? '0.875rem' : '0.8rem',
              lineHeight: 1.2,
              fontWeight: level === 1 ? 500 : 400,
            }
          }}
        >
          {hideMenu ? '' : <>{t(`${menu.title}`)}</>}
        </ListItemText>
        
        {level === 1 && (
          <Box sx={{ ml: 1 }}>
            {!open ? 
              <IconChevronDown size="0.9rem" /> : 
              <IconChevronUp size="0.9rem" />
            }
          </Box>
        )}
        
        {level > 1 && (
          <Box sx={{ ml: 1 }}>
            {!open ? 
              <IconChevronDown size="0.7rem" /> : 
              <IconChevronUp size="0.7rem" />
            }
          </Box>
        )}
      </ListItemStyled>
      
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ 
          ...(level > 1 && {
            backgroundColor: theme.palette.action.hover,
            borderRadius: `0 ${customizer.borderRadius}px ${customizer.borderRadius}px 0`,
            margin: '0 4px',
          })
        }}>
          {submenus}
        </Box>
      </Collapse>
    </>
  );
};

export default NavCollapse;
