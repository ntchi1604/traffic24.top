import { useState, useRef } from 'react'

/* ═══════════════════════════════════════
   ICONS
═══════════════════════════════════════ */
const Ic = {
  camera:  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  user:    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail:    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  lock:    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:     <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  save:    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>,
  shield:  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  grid:    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  zap:     <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  trophy:  <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="8,21 12,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17l-1 7a5 5 0 01-8 0L7 4z"/><path d="M5 4H3v3a4 4 0 004 4"/><path d="M19 4h2v3a4 4 0 01-4 4"/></svg>,
  spin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      style={{ animation: 'acc-spin .8s linear infinite', display: 'block' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.8"/>
    </svg>
  ),
}

/* ═══════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════ */
const CSS = `
@keyframes acc-spin  { to { transform: rotate(360deg) } }
@keyframes acc-up    { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes acc-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.5)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0)} }

/* ── layout ── */
.acc-root { width:100%; font-family:'Inter',sans-serif; }

.acc-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 640px) {
  .acc-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .acc-profile-card {
    flex-direction: row !important;
    text-align: left !important;
    align-items: center !important;
    padding: 18px 20px !important;
    gap: 18px;
  }
  .acc-avatar-wrap { margin-bottom: 0 !important; }
  .acc-stats { grid-template-columns: repeat(2, 1fr); margin-top: 12px; }
  .acc-divider { margin: 12px 0 !important; }
  .acc-form-body { padding: 20px 18px 0 !important; }
  .acc-fields { max-width: 100% !important; }
  .acc-activity { display: none; }
}

/* ── cards ── */
.acc-card {
  border-radius: 20px;
  border: 1px solid var(--db-border);
  background: var(--db-surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--db-shadow), inset 0 1px 0 rgba(255,255,255,.04);
  animation: acc-up .35s ease;
}

/* ── profile sidebar ── */
.acc-profile-card {
  padding: 36px 28px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.acc-avatar-wrap {
  position: relative;
  margin-bottom: 16px;
  cursor: pointer;
  display: inline-block;
}
.acc-avatar-ring {
  width: 120px; height: 120px;
  border-radius: 50%; padding: 3px;
  background: linear-gradient(135deg,#1d4ed8,#7c3aed);
  transition: background .3s, box-shadow .3s;
}
.acc-avatar-wrap:hover .acc-avatar-ring {
  background: linear-gradient(135deg,#4f46e5,#a855f7,#ec4899);
  box-shadow: 0 0 24px rgba(139,92,246,.45);
}
.acc-avatar-inner {
  width:100%; height:100%;
  border-radius:50%; overflow:hidden;
  background:linear-gradient(135deg,#1e1b4b,#312e81);
  display:flex; align-items:center; justify-content:center;
}
.acc-avatar-initials {
  font-size:34px; font-weight:900; color:#fff;
  font-family:'Outfit',sans-serif; letter-spacing:-1px;
}
.acc-avatar-overlay {
  position:absolute; inset:0; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:rgba(0,0,0,.6); backdrop-filter:blur(4px);
  color:#fff; opacity:0; transition:opacity .2s;
}
.acc-avatar-wrap:hover .acc-avatar-overlay { opacity:1; }
.acc-online-dot {
  position:absolute; bottom:4px; right:4px;
  width:14px; height:14px; border-radius:50%;
  background:#10b981; border:2.5px solid var(--db-bg,#0f172a);
  animation: acc-pulse 2.5s ease-in-out infinite;
}

.acc-name {
  font-family:'Outfit',sans-serif; font-size:20px; font-weight:900;
  color:var(--db-text); margin:0 0 5px;
}
.acc-email { font-size:13px; color:var(--db-text-2); margin:0 0 18px; }

.acc-vip {
  display:inline-flex; align-items:center; gap:6px;
  padding:5px 14px; border-radius:20px;
  background:rgba(251,191,36,.1); border:1px solid rgba(251,191,36,.3);
  font-size:11px; font-weight:800; color:#fbbf24; letter-spacing:.04em;
}

.acc-divider {
  width:100%; height:1px;
  background: linear-gradient(90deg,transparent,var(--db-border),transparent);
  margin: 18px 0;
}

/* ── stat cards ── */
.acc-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; width:100%; }
.acc-stat {
  border-radius:14px; padding:16px 12px; text-align:center;
  background:var(--db-surface-2); border:1px solid var(--db-border);
  transition:all .22s; cursor:default;
}
.acc-stat:hover {
  border-color:var(--acc-stat-color,rgba(99,102,241,.4));
  background:color-mix(in srgb,var(--acc-stat-color,#6366f1) 8%,var(--db-surface-2));
  box-shadow:0 4px 18px color-mix(in srgb,var(--acc-stat-color,#6366f1) 18%,transparent);
}
.acc-stat-icon { margin-bottom:6px; display:flex; justify-content:center; }
.acc-stat-val {
  font-size:18px; font-weight:900; line-height:1; margin-bottom:5px;
  font-family:'Outfit',sans-serif; color:var(--acc-stat-color);
}
.acc-stat-lbl { font-size:11px; font-weight:600; color:var(--db-text-2); letter-spacing:.04em; }



/* ── main card ── */
.acc-main-card { overflow:hidden; }

/* section header */
.acc-section-head { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
.acc-section-icon {
  width:34px; height:34px; border-radius:10px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  background:rgba(99,102,241,.12); border:1px solid rgba(99,102,241,.22);
  color:#818cf8;
}
.acc-section-title {
  margin:0; font-size:15px; font-weight:800; color:var(--db-text);
  font-family:'Outfit',sans-serif;
}
.acc-section-sub { margin:2px 0 0; font-size:12px; color:var(--db-text-2); }

/* form */
.acc-form-body { padding:28px 32px 0; }

/* Two-column inner layout */
.acc-form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.acc-form-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.acc-fields { display:flex; flex-direction:column; gap:20px; }

@media (max-width: 840px) {
  .acc-form-columns {
    grid-template-columns: 1fr;
  }
}

.acc-label {
  display:flex; align-items:center; gap:6px;
  font-size:10px; font-weight:700; letter-spacing:.1em;
  text-transform:uppercase; color:var(--db-text-2); margin-bottom:7px;
}
.acc-label-icon { color:var(--db-text-3); }

.acc-input {
  width:100%; border-radius:12px; padding:11px 14px;
  font-size:13.5px; outline:none; border:1px solid var(--db-border);
  transition:all .2s; font-family:'Inter',sans-serif;
  background:var(--db-surface-2); color:var(--db-text);
  box-shadow:inset 0 2px 10px rgba(0,0,0,.15);
  box-sizing:border-box;
}
.acc-input::placeholder { color:var(--db-text-3); }
.acc-input:focus {
  border-color:rgba(99,102,241,.55);
  box-shadow:inset 0 2px 10px rgba(0,0,0,.15), 0 0 0 3px rgba(99,102,241,.12);
}
.acc-input-readonly {
  background:var(--db-surface); color:var(--db-text-2);
  cursor:not-allowed; opacity:.8;
}
.acc-input-hint { margin:5px 0 0; font-size:11px; color:var(--db-text-3); }

/* password field */
.acc-pw-wrap { position:relative; }
.acc-pw-input { padding-right:42px !important; }
.acc-pw-toggle {
  position:absolute; right:12px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer; color:var(--db-text-3);
  padding:2px; transition:color .2s; display:flex; align-items:center;
}
.acc-pw-toggle:hover { color:var(--db-text-2); }

/* strength bar */
.acc-strength { padding-top:4px; }
.acc-strength-row { display:flex; justify-content:space-between; font-size:11px; margin-bottom:7px; }
.acc-strength-lbl { color:var(--db-text-3); }
.acc-strength-bars { display:flex; gap:5px; height:5px; }
.acc-strength-bar { flex:1; border-radius:99px; transition:background .3s; background:var(--db-surface-2); }

/* error */
.acc-error {
  display:flex; align-items:center; gap:8px; padding:10px 14px;
  border-radius:12px; background:rgba(239,68,68,.08);
  border:1px solid rgba(239,68,68,.2); font-size:12.5px; color:#f87171;
}

/* activity timeline */
.acc-timeline { margin-top:28px; }
.acc-timeline-head {
  font-size:10.5px; font-weight:700; color:var(--db-text-3);
  letter-spacing:.1em; text-transform:uppercase; margin-bottom:14px;
}
.acc-timeline-list { display:flex; flex-direction:column; }
.acc-tl-item { display:flex; align-items:flex-start; gap:12px; padding-bottom:14px; position:relative; }
.acc-tl-dot { width:8px; height:8px; border-radius:50%; margin-top:4px; flex-shrink:0; }
.acc-tl-line {
  position:absolute; left:3.5px; top:12px; bottom:0; width:1px;
  background:linear-gradient(180deg,var(--db-border),transparent);
}
.acc-tl-text { margin:0; font-size:12.5px; color:var(--db-text-2); line-height:1.5; }
.acc-tl-time { margin:2px 0 0; font-size:11px; color:var(--db-text-3); }

/* footer */
.acc-footer {
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 28px; margin-top:24px;
  border-top:1px solid var(--db-border);
  background:var(--db-surface-2);
  flex-wrap:wrap; gap:12px;
}
.acc-footer-note { margin:0; font-size:11.5px; color:var(--db-text-3); }

/* save button */
.acc-save-btn {
  position:relative; display:inline-flex; align-items:center; gap:8px;
  padding:10px 22px; border-radius:12px; border:none; cursor:pointer;
  font-size:13.5px; font-weight:700; color:#fff; font-family:'Inter',sans-serif;
  background:linear-gradient(135deg,#1e40af,#6b21a8);
  overflow:hidden; transition:all .22s;
  box-shadow:0 4px 16px rgba(99,102,241,.3);
}
.acc-save-btn:hover:not(:disabled) {
  background:linear-gradient(135deg,#2563eb,#7c3aed);
  transform:translateY(-2px);
  box-shadow:0 8px 28px rgba(99,102,241,.45);
}
.acc-save-btn:active:not(:disabled) { transform:translateY(0); }
.acc-save-btn:disabled { cursor:wait; opacity:.85; }
.acc-save-btn-saved {
  background:linear-gradient(135deg,#059669,#10b981) !important;
  box-shadow:0 0 24px rgba(16,185,129,.4) !important;
}
.acc-save-btn-gloss {
  position:absolute; inset-x:0; top:0; height:50%;
  background:linear-gradient(180deg,rgba(255,255,255,.12),transparent);
  border-radius:12px; pointer-events:none;
}

/* ── MOBILE RESPONSIVE ── */
@media (max-width: 768px) {
  .acc-grid {
    grid-template-columns: 1fr;
  }
  .acc-profile-card {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    padding: 20px;
    gap: 16px;
  }
  .acc-profile-left { flex-shrink:0; display:flex; flex-direction:column; align-items:center; }
  .acc-profile-right { flex:1; min-width:0; }
  .acc-avatar-ring { width:76px; height:76px; }
  .acc-name { font-size:15px; }
  .acc-divider { margin: 14px 0; }
  .acc-stats { grid-template-columns: repeat(4,1fr); gap:6px; }
  .acc-stat { padding:10px 4px; }
  .acc-stat-val { font-size:12px; }

  .acc-form-body { padding:20px 20px 0; }
  .acc-fields { max-width:100%; }
  .acc-footer { padding:16px 20px; }
  .acc-timeline { display:none; }
}

@media (max-width: 480px) {
  .acc-stats { grid-template-columns: repeat(2,1fr); }
  .acc-profile-card { flex-direction:column; align-items:center; text-align:center; }
  .acc-profile-left { align-items:center; }
}
`

/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

function Field({ id, label, icon, value, onChange, readOnly, hint }) {
  return (
    <div>
      <label className="acc-label">
        <span className="acc-label-icon">{icon}</span>
        {label}
      </label>
      <input
        id={id} type="text" value={value} readOnly={readOnly}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        className={`acc-input${readOnly ? ' acc-input-readonly' : ''}`}
      />
      {hint && <p className="acc-input-hint">{hint}</p>}
    </div>
  )
}

function PwField({ id, label, placeholder, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="acc-label">
        <span className="acc-label-icon">{Ic.lock}</span>
        {label}
      </label>
      <div className="acc-pw-wrap">
        <input
          id={id} type={show ? 'text' : 'password'}
          placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          className="acc-input acc-pw-input"
        />
        <button type="button" className="acc-pw-toggle" onClick={() => setShow(s => !s)}>
          {show ? Ic.eyeOff : Ic.eye}
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="acc-stat" style={{ '--acc-stat-color': color }}>
      <div className="acc-stat-icon" style={{ color }}>{icon}</div>
      <div className="acc-stat-val" style={{ color }}>{value}</div>
      <div className="acc-stat-lbl">{label}</div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function AccountProfilePage() {
  const [name, setName]           = useState('Nguyễn Chi')
  const [curPw, setCurPw]         = useState('')
  const [newPw, setNewPw]         = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [pwErr, setPwErr]         = useState('')
  const [avatarHov, setAvatarHov] = useState(false)
  const [avatar, setAvatar]       = useState(null)
  const fileRef = useRef(null)

  const handleFile = e => {
    const f = e.target.files[0]
    if (f) setAvatar(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    setPwErr('')
    if ((newPw || confirmPw || curPw) && !curPw) { setPwErr('Vui lòng nhập mật khẩu hiện tại.'); return }
    if (newPw && newPw.length < 8) { setPwErr('Mật khẩu mới phải có ít nhất 8 ký tự.'); return }
    if (newPw !== confirmPw) { setPwErr('Mật khẩu xác nhận không khớp.'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setCurPw(''); setNewPw(''); setConfirmPw('')
  }

  const pwStrength = newPw.length === 0 ? 0 : newPw.length < 8 ? 1 : newPw.length < 12 ? 2 : 3
  const pwLabel    = ['', 'Yếu', 'Trung bình', 'Mạnh'][pwStrength]
  const pwColor    = ['', '#EF4444', '#F59E0B', '#10B981'][pwStrength]

  const STATS = [
    { label: 'Chiến dịch', value: '12',    color: '#3b82f6', icon: Ic.grid   },
    { label: 'Số dư',      value: '$1,250', color: '#10b981', icon: Ic.zap    },
    { label: 'Traffic',   value: (2400000).toLocaleString('vi-VN'), color: '#f97316', icon: Ic.zap    },
    { label: 'Hạng',      value: 'VIP',    color: '#a855f7', icon: Ic.trophy },
  ]



  const TIMELINE = [
    { dot: '#10b981', text: 'Đăng nhập thành công từ Hà Nội, VN', time: '2 giờ trước' },
    { dot: '#3b82f6', text: 'Tạo chiến dịch mới #C-1247',          time: 'Hôm qua' },
    { dot: '#f59e0b', text: 'Nạp tiền thành công — $200',           time: '3 ngày trước' },
  ]

  return (
    <>
      <style>{CSS}</style>

      <div id="acc-profile-page" className="acc-root">
        <div className="acc-grid">

          {/* ════ SIDEBAR ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Profile card */}
            <div className="acc-card acc-profile-card">

              {/* left: avatar block */}
              <div className="acc-profile-left">
                <div
                  className="acc-avatar-wrap"
                  onMouseEnter={() => setAvatarHov(true)}
                  onMouseLeave={() => setAvatarHov(false)}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className="acc-avatar-ring">
                    <div className="acc-avatar-inner">
                      {avatar
                        ? <img src={avatar} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <span className="acc-avatar-initials">NC</span>
                      }
                    </div>
                  </div>
                  <div className="acc-avatar-overlay">{Ic.camera}</div>
                  <span className="acc-online-dot" />
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile} />
              </div>

              {/* right: info block */}
              <div className="acc-profile-right">
                <p className="acc-name">Nguyễn Chi</p>
                <p className="acc-email">chi@traffic24h.vn</p>

                <span className="acc-vip">
                  {Ic.star}&nbsp;THÀNH VIÊN VIP
                </span>

                <div className="acc-divider" />

                <div className="acc-stats">
                  {STATS.map(s => <StatCard key={s.label} {...s} />)}
                </div>
              </div>
            </div>


          </div>

          {/* ════ MAIN FORM CARD ════ */}
          <div className="acc-card acc-main-card">

            <div className="acc-form-body">
              <div className="acc-form-columns">

                {/* ── LEFT: Personal Info ── */}
                <div className="acc-form-col">
                  <div className="acc-section-head">
                    <div className="acc-section-icon">{Ic.user}</div>
                    <div>
                      <p className="acc-section-title">Thông tin cá nhân</p>
                      <p className="acc-section-sub">Cập nhật họ tên và thông tin liên hệ</p>
                    </div>
                  </div>

                  <div className="acc-fields" style={{ marginTop: 4 }}>
                    <Field
                      id="acc-name" label="Họ và tên" icon={Ic.user}
                      value={name} onChange={setName}
                    />
                    <Field
                      id="acc-email" label="Email" icon={Ic.mail}
                      value="chi@traffic24h.vn" readOnly
                      hint="Email không thể thay đổi — liên hệ hỗ trợ nếu cần"
                    />
                  </div>
                </div>

                {/* ── RIGHT: Change Password ── */}
                <div className="acc-form-col">
                  <div className="acc-section-head">
                    <div className="acc-section-icon" style={{ background:'rgba(168,85,247,.12)', border:'1px solid rgba(168,85,247,.22)', color:'#a78bfa' }}>{Ic.shield}</div>
                    <div>
                      <p className="acc-section-title">Đổi mật khẩu</p>
                      <p className="acc-section-sub">Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</p>
                    </div>
                  </div>

                  <div className="acc-fields" style={{ marginTop: 4 }}>
                    <PwField id="acc-curpw" label="Mật khẩu hiện tại" placeholder="••••••••"
                      value={curPw} onChange={setCurPw} />
                    <PwField id="acc-newpw" label="Mật khẩu mới" placeholder="Tối thiểu 8 ký tự"
                      value={newPw} onChange={v => { setNewPw(v); setPwErr('') }} />
                    <PwField id="acc-confpw" label="Xác nhận mật khẩu" placeholder="Nhập lại mật khẩu"
                      value={confirmPw} onChange={v => { setConfirmPw(v); setPwErr('') }} />

                    {/* Strength bar */}
                    {newPw.length > 0 && (
                      <div className="acc-strength">
                        <div className="acc-strength-row">
                          <span className="acc-strength-lbl">Độ mạnh mật khẩu</span>
                          <span style={{ fontWeight:700, color: pwColor, fontSize:11 }}>{pwLabel}</span>
                        </div>
                        <div className="acc-strength-bars">
                          {[1,2,3].map(lvl => (
                            <div key={lvl} className="acc-strength-bar" style={{
                              background: pwStrength >= lvl ? pwColor : undefined,
                              boxShadow: pwStrength >= lvl ? `0 0 6px ${pwColor}50` : 'none',
                            }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {pwErr && (
                      <div className="acc-error">
                        <svg viewBox="0 0 24 24" fill="none" width="14" height="14"
                          stroke="currentColor" strokeWidth="2" style={{ flexShrink:0 }}>
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {pwErr}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>{/* end form-body */}

            {/* ── Footer / Save ── */}
            <div className="acc-footer">
              <p className="acc-footer-note">✦ Thay đổi sẽ được áp dụng ngay lập tức</p>
              <button
                id="acc-save-btn"
                className={`acc-save-btn${saved ? ' acc-save-btn-saved' : ''}`}
                onClick={handleSave}
                disabled={saving}
              >
                <span className="acc-save-btn-gloss" />
                {saving ? <>{Ic.spin} Đang lưu…</>
                  : saved ? <>{Ic.check} Đã lưu!</>
                  : <>{Ic.save} Lưu thay đổi</>}
              </button>
            </div>

          </div>{/* end main card */}
        </div>{/* end grid */}
      </div>
    </>
  )
}
