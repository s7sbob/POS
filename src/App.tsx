// File: src/App.tsx
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'src/store/Store';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { AppState } from './store/Store';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'src/store/Store';
import { setLanguage, setDir } from './store/customizer/CustomizerSlice';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const isInitialized = useRef(false);

  // تطبيق الإعدادات المحفوظة عند تحميل التطبيق مرة واحدة فقط
  useEffect(() => {
    if (isInitialized.current) return;
    
    const savedLanguage = Cookies.get('language');
    const savedDirection = Cookies.get('direction');
    
    // تطبيق اللغة المحفوظة
    if (savedLanguage && savedLanguage.trim() !== '') {
      dispatch(setLanguage(savedLanguage));
      i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      // إعداد افتراضي للإنجليزية
      const defaultLang = 'en';
      dispatch(setLanguage(defaultLang));
      i18n.changeLanguage(defaultLang);
      document.documentElement.lang = defaultLang;
      Cookies.set('language', defaultLang, { expires: 365 });
    }
    
    // تطبيق الاتجاه المحفوظ
    if (savedDirection && savedDirection.trim() !== '') {
      dispatch(setDir(savedDirection));
      document.documentElement.dir = savedDirection;
    } else {
      // إعداد افتراضي للـ LTR
      const defaultDir = 'ltr';
      dispatch(setDir(defaultDir));
      document.documentElement.dir = defaultDir;
      Cookies.set('direction', defaultDir, { expires: 365 });
    }
    
    isInitialized.current = true;
  }, []); // dependency array فارغ للتشغيل مرة واحدة فقط

  // تحديث الثيم ليدعم الاتجاه
  const themeWithDirection = {
    ...theme,
    direction: customizer.activeDir,
  };

  return (
    <ThemeProvider theme={themeWithDirection}>
      <RTL>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
