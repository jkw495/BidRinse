const S = '#2d8fc8';      // stroke / icon color
const F = '#daeef9';      // light fill
const W = '2.2';          // stroke width

const icons = {
  'Pressure Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Pressure wand */}
      <line x1="10" y1="38" x2="30" y2="18" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      <rect x="28" y="10" width="10" height="6" rx="2" fill={F} stroke={S} strokeWidth={W}/>
      {/* Nozzle tip */}
      <line x1="38" y1="13" x2="43" y2="13" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      {/* Water spray lines */}
      <line x1="43" y1="9"  x2="47" y2="7"  stroke={S} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="43" y1="13" x2="47" y2="13" stroke={S} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="43" y1="17" x2="47" y2="19" stroke={S} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Handle grip */}
      <path d="M10 38 Q6 42 9 44 Q12 46 14 42" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Water drops on ground */}
      <circle cx="8"  cy="44" r="1.2" fill={S}/>
      <circle cx="14" cy="46" r="1.2" fill={S}/>
      <circle cx="20" cy="44" r="1.2" fill={S}/>
    </svg>
  ),

  'Soft Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* House shape */}
      <polygon points="24,5 44,20 40,20 40,40 8,40 8,20 4,20" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Door */}
      <rect x="20" y="28" width="8" height="12" rx="1" fill={S} opacity="0.3"/>
      {/* Window */}
      <rect x="10" y="24" width="7" height="6" rx="1" fill={S} opacity="0.3"/>
      {/* Soft spray arcs over roof */}
      <path d="M16 10 Q24 4 32 10" stroke={S} strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
      <path d="M12 14 Q24 6 36 14" stroke={S} strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="2 2" opacity="0.5"/>
    </svg>
  ),

  'Roof Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Roof triangle */}
      <polygon points="24,4 46,22 2,22" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Shingle lines on roof */}
      <line x1="12" y1="16" x2="24" y2="9"  stroke={S} strokeWidth="1.4" opacity="0.5"/>
      <line x1="24" y1="9"  x2="36" y2="16" stroke={S} strokeWidth="1.4" opacity="0.5"/>
      <line x1="7"  y1="20" x2="24" y2="11" stroke={S} strokeWidth="1.4" opacity="0.3"/>
      <line x1="24" y1="11" x2="41" y2="20" stroke={S} strokeWidth="1.4" opacity="0.3"/>
      {/* Wall below */}
      <rect x="6" y="22" width="36" height="18" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Horizontal siding lines */}
      <line x1="6" y1="28" x2="42" y2="28" stroke={S} strokeWidth="1.2" opacity="0.4"/>
      <line x1="6" y1="34" x2="42" y2="34" stroke={S} strokeWidth="1.2" opacity="0.4"/>
      {/* Brush on roof */}
      <rect x="30" y="12" width="10" height="4" rx="1" fill={S} opacity="0.5"/>
      <line x1="35" y1="12" x2="35" y2="8" stroke={S} strokeWidth={W} strokeLinecap="round"/>
    </svg>
  ),

  'Gutter Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Roofline */}
      <line x1="2" y1="14" x2="46" y2="14" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      {/* Gutter trough */}
      <path d="M2 14 L2 20 Q2 24 6 24 L42 24 Q46 24 46 20 L46 14" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Downspout */}
      <rect x="40" y="24" width="4" height="18" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Leaves in gutter */}
      <ellipse cx="14" cy="19" rx="4" ry="2.5" fill={S} opacity="0.35" transform="rotate(-15 14 19)"/>
      <ellipse cx="24" cy="19" rx="3.5" ry="2"  fill={S} opacity="0.35" transform="rotate(10 24 19)"/>
      <ellipse cx="33" cy="19" rx="4" ry="2.5"  fill={S} opacity="0.35" transform="rotate(-8 33 19)"/>
      {/* Water drip from downspout */}
      <line x1="42" y1="43" x2="42" y2="47" stroke={S} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="42" cy="47" r="1.5" fill={S}/>
    </svg>
  ),

  'Window Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Window frame */}
      <rect x="6" y="6" width="36" height="36" rx="3" fill={F} stroke={S} strokeWidth={W}/>
      {/* Panes */}
      <line x1="24" y1="6"  x2="24" y2="42" stroke={S} strokeWidth={W}/>
      <line x1="6"  y1="24" x2="42" y2="24" stroke={S} strokeWidth={W}/>
      {/* Squeegee */}
      <rect x="28" y="8" width="12" height="3" rx="1.5" fill={S} opacity="0.7"/>
      {/* Squeegee handle */}
      <line x1="34" y1="11" x2="38" y2="20" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      {/* Water streak */}
      <path d="M28 11 Q26 17 28 22" stroke={S} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" strokeDasharray="2 2"/>
    </svg>
  ),

  'Concrete / Driveway Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Driveway in perspective */}
      <path d="M16 6 L32 6 L46 42 L2 42 Z" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Center dashed line */}
      <line x1="24" y1="6" x2="24" y2="42" stroke={S} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
      {/* Horizontal joint lines */}
      <line x1="11" y1="18" x2="37" y2="18" stroke={S} strokeWidth="1.2" opacity="0.4"/>
      <line x1="7"  y1="30" x2="41" y2="30" stroke={S} strokeWidth="1.2" opacity="0.4"/>
      {/* Pressure washer spray circle on surface */}
      <circle cx="24" cy="36" r="5" stroke={S} strokeWidth="1.4" fill="none" opacity="0.5"/>
      <circle cx="24" cy="36" r="2" fill={S} opacity="0.3"/>
    </svg>
  ),

  'Deck and Patio Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Deck surface */}
      <rect x="4" y="26" width="40" height="16" rx="2" fill={F} stroke={S} strokeWidth={W}/>
      {/* Deck boards */}
      <line x1="4"  y1="31" x2="44" y2="31" stroke={S} strokeWidth="1.3" opacity="0.45"/>
      <line x1="4"  y1="36" x2="44" y2="36" stroke={S} strokeWidth="1.3" opacity="0.45"/>
      <line x1="4"  y1="41" x2="44" y2="41" stroke={S} strokeWidth="1.3" opacity="0.45"/>
      {/* Top rail */}
      <rect x="4" y="21" width="40" height="4" rx="1.5" fill={F} stroke={S} strokeWidth={W}/>
      {/* Left post */}
      <rect x="6"  y="8" width="3.5" height="16" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Right post */}
      <rect x="38.5" y="8" width="3.5" height="16" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Top horizontal rail */}
      <line x1="6" y1="10" x2="42" y2="10" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      {/* Balusters */}
      {[14, 20, 26, 32].map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="21" stroke={S} strokeWidth="1.3" opacity="0.5"/>
      ))}
    </svg>
  ),

  'Fence Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Picket posts */}
      {[5, 14, 23, 32, 41].map(x => (
        <g key={x}>
          <polygon
            points={`${x},8 ${x+4},14 ${x+4},40 ${x-4},40 ${x-4},14`}
            fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"
          />
        </g>
      ))}
      {/* Top rail */}
      <rect x="1" y="18" width="46" height="4.5" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Bottom rail */}
      <rect x="1" y="30" width="46" height="4.5" rx="1" fill={F} stroke={S} strokeWidth={W}/>
    </svg>
  ),

  'Dock and Pier Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Water */}
      <path d="M2 34 Q10 30 18 34 Q26 38 34 34 Q42 30 46 34 L46 46 L2 46 Z" fill={F} stroke={S} strokeWidth="1.4" opacity="0.6"/>
      {/* Dock surface */}
      <rect x="8" y="22" width="32" height="6" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Deck planks */}
      <line x1="8"  y1="25" x2="40" y2="25" stroke={S} strokeWidth="1.2" opacity="0.4"/>
      {/* Pilings */}
      <rect x="10" y="28" width="3.5" height="14" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      <rect x="22" y="28" width="3.5" height="14" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      <rect x="34" y="28" width="3.5" height="14" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Dock walkway from shore */}
      <rect x="20" y="10" width="8" height="12" rx="1" fill={F} stroke={S} strokeWidth={W}/>
      {/* Anchor */}
      <circle cx="38" cy="14" r="4" fill="none" stroke={S} strokeWidth={W}/>
      <line x1="38" y1="10" x2="38" y2="6"  stroke={S} strokeWidth={W} strokeLinecap="round"/>
      <line x1="34" y1="18" x2="42" y2="18" stroke={S} strokeWidth={W} strokeLinecap="round"/>
    </svg>
  ),

  'Commercial Building Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Main building */}
      <rect x="8" y="8" width="32" height="36" rx="2" fill={F} stroke={S} strokeWidth={W}/>
      {/* Roof line */}
      <line x1="8" y1="14" x2="40" y2="14" stroke={S} strokeWidth={W}/>
      {/* Windows grid */}
      {[18, 26].map(y =>
        [13, 22, 31].map(x => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="5" rx="1" fill={S} opacity="0.25"/>
        ))
      )}
      {/* Door */}
      <rect x="20" y="36" width="8" height="8" rx="1" fill={S} opacity="0.3"/>
      {/* Pressure washer spray on side */}
      <path d="M40 20 Q46 24 40 28" stroke={S} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
    </svg>
  ),

  'Mobile Car Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Car body */}
      <path d="M4 28 L4 36 L44 36 L44 28 L36 28 L30 18 L18 18 L12 28 Z" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Windshield */}
      <path d="M18 18 L14 28 L34 28 L30 18 Z" fill={S} opacity="0.15" stroke={S} strokeWidth="1.2"/>
      {/* Wheels */}
      <circle cx="13" cy="36" r="5.5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="13" cy="36" r="2.5" fill={S} opacity="0.2"/>
      <circle cx="35" cy="36" r="5.5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="35" cy="36" r="2.5" fill={S} opacity="0.2"/>
      {/* Water drops */}
      <circle cx="6"  cy="20" r="1.5" fill={S} opacity="0.6"/>
      <circle cx="10" cy="15" r="1.5" fill={S} opacity="0.6"/>
      <circle cx="3"  cy="14" r="1.5" fill={S} opacity="0.6"/>
    </svg>
  ),

  'RV Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* RV body — large box */}
      <rect x="2" y="16" width="38" height="22" rx="3" fill={F} stroke={S} strokeWidth={W}/>
      {/* Cab section */}
      <path d="M40 22 L44 22 Q46 22 46 28 L46 38 L40 38 Z" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Windows on RV */}
      <rect x="6"  y="20" width="7" height="6" rx="1" fill={S} opacity="0.25"/>
      <rect x="16" y="20" width="7" height="6" rx="1" fill={S} opacity="0.25"/>
      <rect x="26" y="20" width="7" height="6" rx="1" fill={S} opacity="0.25"/>
      {/* Cab windshield */}
      <rect x="41" y="23" width="4" height="6" rx="1" fill={S} opacity="0.25"/>
      {/* Stripe */}
      <line x1="2"  y1="31" x2="40" y2="31" stroke={S} strokeWidth="1.4" opacity="0.4"/>
      {/* Wheels */}
      <circle cx="11" cy="38" r="5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="11" cy="38" r="2.2" fill={S} opacity="0.2"/>
      <circle cx="31" cy="38" r="5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="31" cy="38" r="2.2" fill={S} opacity="0.2"/>
      <circle cx="43" cy="38" r="4" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="43" cy="38" r="1.8" fill={S} opacity="0.2"/>
    </svg>
  ),

  'Fleet Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Trailer box */}
      <rect x="2" y="16" width="30" height="22" rx="2" fill={F} stroke={S} strokeWidth={W}/>
      {/* Cab */}
      <path d="M32 20 L32 38 L46 38 L46 26 Q46 20 40 20 Z" fill={F} stroke={S} strokeWidth={W} strokeLinejoin="round"/>
      {/* Cab windshield */}
      <path d="M34 20 L34 26 L46 26 L46 22 Q44 20 40 20 Z" fill={S} opacity="0.2"/>
      {/* Trailer door lines */}
      <line x1="17" y1="16" x2="17" y2="38" stroke={S} strokeWidth="1.3" opacity="0.4"/>
      <line x1="2"  y1="27" x2="32" y2="27" stroke={S} strokeWidth="1.3" opacity="0.4"/>
      {/* Exhaust stack */}
      <rect x="38" y="12" width="2.5" height="8" rx="1" fill={F} stroke={S} strokeWidth="1.5"/>
      {/* Wheels */}
      <circle cx="10" cy="38" r="5.5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="10" cy="38" r="2.5" fill={S} opacity="0.2"/>
      <circle cx="23" cy="38" r="5.5" fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="23" cy="38" r="2.5" fill={S} opacity="0.2"/>
      <circle cx="40" cy="38" r="5"   fill={F} stroke={S} strokeWidth={W}/>
      <circle cx="40" cy="38" r="2.2" fill={S} opacity="0.2"/>
    </svg>
  ),

  'Solar Panel Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Panel frame */}
      <rect x="4" y="10" width="40" height="26" rx="2" fill={F} stroke={S} strokeWidth={W}/>
      {/* Vertical cell dividers */}
      <line x1="17.3" y1="10" x2="17.3" y2="36" stroke={S} strokeWidth="1.4" opacity="0.6"/>
      <line x1="30.6" y1="10" x2="30.6" y2="36" stroke={S} strokeWidth="1.4" opacity="0.6"/>
      {/* Horizontal cell dividers */}
      <line x1="4" y1="19" x2="44" y2="19" stroke={S} strokeWidth="1.4" opacity="0.6"/>
      <line x1="4" y1="28" x2="44" y2="28" stroke={S} strokeWidth="1.4" opacity="0.6"/>
      {/* Cell fill */}
      {[[5,11],[18.3,11],[31.6,11],[5,20],[18.3,20],[31.6,20],[5,29],[18.3,29],[31.6,29]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="11.3" height="7.5" fill={S} opacity="0.12"/>
      ))}
      {/* Mount legs */}
      <line x1="14" y1="36" x2="10" y2="44" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      <line x1="34" y1="36" x2="38" y2="44" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      <line x1="8"  y1="44" x2="40" y2="44" stroke={S} strokeWidth={W} strokeLinecap="round"/>
      {/* Sun rays top right */}
      <circle cx="42" cy="6" r="3" fill={S} opacity="0.4"/>
    </svg>
  ),
};

export default function ServiceIcon({ name, size = 'md' }) {
  const SvgIcon = icons[name];
  if (!SvgIcon) return null;

  const dim = size === 'lg' ? 32 : 26;
  return (
    <span style={{ width: dim, height: dim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SvgIcon />
    </span>
  );
}
