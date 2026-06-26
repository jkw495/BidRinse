import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { BIZ_NAV } from './Dashboard';
import { SERVICES, COUNTIES } from '../../utils/constants';
import api from '../../utils/api';

export default function BusinessProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/businesses/profile');
      setProfile(data);
      setForm({
        business_name: data.business_name || '',
        description: data.description || '',
        website_url: data.website_url || '',
        years_in_business: data.years_in_business || '',
        services: data.services || [],
        counties: data.counties || [],
        zip_codes: (data.zip_codes || []).join(', '),
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleList = (field, val) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter((x) => x !== val)
        : [...prev[field], val],
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/businesses/profile', form);
      toast.success('Profile updated!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    setUploading(true);
    try {
      await api.post('/businesses/photos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo uploaded!');
      load();
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <DashboardLayout navItems={BIZ_NAV} title="Business"><LoadingSpinner /></DashboardLayout>;
  if (!form) return null;

  return (
    <DashboardLayout navItems={BIZ_NAV} title="Business">
      <h1 className="text-2xl font-bold text-navy mb-6">Business Profile</h1>

      {/* Stats bar */}
      <div className="card mb-6 flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-xs text-gray-400">Rating</p>
          <StarRating rating={profile.avg_rating} count={profile.review_count} size="md" />
        </div>
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <span className={`badge ${profile.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {profile.is_approved ? 'Approved' : 'Pending Approval'}
          </span>
        </div>
        {profile.is_featured && (
          <span className="badge bg-yellow-100 text-yellow-700">⭐ Featured</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-5">
            <h2 className="font-semibold text-navy">Business Info</h2>
            <div>
              <label className="label">Business Name</label>
              <input type="text" className="input" value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[100px] resize-none" value={form.description}
                placeholder="Tell customers about your business…"
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Website / Facebook URL</label>
                <input type="url" className="input" value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://" />
              </div>
              <div>
                <label className="label">Years in Business</label>
                <select className="input" value={form.years_in_business}
                  onChange={(e) => setForm({ ...form, years_in_business: e.target.value })}>
                  <option value="">Select…</option>
                  {['1-2','3-5','6-10','10+'].map((y) => <option key={y} value={y}>{y} years</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-navy mb-3">Services Offered</h2>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map((svc) => (
                <label key={svc} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.services.includes(svc)} onChange={() => toggleList('services', svc)}
                    className="rounded border-gray-300 text-sky-400 focus:ring-sky-400" />
                  <span className="text-gray-700">{svc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-navy mb-3">Service Area</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Counties</p>
              <div className="grid grid-cols-2 gap-2">
                {COUNTIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={form.counties.includes(c)} onChange={() => toggleList('counties', c)}
                      className="rounded border-gray-300 text-sky-400 focus:ring-sky-400" />
                    <span className="text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Zip Codes (comma separated)</label>
              <input type="text" className="input" value={form.zip_codes}
                onChange={(e) => setForm({ ...form, zip_codes: e.target.value })}
                placeholder="28031, 28036, 28115" />
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn btn-primary w-full">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-navy mb-3">Business Photos</h2>
            <label className="block cursor-pointer">
              <span className="btn btn-outline w-full justify-center">
                {uploading ? 'Uploading…' : '+ Add Photo'}
              </span>
              <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
            </label>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {(profile.photos || []).map((url, i) => (
                <img key={i} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
              ))}
              {(profile.photos || []).length === 0 && (
                <p className="col-span-2 text-center text-gray-400 text-sm py-4">No photos yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
