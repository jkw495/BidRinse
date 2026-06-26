import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BENEFITS = [
  { icon: '📬', title: 'Jobs Come Directly to You',    desc: "Stop chasing leads. When homeowners post jobs in your area, you get an instant text and email alert. Submit a quote in seconds." },
  { icon: '🆓', title: 'Free to Join',                 desc: 'No monthly subscription. No upfront fees. Create your profile and start quoting for free — forever.' },
  { icon: '💰', title: 'Only Pay When You Win',        desc: "We charge a small commission only on completed jobs. 3.5% residential, 5% commercial. If you don't win, you pay nothing." },
  { icon: '⭐', title: 'Build Your Reputation',        desc: 'Collect verified reviews from real completed jobs. Your star rating is shown to every homeowner comparing quotes.' },
  { icon: '📍', title: 'Your Territory Only',          desc: 'Set exact counties and zip codes you serve. You only see jobs where you actually work — no wasted alerts.' },
  { icon: '🔒', title: 'Secure Stripe Payments',       desc: 'Get paid securely through Stripe Connect. No chasing invoices, no payment disputes, no headaches.' },
];

const STANDARD_FEATURES = [
  'Unlimited job alerts (text + email)',
  'Submit unlimited quotes',
  'Business profile page',
  'Collect verified reviews',
  '3.5% fee on residential jobs',
  '5% fee on commercial jobs',
];

const FEATURED_FEATURES = [
  'Everything in Standard',
  'Featured badge on your profile',
  'Priority placement in quote lists',
  'Highlighted in search results',
];

const REGISTER_STEPS = [
  { n: '1', title: 'Register',       detail: 'Takes under 2 minutes' },
  { n: '2', title: 'Get Approved',   detail: 'Admin reviews in ~1 day' },
  { n: '3', title: 'Start Quoting',  detail: 'Win local jobs immediately' },
];

function FeatureList({ features }) {
  return (
    <ul className="space-y-3 mb-8">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
          <span className="w-5 h-5 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sky-500 text-[10px] font-black">✓</span>
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function ForBusinesses() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />

      {/* ── Hero — dark aurora ──────────────────────────── */}
      <section className="relative overflow-hidden text-white"
               style={{ background: '#060d1a', minHeight: 'min(76vh, 720px)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: [
                 'radial-gradient(ellipse 75% 60% at 65% -10%, rgba(14,165,233,0.22) 0%, transparent 65%)',
                 'radial-gradient(ellipse 40% 40% at 0% 85%, rgba(56,189,248,0.09) 0%, transparent 70%)',
               ].join(', '),
             }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />

        <div className="page-container pt-32 pb-24 md:pt-44 md:pb-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-white/15 rounded-full
                            px-4 py-1.5 text-sm font-medium text-sky-300 mb-8 backdrop-blur-sm"
                 style={{ background: 'rgba(255,255,255,0.06)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              For Exterior Cleaning Businesses
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6"
                style={{ lineHeight: 1.04 }}>
              Stop chasing leads.{' '}
              <span className="gradient-text">Let jobs come to you.</span>
            </h1>

            <p className="text-xl text-white/50 mb-10 max-w-2xl leading-relaxed">
              BidRinse connects you directly with homeowners who are ready to hire.
              Free to join — pay only when you win a job.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register/business" className="btn btn-primary btn-xl"
                    style={{ boxShadow: '0 0 28px rgba(56,189,248,0.3), 0 4px 16px rgba(74,159,212,0.4), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                Claim Your Founding Spot →
              </Link>
              <Link to="/how-it-works" className="btn btn-ghost-white btn-xl">
                See How It Works
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-9 text-sm text-white/35">
              <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> Free to join</span>
              <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> No monthly fees</span>
              <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> Pay only when you win</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────── */}
      <section className="section">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">Why Join</p>
            <h2 className="heading-lg text-navy">Why cleaning businesses choose BidRinse</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card-hover p-7">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                     style={{ background: 'linear-gradient(135deg, rgba(74,159,212,0.13), rgba(27,58,92,0.07))' }}>
                  {b.icon}
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────── */}
      <section className="section-alt">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">Pricing</p>
            <h2 className="heading-lg text-navy">Simple, fair pricing</h2>
            <p className="text-gray-500 mt-3 text-lg">No surprises. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Standard */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8"
                 style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="mb-6">
                <h3 className="font-bold text-navy text-lg mb-1">Standard</h3>
                <p className="text-gray-400 text-sm">Everything you need to start winning</p>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-extrabold text-navy leading-none">Free</span>
                <span className="text-gray-400 text-sm mb-1">to join &amp; quote</span>
              </div>
              <FeatureList features={STANDARD_FEATURES} />
              <Link to="/register/business" className="btn btn-outline w-full justify-center">
                Get Started Free
              </Link>
            </div>

            {/* Featured */}
            <div className="relative bg-white rounded-2xl border-2 border-sky-300 p-8"
                 style={{ boxShadow: '0 4px 24px rgba(74,159,212,0.18), 0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <span className="text-white text-xs font-bold px-4 py-1.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2d8fc8, #52aee0)', boxShadow: '0 2px 8px rgba(74,159,212,0.35)' }}>
                  FOUNDING OFFER
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-navy text-lg mb-1">Featured</h3>
                <p className="text-gray-400 text-sm">Priority placement, more wins</p>
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-extrabold text-sky-500 leading-none">$29</span>
                <span className="text-gray-400 text-sm mb-1">/month</span>
              </div>
              <FeatureList features={FEATURED_FEATURES} />
              <Link to="/register/business" className="btn btn-primary w-full justify-center">
                Start with Featured →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── After register — visual timeline ───────────── */}
      <section className="section">
        <div className="page-container max-w-3xl mx-auto text-center">
          <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">Getting Started</p>
          <h2 className="heading-lg text-navy mb-3">After you register</h2>
          <p className="text-gray-500 mb-14 text-lg">
            Our admin team reviews every application to keep quality high.
          </p>

          <div className="relative flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
            {/* Connecting line behind the circles */}
            <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-px"
                 style={{ background: 'linear-gradient(90deg, #BEE0F4 0%, #EAF4FB 50%, #BEE0F4 100%)' }} />

            {REGISTER_STEPS.map((s, i) => (
              <div key={s.n} className="relative flex-1 flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center mb-4 relative z-10"
                     style={{ background: 'linear-gradient(180deg, #52aee0 0%, #2d8fc8 100%)', boxShadow: '0 4px 16px rgba(74,159,212,0.38)' }}>
                  {s.n}
                </div>
                <h3 className="font-semibold text-navy mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.detail}</p>
                {/* Mobile arrow between steps */}
                {i < 2 && (
                  <div className="md:hidden text-gray-200 text-2xl mt-4 mb-0">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA — dark glass ──────────────────────── */}
      <section className="section relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050b16 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />
        <div className="absolute top-0 inset-x-0"
             style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.25), transparent)' }} />

        <div className="page-container text-center relative">
          <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-4">Get Started Today</p>
          <h2 className="heading-lg text-white mb-4">Ready to grow your business?</h2>
          <p className="text-white/45 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Join BidRinse free today. No contracts. No setup fees. Cancel anytime.
          </p>
          <Link to="/register/business" className="btn btn-primary btn-xl"
                style={{ boxShadow: '0 0 28px rgba(56,189,248,0.28), 0 4px 16px rgba(74,159,212,0.38), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
            Create Your Free Business Profile →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
