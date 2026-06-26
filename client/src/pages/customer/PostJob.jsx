import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import { SERVICES, JOB_TYPES } from '../../utils/constants';
import api from '../../utils/api';

const navItems = [
  { path: '/customer/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/customer/post-job', icon: '➕', label: 'Post a Job' },
  { path: '/customer/jobs', icon: '📋', label: 'My Jobs' },
];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    job_type: 'residential',
    service_type: '',
    address: '', city: '', zip_code: '',
    description: '',
    preferred_date: '', preferred_time: 'flexible',
    max_quotes: 3,
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append('photo', photo);

    setLoading(true);
    try {
      const { data } = await api.post('/jobs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Job posted! Local businesses are being notified.');
      navigate(`/customer/jobs/${data.id}`);
    } catch (err) {
      if (err.response?.data?.errors) {
        const map = {};
        err.response.data.errors.forEach((e) => { map[e.path] = e.msg; });
        setErrors(map);
        toast.error('Please fill in all required fields.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to post job');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Customer">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy tracking-tight">Post a New Job</h1>
          <p className="text-gray-400 text-sm mt-1">Fill in the details and local businesses will submit quotes within 48 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Type */}
          <div className="card">
            <p className="label mb-3">Property Type *</p>
            <div className="grid grid-cols-2 gap-3">
              {JOB_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.job_type === t.value
                      ? 'border-sky-400 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="job_type"
                    value={t.value}
                    checked={form.job_type === t.value}
                    onChange={set('job_type')}
                    className="mt-0.5 accent-sky-400"
                  />
                  <div>
                    <p className="font-semibold text-navy">{t.icon} {t.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card space-y-5">
            {/* Service Type */}
            <div>
              <label className="label">Service Needed *</label>
              <select
                className={`input ${errors.service_type ? 'border-red-400' : ''}`}
                value={form.service_type}
                onChange={set('service_type')}
                required
              >
                <option value="">Select a service…</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.service_type && <p className="text-red-500 text-xs mt-1">{errors.service_type}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="label">Property Address *</label>
              <input
                type="text"
                className={`input ${errors.address ? 'border-red-400' : ''}`}
                placeholder="123 Main St"
                value={form.address}
                onChange={set('address')}
                required
              />
              <p className="text-xs text-gray-400 mt-1">🔒 Hidden from businesses until you accept a quote.</p>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input type="text" className="input" placeholder="Mooresville" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="label">Zip Code *</label>
                <input
                  type="text"
                  className={`input ${errors.zip_code ? 'border-red-400' : ''}`}
                  placeholder="28031"
                  value={form.zip_code}
                  onChange={set('zip_code')}
                  required
                />
                {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Job Description *</label>
              <textarea
                className={`input min-h-[120px] resize-none ${errors.description ? 'border-red-400' : ''}`}
                placeholder="Describe what needs to be done — size of area, current condition, any specific concerns…"
                value={form.description}
                onChange={set('description')}
                required
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Preferred Date</label>
                <input type="date" className="input" value={form.preferred_date} onChange={set('preferred_date')}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="label">Preferred Time</label>
                <select className="input" value={form.preferred_time} onChange={set('preferred_time')}>
                  <option value="flexible">Flexible</option>
                  <option value="morning">Morning (7am–12pm)</option>
                  <option value="afternoon">Afternoon (12pm–5pm)</option>
                </select>
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="label">Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Quote Limit */}
          <div className="card">
            <label className="label mb-1">Maximum Quotes to Receive *</label>
            <p className="text-xs text-gray-400 mb-4">Once this limit is reached, the job closes to new quotes. Choose fewer for a focused shortlist, more for maximum competition.</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1" max="10"
                value={form.max_quotes}
                onChange={(e) => setForm({ ...form, max_quotes: parseInt(e.target.value) })}
                className="flex-1 accent-sky-400"
              />
              <div className="w-16 h-12 bg-sky-50 border-2 border-sky-400 rounded-xl flex items-center justify-center text-2xl font-bold text-sky-500">
                {form.max_quotes}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 quote</span>
              <span>10 quotes</span>
            </div>
            {form.max_quotes <= 3 && (
              <p className="text-xs text-amber-600 mt-2">💡 Tip: Choosing fewer quotes means faster decisions but less price competition.</p>
            )}
            {form.max_quotes >= 7 && (
              <p className="text-xs text-sky-600 mt-2">💡 Tip: More quotes means better price competition — great for larger jobs.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-xl"
          >
            {loading ? 'Posting your job…' : `Post Job & Receive Up to ${form.max_quotes} Quote${form.max_quotes > 1 ? 's' : ''} →`}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
