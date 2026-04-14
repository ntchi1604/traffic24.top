import { useState, useRef, useEffect } from 'react'

/* ── Mock Data ── */
const TICKETS = [
  {
    id: 'TK-2041', subject: 'Chiến dịch không giao traffic', tag: 'Campaign', status: 'pending',
    time: '2 giờ trước', preview: 'Mình đã tạo chiến dịch từ hôm qua nhưng vẫn chưa thấy traffic...',
    messages: [
      { from: 'user', text: 'Chào team support, mình đã tạo chiến dịch từ hôm qua nhưng vẫn chưa thấy traffic nào được giao. Chiến dịch có trạng thái là "Đang chạy" nhưng số liệu vẫn là 0.', time: '10:22' },
      { from: 'agent', text: 'Chào bạn! Mình đã kiểm tra chiến dịch #1042 của bạn. Hệ thống đang xử lý và phân phối traffic. Thông thường cần 1-2 giờ để bắt đầu. Bạn có thể chờ thêm một chút không?', time: '10:35' },
      { from: 'user', text: 'Mình đã chờ từ tối qua đến giờ rồi, hơn 12 tiếng rồi ạ. URL đích của mình là shopxanh.vn/sale.', time: '10:38' },
      { from: 'agent', text: 'Cảm ơn bạn đã cung cấp thêm thông tin! Mình đã kiểm tra và phát hiện URL đích của bạn đang bị chặn bởi bộ lọc. Mình sẽ escalate lên team kỹ thuật ngay. ETA khoảng 30 phút.', time: '10:45' },
      { from: 'user', text: 'Cảm ơn bạn, mình chờ nhé. Nếu không được thì mình muốn hoàn tiền cho chiến dịch này.', time: '10:47' },
    ],
  },
  {
    id: 'TK-2038', subject: 'Nạp tiền chưa vào tài khoản', tag: 'Billing', status: 'pending',
    time: '5 giờ trước', preview: 'Mình đã nạp $200 qua USDT TRC20 nhưng số dư chưa cập nhật...',
    messages: [
      { from: 'user', text: 'Mình đã chuyển $200 USDT TRC20, có txhash đây: 0xabc...def. Nhưng đã 2 tiếng rồi số dư vẫn chưa cập nhật.', time: '08:10' },
      { from: 'agent', text: 'Bạn ơi, mình đã nhận thông tin. Vui lòng cho mình kiểm tra blockchain. Txhash của bạn đã được xác nhận 18 block rồi. Mình sẽ xử lý thủ công trong vài phút.', time: '08:22' },
      { from: 'agent', text: 'Đã cộng $200 vào tài khoản của bạn thành công! Xin lỗi vì sự chậm trễ này nhé. Hệ thống auto-detect đang được cải thiện.', time: '08:31' },
      { from: 'user', text: 'Đã thấy rồi, cảm ơn bạn nhiều!', time: '08:33' },
    ],
  },
  {
    id: 'TK-2031', subject: 'Hỏi về chiết khấu khối lượng lớn', tag: 'Sales', status: 'closed',
    time: '2 ngày trước', preview: 'Mình muốn mua traffic số lượng lớn, có discount không ạ...',
    messages: [
      { from: 'user', text: 'Team ơi, mình muốn mua traffic số lượng lớn khoảng 10M lượt/tháng. Có gói enterprise hoặc discount đặc biệt không ạ?', time: '14:00' },
      { from: 'agent', text: 'Chào bạn! Chúng mình có gói Enterprise với discount 25% cho đơn từ 5M lượt/tháng và 35% cho 10M+. Bạn muốn mình gửi báo giá chi tiết không?', time: '14:15' },
      { from: 'user', text: 'Vâng, bạn gửi báo giá vào email của mình nhé: buyer@shop.vn. Cảm ơn!', time: '14:18' },
      { from: 'agent', text: 'Đã gửi báo giá chi tiết vào email bạn rồi nhé. Có gì cần hỗ trợ thêm cứ liên hệ mình!', time: '14:25' },
    ],
  },
  {
    id: 'TK-2028', subject: 'Lỗi khi tạo chiến dịch mới', tag: 'Bug', status: 'closed',
    time: '4 ngày trước', preview: 'Bước 3 trong wizard tạo chiến dịch bị lỗi "Invalid URL"...',
    messages: [
      { from: 'user', text: 'Mình gặp lỗi "Invalid URL" ở bước 3 khi tạo chiến dịch dù URL mình nhập là hợp lệ: https://mysite.vn/landing', time: '09:05' },
      { from: 'agent', text: 'Cảm ơn bạn đã báo cáo! Đây là bug đã biết ở một số URL có fragment. Team dev đã fix và deploy lên production rồi. Bạn thử lại xem sao?', time: '09:40' },
      { from: 'user', text: 'Oke rồi bạn ơi, đã tạo được chiến dịch thành công! Cảm ơn team đã xử lý nhanh.', time: '09:52' },
    ],
  },
  {
    id: 'TK-2019', subject: 'Yêu cầu xuất hóa đơn VAT', tag: 'Billing', status: 'closed',
    time: '1 tuần trước', preview: 'Mình cần xuất hóa đơn VAT cho tháng 2/2026...',
    messages: [
      { from: 'user', text: 'Mình cần hóa đơn VAT cho các giao dịch tháng 2/2026 để quyết toán thuế.', time: '11:00' },
      { from: 'agent', text: 'Bạn vui lòng cung cấp: tên công ty, MST, địa chỉ xuất hóa đơn để mình xử lý nhé.', time: '11:20' },
      { from: 'user', text: 'Công ty TNHH ABC, MST: 0123456789, địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM.', time: '11:25' },
      { from: 'agent', text: 'Đã xuất hóa đơn VAT và gửi vào email tài khoản rồi bạn nhé! Tổng giá trị: $248, VAT 10%: $24.8.', time: '11:45' },
    ],
  },
]

const TAG_COLORS = {
  Campaign: { bg: 'rgba(0,86,204,0.15)', border: 'rgba(0,86,204,0.35)', text: '#1A7FFF' },
  Billing: { bg: 'rgba(255,140,0,0.12)', border: 'rgba(255,140,0,0.3)', text: '#FF8C00' },
  Sales: { bg: 'rgba(0,201,105,0.12)', border: 'rgba(0,201,105,0.28)', text: '#00C969' },
  Bug: { bg: 'rgba(255,77,106,0.12)', border: 'rgba(255,77,106,0.28)', text: '#FF4D6A' },
}

/* ── Styles ── */
const glass = {
  background: 'var(--db-surface)',
  backdropFilter: 'blur(24px)',
  border: '1px solid var(--db-border)',
}

/* ── Agent Avatar ── */
function AgentAvatar({ size = 42 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0056CC 0%, #7B3FDB 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 2.5px rgba(0,201,105,0.7), 0 0 12px rgba(0,201,105,0.4)',
      }}>
        <svg viewBox="0 0 24 24" fill="none" width={size * 0.52} height={size * 0.52}>
          <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.85)" />
        </svg>
      </div>
      {/* Online dot */}
      <div style={{
        position: 'absolute', bottom: 1, right: 1, width: 10, height: 10,
        borderRadius: '50%', background: '#00C969',
        boxShadow: '0 0 8px rgba(0,201,105,0.9)',
        border: '2px solid var(--db-bg, #0D1B2A)',
      }} />
    </div>
  )
}

/* ── Chat Bubble ── */
function Bubble({ msg, isDark }) {
  const isUser = msg.from === 'user'
  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end', gap: 10, marginBottom: 14,
    }}>
      {/* Avatar */}
      {!isUser && <AgentAvatar size={34} />}
      {isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #FF8C00, #FF6B00)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#fff',
        }}>NC</div>
      )}
      {/* Bubble */}
      <div style={{
        maxWidth: '68%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? (isDark ? 'rgba(255,140,0,0.12)' : 'rgba(255,140,0,0.08)')
          : (isDark ? 'rgba(0,86,204,0.18)' : 'rgba(0,86,204,0.1)'),
        border: isUser
          ? '1px solid rgba(255,140,0,0.25)'
          : '1px solid rgba(0,86,204,0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: isUser
          ? '0 4px 20px rgba(255,140,0,0.08)'
          : '0 4px 20px rgba(0,86,204,0.1)',
      }}>
        <p style={{
          margin: 0, fontSize: 13.5, lineHeight: 1.55,
          color: 'var(--db-text)', fontWeight: 400,
        }}>{msg.text}</p>
        <div style={{
          fontSize: 10.5, marginTop: 6,
          color: 'var(--db-text-3)', textAlign: isUser ? 'right' : 'left',
        }}>{msg.time}</div>
      </div>
    </div>
  )
}

/* ── Main Export ── */
export default function SupportPage({ theme = 'dark' }) {
  const isDark = theme === 'dark'
  const [active, setActive] = useState(0)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(TICKETS[0].messages)
  const [filter, setFilter] = useState('all')
  const [showChat, setShowChat] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ticket = TICKETS[active]

  useEffect(() => {
    setMessages(TICKETS[active].messages)
  }, [active])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'agent',
        text: 'Cảm ơn bạn đã phản hồi! Mình đã ghi nhận thông tin và sẽ xử lý trong thời gian sớm nhất.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1200)
  }

  const handleSelectTicket = (idx) => {
    setActive(idx)
    if (isMobile) setShowChat(true)
  }

  const filtered = filter === 'all' ? TICKETS : TICKETS.filter(t => t.status === filter)

  return (
    <div id="support-page" style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 160px)', minHeight: 480 }}>

      {/* Page header row */}
      <div id="sp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'Tất Cả', TICKETS.length], ['pending', 'Đang Xử Lý', TICKETS.filter(t => t.status === 'pending').length], ['closed', 'Đã Đóng', TICKETS.filter(t => t.status === 'closed').length]].map(([val, label, count]) => (
            <button key={val} id={`sp-filter-${val}`} onClick={() => setFilter(val)} style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
              border: filter === val ? '1.5px solid #0056CC' : '1.5px solid var(--db-border)',
              background: filter === val ? 'rgba(0,86,204,0.14)' : 'transparent',
              color: filter === val ? '#1A7FFF' : 'var(--db-text-2)',
              transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {label}
              <span style={{
                fontSize: 10.5, fontWeight: 800, padding: '1px 7px', borderRadius: 100,
                background: filter === val ? '#0056CC' : 'var(--db-surface-2)',
                color: filter === val ? '#fff' : 'var(--db-text-3)',
              }}>{count}</span>
            </button>
          ))}
        </div>

        <button id="sp-new-ticket" style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
          background: 'linear-gradient(135deg, #FF8C00, #FF6B00)', border: 'none',
          borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 6px 22px rgba(255,140,0,0.35)',
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Tạo Ticket Mới
        </button>
      </div>

      {/* Main two-column panel */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '320px 1fr',
        gap: 0, ...glass, borderRadius: 24, overflow: 'hidden', minHeight: 0,
      }}>

        {/* ── Left: Ticket List ── */}
        <div style={{
          borderRight: isMobile ? 'none' : '1px solid var(--db-border)',
          display: isMobile && showChat ? 'none' : 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--db-border)', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35, pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input placeholder="Tìm ticket..." style={{
                width: '100%', padding: '9px 12px 9px 32px', boxSizing: 'border-box',
                background: 'var(--db-surface-2)', border: '1px solid var(--db-border)',
                borderRadius: 10, fontSize: 12.5, color: 'var(--db-text)',
                outline: 'none', fontFamily: 'Inter, sans-serif',
              }} />
            </div>
          </div>

          {/* Ticket items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {filtered.map((tk, i) => {
              const realIdx = TICKETS.indexOf(tk)
              const isActive = active === realIdx
              const isPending = tk.status === 'pending'
              const tag = TAG_COLORS[tk.tag] || TAG_COLORS.Campaign
              return (
                <button key={tk.id} id={`sp-ticket-${tk.id}`} onClick={() => handleSelectTicket(realIdx)} style={{
                  width: '100%', textAlign: 'left', padding: '14px 16px',
                  background: isActive ? (isDark ? 'rgba(0,86,204,0.18)' : 'rgba(0,86,204,0.1)') : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `3px solid #0056CC` : '3px solid transparent',
                  boxShadow: isActive ? 'inset 4px 0 20px rgba(0,86,204,0.12)' : 'none',
                  cursor: 'pointer', transition: 'all 0.18s',
                  borderBottom: '1px solid var(--db-border)',
                }}>
                  {/* Row 1: ID + status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--db-text-3)', fontFamily: 'Courier New, monospace' }}>{tk.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: isPending ? '#FF8C00' : '#00C969',
                        boxShadow: isPending ? '0 0 8px rgba(255,140,0,0.9)' : '0 0 8px rgba(0,201,105,0.9)',
                      }} />
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: isPending ? '#FF8C00' : '#00C969' }}>
                        {isPending ? 'Đang xử lý' : 'Đã đóng'}
                      </span>
                    </div>
                  </div>
                  {/* Row 2: Subject */}
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--db-title-color)', marginBottom: 5, lineHeight: 1.3 }}>
                    {tk.subject}
                  </div>
                  {/* Row 3: Preview */}
                  <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', marginBottom: 8, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {tk.preview}
                  </div>
                  {/* Row 4: Tag + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                      background: tag.bg, border: `1px solid ${tag.border}`, color: tag.text,
                    }}>{tk.tag}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--db-text-3)' }}>{tk.time}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Chat Detail ── */}
        <div style={{ display: isMobile && !showChat ? 'none' : 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--db-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, background: isDark ? 'rgba(0,86,204,0.05)' : 'rgba(0,86,204,0.03)',
            gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {/* Back button — mobile only */}
              {isMobile && (
                <button onClick={() => setShowChat(false)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                  color: 'var(--db-text-2)', display: 'flex', alignItems: 'center', flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <AgentAvatar size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--db-title-color)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ticket.subject}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--db-text-3)' }}>Agent: Minh Trí</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#00C969', fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C969', boxShadow: '0 0 6px #00C969', display: 'inline-block' }} />
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                background: ticket.status === 'pending' ? 'rgba(255,140,0,0.12)' : 'rgba(0,201,105,0.1)',
                border: ticket.status === 'pending' ? '1px solid rgba(255,140,0,0.3)' : '1px solid rgba(0,201,105,0.25)',
                color: ticket.status === 'pending' ? '#FF8C00' : '#00C969',
              }}>
                {ticket.status === 'pending' ? 'Đang xử lý' : 'Đã đóng'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--db-text-3)', fontFamily: 'Courier New, monospace' }}>{ticket.id}</span>
            </div>
          </div>

          {/* Messages area */}
          <div ref={chatRef} style={{
            flex: 1, overflowY: 'auto', padding: '24px 28px',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          }}>
            {/* Date divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--db-border)' }} />
              <span style={{ fontSize: 11, color: 'var(--db-text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {ticket.time}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--db-border)' }} />
            </div>

            {messages.map((msg, i) => <Bubble key={i} msg={msg} isDark={isDark} />)}

            {/* Typing indicator - only when pending */}
            {ticket.status === 'pending' && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 8 }}>
                <AgentAvatar size={34} />
                <div style={{
                  padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                  background: isDark ? 'rgba(0,86,204,0.15)' : 'rgba(0,86,204,0.08)',
                  border: '1px solid rgba(0,86,204,0.22)',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#1A7FFF',
                      animation: `sp-bounce 1.2s ${d}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{
            padding: '16px 24px', borderTop: '1px solid var(--db-border)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 10,
              background: 'var(--db-surface-2)', border: '1px solid var(--db-border)',
              borderRadius: 16, padding: '10px 14px',
              boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.08)',
              transition: 'border-color 0.2s',
            }}>
              {/* Attachment */}
              <button id="sp-attach-btn" title="Đính kèm file" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--db-text-3)', padding: '4px', flexShrink: 0,
                display: 'flex', alignItems: 'center',
                transition: 'color 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#0056CC'}
                onMouseLeave={e => e.currentTarget.style.color = ''}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M21.44 11.05L12.25 20.24a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Textarea */}
              <textarea
                id="sp-message-input"
                rows={1}
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                style={{
                  flex: 1, resize: 'none', background: 'transparent', border: 'none',
                  outline: 'none', fontSize: 13.5, color: 'var(--db-text)',
                  fontFamily: 'Inter, sans-serif', lineHeight: 1.55,
                  maxHeight: 100, overflowY: 'auto',
                  caretColor: '#FF8C00',
                }}
              />

              {/* Send button */}
              <button id="sp-send-btn" onClick={handleSend} style={{
                flexShrink: 0, padding: '8px 18px',
                background: input.trim() ? 'linear-gradient(135deg, #FF8C00, #FF6B00)' : 'var(--db-surface)',
                border: input.trim() ? 'none' : '1px solid var(--db-border)',
                borderRadius: 11, color: input.trim() ? '#fff' : 'var(--db-text-3)',
                fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
                boxShadow: input.trim() ? '0 4px 18px rgba(255,140,0,0.4)' : 'none',
                transition: 'all 0.22s', letterSpacing: '0.5px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                GỬI
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginTop: 7, paddingLeft: 2 }}>
              Nhấn Enter để gửi · Shift+Enter xuống dòng
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes sp-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @media (max-width: 600px) {
          #sp-header-row { flex-direction: column !important; align-items: flex-start !important; }
          #sp-header-row > div { flex-wrap: wrap !important; }
          #sp-new-ticket { width: 100% !important; justify-content: center !important; }
        }
      `}</style>
    </div>
  )
}
