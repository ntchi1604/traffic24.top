import { useState } from 'react'

/* ═══════════════════════ DATA ═══════════════════════ */
const MOCK_HISTORY = [
  { id: 1, date: '03/04/2026', user: 'ngu***@gmail.com',   amount: '$50.00',  commission: '+$5.00',  status: 'paid' },
  { id: 2, date: '02/04/2026', user: 'tra***@yahoo.com',   amount: '$120.00', commission: '+$12.00', status: 'paid' },
  { id: 3, date: '01/04/2026', user: 'min***@hotmail.com', amount: '$80.00',  commission: '+$8.00',  status: 'paid' },
  { id: 4, date: '31/03/2026', user: 'hoa***@gmail.com',   amount: '$250.00', commission: '+$25.00', status: 'pending' },
  { id: 5, date: '30/03/2026', user: 'vip***@gmail.com',   amount: '$100.00', commission: '+$10.00', status: 'paid' },
]
const REF_LINK = 'https://traffic24h.top/ref/NC12345'

/* ═══════════════════════ ICONS ═══════════════════════ */
const IcUsers = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
)
const IcCoin = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M12 7v1m0 8v1M9.5 9.5C9.5 8.7 10.6 8 12 8s2.5.7 2.5 1.5S13.4 11 12 11s-2.5.7-2.5 1.5S10.6 16 12 16s2.5-.7 2.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IcClock = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcLink = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
)
const IcCopy = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.7"/>
  </svg>
)
const IcCheck = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)
const IcTelegram = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const IcRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
    <path d="M3 12a9 9 0 019-9 9 9 0 016.92 3.25L21 9M21 3v6h-6M21 12a9 9 0 01-9 9 9 9 0 01-6.92-3.25L3 15M3 21v-6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcArrow = () => (
  <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ═══════════════════════ COMPONENTS ═══════════════════════ */
function KpiCard({ icon, label, value, valueColor, valueShadow, sub, accentBg, accentBorder, iconColor }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20,
        background: 'var(--db-surface)',
        border: hov ? `1px solid ${accentBorder}` : '1px solid var(--db-border)',
        boxShadow: hov ? `0 8px 32px ${accentBg}` : '0 2px 12px rgba(0,0,0,0.12)',
        padding: '20px 22px',
        transition: 'all 0.25s',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: `linear-gradient(90deg, ${valueColor}, transparent)`, opacity: hov ? 1 : 0.5, transition:'opacity 0.25s' }}/>
      {/* blob */}
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background: accentBg, filter:'blur(24px)', pointerEvents:'none', transition:'opacity 0.25s', opacity: hov ? 0.9 : 0.5 }}/>

      <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'var(--db-text-3)', marginBottom:12 }}>{label}</div>
          <div style={{ fontFamily:`Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize:32, fontWeight:900, letterSpacing:'-1px', color: valueColor, lineHeight:1, textShadow: valueShadow }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:'var(--db-text-3)', marginTop:8 }}>{sub}</div>}
        </div>
        <div style={{
          width:44, height:44, borderRadius:14, flexShrink:0,
          background: accentBg, border:`1px solid ${accentBorder}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color: iconColor, transition:'all 0.25s',
          boxShadow: hov ? `0 4px 16px ${accentBg}` : 'none',
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [hovRow, setHovRow] = useState(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(REF_LINK).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareUrl = encodeURIComponent(REF_LINK)
  const shareText = encodeURIComponent('Kiếm tiền với traffic24h.top – nhận hoa hồng 10% trọn đời!')

  return (
    <div style={{ padding: '4px 0 48px' }} id="referral-page">

      {/* ══ HEADER ══ */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:42, height:42, borderRadius:14, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg, #7c3aed, #9333ea)',
            boxShadow:'0 6px 20px rgba(124,58,237,0.35)', color:'#fff',
          }}>
            <IcUsers size={20} />
          </div>
          <div>
            <h1 style={{ fontFamily:`Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize:20, fontWeight:800, color:'var(--db-title-color)', lineHeight:1, margin:0 }}>
              Giới thiệu bạn bè
            </h1>
            <p style={{ fontSize:12, color:'var(--db-text-3)', margin:'4px 0 0' }}>
              Nhận ngay <span style={{ color:'#10b981', fontWeight:700 }}>10% hoa hồng trọn đời</span> từ mỗi lần bạn bè nạp tiền
            </p>
          </div>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:'#10b981', padding:'6px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:100 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', display:'inline-block', boxShadow:'0 0 0 3px rgba(16,185,129,0.2)' }}/>
          Chương trình đang hoạt động
        </div>
      </div>

      {/* ══ KPI CARDS ══ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        <KpiCard
          icon={<IcCoin size={20} />}
          label="Tổng thu nhập"
          value="$150.50"
          valueColor="#10b981"
          valueShadow="0 0 24px rgba(16,185,129,0.45)"
          sub="Đã quy đổi vào tài khoản"
          accentBg="rgba(16,185,129,0.12)"
          accentBorder="rgba(16,185,129,0.3)"
          iconColor="#10b981"
        />
        <KpiCard
          icon={<IcClock size={20} />}
          label="Đang chờ duyệt"
          value="$25.00"
          valueColor="#f59e0b"
          valueShadow="0 0 24px rgba(245,158,11,0.45)"
          sub="Sẽ được duyệt trong 24h"
          accentBg="rgba(245,158,11,0.12)"
          accentBorder="rgba(245,158,11,0.3)"
          iconColor="#f59e0b"
        />
        <KpiCard
          icon={<IcUsers size={20} />}
          label="Tổng bạn bè"
          value="24"
          valueColor="#60a5fa"
          valueShadow="0 0 24px rgba(96,165,250,0.45)"
          sub="Người đã đăng ký qua link"
          accentBg="rgba(96,165,250,0.12)"
          accentBorder="rgba(96,165,250,0.3)"
          iconColor="#60a5fa"
        />
      </div>

      {/* ══ REFERRAL LINK CARD ══ */}
      <div style={{
        position:'relative', overflow:'hidden', borderRadius:20,
        background:'var(--db-surface)',
        border:'1px solid rgba(124,58,237,0.3)',
        boxShadow:'0 4px 24px rgba(124,58,237,0.12)',
        padding:'22px 24px', marginBottom:16,
      }}>
        {/* accent top line */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, #7c3aed, #a855f7, transparent)' }}/>
        <div style={{ position:'absolute', top:-30, left:'30%', width:200, height:200, borderRadius:'50%', background:'rgba(124,58,237,0.06)', filter:'blur(40px)', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', color:'#a78bfa', marginBottom:14 }}>
            Link giới thiệu của bạn
          </div>

          {/* Input + Copy button */}
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            <div style={{
              flex:1, display:'flex', alignItems:'center', gap:10,
              background:'var(--db-surface-2)',
              border:'1px solid var(--db-border)',
              borderRadius:12, padding:'10px 14px', minWidth:0,
            }}>
              <span style={{ color:'#a78bfa', flexShrink:0 }}><IcLink size={15} /></span>
              <input
                id="ref-link-input"
                readOnly
                value={REF_LINK}
                style={{
                  flex:1, background:'transparent', border:'none', outline:'none',
                  fontSize:13, color:'var(--db-text)', fontFamily:'monospace',
                  minWidth:0, cursor:'text',
                }}
              />
            </div>
            <button
              id="btn-copy-ref"
              onClick={handleCopy}
              style={{
                display:'inline-flex', alignItems:'center', gap:7, flexShrink:0,
                padding:'10px 18px', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer',
                background: copied ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #7c3aed, #9333ea)',
                color: copied ? '#10b981' : '#fff',
                border: copied ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(124,58,237,0.5)',
                boxShadow: copied ? '0 4px 16px rgba(16,185,129,0.2)' : '0 4px 20px rgba(124,58,237,0.35)',
                transition:'all 0.25s',
                whiteSpace:'nowrap',
              }}
            >
              {copied ? <IcCheck /> : <IcCopy />}
              {copied ? 'Đã sao chép!' : 'Sao chép'}
            </button>
          </div>

          {/* Social share */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11, color:'var(--db-text-3)', fontWeight:600 }}>Chia sẻ qua:</span>
            {[
              { id:'btn-share-fb', href:`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, icon:<IcFacebook />, label:'Facebook', color:'#3b82f6', bg:'rgba(59,130,246,0.12)', border:'rgba(59,130,246,0.3)' },
              { id:'btn-share-tg', href:`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, icon:<IcTelegram />, label:'Telegram', color:'#0ea5e9', bg:'rgba(14,165,233,0.12)', border:'rgba(14,165,233,0.3)' },
              { id:'btn-share-tw', href:`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, icon:<IcTwitter />, label:'Twitter', color:'var(--db-text-2)', bg:'var(--db-surface-2)', border:'var(--db-border)' },
            ].map(s => (
              <a
                key={s.id} id={s.id}
                href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width:34, height:34, borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: s.bg, border: `1px solid ${s.border}`,
                  color: s.color, textDecoration:'none', transition:'all 0.2s',
                }}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { transform:'scale(1.12)', boxShadow:`0 4px 14px ${s.bg}` })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { transform:'scale(1)', boxShadow:'none' })}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[
          { step:'01', title:'Sao chép link', desc:'Lấy link giới thiệu riêng của bạn ở trên.', color:'#7c3aed', bg:'rgba(124,58,237,0.1)', border:'rgba(124,58,237,0.25)' },
          { step:'02', title:'Chia sẻ bạn bè', desc:'Gửi link cho bạn bè, chia sẻ lên mạng xã hội.', color:'#9333ea', bg:'rgba(147,51,234,0.1)', border:'rgba(147,51,234,0.25)' },
          { step:'03', title:'Nhận hoa hồng', desc:'10% mỗi lần bạn bè nạp tiền, trọn đời.', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.25)' },
        ].map(s => (
          <div key={s.step} style={{
            display:'flex', gap:14, alignItems:'flex-start',
            padding:'16px 18px', borderRadius:16,
            background:'var(--db-surface)',
            border:`1px solid var(--db-border)`,
            boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
            transition:'transform 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor = s.border }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor = 'var(--db-border)' }}
          >
            <div style={{
              width:38, height:38, borderRadius:11, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center',
              background: s.bg, border:`1px solid ${s.border}`,
              fontFamily:`Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize:13, fontWeight:900, color: s.color,
            }}>{s.step}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--db-title-color)', marginBottom:4 }}>{s.title}</div>
              <div style={{ fontSize:11.5, color:'var(--db-text-3)', lineHeight:1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ HISTORY TABLE ══ */}
      <div style={{
        borderRadius:20, overflow:'hidden',
        background:'var(--db-surface)',
        border:'1px solid var(--db-border)',
        boxShadow:'0 4px 24px rgba(0,0,0,0.1)',
      }}>
        {/* Table header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid var(--db-border)', background:'var(--db-surface-2)' }}>
          <div>
            <div style={{ fontFamily:`Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize:15, fontWeight:800, color:'var(--db-title-color)' }}>Lịch sử hoa hồng</div>
            <div style={{ fontSize:11, color:'var(--db-text-3)', marginTop:2 }}>5 giao dịch gần nhất</div>
          </div>
          <button
            id="btn-refresh-history"
            style={{
              display:'inline-flex', alignItems:'center', gap:6,
              fontSize:12, fontWeight:600, color:'var(--db-text-3)',
              padding:'7px 12px', border:'1px solid var(--db-border)', borderRadius:9,
              background:'transparent', cursor:'pointer', transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color='var(--db-text)'; e.currentTarget.style.borderColor='var(--db-border-md)' }}
            onMouseLeave={e => { e.currentTarget.style.color='var(--db-text-3)'; e.currentTarget.style.borderColor='var(--db-border)' }}
          >
            <IcRefresh />
            Làm mới
          </button>
        </div>

        {/* Column headers */}
        <div style={{ display:'grid', gridTemplateColumns:'130px 1fr 110px 110px 120px', padding:'9px 20px', background:'rgba(0,0,0,0.15)', borderBottom:'1px solid var(--db-border)' }}>
          {['Thời gian','Người dùng','Giao dịch','Hoa hồng','Trạng thái'].map(h => (
            <span key={h} style={{ fontSize:9.5, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.7px', color:'var(--db-text-3)' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {MOCK_HISTORY.map((row, ri) => (
          <div
            key={row.id}
            id={`ref-row-${row.id}`}
            onMouseEnter={() => setHovRow(ri)}
            onMouseLeave={() => setHovRow(null)}
            style={{
              display:'grid', gridTemplateColumns:'130px 1fr 110px 110px 120px',
              padding:'13px 20px',
              borderBottom: ri < MOCK_HISTORY.length -1 ? '1px solid var(--db-border)' : 'none',
              background: hovRow === ri ? 'rgba(124,58,237,0.04)' : 'transparent',
              transition:'background 0.15s', alignItems:'center',
            }}
          >
            <span style={{ fontSize:12, color:'var(--db-text-3)', fontFamily:'monospace' }}>{row.date}</span>
            <span style={{ fontSize:13, color:'var(--db-text)', fontWeight:500 }}>{row.user}</span>
            <span style={{ fontSize:13, color:'var(--db-text)', fontWeight:600 }}>{row.amount}</span>
            <span style={{ fontSize:13, fontWeight:800, color:'#10b981', textShadow:'0 0 12px rgba(16,185,129,0.35)' }}>{row.commission}</span>
            <span>
              {row.status === 'paid' ? (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981' }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
                  Đã cộng
                </span>
              ) : (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:100, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', color:'#f59e0b' }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#f59e0b', display:'inline-block' }}/>
                  Chờ duyệt
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Table footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid var(--db-border)', background:'rgba(0,0,0,0.15)' }}>
          <span style={{ fontSize:11, color:'var(--db-text-3)' }}>Hiển thị 5 / 24 giao dịch</span>
          <button
            id="btn-view-all-history"
            style={{ fontSize:12, fontWeight:700, color:'#a78bfa', background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4, transition:'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.color='#a78bfa'}
          >
            Xem tất cả <IcArrow />
          </button>
        </div>
      </div>

      {/* ══ MOBILE RESPONSIVE ══ */}
      <style>{`
        @media (max-width: 640px) {
          #referral-page .ref-kpi-grid {
            grid-template-columns: 1fr !important;
          }
          #referral-page .ref-how-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 767px) {
          #referral-page .ref-table-row,
          #referral-page .ref-table-header {
            grid-template-columns: 90px 1fr 90px 80px !important;
          }
          #referral-page .ref-table-status-col {
            display: none !important;
          }
        }
      `}</style>

    </div>
  )
}
