import '../dashboard.css'
import { useState } from 'react'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import TopupPage from './TopupPage'
import ReportPage from './ReportPage'
import SupportPage from './SupportPage'

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
    id: 'balance', label: 'Số Dư Khả Dụng', value: '$1,250', delta: '-$120', up: false, color: '#00C969',
    icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v10M9 10h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
    spark: [10, 9, 11, 8, 12, 10, 9, 8, 8]
  },
  {
    id: 'completion', label: 'Tỷ Lệ Hoàn Thành', value: '94.7%', delta: '+2.3%', up: true, color: '#A855F7',
    icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    spark: [6, 7, 7, 8, 8, 9, 9, 9, 10]
  },
]

const NAV_ITEMS = [
  { id: 'overview', path: '/', label: 'Tổng Quan', icon: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8" /></svg> },
  { id: 'campaigns', path: '/campaigns', label: 'Quản Lý Chiến Dịch', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { id: 'topup', path: '/topup', label: 'Nạp Tiền', icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v10M9 10h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
  { id: 'report', path: '/report', label: 'Báo Cáo', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> },
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

/* ─── Traffic Chart ─── */
function TrafficChart({ theme }) {
  const isDark = theme === 'dark'
  const W = 700, H = 220
  const PAD = { t: 20, r: 20, b: 40, l: 55 }
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b
  const raw = [820, 1200, 980, 1540, 1320, 1890, 2100, 1780, 2340, 2600, 2200, 2850, 3100, 2900, 3400]
  const labels = ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h', '23h', '23:30', 'Now']
  const max = Math.max(...raw)
  const pts = raw.map((v, i) => ({ x: PAD.l + (i / (raw.length - 1)) * innerW, y: PAD.t + (1 - v / max) * innerH, label: labels[i] }))
  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')
  const areaD = pathD + ` L ${pts[pts.length - 1].x} ${PAD.t + innerH} L ${pts[0].x} ${PAD.t + innerH} Z`
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: PAD.t + f * innerH, val: Math.round(max * (1 - f)).toLocaleString() }))
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0056CC" />
          <stop offset="60%" stopColor="#7B3FDB" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0056CC" stopOpacity={isDark ? '0.35' : '0.18'} />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.02" />
        </linearGradient>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="dotGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={g.y} x2={PAD.l + innerW} y2={g.y} stroke={gridColor} strokeWidth="1" strokeDasharray="4 6" />
          <text x={PAD.l - 8} y={g.y + 4} fill={labelColor} fontSize="11" textAnchor="end" fontFamily="Inter, sans-serif">{g.val}</text>
        </g>
      ))}
      {pts.filter((_, i) => i % 2 === 0).map((p, i) => (
        <text key={i} x={p.x} y={H - 6} fill={labelColor} fontSize="10" textAnchor="middle" fontFamily="Inter, sans-serif">{p.label}</text>
      ))}
      <path d={areaD} fill="url(#chartArea)" />
      <path d={pathD} fill="none" stroke="url(#chartLine)" strokeWidth="5" strokeOpacity="0.25" filter="url(#lineGlow)" strokeLinecap="round" />
      <path d={pathD} fill="none" stroke="url(#chartLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="rgba(0,86,204,0.3)" filter="url(#dotGlow)" />
          <circle cx={p.x} cy={p.y} r="3.5" fill={isDark ? '#fff' : '#0056CC'} stroke="url(#chartLine)" strokeWidth="2" />
        </g>
      ))}
    </svg>
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
  const [countryF, setCountryF] = useState('all')

  const filtered = CM_CAMPAIGNS.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.url.toLowerCase().includes(search.toLowerCase())
    const mst = statusF === 'all' || c.status === statusF
    const mc = countryF === 'all' || c.country.includes(countryF)
    return ms && mst && mc
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
          <select className="cm-filter-select" id="cm-filter-country" value={countryF} onChange={e => setCountryF(e.target.value)}>
            <option value="all">Quốc Gia</option>
            <option value="VN">🇻🇳 Việt Nam</option>
            <option value="US">🇺🇸 Hoa Kỳ</option>
            <option value="SG">🇸🇬 Singapore</option>
            <option value="JP">🇯🇵 Nhật Bản</option>
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
                <th>Tên Chiến Dịch</th><th>URL Đích</th><th>Quốc Gia</th>
                <th>Tiến Độ</th><th>Trạng Thái</th><th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} className="cm-empty">Không tìm thấy chiến dịch nào</td></tr>
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
                      <td><span className="cm-country">{c.country}</span></td>
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
function OverviewPage({ theme }) {
  return (
    <>
      {/* KPI */}
      <div className="db-kpi-row" role="list" aria-label="KPI Metrics">
        {KPI.map(kpi => (
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
            <h2 className="db-panel-title" id="chart-title">Traffic Theo Giờ</h2>
            <p className="db-panel-sub">Hôm nay · Cập nhật mỗi 5 phút</p>
          </div>
          <div className="db-chart-legend">
            <span className="db-legend-dot" style={{ background: '#0056CC' }} />
            <span className="db-legend-label">Traffic (lượt/giờ)</span>
            <div className="db-chart-badge">Live</div>
          </div>
        </div>
        <div className="db-chart-wrap">
          <TrafficChart theme={theme} />
        </div>
      </section>

      {/* Table */}
      <section className="db-table-panel" id="db-table-section" aria-labelledby="table-title">
        <div className="db-panel-header">
          <div>
            <h2 className="db-panel-title" id="table-title">Chiến Dịch Đang Chạy</h2>
            <p className="db-panel-sub">{CAMPAIGNS.filter(c => c.status === 'running').length} chiến dịch active</p>
          </div>
          <button className="db-view-all-btn" id="db-view-all-btn">Xem Tất Cả →</button>
        </div>
        <div className="db-table-wrap">
          <table className="db-table" role="table" aria-labelledby="table-title">
            <thead>
              <tr>
                <th scope="col">Chiến Dịch</th>
                <th scope="col">URL</th>
                <th scope="col">Tiến Độ</th>
                <th scope="col">Trạng Thái</th>
                <th scope="col">Hành Động</th>
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
                  <td>
                    <div className="db-action-btns">
                      <button className="db-action-btn" id={`db-pause-${c.id}`} aria-label="Tạm dừng">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="6" y="4" width="4" height="16" rx="1.5" fill="currentColor" /><rect x="14" y="4" width="4" height="16" rx="1.5" fill="currentColor" /></svg>
                      </button>
                      <button className="db-action-btn db-action-edit" id={`db-edit-${c.id}`} aria-label="Chỉnh sửa">
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

/* ─── Dashboard Page ─── */
export default function DashboardPage() {
  const [notif, setNotif] = useState(true)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

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
      <aside className="db-sidebar" role="navigation" aria-label="Dashboard Navigation">
        <a href="/" className="db-logo" onClick={e => { e.preventDefault(); navigate('/') }} id="db-home-logo">
          <img src="/images/traffic24h.gif" alt="RealTraffic Logo" className="db-logo-img" />
        </a>
        <nav className="db-nav">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <button key={item.id} id={`db-nav-${item.id}`}
                className={`db-nav-item${isActive ? ' db-nav-active' : ''}`}
                onClick={() => navigate(item.path)}>
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
          <div className="db-topbar-title">
            <h1 className="db-page-title">
              {location.pathname === '/' && 'Tổng Quan Hoạt Động'}
              {location.pathname.startsWith('/campaigns') && 'Quản Lý Chiến Dịch'}
              {location.pathname.startsWith('/topup') && 'Nạp Tiền & Thanh Toán'}
              {location.pathname.startsWith('/report') && 'Báo Cáo'}
              {location.pathname.startsWith('/support') && 'Hỗ Trợ'}
              {location.pathname.startsWith('/create') && 'Tạo Chiến Dịch Mới'}
            </h1>
            <span className="db-page-sub">Chào buổi sáng, Nguyễn Chi 👋</span>
          </div>
          <div className="db-topbar-right">
            <button className="db-theme-btn" id="db-theme-toggle" onClick={toggle}
              aria-label={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
              <ThemeIcon theme={theme} />
              <span className="db-theme-label">{theme === 'dark' ? 'Tối' : 'Sáng'}</span>
            </button>
            <button className="db-notif-btn" id="db-notif-btn" onClick={() => setNotif(false)} aria-label="Thông báo">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {notif && <span className="db-notif-dot" aria-hidden="true" />}
            </button>
            <div className="db-profile-pill" id="db-profile-pill">
              <div className="db-avatar-ring">
                <div className="db-avatar">NC</div>
              </div>
              <div className="db-profile-info">
                <span className="db-profile-name">Nguyễn Chi</span>
                <span className="db-profile-balance">Số Dư: <strong>$1,250</strong></span>
              </div>
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
            <Route path="/report" element={<ReportPage theme={theme} />} />
            <Route path="/support" element={<SupportPage theme={theme} />} />
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
