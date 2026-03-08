export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <h1>MedOps</h1>
        </div>
        <nav className="nav">
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#modules" className="nav-link">Modules</a>
          <a href="#settings" className="nav-link">Settings</a>
        </nav>
        <div className="header-user">
          <span className="user-avatar">👤</span>
        </div>
      </div>
    </header>
  )
}
