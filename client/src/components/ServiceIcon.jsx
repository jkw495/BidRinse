const icons = {
  'Pressure Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Wand body */}
      <line x1="10" y1="38" x2="30" y2="18" stroke="#607d8b" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Gun body */}
      <rect x="27" y="10" width="11" height="7" rx="2" fill="#546e7a" stroke="#37474f" strokeWidth="1.5"/>
      {/* Trigger */}
      <path d="M31 17 L29 22" stroke="#37474f" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Nozzle */}
      <rect x="38" y="11" width="6" height="5" rx="1.5" fill="#78909c" stroke="#37474f" strokeWidth="1.2"/>
      {/* Water spray */}
      <line x1="44" y1="9"  x2="48" y2="7"  stroke="#29b6f6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="13" x2="48" y2="13" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="17" x2="48" y2="19" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round"/>
      {/* Handle */}
      <path d="M10 38 Q6 42 9 45 Q13 47 15 42" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1.5"/>
      {/* Water puddle */}
      <ellipse cx="14" cy="46" rx="8" ry="1.5" fill="#81d4fa" opacity="0.6"/>
    </svg>
  ),

  'Soft Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Sky background strip */}
      <rect x="2" y="2" width="44" height="20" rx="2" fill="#e3f2fd" opacity="0.5"/>
      {/* House walls */}
      <polygon points="24,5 44,20 40,20 40,42 8,42 8,20 4,20" fill="#fff9c4" stroke="#f9a825" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Roof */}
      <polygon points="24,5 44,20 4,20" fill="#bf360c" stroke="#8d2c0b" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Door */}
      <rect x="20" y="29" width="8" height="13" rx="1" fill="#6d4c41" stroke="#4e342e" strokeWidth="1.2"/>
      <circle cx="27" cy="36" r="1" fill="#ffd54f"/>
      {/* Window */}
      <rect x="10" y="24" width="8" height="7" rx="1" fill="#81d4fa" stroke="#0288d1" strokeWidth="1.2"/>
      <line x1="14" y1="24" x2="14" y2="31" stroke="#0288d1" strokeWidth="1"/>
      <line x1="10" y1="27.5" x2="18" y2="27.5" stroke="#0288d1" strokeWidth="1"/>
      {/* Soft spray arcs */}
      <path d="M14 8 Q24 2 34 8" stroke="#29b6f6" strokeWidth="1.8" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
      <path d="M10 13 Q24 5 38 13" stroke="#29b6f6" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="2 2" opacity="0.5"/>
    </svg>
  ),

  'Roof Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Wall */}
      <rect x="6" y="24" width="36" height="18" rx="1" fill="#efebe9" stroke="#bcaaa4" strokeWidth="1.8"/>
      {/* Roof */}
      <polygon points="24,4 46,24 2,24" fill="#5d4037" stroke="#4e342e" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Shingle rows */}
      <line x1="7"  y1="19" x2="41" y2="19" stroke="#3e2723" strokeWidth="1.2" opacity="0.5"/>
      <line x1="11" y1="14" x2="37" y2="14" stroke="#3e2723" strokeWidth="1.2" opacity="0.5"/>
      <line x1="16" y1="10" x2="32" y2="10" stroke="#3e2723" strokeWidth="1.2" opacity="0.5"/>
      {/* Algae/moss spots */}
      <circle cx="16" cy="17" r="2.5" fill="#388e3c" opacity="0.6"/>
      <circle cx="28" cy="12" r="2"   fill="#388e3c" opacity="0.6"/>
      <circle cx="36" cy="18" r="2"   fill="#388e3c" opacity="0.5"/>
      {/* Cleaning brush */}
      <rect x="30" y="15" width="10" height="3.5" rx="1" fill="#1565c0" stroke="#0d47a1" strokeWidth="1.2"/>
      <line x1="35" y1="15" x2="35" y2="10" stroke="#78909c" strokeWidth="2" strokeLinecap="round"/>
      {/* Siding lines on wall */}
      <line x1="6" y1="30" x2="42" y2="30" stroke="#bcaaa4" strokeWidth="1" opacity="0.5"/>
      <line x1="6" y1="36" x2="42" y2="36" stroke="#bcaaa4" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),

  'Gutter Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Roof edge / fascia */}
      <rect x="2" y="10" width="44" height="5" rx="1" fill="#bcaaa4" stroke="#8d6e63" strokeWidth="1.5"/>
      {/* Gutter trough */}
      <path d="M2 15 L2 22 Q2 26 6 26 L42 26 Q46 26 46 22 L46 15" fill="#90a4ae" stroke="#607d8b" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Leaves */}
      <ellipse cx="13" cy="21" rx="4.5" ry="2.5" fill="#558b2f" opacity="0.85" transform="rotate(-15 13 21)"/>
      <ellipse cx="24" cy="20" rx="4"   ry="2.2" fill="#7cb342" opacity="0.85" transform="rotate(10 24 20)"/>
      <ellipse cx="34" cy="21" rx="4.5" ry="2.5" fill="#558b2f" opacity="0.85" transform="rotate(-8 34 21)"/>
      {/* Downspout */}
      <rect x="40" y="26" width="5" height="18" rx="1" fill="#90a4ae" stroke="#607d8b" strokeWidth="1.5"/>
      {/* Water dripping out */}
      <line x1="42.5" y1="44" x2="42.5" y2="47" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="42.5" cy="47.5" rx="2" ry="1" fill="#81d4fa" opacity="0.7"/>
      {/* Water in gutter */}
      <path d="M6 24 Q14 26 22 24 Q30 22 38 24" stroke="#29b6f6" strokeWidth="1.5" fill="none" opacity="0.6"/>
    </svg>
  ),

  'Window Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Frame */}
      <rect x="5" y="5" width="38" height="38" rx="3" fill="#90a4ae" stroke="#607d8b" strokeWidth="2"/>
      {/* Glass panes */}
      <rect x="7"  y="7"  width="16" height="16" rx="1" fill="#b3e5fc"/>
      <rect x="25" y="7"  width="16" height="16" rx="1" fill="#81d4fa"/>
      <rect x="7"  y="25" width="16" height="16" rx="1" fill="#81d4fa"/>
      <rect x="25" y="25" width="16" height="16" rx="1" fill="#b3e5fc"/>
      {/* Reflection gleam */}
      <line x1="9"  y1="9"  x2="14" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="27" y1="27" x2="32" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      {/* Squeegee blade */}
      <rect x="26" y="7" width="14" height="3.5" rx="1.5" fill="#1565c0"/>
      {/* Squeegee handle */}
      <line x1="33" y1="10.5" x2="38" y2="20" stroke="#78909c" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Water streak */}
      <path d="M26 10.5 Q24 17 26 23" stroke="#29b6f6" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" strokeDasharray="2 2"/>
    </svg>
  ),

  'Concrete / Driveway Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Driveway surface */}
      <path d="M15 5 L33 5 L47 43 L1 43 Z" fill="#b0bec5" stroke="#78909c" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Expansion joints */}
      <line x1="10" y1="17" x2="38" y2="17" stroke="#78909c" strokeWidth="1.2" opacity="0.6"/>
      <line x1="5"  y1="30" x2="43" y2="30" stroke="#78909c" strokeWidth="1.2" opacity="0.6"/>
      {/* Center line */}
      <line x1="24" y1="5" x2="24" y2="43" stroke="#fdd835" strokeWidth="2" strokeDasharray="5 4" opacity="0.8"/>
      {/* Oil stain */}
      <ellipse cx="18" cy="35" rx="5" ry="3" fill="#37474f" opacity="0.4"/>
      {/* Clean spray circle */}
      <circle cx="32" cy="35" r="6" stroke="#29b6f6" strokeWidth="2" fill="#e1f5fe" opacity="0.7"/>
      <circle cx="32" cy="35" r="2.5" fill="#29b6f6" opacity="0.5"/>
    </svg>
  ),

  'Deck and Patio Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Deck boards */}
      <rect x="3" y="28" width="42" height="4"  rx="1" fill="#a1887f" stroke="#795548" strokeWidth="1.2"/>
      <rect x="3" y="33" width="42" height="4"  rx="1" fill="#8d6e63" stroke="#795548" strokeWidth="1.2"/>
      <rect x="3" y="38" width="42" height="4"  rx="1" fill="#a1887f" stroke="#795548" strokeWidth="1.2"/>
      {/* Deck frame */}
      <rect x="3" y="27" width="42" height="16" rx="2" fill="none" stroke="#5d4037" strokeWidth="1.8"/>
      {/* Top handrail */}
      <rect x="3" y="22" width="42" height="4" rx="1.5" fill="#bcaaa4" stroke="#795548" strokeWidth="1.5"/>
      {/* Left post */}
      <rect x="5"  y="8" width="4" height="18" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="1.5"/>
      {/* Right post */}
      <rect x="39" y="8" width="4" height="18" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="1.5"/>
      {/* Top rail */}
      <line x1="5" y1="10" x2="43" y2="10" stroke="#795548" strokeWidth="2" strokeLinecap="round"/>
      {/* Balusters */}
      {[13, 20, 27, 34].map(x => (
        <rect key={x} x={x} y="10" width="2.5" height="12" rx="1" fill="#a1887f" stroke="#795548" strokeWidth="1"/>
      ))}
      {/* Water spray on board */}
      <path d="M22 36 Q28 34 34 36" stroke="#29b6f6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8"/>
    </svg>
  ),

  'Fence Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Pickets */}
      {[4, 13, 22, 31, 40].map((x, i) => (
        <g key={i}>
          <polygon
            points={`${x+4},8 ${x+8},14 ${x+8},42 ${x},42 ${x},14`}
            fill={i % 2 === 0 ? '#d7ccc8' : '#bcaaa4'}
            stroke="#8d6e63"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Wood grain */}
          <line x1={x+4} y1="18" x2={x+8} y2="22" stroke="#a1887f" strokeWidth="0.8" opacity="0.5"/>
          <line x1={x}   y1="28" x2={x+8} y2="32" stroke="#a1887f" strokeWidth="0.8" opacity="0.5"/>
        </g>
      ))}
      {/* Top rail */}
      <rect x="0" y="18" width="48" height="5" rx="1" fill="#a1887f" stroke="#6d4c41" strokeWidth="1.5"/>
      {/* Bottom rail */}
      <rect x="0" y="32" width="48" height="5" rx="1" fill="#a1887f" stroke="#6d4c41" strokeWidth="1.5"/>
      {/* Water spray on fence */}
      <path d="M30 22 Q36 20 42 22" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
      <circle cx="44" cy="21" r="1.5" fill="#29b6f6" opacity="0.7"/>
    </svg>
  ),

  'Dock and Pier Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Water */}
      <path d="M0 32 Q8 28 16 32 Q24 36 32 32 Q40 28 48 32 L48 48 L0 48 Z" fill="#29b6f6" opacity="0.7"/>
      <path d="M0 36 Q8 32 16 36 Q24 40 32 36 Q40 32 48 36 L48 48 L0 48 Z" fill="#0288d1" opacity="0.5"/>
      {/* Dock planks */}
      <rect x="6"  y="20" width="36" height="4" rx="1" fill="#a1887f" stroke="#795548" strokeWidth="1.2"/>
      <rect x="6"  y="25" width="36" height="3" rx="1" fill="#8d6e63" stroke="#795548" strokeWidth="1.2"/>
      {/* Pilings */}
      <rect x="8"  y="28" width="4" height="14" rx="1.5" fill="#6d4c41" stroke="#4e342e" strokeWidth="1.5"/>
      <rect x="22" y="28" width="4" height="14" rx="1.5" fill="#6d4c41" stroke="#4e342e" strokeWidth="1.5"/>
      <rect x="36" y="28" width="4" height="14" rx="1.5" fill="#6d4c41" stroke="#4e342e" strokeWidth="1.5"/>
      {/* Shore post */}
      <rect x="6"  y="12" width="4" height="10" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="1.2"/>
      <rect x="38" y="12" width="4" height="10" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="1.2"/>
      {/* Rope/rail */}
      <path d="M8 14 Q24 10 40 14" stroke="#ffa726" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Seagull */}
      <path d="M34 8 Q36 6 38 8" stroke="#607d8b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  'Commercial Building Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Building */}
      <rect x="6" y="6" width="30" height="40" rx="2" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="1.8"/>
      {/* Roof line */}
      <rect x="6" y="6" width="30" height="5" rx="2" fill="#90a4ae" stroke="#78909c" strokeWidth="1.2"/>
      {/* Windows — blue glass */}
      {[14, 22].map(y =>
        [10, 18, 26].map(x => (
          <rect key={`${x}-${y}`} x={x} y={y} width="7" height="5" rx="1" fill="#4fc3f7" stroke="#0288d1" strokeWidth="1"/>
        ))
      )}
      {/* Ground floor windows */}
      {[10, 20].map(x => (
        <rect key={x} x={x} y="32" width="7" height="8" rx="1" fill="#4fc3f7" stroke="#0288d1" strokeWidth="1"/>
      ))}
      {/* Door */}
      <rect x="29" y="34" width="7" height="12" rx="1" fill="#6d4c41" stroke="#4e342e" strokeWidth="1.2"/>
      {/* Pressure washer guy on scaffold */}
      <rect x="36" y="14" width="8" height="16" rx="1" fill="#ffcc02" stroke="#f9a825" strokeWidth="1.2" opacity="0.8"/>
      <line x1="40" y1="14" x2="40" y2="10" stroke="#78909c" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Water spray */}
      <path d="M36 20 Q32 24 34 28" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="34" cy="28" r="1.5" fill="#29b6f6" opacity="0.7"/>
    </svg>
  ),

  'Mobile Car Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Car body */}
      <path d="M3 28 L3 36 L45 36 L45 28 L38 28 L32 18 L16 18 L10 28 Z" fill="#ef5350" stroke="#c62828" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Roof */}
      <path d="M16 18 L32 18 L28 10 L20 10 Z" fill="#e53935" stroke="#c62828" strokeWidth="1.5"/>
      {/* Windshield */}
      <path d="M16 18 L12 28 L36 28 L32 18 Z" fill="#b3e5fc" stroke="#0288d1" strokeWidth="1" opacity="0.9"/>
      {/* Side window */}
      <path d="M20 10 L28 10 L30 18 L18 18 Z" fill="#b3e5fc" stroke="#0288d1" strokeWidth="1" opacity="0.9"/>
      {/* Wheels */}
      <circle cx="13" cy="36" r="6"   fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="13" cy="36" r="2.5" fill="#90a4ae"/>
      <circle cx="35" cy="36" r="6"   fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="35" cy="36" r="2.5" fill="#90a4ae"/>
      {/* Headlight */}
      <rect x="42" y="28" width="3" height="3" rx="1" fill="#fff176"/>
      {/* Water drops */}
      <circle cx="5"  cy="20" r="2" fill="#29b6f6" opacity="0.8"/>
      <circle cx="9"  cy="14" r="2" fill="#29b6f6" opacity="0.8"/>
      <circle cx="2"  cy="13" r="1.5" fill="#29b6f6" opacity="0.7"/>
      <circle cx="6"  cy="26" r="1.5" fill="#4fc3f7" opacity="0.6"/>
    </svg>
  ),

  'RV Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* RV body */}
      <rect x="2" y="15" width="36" height="22" rx="3" fill="#e0e0e0" stroke="#9e9e9e" strokeWidth="1.8"/>
      {/* Color stripe */}
      <rect x="2" y="28" width="36" height="5" rx="0" fill="#42a5f5" opacity="0.7"/>
      {/* Cab */}
      <path d="M38 20 L38 37 L46 37 L46 26 Q45 20 40 20 Z" fill="#d0d0d0" stroke="#9e9e9e" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Windshield */}
      <path d="M39 21 L39 27 L46 27 L46 24 Q45 21 41 21 Z" fill="#81d4fa" stroke="#0288d1" strokeWidth="1"/>
      {/* RV windows */}
      <rect x="6"  y="18" width="8" height="6" rx="1" fill="#81d4fa" stroke="#0288d1" strokeWidth="1"/>
      <rect x="17" y="18" width="8" height="6" rx="1" fill="#81d4fa" stroke="#0288d1" strokeWidth="1"/>
      <rect x="28" y="18" width="7" height="6" rx="1" fill="#81d4fa" stroke="#0288d1" strokeWidth="1"/>
      {/* Wheels */}
      <circle cx="11" cy="37" r="5.5" fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="11" cy="37" r="2.2" fill="#90a4ae"/>
      <circle cx="30" cy="37" r="5.5" fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="30" cy="37" r="2.2" fill="#90a4ae"/>
      <circle cx="42" cy="37" r="4.5" fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="42" cy="37" r="1.8" fill="#90a4ae"/>
      {/* Water spray */}
      <path d="M2 22 Q-2 26 2 30" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
      <circle cx="1" cy="21" r="1.5" fill="#29b6f6" opacity="0.7"/>
    </svg>
  ),

  'Fleet Washing': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Trailer */}
      <rect x="1" y="15" width="30" height="22" rx="2" fill="#eceff1" stroke="#90a4ae" strokeWidth="1.8"/>
      {/* Trailer stripe */}
      <rect x="1" y="26" width="30" height="4" fill="#1565c0" opacity="0.5"/>
      {/* Trailer door lines */}
      <line x1="16" y1="15" x2="16" y2="37" stroke="#90a4ae" strokeWidth="1.2" opacity="0.6"/>
      <line x1="1"  y1="26" x2="31" y2="26" stroke="#90a4ae" strokeWidth="1" opacity="0.4"/>
      {/* Cab */}
      <path d="M31 18 L31 37 L47 37 L47 26 Q46 18 41 18 Z" fill="#1565c0" stroke="#0d47a1" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Windshield */}
      <path d="M33 19 L33 26 L47 26 L47 23 Q45 19 41 19 Z" fill="#b3e5fc" stroke="#0288d1" strokeWidth="1"/>
      {/* Exhaust stack */}
      <rect x="38" y="10" width="3" height="8" rx="1" fill="#78909c" stroke="#546e7a" strokeWidth="1.2"/>
      <path d="M39 10 Q41 7 43 9" stroke="#bdbdbd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Wheels */}
      <circle cx="10" cy="37" r="5.5" fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="10" cy="37" r="2.2" fill="#90a4ae"/>
      <circle cx="22" cy="37" r="5.5" fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="22" cy="37" r="2.2" fill="#90a4ae"/>
      <circle cx="41" cy="37" r="5"   fill="#37474f" stroke="#212121" strokeWidth="1.5"/>
      <circle cx="41" cy="37" r="2"   fill="#90a4ae"/>
      {/* Water spray on trailer */}
      <path d="M1 20 Q-3 24 1 28" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="2 2"/>
    </svg>
  ),

  'Solar Panel Cleaning': () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Panel frame */}
      <rect x="3" y="10" width="42" height="28" rx="2" fill="#1a237e" stroke="#283593" strokeWidth="1.8"/>
      {/* Cell grid background */}
      <rect x="5" y="12" width="38" height="24" rx="1" fill="#1565c0"/>
      {/* Vertical dividers */}
      <line x1="18" y1="12" x2="18" y2="36" stroke="#283593" strokeWidth="1.5"/>
      <line x1="31" y1="12" x2="31" y2="36" stroke="#283593" strokeWidth="1.5"/>
      {/* Horizontal dividers */}
      <line x1="5" y1="20" x2="43" y2="20" stroke="#283593" strokeWidth="1.5"/>
      <line x1="5" y1="28" x2="43" y2="28" stroke="#283593" strokeWidth="1.5"/>
      {/* Cell highlights */}
      {[[6,13],[19,13],[32,13],[6,21],[19,21],[32,21],[6,29],[19,29],[32,29]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="11" height="6.5" rx="0.5" fill="#1976d2" opacity="0.6"/>
      ))}
      {/* Cell reflections */}
      <line x1="7"  y1="14" x2="10" y2="17" stroke="#90caf9" strokeWidth="1" opacity="0.6"/>
      <line x1="20" y1="22" x2="23" y2="25" stroke="#90caf9" strokeWidth="1" opacity="0.6"/>
      {/* Mount legs */}
      <line x1="14" y1="38" x2="10" y2="45" stroke="#78909c" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="34" y1="38" x2="38" y2="45" stroke="#78909c" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="8"  y1="45" x2="40" y2="45" stroke="#607d8b" strokeWidth="2" strokeLinecap="round"/>
      {/* Sun */}
      <circle cx="43" cy="6" r="4" fill="#fdd835" stroke="#f9a825" strokeWidth="1.2"/>
      <line x1="43" y1="1"  x2="43" y2="-1" stroke="#fdd835" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Water cleaning spray */}
      <path d="M5 18 Q8 14 12 18" stroke="#29b6f6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9"/>
    </svg>
  ),
};

export default function ServiceIcon({ name, size = 'md' }) {
  const SvgIcon = icons[name];
  if (!SvgIcon) return null;

  const dim = size === 'lg' ? 34 : 28;
  return (
    <span style={{ width: dim, height: dim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SvgIcon />
    </span>
  );
}
