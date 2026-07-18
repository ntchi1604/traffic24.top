import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

/* ─── 30 days mock data with realistic variation ─── */
const DAY_NAMES = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

const DAILY = (() => {
  const rand = seededRandom(42)
  const days = []
  let bal = 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const dow = DAY_NAMES[d.getDay()]
    // Views: wave pattern with peaks mid-week, dips on weekends
    const dayOfWeek = d.getDay()
    const weekFactor = (dayOfWeek >= 1 && dayOfWeek <= 5) ? 1.0 : 0.55
    const wave = Math.sin(i * 0.45 + 1.3) * 12000
    const noise = (rand() - 0.5) * 6000
    const trend = 18000 + (29 - i) * 200
    const views = Math.max(800, Math.round((trend + wave + noise) * weekFactor))
    const cpm = 480 + Math.sin(i * 0.3) * 120 + (rand() - 0.5) * 80
    const income = Math.round(views * cpm)
    bal += income
    days.push({ date: `${dd}-${mm}`, fullDate: `${dow}, ${dd}/${mm}/${yyyy}`, views, income, balance: bal })
  }
  return days
})()

const totalViews = DAILY.reduce((a, d) => a + d.views, 0)
const totalIncome = DAILY.reduce((a, d) => a + d.income, 0)
const avgIncome = Math.round(totalIncome / DAILY.length)

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }
function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ' }
function fmtCompact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'k'
  return n.toString()
}

/* ─── Dual-line Chart (Views + Số dư) ─── */
function ViewsBalanceChart({ data, theme }) {
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

  const n = data.length
  const PAD = { t: 16, r: 90, b: 36, l: 50 }
  const innerW = Math.max(200, cW - PAD.l - PAD.r)
  const gapRatio = n > 20 ? 0.25 : 0.35
  const gap = Math.max(3, Math.round(innerW / n * gapRatio))
  const barW = Math.max(4, (innerW - gap * (n - 1)) / n)
  const H = 260
  const innerH = H - PAD.t - PAD.b
  const W = innerW + PAD.l + PAD.r

  const views = data.map(d => d.views)
  const incomes = data.map(d => d.income)

  const maxV = Math.max(...views), minV = 0, rngV = maxV - minV || 1
  const maxI = Math.max(...incomes), minI = 0, rngI = maxI - minI || 1

  const barRects = data.map((d, i) => {
    const barH = Math.max(1, ((d.views - minV) / rngV) * innerH)
    const x = PAD.l + i * (barW + gap)
    return { x, y: PAD.t + innerH - barH, w: barW, h: barH, views: d.views, income: d.income, label: d.date }
  })

  const linePts = data.map((d, i) => ({
    x: PAD.l + i * (barW + gap) + barW / 2,
    y: PAD.t + (1 - (d.income - minI) / rngI) * innerH,
    income: d.income,
  }))

  const makePath = pts => pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')

  const linePath = makePath(linePts)

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(10,22,60,0.32)'

  const fmtVND = val => val.toLocaleString('vi-VN') + 'đ'
  const fmtK = val => val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : val >= 1e3 ? (val / 1e3).toFixed(0) + 'k' : val.toString()
  const gridLines = [0, .25, .5, .75, 1].map(f => ({
    y: PAD.t + f * innerH,
    vLeft: fmtK(Math.round(maxV - f * rngV)),
    vRight: fmtVND(Math.round(maxI - f * rngI)),
  }))

  const xMaxLabels = Math.max(5, Math.floor(innerW / 45))
  const xStep = Math.max(1, Math.ceil(n / xMaxLabels))

  const handleMouseMove = e => {
    const svg = svgRef.current; if (!svg) return
    const rect = svg.getBoundingClientRect()
    const clientX = e.clientX ?? e.touches?.[0]?.clientX
    if (clientX == null) return
    const svgX = ((clientX - rect.left) / rect.width) * W
    let closest = 0, minDist = Infinity
    barRects.forEach((b, i) => { const d = Math.abs(b.x + b.w / 2 - svgX); if (d < minDist) { minDist = d; closest = i } })
    setHovIdx(closest)
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  const hb = hovIdx !== null ? barRects[hovIdx] : null
  const hp = hovIdx !== null ? linePts[hovIdx] : null
  const hd = hovIdx !== null ? data[hovIdx] : null

  const ttBg = isDark ? 'rgba(8,16,42,0.97)' : 'rgba(255,255,255,0.99)'
  const ttBorder = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,40,120,0.13)'
  const ttText = isDark ? 'rgba(240,245,255,0.9)' : 'rgba(10,22,60,0.9)'
  const ttSub = isDark ? 'rgba(180,200,240,0.6)' : 'rgba(10,22,60,0.45)'

  const tooltip = hb && hd ? createPortal(
    <div style={{
      position: 'fixed',
      left: mousePos.x + 18, top: mousePos.y - 70,
      transform: mousePos.x > window.innerWidth - 240 ? 'translateX(calc(-100% - 36px))' : 'none',
      zIndex: 99999, pointerEvents: 'none', minWidth: 200,
      background: ttBg, border: `1px solid ${ttBorder}`, borderRadius: 12,
      padding: '10px 14px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: ttSub, marginBottom: 9, fontFamily: 'Inter,sans-serif', letterSpacing: '0.02em' }}>
        {hb.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#60A5FA', flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: ttText, fontFamily: 'Inter,sans-serif' }}>Lượt xem</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#1A7FFF', whiteSpace: 'nowrap' }}>
          {hd.views.toLocaleString('vi-VN')}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <span style={{ width: 8, height: 2, borderRadius: 1, background: '#FF8C00', flexShrink: 0, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: ttText, fontFamily: 'Inter,sans-serif' }}>Thu nhập</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#FF8C00', whiteSpace: 'nowrap' }}>
          {fmtVND(hd.income)}
        </span>
      </div>
    </div>,
    document.body
  ) : null

  const r = Math.min(3, barW / 2)

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
          <linearGradient id="inc-barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="inc-barHov" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
          <linearGradient id="inc-areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF8C00" stopOpacity={isDark ? '0.18' : '0.08'} />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.01" />
          </linearGradient>
          <filter id="inc-orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0  0 0 0 0.3 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Blue bar glow */}
          <filter id="inc-barGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.37  0 0 0 0 0.65  0 0 0 0 0.98  0 0 0 0.3 0" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Dot halos */}
          <filter id="inc-dotGlowBlue" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.49  0 0 0 0 1  0 0 0 0.55 0" />
          </filter>
          <filter id="inc-dotGlowOrange" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>
        </defs>

        {/* Grid — 3 lines only */}
        {[0, .5, 1].map(f => (
          <g key={f}>
            <line x1={PAD.l} y1={PAD.t + f * innerH} x2={PAD.l + innerW} y2={PAD.t + f * innerH} stroke={gridColor} strokeWidth="1" />
            <text x={PAD.l - 8} y={PAD.t + f * innerH + 4} fill={labelColor} fontSize="10" textAnchor="end" fontFamily="Inter,sans-serif">{fmtK(Math.round(maxV - f * rngV))}</text>
            <text x={W - 4} y={PAD.t + f * innerH + 4} fill="rgba(255,140,0,0.55)" fontSize="9.5" textAnchor="end" fontFamily="Inter,sans-serif">{fmtVND(Math.round(maxI - f * rngI))}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % xStep !== 0 && i !== n - 1) return null
          const x = PAD.l + i * (barW + gap) + barW / 2
          const isHov = hovIdx === i
          return (
            <text key={i} x={x} y={H - 10} fill={isHov ? (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(10,22,60,0.7)') : labelColor}
              fontSize="10" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight={isHov ? '600' : '400'}
              style={{ transition: 'fill 0.2s' }}>
              {d.date}
            </text>
          )
        })}

        {/* Hover line */}
        {hovIdx !== null && hb && (
          <line x1={hb.x + hb.w / 2} x2={hb.x + hb.w / 2} y1={PAD.t} y2={PAD.t + innerH}
            stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,40,120,0.08)'} strokeWidth="1" strokeDasharray="4 3" />
        )}

        {/* Bars (views) with glow */}
        {barRects.map((b, i) => {
          const isHov = hovIdx === i
          const dimmed = hovIdx !== null && !isHov
          return (
            <g key={i}>
              {isHov && <rect x={b.x - 2} y={b.y - 2} width={b.w + 4} height={b.h + 4} rx={r + 2} fill="none" stroke="#60A5FA" strokeWidth="1" filter="url(#inc-barGlow)" opacity="0.5" />}
              <rect
                x={b.x} y={b.y} width={b.w} height={b.h} rx={r}
                fill={isHov ? 'url(#inc-barHov)' : 'url(#inc-barGrad)'}
                opacity={dimmed ? 0.18 : 1}
                style={{ transition: 'opacity 0.2s' }}
              />
              {!dimmed && b.h > 4 && (
                <line x1={b.x + 2} y1={b.y + 1} x2={b.x + b.w - 2} y2={b.y + 1}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" />
              )}
            </g>
          )
        })}

        {/* Income area fill under line */}
        {linePts.length > 1 && (
          <path d={linePath + ` L ${linePts[linePts.length - 1].x} ${PAD.t + innerH} L ${linePts[0].x} ${PAD.t + innerH} Z`}
            fill="url(#inc-areaFill)" />
        )}

        {/* Line (income) with glow */}
        <path d={linePath} fill="none" stroke="#FF8C00" strokeWidth="4" filter="url(#inc-orangeGlow)" strokeLinecap="round" opacity="0.3" />
        <path d={linePath} fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />

        {/* Line dots */}
        {linePts.map((p, i) => {
          const isHov = hovIdx === i
          const dimmed = hovIdx !== null && !isHov
          return <circle key={i} cx={p.x} cy={p.y} r={isHov ? 4.5 : 2}
            fill={isDark ? '#0D1B2A' : '#fff'} stroke="#FF8C00" strokeWidth={isHov ? 2.5 : 1.5}
            opacity={dimmed ? 0.15 : 1}
            style={{ transition: 'opacity 0.2s' }} />
        })}

        {/* Hover dot halos */}
        {hovIdx !== null && hp && <>
          <circle cx={hp.x} cy={hp.y} r="12" fill="#FF8C00" filter="url(#inc-dotGlowOrange)" opacity="0.45" />
          <circle cx={hp.x} cy={hp.y} r="5" fill={isDark ? '#0D1B2A' : '#fff'} stroke="#FF8C00" strokeWidth="2.5" />
        </>}
      </svg>
    </div>
  )
}

/* ─── Main Page ─── */
export default function UserIncomePage({ theme }) {
  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPI Cards */}
      <div className="ud-kpi-row">
        {[
          { label: 'Hôm Nay', value: '0đ', sub: '0 views', color: '#22C55E', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><text x="12" y="16" textAnchor="middle" fontSize="16" fontWeight="800" fill="currentColor">$</text></svg> },
          { label: 'Tổng 30 Ngày', value: fmtC(totalIncome), sub: `${fmt(totalViews)} views`, color: '#3B82F6', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          { label: 'TB / Ngày', value: fmtC(avgIncome), sub: '30 ngày có data', color: '#F59E0B', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8"/></svg> },
          { label: 'Tổng Views', value: fmt(totalViews), sub: 'trong 30 ngày', color: '#A855F7', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
        ].map((k, i) => (
          <div key={i} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="ud-kpi-icon">{k.icon}</div>
            <div className="ud-kpi-text">
              <div className="ud-kpi-label">{k.label}</div>
              <div className="ud-kpi-value">{k.value}</div>
              <div className="ud-kpi-sub">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Balance Banners */}
      <div className="ud-grid-2">
        <div style={{
          padding: '22px 24px', borderRadius: 16,
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8, marginBottom: 6 }}>Số Dư Ví Thu Nhập</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>{fmtC(61335534)}</div>
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="14.5" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <div style={{
          padding: '22px 24px', borderRadius: 16,
          background: 'linear-gradient(135deg, #DC2626, #EF4444)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8, marginBottom: 6 }}>Tổng Đã Rút (Đã Duyệt)</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em' }}>{fmtC(322879464)}</div>
          <svg viewBox="0 0 24 24" fill="none" width="40" height="40" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Chart: Lượt xem & Số dư */}
      <div className="ud-chart-panel">
        <div className="ud-panel-header">
          <div><div className="ud-panel-title">Thu Nhập Theo Ngày</div><div className="ud-panel-sub">Tổng: {fmtC(totalIncome)}</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#60A5FA', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'var(--ud-text-3)', fontWeight: 500 }}>Lượt xem</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 16, height: 2, borderRadius: 1, background: '#FF8C00', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'var(--ud-text-3)', fontWeight: 500 }}>Thu nhập</span>
            </div>
          </div>
        </div>
        <div className="ud-chart-wrap">
          <ViewsBalanceChart data={DAILY} theme={theme} />
        </div>
      </div>

      {/* Daily Detail Table */}
      <div className="ud-table-panel">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px',
          borderBottom: '1px solid var(--ud-border)',
        }}>
          <div style={{ width: 3, height: 18, borderRadius: 2, background: '#22C55E', flexShrink: 0 }} />
          <div className="ud-panel-title">Chi Tiết Theo Ngày</div>
        </div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th style={{ textAlign: 'right' }}>Views</th>
                <th style={{ textAlign: 'right' }}>Thu Nhập</th>
                <th style={{ textAlign: 'right' }}>TB/View</th>
              </tr>
            </thead>
            <tbody>
              {DAILY.slice().reverse().map((d, i) => (
                <tr key={i} className="ud-table-row">
                  <td style={{ fontWeight: 500 }}>{d.fullDate}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(96,165,250,0.12)', color: '#60A5FA',
                      fontSize: 12.5, fontWeight: 600,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#60A5FA' }} />
                      {fmt(d.views)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#22C55E' }}>{fmtC(d.income)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--ud-text-3)' }}>{d.views > 0 ? Math.round(d.income / d.views) : 0}đ</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--ud-border)', fontWeight: 700 }}>
                <td style={{ padding: '14px 16px', fontSize: 13 }}>Tổng cộng</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#60A5FA', fontSize: 13 }}>{fmt(totalViews)}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', color: '#22C55E', fontSize: 13 }}>{fmtC(totalIncome)}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--ud-text-3)', fontSize: 13 }}>{Math.round(totalIncome / totalViews)}đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
