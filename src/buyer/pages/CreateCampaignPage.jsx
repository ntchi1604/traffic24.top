import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ─── SVG Icons ─── */
function IcoSearch() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
      <defs><radialGradient id="sg1" cx="40%" cy="35%"><stop offset="0%" stopColor="#FF8C00" stopOpacity="0.3" /><stop offset="100%" stopColor="#FF8C00" stopOpacity="0" /></radialGradient></defs>
      <circle cx="16" cy="16" r="11" fill="url(#sg1)" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M25 25l5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 16h6M16 13v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function IcoBrowser() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
      <defs><radialGradient id="bg1" cx="40%" cy="30%"><stop offset="0%" stopColor="#1A7FFF" stopOpacity="0.2" /><stop offset="100%" stopColor="#1A7FFF" stopOpacity="0" /></radialGradient></defs>
      <rect x="3" y="7" width="30" height="22" rx="3" fill="url(#bg1)" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3" y1="14" x2="33" y2="14" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.6" />
      <circle cx="8" cy="10.5" r="1.5" fill="currentColor" fillOpacity="0.7" />
      <circle cx="13" cy="10.5" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="18" cy="10.5" r="1.5" fill="currentColor" fillOpacity="0.3" />
      <rect x="7" y="18" width="14" height="1.5" rx="0.75" fill="currentColor" fillOpacity="0.4" />
      <rect x="7" y="22" width="10" height="1.5" rx="0.75" fill="currentColor" fillOpacity="0.3" />
    </svg>
  )
}
function IcoNetwork() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
      <defs><radialGradient id="ng1" cx="50%" cy="50%"><stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" /><stop offset="100%" stopColor="#A855F7" stopOpacity="0" /></radialGradient></defs>
      <circle cx="18" cy="18" r="14" fill="url(#ng1)" />
      <circle cx="18" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="5" cy="22" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="31" cy="22" r="3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="18" y1="8.2" x2="18" y2="15.2" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="8" y1="20" x2="15.2" y2="18.6" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
      <line x1="28" y1="20" x2="20.8" y2="18.6" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
    </svg>
  )
}
function IcoEmail() {
  return (
    <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
      <rect x="3" y="8" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" fill="rgba(26,127,255,0.08)" />
      <path d="M3 11l15 10L33 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IcoDesktop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="2" y="3" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 21h8M12 16v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IcoMobile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" />
    </svg>
  )
}
function IcoMixed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 18h4M8 14v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="16" y="7" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19.5" cy="17" r="0.8" fill="currentColor" />
    </svg>
  )
}
function VietnamFlag({ size = 28 }) {
  return (
    <svg viewBox="0 0 30 20" width={size} height={Math.round(size * 2 / 3)} aria-label="Co Viet Nam">
      <rect width="30" height="20" fill="#DA251D" rx="2" />
      <polygon points="15,3.5 16.9,9.2 22.8,9.2 18.1,12.7 19.9,18.5 15,15 10.1,18.5 11.9,12.7 7.2,9.2 13.1,9.2" fill="#FFFF00" />
    </svg>
  )
}

/* ─── Data ─── */
const TRAFFIC_OPTS = [
  { id: 'organic', label: 'Organic', sub: 'Google tu nhien', Icon: IcoSearch, hasKeyword: true, hasImage: true },
  { id: 'direct', label: 'Direct', sub: 'Truy cap truc tiep', Icon: IcoBrowser, hasKeyword: false, hasImage: false },
  { id: 'social', label: 'Social', sub: 'Mang xa hoi', Icon: IcoNetwork, hasKeyword: false, hasImage: false },
]
const TRAFFIC_SUBS = {
  organic: 'Google tự nhiên',
  direct: 'Truy cập trực tiếp',
  social: 'Mạng xã hội',
}
const DEVICE_OPTS = [
  { id: 'mixed', label: 'Hỗn Hợp', Icon: IcoMixed },
  { id: 'desktop', label: 'Desktop', Icon: IcoDesktop },
  { id: 'mobile', label: 'Mobile', Icon: IcoMobile },
]
const DURATIONS = [60, 90, 120, 150, 200]

export default function CreateCampaignPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const preselect = location.state ?? {}

  const [form, setForm] = useState({
    name: '',
    trafficType: preselect.trafficType ?? 'organic',
    version:     preselect.version     ?? 1,
    duration:    preselect.duration    ?? 60,
    viewsPerDay: 500,
    totalViews: 1000,
    distributeEvenly: true,
    keywords: [{ id: 1, keyword: '', url: '', imageUrl: '', traffic: 100 }],
    device: 'mixed',
    discountCode: '',
    notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const addKw = () => setForm(f => ({
    ...f,
    keywords: [...f.keywords, { id: Date.now(), keyword: '', url: '', imageUrl: '', traffic: 100 }]
  }))
  const removeKw = (id) => setForm(f => ({ ...f, keywords: f.keywords.filter(k => k.id !== id) }))
  const updateKw = (id, field, val) => setForm(f => ({
    ...f,
    keywords: f.keywords.map(k => k.id === id ? { ...k, [field]: val } : k)
  }))

  const verMult = form.version === 1 ? 1.5 : 1.0
  const durMult = form.duration / 60
  const unitPrice = 0.005 * verMult * durMult
  const subtotal = form.totalViews * unitPrice
  const discount = form.discountCode.toUpperCase() === 'REAL10' ? subtotal * 0.10 : 0
  const total = subtotal - discount
  const fmt = (n) => `$${n.toFixed(2)}`
  const currentOpt = TRAFFIC_OPTS.find(t => t.id === form.trafficType)
  const hasKw = currentOpt?.hasKeyword ?? false
  const hasImg = currentOpt?.hasImage ?? true
  const isSocial = form.trafficType === 'social'
  const gridCols = [
    (hasKw || isSocial) ? '1.2fr' : null,
    '1.6fr',
    hasImg ? '1.4fr' : null,
    '1fr',
    '32px',
  ].filter(Boolean).join(' ')

  // Traffic validation
  const totalKwTraffic = form.keywords.reduce((s, k) => s + (Number(k.traffic) || 0), 0)
  const pct = form.viewsPerDay > 0 ? totalKwTraffic / form.viewsPerDay : 0
  const isOverLimit = pct > 1            // >100% → lỗi đỏ
  const isNearLimit = !isOverLimit && pct >= 0.8  // 80–100% → cảnh báo vàng

  return (
    <>
      <div className="cr-root" id="create-campaign-page">
        <div className="cr-header">
          <button className="wiz-back" onClick={() => navigate('/campaigns')}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Quản lý chiến dịch
          </button>
        </div>

        <div className="cr-layout">
          {/* ── FORM ── */}
          <div className="cr-form">

            {/* Panel 1 */}
            <div className="cr-panel">
              <div className="cr-panel-title">
                <span className="cr-panel-num">01</span>Thông Tin &amp; Loại Traffic
              </div>
              <div className="cr-field-group">
                <label className="cr-label">
                  Tên Chiến Dịch <span className="cr-req">*</span>
                </label>
                <div className="cr-input-icon-wrap">
                  <svg className="cr-input-prefix-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input className="cr-input cr-input-has-icon" id="cr-name" type="text"
                    placeholder="VD: SEO Blog Thuong Mai Dien Tu Q2"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
              </div>
              <div className="cr-field-group">
                <label className="cr-label">Loại Traffic</label>
                <div className="cr-traffic-cards">
                  {TRAFFIC_OPTS.map(t => {
                    const active = form.trafficType === t.id
                    return (
                      <button key={t.id} id={`cr-traffic-${t.id}`}
                        className={`cr-traffic-card${active ? ' cr-traffic-active' : ''}`}
                        onClick={() => set('trafficType', t.id)} type="button">
                        <div className="cr-traffic-icon-wrap"><t.Icon /></div>
                        <span className="cr-traffic-label">{t.label}</span>
                        <span className="cr-traffic-sub">{TRAFFIC_SUBS[t.id]}</span>
                        {active && <span className="cr-traffic-glow-ring" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="cr-panel">
              <div className="cr-panel-title">
                <span className="cr-panel-num">02</span>Phiên Bản Mô Phỏng
              </div>
              <div className="cr-version-grid">
                <button id="cr-ver-1" type="button"
                  className={`cr-ver-card${form.version === 1 ? ' cr-ver-active' : ''}`}
                  onClick={() => set('version', 1)}>
                  <div className="cr-ver-badge-wrap">
                    <div className="cr-ver-badge">
                      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path d="M6 1l1.2 3.6H11l-3 2.2 1.1 3.5L6 8 1.9 10.3 3 6.8l-3-2.2H4.8z" fill="#FF8C00" />
                      </svg>
                      Tốt nhất
                    </div>
                  </div>
                  <div className="cr-ver-icon">
                    <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
                      <defs>
                        <radialGradient id="v1g" cx="40%" cy="35%">
                          <stop offset="0%" stopColor="#FF8C00" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="24" cy="24" r="20" fill="url(#v1g)" />
                      <path d="M14 24l6 6 14-14" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 17h4M10 24h4M10 31h4" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
                    </svg>
                  </div>
                  <div className="cr-ver-title">Version 1</div>
                  <div className="cr-ver-desc">
                    <strong>(2 bước)</strong> Chờ X giây → click link nội bộ → chờ thêm 25–35 giây.
                    Tín hiệu tự nhiên hơn, bounce rate thấp hơn.
                  </div>
                </button>

                <button id="cr-ver-2" type="button"
                  className={`cr-ver-card cr-ver-card-2${form.version === 2 ? ' cr-ver-2-active' : ''}`}
                  onClick={() => set('version', 2)}>
                  <div className="cr-ver-icon">
                    <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
                      <defs>
                        <radialGradient id="v2g" cx="40%" cy="35%">
                          <stop offset="0%" stopColor="#1A7FFF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#1A7FFF" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="24" cy="24" r="20" fill="url(#v2g)" />
                      <path d="M24 13v16M24 33v2" stroke="#1A7FFF" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="cr-ver-title">Version 2</div>
                  <div className="cr-ver-desc">
                    <strong>(1 bước)</strong> Chờ X thời gian hết là xong.
                    Đơn giản, cấu hình nhanh, giá thấp hơn.
                  </div>
                </button>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="cr-panel">
              <div className="cr-panel-title">
                <span className="cr-panel-num">03</span>Thời Gian Mỗi Phiên
              </div>
              <div className="cr-dur-group">
                {DURATIONS.map(d => (
                  <button key={d} id={`cr-dur-${d}`} type="button"
                    className={`cr-dur-pill${form.duration === d ? ' cr-dur-active' : ''}`}
                    onClick={() => set('duration', d)}>
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12" className="cr-dur-icon">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Gói {d}s
                    {form.duration === d && <span className="cr-dur-glow" />}
                  </button>
                ))}
              </div>
              <p className="cr-hint">Thời gian user ở lại mỗi phiên. Dài hơn = tự nhiên hơn = giá cao hơn.</p>
            </div>

            {/* Panel 4 — Khối Lượng Traffic */}
            <div className="cr-panel">
              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <span className="cr-panel-num">04</span>
                <h2 className="cr-panel-title" style={{ margin: 0 }}>Khối Lượng Traffic</h2>
              </div>

              {/* Two numeric inputs */}
              <div className="cr-vol-row">
                <div className="cr-field-group">
                  <label className="cr-label" htmlFor="cr-views-day">Số View / Ngày</label>
                  <div className="cr-num-input-wrap">
                    <input className="cr-input cr-num-input" id="cr-views-day" type="number" min={100} step={100}
                      value={form.viewsPerDay} onChange={e => set('viewsPerDay', +e.target.value)} />
                    <span className="cr-num-unit">lượt</span>
                  </div>
                </div>
                <div className="cr-field-group">
                  <label className="cr-label" htmlFor="cr-total-views">Tổng View Mua</label>
                  <div className="cr-num-input-wrap">
                    <input className="cr-input cr-num-input" id="cr-total-views" type="number" min={1000} step={1000}
                      value={form.totalViews} onChange={e => set('totalViews', +e.target.value)} />
                    <span className="cr-num-unit">lượt</span>
                  </div>
                </div>
              </div>

              {/* Toggle row */}
              <label className="cr-toggle-row" htmlFor="cr-distribute">
                <div className="cr-toggle-info">
                  <span className="cr-toggle-title">Chia đều view trong 24h mỗi ngày</span>
                  <span className="cr-toggle-sub">Traffic phân phối tự động theo giờ</span>
                </div>
                <div className={`cr-toggle${form.distributeEvenly ? ' cr-toggle-on' : ''}`}
                  id="cr-distribute" role="switch" aria-checked={form.distributeEvenly} tabIndex={0}
                  onClick={() => set('distributeEvenly', !form.distributeEvenly)}>
                  <div className="cr-toggle-thumb" />
                </div>
              </label>
            </div>

            {/* Panel 5 — Từ Khóa & Địa Chỉ Web */}
            <div className="cr-panel">
              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <span className="cr-panel-num">05</span>
                <h2 className="cr-panel-title" style={{ margin: 0 }}>Từ Khóa &amp; Địa Chỉ Web</h2>
              </div>

              {/* Column headers */}
              <div className="cr-kw-grid-header" style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, marginBottom: 6, padding: '0 4px' }}>
                {(hasKw || isSocial) && (
                  <span className="cr-label">{isSocial ? 'URL Bài Viết (Social)' : 'Từ Khóa'}</span>
                )}
                <span className="cr-label">URL Website</span>
                {hasImg && <span className="cr-label">URL Hình Ảnh</span>}
                <span className="cr-label">Traffic/Ngày</span>
                <span />
              </div>

              {/* Data rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.keywords.map((kw, idx) => (
                  <div key={kw.id} className="cr-kw-grid-row" style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, alignItems: 'center', padding: '2px 4px' }}>
                    {/* Col 1: keyword (Organic) | social post link (Social) | hidden (Direct) */}
                    {hasKw && (
                      <input id={`cr-kw-${idx}`} type="text" placeholder="Từ khóa SEO..."
                        value={kw.keyword} onChange={e => updateKw(kw.id, 'keyword', e.target.value)}
                        className="cr-kw-input"
                      />
                    )}
                    {isSocial && (
                      <input id={`cr-social-${idx}`} type="url"
                        placeholder="Link bài post (Facebook, Twitter, Youtube...)"
                        value={kw.keyword} onChange={e => updateKw(kw.id, 'keyword', e.target.value)}
                        className="cr-kw-input"
                      />
                    )}
                    {/* URL Website */}
                    <input id={`cr-url-${idx}`} type="url" placeholder="https://..."
                      value={kw.url} onChange={e => updateKw(kw.id, 'url', e.target.value)}
                      className="cr-kw-input"
                    />
                    {/* URL Hình Ảnh — ẩn với Direct */}
                    {hasImg && (
                      <input id={`cr-img-${idx}`} type="url" placeholder="https://img..."
                        value={kw.imageUrl} onChange={e => updateKw(kw.id, 'imageUrl', e.target.value)}
                        className="cr-kw-input"
                      />
                    )}
                    {/* Traffic */}
                    <input id={`cr-kwt-${idx}`} type="number" min={0} step={10}
                      placeholder="0" value={kw.traffic || ''}
                      onChange={e => updateKw(kw.id, 'traffic', +e.target.value)}
                      className="cr-kw-input cr-kw-num"
                      style={
                        isOverLimit
                          ? { borderColor: 'rgba(239,68,68,0.65)', background: 'rgba(127,29,29,0.25)', color: '#f87171', boxShadow: '0 0 0 2px rgba(239,68,68,0.14)' }
                          : isNearLimit
                            ? { borderColor: 'rgba(251,191,36,0.55)', background: 'rgba(120,80,0,0.2)', color: '#fcd34d', boxShadow: '0 0 0 2px rgba(251,191,36,0.12)' }
                            : { color: 'var(--amber-lt)' }
                      }
                    />
                    <button type="button" aria-label="Xóa dòng" className="cr-kw-del"
                      onClick={() => form.keywords.length > 1 && removeKw(kw.id)}
                      disabled={form.keywords.length === 1}
                    >
                      <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add row */}
              <div style={{ marginTop: 10 }}>
                <button id="cr-add-kw" type="button" onClick={addKw} className="cr-add-kw-btn">
                  <svg viewBox="0 0 18 18" fill="none" width="14" height="14">
                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  + Thêm từ khóa
                </button>
              </div>

              {/* ── Warning banner (80–100%) ── */}
              {isNearLimit && (
                <div id="cr-near-limit-banner" role="status" style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'rgba(251,191,36,0.07)',
                  border: '1px solid rgba(251,191,36,0.28)',
                  boxShadow: '0 4px 20px rgba(251,191,36,0.08)',
                  animation: 'fadeSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  {/* Top row: icon + title + remaining chip */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <svg viewBox="0 0 20 20" fill="none" width="15" height="15" style={{ flexShrink: 0 }}>
                        <path d="M10 2L18.5 17H1.5L10 2Z" stroke="#FBBF24" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M10 8v3.5M10 13.5v.5" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FCD34D', letterSpacing: '0.1px' }}>
                        Sắp đầy giới hạn ngày
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                      background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.30)',
                      color: '#FCD34D', whiteSpace: 'nowrap',
                    }}>
                      Còn {(form.viewsPerDay - totalKwTraffic).toLocaleString()} lượt
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 7 }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${Math.min(pct * 100, 100).toFixed(1)}%`,
                      background: pct >= 0.95
                        ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                        : 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                      transition: 'width 0.35s ease',
                    }} />
                  </div>
                  {/* Bottom row: used / limit */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(251,191,36,0.65)' }}>
                      Đã phân bổ <strong style={{ color: '#FBBF24' }}>{totalKwTraffic.toLocaleString()}</strong> lượt
                    </span>
                    <span style={{ fontSize: 11.5, color: 'rgba(251,191,36,0.65)' }}>
                      Giới hạn <strong style={{ color: '#FBBF24' }}>{form.viewsPerDay.toLocaleString()}</strong> / ngày
                    </span>
                  </div>
                </div>
              )}

              {/* ── Error banner (>100%) ── */}
              {isOverLimit && (
                <div id="cr-over-limit-banner" role="alert" style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  boxShadow: '0 4px 20px rgba(239,68,68,0.10)',
                  animation: 'fadeSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <svg viewBox="0 0 20 20" fill="none" width="15" height="15" style={{ flexShrink: 0 }}>
                        <path d="M10 2L18.5 17H1.5L10 2Z" stroke="#F87171" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M10 8v3.5M10 13.5v.5" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#F87171', letterSpacing: '0.1px' }}>
                        Vượt quá giới hạn ngày
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.30)',
                      color: '#FCA5A5', whiteSpace: 'nowrap',
                    }}>
                      +{(totalKwTraffic - form.viewsPerDay).toLocaleString()} lượt dư
                    </span>
                  </div>
                  {/* Progress bar — full + overflow */}
                  <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 7 }}>
                    <div style={{
                      height: '100%', width: '100%', borderRadius: 99,
                      background: 'linear-gradient(90deg, #EF4444, #F87171)',
                      boxShadow: '0 0 8px rgba(239,68,68,0.5)',
                    }} />
                  </div>
                  {/* Bottom row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, color: 'rgba(248,113,113,0.7)' }}>
                      Tổng phân bổ <strong style={{ color: '#F87171' }}>{totalKwTraffic.toLocaleString()}</strong> lượt
                    </span>
                    <span style={{ fontSize: 11.5, color: 'rgba(248,113,113,0.7)' }}>
                      Giới hạn <strong style={{ color: '#F87171' }}>{form.viewsPerDay.toLocaleString()}</strong> / ngày
                    </span>
                  </div>
                </div>
              )}
            </div>


            {/* Panel 6 */}
            <div className="cr-panel">
              <div className="cr-panel-title">
                <span className="cr-panel-num">06</span>Khu Vực &amp; Thiết Bị
              </div>
              <div className="cr-geo-row">
                <div className="cr-field-group">
                  <label className="cr-label">Thiết Bị</label>
                  <div className="cr-device-cards">
                    {DEVICE_OPTS.map(d => (
                      <button key={d.id} id={`cr-device-${d.id}`} type="button"
                        className={`cr-device-card${form.device === d.id ? ' cr-device-active' : ''}`}
                        onClick={() => set('device', d.id)}>
                        <d.Icon />
                        <span>{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="cr-field-group">
                  <label className="cr-label">Quốc Gia</label>
                  <div className="cr-locked-input" id="cr-country">
                    <VietnamFlag size={30} />
                    <span className="cr-locked-text">Việt Nam <em>(Mặc định)</em></span>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className="cr-locked-icon">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 7 */}
            <div className="cr-panel">
              <div className="cr-panel-title">
                <span className="cr-panel-num">07</span>Tùy Chọn Thêm
              </div>
              <div className="cr-field-group">
                <label className="cr-label">Mã Giảm Giá</label>
                <div className="cr-coupon-wrap">
                  <div className="cr-input-icon-wrap">
                    <svg className="cr-input-prefix-icon" viewBox="0 0 24 24" fill="none" width="15" height="15">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="7" cy="7" r="1" fill="currentColor" />
                    </svg>
                    <input className="cr-input cr-input-has-icon" id="cr-discount" type="text"
                      placeholder="Nhập mã giảm giá..."
                      value={form.discountCode} onChange={e => set('discountCode', e.target.value)} />
                  </div>
                  {discount > 0 && (
                    <span className="cr-coupon-ok">
                      <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                        <circle cx="8" cy="8" r="6.5" fill="#00C969" fillOpacity="0.2" />
                        <path d="M5 8l2.5 2.5L11 5" stroke="#00C969" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      -10% đã áp dụng
                    </span>
                  )}
                </div>
              </div>
              <div className="cr-field-group">
                <label className="cr-label">Ghi Chú <span className="cr-optional">(tuỳ chọn)</span></label>
                <textarea className="cr-input cr-textarea" id="cr-notes" rows={3}
                  placeholder="Ghi chú thêm cho chiến dịch..."
                  value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>

          </div>{/* end cr-form */}

          {/* ── SUMMARY ── */}
          <aside className="cr-summary" aria-label="Tom tat don hang">
            <div className="cr-summary-header">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Tóm Tắt Chiến Dịch
            </div>
            <div className="cr-summary-body">
              <div className="cr-sum-line"><span>Loại traffic</span><strong style={{ textTransform: 'capitalize' }}>{form.trafficType}</strong></div>
              <div className="cr-sum-line"><span>Phiên bản</span><strong>Version {form.version}{form.version === 1 ? ' ★' : ''}</strong></div>
              <div className="cr-sum-line"><span>Gói thời gian</span><strong>Gói {form.duration}s</strong></div>
              <div className="cr-sum-line"><span>View/ngày</span><strong>{form.viewsPerDay.toLocaleString()}</strong></div>
              <div className="cr-sum-line"><span>Tổng view</span><strong>{form.totalViews.toLocaleString()}</strong></div>
              <div className="cr-sum-line"><span>Thiết bị</span><strong style={{ textTransform: 'capitalize' }}>{form.device}</strong></div>
              <div className="cr-sum-line"><span>Từ khóa/URL</span><strong>{form.keywords.length} từ khóa</strong></div>
              {form.name && (
                <div className="cr-sum-line">
                  <span>Tên CD</span>
                  <strong title={form.name}>{form.name.length > 18 ? form.name.slice(0, 16) + '…' : form.name}</strong>
                </div>
              )}
              <div className="cr-sum-divider" />
              <div className="cr-sum-line"><span>Đơn giá</span><strong>{fmt(unitPrice * 1000)}/1K view</strong></div>
              <div className="cr-sum-line"><span>Tạm tính</span><strong>{fmt(subtotal)}</strong></div>
              {discount > 0 && (
                <div className="cr-sum-line cr-sum-discount">
                  <span>Giảm giá (REAL10)</span>
                  <strong>-{fmt(discount)}</strong>
                </div>
              )}
              <div className="cr-sum-total-row">
                <span>Tổng Thanh Toán</span>
                <div className="cr-sum-total">{fmt(total)}</div>
              </div>
            </div>
            <div className="cr-summary-footer">
              <button
                className="cr-submit-btn"
                id="cr-submit-btn"
                disabled={isOverLimit}
                onClick={() => !isOverLimit && navigate('/campaigns')}
                style={isOverLimit ? { opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(0.4)' } : {}}
              >
                <span className="cr-submit-glow" />
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
                  <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                TẠO CHIẾN DỊCH
              </button>
              <button className="cr-cancel-btn" onClick={() => navigate('/campaigns')}>Hủy bỏ</button>
            </div>
          </aside>

        </div>
      </div>
      <style>{`
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-6px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
      }
    `}</style>
    </>
  )
}
