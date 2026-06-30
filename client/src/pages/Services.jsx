import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SERVICES } from '../utils/constants';
import ServiceIcon from '../components/ServiceIcon';

const SERVICE_DESCRIPTIONS = {
  'Pressure Washing':             'High-pressure water cleaning for siding, driveways, fences, and more. Removes dirt, grime, mold, and mildew fast.',
  'Soft Washing':                 'Low-pressure washing with biodegradable solutions. Safe for painted surfaces, wood, and delicate areas.',
  'Roof Cleaning':                'Remove algae, moss, lichen, and dark streaks from your roof to extend its life and restore curb appeal.',
  'Gutter Cleaning':              'Clear clogged gutters and downspouts to prevent water damage, foundation issues, and pest problems.',
  'Window Cleaning':              'Streak-free window washing inside and out for residential and commercial properties.',
  'Concrete / Driveway Cleaning': 'Power wash concrete, asphalt, or pavers to remove oil stains, tire marks, rust, and discoloration.',
  'Deck and Patio Cleaning':      'Restore your deck or patio with professional cleaning — wood, composite, concrete, or stone.',
  'Fence Cleaning':               'Remove weathering, mold, and staining from wood, vinyl, or metal fences.',
  'Dock and Pier Cleaning':       'Specialized cleaning for docks, piers, and boat lifts — safe for waterfront structures.',
  'Commercial Building Cleaning': 'Full exterior cleaning for storefronts, parking lots, and building facades.',
  'Mobile Car Washing':           'Professional vehicle detailing and washing at your home or business — no need to leave.',
  'RV Washing':                   'Full exterior wash and detail for motorhomes, travel trailers, and campers.',
  'Fleet Washing':                'Regular exterior cleaning for commercial vehicle fleets — trucks, vans, and heavy equipment.',
  'Solar Panel Cleaning':         'Gentle professional cleaning to remove dust, pollen, and debris from solar panels — restores efficiency and output.',
};

const SERVICE_CATEGORIES = {
  'Residential': ['Pressure Washing', 'Soft Washing', 'Roof Cleaning', 'Gutter Cleaning', 'Window Cleaning', 'Concrete / Driveway Cleaning', 'Deck and Patio Cleaning', 'Fence Cleaning', 'Solar Panel Cleaning'],
  'Specialty':   ['Dock and Pier Cleaning', 'Mobile Car Washing', 'RV Washing'],
  'Commercial':  ['Commercial Building Cleaning', 'Fleet Washing'],
};

export default function Services() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Object.keys(SERVICE_CATEGORIES)];

  const visibleServices = filter === 'All'
    ? SERVICES
    : SERVICE_CATEGORIES[filter] ?? SERVICES;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />

      {/* ── Hero — dark aurora ──────────────────────────── */}
      <section className="relative overflow-hidden text-white"
               style={{ background: '#060d1a', minHeight: 'min(56vh, 520px)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: [
                 'radial-gradient(ellipse 70% 55% at 60% -15%, rgba(14,165,233,0.20) 0%, transparent 65%)',
                 'radial-gradient(ellipse 40% 35% at 5% 90%, rgba(56,189,248,0.08) 0%, transparent 70%)',
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
            14 Services · NC &amp; SC
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5"
              style={{ lineHeight: 1.04 }}>
            Everything exterior.{' '}
            <span className="gradient-text">One platform.</span>
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            14 types of exterior cleaning. Local insured pros ready to quote — completely free.
          </p>
        </div>
      </section>

      {/* ── Service grid ───────────────────────────────── */}
      <section className="section">
        <div className="page-container">

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  filter === c
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleServices.map((svc) => (
              <div key={svc} className="card-hover group p-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                                transition-transform duration-200 group-hover:scale-110"
                     style={{ background: 'linear-gradient(135deg, #f0f7fc, #e2f0f9)' }}>
                  <ServiceIcon name={svc} size="lg" />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{svc}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{SERVICE_DESCRIPTIONS[svc]}</p>
                <Link to="/register"
                      className="inline-flex items-center gap-1 text-sky-500 text-sm font-semibold
                                 hover:text-sky-600 transition-colors">
                  Get a quote <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — dark glass ───────────────────────────── */}
      <section className="section relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050b16 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(14,165,233,0.11) 0%, transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0"
             style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(74,159,212,0.25), transparent)' }} />

        <div className="page-container text-center relative">
          <h2 className="heading-lg text-white mb-4">Ready to get a quote?</h2>
          <p className="text-white/45 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Post your job in under 2 minutes and start receiving bids from local pros.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn btn-primary btn-xl"
                  style={{ boxShadow: '0 0 28px rgba(56,189,248,0.28), 0 4px 16px rgba(74,159,212,0.38), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
              Post Your Job Free →
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
