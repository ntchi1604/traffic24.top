// TrustBar — "Được tin tưởng & chứng nhận bởi"

const TRUST_ITEMS = [
  {
    id: 'google-analytics',
    label: 'Google Analytics',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="28" width="8" height="14" rx="2" fill="#F9AB00"/>
        <rect x="20" y="18" width="8" height="24" rx="2" fill="#E37400"/>
        <rect x="34" y="6" width="8" height="36" rx="2" fill="#E37400"/>
        <circle cx="38" cy="10" r="5" fill="#F9AB00"/>
      </svg>
    ),
  },
  {
    id: 'google-ads',
    label: 'Google Ads',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 38L18 16" stroke="#FBBC04" strokeWidth="6" strokeLinecap="round"/>
        <path d="M18 16L30 38" stroke="#FBBC04" strokeWidth="6" strokeLinecap="round"/>
        <path d="M6 38h24" stroke="#FBBC04" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="38" cy="38" r="6" fill="#34A853"/>
        <circle cx="24" cy="10" r="6" fill="#4285F4"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Meta Ads',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#1877F2"/>
        <path d="M32 24h-5v-3c0-1.4.7-2 2-2h3V14h-4c-4 0-6 3-6 6v4h-4v6h4v12h6V30h4l1-6z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'ssl',
    label: 'SSL Secured',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 4L8 12v12c0 10 7 19 16 22 9-3 16-12 16-22V12L24 4z" fill="#34A853" fillOpacity="0.2" stroke="#34A853" strokeWidth="2"/>
        <path d="M16 24l5 5 11-11" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'vecom',
    label: 'VECOM',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#D32F2F" fillOpacity="0.15" stroke="#D32F2F" strokeWidth="1.5"/>
        <text x="24" y="22" textAnchor="middle" fill="#EF5350" fontSize="8" fontWeight="800" fontFamily="sans-serif">HIỆP HỘI</text>
        <text x="24" y="32" textAnchor="middle" fill="#EF5350" fontSize="7" fontWeight="700" fontFamily="sans-serif">TMĐT VN</text>
      </svg>
    ),
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M34 30c3.3 0 6-2.7 6-6s-2.7-6-6-6c-.3 0-.6 0-.9.1C32.1 14.9 28.4 12 24 12c-5.5 0-10 4.5-10 10v.1C11.2 22.9 9 25.3 9 28c0 3.3 2.7 6 6 6" stroke="#F6821F" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 30h20" stroke="#F6821F" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'semrush',
    label: 'SEMrush',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="#FF642D" fillOpacity="0.15" stroke="#FF642D" strokeWidth="2"/>
        <path d="M16 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#FF642D" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="3" fill="#FF642D"/>
        <path d="M24 28v4" stroke="#FF642D" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 32h8" stroke="#FF642D" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ahrefs',
    label: 'Ahrefs',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="#0072DD" fillOpacity="0.12" stroke="#0072DD" strokeWidth="2"/>
        <path d="M14 34l6-20h8l6 20" stroke="#0072DD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 28h14" stroke="#0072DD" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function TrustBar() {
  return (
    <section className="trust-bar" id="trust-section" aria-label="Được tin tưởng và chứng nhận">
      <div className="section-container">
        <p className="trust-label">Được tin tưởng &amp; chứng nhận bởi</p>
        <div className="trust-track-wrap" aria-hidden="true">
          {/* Duplicate items for seamless loop */}
          {[0, 1].map(pass => (
            <div className={`trust-track${pass === 1 ? ' trust-track-dup' : ''}`} key={pass}>
              {TRUST_ITEMS.map(item => (
                <div className="trust-item" key={`${pass}-${item.id}`} title={item.label}>
                  <div className="trust-icon">{item.svg}</div>
                  <span className="trust-name">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
