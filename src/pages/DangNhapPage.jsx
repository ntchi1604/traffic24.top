import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1.5 6l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)
const IcoLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r="1" fill="currentColor" />
  </svg>
)
const EyeOpen = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8C1 8 3.5 3 8 3s7 5 7 5-2.5 5-7 5S1 8 1 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)
const EyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0010.4 10M4.2 4.3C2.6 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.7-1M6 3.1C6.6 3 7.3 3 8 3c4.5 0 7 5 7 5s-.8 1.6-2.2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

export default function DangNhapPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', pass: '' })
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email không hợp lệ'
    if (form.pass.length < 6) e.pass = 'Mật khẩu ít nhất 6 ký tự'
    return e
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/') }, 1200)
  }

  return (
    <div className="page-auth page-dangnhap">
      <div className="ph-blur ph-blur-1" aria-hidden="true" />
      <div className="ph-blur ph-blur-2" aria-hidden="true" />

      {/* Geometric bg pattern */}
      <div className="dn-geo-bg" aria-hidden="true">
        <svg viewBox="0 0 800 600" fill="none" preserveAspectRatio="xMidYMid slice">
          {[...Array(8)].map((_, i) => (
            <polygon key={i}
              points={`${100 + i * 90},${50 + i * 40} ${160 + i * 90},${80 + i * 40} ${160 + i * 90},${140 + i * 40} ${100 + i * 90},${170 + i * 40} ${40 + i * 90},${140 + i * 40} ${40 + i * 90},${80 + i * 40}`}
              fill="none" stroke="rgba(0,86,204,0.08)" strokeWidth="1"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <line key={i} x1={i * 200} y1="0" x2={i * 200 + 400} y2="600" stroke="rgba(26,127,255,0.04)" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <section className="auth-section auth-section-center" aria-labelledby="dangnhap-heading">
        <div className="auth-panel auth-panel-solo">
          <div className="auth-panel-glow" aria-hidden="true" />

          {/* Security illustration */}
          <div className="auth-illo auth-illo-sm" aria-hidden="true">
            <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow2"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {/* Shield */}
              <path d="M80 10L40 28v28c0 24 18 45 40 52 22-7 40-28 40-52V28L80 10z"
                fill="rgba(0,86,204,0.12)" stroke="rgba(26,127,255,0.5)" strokeWidth="1.5" filter="url(#glow2)" />
              <path d="M80 22L52 35v20c0 17 13 32 28 37 15-5 28-20 28-37V35L80 22z"
                fill="rgba(0,86,204,0.2)" stroke="rgba(26,127,255,0.4)" strokeWidth="1" />
              {/* Lock body */}
              <rect x="66" y="58" width="28" height="22" rx="4" fill="rgba(26,127,255,0.4)" stroke="rgba(26,127,255,0.7)" strokeWidth="1.5" />
              <path d="M72 58V52a8 8 0 0116 0v6" stroke="#1A7FFF" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="80" cy="70" r="3" fill="#FFB347" filter="url(#glow2)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Key */}
              <circle cx="30" cy="45" r="10" fill="none" stroke="#FFB347" strokeWidth="2" filter="url(#glow2)" />
              <circle cx="30" cy="45" r="5" fill="rgba(255,179,71,0.3)" />
              <line x1="40" y1="45" x2="58" y2="45" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
              <line x1="54" y1="45" x2="54" y2="50" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
              <line x1="58" y1="45" x2="58" y2="52" stroke="#FFB347" strokeWidth="2" strokeLinecap="round" />
              {/* Data streams */}
              {[[110, 30, '#1A7FFF'], [125, 60, '#FF8C00'], [105, 80, '#5CFFA0']].map(([x, y, c], i) => (
                <circle key={i} cx={x} cy={y} r="3" fill={c} opacity="0.7" filter="url(#glow2)">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
          </div>

          <h1 className="auth-title" id="dangnhap-heading">Chào Mừng Trở Lại</h1>
          <p className="auth-subtitle">Đăng nhập vào tài khoản của bạn</p>

          <form onSubmit={handleSubmit} noValidate aria-label="Form đăng nhập">
            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="dn-email">Email hoặc Tên Đăng Nhập</label>
              <div className={`auth-input-wrap${errors.email ? ' auth-input-error' : ''}`}>
                <span className="auth-input-icon" aria-hidden="true"><IcoMail /></span>
                <input id="dn-email" type="email" className="auth-input"
                  value={form.email} placeholder="email@domain.com"
                  autoComplete="email" aria-invalid={!!errors.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }} />
              </div>
              {errors.email && <p className="auth-err" role="alert">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="dn-pass">Mật Khẩu</label>
              <div className={`auth-input-wrap${errors.pass ? ' auth-input-error' : ''}`}>
                <span className="auth-input-icon" aria-hidden="true"><IcoLock /></span>
                <input id="dn-pass" type={showPass ? 'text' : 'password'} className="auth-input"
                  value={form.pass} placeholder="••••••••"
                  autoComplete="current-password" aria-invalid={!!errors.pass}
                  onChange={e => { setForm(f => ({ ...f, pass: e.target.value })); setErrors(er => ({ ...er, pass: '' })) }} />
                <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)} aria-label="Toggle mật khẩu">
                  {showPass ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {errors.pass && <p className="auth-err" role="alert">{errors.pass}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="auth-row-between">
              <label className="auth-check-label auth-check-inline" htmlFor="dn-remember">
                <input id="dn-remember" type="checkbox" className="auth-checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span className="auth-checkmark" aria-hidden="true" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" id="dn-forgot-link" className="auth-link auth-link-amber" onClick={e => e.preventDefault()}>
                Quên mật khẩu?
              </a>
            </div>

            <button id="dangnhap-submit-btn" type="submit" className={`btn auth-submit-btn auth-submit-sapphire${loading ? ' auth-btn-loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="auth-spinner" aria-hidden="true" />
              ) : (
                <>
                  ĐĂNG NHẬP
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M2 9h14M9 2l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">Chưa có tài khoản? <a href="/dang-ky" id="dangnhap-register-link" className="auth-link auth-link-amber" onClick={e => { e.preventDefault(); navigate('/dang-ky') }}>Tạo Tài Khoản Ngay</a></p>

        </div>
      </section>
    </div>
  )
}
