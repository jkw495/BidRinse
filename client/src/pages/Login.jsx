import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user, data.business);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'customer') navigate('/customer/dashboard');
      else if (data.user.role === 'business') navigate('/business/dashboard');
      else navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
           style={{ background: '#060d1a' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: [
                 'radial-gradient(ellipse 80% 60% at 70% -10%, rgba(14,165,233,0.22) 0%, transparent 65%)',
                 'radial-gradient(ellipse 50% 50% at 0% 90%, rgba(56,189,248,0.10) 0%, transparent 70%)',
               ].join(', '),
             }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />

        <Link to="/" className="flex items-center gap-2 relative">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="text-sky-400 font-black text-sm">BR</span>
          </div>
          <span className="text-2xl font-black text-white">Bid<span className="text-sky-400">Rinse</span></span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4"
              style={{ lineHeight: 1.1 }}>
            Clean bids.<br />
            <span style={{
              background: 'linear-gradient(100deg, #7dd3fc 0%, #38bdf8 40%, #bae6fd 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Trusted pros.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Connect with insured local exterior cleaning businesses and get competing quotes on every job.
          </p>
          <div className="space-y-3.5">
            {[
              'Post jobs free — no subscription',
              'Insured businesses only, admin-verified',
              'Address kept private until you accept',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3 text-white/75 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-sky-400 text-xs flex-shrink-0"
                      style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs relative">© {new Date().getFullYear()} BidRinse</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-sky-400 font-black text-sm">BR</span>
            </div>
            <span className="text-xl font-black text-navy">Bid<span className="text-sky-500">Rinse</span></span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="heading-md text-navy">Welcome back</h1>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div className="mt-8 space-y-2 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-sky-500 font-semibold hover:text-sky-600">
                  Sign up free
                </Link>
              </p>
              <p className="text-gray-500 text-sm">
                Cleaning business?{' '}
                <Link to="/register/business" className="text-sky-500 font-semibold hover:text-sky-600">
                  Register your business
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
