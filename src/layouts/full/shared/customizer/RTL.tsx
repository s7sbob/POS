// File: src/layouts/full/shared/customizer/RTL.tsx
import React, { useEffect, useMemo } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { useSelector } from 'src/store/Store';
import { AppState } from 'src/store/Store';

interface RTLType {
  children: React.ReactNode;
}

// إنشاء cache مرة واحدة فقط
const rtlCache = createCache({
  key: 'muirtl',
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

const ltrCache = createCache({
  key: 'muiltr',
  prepend: true,
});

const RTL = (props: RTLType) => {
  const { children } = props;
  const customizer = useSelector((state: AppState) => state.customizer);
  const direction = customizer.activeDir;

  // استخدام useMemo لتجنب إعادة إنشاء cache
  const cache = useMemo(() => {
    return direction === 'rtl' ? rtlCache : ltrCache;
  }, [direction]);

  useEffect(() => {
    document.dir = direction;
    document.documentElement.dir = direction;
    
    // إضافة/إزالة class للـ body
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(direction);
  }, [direction]);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default RTL;
