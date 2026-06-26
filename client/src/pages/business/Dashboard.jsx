import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export const BIZ_NAV = [
  { path: '/business/dashboard',   icon: '🏠', label: 'Overview'       },
  { path: '/business/jobs',        icon: '🔍', label: 'Available Jobs'  },
  { path: '/business/quotes',      icon: '📝', label: 'My Quotes'       },
  { path: '/business/active-jobs', icon: '⚡', label: 'Active Jobs'     },
  { path: '/business/earnings',    icon: '💰', label: 'Earnings'        },
  { path: '/business/profile',     icon: '⚙️', label: 'Profile'         },
];

const STAT_CONFIG = [
  { key: 'active_jobs_in_area', label: 'Jobs in Area',        icon: '🔍', color: 'text-sky-600',   bg: 'bg-sky-50',   accent: '#4A9FD4', path: '/business/jobs'       },
  { key: 'quotes_submitted',    label: 'Quotes Submitted',    icon: '📝', color: 'text-navy',      bg: 'bg-navy-50',  accent: '#1B3A5C', path: '/business/quotes'     },
  { key: 'jobs_won',            label: 'Jobs Won',            icon: '🏆', color: 'text-green-600', bg: 'bg-green-50', accent: '#16a34a', path: '/business/active-jobs'},
  { key: 'earned_this_month',   label: 'Earned This Month',   icon: '💰', color: 'text-amber-600', bg: 'bg-amber-50', accent: '#d97706', path: '/business/earnings'   },
];

export default function BusinessDashboard() {
  const { user, business } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/businesses/stats')
       .then(({ data }) => { setStats(data); setLoading(false); })
       .catch(() => setLoading(false));
  }, []);

  if (!business?.is_approved) {
    return (
      <DashboardLayout navItems={BIZ_NAV} title="Business">
        <div className="max-w-lg mx-auto">
          <div className="card text-center py-14">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">⏳</div>
            <h1 className="text-xl font-bold text-navy mb-3">Pending Approval</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              Your business registration is under review. Our admin team typically approves applications within 1 business day. You'll be notified by email once approved.
            </p>
            {business?.is_suspended && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                Your account has been suspended. Contact <a href="mailto:hello@bidrinse.com" className="underline">hello@bidrinse.com</a> for help.
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const winRate = stats && stats.quotes_submitted > 0
    ? `${Math.round((stats.jobs_won / stats.quotes_submitted) * 100)}%`
    : '—';

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      {/* Welcome */}
      <div className="mb-7 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            {business?.business_name || user?.name}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Business overview</p>
        </div>
        <Link to="/business/jobs" className="btn btn-primary btn-sm">Browse Jobs →</Link>
      </div>

      {loading ? <LoadingSpinner label="Loading stats…" /> : stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STAT_CONFIG.map((s) => {
              const raw = stats[s.key];
              const value = s.key === 'earned_this_month'
                ? `$${parseFloat(raw).toFixed(2)}`
                : raw;
              return (
                <Link key={s.key} to={s.path}
                      className="card relative overflow-hidden block hover:scale-[1.01] transition-transform duration-150"
                      style={{ textDecoration: 'none' }}>
                  <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                       style={{ background: s.accent }} />
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3 ml-2`}>
                    {s.icon}
                  </div>
                  <p className={`text-3xl font-bold tabular-nums ml-2 ${s.color}`}>{value}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1 ml-2">{s.label}</p>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quick actions */}
            <div className="card">
              <h2 className="font-semibold text-navy mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link to="/business/jobs"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-colors">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-navy text-sm">Browse Available Jobs</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stats.active_jobs_in_area} job{stats.active_jobs_in_area !== 1 ? 's' : ''} in your area right now</p>
                  </div>
                  <span className="ml-auto text-sky-400 text-sm">›</span>
                </Link>
                <Link to="/business/active-jobs"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-navy text-sm">Active Jobs</p>
                    <p className="text-xs text-gray-500 mt-0.5">Jobs where your quote was accepted</p>
                  </div>
                  <span className="ml-auto text-green-400 text-sm">›</span>
                </Link>
                <Link to="/business/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-semibold text-navy text-sm">Update Profile</p>
                    <p className="text-xs text-gray-500 mt-0.5">Edit services, service area, description</p>
                  </div>
                  <span className="ml-auto text-gray-400 text-sm">›</span>
                </Link>
              </div>
            </div>

            {/* Performance */}
            <div className="card">
              <h2 className="font-semibold text-navy mb-4">Performance</h2>
              <div className="space-y-3">
                {[
                  { label: 'Win rate',              value: winRate },
                  { label: 'Total quotes submitted', value: stats.quotes_submitted },
                  { label: 'Jobs completed',         value: stats.jobs_won },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <span className="font-bold text-navy text-sm tabular-nums">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
