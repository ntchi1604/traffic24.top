import '../dashboard.css'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import TopupPage from './TopupPage'
import SupportPage from './SupportPage'
import TrafficAnalyticsDashboard from './TrafficAnalyticsDashboard'
import AccountProfilePage from './AccountProfilePage'
import PricingPage from './PricingPage'
import ReferralPage from './ReferralPage'
import DateRangePicker from '../components/DateRangePicker'


/* ─── Theme hook ─── */
function useTheme() {
  const getSystem = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('db-theme') || getSystem())
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('db-theme', next)
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
const CAMPAIGNS = [
  { id: 1, name: 'Blog Thời Trang SEO', url: 'thoimoda.vn/blog', target: 250000, delivered: 212500, progress: 85, status: 'running' },
  { id: 2, name: 'Landing Page Khuyến Mãi', url: 'shopxanh.vn/sale', target: 150000, delivered: 75000, progress: 50, status: 'running' },
  { id: 3, name: 'Review Sản Phẩm Mới', url: 'techblog.vn/review', target: 500000, delivered: 500000, progress: 100, status: 'done' },
]

const KPI = [
  {
    id: 'campaigns', label: 'Chiến Dịch Active', value: '12', delta: '+2', up: true, color: '#1A7FFF',
    icon: <svg viewBox="0 0 24 24" fill="none"><path d="M3 3h18v4H3zM3 9h12v12H3zM17 13l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    spark: [3, 5, 4, 7, 6, 9, 8, 10, 12]
  },
  {
    id: 'traffic', label: 'Traffic Đã Giao', value: '2.4M', delta: '+18%', up: true, color: '#FF8C00',
    icon: <svg viewBox="0 0 24 24" fill="none"><path d="M22 12H2M16 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    spark: [2, 4, 3, 6, 8, 7, 9, 11, 14]
  },
  {
    id: 'balance', label: 'Số Dư Khả Dụng', value: '31.7M', delta: '-3.05M', up: false, color: '#00C969',
    icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v10M9 10h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    spark: [10, 9, 11, 8, 12, 10, 9, 8, 8]
  },
  {
    id: 'cost', label: 'Đã Chi Tiêu', value: '1.27M', delta: '-203K', up: false, color: '#A855F7',
    icon: <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /><path d="M6 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    spark: [28, 32, 30, 35, 38, 36, 42, 46, 50]
  },
]

const NAV_ITEMS = [
  { id: 'overview', path: '/', label: 'Tổng Quan', icon: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /></svg> },
  { id: 'campaigns', path: '/campaigns', label: 'Quản Lý Chiến Dịch', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { id: 'topup', path: '/topup', label: 'Nạp Tiền', icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v10M9 10h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { id: 'report', path: '/report', label: 'Báo Cáo', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { id: 'pricing', path: '/pricing', label: 'Bảng Giá', icon: <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /><path d="M7 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { id: 'referral', path: '/referral', label: 'Giới Thiệu', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { id: 'support', path: '/support', label: 'Hỗ Trợ', icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
]

/* ─── Sparkline ─── */
function Sparkline({ data, color, w = 80, h = 32 }) {
  const mn = Math.min(...data), mx = Math.max(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / (mx - mn || 1)) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace('#', '')})`} stroke="none" />
    </svg>
  )
}

/* ─── Traffic / Chi Phí Chart ─── */
function TrafficChart({ theme, days = 30 }) {
  const isDark = theme === 'dark'
  const [hovIdx, setHovIdx] = useState(null)
  const wrapRef = useRef(null)
  const svgRef = useRef(null)
  const [cW, setCW] = useState(700)

  useEffect(() => {
    if (!wrapRef.current) return
    const obs = new ResizeObserver(e => setCW(Math.floor(e[0].contentRect.width)))
    obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  /* viewBox khớp pixel thực → không méo, fill 100% width */
  const W = Math.max(cW, 300), H = 160
  const PAD = { t: 18, r: 64, b: 38, l: 58 }
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b

  // Generate deterministic data based on selected date range
  const { labels, traffic, cost } = (() => {
    if (days <= 1) {
      return {
        labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '23h', '23:30', 'Now'],
        traffic: [820, 1200, 980, 1540, 1320, 1890, 2100, 1780, 2340, 2600, 2200, 2850, 3100, 2900, 3400],
        cost: [12, 18, 14, 23, 19, 28, 31, 26, 35, 38, 32, 42, 46, 43, 50],
      }
    }
    const step = days > 60 ? 7 : days > 30 ? 3 : 1
    const points = Math.min(Math.ceil(days / step), 20)
    const wave = (i, base, amp) => Math.round(base + amp * Math.sin(i * 1.7 + 1.2) + amp * 0.5 * Math.cos(i * 0.9 + 0.5))
    const ls = [], ts = [], cs = []
    for (let i = 0; i < points; i++) {
      const daysAgo = (points - 1 - i) * step
      const d = new Date(); d.setDate(d.getDate() - daysAgo)
      ls.push(`${d.getDate()}/${d.getMonth() + 1}`)
      const t = Math.max(300, wave(i, 2200 + i * 45, 680))
      ts.push(t)
      cs.push(Math.max(5, wave(i, Math.round(t / 55), 7)))
    }
    return { labels: ls, traffic: ts, cost: cs }
  })()

  const maxT = Math.max(...traffic), maxC = Math.max(...cost)
  const ptsT = traffic.map((v, i) => ({ x: PAD.l + (i / (traffic.length - 1)) * innerW, y: PAD.t + (1 - v / maxT) * innerH, label: labels[i], v }))
  const ptsC = cost.map((v, i) => ({ x: PAD.l + (i / (cost.length - 1)) * innerW, y: PAD.t + (1 - v / maxC) * innerH, v }))
  const makePath = pts => pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')
  const pathT = makePath(ptsT)
  const pathC = makePath(ptsC)
  const areaT = pathT + ` L ${ptsT[ptsT.length - 1].x} ${PAD.t + innerH} L ${ptsT[0].x} ${PAD.t + innerH} Z`
  const gridLines = [0, .25, .5, .75, 1].map(f => ({ y: PAD.t + f * innerH, vT: Math.round(maxT * (1 - f)).toLocaleString(), vC: Math.round(maxC * (1 - f)) }))
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'

  const handleMouseMove = (e) => {
    const svg = svgRef.current; if (!svg) return
    const rect = svg.getBoundingClientRect()
    // viewBox W == cW → scale ≈ 1, no distortion in coordinate mapping
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let closest = 0, minDist = Infinity
    ptsT.forEach((p, i) => { const d = Math.abs(p.x - svgX); if (d < minDist) { minDist = d; closest = i } })
    setHovIdx(closest)
  }

  const hp = hovIdx !== null ? ptsT[hovIdx] : null
  const hc = hovIdx !== null ? ptsC[hovIdx] : null

  /* Tooltip position — clamp so it doesn't overflow edges */
  const ttW = 158, ttH = 82
  const ttX = hp ? Math.min(Math.max(hp.x - ttW / 2, 4), W - ttW - 4) : 0
  const ttY = hp ? Math.max(PAD.t - ttH - 10, 0) : 0
  const ttBg = isDark ? 'rgba(10,20,50,0.92)' : 'rgba(255,255,255,0.96)'
  const ttText = isDark ? 'rgba(240,245,255,0.9)' : 'rgba(10,22,60,0.9)'

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: H, display: 'block', cursor: 'crosshair', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="chartLineT" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0056CC" />
            <stop offset="100%" stopColor="#7B3FDB" />
          </linearGradient>
          <linearGradient id="chartAreaT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0056CC" stopOpacity={isDark ? '0.28' : '0.14'} />
            <stop offset="100%" stopColor="#0056CC" stopOpacity="0.02" />
          </linearGradient>
          <filter id="lineGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="ttShadow"><feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="rgba(0,0,0,0.3)" /></filter>
        </defs>

        {/* Grid */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={PAD.l + innerW} y2={g.y} stroke={gridColor} strokeWidth="1" strokeDasharray="4 6" />
            <text x={PAD.l - 8} y={g.y + 4} fill={labelColor} fontSize="10" textAnchor="end" fontFamily="Inter,sans-serif">{g.vT}</text>
            <text x={W - PAD.r + 10} y={g.y + 4} fill="rgba(255,140,0,0.55)" fontSize="10" textAnchor="start" fontFamily="Inter,sans-serif">{(g.vC * 25400).toLocaleString('vi-VN')}đ</text>
          </g>
        ))}
        {ptsT.filter((_, i) => i % 2 === 0).map((p, i) => (
          <text key={i} x={p.x} y={H - 6} fill={labelColor} fontSize="10" textAnchor="middle" fontFamily="Inter,sans-serif">{p.label}</text>
        ))}

        {/* Crosshair */}
        {hp && (
          <line x1={hp.x} x2={hp.x} y1={PAD.t} y2={PAD.t + innerH}
            stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,40,120,0.18)'}
            strokeWidth="1.5" strokeDasharray="4 3" />
        )}

        {/* Traffic area + line */}
        <path d={areaT} fill="url(#chartAreaT)" />
        <path d={pathT} fill="none" stroke="url(#chartLineT)" strokeWidth="5" strokeOpacity="0.2" filter="url(#lineGlow)" strokeLinecap="round" />
        <path d={pathT} fill="none" stroke="url(#chartLineT)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {ptsT.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y}
            r={hovIdx === i ? 6 : 3}
            fill={isDark ? '#fff' : '#0056CC'} stroke="url(#chartLineT)"
            strokeWidth={hovIdx === i ? 2.5 : 1.5}
            style={{ transition: 'r 0.1s, stroke-width 0.1s' }} />
        ))}

        {/* Cost line */}
        <path d={pathC} fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
        {ptsC.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y}
            r={hovIdx === i ? 6 : 3}
            fill={isDark ? '#fff' : '#FF8C00'} stroke="#FF8C00"
            strokeWidth={hovIdx === i ? 2.5 : 1.5}
            style={{ transition: 'r 0.1s, stroke-width 0.1s' }} />
        ))}

        {/* Tooltip */}
        {hp && hc && (() => {
          const tx = Math.min(Math.max(hp.x - ttW / 2, PAD.l), PAD.l + innerW - ttW)
          const ty = hp.y - ttH - 18 < PAD.t ? hp.y + 18 : hp.y - ttH - 18
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={ttW} height={ttH} rx="10" ry="10"
                fill={ttBg} stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,40,120,0.1)'}
                strokeWidth="1" filter="url(#ttShadow)" />
              {/* Label */}
              <text x={tx + 12} y={ty + 20} fill={isDark ? 'rgba(200,210,240,0.7)' : 'rgba(10,22,60,0.5)'}
                fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">{hp.label}</text>
              {/* Traffic row */}
              <circle cx={tx + 14} cy={ty + 37} r="4" fill="#0056CC" />
              <text x={tx + 24} y={ty + 41} fill={ttText} fontSize="11" fontFamily="Inter,sans-serif">Traffic</text>
              <text x={tx + ttW - 10} y={ty + 41} fill="#1A7FFF" fontSize="13" fontWeight="800"
                textAnchor="end" fontFamily="Outfit,sans-serif">{hp.v.toLocaleString()}</text>
              {/* Cost row */}
              <circle cx={tx + 14} cy={ty + 60} r="4" fill="#FF8C00" />
              <text x={tx + 24} y={ty + 64} fill={ttText} fontSize="11" fontFamily="Inter,sans-serif">Chi phí</text>
              <text x={tx + ttW - 10} y={ty + 64} fill="#FF8C00" fontSize="13" fontWeight="800"
                textAnchor="end" fontFamily="Outfit,sans-serif">{(hc.v * 25400).toLocaleString('vi-VN')}đ</text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}


/* ─── Campaign Management ─── */
const CM_CAMPAIGNS = [
  { id: 1, name: 'Blog Thời Trang SEO', url: 'thoimoda.vn/blog', country: '🇻🇳 VN', progress: 85, status: 'running', delivered: '212,500', target: '250,000' },
  { id: 2, name: 'Landing Page Khuyến Mãi', url: 'shopxanh.vn/sale', country: '🇻🇳 VN', progress: 62, status: 'paused', delivered: '93,000', target: '150,000' },
  { id: 3, name: 'Review Sản Phẩm Mới', url: 'techblog.vn/review', country: '🇺🇸 US', progress: 41, status: 'running', delivered: '41,000', target: '100,000' },
  { id: 4, name: 'Tăng Traffic Google', url: 'myshop.vn/home', country: '🇻🇳 VN', progress: 100, status: 'done', delivered: '500,000', target: '500,000' },
  { id: 5, name: 'SEO Thương Mại Điện Tử', url: 'ecostore.vn/shop', country: '🇸🇬 SG', progress: 28, status: 'running', delivered: '28,000', target: '100,000' },
  { id: 6, name: 'Organic Traffic Campaign', url: 'myblog.com/article', country: '🇯🇵 JP', progress: 55, status: 'stopped', delivered: '55,000', target: '100,000' },
]
const STATUS_CONFIG = {
  running: { label: 'Đang Chạy', color: '#00C969' },
  paused: { label: 'Tạm Dừng', color: '#FF8C00' },
  stopped: { label: 'Dừng Hẳn', color: '#FF4D4D' },
  done: { label: 'Hoàn Thành', color: '#1A7FFF' },
}

function CampaignManagement({ onCreateNew }) {
  const [search, setSearch] = useState('')
  const [statusF, setStatusF] = useState('all')

  const filtered = CM_CAMPAIGNS.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.url.toLowerCase().includes(search.toLowerCase())
    const mst = statusF === 'all' || c.status === statusF
    return ms && mst
  })

  return (
    <div className="cm-root" id="cm-page">
      <div className="cm-actions">
        <div className="cm-search-wrap">
          <svg className="cm-search-icon" viewBox="0 0 24 24" fill="none" width="18" height="18">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input className="cm-search" id="cm-search-input" type="text" placeholder="Tìm chiến dịch, URL..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="cm-filters">
          <select className="cm-filter-select" id="cm-filter-status" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">Trạng Thái</option>
            <option value="running">Đang Chạy</option>
            <option value="paused">Tạm Dừng</option>
            <option value="stopped">Dừng Hẳn</option>
            <option value="done">Hoàn Thành</option>
          </select>

        </div>
        <button className="cm-create-btn" id="cm-create-btn" onClick={onCreateNew}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Tạo Mới
        </button>
      </div>

      <section className="cm-table-panel" aria-label="Danh sách chiến dịch">
        <div className="cm-table-header">
          <div>
            <h2 className="db-panel-title">Quản Lý Chiến Dịch</h2>
            <p className="db-panel-sub">{filtered.length} chiến dịch {statusF !== 'all' ? STATUS_CONFIG[statusF]?.label : 'tất cả'}</p>
          </div>
          <div className="cm-count-badge">{CM_CAMPAIGNS.length} tổng cộng</div>
        </div>
        <div className="cm-table-wrap">
          <table className="cm-table" role="table">
            <thead>
              <tr>
                <th>Tên Chiến Dịch</th><th>URL Đích</th>
                <th>Tiến Độ</th><th>Trạng Thái</th><th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="cm-empty">Không tìm thấy chiến dịch nào</td></tr>
                : filtered.map(c => {
                  const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.running
                  const progColor = c.status === 'done' ? '#00C969' : c.status === 'paused' ? '#FF8C00' : c.status === 'stopped' ? '#FF4D4D' : '#FF8C00'
                  return (
                    <tr key={c.id} id={`cm-row-${c.id}`} className="cm-row">
                      <td>
                        <div className="cm-name">{c.name}</div>
                        <div className="cm-sub">{c.delivered} / {c.target} lượt</div>
                      </td>
                      <td><a href="#" className="db-link-url" onClick={e => e.preventDefault()}>{c.url}</a></td>
                      <td>
                        <div className="db-progress-wrap">
                          <div className="db-progress-bar">
                            <div className="db-progress-fill" style={{ width: `${c.progress}%`, '--prog-color': progColor }} />
                          </div>
                          <span className="db-progress-pct">{c.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="cm-status-badge" style={{ '--st-color': st.color }}>
                          <span className="cm-status-dot" style={{ background: st.color, boxShadow: `0 0 6px ${st.color}` }}
                            data-anim={c.status === 'running' ? 'pulse' : ''} />
                          {st.label}
                        </span>
                      </td>
                      <td>
                        <div className="db-action-btns">
                          <button className="db-action-btn" id={`cm-play-${c.id}`}
                            aria-label={c.status === 'running' ? 'Tạm dừng' : 'Chạy lại'}>
                            {c.status === 'running'
                              ? <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><rect x="6" y="4" width="4" height="16" rx="1.5" fill="currentColor" /><rect x="14" y="4" width="4" height="16" rx="1.5" fill="currentColor" /></svg>
                              : <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M5 3l14 9-14 9V3z" fill="currentColor" /></svg>
                            }
                          </button>
                          <button className="db-action-btn db-action-edit" id={`cm-edit-${c.id}`} aria-label="Chỉnh sửa">
                            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </button>
                          <button className="db-action-btn cm-action-chart" id={`cm-chart-${c.id}`} aria-label="Báo cáo">
                            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                              <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}


import CreateCampaignPage from './CreateCampaignPage'

function StubPage({ title, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 16, opacity: 0.45 }}>
      <div style={{ fontSize: 48 }}>{icon}</div>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--db-text)' }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--db-text-3)' }}>Trang này đang được phát triển</p>
    </div>
  )
}

/* ─── Overview page ─── */
const KPI_BY_RANGE_OV = {
  7: { campaigns: '12', traffic: '560K', balance: '31.7M', cost: '1.27M', dCamp: '+1', dTraffic: '+8%', dBalance: '-711K', dCost: '+203K' },
  30: { campaigns: '12', traffic: '2.4M', balance: '31.7M', cost: '5.33M', dCamp: '+2', dTraffic: '+18%', dBalance: '-3.05M', dCost: '+864K' },
  90: { campaigns: '12', traffic: '7.1M', balance: '31.7M', cost: '15.7M', dCamp: '+5', dTraffic: '+31%', dBalance: '-8.89M', dCost: '+2.41M' },
}

function OverviewPage({ theme }) {
  const navigate = useNavigate()
  const [range, setRange] = useState({ mode: 'preset', days: 30 })
  const days = range.days ?? 30
  const bucket = days <= 10 ? 7 : days <= 60 ? 30 : 90
  const d = KPI_BY_RANGE_OV[bucket]

  const kpiData = [
    { ...KPI[0], value: d.campaigns, delta: d.dCamp, up: true },
    { ...KPI[1], value: d.traffic, delta: d.dTraffic, up: true },
    { ...KPI[2], value: d.balance, delta: d.dBalance, up: false },
    { ...KPI[3], value: d.cost, delta: d.dCost, up: false },
  ]

  return (
    <>
      {/* Date range picker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: 'var(--db-text-3)' }}>
          {range.mode === 'custom'
            ? <>{range.from} – {range.to} · <strong style={{ color: 'var(--db-text)' }}>{days} ngày</strong></>
            : <>Dữ liệu <strong style={{ color: 'var(--db-text)' }}>{days} ngày</strong> gần nhất</>}
        </div>
        <DateRangePicker value={range} onChange={setRange} id="ov" />
      </div>

      {/* KPI */}
      <div className="db-kpi-row" role="list" aria-label="KPI Metrics">
        {kpiData.map(kpi => (
          <article key={kpi.id} className="db-kpi-card" id={`db-kpi-${kpi.id}`} role="listitem">
            <div className="db-kpi-top">
              <div className="db-kpi-icon" style={{ '--kpi-color': kpi.color }}>{kpi.icon}</div>
              <span className={`db-kpi-delta${kpi.up ? ' db-delta-up' : ' db-delta-down'}`}>
                {kpi.up ? '↑' : '↓'} {kpi.delta}
              </span>
            </div>
            <div className="db-kpi-value" style={{ '--kpi-color': kpi.color }}>{kpi.value}</div>
            <div className="db-kpi-label">{kpi.label}</div>
            <div className="db-kpi-spark"><Sparkline data={kpi.spark} color={kpi.color} /></div>
            <div className="db-kpi-glow" style={{ '--kpi-color': kpi.color }} aria-hidden="true" />
          </article>
        ))}
      </div>

      {/* Chart */}
      <section className="db-chart-panel" id="db-chart-section" aria-labelledby="chart-title">
        <div className="db-panel-header">
          <div>
            <h2 className="db-panel-title" id="chart-title">
              Traffic / Chi Phí {days <= 1 ? 'Hôm Nay' : `${days} Ngày Qua`}
            </h2>
            <p className="db-panel-sub">
              {days <= 1
                ? 'Hoạt động theo giờ · Cập nhật mỗi 5 phút'
                : `Dữ liệu tổng hợp theo ngày · ${days} ngày gần nhất`}
            </p>
          </div>
          <div className="db-chart-legend">
            <span className="db-legend-dot" style={{ background: '#0056CC' }} />
            <span className="db-legend-label">Traffic ({days <= 1 ? 'lượt/giờ' : 'lượt/ngày'})</span>
            <span className="db-legend-dot" style={{ background: '#FF8C00', marginLeft: 10 }} />
            <span className="db-legend-label">Chi Phí ($)</span>
            {days <= 1 && <div className="db-chart-badge">Live</div>}
          </div>
        </div>
        <div className="db-chart-wrap">
          <TrafficChart theme={theme} days={days} />
        </div>
      </section>

      {/* Table */}
      <section className="db-table-panel" id="db-table-section" aria-labelledby="table-title">
        <div className="db-panel-header">
          <div>
            <h2 className="db-panel-title" id="table-title">Chiến Dịch Đang Chạy</h2>
            <p className="db-panel-sub">{CAMPAIGNS.filter(c => c.status === 'running').length} chiến dịch active</p>
          </div>
          <button className="db-view-all-btn" id="db-view-all-btn"
            onClick={() => navigate('/campaigns')}>
            Xem Tất Cả →
          </button>
        </div>
        <div className="db-table-wrap">
          <table className="db-table" role="table" aria-labelledby="table-title">
            <thead>
              <tr>
                <th scope="col">Chiến Dịch</th>
                <th scope="col">URL</th>
                <th scope="col">Tiến Độ</th>
                <th scope="col">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map(c => (
                <tr key={c.id} id={`db-row-${c.id}`} className="db-table-row">
                  <td>
                    <div className="db-campaign-name">{c.name}</div>
                    <div className="db-campaign-stats">{c.delivered.toLocaleString()} / {c.target.toLocaleString()}</div>
                  </td>
                  <td><a href="#" className="db-link-url" onClick={e => e.preventDefault()}>{c.url}</a></td>
                  <td>
                    <div className="db-progress-wrap">
                      <div className="db-progress-bar">
                        <div className="db-progress-fill" style={{ width: `${c.progress}%`, '--prog-color': c.status === 'done' ? '#00C969' : '#FF8C00' }} />
                      </div>
                      <span className="db-progress-pct">{c.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`db-status-badge${c.status === 'done' ? ' db-status-done' : ' db-status-running'}`}>
                      <span className="db-status-dot" />
                      {c.status === 'done' ? 'Hoàn Thành' : 'Đang Chạy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── ACTIVITY PANEL ── */}
      <section className="db-chart-panel" id="db-activity-section" style={{ marginTop: 0 }}>
        <div className="db-panel-header">
          <div>
            <h2 className="db-panel-title">Hoạt Động Gần Đây</h2>
            <p className="db-panel-sub">Lịch sử hoạt động tài khoản trong 7 ngày qua</p>
          </div>
        </div>
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { dot: '#10b981', icon: 'check', title: 'Chiến dịch hoàn thành', desc: 'Blog Thời Trang SEO đã phân phối đủ 212,500 lượt truy cập.', time: '5 phút trước', tag: 'Hoàn thành', tagColor: '#10b981' },
            { dot: '#3b82f6', icon: 'login', title: 'Đăng nhập thành công', desc: 'Đăng nhập từ Hà Nội, VN · Chrome 122 · Windows 11', time: '2 giờ trước', tag: 'Bảo mật', tagColor: '#3b82f6' },
            { dot: '#3b82f6', icon: 'campaign', title: 'Tạo chiến dịch mới', desc: 'Chiến dịch #C-1247 đã được tạo và bắt đầu hoạt động.', time: 'Hôm qua', tag: 'Chiến dịch', tagColor: '#6366f1' },
            { dot: '#f59e0b', icon: 'topup', title: 'Nạp tiền thành công', desc: '5.080.000₫ đã được cộng vào tài khoản. Số dư hiện tại: 31.700.000₫.', time: '3 ngày trước', tag: 'Thanh toán', tagColor: '#f59e0b' },
            { dot: '#a855f7', icon: 'upgrade', title: 'Nâng cấp hạng thành viên', desc: 'Tài khoản đã được nâng lên hạng VIP. Nhận ưu đãi traffic +15%!', time: '5 ngày trước', tag: 'VIP', tagColor: '#a855f7' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--db-border)' : 'none',
            }}>
              {/* Timeline dot + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: item.dot, flexShrink: 0,
                  boxShadow: `0 0 8px ${item.dot}90`,
                }} />
                {i < arr.length - 1 && (
                  <div style={{ width: 1, flexGrow: 1, minHeight: 24, background: 'var(--db-border)', marginTop: 4 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--db-text)', fontFamily: "'Outfit',sans-serif" }}>{item.title}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: `color-mix(in srgb, ${item.tagColor} 14%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${item.tagColor} 28%, transparent)`,
                    color: item.tagColor, letterSpacing: '0.03em',
                  }}>{item.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--db-text-2)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
              {/* Time */}
              <span style={{ fontSize: 11, color: 'var(--db-text-3)', flexShrink: 0, paddingTop: 2 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/* ─── Notification Widget ─── */
const INIT_NOTIFS = [
  {
    id: 1, type: 'success', isRead: false,
    title: 'Chiến dịch hoàn thành',
    desc: 'Blog Thời Trang SEO đã phân phối đủ 212,500 lượt truy cập. Chiến dịch đã đạt 100% mục tiêu đề ra. Bạn có thể xem báo cáo chi tiết hoặc tạo chiến dịch mới.',
    time: '5 phút trước',
    action: { label: 'Xem Báo Cáo', path: '/report' },
  },
  {
    id: 2, type: 'warning', isRead: false,
    title: 'Số dư thấp',
    desc: 'Tài khoản hiện còn 31.700.000₫. Để đảm bảo các chiến dịch đang chạy không bị gián đoạn, hãy nạp thêm tiền vào tài khoản trước khi số dư cạn kiệt.',
    time: '32 phút trước',
    action: { label: 'Nạp Tiền Ngay', path: '/topup' },
  },
  {
    id: 3, type: 'info', isRead: false,
    title: 'Cập nhật hệ thống',
    desc: 'Nền tảng đã được nâng cấp lên phiên bản 3.1.0. Các cải tiến bao gồm: tốc độ phân phối traffic tăng 40%, giao diện báo cáo mới, và tích hợp thêm 12 nguồn traffic mới.',
    time: '1 giờ trước',
    action: { label: 'Xem Báo Cáo', path: '/report' },
  },
  {
    id: 4, type: 'success', isRead: true,
    title: 'Nạp tiền thành công',
    desc: '12.700.000₫ đã được cộng vào tài khoản của bạn. Số dư hiện tại: 44.400.000₫. Giao dịch được xử lý vào lúc 09:45 SA ngày 02/04/2026.',
    time: 'Hôm qua',
    action: { label: 'Chi Tiết Giao Dịch', path: '/topup' },
  },
]

const NOTIF_TYPE = {
  success: {
    color: '#00C969',
    bg: 'rgba(0,201,105,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  warning: {
    color: '#FF8C00',
    bg: 'rgba(255,140,0,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  },
  info: {
    color: '#1A7FFF',
    bg: 'rgba(26,127,255,0.12)',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8h.01M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  },
}

/* ─── Notification Detail Modal ─── */
function NotifDetailModal({ notif, onClose, onAction }) {
  const cfg = NOTIF_TYPE[notif.type] || NOTIF_TYPE.info
  const [hovClose, setHovClose] = useState(false)
  const [hovAction, setHovAction] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,10,30,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
        animation: 'nw-fadein 0.18s ease',
      }}>
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--db-modal-bg)',
          border: '1px solid var(--db-border)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 32px 80px rgba(0,0,0,0.28)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          overflow: 'hidden',
          animation: 'nw-scalein 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid var(--db-border)',
          display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            background: cfg.bg, color: cfg.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 8px ${cfg.bg}`,
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="26" height="26" style={{ color: cfg.color }}>
              {cfg.icon.props.children}
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 32 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
              {{ success: 'Hoàn thành', warning: 'Cảnh báo', info: 'Thông tin hệ thống' }[notif.type]}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--db-title-color)', lineHeight: 1.3 }}>{notif.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              {notif.time}
            </div>
          </div>
          {/* X button */}
          <button onClick={onClose}
            onMouseEnter={() => setHovClose(true)}
            onMouseLeave={() => setHovClose(false)}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: 10,
              background: hovClose ? 'var(--db-surface)' : 'transparent',
              border: '1px solid ' + (hovClose ? 'var(--db-border)' : 'transparent'),
              cursor: 'pointer', color: 'var(--db-text-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{
            margin: 0, fontSize: 13.5, color: 'var(--db-text-2)', lineHeight: 1.8,
            background: 'var(--db-surface-2)',
            border: '1px solid var(--db-border)',
            borderRadius: 12, padding: '14px 16px',
          }}>{notif.desc}</p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0 24px 22px',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}>
          <button onClick={onClose}
            onMouseEnter={() => setHovClose(true)}
            onMouseLeave={() => setHovClose(false)}
            style={{
              padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
              background: hovClose ? 'var(--db-surface)' : 'transparent',
              border: '1px solid var(--db-border)',
              fontSize: 13, fontWeight: 600, color: 'var(--db-text-2)',
              transition: 'all 0.15s',
            }}>Đóng</button>
          {notif.action && (
            <button
              onClick={() => { onAction(notif.action.path); onClose() }}
              onMouseEnter={() => setHovAction(true)}
              onMouseLeave={() => setHovAction(false)}
              style={{
                padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
                background: hovAction ? '#0056CC' : '#1A7FFF',
                border: 'none', fontSize: 13, fontWeight: 700, color: '#fff',
                boxShadow: '0 4px 16px rgba(26,127,255,0.4)',
                transition: 'all 0.15s',
              }}>
              {notif.action.label}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes nw-fadein { from { opacity:0 } to { opacity:1 } }
        @keyframes nw-scalein { from { opacity:0; transform:scale(0.9) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>
  )

  return createPortal(modalContent, document.body)
}

function NotificationWidget() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(INIT_NOTIFS)
  const [hovItem, setHovItem] = useState(null)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const ref = useRef(null)
  const navigate = useNavigate()
  const unread = notifs.filter(n => !n.isRead).length

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, isRead: true })))

  const onNotifClick = (n) => {
    setNotifs(ns => ns.map(item => item.id === n.id ? { ...item, isRead: true } : item))
    setOpen(false)
    setSelectedNotif(n)
  }

  const dropStyle = {
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    width: 340, zIndex: 300,
    background: 'var(--db-modal-bg)',
    border: '1px solid var(--db-border)',
    borderRadius: 18,
    boxShadow: 'var(--db-shadow)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    overflow: 'hidden',
    transformOrigin: 'top right',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
    pointerEvents: open ? 'auto' : 'none',
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      {/* Bell Button */}
      <button id="db-notif-btn" className="db-notif-btn"
        onClick={() => setOpen(o => !o)} aria-label="Thông báo"
        style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#FF8C00', color: '#fff',
            fontSize: 10, fontWeight: 800, lineHeight: 1,
            minWidth: 18, height: 18, borderRadius: 99,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', boxShadow: '0 0 0 2px var(--db-bg)',
            animation: 'nw-pulse 2s ease-in-out infinite',
          }}>{unread}</span>
        )}
      </button>

      {/* Dropdown */}
      <div style={dropStyle}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid var(--db-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--db-title-color)' }}>Thông Báo</span>
            {unread > 0 && (
              <span style={{ background: '#FF8C00', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 99 }}>
                {unread} mới
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#1A7FFF', fontWeight: 600, padding: '2px 6px', borderRadius: 6,
            }}>
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ maxHeight: 340, overflowY: 'auto', overflowX: 'hidden' }}>
          {notifs.map(n => {
            const cfg = NOTIF_TYPE[n.type] || NOTIF_TYPE.info
            return (
              <div key={n.id}
                onClick={() => onNotifClick(n)}
                onMouseEnter={() => setHovItem(n.id)}
                onMouseLeave={() => setHovItem(null)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 16px',
                  background: hovItem === n.id ? 'var(--db-row-hover)' : 'transparent',
                  borderBottom: '1px solid var(--db-border)',
                  cursor: 'pointer', transition: 'background 0.15s',
                  opacity: n.isRead ? 0.6 : 1,
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: cfg.bg, color: cfg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{cfg.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: n.isRead ? 500 : 700,
                    color: 'var(--db-title-color)', marginBottom: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{n.title}</div>
                  <div style={{
                    fontSize: 12, color: 'var(--db-text-2)', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{n.desc}</div>
                  <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginTop: 4 }}>{n.time}</div>
                </div>
                {!n.isRead && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#1A7FFF',
                    flexShrink: 0, marginTop: 4, boxShadow: '0 0 6px rgba(26,127,255,0.6)',
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>{/* end dropdown */}

      {/* Detail Modal */}
      {selectedNotif && (
        <NotifDetailModal
          notif={selectedNotif}
          onClose={() => setSelectedNotif(null)}
          onAction={(path) => navigate(path)}
        />
      )}

      <style>{`
        @keyframes nw-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 2px var(--db-bg), 0 0 0 4px rgba(255,140,0,0); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 2px var(--db-bg), 0 0 0 5px rgba(255,140,0,0.4); }
        }
      `}</style>
    </div>
  )
}

/* ─── Profile Dropdown ─── */
const MENU_ITEMS = [
  {
    key: 'profile', label: 'Thông tin tài khoản', path: '/account',
    icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  },
  {
    key: 'topup', label: 'Lịch sử nạp tiền', path: '/topup',
    icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /><path d="M6 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  },
  {
    key: 'settings', label: 'Cài đặt hệ thống', path: '/',
    icon: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8" /></svg>,
  },
]

function ProfileDropdown({ open, onNav }) {
  const [hov, setHov] = useState(null)
  const [hovLogout, setHovLogout] = useState(false)

  const base = {
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    width: 240, zIndex: 300,
    background: 'var(--db-modal-bg)',
    border: '1px solid var(--db-border)',
    borderRadius: 18,
    boxShadow: 'var(--db-shadow), 0 0 0 1px var(--db-border)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    overflow: 'hidden',
    transformOrigin: 'top right',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
    pointerEvents: open ? 'auto' : 'none',
  }

  return (
    <div style={base}>
      {/* User Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1A7FFF, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 14,
          boxShadow: '0 0 0 2px rgba(26,127,255,0.3)',
        }}>NC</div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--db-title-color)', lineHeight: 1.2 }}>Nguyễn Chi</div>
          <div style={{ fontSize: 11.5, color: 'var(--db-text-3)', marginTop: 2 }}>chi@traffic24h.vn</div>
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: '6px 0' }}>
        {MENU_ITEMS.map(item => (
          <button key={item.key} onClick={() => onNav(item.path)}
            onMouseEnter={() => setHov(item.key)}
            onMouseLeave={() => setHov(null)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', background: hov === item.key ? 'var(--db-row-hover)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              fontSize: 13.5, color: hov === item.key ? 'var(--db-text)' : 'var(--db-text-2)',
              transition: 'background 0.15s, color 0.15s',
            }}>
            <span style={{ color: hov === item.key ? '#1A7FFF' : 'var(--db-text-3)', transition: 'color 0.15s', flexShrink: 0 }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        {/* Balance card */}
        <div style={{ margin: '6px 12px', padding: '10px 14px', borderRadius: 12, background: 'rgba(26,127,255,0.08)', border: '1px solid rgba(26,127,255,0.15)' }}>
          <div style={{ fontSize: 11, color: '#1A7FFF', fontWeight: 600, marginBottom: 3, opacity: 0.8 }}>Số Dư Hiện Tại</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1A7FFF', fontFamily: "'Outfit',sans-serif" }}>31.700.000₫</div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--db-border)', margin: '6px 12px' }} />

        {/* Logout */}
        <button onClick={() => onNav('/')}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: hovLogout ? 'rgba(239,68,68,0.08)' : 'transparent',
            fontSize: 13.5, color: hovLogout ? '#EF4444' : '#F87171',
            transition: 'background 0.15s, color 0.15s',
          }}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

/* ─── Dashboard Page ─── */
export default function DashboardPage() {
  const [notif, setNotif] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Click-outside to close profile dropdown
  useEffect(() => {
    if (!profileOpen) return
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  // Sync theme to body for Portal modal CSS vars
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleNav = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <div className="db-root" id="dashboard-page" data-theme={theme}>
      {/* Background */}
      <div className="db-bg" aria-hidden="true">
        <div className="db-bg-orb db-bg-orb1" />
        <div className="db-bg-orb db-bg-orb2" />
        <div className="db-bg-orb db-bg-orb3" />
        <svg className="db-bg-grid" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 18} x2="200" y2={i * 18} stroke="rgba(0,86,204,0.06)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 16} y1="0" x2={i * 16} y2="200" stroke="rgba(0,86,204,0.06)" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* SIDEBAR */}
      {/* Overlay backdrop (mobile only) */}
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
      <aside className={`db-sidebar${sidebarOpen ? ' db-sidebar--open' : ''}`} role="navigation" aria-label="Dashboard Navigation">
        <a href="/" className="db-logo" onClick={e => { e.preventDefault(); navigate('/') }} id="db-home-logo">
          <img src="/images/traffic24h.gif" alt="RealTraffic Logo" className="db-logo-img" />
        </a>
        <nav className="db-nav">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <button key={item.id} id={`db-nav-${item.id}`}
                className={`db-nav-item${isActive ? ' db-nav-active' : ''}`}
                onClick={() => handleNav(item.path)}>
                <span className="db-nav-icon">{item.icon}</span>
                <span className="db-nav-label">{item.label}</span>
                {isActive && <span className="db-nav-pill-glow" aria-hidden="true" />}
              </button>
            )
          })}
        </nav>
        <div className="db-sidebar-footer">
          <div className="db-user-mini">
            <div className="db-user-mini-avatar">NC</div>
            <div>
              <div className="db-user-mini-name">Nguyễn Chi</div>
              <div className="db-user-mini-role">Khách Hàng</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="db-main">
        {/* TOP BAR */}
        <header className="db-topbar" role="banner">
          {/* Hamburger — mobile only */}
          <button className="db-hamburger" id="db-hamburger" onClick={() => setSidebarOpen(o => !o)}
            aria-label="Mở menu" aria-expanded={sidebarOpen}>
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              {sidebarOpen
                ? <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                : <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              }
            </svg>
          </button>
          <div className="db-topbar-title">
            <h1 className="db-page-title">
              {location.pathname === '/' && 'Tổng Quan Hoạt Động'}
              {location.pathname.startsWith('/campaigns') && 'Quản Lý Chiến Dịch'}
              {location.pathname.startsWith('/topup') && 'Nạp Tiền & Thanh Toán'}
              {location.pathname.startsWith('/report') && 'Báo Cáo'}
              {location.pathname.startsWith('/support') && 'Hỗ Trợ'}
              {location.pathname.startsWith('/create') && 'Tạo Chiến Dịch Mới'}
              {location.pathname.startsWith('/account') && 'Thông Tin Tài Khoản'}
              {location.pathname.startsWith('/pricing') && 'Bảng Giá Traffic'}
              {location.pathname.startsWith('/referral') && 'Giới Thiệu Bạn Bè'}
            </h1>
            <span className="db-page-sub">Chào buổi sáng, Nguyễn Chi 👋</span>
          </div>
          <div className="db-topbar-right">
            <button className="db-theme-btn" id="db-theme-toggle" onClick={toggle}
              aria-label={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
              <ThemeIcon theme={theme} />
              <span className="db-theme-label">{theme === 'dark' ? 'Tối' : 'Sáng'}</span>
            </button>
            <NotificationWidget />
            {/* ── Profile Widget + Dropdown ── */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div
                className="db-profile-pill"
                id="db-profile-pill"
                onClick={() => setProfileOpen(o => !o)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div className="db-avatar-ring">
                  <div className="db-avatar">NC</div>
                </div>
                <div className="db-profile-info">
                  <span className="db-profile-name">Nguyễn Chi</span>
                  <span className="db-profile-balance">Số Dư: <strong>31.7M₫</strong></span>
                </div>
              </div>
              <ProfileDropdown
                open={profileOpen}
                onNav={(path) => { handleNav(path); setProfileOpen(false) }}
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="db-content">
          <Routes>
            <Route path="/" element={<OverviewPage theme={theme} />} />
            <Route path="/campaigns" element={<CampaignManagement onCreateNew={() => navigate('/create')} />} />
            <Route path="/create" element={<CreateCampaignPage />} />
            <Route path="/topup" element={<TopupPage theme={theme} />} />
            <Route path="/report" element={<TrafficAnalyticsDashboard theme={theme} />} />
            <Route path="/support" element={<SupportPage theme={theme} />} />
            <Route path="/account" element={<AccountProfilePage theme={theme} />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/referral" element={<ReferralPage theme={theme} />} />
          </Routes>
        </div>
      </div>

      {/* FAB */}
      <button className="db-fab" id="db-fab-create" aria-label="Tạo Chiến Dịch Mới" onClick={() => navigate('/create')}>
        <span className="db-fab-icon">+</span>
        <span className="db-fab-glow" aria-hidden="true" />
        <span className="db-fab-ring" aria-hidden="true" />
      </button>

      <p className="db-watermark">Designed by TChis.Dev</p>
    </div>
  )
}