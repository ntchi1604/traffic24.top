import '../user-dashboard.css'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import DateRangePicker from '../components/DateRangePicker'
import UserLinksPage from './UserLinksPage'
import UserHiddenLinksPage from './UserHiddenLinksPage'
import UserIncomePage from './UserIncomePage'
import UserWithdrawPage from './UserWithdrawPage'
import UserTransactionHistoryPage from './UserTransactionHistoryPage'
import UserPricingPage from './UserPricingPage'
import UserAccountPage from './UserAccountPage'
import UserSupportPage from './UserSupportPage'
import UserApiPage from './UserApiPage'

/* ─── Theme hook ─── */
function useTheme() {
  const getSystem = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('ud-theme') || getSystem())
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('ud-theme', next)
  }
  return { theme, toggle }
}

function ThemeIcon({ theme }) {
  if (theme === 'light') return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Mock Data ─── */
const USER = { name: 'Nguyen Van Minh', email: 'minh.nguyen@gmail.com', initials: 'NM', plan: 'Worker', balance: 1250000, referralCode: 'MINH4821' }

const KPI = [
  { id: 'today', label: 'Hôm Nay', value: '0 views', sub: 'Thu nhập: 0đ', color: '#1A7FFF', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
  { id: 'available', label: 'View Khả Dụng / Đang Xử Lý', value: '8.947 views', sub: '0 nhiệm vụ đang xử lý', color: '#5B8DEF', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'wallet', label: 'Ví Thu Nhập', value: '61.335.534đ', sub: 'Số dư khả dụng', color: '#A855F7', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/></svg> },
  { id: 'completed', label: 'Tổng Lượt Xem Hoàn Thành', value: '43.010', sub: 'Tổng thu nhập: 2.150.500đ', color: '#22C55E', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
]

const TOP_MONTH = [
  { name: 'Nguyễn Văn Minh', initials: 'NM', color: '#0056CC', views: 62400, income: 3120000 },
  { name: 'Trần Thị Hương', initials: 'TH', color: '#E07A00', views: 55800, income: 2790000 },
  { name: 'Lê Văn Đức', initials: 'LD', color: '#5B8DEF', views: 41200, income: 2060000 },
  { name: 'Phạm Minh Tuấn', initials: 'PT', color: '#22C55E', views: 38100, income: 1905000 },
  { name: 'Hoàng Thị Mai', initials: 'HM', color: '#A855F7', views: 33600, income: 1680000 },
  { name: 'Đỗ Văn Nam', initials: 'DN', color: '#E05555', views: 31200, income: 1560000 },
  { name: 'Ngô Thị Lan', initials: 'NL', color: '#FF9520', views: 28900, income: 1445000 },
  { name: 'Bùi Minh Khôi', initials: 'BK', color: '#1A7FFF', views: 26400, income: 1320000 },
  { name: 'Vũ Thị Thanh', initials: 'VT', color: '#5CFFA0', views: 24100, income: 1205000 },
  { name: 'Đặng Văn Hùng', initials: 'DH', color: '#7B3FDB', views: 21800, income: 1090000 },
]

const TOP_WEEK = [
  { name: 'Trần Thị Hương', initials: 'TH', color: '#E07A00', views: 18200, income: 910000 },
  { name: 'Nguyễn Văn Minh', initials: 'NM', color: '#0056CC', views: 16800, income: 840000 },
  { name: 'Lê Văn Đức', initials: 'LD', color: '#5B8DEF', views: 14500, income: 725000 },
  { name: 'Hoàng Thị Mai', initials: 'HM', color: '#A855F7', views: 12300, income: 615000 },
  { name: 'Phạm Minh Tuấn', initials: 'PT', color: '#22C55E', views: 11100, income: 555000 },
  { name: 'Ngô Thị Lan', initials: 'NL', color: '#FF9520', views: 9800, income: 490000 },
  { name: 'Bùi Minh Khôi', initials: 'BK', color: '#1A7FFF', views: 8900, income: 445000 },
  { name: 'Đỗ Văn Nam', initials: 'DN', color: '#E05555', views: 7600, income: 380000 },
  { name: 'Vũ Thị Thanh', initials: 'VT', color: '#5CFFA0', views: 6400, income: 320000 },
  { name: 'Đặng Văn Hùng', initials: 'DH', color: '#7B3FDB', views: 5200, income: 260000 },
]

const RECENT_ACTIVITY = [
  { date: '02/07', desc: 'Thu nhập views — thoimoda.vn', amount: 45200 },
  { date: '02/07', desc: 'Thu nhập views — techblog.vn', amount: 62400 },
  { date: '01/07', desc: 'Thu nhập views — shopxanh.vn', amount: 38100 },
  { date: '01/07', desc: 'Referral commission', amount: 75000 },
  { date: '30/06', desc: 'Thu nhập views — dulich247.vn', amount: 29300 },
]

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }
function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ' }

/* ─── Sparkline (smooth bezier + gradient fill + dot) ─── */
function Sparkline({ data, color, w = 80, h = 32 }) {
  const mn = Math.min(...data), mx = Math.max(...data)
  const pad = 3
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: pad + (1 - (v - mn) / (mx - mn || 1)) * (h - pad * 2),
  }))
  const makePath = (points) => points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')
  const linePath = makePath(pts)
  const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`
  const last = pts[pts.length - 1]
  const uid = `usp-${color.replace('#', '')}`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${uid})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} stroke="var(--ud-surface, #0a1628)" strokeWidth="1.5" />
    </svg>
  )
}

/* ─── TrafficChart (dual-axis: Lượt xem + Số dư) ─── */
function TrafficChart({ days = 30, theme }) {
  const isDark = theme === 'dark'
  const [hovIdx, setHovIdx] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const wrapRef = useRef(null)
  const svgRef = useRef(null)
  const [cW, setCW] = useState(700)

  useEffect(() => {
    if (!wrapRef.current) return
    const obs = new ResizeObserver(e => setCW(Math.floor(e[0].contentRect.width)))
    obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  const { labels, views, balance } = (() => {
    const step = days > 60 ? 7 : days > 30 ? 3 : 1
    const points = Math.min(Math.ceil(days / step), 20)
    const wave = (i, base, amp) => Math.round(base + amp * Math.sin(i * 1.7 + 1.2) + amp * 0.5 * Math.cos(i * 0.9 + 0.5))
    const ls = [], vs = [], bs = []
    let bal = 850000
    for (let i = 0; i < points; i++) {
      const daysAgo = (points - 1 - i) * step
      const d = new Date(); d.setDate(d.getDate() - daysAgo)
      ls.push(`${d.getDate()}/${d.getMonth() + 1}`)
      const v = Math.max(500, wave(i, 9400 + i * 120, 2200))
      vs.push(v)
      bal += Math.round(v * 0.03 + Math.sin(i * 1.2) * 20000)
      bs.push(bal)
    }
    return { labels: ls, views: vs, balance: bs }
  })()

  const W = Math.max(cW, 300), H = 220
  const PAD = { t: 20, r: 85, b: 40, l: 50 }
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b

  const maxV = Math.max(...views), minV = Math.min(...views), rngV = maxV - minV || 1
  const maxB = Math.max(...balance), minB = Math.min(...balance), rngB = maxB - minB || 1
  const ptsV = views.map((v, i) => ({ x: PAD.l + (i / (views.length - 1)) * innerW, y: PAD.t + (1 - (v - minV) / rngV) * innerH, label: labels[i], v }))
  const ptsB = balance.map((v, i) => ({ x: PAD.l + (i / (balance.length - 1)) * innerW, y: PAD.t + (1 - (v - minB) / rngB) * innerH, v }))

  const makePath = pts => pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')

  const pathV = makePath(ptsV)
  const pathB = makePath(ptsB)
  const areaV = pathV + ` L ${ptsV[ptsV.length - 1].x} ${PAD.t + innerH} L ${ptsV[0].x} ${PAD.t + innerH} Z`

  const fmtVND = val => val.toLocaleString('vi-VN') + 'đ'
  const fmtK = val => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toString()
  const fmtCompact = val => {
    if (val >= 1e9) return (val / 1e9).toFixed(1) + ' tỷ'
    if (val >= 1e6) return (val / 1e6).toFixed(1) + ' Tr'
    if (val >= 1e3) return (val / 1e3).toFixed(0) + 'k'
    return val.toString()
  }
  const gridLines = [0, .25, .5, .75, 1].map(f => ({
    y: PAD.t + f * innerH,
    vV: fmtK(Math.round(maxV - f * rngV)),
    vB: fmtCompact(Math.round(maxB - f * rngB)),
  }))
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(10,22,60,0.35)'
  const xMaxLabels = Math.max(2, Math.floor(innerW / 40))
  const xStep = Math.max(1, Math.ceil(ptsV.length / xMaxLabels))

  const handleMouseMove = e => {
    const svg = svgRef.current; if (!svg) return
    const rect = svg.getBoundingClientRect()
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    if (clientX == null) return
    const svgX = ((clientX - rect.left) / rect.width) * W
    let closest = 0, minDist = Infinity
    ptsV.forEach((p, i) => { const d = Math.abs(p.x - svgX); if (d < minDist) { minDist = d; closest = i } })
    setHovIdx(closest)
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const hp = hovIdx !== null ? ptsV[hovIdx] : null
  const hb = hovIdx !== null ? ptsB[hovIdx] : null

  const ttBg = isDark ? 'rgba(8,16,42,0.97)' : 'rgba(255,255,255,0.99)'
  const ttBorder = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,40,120,0.13)'
  const ttText = isDark ? 'rgba(240,245,255,0.9)' : 'rgba(10,22,60,0.9)'
  const ttSub = isDark ? 'rgba(180,200,240,0.6)' : 'rgba(10,22,60,0.45)'

  const tooltip = hp && hb ? createPortal(
    <div style={{
      position: 'fixed',
      left: mousePos.x + 18,
      top: mousePos.y - 70,
      transform: mousePos.x > window.innerWidth - 240 ? 'translateX(calc(-100% - 36px))' : 'none',
      zIndex: 99999,
      pointerEvents: 'none',
      minWidth: 200,
      background: ttBg,
      border: `1px solid ${ttBorder}`,
      borderRadius: 12,
      padding: '10px 14px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ttSub, marginBottom: 9, fontFamily: "'Inter',sans-serif", letterSpacing: '0.02em' }}>
        {hp.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0056CC', flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: ttText, fontFamily: "'Inter',sans-serif" }}>Lượt xem</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#1A7FFF', whiteSpace: 'nowrap' }}>
          {hp.v.toLocaleString('vi-VN')}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8C00', flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: ttText, fontFamily: "'Inter',sans-serif" }}>Số dư</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#FF8C00', whiteSpace: 'nowrap' }}>
          {fmtVND(hb.v)}
        </span>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative', overflow: 'visible' }}>
      {tooltip}
      <svg ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: H, display: 'block', cursor: 'crosshair', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovIdx(null)}
        onTouchMove={handleMouseMove}
        onTouchEnd={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="ud-chartLineV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0056CC" />
            <stop offset="100%" stopColor="#7B3FDB" />
          </linearGradient>
          <linearGradient id="ud-chartAreaV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0056CC" stopOpacity={isDark ? '0.28' : '0.14'} />
            <stop offset="100%" stopColor="#0056CC" stopOpacity="0.02" />
          </linearGradient>
          <filter id="ud-lineGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          {/* Blue line glow */}
          <filter id="ud-blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0.33  0 0 0 0 0.8  0 0 0 0.4 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Orange line glow */}
          <filter id="ud-orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0  0 0 0 0.4 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Dot halos */}
          <filter id="ud-dotGlowBlue" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.33  0 0 0 0 0.8  0 0 0 0.55 0" />
          </filter>
          <filter id="ud-dotGlowOrange" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>
        </defs>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={PAD.l + innerW} y2={g.y} stroke={gridColor} strokeWidth="1" strokeDasharray="4 6" />
            <text x={PAD.l - 8} y={g.y + 4} fill={labelColor} fontSize="10" textAnchor="end" fontFamily="Inter,sans-serif">{g.vV}</text>
            <text x={PAD.l + innerW + 8} y={g.y + 4} fill="rgba(255,140,0,0.6)" fontSize="9" textAnchor="start" fontFamily="'Outfit',Inter,sans-serif" fontWeight="500">{g.vB}</text>
          </g>
        ))}
        {ptsV.filter((_, i) => i % xStep === 0 || i === ptsV.length - 1).map((p, i) => (
          <text key={i} x={p.x} y={H - 10} fill={labelColor} fontSize="10" textAnchor="middle" fontFamily="Inter,sans-serif">{p.label}</text>
        ))}
        {hp && <line x1={hp.x} x2={hp.x} y1={PAD.t} y2={PAD.t + innerH} stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,40,120,0.18)'} strokeWidth="1.5" strokeDasharray="4 3" />}
        <path d={areaV} fill="url(#ud-chartAreaV)" />
        {/* Blue line glow */}
        <path d={pathV} fill="none" stroke="#0056CC" strokeWidth="5" filter="url(#ud-blueGlow)" strokeLinecap="round" opacity="0.3" />
        <path d={pathV} fill="none" stroke="url(#ud-chartLineV)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Orange line glow */}
        <path d={pathB} fill="none" stroke="#FF8C00" strokeWidth="5" filter="url(#ud-orangeGlow)" strokeLinecap="round" opacity="0.3" />
        <path d={pathB} fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" strokeOpacity="0.85" />
        {/* Static dots on both lines */}
        {ptsV.map((p, i) => (
          <circle key={`dv-${i}`} cx={p.x} cy={p.y} r="3" fill={isDark ? '#0a1628' : '#fff'} stroke="#1A7FFF" strokeWidth="1.5" />
        ))}
        {ptsB.map((p, i) => (
          <circle key={`db-${i}`} cx={p.x} cy={p.y} r="3" fill={isDark ? '#0a1628' : '#fff'} stroke="#FF8C00" strokeWidth="1.5" />
        ))}
        {/* Hover dots — bigger, on top */}
        {hp && <>
          <circle cx={hp.x} cy={hp.y} r="12" fill="#1A7FFF" filter="url(#ud-dotGlowBlue)" opacity="0.35" />
          <circle cx={hp.x} cy={hp.y} r="4.5" fill={isDark ? '#0a1628' : '#fff'} stroke="#1A7FFF" strokeWidth="2.5" />
          <circle cx={hb.x} cy={hb.y} r="12" fill="#FF8C00" filter="url(#ud-dotGlowOrange)" opacity="0.35" />
          <circle cx={hb.x} cy={hb.y} r="4.5" fill={isDark ? '#0a1628' : '#fff'} stroke="#FF8C00" strokeWidth="2.5" />
        </>}
      </svg>
    </div>
  )
}

/* ─── Notification data ─── */
const INIT_NOTIFS = [
  { id: 1, type: 'success', isRead: false, title: 'Thu nhập mới được cộng', desc: '45,200đ từ views thoimoda.vn', time: '10 phút trước' },
  { id: 2, type: 'warning', isRead: false, title: 'Số dư đang giảm', desc: 'Số dư dưới 1,500,000đ', time: '1 giờ trước' },
  { id: 3, type: 'info', isRead: false, title: 'Tính năng mới', desc: 'Link ẩn đã được cập nhật', time: '1 ngày trước' },
  { id: 4, type: 'success', isRead: true, title: 'Rút tiền thành công', desc: '500,000đ đã được chuyển', time: '3 ngày trước' },
]

const NOTIF_TYPE = {
  success: { color: '#00C969', bg: 'rgba(0,201,105,.12)', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  warning: { color: '#E07A00', bg: 'rgba(224,122,0,.12)', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  info: { color: '#1A7FFF', bg: 'rgba(0,86,204,.12)', icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
}

/* ─── Profile Dropdown ─── */
function ProfileDropdown({ open, onNav, user }) {
  if (!open) return null
  return createPortal(
    <div style={{ position: 'fixed', top: 72, right: 20, zIndex: 300 }} onClick={e => e.stopPropagation()}>
      <div className="ud-dropdown" style={{ minWidth: 240 }}>
        {/* User header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0056CC, #7B3FDB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{user.initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ud-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'var(--ud-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
          </div>
        </div>
        {/* Balance card */}
        <div style={{ margin: '0 8px 6px', padding: '10px 12px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,86,204,.12), rgba(123,63,219,.08))', border: '1px solid var(--ud-border)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--ud-text-3)', marginBottom: 4 }}>Số Dư</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 900, color: '#00C969' }}>{fmtC(user.balance)}</div>
        </div>
        <div className="ud-dropdown-divider" />
        <button className="ud-dropdown-item" onClick={() => onNav('/account')}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>
          Tài Khoản
        </button>
        <button className="ud-dropdown-item" onClick={() => onNav('/support')}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Hỗ Trợ
        </button>
        <div className="ud-dropdown-divider" />
        <button className="ud-dropdown-item" style={{ color: '#E05555' }} onClick={() => onNav('/')}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Đăng Xuất
        </button>
      </div>
    </div>, document.body
  )
}

/* ─── Notification Widget ─── */
function NotificationWidget() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const unread = INIT_NOTIFS.filter(n => !n.isRead).length
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="ud-notif-btn" onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        {unread > 0 && <span className="ud-notif-dot" />}
      </button>
      {open && (
        <div className="ud-notif-dropdown">
          <div className="ud-notif-header">
            <span className="ud-notif-title">Thông Báo</span>
            <button className="ud-notif-mark">Đánh dấu đã đọc</button>
          </div>
          {INIT_NOTIFS.map(n => {
            const cfg = NOTIF_TYPE[n.type] || NOTIF_TYPE.info
            return (
              <div key={n.id} className={`ud-notif-item ${!n.isRead ? 'ud-notif-unread' : ''}`}>
                <div className="ud-notif-icon-wrap" style={{ background: cfg.bg }}>{cfg.icon}</div>
                <div className="ud-notif-content">
                  <div className="ud-notif-text">{n.title}</div>
                  <div className="ud-notif-time">{n.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Auto-scroll Top Users ─── */
function TopUsersPanel({ onNavigate }) {
  const [tab, setTab] = useState('month')
  const [offset, setOffset] = useState(0)
  const data = tab === 'month' ? TOP_MONTH : TOP_WEEK
  const showCount = Math.min(data.length, 10)
  const list = data.slice(0, showCount)
  const ROW_H = 56

  useEffect(() => { setOffset(0) }, [tab])

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset(prev => (prev + 1) % showCount)
    }, 5000)
    return () => clearInterval(timer)
  }, [showCount])

  const rankColors = ['#FF8C00', '#1A7FFF', '#5CFFA0', '#A855F7', '#E05555']

  const renderRow = (item, rank, isTop) => (
    <div key={`${tab}-${item.initials}-${rank}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        height: ROW_H, padding: '0 16px',
        borderBottom: '1px solid var(--ud-border)',
        background: isTop ? 'var(--ud-row-hover)' : 'transparent',
      }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: rankColors[rank % rankColors.length], fontFamily: "'Outfit',sans-serif", width: 20, textAlign: 'center', flexShrink: 0 }}>
        {String(rank + 1).padStart(2, '0')}
      </span>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'Inter,sans-serif', flexShrink: 0, boxShadow: `0 0 10px ${item.color}30` }}>
        {item.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ud-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ud-text-3)' }}>
          {fmt(item.views)} views
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#22C55E', fontFamily: "'Outfit',sans-serif", flexShrink: 0 }}>
        {fmtC(item.income)}
      </span>
    </div>
  )

  /* Duplicate list for seamless loop */
  const doubleList = [...list, ...list]

  return (
    <div className="ud-table-panel">
      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--ud-border)' }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--ud-surface-2)', borderRadius: 10, padding: 3 }}>
          {[
            { id: 'month', label: 'Top View Tháng' },
            { id: 'week', label: 'Top View Tuần' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'all 0.2s',
                background: tab === t.id ? 'rgba(0,86,204,0.15)' : 'transparent',
                color: tab === t.id ? '#1A7FFF' : 'var(--ud-text-3)' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll viewport */}
      <div style={{ overflow: 'hidden', height: ROW_H * 5 }}>
        <div style={{
          transform: `translateY(-${offset * ROW_H}px)`,
          transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}>
          {doubleList.map((item, i) => {
            const rank = i % showCount
            return renderRow(item, rank, i === offset)
          })}
        </div>
      </div>

    </div>
  )
}

/* ─── Overview Page ─── */
function OverviewPage({ theme }) {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState({ mode: 'preset', days: 30 })

  const genDays = (base, phase, count = 90) => {
    const d = []
    for (let i = 0; i < count; i++) {
      const w = Math.sin((i + phase) * 0.07) * base * 0.15
      const t = (i / count) * base * 0.2
      d.push(Math.max(0, Math.round(base + w + t)))
    }
    return d
  }
  const allData = genDays(9400, 0)
  const chartData = allData.slice(-dateRange.days)

  const kpiRow1 = KPI.slice(0, 4)
  const kpiRow2 = KPI.slice(4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ud-kpi-row">
        {kpiRow1.map(k => (
          <div key={k.id} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="ud-kpi-icon">{k.icon}</div>
            <div className="ud-kpi-text">
              <div className="ud-kpi-label">{k.label}</div>
              <div className="ud-kpi-value">{k.value}</div>
              <div className="ud-kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {kpiRow2.length > 0 && (
        <div className="ud-kpi-row">
          {kpiRow2.map(k => (
            <div key={k.id} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
              <div className="ud-kpi-icon">{k.icon}</div>
              <div className="ud-kpi-text">
                <div className="ud-kpi-label">{k.label}</div>
                <div className="ud-kpi-value">{k.value}</div>
                <div className="ud-kpi-sub">{k.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="ud-overview-grid">
        <div className="ud-chart-panel">
          <div className="ud-panel-header">
            <div>
              <div className="ud-panel-title">Lượt Xem {dateRange.days} Ngày</div>
              <div className="ud-panel-sub">Tổng: {fmt(chartData.reduce((a, b) => a + b, 0))}</div>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} id="ov-drp" />
          </div>
          <div className="ud-chart-wrap">
            <TrafficChart days={dateRange.days} theme={theme} />
          </div>
        </div>

        <TopUsersPanel onNavigate={p => navigate(p)} />
      </div>

      <div className="ud-table-panel">
        <div className="ud-panel-header"><div className="ud-panel-title">Hoạt Động Gần Đây</div></div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Ngày</th><th>Mô Tả</th><th>Số tiền</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {RECENT_ACTIVITY.map((a, i) => (
                <tr key={i} className="ud-table-row">
                  <td className="ud-table-stats">{a.date}</td>
                  <td className="ud-table-name">{a.desc}</td>
                  <td className="ud-table-stats" style={{ color: '#00C969' }}>+{fmtC(a.amount)}</td>
                  <td><span className="ud-badge ud-badge-green">Hoàn Thành</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ═══ SIDEBAR NAV ═══ */

const NAV_ICONS = {
  overview: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
  links: <svg viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  hidden: <svg viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  income: <svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  withdraw: <svg viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  transactions: <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/></svg>,
  pricing: <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><path d="M7 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  account: <svg viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>,
  support: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  api: <svg viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

const NAV_STRUCTURE = [
  { type: 'item', id: 'overview', path: '/', label: 'Tổng Quan' },
  { type: 'group', label: 'Quản Lý Liên Kết', items: [
    { id: 'links', path: '/links', label: 'Tất cả liên kết' },
    { id: 'hidden', path: '/hidden-links', label: 'Liên kết ẩn' },
  ]},
  { type: 'group', label: 'Thống Kê', items: [
    { id: 'income', path: '/income', label: 'Thu nhập theo ngày' },
  ]},
  { type: 'group', label: 'Tài Chính', items: [
    { id: 'withdraw', path: '/withdraw', label: 'Rút tiền' },
    { id: 'transactions', path: '/transactions', label: 'Lịch sử giao dịch' },
  ]},
  { type: 'item', id: 'pricing', path: '/pricing', label: 'Bảng giá' },
  { type: 'item', id: 'account', path: '/account', label: 'Hồ sơ của tôi' },
  { type: 'item', id: 'support', path: '/support', label: 'Hỗ trợ' },
  { type: 'group', label: 'Công Cụ', items: [
    { id: 'api', path: '/api', label: 'API' },
  ]},
]

const PAGE_TITLES = {
  '': { title: 'Tổng Quan', sub: 'Xem tất cả số liệu của bạn' },
  links: { title: 'Tất Cả Liên Kết', sub: 'Danh sách link đang hoạt động' },
  'hidden-links': { title: 'Liên Kết Ẩn', sub: 'Các link đã ẩn khỏi danh sách' },
  income: { title: 'Thu Nhập Theo Ngày', sub: 'Theo dõi thu nhập từ views' },
withdraw: { title: 'Rút Tiền', sub: 'Quản lý yêu cầu rút tiền' },
  transactions: { title: 'Lịch Sử Giao Dịch', sub: 'Toàn bộ giao dịch' },
  pricing: { title: 'Bảng Giá', sub: 'Chọn gói phù hợp' },
  account: { title: 'Hồ Sơ Của Tôi', sub: 'Quản lý thông tin cá nhân' },
  support: { title: 'Hỗ Trợ', sub: 'Gửi yêu cầu hỗ trợ' },
  api: { title: 'API', sub: 'Kết nối với ứng dụng của bạn' },
}

/* ═══ MAIN SHELL ═══ */
export default function UserDashboardPage() {
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState(() => {
    const all = {}
    NAV_STRUCTURE.filter(n => n.type === 'group').forEach(g => { all[g.label] = true })
    return all
  })
  const profileRef = useRef(null)

  const seg = location.pathname.replace(/^\//, '')
  const { title, sub } = PAGE_TITLES[seg] || { title: 'Dashboard', sub: '' }

  const toggleGroup = label => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const h = e => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Auto-expand the group containing the active page
  useEffect(() => {
    NAV_STRUCTURE.forEach(item => {
      if (item.type === 'group') {
        const hasActive = item.items.some(sub => isActive(sub.id, sub.path))
        if (hasActive) setOpenGroups(prev => ({ ...prev, [item.label]: true }))
      }
    })
  }, [location.pathname])

  const isActive = (id, path) => {
    if (path === '/') return seg === ''
    return seg === path.replace(/^\//, '')
  }

  const navTo = path => { navigate(path); setSidebarOpen(false) }

  return (
    <div className="ud-root" data-theme={theme}>
      {/* Background */}
      <div className="ud-bg">
        <div className="ud-bg-orb ud-bg-orb1" />
        <div className="ud-bg-orb ud-bg-orb2" />
        <div className="ud-bg-orb ud-bg-orb3" />
        <div className="ud-bg-grid" />
      </div>

      {/* Sidebar */}
      {sidebarOpen && <div className="ud-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`ud-sidebar ${sidebarOpen ? 'ud-sidebar--open' : ''}`}>
        <div className="ud-logo" onClick={() => navTo('/')}>
          <img src="/images/traffic24h.png" alt="Traffic24h" />
          <span>Traffic24h</span>
        </div>
        <nav className="ud-nav">
          {NAV_STRUCTURE.map((item, idx) => {
            if (item.type === 'item') {
              return (
                <a key={item.id} className={`ud-nav-item ${isActive(item.id, item.path) ? 'ud-nav-active' : ''}`} onClick={e => { e.preventDefault(); navTo(item.path) }}>
                  <span className="ud-nav-pill-glow" />
                  <span className="ud-nav-icon">{NAV_ICONS[item.id]}</span>
                  <span className="ud-nav-label">{item.label}</span>
                </a>
              )
            }
            const isOpen = openGroups[item.label]
            return (
              <div key={idx} className="ud-nav-group">
                <div className="ud-nav-group-header" onClick={() => toggleGroup(item.label)}>
                  <span className="ud-nav-group-title">{item.label}</span>
                  <svg className={`ud-nav-group-chevron ${isOpen ? 'ud-nav-group-chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`ud-nav-group-items ${isOpen ? 'ud-nav-group-items--open' : ''}`}>
                  {item.items.map(sub => (
                    <a key={sub.id} className={`ud-nav-item ud-nav-item-nested ${isActive(sub.id, sub.path) ? 'ud-nav-active' : ''}`} onClick={e => { e.preventDefault(); navTo(sub.path) }}>
                      <span className="ud-nav-pill-glow" />
                      <span className="ud-nav-icon">{NAV_ICONS[sub.id]}</span>
                      <span className="ud-nav-label">{sub.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>
        <div className="ud-sidebar-footer">
          <div className="ud-user-mini" onClick={() => navTo('/account')}>
            <div className="ud-user-mini-avatar">{USER.initials}</div>
            <div>
              <div className="ud-user-mini-name">{USER.name}</div>
              <div className="ud-user-mini-role">{USER.plan} Member</div>
            </div>
          </div>
          <button className="ud-sidebar-theme-btn" onClick={toggle}>
            <ThemeIcon theme={theme} />
            <span>{theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ud-main">
        <header className="ud-topbar">
          <div className="ud-topbar-left">
            <button className="ud-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="ud-topbar-right">
            <div className="ud-topbar-badges">
              <div className="ud-topbar-badge ud-topbar-badge-wallet">
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/></svg>
                <span className="ud-topbar-badge-label">Thu nhập</span>
                <span className="ud-topbar-badge-value">61.335.534đ</span>
              </div>
            </div>
            <NotificationWidget />
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div className="ud-profile-pill" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="ud-avatar-ring">
                  <div className="ud-avatar">{USER.initials}</div>
                </div>
                <div className="ud-profile-info">
                  <div className="ud-profile-name">{USER.name}</div>
                  <div className="ud-profile-balance"><strong>{fmtC(USER.balance)}</strong></div>
                </div>
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style={{ color: 'var(--ud-text-3)' }}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <ProfileDropdown open={profileOpen} user={USER} onNav={p => { navigate(p); setProfileOpen(false) }} />
            </div>
          </div>
        </header>

        <div className="ud-content">
          <Routes>
            <Route index element={<OverviewPage theme={theme} />} />
            <Route path="links" element={<UserLinksPage />} />
            <Route path="hidden-links" element={<UserHiddenLinksPage />} />
            <Route path="income" element={<UserIncomePage theme={theme} />} />
            <Route path="withdraw" element={<UserWithdrawPage />} />
            <Route path="transactions" element={<UserTransactionHistoryPage />} />
            <Route path="pricing" element={<UserPricingPage />} />
            <Route path="account" element={<UserAccountPage />} />
            <Route path="support" element={<UserSupportPage />} />
            <Route path="api" element={<UserApiPage />} />
          </Routes>
        </div>
        <div className="ud-watermark">Traffic24h © 2026</div>
      </div>
    </div>
  )
}
