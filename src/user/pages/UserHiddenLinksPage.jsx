import { useState, useMemo, useCallback } from 'react'

const HIDDEN = [
  { id: 101, url: 'thoimoda.vn/sale-flash', title: 'Flash Sale Thời Trang', cat: 'Fashion', views: 8200, clicks: 410, completed: 380, income: 19000, hiddenDate: '01/06', reason: 'Hết khuyến mãi' },
  { id: 102, url: 'shopxanh.vn/cu-phim', title: 'Cu Phím Cổ Giá Rẻ', cat: 'Tech', views: 5400, clicks: 270, completed: 250, income: 12500, hiddenDate: '20/05', reason: 'Hết hàng' },
  { id: 103, url: 'techblog.vn/samsung-s26', title: 'Preview Samsung S26', cat: 'Tech', views: 12100, clicks: 726, completed: 690, income: 34500, hiddenDate: '10/06', reason: 'Chuyên mục' },
  { id: 104, url: 'amthuc360.vn/lau-ga', title: 'Lẩu Gà Lá Giang Mùa Đông', cat: 'Food', views: 6800, clicks: 408, completed: 385, income: 19250, hiddenDate: '15/05', reason: 'Hết mùa' },
  { id: 105, url: 'dulich247.vn/sapa/trekking', title: 'Trekking Sapa Mùa Đông', cat: 'Travel', views: 9500, clicks: 570, completed: 540, income: 27000, hiddenDate: '30/04', reason: 'Hết mùa' },
]

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }
function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(n) + ' ₫' }

export default function UserHiddenLinksPage() {
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [restoredIds, setRestoredIds] = useState([])
  const [deletedIds, setDeletedIds] = useState([])

  const showToast = useCallback((msg) => {
    setToast({ msg })
    setTimeout(() => setToast(null), 2500)
  }, [])

  const restoreLink = useCallback((id) => {
    const link = HIDDEN.find(l => l.id === id)
    setRestoredIds(prev => [...prev, id])
    showToast(`Đã hiện lại: ${link?.title}`)
  }, [showToast])

  const deleteLink = useCallback((id) => {
    const link = HIDDEN.find(l => l.id === id)
    setDeletedIds(prev => [...prev, id])
    showToast(`Đã xóa: ${link?.title}`)
  }, [showToast])

  const activeLinks = useMemo(() => HIDDEN.filter(l => !restoredIds.includes(l.id) && !deletedIds.includes(l.id)), [restoredIds, deletedIds])

  const filtered = useMemo(() => activeLinks.filter(l =>
    !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase())
  ), [search, activeLinks])

  const stats = useMemo(() => ({
    totalLinks: activeLinks.length,
    totalViews: activeLinks.reduce((a, l) => a + l.views, 0),
    totalCompleted: activeLinks.reduce((a, l) => a + l.completed, 0),
    totalIncome: activeLinks.reduce((a, l) => a + l.income, 0),
  }), [activeLinks])

  const statCards = [
    { label: 'Link đang ẩn', value: fmt(stats.totalLinks), color: '#FF8C00', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { label: 'Tổng lượt xem', value: fmt(stats.totalViews), color: '#7C3AED', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { label: 'Hoàn thành', value: fmt(stats.totalCompleted), color: '#00C969', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Thu nhập đã có', value: fmtC(stats.totalIncome), color: '#0056CC', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/></svg> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 600 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12,
            background: 'var(--ud-surface, #fff)', border: '1px solid var(--ud-border)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ color: '#00C969', flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 13, color: 'var(--ud-text)' }}>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        borderRadius: 12, background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.15)',
      }}>
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ color: '#FF8C00', flexShrink: 0 }}>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 12.5, color: 'var(--ud-text-2)' }}>
          Link ẩn sẽ ngưng nhận views nhưng vẫn giữ dữ liệu cũ. Bạn có thể hiện lại bất cứ lúc nào.
        </span>
      </div>

      {/* Stats cards */}
      <div className="ud-grid-4">
        {statCards.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
            borderRadius: 14, background: 'var(--ud-surface, #fff)',
            border: '1px solid var(--ud-border)',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: `${s.color}10`, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ud-text-3)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ud-text)', fontFamily: "'Outfit',sans-serif" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ud-text-3)', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        <input
          placeholder="Tìm kiếm link ẩn..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 14px 9px 36px', borderRadius: 10,
            border: '1.5px solid var(--ud-border)', background: 'var(--ud-surface, #fff)',
            fontSize: 13, color: 'var(--ud-text)', outline: 'none',
            fontFamily: "Inter, -apple-system, sans-serif",
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        borderRadius: 14, background: 'var(--ud-surface, #fff)',
        border: '1px solid var(--ud-border)', overflow: 'hidden',
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--ud-text-3)', fontSize: 13 }}>
            {search ? 'Không tìm thấy link nào phù hợp' : 'Không có link ẩn nào'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ud-border)' }}>
                  {['Link', 'Lượt xem', 'Clicks', 'Hoàn thành', 'Thu nhập', 'Ngày ẩn', 'Thao tác'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 700,
                      color: 'var(--ud-text-3)', fontSize: 11, textTransform: 'uppercase',
                      letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--ud-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--ud-hover, rgba(0,0,0,0.02))'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ud-text)', marginBottom: 2 }}>{l.title}</div>
                      <a href={'https://' + l.url} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, color: 'var(--ud-text-3)', textDecoration: 'none' }}>{l.url}</a>
                      <div style={{ fontSize: 11, color: 'var(--ud-text-3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 10 }}>&#128196;</span> {l.reason}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.views)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.clicks)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.completed)}</td>
                    <td style={{ padding: '12px 16px', color: '#00C969', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtC(l.income)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ud-text-3)', whiteSpace: 'nowrap' }}>{l.hiddenDate}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={'https://' + l.url} target="_blank" rel="noreferrer" title="Mở link" style={{
                          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#0056CC', background: 'rgba(0,86,204,0.08)', textDecoration: 'none', transition: 'background 0.15s',
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </a>
                        <button title="Hiện lại link" onClick={() => restoreLink(l.id)} style={{
                          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#00C969', background: 'rgba(0,201,105,0.08)', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                        </button>
                        <button title="Xóa link" onClick={() => deleteLink(l.id)} style={{
                          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}