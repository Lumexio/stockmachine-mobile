import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import ja from './locales/ja';
import ru from './locales/ru';

export const LANGUAGE_KEY = 'sm_language';
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'ja', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    ja: { translation: ja },
    ru: { translation: ru },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

/** Persist and apply language change */
export async function changeLanguage(lang: SupportedLanguage) {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

/** Load stored language preference on app start */
export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as SupportedLanguage)) {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // fall back to default 'en'
  }
}

export default i18n;
