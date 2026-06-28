export default function Logo({ size = 40, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" rx="16" fill="#0A1628"/>
        <circle cx="30" cy="32" r="10" stroke="#C9A84C" strokeWidth="4" fill="none"/>
        <circle cx="30" cy="32" r="4" fill="#C9A84C"/>
        <line x1="36" y1="38" x2="58" y2="54" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round"/>
        <line x1="50" y1="50" x2="50" y2="58" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round"/>
        <line x1="56" y1="54" x2="56" y2="62" stroke="#C9A84C" strokeWidth="4" strokeLinecap="round"/>
        <path d="M18 58 Q28 52 38 58" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      </svg>
      {showText && (
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 700,
          fontSize: size * 0.55,
          color: '#0A1628',
          letterSpacing: '-0.5px'
        }}>
          Check<span style={{ color: '#C9A84C' }}>Inn</span>
        </span>
      )}
    </div>
  )
}
