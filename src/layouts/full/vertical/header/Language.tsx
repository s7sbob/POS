// File: src/layouts/full/header/Language.tsx
import React, { useCallback } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Typography, Stack } from '@mui/material';
import { useSelector, useDispatch } from 'src/store/Store';
import { setLanguage, setDir } from 'src/store/customizer/CustomizerSlice';
import FlagEn from 'src/assets/images/flag/icon-flag-en.svg';
import FlagEg from 'src/assets/images/flag/icon-flag-eg.svg';
import { useTranslation } from 'react-i18next';
import { AppState } from 'src/store/Store';
import Cookies from 'js-cookie';

const Languages = [
  {
    flagname: 'English (UK)',
    icon: FlagEn,
    value: 'en',
    direction: 'ltr',
  },
  {
    flagname: 'عربي (Egypt)',
    icon: FlagEg,
    value: 'ar',
    direction: 'rtl',
  },
];

const Language = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const customizer = useSelector((state: AppState) => state.customizer);
  const currentLang = Languages.find((_lang) => _lang.value === customizer.isLanguage) || Languages[0];
  const { i18n } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // تحسين دالة تغيير اللغة
  const handleLanguageChange = useCallback((language: string) => {
    const selectedLang = Languages.find(l => l.value === language);
    if (selectedLang && customizer.isLanguage !== language) {
      // تطبيق التغييرات بشكل متزامن
      requestAnimationFrame(() => {
        dispatch(setLanguage(language));
        dispatch(setDir(selectedLang.direction));
        i18n.changeLanguage(language);
        
        document.documentElement.dir = selectedLang.direction;
        document.documentElement.lang = language;
        
        // تحديث body class
        document.body.classList.remove('rtl', 'ltr');
        document.body.classList.add(selectedLang.direction);
        
        // حفظ في الكوكيز
        Cookies.set('language', language, { expires: 365 });
        Cookies.set('direction', selectedLang.direction, { expires: 365 });
      });
    }
    
    handleClose();
  }, [dispatch, i18n, customizer.isLanguage]);

  return (
    <>
      <IconButton
        aria-label="language"
        onClick={handleClick}
        className="no-flip" // منع انقلاب الأيقونة
      >
        <Avatar src={currentLang.icon} alt={currentLang.value} sx={{ width: 20, height: 20 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        {Languages.map((option, index) => (
          <MenuItem
            key={index}
            sx={{ py: 2, px: 3 }}
            onClick={() => handleLanguageChange(option.value)}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar 
                src={option.icon} 
                alt={option.icon} 
                sx={{ width: 20, height: 20 }} 
                className="no-flip"
              />
              <Typography>{option.flagname}</Typography>
              <Typography variant="caption" color="text.secondary">
                ({option.direction.toUpperCase()})
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Language;
