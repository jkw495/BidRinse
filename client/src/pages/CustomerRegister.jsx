import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function CustomerRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', zip_code: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) { toast.error('Please agree to the Terms of Service to continue.'); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register/customer', form);
      login(data.token, data.user);
      toast.success('Account created! Welcome to BidRinse.');
      navigate('/customer/post-job');
    } catch (err) {
      if (err.response?.data?.errors) {
        const map = {};
        err.response.data.errors.forEach((e) => { map[e.path] = e.msg; });
        setErrors(map);
      } else {
        toast.error(err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder = '', hint = '' }) => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className={`input ${errors[name] ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={form[name]}
        onChange={set(name)}
        required
      />
      {hint && !errors[name] && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
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
          <p className="text-sky-400 font-bold text-xs uppercase tracking-[0.12em] mb-3">For Homeowners</p>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-6"
              style={{ lineHeight: 1.1 }}>
            Competing quotes from local cleaning pros —{' '}
            <span style={{
              background: 'linear-gradient(100deg, #7dd3fc 0%, #38bdf8 40%, #bae6fd 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>free</span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: '🆓', text: 'Free to post a job, no subscription' },
              { icon: '🛡️', text: 'Insured, admin-approved businesses only' },
              { icon: '🔒', text: 'Your address stays private until you accept' },
              { icon: '⭐', text: 'Read verified reviews before you hire' },
            ].map((t) => (
              <div key={t.text} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: 'rgba(74,159,212,0.12)', border: '1px solid rgba(74,159,212,0.2)' }}>
                  {t.icon}
                </span>
                <p className="text-white/70 text-sm leading-relaxed pt-1">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs relative">© {new Date().getFullYear()} BidRinse</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-sky-400 font-black text-sm">BR</span>
            </div>
            <span className="text-xl font-black text-navy">Bid<span className="text-sky-500">Rinse</span></span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-7">
                <h1 className="heading-md text-navy">Create your free account</h1>
                <p className="text-gray-500 mt-1 text-sm">Start getting quotes in under 2 minutes.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field name="name"     label="Full Name"     placeholder="Jane Smith" />
                <Field name="email"    label="Email Address" type="email" placeholder="jane@example.com" />
                <Field name="password" label="Password"      type="password" placeholder="Min. 6 characters" />
                <Field name="phone"    label="Phone Number"  type="tel" placeholder="(704) 555-0000" />
                <Field name="zip_code" label="Zip Code"      placeholder="28031" hint="Used to match you with local businesses." />

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-sky-500 focus:ring-sky-400 w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I have read and agree to the{' '}
                      <Link to="/terms" target="_blank" className="text-sky-500 font-semibold hover:text-sky-600 hover:underline">
                        Terms of Service &amp; Platform Disclaimer
                      </Link>
                      . I understand that BidRinse is a marketplace platform only and is not responsible for the
                      quality of work, disputes between myself and any business, or the actions of any business I hire.
                      I am responsible for vetting any business before hiring them.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="btn btn-primary w-full mt-2"
                >
                  {loading ? 'Creating account…' : 'Create Free Account →'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-sky-500 font-semibold hover:text-sky-600">Sign in</Link>
                </p>
                <p className="text-gray-500 text-sm">
                  Own a cleaning business?{' '}
                  <Link to="/register/business" className="text-sky-500 font-semibold hover:text-sky-600">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
