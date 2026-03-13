import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { messages } from './messages'

const resources = {
  'zh-CN': { translation: messages['zh-CN'] },
  'en-US': { translation: messages['en-US'] },
}

// 国际化初始化：默认中文，缺失键时回退到中文。
i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
})

export default i18n
