import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout({ children, navItems, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fc]">

      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 flex-shrink-0 border-b border-navy-700/30"
              style={{ background: 'linear-gradient(180deg, #1a3a5a 0%, #1B3A5C 100%)' }}>
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-sky-400 font-black text-xs leading-none">BR</span>
            </div>
            <span className="text-white font-black text-base hidden sm:block">
              Bid<span className="text-sky-400">Rinse</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-white/40 text-xs font-medium">{user?.name}</span>
          <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Log Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)]
          w-56 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col
          transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `} style={{ boxShadow: '1px 0 0 rgba(0,0,0,0.04)' }}>

          <div className="flex-1 overflow-y-auto p-3 pt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-2 px-3">
              {title}
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path.endsWith('dashboard') || item.path === '/admin'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                >
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User info at bottom */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {open && (
          <div className="fixed inset-0 bg-black/25 z-20 md:hidden backdrop-blur-sm"
               onClick={() => setOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-5 md:p-7 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
