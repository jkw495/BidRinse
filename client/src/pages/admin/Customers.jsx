import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ADMIN_NAV } from './Dashboard';
import api from '../../utils/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState(null);

  const load = () => {
    api.get('/admin/customers')
      .then(({ data }) => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (id) => {
    setToggling(id);
    try {
      const { data } = await api.put(`/admin/customers/${id}/toggle`);
      toast.success(data.is_active ? 'Customer reactivated' : 'Customer deactivated');
      load();
    } catch {
      toast.error('Failed to update');
    } finally {
      setToggling(null);
    }
  };

  const filtered = customers.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-navy">Customers <span className="text-gray-400 text-lg">({customers.length})</span></h1>
        <input
          type="search"
          placeholder="Search by name or email…"
          className="input max-w-xs py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Phone</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Zip</th>
                <th className="text-center py-3 px-2 text-gray-500 font-medium">Jobs</th>
                <th className="text-center py-3 px-2 text-gray-500 font-medium">Status</th>
                <th className="text-center py-3 px-2 text-gray-500 font-medium">Joined</th>
                <th className="text-center py-3 px-2 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No customers found</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-navy">{c.name}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">{c.email}</td>
                    <td className="py-3 px-2 text-gray-500">{c.phone || '—'}</td>
                    <td className="py-3 px-2 text-gray-500">{c.zip_code || '—'}</td>
                    <td className="py-3 px-2 text-center">{c.job_count}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`badge ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-400 text-xs">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => toggleActive(c.id)}
                        disabled={toggling === c.id}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors disabled:opacity-60 ${
                          c.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {toggling === c.id ? '…' : c.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
