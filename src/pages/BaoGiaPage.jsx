import { useState } from 'react'

const PLANS = [
  {
    id: 'plan-starter',
    tier: 'KHỞI ĐẦU',
    tierClass: 'plan-tier-blue',
    name: 'Starter',
    price: '299,000đ',
    period: '/ tháng',
    note: 'Phù hợp cho website mới bắt đầu',
    features: [
      { ok: true, text: '5,000 lượt truy cập / tháng' },
      { ok: true, text: 'Traffic tìm kiếm tự nhiên' },
      { ok: true, text: 'Bounce rate thực tế' },
      { ok: true, text: 'Báo cáo cơ bản hàng tuần' },
      { ok: true, text: 'Nhắm địa lý: Toàn quốc' },
      { ok: false, text: 'Custom geo-targeting' },
      { ok: false, text: 'Referral traffic đa nguồn' },
      { ok: false, text: 'Priority support 24/7' },
      { ok: false, text: 'API access' },
    ],
    cta: 'Chọn Gói Này',
    ctaClass: 'btn-plan-outline',
    cardClass: '',
  },
  {
    id: 'plan-pro',
    tier: 'CHUYÊN NGHIỆP',
    tierClass: 'plan-tier-white',
    name: 'Professional',
    price: '799,000đ',
    period: '/ tháng',
    note: 'Phổ biến nhất — Tối ưu cho tăng trưởng',
    popular: true,
    features: [
      { ok: true, text: '20,000 lượt truy cập / tháng' },
      { ok: true, text: 'Traffic tìm kiếm + mạng xã hội' },
      { ok: true, text: 'Custom geo-targeting theo tỉnh' },
      { ok: true, text: 'Referral traffic đa nguồn' },
      { ok: true, text: 'Báo cáo chi tiết hàng ngày' },
      { ok: true, text: 'AdSense Safe certified' },
      { ok: true, text: 'Priority support 24/7' },
      { ok: true, text: 'Dedicated account manager' },
      { ok: false, text: 'API access' },
    ],
    cta: 'Chọn Gói Này',
    ctaClass: 'btn-gradient-pro',
    cardClass: 'pricing-card-pro',
  },
  {
    id: 'plan-enterprise',
    tier: 'DOANH NGHIỆP',
    tierClass: 'plan-tier-blue',
    name: 'Enterprise',
    price: 'Liên Hệ',
    period: '/ tháng',
    note: 'Giải pháp tùy chỉnh cho doanh nghiệp lớn',
    features: [
      { ok: true, text: 'Unlimited traffic' },
      { ok: true, text: 'Tất cả loại traffic' },
      { ok: true, text: 'City-level geo precision' },
      { ok: true, text: 'Custom referral URLs' },
      { ok: true, text: 'Real-time analytics dashboard' },
      { ok: true, text: 'AdSense Safe certified' },
      { ok: true, text: 'Dedicated account manager' },
      { ok: true, text: 'API access đầy đủ' },
      { ok: true, text: 'White-label reports' },
    ],
    cta: 'Liên Hệ Ngay',
    ctaClass: 'btn-plan-outline',
    cardClass: '',
  },
]

const FAQS = [
  {
    id: 'faq-1',
    q: 'Traffic có thực sự từ người dùng thật không?',
    a: 'Có, 100% traffic từ người dùng thật tại Việt Nam và quốc tế. Chúng tôi không sử dụng bot hay phần mềm giả mạo. Mỗi lượt truy cập đều có IP thực, hành vi duyệt web tự nhiên và thời gian phiên thực tế — hoàn toàn xác nhận được qua Google Analytics.',
  },
  {
    id: 'faq-2',
    q: 'Tôi có thể hủy gói bất cứ lúc nào không?',
    a: 'Có. Không có hợp đồng dài hạn hay phí ẩn. Bạn có thể hủy, nâng cấp hoặc hạ cấp gói dịch vụ bất cứ lúc nào từ dashboard quản lý của mình.',
  },
  {
    id: 'faq-3',
    q: 'Thời gian bắt đầu nhận traffic là bao lâu?',
    a: 'Sau khi thanh toán và thiết lập chiến dịch (thường dưới 5 phút), bạn sẽ bắt đầu nhận traffic trong vòng 24 giờ. Gói Professional và Enterprise bắt đầu trong 12 giờ.',
  },
  {
    id: 'faq-4',
    q: 'Dịch vụ có an toàn với Google AdSense không?',
    a: 'Có. Phương pháp của chúng tôi đã được kiểm chứng và an toàn với AdSense. Traffic mô phỏng hành vi người dùng tự nhiên hoàn toàn, không kích hoạt các cơ chế phát hiện click fraud của Google.',
  },
]

// Custom price calculator
function Calculator() {
  const [users, setUsers] = useState(10000)
  const [months, setMonths] = useState(1)
  const [geo, setGeo] = useState('Toàn Quốc')

  const basePrice = Math.round((users / 1000) * 38000)
  const discount = months === 3 ? 0.15 : months === 6 ? 0.25 : 0
  const total = Math.round(basePrice * months * (1 - discount))
  const saved = Math.round(basePrice * months * discount)

  return (
    <section className="calc-section" id="calculator-section" aria-labelledby="calc-heading">
      <div className="section-container">
        <div className="calc-panel">
          <div className="calc-left">
            <p className="section-eyebrow">Tùy Chỉnh Theo Nhu Cầu</p>
            <h2 className="section-title" id="calc-heading" style={{ textAlign: 'left', fontSize: 28 }}>
              Tính Giá Tùy Chỉnh
            </h2>

            <div className="calc-field">
              <label className="calc-label" htmlFor="calc-users">
                Số lượng người dùng / tháng
                <span className="calc-val">{users.toLocaleString('vi-VN')}</span>
              </label>
              <input
                id="calc-users"
                type="range"
                min={1000} max={100000} step={1000}
                value={users}
                onChange={e => setUsers(+e.target.value)}
                className="calc-slider"
                aria-label="Số lượng người dùng"
              />
              <div className="calc-range-labels"><span>1K</span><span>50K</span><span>100K</span></div>
            </div>

            <div className="calc-field">
              <label className="calc-label" htmlFor="calc-geo">Khu vực địa lý</label>
              <select id="calc-geo" className="calc-select" value={geo} onChange={e => setGeo(e.target.value)}
                aria-label="Khu vực địa lý">
                <option>Toàn Quốc</option>
                <option>Hà Nội</option>
                <option>TP. Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
                <option>Quốc Tế</option>
              </select>
            </div>

            <div className="calc-field">
              <label className="calc-label">Thời hạn đăng ký</label>
              <div className="calc-pills" role="group" aria-label="Thời hạn">
                {[1, 3, 6].map(m => (
                  <button key={m} id={`calc-month-${m}`}
                    className={`calc-pill-btn${months === m ? ' active' : ''}`}
                    onClick={() => setMonths(m)}
                    aria-pressed={months === m}>
                    {m} Tháng{m > 1 ? '' : ''}
                    {m === 3 && <span className="calc-pill-save">-15%</span>}
                    {m === 6 && <span className="calc-pill-save">-25%</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="calc-right">
            <div className="calc-result-panel">
              <div className="calc-result-label">Giá Ước Tính</div>
              <div className="calc-result-price">
                {total.toLocaleString('vi-VN')}<span className="calc-result-unit">đ</span>
              </div>
              <div className="calc-result-period">cho {months} tháng ({Math.round(total / months).toLocaleString('vi-VN')}đ/tháng)</div>
              {saved > 0 && (
                <div className="calc-result-saved">
                  ✓ Tiết kiệm {saved.toLocaleString('vi-VN')}đ ({Math.round(discount * 100)}%)
                </div>
              )}
              <a href="#plan-pro" id="calc-cta-btn" className="btn btn-amber calc-result-btn">
                Nhận Báo Giá Chính Xác
              </a>
              <p className="calc-result-note">Giá chính thức từ đội ngũ tư vấn trong 30 phút</p>
            </div>
          </div>
          <div className="calc-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div id={item.id} className={`faq-item${open ? ' faq-open' : ''}`}>
      <button
        className="faq-q"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`${item.id}-answer`}
      >
        {item.q}
        <span className="faq-chevron" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div id={`${item.id}-answer`} className="faq-a" role="region">
          {item.a}
        </div>
      )}
    </div>
  )
}

export default function BaoGiaPage() {
  return (
    <div className="page-baogia">
      {/* Hero */}
      <section className="page-hero" id="baogia-hero">
        <div className="ph-blur ph-blur-1" aria-hidden="true" />
        <div className="ph-blur ph-blur-2" aria-hidden="true" />
        <div className="section-container ph-content">
          <h1 className="page-hero-title" id="baogia-heading">
            Bảng Giá Dịch Vụ Traffic
            <span className="page-hero-accent">Tăng Truy Cập – Tăng Doanh Thu</span>
          </h1>
          <p className="page-hero-desc">
            Chọn gói phù hợp với nhu cầu kinh doanh của bạn. Không phí ẩn, mở rộng ngay lập tức.
            Cam kết hoàn tiền 100% nếu không đạt chỉ tiêu.
          </p>
          <div className="ph-pills">
            <span className="ph-pill">✓ Hoàn Tiền 100%</span>
            <span className="ph-pill">✓ Hỗ Trợ 24/7</span>
            <span className="ph-pill ph-pill-amber">✓ Không Hợp Đồng Dài Hạn</span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pricing baogia-pricing" id="pricing-section" aria-labelledby="pricing-heading">
        <div className="section-container">
          <header className="pricing-header">
            <p className="section-eyebrow">Gói Dịch Vụ</p>
            <h2 className="section-title" id="pricing-heading">Chọn Gói Phù Hợp</h2>
            <p className="section-sub">Tất cả gói đều bao gồm traffic thực, báo cáo tuần và hỗ trợ kỹ thuật</p>
          </header>
          <div className="pricing-grid">
            {PLANS.map(plan => (
              <div key={plan.id} id={plan.id} className={`pricing-card ${plan.cardClass}`}>
                {plan.popular && (
                  <div className="plan-popular-flag" aria-label="Phổ biến nhất">
                    ⚡ PHỔ BIẾN NHẤT
                  </div>
                )}
                <p className={`plan-tier ${plan.tierClass}`}>{plan.tier}</p>
                <div className="plan-price-wrap">
                  <div className={`plan-price ${plan.popular ? 'plan-price-white' : ''}`}>
                    <span className="price-unit">{plan.price === 'Liên Hệ' ? '' : ''}</span>
                    {plan.price}
                  </div>
                  <div className={`price-period ${plan.popular ? 'price-period-white' : ''}`}>
                    {plan.period} — {plan.note}
                  </div>
                </div>
                <ul className={`plan-features ${plan.popular ? 'plan-features-white' : ''}`}>
                  {plan.features.map((f, i) => (
                    <li key={i}>
                      <span className={`f-check ${f.ok ? (plan.popular ? 'f-white' : 'f-green') : 'f-grey'}`}>
                        {f.ok ? '✓' : '✗'}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <a
                  href="#calculator-section"
                  id={`${plan.id}-cta`}
                  className={`btn ${plan.ctaClass}`}
                  aria-label={`${plan.cta} — ${plan.name}`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <Calculator />

      {/* FAQ */}
      <section className="faq-section" id="faq-section" aria-labelledby="faq-heading">
        <div className="section-container">
          <header className="faq-header">
            <p className="section-eyebrow">Câu Hỏi Thường Gặp</p>
            <h2 className="section-title" id="faq-heading">FAQ Bảng Giá</h2>
          </header>
          <div className="faq-list" role="list">
            {FAQS.map(f => <FaqItem key={f.id} item={f} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="page-cta-section" id="baogia-cta">
        <div className="section-container">
          <div className="page-cta-panel page-cta-panel-alt">
            <div className="page-cta-glow" aria-hidden="true" />
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="page-cta-icon" aria-hidden="true">
              <circle cx="24" cy="24" r="20" fill="rgba(255,140,0,0.15)" stroke="rgba(255,140,0,0.4)" strokeWidth="1.5" />
              <path d="M16 24h16M24 16v16" stroke="#FFB347" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <h2 className="page-cta-title">Cần Báo Giá Riêng Cho Doanh Nghiệp?</h2>
            <p className="page-cta-sub">Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ 24/7 — Miễn phí tư vấn</p>
            <a href="#footer-section" id="baogia-cta-btn" className="btn btn-outline btn-lg page-cta-btn">
              LIÊN HỆ ĐỘI NGŨ NGAY
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
