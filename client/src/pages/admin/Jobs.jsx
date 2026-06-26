import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ADMIN_NAV } from './Dashboard';
import { JOB_STATUS_LABELS } from '../../utils/constants';
import api from '../../utils/api';

const FILTERS = ['all', 'pending', 'quotes_received', 'accepted', 'completed', 'cancelled', 'expired'];

export default function AdminJobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/jobs${filter !== 'all' ? `?status=${filter}` : ''}`)
      .then(({ data }) => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const filtered = jobs.filter((j) =>
    !search ||
    j.service_type.toLowerCase().includes(search.toLowerCase()) ||
    j.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    j.zip_code.includes(search)
  );

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-navy">All Jobs <span className="text-gray-400 text-lg">({jobs.length})</span></h1>
        <input
          type="search"
          placeholder="Search by service, customer, zip…"
          className="input max-w-xs py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const st = JOB_STATUS_LABELS[f];
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy'
              }`}>
              {f === 'all' ? 'All' : (st?.label || f)}
            </button>
          );
        })}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">No jobs found.</div>
          ) : (
            filtered.map((job) => {
              const st = JOB_STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <div key={job.id} className="card">
                  <div className="flex flex-wrap gap-3 items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-navy">{job.service_type}</h3>
                        <span className={`badge ${st.color}`}>{st.label}</span>
                        <span className="badge bg-gray-100 text-gray-600">{job.quote_count} quote{job.quote_count !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {job.city ? `${job.city}, NC ${job.zip_code}` : `Zip ${job.zip_code}`}
                        &bull; Customer: {job.customer_name} ({job.customer_email})
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs whitespace-nowrap">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {job.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-1">{job.description}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
