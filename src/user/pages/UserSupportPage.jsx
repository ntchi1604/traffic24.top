import { useState, useRef, useEffect } from 'react'

const TICKETS = [
  { id: 'TK-3041', subject: 'Không nhận được tiền rút', tag: 'Billing', status: 'pending', time: '01/07', preview: 'Tôi đã rút tiền ngày 28/06 nhưng chưa nhận được...', messages: [
    { from: 'user', text: 'Tôi đã rút tiền 500,000đ ngày 28/06 nhưng chưa nhận được. Mã: WD-3001.', time: '01/07 09:15' },
    { from: 'agent', text: 'Chào anh Minh, chúng tôi đang kiểm tra với ngân hàng. Vui lòng chờ 24h.', time: '01/07 10:30' },
  ]},
  { id: 'TK-3042', subject: 'Cách sử dụng link ẩn', tag: 'Sales', status: 'closed', time: '28/06', preview: 'Tôi muốn hỏi về tính năng ẩn link...', messages: [
    { from: 'user', text: 'Tính năng ẩn link là gì và sử dụng như thế nào?', time: '28/06 14:30' },
    { from: 'agent', text: 'Link ẩn cho phép bạn tạm ẩn link khỏi danh sách. Vẫn giữ dữ liệu cũ.', time: '28/06 15:00' },
  ]},
  { id: 'TK-3043', subject: 'Lỗi hiển thị số liệu', tag: 'Bug', status: 'pending', time: '25/06', preview: 'Số liệu views hiển thị không chính xác...', messages: [
    { from: 'user', text: 'Số liệu views thấp hơn so với Google Analytics.', time: '25/06 11:00' },
    { from: 'agent', text: 'Chúng tôi sẽ kiểm tra. Anh vui lòng gửi screenshot.', time: '25/06 14:20' },
  ]},
  { id: 'TK-3044', subject: 'Nâng lên gói Pro', tag: 'Billing', status: 'closed', time: '20/06', preview: 'Tôi muốn nâng lên gói Pro...', messages: [
    { from: 'user', text: 'Làm thế nào để nâng lên gói Pro?', time: '20/06 09:45' },
    { from: 'agent', text: 'Vào mục Bảng Giá và chọn gói Pro. Hệ thống sẽ hướng dẫn.', time: '20/06 10:15' },
  ]},
]

const TAG_COLORS = { Billing: 'ud-badge-amber', Sales: 'ud-badge-green', Bug: 'ud-badge-red' }

export default function UserSupportPage() {
  const [tickets, setTickets] = useState(TICKETS)
  const [activeId, setActiveId] = useState(TICKETS[0]?.id || null)
  const [filter, setFilter] = useState('all')
  const [newMsg, setNewMsg] = useState('')
  const chatEnd = useRef(null)
  const active = tickets.find(t => t.id === activeId)
  const filtered = tickets.filter(t => filter === 'all' || (filter === 'open' ? t.status === 'pending' : t.status === 'closed'))

  const sendMessage = () => {
    if (!newMsg.trim() || !activeId) return
    setTickets(prev => prev.map(t => {
      if (t.id !== activeId) return t
      return { ...t, messages: [...t.messages, { from: 'user', text: newMsg.trim(), time: 'Vừa xong' }] }
    }))
    setNewMsg('')
  }

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [active])

  return (
    <div className="ud-fade-in" style={{ display: 'flex', gap: 14, height: 'calc(100vh - 140px)' }}>
      <div className="ud-table-panel" style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="ud-panel-header"><div className="ud-panel-title">Ticket</div></div>
        <div style={{ padding: '8px 12px' }}>
          <div className="ud-search-wrap" style={{ width: '100%' }}>
            <svg className="ud-search-icon" viewBox="0 0 24 24" fill="none" width="14" height="14"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input className="ud-search" placeholder="Tìm kiếm..." style={{ fontSize: 12, padding: '8px 10px 8px 34px' }} />
          </div>
        </div>
        <div className="ud-tabs" style={{ margin: '0 12px 8px', padding: 3 }}>
          {[['all', 'Tất cả'], ['open', 'Đang mở'], ['closed', 'Đã đóng']].map(([k, l]) => (
            <button key={k} className={`ud-tab ${filter === k ? 'ud-tab-active' : ''}`} style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(t => (
            <div key={t.id} onClick={() => setActiveId(t.id)} style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid var(--ud-border)', background: t.id === activeId ? 'var(--ud-row-hover)' : 'transparent', transition: 'background .15s' }}>
              <div className="ud-flex ud-items-center ud-justify-between" style={{ marginBottom: 4 }}>
                <span className="ud-text-sm ud-font-bold">{t.subject}</span>
                <span className={`ud-status-badge ${t.status === 'pending' ? 'ud-status-pending' : 'ud-status-completed'}`}><span className="ud-status-dot" />{t.status === 'pending' ? 'Đang mở' : 'Đã đóng'}</span>
              </div>
              <div className="ud-flex ud-items-center ud-gap-6" style={{ marginBottom: 4 }}>
                <span className={`ud-badge ${TAG_COLORS[t.tag] || 'ud-badge-gray'}`} style={{ fontSize: 10, padding: '1px 6px' }}>{t.tag}</span>
                <span className="ud-text-xs ud-text-muted">{t.id}</span>
              </div>
              <div className="ud-text-xs ud-text-muted ud-truncate">{t.preview}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ud-chart-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {active ? (
          <>
            <div className="ud-panel-header">
              <div><div className="ud-panel-title">{active.subject}</div><div className="ud-text-xs ud-text-muted">{active.id} · {active.time}</div></div>
              <span className={`ud-status-badge ${active.status === 'pending' ? 'ud-status-pending' : 'ud-status-completed'}`}><span className="ud-status-dot" />{active.status === 'pending' ? 'Đang mở' : 'Đã đóng'}</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {active.messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                  <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.5, background: m.from === 'user' ? 'linear-gradient(135deg, #E07A00, #FF9520)' : 'var(--ud-surface)', color: m.from === 'user' ? '#fff' : 'var(--ud-text)', borderBottomRightRadius: m.from === 'user' ? 4 : 14, borderBottomLeftRadius: m.from === 'user' ? 14 : 4 }}>
                    {m.text}
                    <div style={{ fontSize: 10, marginTop: 4, opacity: .6, color: m.from === 'user' ? 'rgba(255,255,255,.7)' : 'var(--ud-text-3)' }}>{m.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEnd} />
            </div>
            {active.status === 'pending' && (
              <div style={{ padding: 12, borderTop: '1px solid var(--ud-border)' }}>
                <div className="ud-flex ud-gap-8">
                  <input className="ud-input" placeholder="Nhập tin nhắn..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage() }} style={{ flex: 1 }} />
                  <button className="ud-btn ud-btn-amber ud-btn-sm" onClick={sendMessage}><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="ud-empty"><div className="ud-empty-title">Chọn một ticket</div></div>
        )}
      </div>
    </div>
  )
}
