import { useEffect, useRef } from 'react'

const STATS = [
  { value: '10M+', label: 'Traffic Thực', target: 10, suffix: 'M+' },
  { value: '98%', label: 'Khách Hài Lòng', target: 98, suffix: '%' },
  { value: '5+ Năm', label: 'Kinh Nghiệm', target: 5, suffix: '+ Năm' },
]

function addRipple(e) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const r = document.createElement('span')
  r.className = 'btn-ripple'
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`
  btn.appendChild(r)
  setTimeout(() => r.remove(), 560)
}

// Data-flow SVG lines background
function DataFlowLines() {
  return (
    <div className="hero-data-lines" aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A7FFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#1A7FFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8C00" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF8C00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1A7FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[80, 180, 280, 380, 480, 580].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="1200" y2={y}
            stroke={i % 2 === 0 ? 'url(#lineGrad1)' : 'url(#lineGrad2)'}
            strokeWidth="1"
            strokeDasharray="8 48"
          >
            <animateTransform
              attributeName="transform" type="translate"
              from="-56 0" to="0 0"
              dur={`${2.5 + i * 0.4}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
        <line x1="900" y1="0" x2="1200" y2="300" stroke="url(#lineGrad1)" strokeWidth="1" opacity="0.5" strokeDasharray="6 30">
          <animateTransform attributeName="transform" type="translate" from="60 0" to="0 0" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="400" x2="300" y2="700" stroke="url(#lineGrad2)" strokeWidth="1" opacity="0.5" strokeDasharray="6 30">
          <animateTransform attributeName="transform" type="translate" from="-60 0" to="0 0" dur="4s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}

export default function Hero() {
  const statsRef = useRef(null)

  useEffect(() => {
    const nums = statsRef.current?.querySelectorAll('[data-target]')
    if (!nums) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const end = parseInt(el.dataset.target, 10)
        const suffix = el.dataset.suffix || el.textContent.replace(/\d/g, '')
        let step = 0
        const total = 60
        const timer = setInterval(() => {
          step++
          el.textContent = Math.min(Math.round((end / total) * step), end) + suffix
          if (step >= total) clearInterval(timer)
        }, 1400 / total)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })
    nums.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero" id="hero-section" aria-labelledby="hero-heading">
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />
      <DataFlowLines />

      <div className="hero-container">
        {/* ── Text Column ── */}
        <div className="hero-text">
          <h1 className="hero-headline" id="hero-heading">
            TĂNG TRAFFIC USER
            <span className="headline-accent">CHO WEBSITE</span>
            CỦA BẠN
          </h1>

          <p className="hero-sub">
            Dịch vụ traffic user thực giúp bạn tăng lưu lượng truy cập bền vững,
            cải thiện thứ hạng Google và thu hút khách hàng tiềm năng hiệu quả.
          </p>

          <div className="hero-actions">
            <a
              href="#pricing-section"
              id="hero-cta-primary"
              className="btn btn-amber btn-lg"
              onClick={addRipple}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              MUA TRAFFIC NGAY
            </a>
            <a
              href="#features-section"
              id="hero-cta-secondary"
              className="btn btn-outline btn-lg"
              onClick={addRipple}
            >
              Tìm Hiểu Thêm
            </a>
          </div>

          <div className="hero-stats" ref={statsRef} aria-label="Thống kê dịch vụ">
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'contents' }}>
                {i > 0 && <div className="stat-sep" aria-hidden="true" />}
                <div className="stat-item">
                  <span className="stat-num" data-target={s.target} data-suffix={s.suffix}>{s.value}</span>
                  <span className="stat-lbl">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Image Column ── */}
        <div className="hero-image-col" aria-hidden="true">
          <div className="hero-glow" />
          <img
            src="/images/hero.png"
            alt="Đội ngũ Traffic24h phân tích traffic"
            style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1, borderRadius: '16px', objectFit: 'cover' }}
          />

          {/* Floating data cards */}
          <div className="float-card fc-rank">
            <div className="fc-icon fc-icon-green">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 13l4-4 3.5 3.5L14 6l2-2" stroke="#5CFFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="fc-body">
              <div className="fc-value">Top #3</div>
              <div className="fc-label">Google Ranking</div>
            </div>
          </div>

          <div className="float-card fc-traffic">
            <div className="fc-icon fc-icon-blue">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 14l5-5 3 3 8-9" stroke="#4DA6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 5h4v4" stroke="#4DA6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="fc-body">
              <div className="fc-value">+215%</div>
              <div className="fc-label">Organic Traffic</div>
            </div>
          </div>

          <div className="float-card fc-kw">
            <div className="fc-icon fc-icon-yellow">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 10L5 6l3 3 4-5 4 4" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="fc-body">
              <div className="fc-value">1.2M</div>
              <div className="fc-label">Users / Tháng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
