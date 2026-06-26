import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SERVICES, SERVICE_ICONS } from '../utils/constants';

/* ── Data ──────────────────────────────────────────────── */
const QUOTES_PREVIEW = [
  { name: "Smith's Pressure Washing", stars: 5, rating: '4.9', price: '$175', best: false },
  { name: 'Lake Norman Pro',          stars: 5, rating: '5.0', price: '$160', best: true  },
  { name: 'Carolina Wash Co.',        stars: 4, rating: '4.7', price: '$190', best: false },
];

const STATS = [
  { value: '500+', label: 'Jobs posted' },
  { value: '50+',  label: 'Verified businesses' },
  { value: '11',   label: 'Counties served' },
  { value: '4.9★', label: 'Avg business rating' },
];

const CUSTOMER_STEPS = [
  { n: '1', title: 'Post your job free',    desc: 'Describe what needs cleaning, your property type, and preferred date. Takes under 2 minutes.' },
  { n: '2', title: 'Get competing quotes',  desc: 'Insured local businesses in your area are notified instantly and submit their best price.' },
  { n: '3', title: 'Pick the best fit',     desc: 'Compare quotes, read verified reviews, and hire the pro that fits your budget.' },
];

const TRUST = [
  { icon: '🛡️', title: 'Insured Businesses Only',    desc: 'Every business confirms active liability insurance before being approved to list.' },
  { icon: '⭐', title: 'Real Verified Reviews',       desc: 'Reviews only come from completed, confirmed jobs — zero fake ratings possible.' },
  { icon: '🔒', title: 'Address Privacy',             desc: 'Your full address stays hidden until you actually accept a quote from a business.' },
  { icon: '💳', title: 'Secure Stripe Payments',     desc: 'Payment is only released after the job is marked complete — never before.' },
];

/* ── Floating hero preview card ────────────────────────── */
function HeroPreview() {
  return (
    <div className="hidden lg:block animate-float">
      <div className="bg-white rounded-3xl overflow-hidden"
           style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)' }}>

        {/* Card header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #daeef9 0%, #c4e3f5 100%)' }}>
            🏠
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-navy text-sm leading-tight">Pressure Washing</p>
            <p className="text-xs text-gray-400 mt-0.5">Mooresville, NC 28031</p>
          </div>
          <span className="text-[11px] bg-sky-50 text-sky-600 font-semibold px-2.5 py-1 rounded-full border border-sky-100 flex-shrink-0">
            Residential
          </span>
        </div>

        {/* Quotes */}
        <div className="p-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.14em] mb-3">
            3 Competing Quotes
          </p>
          <div className="space-y-2">
            {QUOTES_PREVIEW.map((q) => (
              <div key={q.name}
                   className={`flex items-center justify-between px-4 py-3 rounded-2xl ${
                     q.best
                       ? 'bg-green-50 border-2 border-green-200'
                       : 'bg-gray-50 border border-gray-100'
                   }`}>
                <div>
                  <p className={`text-sm font-semibold leading-tight ${q.best ? 'text-green-800' : 'text-gray-800'}`}>
                    {q.name}
                  </p>
                  <p className="text-xs mt-0.5">
                    <span className="text-amber-400">{'★'.repeat(q.stars)}{'☆'.repeat(5 - q.stars)}</span>
                    {' '}<span className="text-gray-400">{q.rating}</span>
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className={`text-base font-bold ${q.best ? 'text-green-600' : 'text-gray-600'}`}>{q.price}</p>
                  {q.best && <p className="text-[10px] text-green-500 font-semibold">Best value</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 py-3.5 rounded-2xl text-white text-sm font-bold text-center cursor-default select-none"
               style={{ background: 'linear-gradient(180deg, #52aee0 0%, #2d8fc8 100%)', boxShadow: '0 4px 14px rgba(74,159,212,0.4)' }}>
            Accept Best Quote — $160 ✓
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white"
               style={{ background: '#060d1a', minHeight: '100vh' }}>
        {/* Aurora gradient layers */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: [
                 'radial-gradient(ellipse 80% 60% at 75% -5%, rgba(14,165,233,0.22) 0%, transparent 65%)',
                 'radial-gradient(ellipse 45% 45% at 5% 75%, rgba(56,189,248,0.10) 0%, transparent 70%)',
                 'radial-gradient(ellipse 60% 80% at 50% 30%, rgba(6,13,26,0.7) 0%, transparent 100%)',
               ].join(', '),
             }} />
        {/* Dot-grid texture */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />

        <div className="page-container pt-28 pb-24 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 xl:gap-20 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 border border-white/15 rounded-full
                              px-4 py-1.5 text-sm font-medium text-sky-300 mb-8 backdrop-blur-sm"
                   style={{ background: 'rgba(255,255,255,0.06)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                Serving 11 counties across NC &amp; SC
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-balance"
                  style={{ lineHeight: 1.04 }}>
                Get competing quotes from{' '}
                <span className="gradient-text">local cleaning pros</span>
              </h1>

              <p className="text-xl text-white/50 mb-10 max-w-lg leading-relaxed">
                Post your job free. Insured businesses compete for your work. You choose the best price — no pressure, no hassle.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="btn btn-primary btn-xl"
                      style={{ boxShadow: '0 0 28px rgba(56,189,248,0.3), 0 4px 16px rgba(74,159,212,0.4), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                  Get Free Quotes →
                </Link>
                <Link to="/register/business" className="btn btn-ghost-white btn-xl">
                  List Your Business
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-9 text-sm text-white/35">
                <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> Free to post</span>
                <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> No obligation</span>
                <span className="flex items-center gap-1.5"><span className="text-sky-400">✓</span> Insured pros only</span>
              </div>
            </div>

            {/* Right: floating preview card */}
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ── Stats bar — dark glass, seamless with hero ─────── */}
      <section className="border-b border-white/5 py-8"
               style={{ background: 'rgba(5,11,22,0.97)' }}>
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-center gap-y-5">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && <div className="hidden sm:block w-px h-10 mx-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }} />}
                <div className="text-center px-6 sm:px-0">
                  <p className="gradient-text text-[1.85rem] font-extrabold tabular-nums leading-none">{s.value}</p>
                  <p className="text-xs font-medium text-white/35 uppercase tracking-wider mt-1.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient separator — dark to white */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.25), transparent)' }} />

      {/* ── How it works ───────────────────────────────────── */}
      <section className="section">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">For Homeowners</p>
            <h2 className="heading-lg text-navy">Get quotes in 3 simple steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CUSTOMER_STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px"
                       style={{ background: 'linear-gradient(90deg, #BEE0F4, #EAF4FB)' }} />
                )}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-5"
                       style={{ background: 'linear-gradient(180deg, #52aee0 0%, #2d8fc8 100%)', boxShadow: '0 4px 16px rgba(74,159,212,0.38)' }}>
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-navy text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register" className="btn btn-primary btn-lg">Post Your Job Free →</Link>
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section className="section-alt">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">14 Services</p>
            <h2 className="heading-lg text-navy">Everything exterior, one platform</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SERVICES.map((svc) => (
              <div key={svc}
                   className="bg-white rounded-2xl border border-gray-100 p-4 text-center group
                              cursor-default transition-all duration-200 hover:border-sky-200 hover:-translate-y-0.5 hover:shadow-md"
                   style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2.5
                                transition-transform duration-200 group-hover:scale-110"
                     style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                  {SERVICE_ICONS[svc]}
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">{svc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Businesses — bento grid ────────────────────── */}
      <section className="section">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: copy + steps */}
            <div>
              <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-3">For Cleaning Businesses</p>
              <h2 className="heading-lg text-navy mb-4">Jobs come to you</h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Stop cold calling and chasing leads. When homeowners post jobs in your service area, you get notified instantly. Submit a quote in seconds.
              </p>

              <div className="space-y-5 mb-10">
                {[
                  { n: '1', title: 'Create your free profile',   desc: 'List your services, service area, and insurance confirmation.' },
                  { n: '2', title: 'Get instant SMS job alerts',  desc: 'Notified the moment a matching job is posted in your territory.' },
                  { n: '3', title: 'Quote, win, get paid',        desc: 'Submit your price, win the job, complete the work.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
                         style={{ boxShadow: '0 2px 10px rgba(27,58,92,0.3)' }}>
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy mb-0.5">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register/business" className="btn btn-navy btn-lg">
                Claim Your Founding Spot →
              </Link>
            </div>

            {/* Right: bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Wide: Free to Join */}
              <div className="sm:col-span-2 card-hover p-7 flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ background: 'linear-gradient(135deg, rgba(74,159,212,0.14), rgba(27,58,92,0.08))' }}>
                  🆓
                </div>
                <div>
                  <h3 className="font-bold text-navy text-base mb-1.5">Free to Join</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    No monthly fees, no setup costs. Pay only a small commission when you actually win a job. Zero risk to get started.
                  </p>
                </div>
              </div>

              {/* Narrow: SMS Alerts */}
              <div className="card-hover p-6 flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4"
                     style={{ background: 'linear-gradient(135deg, rgba(74,159,212,0.14), rgba(27,58,92,0.08))' }}>
                  📱
                </div>
                <h3 className="font-semibold text-navy mb-1.5">Instant SMS Alerts</h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">Get a text the moment a matching job posts in your area.</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-3 py-1.5 text-xs text-green-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                  Real-time
                </div>
              </div>

              {/* Narrow: Reputation */}
              <div className="card-hover p-6 flex flex-col">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4"
                     style={{ background: 'linear-gradient(135deg, rgba(74,159,212,0.14), rgba(27,58,92,0.08))' }}>
                  ⭐
                </div>
                <h3 className="font-semibold text-navy mb-1.5">Build Reputation</h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">Collect verified reviews from every completed job. Your rating is shown to all customers.</p>
                <div className="mt-4 flex items-center gap-0.5">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i} className="text-amber-400 text-base leading-none">{star}</span>
                  ))}
                  <span className="text-[11px] text-gray-400 ml-1.5 font-medium">Verified</span>
                </div>
              </div>

              {/* Wide: Pricing */}
              <div className="sm:col-span-2 card-hover p-7">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, rgba(74,159,212,0.14), rgba(27,58,92,0.08))' }}>
                    💰
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-base mb-1">Transparent Pricing</h3>
                    <p className="text-gray-500 text-sm">One small fee, only when you win. No monthly costs, ever.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-sky-50 rounded-2xl p-4 border border-sky-100 text-center">
                    <p className="text-3xl font-extrabold text-sky-600 leading-none tabular-nums">3.5%</p>
                    <p className="text-sm text-gray-500 mt-1.5 font-medium">Residential</p>
                  </div>
                  <div className="flex-1 bg-navy-50 rounded-2xl p-4 border border-navy-100 text-center">
                    <p className="text-3xl font-extrabold text-navy leading-none tabular-nums">5%</p>
                    <p className="text-sm text-gray-500 mt-1.5 font-medium">Commercial</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Gradient separator — white to dark */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.18), transparent)' }} />

      {/* ── Trust — dark glass section ──────────────────────── */}
      <section className="section relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050b16 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(14,165,233,0.1) 0%, transparent 70%)',
             }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)',
               backgroundSize: '28px 28px',
             }} />

        <div className="page-container relative">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-white">Built on trust</h2>
            <p className="text-white/45 text-lg mt-3 max-w-xl mx-auto leading-relaxed">
              Every safeguard is here so you can hire with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST.map((t) => (
              <div key={t.title} className="glass-card p-6 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                     style={{
                       background: 'rgba(74,159,212,0.12)',
                       border: '1px solid rgba(74,159,212,0.2)',
                     }}>
                  {t.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{t.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA — continues the dark theme ───────────── */}
      <section className="section relative overflow-hidden"
               style={{ background: '#050b16' }}>
        {/* Dramatic center glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(14,165,233,0.13) 0%, transparent 70%)',
             }} />
        {/* Top border line */}
        <div className="absolute top-0 inset-x-0"
             style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.25), transparent)' }} />

        <div className="page-container text-center relative">
          <p className="text-sky-500 font-bold text-xs uppercase tracking-[0.12em] mb-4">Get Started Today</p>
          <h2 className="heading-lg text-white mb-4">Ready to get started?</h2>
          <p className="text-white/45 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Join homeowners across the Charlotte metro getting competitive cleaning quotes — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn btn-primary btn-xl"
                  style={{ boxShadow: '0 0 28px rgba(56,189,248,0.28), 0 4px 16px rgba(74,159,212,0.38), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
              Get Free Quotes Now
            </Link>
            <Link to="/how-it-works" className="btn btn-ghost-white btn-xl">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
