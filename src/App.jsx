import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()
  const isZh = i18n.language === 'zh-CN'
  const nextLocale = isZh ? 'en-US' : 'zh-CN'

  return (
    <div className="web-shell">
      <aside className="rail" aria-label="Primary">
        <div className="rail-brand">{t('railBrand')}</div>
      </aside>

      <aside className="sidebar" aria-label="Conversation List">
        <div className="search-box">{t('searchPlaceholder')}</div>
      </aside>

      <main className="main" aria-label="Main Content">
        <header className="topbar">
          <span>{t('topbarTitle')}</span>
          <button
            type="button"
            className="locale-btn"
            onClick={() => i18n.changeLanguage(nextLocale)}
            aria-label={t('localeLabel')}
          >
            {isZh ? 'EN' : '中'}
          </button>
        </header>
        <section className="main-content" />
      </main>
    </div>
  )
}

export default App
