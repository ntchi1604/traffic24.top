import { useState, useEffect } from 'react'

const USER = { name: 'Nguyen Van Minh', email: 'minh.nguyen@gmail.com', initials: 'NM', plan: 'Worker' }

function useIsDark() {
  const [isDark, setIsDark] = useState(() => document.body.getAttribute('data-theme') === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.body.getAttribute('data-theme') === 'dark'))
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

export default function UserAccountPage() {
  const isDark = useIsDark()
  const [name, setName] = useState(USER.name)
  const [email, setEmail] = useState(USER.email)
  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [toast, setToast] = useState(null)
  const [pwError, setPwError] = useState('')

  const [walletAddress, setWalletAddress] = useState('0x1a2b...3c4d')
  const [walletNetwork, setWalletNetwork] = useState('BEP20')
  const [newWalletAddr, setNewWalletAddr] = useState('')
  const [newWalletNet, setNewWalletNet] = useState('BEP20')
  const [walletSaved, setWalletSaved] = useState(true)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) { showToast('Vui lòng điền đầy đủ thông tin', 'error'); return }
    showToast('Cập nhật thông tin thành công')
  }

  const handleChangePw = () => {
    setPwError('')
    if (!curPw) { setPwError('Nhập mật khẩu hiện tại'); return }
    if (newPw.length < 6) { setPwError('Mật khẩu mới tối thiểu 6 ký tự'); return }
    if (newPw !== confirmPw) { setPwError('Mật khẩu xác nhận không khớp'); return }
    setCurPw(''); setNewPw(''); setConfirmPw('')
    showToast('Đổi mật khẩu thành công')
  }

  const handleSaveWallet = () => {
    if (!newWalletAddr.trim() || newWalletAddr.length < 10) { showToast('Địa chỉ ví không hợp lệ', 'error'); return }
    setWalletAddress(newWalletAddr)
    setWalletNetwork(newWalletNet)
    setWalletSaved(true)
    showToast('Cập nhật ví rút tiền thành công')
  }

  return (
    <div className="ud-fade-in" style={{ position: 'relative' }}>
      {toast && (
        <div className="ud-toast" style={{ position: 'fixed', top: 20, right: 20, zIndex: 600 }}>
          <div className="ud-toast-item">
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" className="ud-toast-icon" style={{ color: toast.type === 'success' ? '#00C969' : '#E05555' }}>
              {toast.type === 'success' ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></> : <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>}
            </svg>
            <span style={{ fontSize: 13, color: 'var(--ud-text)' }}>{toast.msg}</span>
          </div>
        </div>
      )}

      <div className="ud-account-grid">

        {/* ═══ Left: Thông Tin Cá Nhân ═══ */}
        <div className="ud-chart-panel" style={{ padding: 24 }}>
          <div className="ud-panel-title" style={{ marginBottom: 20 }}>Thông Tin Cá Nhân</div>
          <div className="ud-flex ud-items-center ud-gap-14 ud-mb-20">
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #0056CC, #7B3FDB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Inter',sans-serif", boxShadow: '0 0 20px rgba(0,86,204,.3)' }}>{USER.initials}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{USER.name}</div>
              <div className="ud-text-sm ud-text-muted">{USER.email}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #E07A00 0%, #FF9520 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(255,140,0,0.35)' }}>
                <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {USER.plan} Member
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ud-form-group"><label className="ud-form-label">Họ tên</label><input className="ud-input" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="ud-form-group"><label className="ud-form-label">Email</label><input className="ud-input" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <button className="ud-btn ud-btn-blue ud-btn-full" onClick={handleSaveProfile}>
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Lưu Thay Đổi
            </button>
            <div className="ud-divider" />
            <div className="ud-panel-title">Đổi Mật Khẩu</div>
            <div className="ud-form-group"><label className="ud-form-label">Mật khẩu hiện tại</label><input className="ud-input" type={showPw ? 'text' : 'password'} placeholder="Nhập mật khẩu hiện tại" value={curPw} onChange={e => setCurPw(e.target.value)} /></div>
            <div className="ud-form-group"><label className="ud-form-label">Mật khẩu mới</label><input className="ud-input" type={showPw ? 'text' : 'password'} placeholder="Nhập mật khẩu mới" value={newPw} onChange={e => setNewPw(e.target.value)} /></div>
            <div className="ud-form-group">
              <label className="ud-form-label">Xác nhận mật khẩu</label>
              <div className="ud-relative">
                <input className="ud-input" type={showPw ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                <button style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ud-text-3)', cursor: 'pointer' }} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> : <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>}
                </button>
              </div>
            </div>
            {pwError && <div style={{ fontSize: 12, color: '#E05555', marginBottom: 8 }}>{pwError}</div>}
            <button className="ud-btn ud-btn-amber ud-btn-full" onClick={handleChangePw}>
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8"/></svg>
              Đổi Mật Khẩu
            </button>
          </div>
        </div>

        {/* ═══ Right: Ví Rút Tiền ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Success banner */}
          {walletSaved && (
            <div style={{
              padding: '14px 18px', borderRadius: 12,
              background: 'rgba(0,201,105,0.08)', border: '1px solid rgba(0,201,105,0.2)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20" style={{ color: '#00C969', flexShrink: 0, marginTop: 1 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#00C969', marginBottom: 2 }}>Ví rút tiền đã được lưu</div>
                <div style={{ fontSize: 12, color: 'var(--ud-text-3)' }}>Thông tin này sẽ tự động áp dụng khi bạn gửi yêu cầu rút tiền.</div>
              </div>
            </div>
          )}

          {/* Wallet form card */}
          <div className="ud-chart-panel" style={{ padding: 24 }}>
            <div className="ud-panel-title" style={{ marginBottom: 4 }}>Ví rút tiền</div>
            <div style={{ fontSize: 12, color: 'var(--ud-text-3)', marginBottom: 20 }}>Lưu thông tin ví để áp dụng tự động khi rút. Bạn có thể thay đổi bất cứ lúc nào.</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Method */}
              <div className="ud-form-group">
                <label className="ud-form-label">Phương thức nhận tiền <span style={{ color: '#E05555' }}>*</span></label>
                <div style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  border: '1.5px solid #7C3AED',
                  background: 'rgba(124,58,237,0.06)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ color: '#F7931A', flexShrink: 0 }}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9 8h4.5a2 2 0 010 4H9V8z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12h5a2 2 0 010 4H9v-4z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ud-text)' }}>Crypto</span>
                </div>
              </div>

              {/* Network */}
              <div className="ud-form-group">
                <label className="ud-form-label">Mạng / Loại coin <span style={{ color: '#E05555' }}>*</span></label>
                <select
                  className="ud-input"
                  value={newWalletNet}
                  onChange={e => setNewWalletNet(e.target.value)}
                  style={{ appearance: 'auto', cursor: 'pointer' }}>
                  <option value="BEP20" style={{ background: isDark ? '#0f1724' : '#fff', color: isDark ? '#e0e8f0' : '#1a1a2e' }}>USDT (BEP20)</option>
                  <option value="TRC20" style={{ background: isDark ? '#0f1724' : '#fff', color: isDark ? '#e0e8f0' : '#1a1a2e' }}>USDT (TRC20)</option>
                </select>
              </div>

              {/* Address */}
              <div className="ud-form-group">
                <label className="ud-form-label">Địa chỉ ví <span style={{ color: '#E05555' }}>*</span></label>
                <input
                  className="ud-input"
                  type="text"
                  placeholder={newWalletNet === 'BEP20' ? '0x...' : 'T...'}
                  value={newWalletAddr}
                  onChange={e => setNewWalletAddr(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
                <span style={{ fontSize: 11.5, color: '#E05555', marginTop: 4, display: 'block' }}>Kiểm tra kỹ địa chỉ và mạng. Sai địa chỉ sẽ mất tiền!</span>
              </div>

              <button className="ud-btn ud-btn-purple" onClick={handleSaveWallet} style={{ alignSelf: 'flex-start', padding: '10px 22px' }}>
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Lưu ví rút tiền
              </button>
            </div>
          </div>

          {/* Warning box */}
          <div style={{
            padding: '16px 18px', borderRadius: 12,
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ color: '#F59E0B' }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Lưu ý quan trọng:
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li style={{ fontSize: 12, color: 'var(--ud-text-2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }}>•</span>
                Ví được lưu ở đây sẽ tự động áp dụng cho <strong>TẤT CẢ</strong> các lần rút tiền.
              </li>
              <li style={{ fontSize: 12, color: 'var(--ud-text-2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }}>•</span>
                Bạn không thể nhập tay thông tin khi rút — hãy cập nhật đúng ở đây.
              </li>
              <li style={{ fontSize: 12, color: 'var(--ud-text-2)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }}>•</span>
                Thay đổi sẽ áp dụng cho lần rút tiếp theo, <strong>không ảnh hưởng lệnh đang chờ</strong>.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
