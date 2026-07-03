const TRAFFIC_TYPES = [
  {
    id: 'google',
    title: 'Google Search Traffic',
    bg: 'rgba(0, 120, 215, 0.06)',
    border: 'rgba(0, 120, 215, 0.18)',
    accent: '#0078D7',
    icon: (
      <svg viewBox="0 0 48 48" width="52" height="52">
        <circle cx="24" cy="24" r="22" fill="#fff" stroke="#ddd" strokeWidth="1"/>
        <path d="M25.2 20.2H34v1.6h-6.2c-.6 2.6-3 4.5-5.8 4.5-3.5 0-6.4-2.9-6.4-6.4s2.9-6.4 6.4-6.4c1.6 0 3 .6 4.2 1.5l1.2-1.2c-1.6-1.4-3.7-2.3-6-2.3-5.2 0-9.4 4.2-9.4 9.4s4.2 9.4 9.4 9.4c5.5 0 9.1-3.9 9.1-9.4 0-.5-.1-1-.2-1.5z" fill="#4285F4"/>
        <path d="M12.4 17.4l-1.6-1.2c1.8-1.6 4.2-2.6 6.8-2.6 2.3 0 4.4.8 6 2.3" fill="none" stroke="none"/>
        <text x="14" y="33" fontSize="14" fontWeight="900" fontFamily="Arial,sans-serif">
          <tspan fill="#4285F4">G</tspan>
        </text>
      </svg>
    ),
    packages: [
      { name: 'Gói 60s', v1: '500 VNĐ', v2: '450 VNĐ' },
      { name: 'Gói 90s', v1: '563 VNĐ', v2: '563 VNĐ' },
      { name: 'Gói 120s', v1: '625 VNĐ', v2: '619 VNĐ' },
      { name: 'Gói 150s', v1: '750 VNĐ', v2: '731 VNĐ' },
      { name: 'Gói 200s', v1: '875 VNĐ', v2: '844 VNĐ' },
    ],
  },
  {
    id: 'social',
    title: 'Social Traffic',
    bg: 'rgba(224, 60, 140, 0.05)',
    border: 'rgba(224, 60, 140, 0.15)',
    accent: '#E03C8C',
    icon: (
      <svg viewBox="0 0 52 52" width="52" height="52">
        <circle cx="20" cy="26" r="10" fill="#1877F2"/>
        <text x="16" y="30" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial">f</text>
        <circle cx="34" cy="18" r="8" fill="url(#ig-grad)"/>
        <defs><linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#F58529"/><stop offset="50%" stopColor="#DD2A7B"/><stop offset="100%" stopColor="#8134AF"/></linearGradient></defs>
        <rect x="30" y="14" width="8" height="8" rx="2" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <circle cx="34" cy="18" r="2" fill="none" stroke="#fff" strokeWidth="1"/>
        <circle cx="38" cy="14" r="1.2" fill="#fff"/>
        <circle cx="40" cy="32" r="6" fill="#000"/>
        <text x="37.5" y="35" fontSize="9" fontWeight="900" fill="#fff" fontFamily="Arial">T</text>
      </svg>
    ),
    packages: [
      { name: 'Gói 60s', v1: '500 VNĐ', v2: '495 VNĐ' },
      { name: 'Gói 90s', v1: '563 VNĐ', v2: '613 VNĐ' },
      { name: 'Gói 120s', v1: '688 VNĐ', v2: '619 VNĐ' },
      { name: 'Gói 150s', v1: '781 VNĐ', v2: '743 VNĐ' },
      { name: 'Gói 200s', v1: '875 VNĐ', v2: '866 VNĐ' },
    ],
  },
  {
    id: 'direct',
    title: 'Direct Traffic',
    bg: 'rgba(0, 180, 120, 0.05)',
    border: 'rgba(0, 180, 120, 0.15)',
    accent: '#00B478',
    icon: (
      <svg viewBox="0 0 48 48" width="52" height="52">
        <rect x="6" y="10" width="36" height="24" rx="5" fill="#fff" stroke="#ccc" strokeWidth="1"/>
        <rect x="10" y="14" width="28" height="4" rx="2" fill="#f0f0f0"/>
        <text x="12" y="26" fontSize="10" fontWeight="700" fill="#E07A00" fontFamily="Arial,monospace">URL</text>
        <circle cx="38" cy="14" r="1.5" fill="#E07A00"/>
        <rect x="10" y="30" width="8" height="2" rx="1" fill="#eee"/>
        <rect x="20" y="30" width="5" height="2" rx="1" fill="#eee"/>
      </svg>
    ),
    packages: [
      { name: 'Gói 60s', v1: '375 VNĐ', v2: '338 VNĐ' },
      { name: 'Gói 90s', v1: '500 VNĐ', v2: '450 VNĐ' },
      { name: 'Gói 120s', v1: '563 VNĐ', v2: '450 VNĐ' },
      { name: 'Gói 150s', v1: '625 VNĐ', v2: '563 VNĐ' },
      { name: 'Gói 200s', v1: '813 VNĐ', v2: '788 VNĐ' },
    ],
  },
]

function CheckCircle({ color }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="9" fill={`${color}18`} stroke={color} strokeWidth="1.2"/>
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export default function UserPricingPage() {
  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--ud-text)', margin: 0, letterSpacing: '-0.3px' }}>
          Bảng giá thu nhập
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ud-text-3)', marginTop: 6 }}>
          Xem chi tiết giá cho từng loại traffic và gói thời gian
        </p>
      </div>

      {/* 3-column grid */}
      <div className="ud-pricing-grid">
        {TRAFFIC_TYPES.map(type => (
          <div key={type.id} style={{
            background: type.bg,
            border: `1px solid ${type.border}`,
            borderRadius: 16,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {/* Column header */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                {type.icon}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: type.accent,
              }}>
                {type.title}
              </div>
            </div>

            {/* Packages */}
            {type.packages.map((pkg, i) => (
              <div key={i} style={{
                background: 'var(--ud-surface, rgba(255,255,255,0.85))',
                border: '1px solid var(--ud-border, rgba(0,60,200,0.10))',
                borderRadius: 12,
                padding: '14px 16px',
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--ud-text)',
                  marginBottom: 10,
                }}>
                  {pkg.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle color="#22C55E" />
                    <span style={{ fontSize: 12.5, color: 'var(--ud-text-2)' }}>
                      V1 (2 bước): <strong style={{ color: '#22C55E', fontWeight: 700 }}>{pkg.v1}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle color="#22C55E" />
                    <span style={{ fontSize: 12.5, color: 'var(--ud-text-2)' }}>
                      V2 (1 bước): <strong style={{ color: '#22C55E', fontWeight: 700 }}>{pkg.v2}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
