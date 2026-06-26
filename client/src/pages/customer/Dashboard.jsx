import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { JOB_STATUS_LABELS } from '../../utils/constants';
import api from '../../utils/api';

const navItems = [
  { path: '/customer/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/customer/post-job',  icon: '➕', label: 'Post a Job' },
  { path: '/customer/jobs',      icon: '📋', label: 'My Jobs' },
];

const STAT_CONFIG = [
  { key: 'total',     label: 'Total Jobs',      icon: '📋', color: 'text-navy',       bg: 'bg-navy-50',   accent: '#1B3A5C' },
  { key: 'pending',   label: 'Awaiting Quotes', icon: '⏳', color: 'text-amber-600',  bg: 'bg-amber-50',  accent: '#d97706' },
  { key: 'quotes',    label: 'Quotes Received', icon: '💬', color: 'text-sky-600',    bg: 'bg-sky-50',    accent: '#4A9FD4' },
  { key: 'completed', label: 'Completed',       icon: '✅', color: 'text-green-600',  bg: 'bg-green-50',  accent: '#16a34a' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs')
       .then(({ data }) => { setJobs(data); setLoading(false); })
       .catch(() => setLoading(false));
  }, []);

  const stats = {
    total:     jobs.length,
    pending:   jobs.filter((j) => j.status === 'pending').length,
    quotes:    jobs.filter((j) => j.status === 'quotes_received').length,
    active:    jobs.filter((j) => j.status === 'accepted').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  };

  return (
    <DashboardLayout navItems={navItems} title="Customer">
      {/* Welcome */}
      <div className="mb-7 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's an overview of your jobs.</p>
        </div>
        <Link to="/customer/post-job" className="btn btn-primary btn-sm">+ Post a Job</Link>
      </div>

      {loading ? <LoadingSpinner label="Loading your jobs…" /> : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STAT_CONFIG.map((s) => (
              <div key={s.key} className="card relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                     style={{ background: s.accent }} />
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3 ml-2`}>
                  {s.icon}
                </div>
                <p className={`text-3xl font-bold tabular-nums ml-2 ${s.color}`}>{stats[s.key]}</p>
                <p className="text-sm text-gray-500 font-medium mt-1 ml-2">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-navy text-lg">Recent Jobs</h2>
              <Link to="/customer/jobs" className="text-sky-500 text-sm font-medium hover:text-sky-600 transition-colors">
                View all →
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏠</div>
                <p className="empty-state-title">No jobs yet</p>
                <p className="empty-state-desc">Post your first job and local businesses will start sending you quotes.</p>
                <Link to="/customer/post-job" className="btn btn-primary">Post Your First Job →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.slice(0, 5).map((job) => {
                  const st = JOB_STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <Link key={job.id} to={`/customer/jobs/${job.id}`}
                          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 group">
                      <div className="min-w-0">
                        <p className="font-medium text-navy text-sm truncate">{job.service_type}</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {job.city}, NC &bull; {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                        {parseInt(job.quote_count) > 0 && (
                          <span className="text-sky-500 text-xs font-semibold hidden sm:block">
                            {job.quote_count} quote{job.quote_count > 1 ? 's' : ''}
                          </span>
                        )}
                        <span className={`badge ${st.color}`}>{st.label}</span>
                        <span className="text-gray-300 group-hover:text-gray-400 transition-colors text-xs">›</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
