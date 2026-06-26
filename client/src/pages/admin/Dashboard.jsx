import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

export const ADMIN_NAV = [
  { path: '/admin',             icon: '📊', label: 'Dashboard' },
  { path: '/admin/businesses',  icon: '🏢', label: 'Businesses' },
  { path: '/admin/customers',   icon: '👥', label: 'Customers' },
  { path: '/admin/jobs',        icon: '📋', label: 'Jobs' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin">
      <h1 className="text-2xl font-bold text-navy mb-6">Admin Dashboard</h1>

      {loading ? <LoadingSpinner /> : stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Businesses', value: stats.total_businesses, color: 'text-navy', path: '/admin/businesses' },
              { label: 'Customers', value: stats.total_customers, color: 'text-sky-500', path: '/admin/customers' },
              { label: 'Total Jobs', value: stats.total_jobs, color: 'text-gray-700', path: '/admin/jobs' },
              { label: 'Completed Jobs', value: stats.completed_jobs, color: 'text-green-600', path: '/admin/jobs?status=completed' },
              { label: 'Platform Revenue', value: `$${parseFloat(stats.total_revenue).toFixed(2)}`, color: 'text-yellow-600', path: '/admin' },
              { label: 'Completion Rate', value: stats.total_jobs > 0 ? `${Math.round((stats.completed_jobs / stats.total_jobs) * 100)}%` : '—', color: 'text-purple-600', path: '/admin' },
            ].map((s) => (
              <Link key={s.label} to={s.path} className="card text-center hover:shadow-md transition-shadow">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-semibold text-navy mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/admin/businesses?status=pending" className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <p className="font-medium text-navy">Pending Business Approvals</p>
                    <p className="text-xs text-gray-500">Review and approve new business registrations</p>
                  </div>
                </Link>
                <Link to="/admin/jobs?status=pending" className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-medium text-navy">Active Pending Jobs</p>
                    <p className="text-xs text-gray-500">Jobs waiting for quotes</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-navy mb-4">Revenue Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Total platform revenue (fees collected)</span>
                  <span className="font-bold text-yellow-600">${parseFloat(stats.total_revenue).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Jobs completed</span>
                  <span className="font-semibold">{stats.completed_jobs}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Avg. fee per job</span>
                  <span className="font-semibold">
                    {stats.completed_jobs > 0 ? `$${(stats.total_revenue / stats.completed_jobs).toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
