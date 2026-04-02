const FEATURES = [
  {
    color: 'blue',
    title: 'Traffic User Thực 100%',
    desc: 'Lưu lượng truy cập từ người dùng thật, không bot, không IP ảo — đảm bảo an toàn và bền vững cho website của bạn.',
    icon: (
      <svg width="34" height="34" viewBox="0 -2 34 34" fill="none">
        <circle cx="10" cy="10" r="4" stroke="#4DA6FF" strokeWidth="2" />
        <circle cx="24" cy="10" r="4" stroke="#4DA6FF" strokeWidth="2" />
        <path d="M4 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#4DA6FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#4DA6FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 28h0" stroke="#4DA6FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: 'green',
    title: 'Tăng Thứ Hạng Google',
    desc: 'Traffic chất lượng cao giúp cải thiện tín hiệu người dùng, thúc đẩy thứ hạng tìm kiếm và tăng uy tín domain.',
    icon: (
      <svg width="34" height="34" viewBox="1 -0.5 34 34" fill="none">
        <rect x="5" y="4" width="16" height="20" rx="3" stroke="#5CFFA0" strokeWidth="2" />
        <path d="M9 9h8M9 13h6M9 17h4" stroke="#5CFFA0" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="25" cy="23" r="4" stroke="#5CFFA0" strokeWidth="2" />
        <path d="M25 19v-2M25 29v-2M21 23h-2M31 23h-2" stroke="#5CFFA0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: 'blue',
    title: 'Báo Cáo Chi Tiết',
    desc: 'Theo dõi lưu lượng truy cập theo thời gian thực với dashboard trực quan, báo cáo hàng tháng minh bạch và đầy đủ.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="4" y="4" width="26" height="22" rx="3" stroke="#4DA6FF" strokeWidth="2" />
        <rect x="9" y="17" width="4" height="7" rx="1" fill="#4DA6FF" opacity=".35" stroke="#4DA6FF" strokeWidth="1.5" />
        <rect x="15" y="12" width="4" height="12" rx="1" fill="#4DA6FF" opacity=".35" stroke="#4DA6FF" strokeWidth="1.5" />
        <rect x="21" y="8" width="4" height="16" rx="1" fill="#FF8C00" opacity=".5" stroke="#FF8C00" strokeWidth="1.5" />
        <path d="M4 30h26" stroke="#4DA6FF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 20 L15 15 L21 11" stroke="#FF8C00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: 'green',
    title: 'Tăng Traffic Bền Vững',
    desc: 'Chiến lược traffic dài hạn giúp website phát triển ổn định, thu hút khách hàng tiềm năng từ lưu lượng tự nhiên liên tục.',
    icon: (
      <svg width="34" height="34" viewBox="0.5 1.5 34 34" fill="none">
        <path d="M4 26L10 18L16 22L24 10L30 14" stroke="#5CFFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30" cy="14" r="3" fill="#FF8C00" stroke="#FF8C00" strokeWidth="1" />
        <circle cx="4" cy="26" r="3" fill="#5CFFA0" stroke="#5CFFA0" strokeWidth="1" />
        <path d="M28 8v6h6" stroke="#5CFFA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section className="features" id="features-section" aria-labelledby="features-heading">
      <div className="section-container">
        <header className="features-header">
          <p className="section-eyebrow">Tại Sao Chọn Chúng Tôi</p>
          <h2 className="section-title" id="features-heading">Lợi Ích Của Dịch Vụ Traffic</h2>
          <p className="section-sub">Giải pháp traffic toàn diện giúp website của bạn phát triển bền vững và hiệu quả</p>
        </header>
        <div className="features-grid" role="list">
          {FEATURES.map((f, i) => (
            <article key={i} className="feat-card" id={`feature-card-${i + 1}`} role="listitem">
              <div className={`feat-icon-wrap feat-${f.color}`} aria-hidden="true">{f.icon}</div>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
