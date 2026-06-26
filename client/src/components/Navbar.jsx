import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  // "glass" mode: transparent navbar over dark hero
  const glass = transparent && !scrolled;

  const dashPath = user?.role === 'customer'
    ? '/customer/dashboard'
    : user?.role === 'business' ? '/business/dashboard' : '/admin';

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-gray-100'
          : glass ? 'bg-transparent' : 'bg-white'
      }`}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 flex-shrink-0 group">
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                glass ? 'bg-white/15' : 'bg-navy'
              }`}>
                <span className="text-sky-400 font-black text-sm leading-none">BR</span>
              </div>
              <span className={`text-[1.15rem] font-black transition-colors duration-200 ${
                glass ? 'text-white' : 'text-navy'
              }`}>
                Bid<span className="text-sky-400">Rinse</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-7">
              {[
                { to: '/services',       label: 'Services' },
                { to: '/how-it-works',   label: 'How It Works' },
                { to: '/for-businesses', label: 'For Businesses' },
              ].map(({ to, label }) => (
                <NavLink key={to} to={to}
                         className={({ isActive }) =>
                           `text-sm font-medium transition-colors duration-150 ${
                             isActive
                               ? glass ? 'text-white font-semibold' : 'text-navy font-semibold'
                               : glass ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-navy'
                           }`
                         }>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to={dashPath}
                        className={`text-sm font-medium transition-colors ${
                          glass ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-navy'
                        }`}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                          className={`btn btn-sm ${glass ? 'btn-ghost-white' : 'btn-outline'}`}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"
                        className={`text-sm font-medium transition-colors ${
                          glass ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-navy'
                        }`}>
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Get a Quote</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                glass
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className={`md:hidden border-t px-5 pb-5 pt-3 animate-fade-in ${
            glass
              ? 'border-white/10 bg-[#060d1a]/95 backdrop-blur-md'
              : 'border-gray-100 bg-white'
          }`}>
            <nav className="space-y-0.5 mb-4">
              {[
                { to: '/services',       label: 'Services' },
                { to: '/how-it-works',   label: 'How It Works' },
                { to: '/for-businesses', label: 'For Businesses' },
                ...(user ? [{ to: dashPath, label: 'Dashboard' }] : []),
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        glass
                          ? 'text-white/70 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className={`border-t pt-4 ${glass ? 'border-white/10' : 'border-gray-100'}`}>
              {user ? (
                <button onClick={handleLogout}
                        className="w-full py-2.5 px-3 text-sm font-medium text-red-400 hover:bg-white/10 rounded-xl transition-colors text-left">
                  Log Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login"             onClick={() => setOpen(false)} className={`btn w-full justify-center ${glass ? 'btn-ghost-white' : 'btn-ghost'}`}>Log In</Link>
                  <Link to="/register"          onClick={() => setOpen(false)} className="btn btn-primary w-full">Get a Free Quote</Link>
                  <Link to="/register/business" onClick={() => setOpen(false)} className={`btn w-full ${glass ? 'btn-ghost-white' : 'btn-outline'}`}>List Your Business</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer — omitted when transparent so hero fills full viewport from the top */}
      {!transparent && <div className="h-16 flex-shrink-0" />}
    </>
  );
}
