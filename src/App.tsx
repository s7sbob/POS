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
import { ErrorProvider } from './contexts/ErrorContext';
import GlobalPrintHandler from './components/GlobalPrintHandler';

function App() {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const isInitialized = useRef(false);

  const thermalPrinterConfig = {
    enabled: localStorage.getItem('thermal_printer_enabled') === 'true',
    type: (localStorage.getItem('thermal_printer_type') as 'usb' | 'network') || 'usb',
    networkConfig: {
      ip: localStorage.getItem('thermal_printer_ip') || '192.168.1.100',
      port: Number(localStorage.getItem('thermal_printer_port')) || 9100
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    
    const savedLanguage = Cookies.get('language');
    const savedDirection = Cookies.get('direction');
    
    if (savedLanguage && savedLanguage.trim() !== '') {
      dispatch(setLanguage(savedLanguage));
      i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      const defaultLang = 'en';
      dispatch(setLanguage(defaultLang));
      i18n.changeLanguage(defaultLang);
      document.documentElement.lang = defaultLang;
      Cookies.set('language', defaultLang, { expires: 365 });
    }
    
    if (savedDirection && savedDirection.trim() !== '') {
      dispatch(setDir(savedDirection));
      document.documentElement.dir = savedDirection;
    } else {
      const defaultDir = 'ltr';
      dispatch(setDir(defaultDir));
      document.documentElement.dir = defaultDir;
      Cookies.set('direction', defaultDir, { expires: 365 });
    }
    
    isInitialized.current = true;
  }, []);

  const themeWithDirection = {
    ...theme,
    direction: customizer.activeDir,
  };

  return (
    <ThemeProvider theme={themeWithDirection}>
      <RTL>
        <CssBaseline />
        <ErrorProvider>
          <AuthProvider>
            <GlobalPrintHandler thermalPrinterConfig={thermalPrinterConfig}>
              <RouterProvider router={router} />
            </GlobalPrintHandler>
          </AuthProvider>
        </ErrorProvider>
      </RTL>
    </ThemeProvider>
  );
}

export default App;
