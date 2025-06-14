// File: src/layouts/full/vertical/sidebar/NavItem/NavItem.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { NavLink } from 'react-router';
import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Typography,
  ListItemButton,
} from '@mui/material';
import { useSelector } from 'src/store/Store';
import { useTranslation } from 'react-i18next';
import { AppState } from 'src/store/Store';
import { IconPoint } from '@tabler/icons-react';

type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: NavGroup[];
  chip?: string;
  chipColor?: any;
  variant?: string | any;
  external?: boolean;
  level?: number;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  hideMenu?: any;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  level?: number | any;
  pathDirect: string;
}

const NavItem = ({ item, level, pathDirect, hideMenu, onClick }: ItemType) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const Icon = item?.icon;
  const theme = useTheme();
  const { t } = useTranslation();
  
  // تحديد الأيقونة حسب المستوى
  const getItemIcon = () => {
    if (level === 1) {
      // المستوى الأول - الأيقونة العادية
      return level > 1 ? <Icon stroke={1.5} size="1rem" /> : <Icon stroke={1.5} size="1.1rem" />;
    } else {
      // المستويات الفرعية - نقطة صغيرة
      return <IconPoint size="0.8rem" />;
    }
  };

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '1px',
    padding: '4px 8px',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && pathDirect === item?.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    // تحديد المسافة حسب المستوى
    paddingLeft: hideMenu 
      ? '8px' 
      : level === 1 
        ? '8px'  // المستوى الأول
        : level === 2 
          ? '24px' // المستوى الثاني
          : level === 3
            ? '40px' // المستوى الثالث
            : `${level * 16}px`, // المستويات الأعلى
    minHeight: level === 1 ? '32px' : '28px', // ارتفاع أصغر للمستويات الفرعية
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
    // إضافة border للمستويات الفرعية
    ...(level > 1 && {
      borderLeft: `2px solid ${theme.palette.divider}`,
      marginLeft: '8px',
    }),
  }));

  const listItemProps: {
    component: any;
    href?: string;
    target?: any;
    to?: any;
  } = {
    component: item?.external ? 'a' : NavLink,
    to: item?.href,
    href: item?.external ? item?.href : '',
    target: item?.external ? '_blank' : '',
  };

  return (
    <List component="li" disablePadding key={item?.id && item.title}>
      <ListItemStyled
        {...listItemProps}
        disabled={item?.disabled}
        selected={pathDirect === item?.href}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: level === 1 ? '28px' : '20px', // تصغير للمستويات الفرعية
            p: '2px 0',
            color:
              level > 1 && pathDirect === item?.href
                ? `${theme.palette.primary.main}!important`
                : 'inherit',
          }}
        >
          {getItemIcon()}
        </ListItemIcon>
        <ListItemText
          sx={{
            '& .MuiListItemText-primary': {
              fontSize: level === 1 ? '0.875rem' : '0.8rem', // تصغير الخط للمستويات الفرعية
              lineHeight: 1.2,
              fontWeight: level === 1 ? 500 : 400, // تقليل وزن الخط للمستويات الفرعية
            }
          }}
        >
          {hideMenu ? '' : <>{t(`${item?.title}`)}</>}
          <br />
          {item?.subtitle ? (
            <Typography variant="caption" sx={{ lineHeight: 1.1 }}>
              {hideMenu ? '' : item?.subtitle}
            </Typography>
          ) : (
            ''
          )}
        </ListItemText>

        {!item?.chip || hideMenu ? null : (
          <Chip
            color={item?.chipColor}
            variant={item?.variant ? item?.variant : 'filled'}
            size="small"
            label={item?.chip}
            sx={{ height: '18px', fontSize: '0.7rem' }} // تصغير أكثر للمستويات الفرعية
          />
        )}
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
