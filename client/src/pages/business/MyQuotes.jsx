import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BIZ_NAV } from './Dashboard';
import { QUOTE_STATUS_LABELS, SERVICE_ICONS } from '../../utils/constants';
import api from '../../utils/api';

const FILTERS = ['all', 'pending', 'accepted', 'declined', 'expired'];

export default function MyQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    api.get('/quotes/business/mine')
      .then(({ data }) => { setQuotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy tracking-tight">My Quotes</h1>
        <p className="text-gray-400 text-sm mt-1">{quotes.length} total quote{quotes.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const count = f === 'all' ? quotes.length : quotes.filter((q) => q.status === f).length;
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
              {f === 'all' ? 'All' : (QUOTE_STATUS_LABELS[f]?.label || f)}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] font-bold ${filter === f ? 'opacity-60' : 'text-gray-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? <LoadingSpinner label="Loading quotes…" /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p className="empty-state-title">No quotes found</p>
              <p className="empty-state-desc">
                {filter === 'all'
                  ? 'Browse available jobs and start submitting quotes to win work.'
                  : `You have no ${QUOTE_STATUS_LABELS[filter]?.label?.toLowerCase() || filter} quotes.`}
              </p>
            </div>
          ) : (
            filtered.map((q) => {
              const st = QUOTE_STATUS_LABELS[q.status] || { label: q.status, color: 'bg-gray-100 text-gray-600' };
              const isWon = q.status === 'accepted';
              return (
                <div key={q.id}
                     className={`card transition-all duration-150 ${
                       isWon
                         ? 'border-green-200 bg-green-50/50'
                         : 'hover:-translate-y-0.5'
                     }`}>
                  <div className="flex gap-4 items-start">
                    {/* Service icon */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                         style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                      {SERVICE_ICONS[q.service_type] || '🧹'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="font-bold text-navy">{q.service_type}</h3>
                            <span className={`badge ${st.color}`}>{st.label}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {q.city ? `${q.city}, NC ${q.zip_code}` : `Zip ${q.zip_code}`}
                            {q.preferred_date && ` · ${new Date(q.preferred_date).toLocaleDateString()}`}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-extrabold text-sky-500 leading-none tabular-nums">
                            ${parseFloat(q.amount).toFixed(2)}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">your quote</p>
                        </div>
                      </div>

                      {q.message && (
                        <p className="text-gray-600 text-xs mt-2.5 leading-relaxed line-clamp-2">{q.message}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                          Submitted {new Date(q.created_at).toLocaleDateString()}
                        </span>
                        {isWon && (
                          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            🏆 You won this job!
                          </span>
                        )}
                      </div>
                    </div>
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
