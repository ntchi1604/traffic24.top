import { useState } from 'react'

const NOTIFS = [
  { id: 1, type: 'success', isRead: false, title: 'Thu nhập mới được cộng', desc: '45,200đ từ views thoimoda.vn', time: '10 phút trước' },
  { id: 2, type: 'warning', isRead: false, title: 'Số dư đang giảm', desc: 'Số dư dưới 1,500,000đ', time: '1 giờ trước' },
  { id: 3, type: 'info', isRead: false, title: 'Tính năng mới', desc: 'Link ẩn đã được cập nhật', time: '1 ngày trước' },
  { id: 4, type: 'success', isRead: true, title: 'Rút tiền thành công', desc: '500,000đ đã được chuyển', time: '3 ngày trước' },
  { id: 5, type: 'success', isRead: true, title: 'Thu nhập mới', desc: '62,400đ từ views techblog.vn', time: '5 ngày trước' },
  { id: 6, type: 'info', isRead: true, title: 'Cập nhật hệ thống', desc: 'Hệ thống bảo trì 02:00 ngày 05/07', time: '6 ngày trước' },
]

const TYPE_MAP = {
  success: { color: '#00C969', bg: 'rgba(0,201,105,.12)', label: 'Thành công', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  warning: { color: '#E07A00', bg: 'rgba(224,122,0,.12)', label: 'Cảnh báo', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  info: { color: '#1A7FFF', bg: 'rgba(0,86,204,.12)', label: 'Thông tin', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
}

export default function UserNotificationsPage() {
  const [filter, setFilter] = useState('all')
  const filtered = NOTIFS.filter(n => filter === 'all' || n.type === filter)

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-flex ud-items-center ud-justify-between">
        <div className="ud-filters">
          {[['all', 'Tất cả'], ['success', 'Thành công'], ['warning', 'Cảnh báo'], ['info', 'Thông tin']].map(([k, l]) => (
            <button key={k} className={`ud-filter-pill ${filter === k ? 'ud-filter-active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <span className="ud-badge ud-badge-blue">{NOTIFS.filter(n => !n.isRead).length} chưa đọc</span>
      </div>

      <div className="ud-chart-panel">
        {filtered.map(n => {
          const cfg = TYPE_MAP[n.type] || TYPE_MAP.info
          return (
            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--ud-border)', background: !n.isRead ? 'var(--ud-row-hover)' : 'transparent', transition: 'background .15s' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{cfg.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="ud-flex ud-items-center ud-gap-6" style={{ marginBottom: 2 }}>
                  <span className="ud-text-sm ud-font-bold">{n.title}</span>
                  {!n.isRead && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A7FFF' }} />}
                </div>
                <div className="ud-text-sm ud-text-muted" style={{ lineHeight: 1.5 }}>{n.desc}</div>
                <div className="ud-flex ud-items-center ud-gap-8" style={{ marginTop: 6 }}>
                  <span className="ud-text-xs ud-text-muted">{n.time}</span>
                  <span className={`ud-badge ${n.type === 'success' ? 'ud-badge-green' : n.type === 'warning' ? 'ud-badge-amber' : 'ud-badge-blue'}`} style={{ fontSize: 10, padding: '1px 6px' }}>{cfg.label}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
