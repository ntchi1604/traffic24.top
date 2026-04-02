import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    id: 'step-1',
    num: '01',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="12" width="44" height="56" rx="6" fill="rgba(0,86,204,0.18)" stroke="rgba(26,127,255,0.5)" strokeWidth="1.5"/>
        <rect x="24" y="8" width="32" height="8" rx="4" fill="rgba(0,86,204,0.35)" stroke="rgba(26,127,255,0.5)" strokeWidth="1"/>
        <line x1="28" y1="32" x2="52" y2="32" stroke="rgba(240,245,249,0.3)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="40" x2="48" y2="40" stroke="rgba(240,245,249,0.2)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="48" x2="44" y2="48" stroke="rgba(240,245,249,0.15)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="54" cy="54" r="14" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.6)" strokeWidth="1.5"/>
        <path d="M48 54l4 4 8-8" stroke="#FFB347" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Chọn Gói & Đăng Ký',
    desc: 'Chọn gói dịch vụ phù hợp và hoàn tất đăng ký chỉ trong vài phút. Không cần kỹ thuật.',
    pill: '< 5 phút',
    color: '#1A7FFF',
  },
  {
    id: 'step-2',
    num: '02',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="22" fill="rgba(0,86,204,0.15)" stroke="rgba(26,127,255,0.4)" strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="14" fill="rgba(0,86,204,0.2)" stroke="rgba(26,127,255,0.5)" strokeWidth="1"/>
        <circle cx="40" cy="40" r="6" fill="rgba(26,127,255,0.6)"/>
        <line x1="40" y1="18" x2="40" y2="24" stroke="rgba(26,127,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="56" x2="40" y2="62" stroke="rgba(26,127,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="40" x2="24" y2="40" stroke="rgba(26,127,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="56" y1="40" x2="62" y2="40" stroke="rgba(26,127,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="58" cy="22" r="10" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5"/>
        <path d="M55 22c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3" stroke="#FF8C00" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="58" cy="29" r="1" fill="#FF8C00"/>
      </svg>
    ),
    title: 'Thiết Lập Chiến Dịch',
    desc: 'Nhập URL, chọn nguồn traffic, geo-targeting theo tỉnh thành và các thông số chiến dịch.',
    pill: 'Setup tức thì',
    color: '#1A7FFF',
  },
  {
    id: 'step-3',
    num: '03',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="28" y="28" width="24" height="32" rx="3" fill="rgba(0,86,204,0.25)" stroke="rgba(26,127,255,0.6)" strokeWidth="1.5"/>
        <rect x="31" y="33" width="18" height="3" rx="1.5" fill="rgba(26,127,255,0.5)"/>
        <rect x="31" y="39" width="18" height="3" rx="1.5" fill="rgba(26,127,255,0.4)"/>
        <rect x="31" y="45" width="18" height="3" rx="1.5" fill="rgba(26,127,255,0.3)"/>
        <circle cx="40" cy="54" r="2" fill="#1A7FFF"/>
        {/* user avatars floating up */}
        <circle cx="18" cy="30" r="6" fill="rgba(255,140,0,0.3)" stroke="rgba(255,140,0,0.7)" strokeWidth="1"/>
        <circle cx="62" cy="26" r="6" fill="rgba(255,140,0,0.3)" stroke="rgba(255,140,0,0.7)" strokeWidth="1"/>
        <circle cx="14" cy="50" r="5" fill="rgba(92,255,160,0.25)" stroke="rgba(92,255,160,0.6)" strokeWidth="1"/>
        <circle cx="66" cy="48" r="5" fill="rgba(92,255,160,0.25)" stroke="rgba(92,255,160,0.6)" strokeWidth="1"/>
        <path d="M24 30 Q28 29 28 35" stroke="rgba(255,140,0,0.5)" strokeWidth="1" strokeDasharray="2 2"/>
        <path d="M56 26 Q52 25 52 35" stroke="rgba(255,140,0,0.5)" strokeWidth="1" strokeDasharray="2 2"/>
      </svg>
    ),
    title: 'Hệ Thống Chạy Traffic',
    desc: 'Hệ thống tự động gửi người dùng thật đến website của bạn 24/7, liên tục và ổn định.',
    pill: 'Bắt đầu trong 24h',
    color: '#FF8C00',
    active: true,
  },
  {
    id: 'step-4',
    num: '04',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="50" width="10" height="18" rx="2" fill="rgba(255,140,0,0.5)"/>
        <rect x="30" y="38" width="10" height="30" rx="2" fill="rgba(26,127,255,0.6)"/>
        <rect x="44" y="28" width="10" height="40" rx="2" fill="rgba(255,140,0,0.7)"/>
        <rect x="58" y="20" width="10" height="48" rx="2" fill="rgba(26,127,255,0.8)"/>
        <path d="M16 50 Q28 36 44 28 Q56 22 62 18" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="62" cy="18" r="4" fill="#FFB347"/>
        <circle cx="46" cy="26" r="26" fill="none" stroke="rgba(26,127,255,0.2)" strokeWidth="1" strokeDasharray="3 4"/>
        <circle cx="58" cy="22" r="10" fill="rgba(26,127,255,0.15)" stroke="rgba(26,127,255,0.4)" strokeWidth="1.5"/>
        <circle cx="58" cy="22" r="6" fill="rgba(26,127,255,0.25)"/>
      </svg>
    ),
    title: 'Báo Cáo & Đo Lường',
    desc: 'Nhận báo cáo Chi tiết hàng tuần. Theo dõi hiệu quả chiến dịch qua dashboard trực quan.',
    pill: 'Real-time data',
    color: '#1A7FFF',
  },
]

function ConnectorArrow({ active }) {
  return (
    <div className={`qt-connector${active ? ' qt-connector-active' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 80 24" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0056CC" stopOpacity="0.4"/>
            <stop offset="50%" stopColor={active ? '#FF8C00' : '#1A7FFF'} stopOpacity="1"/>
            <stop offset="100%" stopColor={active ? '#FFB347' : '#0056CC'} stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="12" x2="72" y2="12" stroke="url(#arrowGrad)" strokeWidth="2" strokeDasharray="6 4">
          <animateTransform attributeName="transform" type="translate" from="-10 0" to="0 0" dur="1.2s" repeatCount="indefinite"/>
        </line>
        <path d="M68 6l8 6-8 6" stroke={active ? '#FF8C00' : '#1A7FFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {active && <div className="qt-connector-glow"/>}
    </div>
  )
}

export default function QuyTrinh() {
  const [activeStep, setActiveStep] = useState(2) // step 3 (index 2) active by default
  const sectionRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="quytrinh" id="quytrinh-section" aria-labelledby="quytrinh-heading">
      {/* Bokeh blobs */}
      <div className="qt-bokeh qt-bokeh-1" aria-hidden="true"/>
      <div className="qt-bokeh qt-bokeh-2" aria-hidden="true"/>
      <div className="qt-bokeh qt-bokeh-3" aria-hidden="true"/>

      <div className="section-container" ref={sectionRef}>
        <header className="qt-header">
          <p className="section-eyebrow">Cách Chúng Tôi Hoạt Động</p>
          <h2 className="section-title" id="quytrinh-heading">Quy Trình Hoạt Động</h2>
          <p className="section-sub">Chúng tôi đưa traffic thực đến website của bạn chỉ trong 4 bước đơn giản</p>
        </header>

        <div className="qt-flow" role="list">
          {STEPS.map((step, i) => (
            <div key={step.id} className="qt-flow-item" role="listitem">
              {/* Step card */}
              <article
                id={step.id}
                className={`qt-card${activeStep === i ? ' qt-card-active' : ''}`}
                onMouseEnter={() => setActiveStep(i)}
                aria-label={`Bước ${step.num}: ${step.title}`}
              >
                <span className="qt-num" style={{ color: activeStep === i ? step.color : 'rgba(240,245,249,0.15)' }}>
                  {step.num}
                </span>
                <div className="qt-icon">{step.icon}</div>
                <div className="qt-pill" style={{ borderColor: activeStep === i ? step.color + '66' : 'rgba(255,255,255,0.1)', color: activeStep === i ? step.color : 'rgba(240,245,249,0.35)' }}>
                  {step.pill}
                </div>
                <h3 className="qt-title">{step.title}</h3>
                <p className="qt-desc">{step.desc}</p>
                {activeStep === i && <div className="qt-card-shine" aria-hidden="true"/>}
              </article>

              {/* Connector (not after last) */}
              {i < STEPS.length - 1 && (
                <ConnectorArrow active={activeStep === i || activeStep === i + 1} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="qt-trust-row" aria-label="Cam kết dịch vụ">
          {['Không cần kỹ thuật', 'Hỗ trợ onboarding 1-1', 'Cam kết đúng chỉ tiêu'].map((t, i) => (
            <div key={i} className="qt-trust-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L2 4v4c0 4 2.5 6.5 6 8 3.5-1.5 6-4 6-8V4L8 1z" fill="rgba(92,255,160,0.15)" stroke="#5CFFA0" strokeWidth="1"/>
                <path d="M5 8l2 2 4-4" stroke="#5CFFA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
