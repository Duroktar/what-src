import i18n from 'i18next'
import enTranslation from './languages/en.json'

export const i18Options: i18n.InitOptions = {
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  fallbackLng: 'en',
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
  },
}
