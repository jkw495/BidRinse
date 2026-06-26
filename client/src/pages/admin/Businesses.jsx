import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { ADMIN_NAV } from './Dashboard';
import api from '../../utils/api';

const FILTERS = ['all', 'pending', 'approved', 'suspended'];

export default function AdminBusinesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/businesses${filter !== 'all' ? `?status=${filter}` : ''}`);
      setBusinesses(data);
    } catch {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const action = async (id, type) => {
    setActionLoading(`${id}-${type}`);
    try {
      if (type === 'approve') await api.put(`/admin/businesses/${id}/approve`);
      else if (type === 'reject') await api.put(`/admin/businesses/${id}/reject`);
      else if (type === 'suspend') await api.put(`/admin/businesses/${id}/suspend`, { suspend: true });
      else if (type === 'unsuspend') await api.put(`/admin/businesses/${id}/suspend`, { suspend: false });
      toast.success('Done');
      load();
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin">
      <h1 className="text-2xl font-bold text-navy mb-6">Businesses</h1>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy'
            }`}>{f}</button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {businesses.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">No businesses found.</div>
          ) : (
            businesses.map((b) => (
              <div key={b.id} className="card">
                <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-navy text-lg">{b.business_name}</h3>
                      {b.is_approved && !b.is_suspended && <span className="badge bg-green-100 text-green-700">Approved</span>}
                      {!b.is_approved && !b.is_suspended && <span className="badge bg-yellow-100 text-yellow-700">Pending</span>}
                      {b.is_suspended && <span className="badge bg-red-100 text-red-700">Suspended</span>}
                      {b.is_featured && <span className="badge bg-yellow-100 text-yellow-700">⭐ Featured</span>}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">{b.owner_name} &bull; {b.email} &bull; {b.phone}</p>
                    <StarRating rating={b.avg_rating} count={b.review_count} />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!b.is_approved && !b.is_suspended && (
                      <>
                        <button onClick={() => action(b.id, 'approve')} disabled={!!actionLoading}
                          className="btn btn-primary btn-sm">Approve</button>
                        <button onClick={() => action(b.id, 'reject')} disabled={!!actionLoading}
                          className="btn btn-danger btn-sm">Reject</button>
                      </>
                    )}
                    {b.is_approved && !b.is_suspended && (
                      <button onClick={() => action(b.id, 'suspend')} disabled={!!actionLoading}
                        className="btn btn-danger btn-sm">Suspend</button>
                    )}
                    {b.is_suspended && (
                      <button onClick={() => action(b.id, 'unsuspend')} disabled={!!actionLoading}
                        className="btn btn-outline btn-sm">Reinstate</button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                  <span>📅 {b.years_in_business ? `${b.years_in_business} yrs` : 'N/A'}</span>
                  <span>🛡️ {b.is_insured ? 'Insured ✓' : 'Not confirmed'}</span>
                  <span>🗂️ {b.services?.length || 0} services</span>
                  <span>📍 {b.counties?.length || 0} counties</span>
                </div>

                {b.website_url && (
                  <a href={b.website_url} target="_blank" rel="noreferrer" className="text-sky-500 text-xs hover:underline mt-1 block">{b.website_url}</a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
