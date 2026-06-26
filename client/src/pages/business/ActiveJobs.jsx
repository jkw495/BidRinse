import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BIZ_NAV } from './Dashboard';
import { JOB_STATUS_LABELS, SERVICE_ICONS } from '../../utils/constants';
import api from '../../utils/api';

export default function ActiveJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [completing, setCompleting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/quotes/business/active')
      .then(({ data }) => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markComplete = async (quoteId) => {
    if (!window.confirm('Mark this job as complete? Payment will be released minus the platform fee.')) return;
    setCompleting(quoteId);
    try {
      const { data } = await api.put(`/quotes/${quoteId}/complete`);
      toast.success(`Job complete! Net payout: $${data.net.toFixed(2)}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark complete');
    } finally {
      setCompleting(null);
    }
  };

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Active Jobs</h1>
        <p className="text-gray-400 text-sm mt-1">Jobs where your quote was accepted</p>
      </div>

      {loading ? <LoadingSpinner label="Loading active jobs…" /> : (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚡</div>
              <p className="empty-state-title">No active jobs</p>
              <p className="empty-state-desc">Submit quotes on available jobs to win work. Accepted quotes appear here.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const st       = JOB_STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-600' };
              const feeRate  = job.job_type === 'commercial' ? 0.05 : 0.035;
              const fee      = parseFloat(job.amount) * feeRate;
              const net      = parseFloat(job.amount) - fee;
              const feeLabel = job.job_type === 'commercial' ? '5%' : '3.5%';

              return (
                <div key={job.id} className="card">
                  {/* Job header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                         style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                      {SERVICE_ICONS[job.service_type] || '🧹'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-navy">{job.service_type}</h3>
                        <span className={`badge ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Accepted {new Date(job.updated_at).toLocaleDateString()}
                        {job.preferred_date && ` · 📅 ${new Date(job.preferred_date).toLocaleDateString()}`}
                        {job.preferred_time && job.preferred_time !== 'flexible' && ` — ${job.preferred_time}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-extrabold text-sky-500 leading-none tabular-nums">
                        ${parseFloat(job.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Net: <span className="font-semibold text-green-600">${net.toFixed(2)}</span>
                        <span className="text-orange-400"> ({feeLabel} fee)</span>
                      </p>
                    </div>
                  </div>

                  {/* Customer contact — revealed after acceptance */}
                  <div className="rounded-2xl p-4 mb-4 border border-sky-100"
                       style={{ background: 'linear-gradient(135deg, #f0f8fd, #e8f3fb)' }}>
                    <p className="text-xs font-bold text-navy/70 uppercase tracking-wider mb-3">Customer Contact</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Name</p>
                        <p className="font-semibold text-navy">{job.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                        <a href={`tel:${job.customer_phone}`}
                           className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                          {job.customer_phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Email</p>
                        <a href={`mailto:${job.customer_email}`}
                           className="font-semibold text-sky-600 hover:text-sky-700 transition-colors text-xs">
                          {job.customer_email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Full Address</p>
                      <p className="font-semibold text-navy text-sm">{job.address}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    {job.status === 'accepted' && (
                      <button
                        onClick={() => markComplete(job.quote_id)}
                        disabled={completing === job.quote_id}
                        className="btn btn-primary btn-sm"
                      >
                        {completing === job.quote_id ? 'Completing…' : '✓ Mark Job Complete'}
                      </button>
                    )}
                    {job.status === 'completed' && (
                      <span className="badge bg-green-100 text-green-700 font-semibold text-sm px-3 py-1.5">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
