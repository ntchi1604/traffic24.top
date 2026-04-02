import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Reusable SVG icons (no emoji) ── */
const IcoCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="rgba(92,255,160,0.15)" stroke="#5CFFA0" strokeWidth="1.4" />
    <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#5CFFA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IcoChart = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="10" width="3.5" height="6" rx="1" fill="#1A7FFF" opacity="0.7" />
    <rect x="7.25" y="7" width="3.5" height="9" rx="1" fill="#1A7FFF" opacity="0.85" />
    <rect x="12.5" y="3" width="3.5" height="13" rx="1" fill="#1A7FFF" />
    <path d="M3.75 10 L9 7 L14.25 3" stroke="#FFB347" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const IcoRocket = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 2C9 2 13 4 13 9L9 13 5 9C5 4 9 2 9 2Z" fill="rgba(255,140,0,0.2)" stroke="#FF8C00" strokeWidth="1.4" />
    <circle cx="9" cy="8" r="1.8" fill="#FFB347" />
    <path d="M6.5 12.5 L4 15M11.5 12.5 L14 15" stroke="#FF8C00" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const BENEFITS = [
  { icon: <IcoCheck />, title: 'Thiết Lập Tài Khoản Ngay', sub: 'Trong vài phút' },
  { icon: <IcoChart />, title: 'Truy Cập Analytics Chi Tiết', sub: 'Real-time dashboard' },
  { icon: <IcoRocket />, title: 'Mở Rộng Kinh Doanh', sub: 'Không giới hạn' },
]

function StrengthBar({ password }) {
  const score = password.length === 0 ? 0
    : password.length < 6 ? 1
      : password.length < 10 ? 2
        : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3
  const labels = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh']
  const colors = ['', '#FF4444', '#FFB347', '#1A7FFF', '#5CFFA0']
  return score > 0 ? (
    <div className="strength-bar-wrap" aria-live="polite">
      <div className="strength-bars">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="strength-seg" style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  ) : null
}

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8C1 8 3.5 3 8 3s7 5 7 5-2.5 5-7 5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0010.4 10M4.2 4.3C2.6 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.7-1M6 3.1C6.6 3 7.3 3 8 3c4.5 0 7 5 7 5s-.8 1.6-2.2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export default function DangKyPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', pass: '', confirm: '', refCode: '', accountType: 'mua_traffic' })
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [terms, setTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!form.username.trim()) e.username = 'Vui lòng nhập tên đăng nhập'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) e.username = 'Tên đăng nhập 3-20 ký tự, không dấu'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ'
    if (form.pass.length < 8) e.pass = 'Mật khẩu ít nhất 8 ký tự'
    if (form.pass !== form.confirm) e.confirm = 'Mật khẩu không khớp'
    if (!terms) e.terms = 'Bạn cần đồng ý điều khoản'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
  }


  const FIELD_ICONS = {
    name: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M2 13.5C2 11 4.7 9 8 9s6 2 6 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
    username: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
    email: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M1.5 6l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>,
    pass: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="10.5" r="1" fill="currentColor" /></svg>,
    confirm: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="10.5" r="1" fill="currentColor" /></svg>,
    refCode: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="6" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" /><path d="M2.5 6h11v2h-11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 6v8M5.5 6C4.5 6 4 5 4 4s1-2 2-2 2 1 2 4c0-3 1-4 2-4s2 1 2 2-1 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  }

  const field = (id, label, type, extra = {}) => (
    <div className="auth-field" key={id}>
      <label className="auth-label" htmlFor={`dk-${id}`}>{label}</label>
      <div className={`auth-input-wrap${errors[id] ? ' auth-input-error' : ''}`}>
        <span className="auth-input-icon" aria-hidden="true">{FIELD_ICONS[id]}</span>
        <input
          id={`dk-${id}`}
          type={type}
          className="auth-input"
          value={form[id]}
          onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: '' })) }}
          aria-describedby={errors[id] ? `dk-${id}-err` : undefined}
          aria-invalid={!!errors[id]}
          {...extra}
        />
        {id === 'pass' && (
          <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)} aria-label="Toggle mật khẩu">
            {showPass ? <EyeOff /> : <EyeOpen />}
          </button>
        )}
        {id === 'confirm' && (
          <button type="button" className="auth-eye" onClick={() => setShowConf(v => !v)} aria-label="Toggle xác nhận">
            {showConf ? <EyeOff /> : <EyeOpen />}
          </button>
        )}
      </div>
      {id === 'pass' && <StrengthBar password={form.pass} />}
      {errors[id] && <p id={`dk-${id}-err`} className="auth-err" role="alert">{errors[id]}</p>}
    </div>
  )

  if (submitted) return (
    <div className="page-auth">
      <section className="auth-section">
        <div className="auth-success-panel">
          <div className="auth-success-icon" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" fill="rgba(92,255,160,0.12)" stroke="#5CFFA0" strokeWidth="2" />
              <path d="M18 32l10 10 18-18" stroke="#5CFFA0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="auth-success-title">Tài Khoản Đã Được Tạo!</h1>
          <p className="auth-success-sub">Chào mừng bạn đến với Traffic24h. Kiểm tra email để xác nhận tài khoản.</p>
          <button className="btn btn-amber btn-lg" onClick={() => navigate('/dang-nhap')}>Đăng Nhập Ngay</button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="page-auth page-dangky">
      <div className="ph-blur ph-blur-1" aria-hidden="true" />
      <div className="ph-blur ph-blur-2" aria-hidden="true" />

      <section className="auth-section" aria-labelledby="dangky-heading">
        {/* Left panel */}
        <aside className="auth-left" aria-label="Lợi ích đăng ký">
          <div className="auth-left-inner">
            {/* Illustration */}
            <div className="auth-illo" aria-hidden="true">
              <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="gateGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0056CC" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#001A33" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <ellipse cx="140" cy="200" rx="120" ry="30" fill="url(#gateGlow)" />
                {/* Arch */}
                <path d="M80 180 L80 80 Q80 40 140 40 Q200 40 200 80 L200 180" fill="none" stroke="rgba(26,127,255,0.4)" strokeWidth="2" />
                <path d="M90 180 L90 85 Q90 55 140 55 Q190 55 190 85 L190 180" fill="rgba(0,86,204,0.08)" stroke="rgba(26,127,255,0.6)" strokeWidth="1.5" filter="url(#glow)" />
                {/* Arch glow */}
                <path d="M90 85 Q90 55 140 55 Q190 55 190 85" fill="none" stroke="rgba(255,140,0,0.7)" strokeWidth="2.5" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </path>
                {/* Person */}
                <circle cx="140" cy="115" r="12" fill="#1A4A80" stroke="#2A6AFF" strokeWidth="1" />
                <ellipse cx="140" cy="112" rx="8" ry="5" fill="#0A2050" />
                <circle cx="137" cy="116" r="2" fill="rgba(255,255,255,0.7)" />
                <circle cx="143" cy="116" r="2" fill="rgba(255,255,255,0.7)" />
                <rect x="130" y="127" width="20" height="28" rx="5" fill="#0A3080" stroke="#1A5CCC" strokeWidth="1" />
                <rect x="118" y="130" width="14" height="8" rx="4" fill="#0A3080" />
                <rect x="148" y="130" width="14" height="8" rx="4" fill="#0A3080" />
                {/* Data nodes */}
                {[[55, 90, '#FF8C00'], [225, 85, '#1A7FFF'], [50, 150, '#5CFFA0'], [230, 160, '#FFB347']].map(([x, y, c], i) => (
                  <circle key={i} cx={x} cy={y} r="5" fill={c} filter="url(#glow)" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${y};${y - 6};${y}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                ))}
                {/* Connecting lines */}
                <line x1="60" y1="90" x2="90" y2="100" stroke="rgba(26,127,255,0.3)" strokeWidth="1" strokeDasharray="3 4" />
                <line x1="220" y1="85" x2="190" y2="100" stroke="rgba(255,140,0,0.3)" strokeWidth="1" strokeDasharray="3 4" />
              </svg>
            </div>

            <h2 className="auth-left-title">Tham Gia <span style={{ color: 'var(--amber-lt)' }}>Traffic24h</span> Ngay</h2>
            <p className="auth-left-sub">Hàng nghìn doanh nghiệp đang tăng trưởng mỗi ngày</p>

            <div className="auth-benefits">
              {BENEFITS.map((b, i) => (
                <div key={i} className="auth-benefit-item">
                  <div className="auth-benefit-icon">{b.icon}</div>
                  <div>
                    <div className="auth-benefit-title">{b.title}</div>
                    <div className="auth-benefit-sub">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-social-proof">
              <div className="asp-avatars" aria-hidden="true">
                {['#0056CC', '#FF8C00', '#5CFFA0', '#1A7FFF'].map((c, i) => (
                  <div key={i} className="asp-avatar" style={{ background: c, marginLeft: i > 0 ? -10 : 0 }} />
                ))}
              </div>
              <div>
                <div className="asp-count">2,400+ doanh nghiệp đã đăng ký</div>
                <div className="asp-stars" aria-label="5 sao">★★★★★</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right panel — form */}
        <div className="auth-right">
          <div className="auth-panel">
            <div className="auth-panel-glow" aria-hidden="true" />
            <h1 className="auth-title" id="dangky-heading">Tạo Tài Khoản Miễn Phí</h1>
            <p className="auth-subtitle">Bắt đầu tăng traffic ngay hôm nay</p>

            <form onSubmit={handleSubmit} noValidate aria-label="Form đăng ký">
              <div className="auth-account-type">
                <button
                  type="button"
                  className={`type-btn ${form.accountType === 'mua_traffic' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, accountType: 'mua_traffic' })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Mua Traffic
                </button>
                <button
                  type="button"
                  className={`type-btn ${form.accountType === 'rut_gon_link' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, accountType: 'rut_gon_link' })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Rút Gọn Link
                </button>
              </div>

              {field('name', 'Họ và Tên', 'text', { placeholder: 'Nguyễn Văn A', autoComplete: 'name' })}
              {field('username', 'Tên Đăng Nhập', 'text', { placeholder: 'nguyen_van_a', autoComplete: 'username' })}
              {field('email', 'Địa Chỉ Email', 'email', { placeholder: 'email@domain.com', autoComplete: 'email' })}
              {field('pass', 'Mật Khẩu', showPass ? 'text' : 'password', { placeholder: 'Tối thiểu 8 ký tự', autoComplete: 'new-password' })}
              {field('confirm', 'Xác Nhận Mật Khẩu', showConf ? 'text' : 'password', { placeholder: 'Nhập lại mật khẩu', autoComplete: 'new-password' })}
              {field('refCode', 'Mã Giới Thiệu (Nếu có)', 'text', { placeholder: 'Nhập mã giới thiệu...', autoComplete: 'off' })}

              <div className="auth-checks">
                <label className="auth-check-label" htmlFor="dk-terms">
                  <input id="dk-terms" type="checkbox" className="auth-checkbox" checked={terms} onChange={e => {
                    if (e.target.checked) setShowTermsModal(true)
                    else setTerms(false)
                  }} aria-required="true" />
                  <span className="auth-checkmark" aria-hidden="true" />
                  <span>Tôi đồng ý với <a href="#" className="auth-link" onClick={e => { e.preventDefault(); setShowTermsModal(true) }}>Điều Khoản</a>, <a href="#" className="auth-link" onClick={e => { e.preventDefault(); setShowTermsModal(true) }}>Bảo Mật</a> &amp; <a href="#" className="auth-link" onClick={e => { e.preventDefault(); setShowTermsModal(true) }}>Hoàn Tiền</a></span>
                </label>
                {errors.terms && <p className="auth-err" role="alert">{errors.terms}</p>}
              </div>

              <button id="dangky-submit-btn" type="submit" className="btn btn-amber auth-submit-btn">
                TẠO TÀI KHOẢN NGAY
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <p className="auth-switch">Đã có tài khoản? <a href="/dang-nhap" id="dangky-login-link" className="auth-link auth-link-amber" onClick={e => { e.preventDefault(); navigate('/dang-nhap') }}>Đăng Nhập</a></p>
          </div>
        </div>
      </section>

      {showTermsModal && (
        <div className="terms-modal-overlay">
          <div className="terms-modal-content">
            <h3 className="terms-modal-title">Điều Khoản, Bảo Mật & Hoàn Tiền</h3>
            <div className="terms-modal-text">
              <p>Điều Khoản Sử Dụng:</p>
              <ul>
                <li>Không vi phạm pháp luật khi sử dụng dịch vụ bơm traffic (tuyên truyền chống phá, đồi trụy, cờ bạc lừa đảo).</li>
                <li>Bạn chịu hoàn toàn trách nhiệm về nội dung của các URL chiến dịch nằm trên hệ thống của chúng tôi.</li>
              </ul>
              <p>Chính Sách Bảo Mật:</p>
              <ul>
                <li>Mật khẩu của bạn được mã hoá một chiều, đảm bảo bảo mật.</li>
                <li>Hệ thống cam kết giấu kín và không bao giờ chia sẻ/bán các URL chiến dịch cho bên thứ ba dưới bất kì hình thức nào.</li>
              </ul>
              <p>Chính Sách Hoàn Tiền:</p>
              <ul>
                <li>Hỗ trợ rút và hoàn lại số tiền chưa sử dụng về tài khoản ngân hàng (sau khi đã trừ phí xử lý nếu có).</li>
                <li>Nếu chiến dịch gặp lỗi/bị huỷ ngang trước khi hoàn tất, hệ thống sẽ hoàn Credit dư để bạn rút hoặc mua dịch vụ khác.</li>
              </ul>
            </div>
            <div className="terms-modal-actions">
              <button 
                type="button"
                className="btn terms-btn-cancel" 
                onClick={() => { setTerms(false); setShowTermsModal(false) }}
              >
                Hủy
              </button>
              <button 
                type="button"
                className="btn btn-amber" 
                onClick={() => { setTerms(true); setShowTermsModal(false) }}
              >
                Tôi Đã Đọc & Đồng Ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
