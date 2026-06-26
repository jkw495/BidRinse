import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { JOB_STATUS_LABELS, SERVICE_ICONS } from '../../utils/constants';
import api from '../../utils/api';

const navItems = [
  { path: '/customer/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/customer/post-job',  icon: '➕', label: 'Post a Job' },
  { path: '/customer/jobs',      icon: '📋', label: 'My Jobs' },
];

const FILTERS = ['all', 'pending', 'quotes_received', 'accepted', 'completed', 'cancelled'];

export default function MyJobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    api.get('/jobs').then(({ data }) => { setJobs(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <DashboardLayout navItems={navItems} title="Customer">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">My Jobs</h1>
          <p className="text-gray-400 text-sm mt-1">{jobs.length} total job{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/customer/post-job" className="btn btn-primary btn-sm">+ Post New Job</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const count = f === 'all' ? jobs.length : jobs.filter((j) => j.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                filter === f
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : (JOB_STATUS_LABELS[f]?.label || f)}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] font-bold ${filter === f ? 'opacity-60' : 'text-gray-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? <LoadingSpinner label="Loading your jobs…" /> : (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-title">
                {filter === 'all' ? 'No jobs yet' : 'No jobs with this status'}
              </p>
              <p className="empty-state-desc">
                {filter === 'all'
                  ? 'Post your first job and local businesses will start sending you quotes.'
                  : `You have no ${JOB_STATUS_LABELS[filter]?.label?.toLowerCase() || filter} jobs.`}
              </p>
              {filter === 'all' && (
                <Link to="/customer/post-job" className="btn btn-primary">Post Your First Job →</Link>
              )}
            </div>
          ) : (
            filtered.map((job) => {
              const st = JOB_STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <Link key={job.id} to={`/customer/jobs/${job.id}`}
                      className="card flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-150 group"
                      style={{ textDecoration: 'none' }}>
                  {/* Service icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                    {SERVICE_ICONS[job.service_type] || '🏠'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-navy text-sm">{job.service_type}</span>
                      <span className={`badge ${st.color}`}>{st.label}</span>
                      {parseInt(job.quote_count) > 0 && (
                        <span className="badge bg-sky-100 text-sky-700">
                          {job.quote_count} quote{job.quote_count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {job.city ? `${job.city}, NC ${job.zip_code}` : `Zip: ${job.zip_code}`}
                      {' · '}Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-gray-300 group-hover:text-sky-400 transition-colors text-xl font-light flex-shrink-0">›</span>
                </Link>
              );
            })
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
