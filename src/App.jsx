import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()
  const [activeRail, setActiveRail] = useState('chat')
  const isZh = i18n.language === 'zh-CN'
  const nextLocale = isZh ? 'en-US' : 'zh-CN'
  const railItems = [
    { key: 'chat', icon: '💬', label: t('railChat') },
    { key: 'discover', icon: '🧭', label: t('railDiscover') },
    { key: 'contacts', icon: '👥', label: t('railContacts') },
    { key: 'create', icon: '✨', label: t('railCreate') },
  ]

  return (
    <div className="web-shell">
      <aside className="rail" aria-label={t('railAria')}>
        <div className="rail-brand">{t('railBrand')}</div>
        <div className="rail-nav">
          {/* 迭代 3 先做静态导航交互：仅切换激活态，不接路由。 */}
          {railItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`rail-icon ${activeRail === item.key ? 'active' : ''}`}
              aria-label={item.label}
              onClick={() => setActiveRail(item.key)}
            >
              <span aria-hidden="true">{item.icon}</span>
            </button>
          ))}
        </div>
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
