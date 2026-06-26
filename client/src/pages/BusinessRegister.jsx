import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { SERVICES, COUNTIES } from '../utils/constants';
import api from '../utils/api';

export default function BusinessRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    owner_name: '', business_name: '', email: '', password: '',
    phone: '', website_url: '', years_in_business: '',
    zip_codes: '', is_insured: false,
    services: [], counties: [],
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleList = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter((x) => x !== val)
        : [...prev[field], val],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.is_insured) { toast.error('You must confirm you carry liability insurance.'); return; }
    if (!agreedToTerms) { toast.error('Please agree to the Terms of Service to continue.'); return; }
    setLoading(true);
    try {
      const payload = { ...form, is_insured: 'true' };
      const { data } = await api.post('/auth/register/business', payload);
      login(data.token, data.user, data.business);
      toast.success('Business registered! Pending admin approval.');
      navigate('/business/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        const map = {};
        err.response.data.errors.forEach((e) => { map[e.path] = e.msg; });
        setErrors(map);
        toast.error('Please fix the errors below.');
      } else {
        toast.error(err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const CheckGroup = ({ label, field, items, cols = 2 }) => (
    <div>
      <p className="label mb-2">{label}</p>
      {errors[field] && <p className="field-error mb-1">{errors[field]}</p>}
      <div className={`grid grid-cols-${cols} gap-2 border border-gray-200 rounded-xl p-4 max-h-44 overflow-y-auto bg-gray-50`}>
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer text-sm group">
            <input
              type="checkbox"
              checked={form[field].includes(item)}
              onChange={() => toggleList(field, item)}
              className="rounded border-gray-300 text-sky-500 focus:ring-sky-400"
            />
            <span className="text-gray-700 group-hover:text-navy transition-colors">{item}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">{form[field].length} selected</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fc' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10"
           style={{ background: '#060d1a', boxShadow: '0 1px 0 rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-sky-400 font-black text-xs leading-none">BR</span>
            </div>
            <span className="text-base font-black text-white">Bid<span className="text-sky-400">Rinse</span></span>
          </Link>
          <Link to="/login" className="text-white/45 text-xs font-medium hover:text-white transition-colors">
            Already have an account? <span className="text-sky-400 font-semibold">Sign in</span>
          </Link>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-sky-200 rounded-full px-4 py-1.5 text-sm font-semibold text-sky-600 mb-5"
                 style={{ background: 'rgba(74,159,212,0.07)' }}>
              🏢 Business Registration
            </div>
            <h1 className="heading-lg text-navy">Register your cleaning business</h1>
            <p className="text-gray-500 mt-2 text-base">Free to join · Admin-approved before going live · Pay only when you win</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Section: Basic Info */}
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <span className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</span>
                  <h2 className="heading-sm text-navy">Business Info</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Owner Name *</label>
                    <input type="text" className={`input ${errors.owner_name ? 'input-error' : ''}`}
                      value={form.owner_name} onChange={set('owner_name')} required placeholder="John Smith" />
                    {errors.owner_name && <p className="field-error">{errors.owner_name}</p>}
                  </div>
                  <div>
                    <label className="label">Business Name *</label>
                    <input type="text" className={`input ${errors.business_name ? 'input-error' : ''}`}
                      value={form.business_name} onChange={set('business_name')} required placeholder="Smith's Pressure Washing" />
                    {errors.business_name && <p className="field-error">{errors.business_name}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" className={`input ${errors.email ? 'input-error' : ''}`}
                      value={form.email} onChange={set('email')} required placeholder="john@mybusiness.com" />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input type="tel" className="input" value={form.phone} onChange={set('phone')} required placeholder="(704) 555-0000" />
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <input type="password" className={`input ${errors.password ? 'input-error' : ''}`}
                      value={form.password} onChange={set('password')} required placeholder="Min. 6 characters" />
                    {errors.password && <p className="field-error">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="label">Years in Business</label>
                    <select className="input" value={form.years_in_business} onChange={set('years_in_business')}>
                      <option value="">Select…</option>
                      {['1-2','3-5','6-10','10+'].map((y) => <option key={y} value={y}>{y} years</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <label className="label">Website or Facebook URL (optional)</label>
                  <input type="url" className="input" value={form.website_url} onChange={set('website_url')} placeholder="https://" />
                </div>
              </div>

              {/* Section: Services */}
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <span className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</span>
                  <h2 className="heading-sm text-navy">Services &amp; Coverage</h2>
                </div>
                <div className="space-y-5">
                  <CheckGroup label="Services Offered *" field="services" items={SERVICES} />
                  <CheckGroup label="Counties Serviced *" field="counties" items={COUNTIES} />
                  <div>
                    <label className="label">Zip Codes Serviced</label>
                    <input type="text" className="input" value={form.zip_codes} onChange={set('zip_codes')}
                      placeholder="28031, 28036, 28115 (comma separated)" />
                    <p className="text-xs text-gray-400 mt-1">Enter all zip codes you service, separated by commas.</p>
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_insured}
                    onChange={(e) => setForm({ ...form, is_insured: e.target.checked })}
                    className="mt-0.5 rounded border-gray-300 text-sky-500 focus:ring-sky-400 w-4 h-4 flex-shrink-0"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <strong className="text-navy">I confirm I carry valid general liability insurance.</strong>{' '}
                    I understand BidRinse may request proof of insurance at any time. Businesses without valid insurance may be removed from the platform.
                  </span>
                </label>
              </div>

              {/* Terms agreement */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
                    . I understand that BidRinse is a marketplace platform only. BidRinse is not responsible for
                    disputes between my business and any customer, the outcome of any job, or any claims arising from
                    work I perform. I am solely responsible for all work completed under my business name and for
                    maintaining valid liability insurance at all times.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="btn btn-navy w-full py-4 text-base"
              >
                {loading ? 'Registering…' : 'Register My Business →'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-500 font-semibold hover:text-sky-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
