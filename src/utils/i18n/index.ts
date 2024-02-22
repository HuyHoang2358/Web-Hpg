import { createI18n } from 'vue-i18n';
import en from '@/utils/i18n/locales/en.json';
import vi from '@/utils/i18n/locales/vi.json';
import { LOCAL_STORAGE_KEY } from '@/utils/enums';

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(LOCAL_STORAGE_KEY.LOCALE) || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    vi,
  },
});
