import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavClick = () => {
    // On mobile, close the drawer after navigating
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">

      {/* Overlay — mobile only */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span className="sidebar-brand-name">Stock Dash</span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.username}</div>
          <div className="sidebar-user-role">{user?.role?.replace('_', ' ')}</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Main</div>
          <NavLink to="/" end onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            Dashboard
          </NavLink>
          <NavLink to="/products" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            Products
          </NavLink>
          <NavLink to="/categories" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            Categories
          </NavLink>
          <NavLink to="/transactions" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            Transactions
          </NavLink>

          <div className="sidebar-label">Insights</div>
          <NavLink to="/reports" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            Reports
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-label">Admin</div>
              <NavLink to="/users" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                Users
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={logout}>Sign out</button>
        </div>
      </aside>

      {/* Content — header + main stacked vertically */}
      <div className="content-wrap">
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="sidebar-brand-name">Stock Dash</span>
        </div>
        <main className="main-content">
          {children}
        </main>
      </div>

    </div>
  )
}

export default Layout