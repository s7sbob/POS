// File: src/utils/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from 'src/utils/languages/en.json';
import arabic from 'src/utils/languages/ar.json';

const resources = {
  en: {
    translation: english,
  },
  ar: {
    translation: arabic,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      // تحسين للـ RTL
      bindI18n: 'languageChanged',
      bindI18nStore: false,
    },
  });

// تحسين معالجة تغيير اللغة
i18n.on('languageChanged', (lng) => {
  // تطبيق التغييرات بشكل مُحسن
  requestAnimationFrame(() => {
    const isRTL = lng === 'ar';
    const direction = isRTL ? 'rtl' : 'ltr';
    
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(direction);
  });
});

export default i18n;
