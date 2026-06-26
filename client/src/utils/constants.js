export const SERVICES = [
  'Pressure Washing',
  'Soft Washing',
  'Roof Cleaning',
  'Gutter Cleaning',
  'Window Cleaning',
  'Concrete / Driveway Cleaning',
  'Deck and Patio Cleaning',
  'Fence Cleaning',
  'Dock and Pier Cleaning',
  'Commercial Building Cleaning',
  'Mobile Car Washing',
  'RV Washing',
  'Fleet Washing',
  'Solar Panel Cleaning',
];

export const COUNTIES = [
  // North Carolina
  'Mecklenburg, NC',
  'Iredell, NC',
  'Cabarrus, NC',
  'Union, NC',
  'Gaston, NC',
  'Lincoln, NC',
  'Rowan, NC',
  'Stanly, NC',
  // South Carolina
  'York, SC',
  'Lancaster, SC',
  'Chester, SC',
];

export const SERVICE_ICONS = {
  'Pressure Washing':             '💧',
  'Soft Washing':                 '🫧',
  'Roof Cleaning':                '🏠',
  'Gutter Cleaning':              '🍂',
  'Window Cleaning':              '🪟',
  'Concrete / Driveway Cleaning': '🚗',
  'Deck and Patio Cleaning':      '🪴',
  'Fence Cleaning':               '🪵',
  'Dock and Pier Cleaning':       '⚓',
  'Commercial Building Cleaning': '🏢',
  'Mobile Car Washing':           '🚘',
  'RV Washing':                   '🚌',
  'Fleet Washing':                '🚛',
  'Solar Panel Cleaning':         '☀️',
};

export const JOB_TYPES = [
  { value: 'residential', label: 'Residential', icon: '🏠', desc: 'Home, house, or personal property' },
  { value: 'commercial', label: 'Commercial', icon: '🏢', desc: 'Business, office, or commercial property' },
];

export const JOB_TYPE_BADGES = {
  residential: 'bg-blue-100 text-blue-700',
  commercial:  'bg-purple-100 text-purple-700',
};

export const COMMISSION_RATES = {
  residential: 0.035,
  commercial:  0.05,
};

export const JOB_STATUS_LABELS = {
  pending:         { label: 'Pending Quotes', color: 'bg-yellow-100 text-yellow-800' },
  quotes_received: { label: 'Quotes Received', color: 'bg-blue-100 text-blue-800' },
  accepted:        { label: 'Accepted',        color: 'bg-green-100 text-green-800' },
  completed:       { label: 'Completed',       color: 'bg-gray-100 text-gray-800' },
  cancelled:       { label: 'Cancelled',       color: 'bg-red-100 text-red-800' },
  expired:         { label: 'Expired',         color: 'bg-orange-100 text-orange-800' },
};

export const QUOTE_STATUS_LABELS = {
  pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
  expired:  { label: 'Expired',  color: 'bg-gray-100 text-gray-800' },
};
