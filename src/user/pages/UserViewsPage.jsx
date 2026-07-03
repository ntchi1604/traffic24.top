import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DateRangePicker from '../components/DateRangePicker'

function genViews(base, phase, count = 90) {
  const d = []
  for (let i = 0; i < count; i++) {
    const w = Math.sin((i + phase) * 0.07) * base * 0.15
    const t = (i / count) * base * 0.2
    const n = (Math.sin(i * 2.3) + Math.cos(i * 1.7)) * base * 0.05
    d.push(Math.max(0, Math.round(base + w + t + n)))
  }
  return d
}

const ALL_DAILY = genViews(9400, 0)
const BY_CAT = [{ name: 'Tech', views: 268000, color: '#1A7FFF' }, { name: 'Fashion', views: 120200, color: '#A855F7' }, { name: 'Travel', views: 116000, color: '#00C969' }, { name: 'Food', views: 73900, color: '#FF8C00' }, { name: 'Health', views: 49900, color: '#E05555' }]
const BY_DEV = [{ label: 'Mobile', pct: 62, color: '#1A7FFF' }, { label: 'Desktop', pct: 28, color: '#A855F7' }, { label: 'Tablet', pct: 10, color: '#00C969' }]
const BY_COUNTRY = [{ label: 'VN', pct: 58, color: '#1A7FFF' }, { label: 'US', pct: 12, color: '#FF8C00' }, { label: 'JP', pct: 8, color: '#A855F7' }, { label: 'KR', pct: 6, color: '#00C969' }, { label: 'TH', pct: 5, color: '#E05555' }, { label: 'SG', pct: 4, color: '#1A7FFF' }, { label: 'Other', pct: 7, color: '#888' }]

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }

function makePath(points, smooth = 0.3) {
  if (points.length < 2) return ''
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1], curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) * smooth
    const cpx2 = curr.x - (curr.x - prev.x) * smooth
    d += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`
  }
  return d
}

function ViewsChart({ viewsData, theme }) {
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

  const { labels, vs, bs } = (() => {
    const ls = [], vsArr = [], bsArr = []
    let bal = 850000
    viewsData.forEach((v, i) => {
      const d = new Date(); d.setDate(d.getDate() - (viewsData.length - 1 - i))
      ls.push(`${d.getDate()}/${d.getMonth() + 1}`)
      vsArr.push(v)
      bal += Math.round(v * 0.03 + Math.sin(i * 1.2) * 20000)
      bsArr.push(bal)
    })
    return { labels: ls, vs: vsArr, bs: bsArr }
  })()

  const W = Math.max(cW, 300), H = 200
  const PAD = { t: 18, r: 90, b: 44, l: 58 }
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b

  const maxV = Math.max(...vs), minV = Math.min(...vs), rngV = maxV - minV || 1
  const maxB = Math.max(...bs), minB = Math.min(...bs), rngB = maxB - minB || 1
  const ptsV = vs.map((v, i) => ({ x: PAD.l + (i / (vs.length - 1)) * innerW, y: PAD.t + (1 - (v - minV) / rngV) * innerH, label: labels[i], v }))
  const ptsB = bs.map((v, i) => ({ x: PAD.l + (i / (bs.length - 1)) * innerW, y: PAD.t + (1 - (v - minB) / rngB) * innerH, v }))

  const bezierPath = pts => pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')

  const pathV = bezierPath(ptsV)
  const pathB = bezierPath(ptsB)
  const areaV = pathV + ` L ${ptsV[ptsV.length - 1].x} ${PAD.t + innerH} L ${ptsV[0].x} ${PAD.t + innerH} Z`

  const fmtVND = val => val.toLocaleString('vi-VN') + 'đ'
  const fmtK = val => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toString()
  const gridLines = [0, .25, .5, .75, 1].map(f => ({
    y: PAD.t + f * innerH,
    vV: fmtK(Math.round(maxV - f * rngV)),
    vB: fmtVND(Math.round(maxB - f * rngB)),
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
      position: 'fixed', left: mousePos.x + 18, top: mousePos.y - 70,
      transform: mousePos.x > window.innerWidth - 240 ? 'translateX(calc(-100% - 36px))' : 'none',
      zIndex: 99999, pointerEvents: 'none', minWidth: 200,
      background: ttBg, border: `1px solid ${ttBorder}`, borderRadius: 12,
      padding: '10px 14px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ttSub, marginBottom: 9, fontFamily: "'Inter',sans-serif", letterSpacing: '0.02em' }}>{hp.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0056CC' }} /><span style={{ fontSize: 12, color: ttText, fontFamily: "'Inter',sans-serif" }}>Lượt xem</span></div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#1A7FFF', whiteSpace: 'nowrap' }}>{hp.v.toLocaleString('vi-VN')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8C00' }} /><span style={{ fontSize: 12, color: ttText, fontFamily: "'Inter',sans-serif" }}>Số dư</span></div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#FF8C00', whiteSpace: 'nowrap' }}>{fmtVND(hb.v)}</span>
      </div>
    </div>, document.body
  ) : null

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative', overflow: 'visible' }}>
      {tooltip}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: H, display: 'block', cursor: 'crosshair', overflow: 'visible' }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHovIdx(null)}
        onTouchMove={handleMouseMove} onTouchEnd={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="uv-lineV" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0056CC" /><stop offset="100%" stopColor="#7B3FDB" /></linearGradient>
          <linearGradient id="uv-areaV" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0056CC" stopOpacity={isDark ? '0.28' : '0.14'} /><stop offset="100%" stopColor="#0056CC" stopOpacity="0.02" /></linearGradient>
          <filter id="uv-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={PAD.l + innerW} y2={g.y} stroke={gridColor} strokeWidth="1" strokeDasharray="4 6" />
            <text x={PAD.l - 8} y={g.y + 4} fill={labelColor} fontSize="10" textAnchor="end" fontFamily="Inter,sans-serif">{g.vV}</text>
            <text x={W - 4} y={g.y + 4} fill="rgba(255,140,0,0.6)" fontSize="9.5" textAnchor="end" fontFamily="Inter,sans-serif">{g.vB}</text>
          </g>
        ))}
        {ptsV.filter((_, i) => i % xStep === 0 || i === ptsV.length - 1).map((p, i) => (
          <text key={i} x={p.x} y={H - 10} fill={labelColor} fontSize="10" textAnchor="middle" fontFamily="Inter,sans-serif">{p.label}</text>
        ))}
        {hp && <line x1={hp.x} x2={hp.x} y1={PAD.t} y2={PAD.t + innerH} stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,40,120,0.18)'} strokeWidth="1.5" strokeDasharray="4 3" />}
        <path d={areaV} fill="url(#uv-areaV)" />
        <path d={pathV} fill="none" stroke="url(#uv-lineV)" strokeWidth="3" strokeOpacity="0.12" filter="url(#uv-glow)" strokeLinecap="round" />
        <path d={pathV} fill="none" stroke="url(#uv-lineV)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathB} fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" strokeOpacity="0.8" />
        {hp && <>
          <circle cx={hp.x} cy={hp.y} r="5" fill={isDark ? '#0D1B2A' : '#fff'} stroke="#1A7FFF" strokeWidth="2.5" />
          <circle cx={hb.x} cy={hb.y} r="5" fill={isDark ? '#0D1B2A' : '#fff'} stroke="#FF8C00" strokeWidth="2.5" />
        </>}
      </svg>
    </div>
  )
}

export default function UserViewsPage({ theme }) {
  const [dateRange, setDateRange] = useState({ mode: 'preset', days: 30 })
  const data = ALL_DAILY.slice(-dateRange.days)
  const total = data.reduce((a, b) => a + b, 0)
  const avg = Math.round(total / data.length)

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-kpi-row">
        {[
          { label: `Tổng lượt xem ${dateRange.days} ngày`, value: fmt(total), color: '#1A7FFF' },
          { label: 'Trung bình/ngày', value: fmt(avg), color: '#FF8C00' },
          { label: 'Mobile', value: '62%', color: '#00C969' },
          { label: 'Quốc gia hàng đầu', value: '7', color: '#A855F7' },
        ].map((k, i) => (
          <div key={i} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="ud-kpi-top"><div className="ud-kpi-icon"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M22 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div></div>
            <div className="ud-kpi-value">{k.value}</div>
            <div className="ud-kpi-label">{k.label}</div>
            <div className="ud-kpi-glow" />
          </div>
        ))}
      </div>

      <div className="ud-overview-grid">
        <div className="ud-chart-panel">
          <div className="ud-panel-header">
            <div>
              <div className="ud-panel-title">Lượt Xem Theo Ngày</div>
              <div className="ud-panel-sub">{dateRange.days} ngày gần đây</div>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} id="vw-drp" />
          </div>
          <div className="ud-chart-wrap">
            <ViewsChart viewsData={data} theme={theme} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ud-chart-panel">
            <div className="ud-panel-header"><div className="ud-panel-title">Theo Danh Mục</div></div>
            <div style={{ padding: 16 }}>
              {BY_CAT.map(c => (
                <div key={c.name} className="ud-flex ud-items-center ud-gap-10 ud-mb-10">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13 }}>{c.name}</span>
                  <span className="ud-table-stats">{fmt(c.views)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ud-chart-panel">
            <div className="ud-panel-header"><div className="ud-panel-title">Thiết Bị</div></div>
            <div style={{ padding: 16 }}>
              {BY_DEV.map(d => (
                <div key={d.label} className="ud-flex ud-items-center ud-gap-10 ud-mb-10">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13 }}>{d.label}</span>
                  <span className="ud-table-stats">{d.pct}%</span>
                  <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--ud-surface-2)', overflow: 'hidden' }}>
                    <div style={{ width: d.pct + '%', height: '100%', borderRadius: 3, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ud-chart-panel">
        <div className="ud-panel-header"><div className="ud-panel-title">Theo Quốc Gia</div></div>
        <div style={{ padding: 16 }}>
          <div className="ud-grid-4">
            {BY_COUNTRY.map(c => (
              <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="ud-flex ud-items-center ud-gap-6"><span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} /><span style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</span></div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--ud-surface-2)', overflow: 'hidden' }}><div style={{ width: c.pct + '%', height: '100%', borderRadius: 3, background: c.color, transition: 'width .6s ease' }} /></div>
                <span className="ud-text-xs ud-text-muted">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
