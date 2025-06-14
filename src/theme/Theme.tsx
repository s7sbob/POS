// File: src/theme/Theme.ts
import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'src/store/Store';
import { useEffect, useMemo } from 'react';
import { AppState } from '../store/Store';
import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import { baseDarkTheme, baselightTheme } from './DefaultColors';
import * as locales from '@mui/material/locale';

// Cache للثيمات لتجنب إعادة الإنشاء
const themeCache = new Map();

export const BuildTheme = (config: any = {}) => {
  // إنشاء مفتاح للكاش
  const cacheKey = `${config.theme}-${config.direction}-${config.mode}`;
  
  // التحقق من وجود الثيم في الكاش
  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey);
  }

  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const defaultTheme = config.mode === 'dark' ? baseDarkTheme : baselightTheme;
  const defaultShadow = config.mode === 'dark' ? darkshadows : shadows;
  const themeSelect = config.mode === 'dark' ? darkthemeOptions : themeOptions;
  
  // تحديد الخط حسب الاتجاه
  const fontFamily = config.direction === 'rtl' 
    ? '"Cairo"'
    : '"Cairo"';

  // Typography محسن للـ RTL
  const enhancedTypography = {
    ...typography,
    fontFamily: fontFamily,
    h1: { 
      ...typography.h1, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 700 : 500,
    },
    h2: { 
      ...typography.h2, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 600 : 500,
    },
    h3: { 
      ...typography.h3, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 600 : 500,
    },
    h4: { 
      ...typography.h4, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 600 : 500,
    },
    h5: { 
      ...typography.h5, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 600 : 500,
    },
    h6: { 
      ...typography.h6, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 600 : 500,
    },
    body1: { 
      ...typography.body1, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 400 : 400,
    },
    body2: { 
      ...typography.body2, 
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 400 : 400,
    },
    button: {
      ...typography.button,
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 500 : 500,
    },
    caption: {
      ...typography.caption,
      fontFamily: fontFamily,
    },
    overline: {
      ...typography.overline,
      fontFamily: fontFamily,
    },
    subtitle1: {
      ...typography.subtitle1,
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 500 : 500,
    },
    subtitle2: {
      ...typography.subtitle2,
      fontFamily: fontFamily,
      fontWeight: config.direction === 'rtl' ? 500 : 500,
    },
  };

  const baseMode = {
    palette: {
      mode: config.mode,
    },
    shape: {
      borderRadius: config.borderRadius || 8,
    },
    shadows: defaultShadow,
    typography: enhancedTypography,
  };

  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales, themeSelect, {
      direction: config.direction,
    }),
  );

  // مكونات محسنة للـ RTL
  const enhancedComponents = {
    ...components(theme),
    // تحسين الأيقونات للـ RTL

  };

  theme.components = enhancedComponents;

  // حفظ في الكاش
  themeCache.set(cacheKey, theme);

  return theme;
};

const ThemeSettings = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const activDir = customizer.activeDir;
  const activeTheme = customizer.activeTheme;
  const activeMode = customizer.activeMode;
  const borderRadius = customizer.borderRadius;

  // استخدام useMemo لتحسين الأداء
  const theme = useMemo(() => {
    return BuildTheme({
      direction: activDir,
      theme: activeTheme,
      mode: activeMode,
      borderRadius: borderRadius,
    });
  }, [activDir, activeTheme, activeMode, borderRadius]);

  // تحسين useEffect
  useEffect(() => {
    // استخدام requestAnimationFrame لتحسين الأداء
    requestAnimationFrame(() => {
      document.dir = activDir;
      document.documentElement.dir = activDir;
      
      // تحديث body class
      document.body.classList.remove('rtl', 'ltr');
      document.body.classList.add(activDir);
      
      // تطبيق الخط المناسب على body
      if (activDir === 'rtl') {
        document.body.style.fontFamily = '"Cairo"';
      } else {
        document.body.style.fontFamily = '"Cairo"';
      }
    });
  }, [activDir]);

  return theme;
};

// دالة لتنظيف الكاش عند الحاجة
export const clearThemeCache = () => {
  themeCache.clear();
};

export { ThemeSettings };
