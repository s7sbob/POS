// File: src/theme/Theme.ts
import _ from 'lodash';
import createTheme from '@mui/material/styles/createTheme';
import type { ThemeOptions, Shadows } from '@mui/material/styles';
import { arSD, enUS } from '@mui/material/locale';
import { useSelector } from 'src/store/Store';
import { useEffect, useMemo } from 'react';
import { AppState } from '../store/Store';
import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import { baseDarkTheme, baselightTheme } from './DefaultColors';

// Cache للثيمات لتجنب إعادة الإنشاء
const themeCache = new Map<string, ReturnType<typeof createTheme>>();

export const BuildTheme = (config: any = {}) => {
  const cacheKey = `${config.theme}-${config.direction}-${config.mode}`;
  if (themeCache.has(cacheKey)) {
    return themeCache.get(cacheKey)!;
  }

  const themeOptions = LightThemeColors.find((t) => t.name === config.theme);
  const darkThemeOptions = DarkThemeColors.find((t) => t.name === config.theme);
  const defaultTheme = config.mode === 'dark' ? baseDarkTheme : baselightTheme;
  const defaultShadow = (config.mode === 'dark' ? darkshadows : shadows) as Shadows;
  const themeSelect = config.mode === 'dark' ? darkThemeOptions : themeOptions;

  const fontFamily = '"Cairo"';
  const enhancedTypography = {
    ...typography,
    fontFamily,
    h1: { ...typography.h1, fontFamily, fontWeight: config.direction === 'rtl' ? 700 : 500 },
    h2: { ...typography.h2, fontFamily, fontWeight: config.direction === 'rtl' ? 600 : 500 },
    h3: { ...typography.h3, fontFamily, fontWeight: config.direction === 'rtl' ? 600 : 500 },
    h4: { ...typography.h4, fontFamily, fontWeight: config.direction === 'rtl' ? 600 : 500 },
    h5: { ...typography.h5, fontFamily, fontWeight: config.direction === 'rtl' ? 600 : 500 },
    h6: { ...typography.h6, fontFamily, fontWeight: config.direction === 'rtl' ? 600 : 500 },
    body1: { ...typography.body1, fontFamily, fontWeight: 400 },
    body2: { ...typography.body2, fontFamily, fontWeight: 400 },
    button: { ...typography.button, fontFamily, fontWeight: 500 },
    caption: { ...typography.caption, fontFamily },
    overline: { ...typography.overline, fontFamily },
    subtitle1: { ...typography.subtitle1, fontFamily, fontWeight: 500 },
    subtitle2: { ...typography.subtitle2, fontFamily, fontWeight: 500 },
  };

  const baseMode: ThemeOptions = {
    palette: { mode: config.mode },
    shape: { borderRadius: config.borderRadius || 8 },
    shadows: defaultShadow,
    typography: enhancedTypography,
    direction: config.direction,
  };

  const locale = config.direction === 'rtl' ? arSD : enUS;

  const mergedOptions: ThemeOptions = _.merge(
    {},
    baseMode,
    defaultTheme,
    themeSelect,
  );

  const theme = createTheme(mergedOptions, locale);
  theme.components = { ...components(theme) };
  themeCache.set(cacheKey, theme);
  return theme;
};

const ThemeSettings = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const { activeDir, activeTheme, activeMode, borderRadius } = customizer;

  const theme = useMemo(
    () =>
      BuildTheme({
        direction: activeDir,
        theme: activeTheme,
        mode: activeMode,
        borderRadius,
      }),
    [activeDir, activeTheme, activeMode, borderRadius]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      document.dir = activeDir;
      document.documentElement.dir = activeDir;
      document.body.classList.remove('rtl', 'ltr');
      document.body.classList.add(activeDir);
      document.body.style.fontFamily = '"Cairo"';
    });
  }, [activeDir]);

  return theme;
};

export const clearThemeCache = () => {
  themeCache.clear();
};

export { ThemeSettings };
