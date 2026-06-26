import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQS = [
  { q: 'Is it really free to post a job?',             a: 'Yes. Posting a job as a homeowner is completely free. You only pay when you accept a quote and the job is completed.' },
  { q: 'How do I know businesses are insured?',         a: 'Every business confirms they carry valid liability insurance during registration. We require this as a condition of listing. Our admin team approves each business before they go live.' },
  { q: "What if I don't receive any quotes?",           a: "If your job hasn't received quotes within 72 hours, we'll notify you. You can re-post or update your job details to attract more bids." },
  { q: "Can I see a business's reviews before hiring?", a: 'Yes. All reviews come from verified, completed jobs on our platform — no fake ratings. You can read star ratings and comments before you hire anyone.' },
  { q: 'Is my address kept private?',                   a: 'Yes. Businesses only see your city and zip code until you accept their quote. Your full address is revealed only to the business you hire.' },
  { q: 'How does payment work?',                        a: 'Payments are processed securely through Stripe. Your card is only charged after the job is marked complete by the business.' },
  { q: 'What is the commission fee for businesses?',    a: 'BidRinse charges 3.5% on residential jobs and 5% on commercial jobs — only on completed jobs. No monthly fee ever.' },
  { q: 'How quickly do quotes expire?',                 a: "Quotes expire 48 hours after submission if you haven't accepted them. This keeps the marketplace fresh and responsive." },
];

const CUSTOMER_STEPS = [
  { title: 'Create a free account',      detail: 'Sign up with your name, email, and zip code. No credit card required.' },
  { title: 'Post your job',              detail: 'Select the service, enter your address, describe the job, upload a photo (optional), and set your preferred date. Takes under 2 minutes.' },
  { title: 'Businesses submit quotes',   detail: 'Local insured businesses are notified and can submit quotes within 48 hours. Each quote includes a price, message, and estimated completion time.' },
  { title: 'Review and accept',          detail: 'Compare quotes side by side, read reviews, and accept the one that best fits your budget and timeline.' },
  { title: 'Job gets done',              detail: 'The business arrives and completes the job. Once they mark it complete, you pay securely through the platform.' },
  { title: 'Leave a review',             detail: 'Rate your experience and leave a review to help other homeowners choose confidently.' },
];

const BIZ_STEPS = [
  { title: 'Register your business',     detail: 'Create a profile with your services, service area, years in business, and website. Confirm your insurance coverage.' },
  { title: 'Get admin-approved',         detail: 'Our team reviews your application and approves you within 1 business day. This keeps the platform quality high.' },
  { title: 'Receive instant job alerts', detail: "When a homeowner posts a job matching your services and service area, you're notified immediately by text and email." },
  { title: 'Submit competitive quotes',  detail: 'Enter your price, write a message to the customer, and estimate your completion timeline. Your rating is displayed to help you win.' },
  { title: 'Win the job',               detail: "If the customer accepts your quote, you get their full address and contact info. Other businesses are notified the job is filled." },
  { title: 'Complete & get paid',        detail: "Mark the job complete in your dashboard. Payment is released minus the BidRinse commission. That's it." },
];

function StepList({ steps, accentClass }) {
  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <div key={s.title} className="flex gap-5 items-start animate-fade-in">
          <div className={`flex-shrink-0 w-10 h-10 ${accentClass} text-white rounded-full flex items-center justify-center font-bold text-sm`}
               style={{ boxShadow: accentClass.includes('sky') ? '0 3px 12px rgba(74,159,212,0.35)' : '0 3px 12px rgba(27,58,92,0.3)' }}>
            {i + 1}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex-1"
               style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 className="font-semibold text-navy mb-1">{s.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const [tab, setTab]       = useState('customer');
  const [openFaq, setOpenFaq] = useState(null);

  const isCustomer = tab === 'customer';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />

      {/* ── Hero — dark aurora ──────────────────────────── */}
      <section className="relative overflow-hidden text-white"
               style={{ background: '#060d1a', minHeight: 'min(56vh, 520px)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: [
                 'radial-gradient(ellipse 70% 60% at 55% -15%, rgba(14,165,233,0.20) 0%, transparent 65%)',
                 'radial-gradient(ellipse 40% 35% at 10% 90%, rgba(56,189,248,0.09) 0%, transparent 70%)',
               ].join(', '),
             }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />

        <div className="page-container pt-32 pb-20 md:pt-44 md:pb-24 relative text-center">
          <div className="inline-flex items-center gap-2 border border-white/15 rounded-full
                          px-4 py-1.5 text-sm font-medium text-sky-300 mb-8 backdrop-blur-sm"
               style={{ background: 'rgba(255,255,255,0.06)' }}>
            Simple &amp; Transparent
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5"
              style={{ lineHeight: 1.04 }}>
            How <span className="gradient-text">BidRinse</span> works
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            Built for both homeowners and cleaning businesses — simple, transparent, and fair.
          </p>
        </div>
      </section>

      {/* ── Steps ──────────────────────────────────────── */}
      <section className="section">
        <div className="page-container max-w-4xl mx-auto">

          {/* Tab toggle */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setTab('customer')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isCustomer
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                🏠 For Homeowners
              </button>
              <button
                onClick={() => setTab('business')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  !isCustomer
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                🏢 For Businesses
              </button>
            </div>
          </div>

          {/* Step heading */}
          <div className="text-center mb-10">
            {isCustomer ? (
              <>
                <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-2">For Homeowners</p>
                <h2 className="heading-lg text-navy">Get quotes in 6 easy steps</h2>
              </>
            ) : (
              <>
                <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-2">For Businesses</p>
                <h2 className="heading-lg text-navy">Start winning local jobs</h2>
              </>
            )}
          </div>

          {isCustomer ? (
            <StepList steps={CUSTOMER_STEPS} accentClass="bg-sky-500" />
          ) : (
            <StepList steps={BIZ_STEPS} accentClass="bg-navy" />
          )}

          <div className="mt-12 text-center">
            {isCustomer ? (
              <Link to="/register" className="btn btn-primary btn-lg">Post Your First Job Free →</Link>
            ) : (
              <Link to="/register/business" className="btn btn-navy btn-lg">Claim Your Founding Spot →</Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ — accordion ────────────────────────────── */}
      <section className="section-alt">
        <div className="page-container max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">FAQ</p>
            <h2 className="heading-lg text-navy">Frequently asked questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q}
                   className="bg-white rounded-2xl border overflow-hidden transition-all duration-200"
                   style={{ borderColor: openFaq === i ? 'rgba(74,159,212,0.3)' : '#f3f4f6',
                            boxShadow: openFaq === i ? '0 0 0 1px rgba(74,159,212,0.12), 0 4px 16px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                >
                  <span className="font-semibold text-navy text-sm leading-snug">{f.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openFaq === i ? 'bg-sky-100 text-sky-500 rotate-180' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 -mt-1 animate-fade-in">
                    <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────── */}
      <section className="section relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050b16 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0"
             style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.25), transparent)' }} />

        <div className="page-container text-center relative">
          <h2 className="heading-lg text-white mb-4">Ready to get started?</h2>
          <p className="text-white/45 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Post your first job free. Insured pros will compete for your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn btn-primary btn-xl"
                  style={{ boxShadow: '0 0 28px rgba(56,189,248,0.28), 0 4px 16px rgba(74,159,212,0.38), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
              Get Free Quotes
            </Link>
            <Link to="/register/business" className="btn btn-ghost-white btn-xl">
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
