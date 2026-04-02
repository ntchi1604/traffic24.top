import QuyTrinh from '../components/QuyTrinh'
import { useNavigate } from 'react-router-dom'

const SERVICES = [
  {
    id: 'svc-organic',
    color: '#1A7FFF',
    colorDim: 'rgba(26,127,255,0.15)',
    colorBorder: 'rgba(26,127,255,0.3)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="16" fill="rgba(26,127,255,0.15)" stroke="rgba(26,127,255,0.5)" strokeWidth="1.5" />
        <circle cx="28" cy="28" r="9" fill="rgba(26,127,255,0.2)" />
        <line x1="40" y1="40" x2="52" y2="52" stroke="#1A7FFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 36l4-8 4 4 5-10 5 6" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Traffic Tìm Kiếm Tự Nhiên',
    sub: 'Organic Search Traffic',
    desc: 'Mô phỏng người dùng tìm kiếm từ khóa thực tế và truy cập website của bạn từ kết quả Google.',
    features: [
      'Mô phỏng tìm kiếm từ khóa thực',
      'Tỷ lệ bounce rate tự nhiên',
      'Thời gian phiên thực tế',
      'Nhắm mục tiêu từ khóa cụ thể',
      'An toàn với Google Analytics',
      'Báo cáo keyword chi tiết',
    ],
  },
  {
    id: 'svc-social',
    color: '#FF8C00',
    colorDim: 'rgba(255,140,0,0.12)',
    colorBorder: 'rgba(255,140,0,0.3)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="32" r="8" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.6)" strokeWidth="1.5" />
        <circle cx="48" cy="16" r="8" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.6)" strokeWidth="1.5" />
        <circle cx="48" cy="48" r="8" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.6)" strokeWidth="1.5" />
        <line x1="24" y1="28" x2="40" y2="20" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5" />
        <line x1="24" y1="36" x2="40" y2="44" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5" />
        <circle cx="16" cy="32" r="3" fill="#FF8C00" />
        <circle cx="48" cy="16" r="3" fill="#FFB347" />
        <circle cx="48" cy="48" r="3" fill="#FFB347" />
      </svg>
    ),
    title: 'Traffic Mạng Xã Hội',
    sub: 'Social Media Traffic',
    desc: 'Traffic từ Facebook, TikTok, Instagram và các nền tảng mạng xã hội lớn tại Việt Nam.',
    features: [
      'Nguồn từ Facebook & TikTok VN',
      'Instagram & YouTube referral',
      'Thời gian phiên thực tế',
      'Nhắm đối tượng theo sở thích',
      'Mô phỏng hành vi tự nhiên',
      'Tỷ lệ engagement thực',
    ],
  },
  {
    id: 'svc-geo',
    color: '#5CFFA0',
    colorDim: 'rgba(92,255,160,0.1)',
    colorBorder: 'rgba(92,255,160,0.25)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="22" fill="rgba(92,255,160,0.08)" stroke="rgba(92,255,160,0.3)" strokeWidth="1.5" />
        <ellipse cx="32" cy="32" rx="12" ry="22" fill="none" stroke="rgba(92,255,160,0.2)" strokeWidth="1" />
        <line x1="10" y1="32" x2="54" y2="32" stroke="rgba(92,255,160,0.2)" strokeWidth="1" />
        <circle cx="32" cy="20" r="4" fill="rgba(255,140,0,0.8)" stroke="#FFB347" strokeWidth="1" />
        <path d="M32 16v-4M32 16l3-3M32 16l-3-3" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="46" cy="38" r="3" fill="rgba(26,127,255,0.8)" stroke="#1A7FFF" strokeWidth="1" />
      </svg>
    ),
    title: 'Traffic Địa Lý Mục Tiêu',
    sub: 'Geo-Targeted Traffic',
    desc: 'Nhắm chính xác đến từng tỉnh thành, thành phố tại Việt Nam và quốc tế.',
    features: [
      'Nhắm theo tỉnh/thành phố VN',
      'Pool IP thực tế địa phương',
      'ISP-level targeting chính xác',
      'Phân phối địa lý tùy chỉnh',
      'Báo cáo theo vùng chi tiết',
      'Hỗ trợ quốc tế & đa quốc gia',
    ],
  },
  {
    id: 'svc-referral',
    color: '#1A7FFF',
    colorDim: 'rgba(26,127,255,0.12)',
    colorBorder: 'rgba(26,127,255,0.28)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="24" width="16" height="12" rx="3" fill="rgba(26,127,255,0.2)" stroke="rgba(26,127,255,0.5)" strokeWidth="1.5" />
        <rect x="40" y="24" width="16" height="12" rx="3" fill="rgba(26,127,255,0.2)" stroke="rgba(26,127,255,0.5)" strokeWidth="1.5" />
        <rect x="24" y="40" width="16" height="12" rx="3" fill="rgba(255,140,0,0.2)" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5" />
        <path d="M24 30h16M32 30v10" stroke="rgba(26,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="30" r="2" fill="#1A7FFF" />
        <circle cx="48" cy="30" r="2" fill="#1A7FFF" />
        <circle cx="32" cy="46" r="2" fill="#FF8C00" />
      </svg>
    ),
    title: 'Traffic Referral & Direct',
    sub: 'Referral & Direct Traffic',
    desc: 'Traffic từ các nguồn referral đa dạng và direct, an toàn tuyệt đối với AdSense.',
    features: [
      'Nguồn referral đa dạng',
      'Brand-direct simulation',
      'An toàn AdSense 100%',
      'Custom referral URLs',
      'Không ảnh hưởng tài khoản quảng cáo',
      'Tỷ lệ direct/referral tự nhiên',
    ],
  },
]

const USPS = [
  {
    id: 'usp-real',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L4 8v8c0 7 5 12 12 14 7-2 12-7 12-14V8L16 2z" fill="rgba(92,255,160,0.2)" stroke="#5CFFA0" strokeWidth="1.5" />
        <path d="M10 16l4 4 8-8" stroke="#5CFFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: '100% Người Thực',
    desc: 'Không bot, không phần mềm giả mạo. Mọi lượt truy cập đều từ người dùng thực tại Việt Nam.',
    color: '#5CFFA0',
  },
  {
    id: 'usp-geo',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" fill="rgba(26,127,255,0.2)" stroke="#1A7FFF" strokeWidth="1.5" />
        <circle cx="16" cy="12" r="4" fill="rgba(255,140,0,0.6)" stroke="#FF8C00" strokeWidth="1" />
        <path d="M16 10v-4M16 10l3-3M16 10l-3-3" stroke="#FF8C00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Nhắm Chính Xác',
    desc: 'Geo-targeting đến từng tỉnh thành. ISP-level precision với pool IP địa phương.',
    color: '#1A7FFF',
  },
  {
    id: 'usp-adsense',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="4" fill="rgba(255,140,0,0.15)" stroke="rgba(255,140,0,0.5)" strokeWidth="1.5" />
        <path d="M10 16h4M18 16h4M16 12v8" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="8" r="6" fill="rgba(92,255,160,0.3)" stroke="#5CFFA0" strokeWidth="1.5" />
        <path d="M21 8l2 2 4-4" stroke="#5CFFA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'An Toàn AdSense',
    desc: 'Phương pháp đã được kiểm chứng. Không ảnh hưởng đến tài khoản quảng cáo Google của bạn.',
    color: '#FFB347',
  },
  {
    id: 'usp-analytics',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="22" width="6" height="8" rx="1.5" fill="rgba(255,140,0,0.5)" />
        <rect x="13" y="16" width="6" height="14" rx="1.5" fill="rgba(26,127,255,0.6)" />
        <rect x="22" y="10" width="6" height="20" rx="1.5" fill="rgba(255,140,0,0.7)" />
        <path d="M7 22L16 16L25 10" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Phân Tích Chi Tiết',
    desc: 'Báo cáo hàng tuần với đầy đủ metrics. Dashboard real-time theo dõi mọi chỉ số.',
    color: '#FF8C00',
  },
]

export default function DichVuPage() {
  const navigate = useNavigate()

  return (
    <div className="page-dichvu">
      {/* Hero */}
      <section className="page-hero" id="dichvu-hero">
        <div className="ph-blur ph-blur-1" aria-hidden="true" />
        <div className="ph-blur ph-blur-2" aria-hidden="true" />
        <div className="section-container ph-content">
          <h1 className="page-hero-title" id="dichvu-heading">
            Dịch Vụ Traffic Thực
            <span className="page-hero-accent">Tăng Truy Cập – Tăng Doanh Thu</span>
          </h1>
          <p className="page-hero-desc">
            Khám phá các gói dịch vụ được thiết kế riêng để tăng thứ hạng Google,
            chuyển đổi khách hàng và doanh thu cho website của bạn. Traffic người thực 100%.
          </p>
          <div className="ph-pills">
            <span className="ph-pill">10M+ Traffic Đã Giao</span>
            <span className="ph-pill ph-pill-amber">98% Khách Hài Lòng</span>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="svc-section" id="services-section" aria-labelledby="svc-heading">
        <div className="section-container">
          <header className="svc-header">
            <p className="section-eyebrow">Dịch Vụ Của Chúng Tôi</p>
            <h2 className="section-title" id="svc-heading">Các Gói Dịch Vụ Traffic</h2>
            <p className="section-sub">Bốn loại traffic chuyên biệt, phủ toàn bộ nhu cầu tăng trưởng website của bạn</p>
          </header>
          <div className="svc-grid">
            {SERVICES.map(svc => (
              <article key={svc.id} id={svc.id} className="svc-card" aria-label={svc.title}
                style={{ '--svc-color': svc.color, '--svc-color-dim': svc.colorDim, '--svc-color-border': svc.colorBorder }}>
                <div className="svc-card-top">
                  <div className="svc-icon-wrap">{svc.icon}</div>
                  <div>
                    <div className="svc-sub">{svc.sub}</div>
                    <h3 className="svc-title">{svc.title}</h3>
                  </div>
                </div>
                <p className="svc-desc">{svc.desc}</p>
                <ul className="svc-features">
                  {svc.features.map((f, i) => (
                    <li key={i}>
                      <span className="svc-check" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#quytrinh-section" className="btn svc-btn">
                  Tìm Hiểu Thêm
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <div className="svc-card-glow" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process flow */}
      <QuyTrinh />

      {/* USPs */}
      <section className="usp-section" id="usp-section" aria-labelledby="usp-heading">
        <div className="section-container">
          <header className="usp-header">
            <p className="section-eyebrow">Tại Sao Chọn Chúng Tôi</p>
            <h2 className="section-title" id="usp-heading">Cam Kết Vượt Trội</h2>
          </header>
          <div className="usp-grid">
            {USPS.map(u => (
              <div key={u.id} id={u.id} className="usp-panel" style={{ '--usp-color': u.color }}>
                <div className="usp-icon">{u.icon}</div>
                <h3 className="usp-title">{u.title}</h3>
                <p className="usp-desc">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-cta-section" id="dichvu-cta">
        <div className="section-container">
          <div className="page-cta-panel">
            <div className="page-cta-glow" aria-hidden="true" />
            <h2 className="page-cta-title">Sẵn Sàng Tăng Traffic Website?</h2>
            <p className="page-cta-sub">Bắt đầu ngay hôm nay — Hỗ trợ 24/7 — Hoàn tiền 100% nếu không đạt chỉ tiêu</p>
            <a href="/bao-gia" id="dichvu-cta-btn" className="btn btn-amber btn-lg page-cta-btn"
               onClick={(e) => { e.preventDefault(); navigate('/bao-gia'); }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              MUA TRAFFIC NGAY
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
