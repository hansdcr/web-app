function App() {
  return (
    <div className="web-shell">
      <aside className="rail" aria-label="Primary">
        <div className="rail-brand">AI</div>
      </aside>

      <aside className="sidebar" aria-label="Conversation List">
        <div className="search-box">Search</div>
      </aside>

      <main className="main" aria-label="Main Content">
        <header className="topbar">Teamily AI</header>
        <section className="main-content" />
      </main>
    </div>
  )
}

export default App
