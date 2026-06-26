import { Link } from 'react-router-dom';

const COUNTIES = [
  'Mecklenburg, NC', 'Iredell, NC', 'Cabarrus, NC', 'Union, NC',
  'Gaston, NC', 'Lincoln, NC', 'Rowan, NC', 'Stanly, NC',
  'York, SC', 'Lancaster, SC', 'Chester, SC',
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #1a3a5a 0%, #0f2540 100%)' }} className="text-white">
      <div className="page-container pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-white/10 rounded-[10px] flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
                <span className="text-sky-400 font-black text-sm">BR</span>
              </div>
              <span className="text-xl font-black">Bid<span className="text-sky-400">Rinse</span></span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Connecting homeowners with insured local exterior cleaning businesses across NC &amp; SC.
            </p>
            <div className="flex flex-col gap-2 text-xs text-white/35">
              <span className="flex items-center gap-2"><span className="text-sky-400">✓</span> Insured Businesses Only</span>
              <span className="flex items-center gap-2"><span className="text-sky-400">✓</span> Free to Post a Job</span>
              <span className="flex items-center gap-2"><span className="text-sky-400">✓</span> Secure Payments via Stripe</span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.1em] mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                { to: '/services',        label: 'Services' },
                { to: '/how-it-works',    label: 'How It Works' },
                { to: '/for-businesses',  label: 'For Businesses' },
                { to: '/register',        label: 'Get a Quote' },
                { to: '/register/business', label: 'List Your Business' },
                { to: '/login',           label: 'Sign In' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Counties */}
          <div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.1em] mb-4">Service Area — NC &amp; SC</h3>
            <div className="grid grid-cols-1 gap-1.5 text-sm text-white/40">
              {COUNTIES.map((c) => (
                <span key={c} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-sky-500/50 flex-shrink-0" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.1em] mb-4">Contact</h3>
            <a href="mailto:hello@bidrinse.com"
               className="text-sm text-white/50 hover:text-white transition-colors">
              hello@bidrinse.com
            </a>
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-xs font-semibold text-white/70 mb-1">Ready to get started?</p>
              <p className="text-xs text-white/40 mb-3">Post your first job — it's free.</p>
              <Link to="/register" className="btn btn-primary btn-sm w-full justify-center">
                Get Free Quotes
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} BidRinse. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
