import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { JOB_STATUS_LABELS, QUOTE_STATUS_LABELS, JOB_TYPE_BADGES, SERVICE_ICONS } from '../../utils/constants';
import api from '../../utils/api';

const navItems = [
  { path: '/customer/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/customer/post-job',  icon: '➕', label: 'Post a Job' },
  { path: '/customer/jobs',      icon: '📋', label: 'My Jobs' },
];

export default function JobDetail() {
  const { id } = useParams();
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [accepting, setAccepting]     = useState(null);
  const [review, setReview]           = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const load = async () => {
    try {
      const [jobRes, reviewRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/reviews/job/${id}`),
      ]);
      setData(jobRes.data);
      if (reviewRes.data) setExistingReview(reviewRes.data);
    } catch {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const acceptQuote = async (quoteId) => {
    setAccepting(quoteId);
    try {
      await api.put(`/quotes/${quoteId}/accept`);
      toast.success('Quote accepted! The business will be notified.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept quote');
    } finally {
      setAccepting(null);
    }
  };

  const submitReview = async () => {
    if (!review.rating) { toast.error('Please select a star rating'); return; }
    setReviewLoading(true);
    try {
      await api.post('/reviews', { job_id: parseInt(id), ...review });
      toast.success('Review submitted!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <DashboardLayout navItems={navItems} title="Customer"><LoadingSpinner /></DashboardLayout>;
  if (!data)   return <DashboardLayout navItems={navItems} title="Customer"><p className="text-red-500">Job not found.</p></DashboardLayout>;

  const { job, quotes } = data;
  const st = JOB_STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-600' };
  const activeQuotes = quotes.filter((q) => q.status !== 'expired');

  return (
    <DashboardLayout navItems={navItems} title="Customer">

      {/* Job header card */}
      <div className="card mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
            {SERVICE_ICONS[job.service_type] || '🏠'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-navy leading-tight">{job.service_type}</h1>
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              <span className={`badge ${st.color}`}>{st.label}</span>
              {job.job_type && (
                <span className={`badge capitalize ${JOB_TYPE_BADGES[job.job_type] || 'bg-gray-100 text-gray-600'}`}>
                  {job.job_type === 'commercial' ? '🏢' : '🏠'} {job.job_type}
                </span>
              )}
            </div>
          </div>
          {job.max_quotes && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 mb-0.5">Quotes</p>
              <p className="font-bold text-navy tabular-nums">{activeQuotes.length} / {job.max_quotes}</p>
            </div>
          )}
        </div>

        {job.photo_url && (
          <img src={job.photo_url} alt="Job" className="w-full max-h-56 object-cover rounded-2xl mb-5" />
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
            <p className="font-medium text-gray-800">{job.address}</p>
            <p className="text-gray-500">{job.city}{job.city && ','} {job.zip_code}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Date</p>
            <p className="font-medium text-gray-800">
              {job.preferred_date ? new Date(job.preferred_date).toLocaleDateString() : 'Flexible'}
              {job.preferred_time && job.preferred_time !== 'flexible' && (
                <span className="text-gray-500 font-normal"> ({job.preferred_time})</span>
              )}
            </p>
          </div>
        </div>

        {job.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
          </div>
        )}
      </div>

      {/* Quotes section */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-navy mb-4">
          {quotes.length === 0 ? 'Quotes' : `${quotes.length} Quote${quotes.length !== 1 ? 's' : ''} Received`}
        </h2>

        {quotes.length === 0 && job.status === 'pending' && (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p className="empty-state-title">Waiting for quotes…</p>
            <p className="empty-state-desc">
              Local businesses in your area have been notified. Quotes typically arrive within a few hours.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {quotes.map((q) => {
            const qst = QUOTE_STATUS_LABELS[q.status] || { label: q.status, color: 'bg-gray-100 text-gray-600' };
            const isAccepted = q.status === 'accepted';
            const canAccept  = job.status === 'quotes_received' && q.status === 'pending';

            return (
              <div key={q.id}
                   className={`card border-2 transition-all duration-150 ${
                     isAccepted
                       ? 'border-green-300 bg-green-50/60'
                       : 'border-gray-100 hover:-translate-y-0.5'
                   }`}>
                {/* Business header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    {q.is_featured && (
                      <span className="badge bg-yellow-100 text-yellow-700 mb-1.5 block w-fit">⭐ Featured</span>
                    )}
                    <h3 className="font-bold text-navy text-lg leading-tight">{q.business_name}</h3>
                    <StarRating rating={q.avg_rating} count={q.review_count} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-3xl font-extrabold text-sky-500 leading-none tabular-nums">
                      ${parseFloat(q.amount).toFixed(2)}
                    </p>
                    {q.estimated_completion_time && (
                      <p className="text-xs text-gray-400 mt-1">⏱ {q.estimated_completion_time}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                {q.message && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    {q.message}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${qst.color}`}>{qst.label}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canAccept && (
                      <button
                        onClick={() => acceptQuote(q.id)}
                        disabled={accepting === q.id}
                        className="btn btn-primary btn-sm"
                      >
                        {accepting === q.id ? 'Accepting…' : 'Accept Quote ✓'}
                      </button>
                    )}
                    {isAccepted && (
                      <span className="badge bg-green-100 text-green-700 font-semibold">✓ Accepted</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review section — only after completion */}
      {job.status === 'completed' && !existingReview && (
        <div className="card border-2 border-sky-100 bg-sky-50/60">
          <h2 className="font-bold text-navy mb-4">Leave a Review</h2>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Rating *</p>
            <StarRating
              rating={review.rating}
              size="lg"
              interactive
              onChange={(r) => setReview({ ...review, rating: r })}
            />
          </div>
          <div className="mb-4">
            <textarea
              className="input min-h-[80px] resize-none"
              placeholder="How was your experience? (optional)"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
          </div>
          <button onClick={submitReview} disabled={reviewLoading} className="btn btn-primary">
            {reviewLoading ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      )}

      {existingReview && (
        <div className="card border border-green-200 bg-green-50/50">
          <h2 className="font-semibold text-navy mb-2">Your Review</h2>
          <StarRating rating={existingReview.rating} size="md" />
          {existingReview.comment && (
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{existingReview.comment}</p>
          )}
        </div>
      )}

    </DashboardLayout>
  );
}
