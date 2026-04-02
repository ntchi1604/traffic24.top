import { useEffect, useRef } from 'react'

const PLANS = [
  {
    id: 'plan-starter',
    tier: 'KHỞI ĐẦU',
    tierClass: 'plan-tier-blue',
    price: '299,000đ',
    priceClass: '',
    periodClass: '',
    features: [
      { ok: true,  text: '5,000 lượt truy cập / tháng' },
      { ok: true,  text: 'Traffic tìm kiếm tự nhiên' },
      { ok: true,  text: 'Báo cáo cơ bản hàng tuần' },
      { ok: true,  text: 'Nhắm địa lý: Toàn quốc' },
      { ok: false, text: 'Custom geo-targeting' },
      { ok: false, text: 'Priority support 24/7' },
    ],
    featuresClass: '',
    btn: { label: 'Chọn Gói Này', className: 'btn btn-plan-outline', id: 'btn-starter' },
    pro: false,
  },
  {
    id: 'plan-pro',
    tier: 'CHUYÊN NGHIỆP',
    tierClass: 'plan-tier-white',
    price: '799,000đ',
    priceClass: 'plan-price-white',
    periodClass: 'price-period-white',
    features: [
      { ok: true, text: '20,000 lượt truy cập / tháng' },
      { ok: true, text: 'Traffic tìm kiếm + mạng xã hội' },
      { ok: true, text: 'Custom geo-targeting theo tỉnh' },
      { ok: true, text: 'Báo cáo chi tiết hàng ngày' },
      { ok: true, text: 'Priority support 24/7' },
      { ok: false, text: 'API access' },
    ],
    featuresClass: 'plan-features-white',
    btn: { label: 'MUA TRAFFIC NGAY', className: 'btn btn-gradient-pro', id: 'btn-pro' },
    pro: true,
  },
  {
    id: 'plan-enterprise',
    tier: 'DOANH NGHIỆP',
    tierClass: 'plan-tier-blue',
    price: 'Liên Hệ',
    priceClass: '',
    periodClass: '',
    features: [
      { ok: true, text: 'Unlimited traffic' },
      { ok: true, text: 'Tất cả loại traffic' },
      { ok: true, text: 'City-level geo precision' },
      { ok: true, text: 'Real-time analytics dashboard' },
      { ok: true, text: 'Dedicated account manager' },
      { ok: true, text: 'API access đầy đủ' },
    ],
    featuresClass: '',
    btn: { label: 'Liên Hệ Ngay', className: 'btn btn-plan-outline', id: 'btn-enterprise' },
    pro: false,
  },
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

export default function Pricing() {
  const gridRef = useRef(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.pricing-card')
    if (!cards) return
    cards.forEach(c => {
      c.style.opacity = '0'
      c.style.transform = c.classList.contains('pricing-card-pro') ? 'scale(1.05) translateY(18px)' : 'translateY(22px)'
      c.style.transition = 'opacity .55s ease, transform .55s ease'
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const c = entry.target
        c.style.opacity = '1'
        c.style.transform = c.classList.contains('pricing-card-pro') ? 'scale(1.05)' : 'translateY(0)'
        observer.unobserve(c)
      })
    }, { threshold: 0.1 })
    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="pricing" id="pricing-section" aria-labelledby="pricing-heading">
      <div className="section-container">
        <header className="pricing-header">
          <p className="section-eyebrow">Minh Bạch &amp; Rõ Ràng</p>
          <h2 className="section-title" id="pricing-heading">Gói Dịch Vụ</h2>
          <p className="section-sub">Chọn gói traffic phù hợp với nhu cầu của bạn</p>
        </header>
        <div className="pricing-grid" ref={gridRef}>
          {PLANS.map(plan => (
            <div key={plan.id} className={`pricing-card${plan.pro ? ' pricing-card-pro' : ''}`} id={`pricing-card-${plan.id}`}>
              {plan.pro && (
                <div className="plan-popular-flag" aria-label="Gói phổ biến nhất">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1L10 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H6L8 1Z" fill="#FF8C00" />
                  </svg>
                  Phổ Biến Nhất
                </div>
              )}
              <div className={`plan-tier ${plan.tierClass}`}>{plan.tier}</div>
              <div className="plan-price-wrap">
                <div className={`plan-price ${plan.priceClass}`}>
                  {plan.price}
                </div>
                <div className={`price-period ${plan.periodClass}`}>/tháng</div>
              </div>
              <ul className={`plan-features ${plan.featuresClass}`} aria-label={`Tính năng ${plan.tier}`}>
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className={`f-check ${plan.pro ? 'f-white' : f.ok ? 'f-green' : 'f-grey'}`} aria-hidden="true">
                      {f.ok ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button id={plan.btn.id} className={plan.btn.className} onClick={addRipple}>{plan.btn.label}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
