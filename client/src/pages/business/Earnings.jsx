import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BIZ_NAV } from './Dashboard';
import api from '../../utils/api';

export default function Earnings() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    api.get('/businesses/earnings')
      .then(({ data }) => { setTransactions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startOnboarding = async () => {
    setOnboarding(true);
    try {
      const { data } = await api.post('/payments/onboard');
      window.location.href = data.url;
    } catch {
      toast.error('Failed to start Stripe onboarding. Ensure STRIPE_SECRET_KEY is configured.');
      setOnboarding(false);
    }
  };

  const totals = transactions.reduce((acc, t) => ({
    gross: acc.gross + parseFloat(t.gross_amount),
    fee: acc.fee + parseFloat(t.platform_fee),
    net: acc.net + parseFloat(t.net_amount),
  }), { gross: 0, fee: 0, net: 0 });

  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthNet = thisMonth.reduce((sum, t) => sum + parseFloat(t.net_amount), 0);

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      <h1 className="text-2xl font-bold text-navy mb-6">Earnings</h1>

      {/* Stripe banner */}
      <div className="card bg-yellow-50 border border-yellow-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="font-semibold text-navy">Set Up Payouts via Stripe</h3>
            <p className="text-sm text-gray-600 mt-1">Connect your bank account to receive direct payouts.</p>
          </div>
          <button onClick={startOnboarding} disabled={onboarding} className="btn btn-primary btn-sm">
            {onboarding ? 'Redirecting…' : 'Connect Stripe →'}
          </button>
        </div>
      </div>

      {/* Summary */}
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-3xl font-bold text-sky-500">${thisMonthNet.toFixed(2)}</p>
              <p className="text-gray-500 text-sm mt-1">Earned This Month</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-green-600">${totals.net.toFixed(2)}</p>
              <p className="text-gray-500 text-sm mt-1">Total Net Earnings</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-orange-500">${totals.fee.toFixed(2)}</p>
              <p className="text-gray-500 text-sm mt-1">Total Platform Fees Paid</p>
            </div>
          </div>

          {/* Transaction list */}
          <div className="card">
            <h2 className="text-lg font-semibold text-navy mb-4">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No transactions yet. Complete jobs to see earnings here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-medium">Date</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Service</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Location</th>
                      <th className="text-right py-2 text-gray-500 font-medium">Gross</th>
                      <th className="text-right py-2 text-gray-500 font-medium">Fee (3.5%)</th>
                      <th className="text-right py-2 text-gray-500 font-medium">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                        <td className="py-3 font-medium text-navy">{t.service_type}</td>
                        <td className="py-3 text-gray-500">{t.city || t.zip_code}</td>
                        <td className="py-3 text-right">${parseFloat(t.gross_amount).toFixed(2)}</td>
                        <td className="py-3 text-right text-orange-500" title={`${t.job_type === 'commercial' ? '5%' : '3.5%'} commission`}>
                          -{t.job_type === 'commercial' ? '5%' : '3.5%'} (-${parseFloat(t.platform_fee).toFixed(2)})
                        </td>
                        <td className="py-3 text-right font-semibold text-green-600">${parseFloat(t.net_amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-3 font-semibold text-navy">Totals</td>
                      <td className="py-3 text-right font-semibold">${totals.gross.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-orange-500">-${totals.fee.toFixed(2)}</td>
                      <td className="py-3 text-right font-semibold text-green-600">${totals.net.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
