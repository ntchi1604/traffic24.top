import { useState, useMemo, useCallback, useEffect } from 'react'

const LINKS = [
  { id: 1, url: 'thoimoda.vn/blog/ao-khoac-mua-dong', title: 'Ao Khoac Mua Dong 2026', cat: 'Fashion', views: 45230, clicks: 3210, completed: 3120, income: 156000, ctr: 7.1, status: 'active' },
  { id: 2, url: 'shopxanh.vn/ban-phim-co', title: 'Ban Phim Co Gear75', cat: 'Tech', views: 38100, clicks: 2890, completed: 2750, income: 137500, ctr: 7.6, status: 'active' },
  { id: 3, url: 'techblog.vn/review/iphone-17', title: 'Review iPhone 17 Pro Max', cat: 'Tech', views: 62400, clicks: 5100, completed: 4920, income: 246000, ctr: 8.2, status: 'active' },
  { id: 4, url: 'amthuc360.vn/pha-lo-bo-kho', title: 'Pha Lo Bo Kho An Tam', cat: 'Food', views: 18700, clicks: 1420, completed: 1380, income: 69000, ctr: 7.6, status: 'active' },
  { id: 5, url: 'dulich247.vn/ha-noi/ho-hoan-kiem', title: 'Kham Pha Ho Hoan Kiem', cat: 'Travel', views: 29300, clicks: 2100, completed: 2050, income: 102500, ctr: 7.2, status: 'active' },
  { id: 6, url: 'suckhoe.vn/yoga-sang', title: 'Yoga Sang Cho Nguoi Ban Rat', cat: 'Health', views: 15800, clicks: 1100, completed: 1070, income: 53500, ctr: 7.0, status: 'active' },
  { id: 7, url: 'thoimoda.vn/phu-kien', title: 'Phu Kien Thoi Trang Mua He', cat: 'Fashion', views: 21400, clicks: 1580, completed: 1540, income: 77000, ctr: 7.4, status: 'active' },
  { id: 8, url: 'techblog.vn/ai-2026', title: 'Xu Huong AI Nam 2026', cat: 'Tech', views: 41200, clicks: 3300, completed: 3200, income: 160000, ctr: 8.0, status: 'active' },
  { id: 9, url: 'dulich247.vn/da-nang/my-khe', title: 'Bien My Khe Dep Nhat', cat: 'Travel', views: 33600, clicks: 2450, completed: 2380, income: 119000, ctr: 7.3, status: 'active' },
  { id: 10, url: 'amthuc360.vn/banh-mi', title: 'Top 10 Banh Mi Saigon', cat: 'Food', views: 27800, clicks: 2050, completed: 1990, income: 99500, ctr: 7.4, status: 'active' },
  { id: 11, url: 'suckhoe.vn/sua-ong-chua', title: 'Cong Dung Sua Ong Chua', cat: 'Health', views: 12400, clicks: 880, completed: 850, income: 42500, ctr: 7.1, status: 'active' },
  { id: 12, url: 'shopxanh.vn/tai-nghe', title: 'Tai Nghe Bluetooth Pro', cat: 'Tech', views: 19500, clicks: 1380, completed: 1340, income: 67000, ctr: 7.1, status: 'active' },
  { id: 13, url: 'thoimoda.vn/giay-the-thao', title: 'Giay The Thao Chuan 2026', cat: 'Fashion', views: 16200, clicks: 1150, completed: 1120, income: 56000, ctr: 7.1, status: 'active' },
  { id: 14, url: 'dulich247.vn/phu-quoc/resort', title: 'Review Resort Phu Quoc', cat: 'Travel', views: 24100, clicks: 1750, completed: 1700, income: 85000, ctr: 7.3, status: 'active' },
  { id: 15, url: 'amthuc360.vn/bun-cha', title: 'Bun Cha Ha Noi Chinh Goc', cat: 'Food', views: 14300, clicks: 1020, completed: 990, income: 49500, ctr: 7.1, status: 'active' },
  { id: 16, url: 'techblog.vn/macbook-air-m4', title: 'MacBook Air M4 Review', cat: 'Tech', views: 55800, clicks: 4600, completed: 4480, income: 224000, ctr: 8.2, status: 'active' },
  { id: 17, url: 'suckhoe.vn/chay-bo', title: 'Chay Bo Giam Can Hieu Qua', cat: 'Health', views: 11200, clicks: 790, completed: 760, income: 38000, ctr: 7.1, status: 'active' },
  { id: 18, url: 'thoimoda.vn/nu-hoa', title: 'Nu Hoa Mua He 2026', cat: 'Fashion', views: 19800, clicks: 1410, completed: 1370, income: 68500, ctr: 7.1, status: 'active' },
  { id: 19, url: 'dulich247.vn/nha-trang/vinwonders', title: 'VinWonders Nha Trang', cat: 'Travel', views: 28900, clicks: 2080, completed: 2020, income: 101000, ctr: 7.2, status: 'active' },
  { id: 20, url: 'shopxanh.vn/dong-ho', title: 'Dong Ho Thong Minh GW5', cat: 'Tech', views: 16800, clicks: 1190, completed: 1150, income: 57500, ctr: 7.1, status: 'active' },
  { id: 21, url: 'amthuc360.vn/com-ga', title: 'Com Ga Hoi An Ngon', cat: 'Food', views: 13100, clicks: 930, completed: 900, income: 45000, ctr: 7.1, status: 'active' },
  { id: 22, url: 'suckhoe.vn/vitamin', title: 'Vitamin Tot Cho Co The', cat: 'Health', views: 10500, clicks: 740, completed: 720, income: 36000, ctr: 7.0, status: 'active' },
  { id: 23, url: 'thoimoda.vn/tui-xach', title: 'Tui Xach Hang Hieu 2026', cat: 'Fashion', views: 17600, clicks: 1250, completed: 1210, income: 60500, ctr: 7.1, status: 'active' },
]

const PER_PAGE = 10

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }
function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(n) + ' ₫' }

/* ─── Create Link Modal ─── */
function CreateLinkModal({ open, onClose, onCreate }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [hovCreate, setHovCreate] = useState(false)
  const [hovCancel, setHovCancel] = useState(false)

  useEffect(() => {
    if (!open) return
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null

  const handleCreate = () => {
    if (!url.trim()) return
    onCreate({ url: url.trim(), title: title.trim() })
    setUrl('')
    setTitle('')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,10,30,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
      animation: 'cl-fadein 0.18s ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480,
        background: 'var(--ud-surface, #fff)',
        border: '1px solid var(--ud-border)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 32px 80px rgba(0,0,0,0.28)',
        overflow: 'hidden',
        animation: 'cl-scalein 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ud-text)' }}>Tạo link kiếm tiền</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ud-text-3)' }}>Người click phải vượt link → bạn nhận tiền</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10, border: '1px solid var(--ud-border)',
            background: 'transparent', cursor: 'pointer', color: 'var(--ud-text-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ud-text)' }}>URL đích </span>
            <span style={{ fontSize: 13, color: '#EF4444' }}>*</span>
          </label>
          <p style={{ margin: '0 0 8px', fontSize: 11.5, color: 'var(--ud-text-3)' }}>Người dùng được chuyển đến đây sau khi hoàn thành</p>
          <input
            value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/noi-dung"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid var(--ud-border)', background: 'var(--ud-bg, #f8f9fb)',
              fontSize: 13, color: 'var(--ud-text)', outline: 'none',
              fontFamily: "Inter, -apple-system, sans-serif",
              boxSizing: 'border-box',
            }}
          />

          <label style={{ display: 'block', margin: '16px 0 4' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ud-text)' }}>Tiêu đề </span>
            <span style={{ fontSize: 11, color: 'var(--ud-text-3)', fontWeight: 400 }}>(tùy chọn)</span>
          </label>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Ví dụ: Tải xuống file XYZ"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid var(--ud-border)', background: 'var(--ud-bg, #f8f9fb)',
              fontSize: 13, color: 'var(--ud-text)', outline: 'none',
              fontFamily: "Inter, -apple-system, sans-serif",
              boxSizing: 'border-box',
            }}
          />

          {/* Info box */}
          <div style={{
            marginTop: 18, padding: '14px 16px', borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
            border: '1px solid rgba(99,102,241,0.12)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15 }}>&#128161;</span> Cách hoạt động
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Hệ thống tạo link /vuot-link/xxxxxxx',
                'Người click phải vượt link trước',
                'Hoàn thành → redirect đến URL của bạn',
                'Bạn nhận CPC mỗi lượt hoàn thành',
              ].map((text, i) => (
                <li key={i} style={{ fontSize: 12, color: 'var(--ud-text-2)', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                  <span style={{ color: '#6366F1', flexShrink: 0, marginTop: 1 }}>•</span>
                  {i === 3 ? <>Bạn nhận <strong style={{ color: '#6366F1' }}>CPC</strong> mỗi lượt hoàn thành</> : text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 22px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose}
            onMouseEnter={() => setHovCancel(true)} onMouseLeave={() => setHovCancel(false)}
            style={{
              padding: '10px 22px', borderRadius: 10, cursor: 'pointer',
              background: hovCancel ? 'var(--ud-surface-2, #f1f3f5)' : 'transparent',
              border: '1px solid var(--ud-border)', fontSize: 13, fontWeight: 600,
              color: 'var(--ud-text-2)', transition: 'all 0.15s',
            }}>Hủy</button>
          <button onClick={handleCreate}
            onMouseEnter={() => setHovCreate(true)} onMouseLeave={() => setHovCreate(false)}
            style={{
              padding: '10px 24px', borderRadius: 10, cursor: url.trim() ? 'pointer' : 'not-allowed',
              background: hovCreate && url.trim() ? '#6D28D9' : '#7C3AED',
              border: 'none', fontSize: 13, fontWeight: 700, color: '#fff',
              boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              transition: 'all 0.15s', opacity: url.trim() ? 1 : 0.55,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Tạo link
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cl-fadein { from { opacity:0 } to { opacity:1 } }
        @keyframes cl-scalein { from { opacity:0; transform:scale(0.92) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>
  )
}

/* ─── Main Page ─── */
export default function UserLinksPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hiddenIds, setHiddenIds] = useState([])
  const [deletedIds, setDeletedIds] = useState([])
  const [toast, setToast] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  const toggleHide = useCallback((id) => {
    setHiddenIds(prev => {
      const isHidden = prev.includes(id)
      const link = LINKS.find(l => l.id === id)
      showToast(isHidden ? `Đã hiện lại: ${link?.title}` : `Đã ẩn: ${link?.title}`)
      return isHidden ? prev.filter(x => x !== id) : [...prev, id]
    })
  }, [showToast])

  const deleteLink = useCallback((id) => {
    const link = LINKS.find(l => l.id === id)
    setDeletedIds(prev => [...prev, id])
    showToast(`Đã xóa: ${link?.title}`)
  }, [showToast])

  const activeLinks = useMemo(() => LINKS.filter(l => !deletedIds.includes(l.id)), [deletedIds])

  const filtered = useMemo(() => activeLinks.filter(l =>
    !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase())
  ), [search, activeLinks])

  const total = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const stats = useMemo(() => ({
    totalLinks: activeLinks.length,
    totalViews: activeLinks.reduce((a, l) => a + l.views, 0),
    totalCompleted: activeLinks.reduce((a, l) => a + l.completed, 0),
    totalIncome: activeLinks.reduce((a, l) => a + l.income, 0),
  }), [activeLinks])

  const handleCreate = ({ url, title }) => {
    setShowCreate(false)
    showToast(`Đã tạo link: ${title || url}`)
  }

  const statCards = [
    { label: 'Tổng link', value: fmt(stats.totalLinks), color: '#0056CC', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { label: 'Lượt vào', value: fmt(stats.totalViews), color: '#7C3AED', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { label: 'Hoàn thành', value: fmt(stats.totalCompleted), color: '#00C969', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Thu nhập', value: fmtC(stats.totalIncome), color: '#0056CC', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/></svg> },
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

      {/* FAB create button */}
      <button onClick={() => setShowCreate(true)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 100,
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', border: 'none',
        color: '#fff', cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.55)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.45)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
      </button>

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
          placeholder="Tìm kiếm link..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
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
            {search ? 'Không tìm thấy link nào phù hợp' : 'Chưa có link nào'}
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ud-border)' }}>
                    {['Link', 'Lượt xem', 'Clicks', 'Hoàn thành', 'Thu nhập', 'Trạng thái', 'Thao tác'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left', fontWeight: 700,
                        color: 'var(--ud-text-3)', fontSize: 11, textTransform: 'uppercase',
                        letterSpacing: '0.05em', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--ud-border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--ud-hover, rgba(0,0,0,0.02))'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--ud-text)', marginBottom: 2 }}>{l.title}</div>
                        <a href={'https://' + l.url} target="_blank" rel="noreferrer"
                          style={{ fontSize: 12, color: 'var(--ud-text-3)', textDecoration: 'none' }}>{l.url}</a>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.views)}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.clicks)}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--ud-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(l.completed)}</td>
                      <td style={{ padding: '12px 16px', color: '#00C969', fontWeight: 700, whiteSpace: 'nowrap' }}>{fmtC(l.income)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20,
                          background: hiddenIds.includes(l.id) ? 'rgba(255,140,0,0.1)' : 'rgba(0,201,105,0.1)',
                          color: hiddenIds.includes(l.id) ? '#FF8C00' : '#00C969',
                          fontSize: 12, fontWeight: 600,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                          {hiddenIds.includes(l.id) ? 'Ẩn' : 'Hoạt động'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <a href={'https://' + l.url} target="_blank" rel="noreferrer" title="Mở link" style={{
                            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#0056CC', background: 'rgba(0,86,204,0.08)', textDecoration: 'none', transition: 'background 0.15s',
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </a>
                          <button title={hiddenIds.includes(l.id) ? 'Hiện link' : 'Ẩn link'} onClick={() => toggleHide(l.id)} style={{
                            width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#A855F7', background: 'rgba(168,85,247,0.08)', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                          }}>
                            {hiddenIds.includes(l.id) ? (
                              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            )}
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
            {/* Pagination */}
            {total > 1 && (
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center', gap: 4, borderTop: '1px solid var(--ud-border)' }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--ud-border)',
                  background: 'transparent', cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  color: 'var(--ud-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: page <= 1 ? 0.4 : 1,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {Array.from({ length: total }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: p === page ? '#7C3AED' : 'transparent',
                    color: p === page ? '#fff' : 'var(--ud-text-3)',
                    fontWeight: p === page ? 700 : 500, fontSize: 13,
                    fontFamily: "Inter, -apple-system, sans-serif",
                  }}>{p}</button>
                ))}
                <button disabled={page >= total} onClick={() => setPage(page + 1)} style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--ud-border)',
                  background: 'transparent', cursor: page >= total ? 'not-allowed' : 'pointer',
                  color: 'var(--ud-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: page >= total ? 0.4 : 1,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <CreateLinkModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </div>
  )
}