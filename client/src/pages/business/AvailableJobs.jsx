import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BIZ_NAV } from './Dashboard';
import { SERVICE_ICONS, JOB_TYPE_BADGES } from '../../utils/constants';
import api from '../../utils/api';

export default function AvailableJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [quoteModal, setQuoteModal] = useState(null);
  const [quoteForm, setQuoteForm]   = useState({ amount: '', message: '', estimated_completion_time: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/jobs/available/feed')
      .then(({ data }) => { setJobs(data); setLoading(false); })
      .catch((err) => { toast.error(err.response?.data?.error || 'Failed to load jobs'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openQuote = (job) => {
    setQuoteModal(job);
    setQuoteForm({ amount: '', message: '', estimated_completion_time: '' });
  };

  const submitQuote = async () => {
    if (!quoteForm.amount || !quoteForm.message) { toast.error('Amount and message are required'); return; }
    setSubmitting(true);
    try {
      await api.post('/quotes', { job_id: quoteModal.id, ...quoteForm });
      toast.success('Quote submitted!');
      setQuoteModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit quote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Available Jobs</h1>
          <p className="text-gray-400 text-sm mt-1">Jobs matching your service area</p>
        </div>
        <button onClick={load} className="btn btn-outline btn-sm">↺ Refresh</button>
      </div>

      {loading ? <LoadingSpinner label="Loading jobs…" /> : (
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-title">No jobs in your area right now</p>
              <p className="empty-state-desc">We'll notify you by SMS and email the moment a matching job is posted.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const left = parseInt(job.max_quotes) - parseInt(job.quote_count);
              return (
                <div key={job.id}
                     className={`card transition-all duration-150 ${
                       job.already_quoted
                         ? 'border-green-200 bg-green-50/50'
                         : 'hover:-translate-y-0.5 hover:shadow-lg'
                     }`}>
                  <div className="flex gap-4 items-start">
                    {/* Service icon */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                         style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                      {SERVICE_ICONS[job.service_type] || '🧹'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-navy">{job.service_type}</h3>
                            {job.job_type && (
                              <span className={`badge capitalize ${JOB_TYPE_BADGES[job.job_type] || 'bg-gray-100 text-gray-600'}`}>
                                {job.job_type === 'commercial' ? '🏢' : '🏠'} {job.job_type}
                              </span>
                            )}
                            {job.already_quoted && (
                              <span className="badge bg-green-100 text-green-700">✓ Quote Submitted</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            📍 {job.city ? `${job.city}, NC ${job.zip_code}` : `Zip ${job.zip_code}`}
                            {job.preferred_date && (
                              <> · 📅 {new Date(job.preferred_date).toLocaleDateString()}
                                {job.preferred_time && job.preferred_time !== 'flexible' && ` — ${job.preferred_time}`}
                              </>
                            )}
                          </p>
                        </div>

                        {!job.already_quoted && (
                          <button onClick={() => openQuote(job)} className="btn btn-primary btn-sm flex-shrink-0">
                            Submit Quote
                          </button>
                        )}
                      </div>

                      {job.description && (
                        <p className="text-gray-600 text-sm mt-2.5 leading-relaxed line-clamp-2">
                          {job.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-gray-400">
                          Posted {new Date(job.created_at).toLocaleString()}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          left <= 1
                            ? 'bg-orange-50 text-orange-500'
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                          {job.quote_count}/{job.max_quotes} quotes
                          {left === 1 && ' · 1 spot left!'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quote Modal */}
      {quoteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md"
               style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.1)' }}>

            {/* Modal header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                {SERVICE_ICONS[quoteModal.service_type] || '🧹'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-navy leading-tight">Submit Quote</h2>
                <p className="text-gray-400 text-sm">{quoteModal.service_type} · {quoteModal.city}, NC</p>
              </div>
              <button onClick={() => setQuoteModal(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Your Quote Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">$</span>
                  <input
                    type="number" min="1" step="0.01"
                    className="input pl-7"
                    placeholder="0.00"
                    value={quoteForm.amount}
                    onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Message to Customer *</label>
                <textarea
                  className="input min-h-[100px] resize-none"
                  placeholder="Introduce yourself and explain what's included in your quote…"
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Estimated Completion Time</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 2–3 hours, Same day"
                  value={quoteForm.estimated_completion_time}
                  onChange={(e) => setQuoteForm({ ...quoteForm, estimated_completion_time: e.target.value })}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setQuoteModal(null)} className="btn btn-outline flex-1">Cancel</button>
              <button onClick={submitQuote} disabled={submitting} className="btn btn-primary flex-1">
                {submitting ? 'Submitting…' : 'Submit Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
