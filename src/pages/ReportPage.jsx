import { useState } from 'react'

/* ── Palette ── */
const P = {
  blue: '#0056CC', blueL: '#1A7FFF',
  orange: '#FF8C00', orangeL: '#FFB347',
  green: '#00C969', purple: '#7B3FDB',
  cyan: '#00D4FF', red: '#FF4D6A',
}

function parseNum(s) {
  if (s.endsWith('M')) return parseFloat(s) * 1e6
  if (s.endsWith('K')) return parseFloat(s) * 1e3
  return parseFloat(s)
}

/* ── Data ── */
const KPIS = [
  { label: 'Tổng Lượt Truy Cập', value: '3.84M', delta: '+22.4%', up: true, color: P.blue },
  { label: 'Bounce Rate', value: '28.4%', delta: '-3.2%', up: true, color: P.green },
  { label: 'Thời Gian Trung Bình', value: '4m 12s', delta: '+18s', up: true, color: P.orange },
  { label: 'Tỷ Lệ Chuyển Đổi', value: '6.7%', delta: '+1.4%', up: true, color: P.purple },
]

const MAP_NODES = [
  { cx: 556, cy: 148, r: 10, label: 'Việt Nam', value: '1.42M', color: P.orange },
  { cx: 154, cy: 105, r: 7.5, label: 'Hoa Kỳ', value: '680K', color: P.blueL },
  { cx: 374, cy: 79, r: 6, label: 'Châu Âu', value: '420K', color: P.cyan },
  { cx: 616, cy: 100, r: 6, label: 'Nhật Bản', value: '310K', color: P.purple },
  { cx: 336, cy: 195, r: 5, label: 'Nigeria', value: '180K', color: P.green },
  { cx: 182, cy: 212, r: 4.5, label: 'Brazil', value: '145K', color: P.orangeL },
  { cx: 609, cy: 230, r: 4, label: 'Australia', value: '98K', color: P.blueL },
]


const DEVICES = [
  { label: 'Mobile', pct: 58, color: P.orange },
  { label: 'Desktop', pct: 32, color: P.blueL },
  { label: 'Tablet', pct: 10, color: P.purple },
]

const SOURCES = [
  { label: 'Google Organic', pct: 52, color: P.blueL },
  { label: 'Direct', pct: 31, color: P.orange },
  { label: 'Social Media', pct: 17, color: P.purple },
]

const TIMELINE = Array.from({ length: 30 }, (_, i) => {
  const total = Math.round(80000 * (1 + i * 0.018) * (1 + Math.sin(i * 0.72) * 0.15))
  const mobile = Math.round(total * (0.55 + Math.sin(i * 1.4) * 0.04))
  return { label: `${String(i + 1).padStart(2, '0')}/03`, total, mobile, desktop: total - mobile }
})

/* ── Glassmorphism panel style ── */
const glassPanel = {
  background: 'var(--db-surface)',
  backdropFilter: 'blur(28px)',
  border: '1px solid var(--db-border)',
  borderRadius: 24,
  boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
}

/* ── KPI Row ── */
function KpiRow() {
  const icons = [
    <svg key="a" viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 12H2M16 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg key="b" viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M3 17l5-5 4 4 6-7 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    <svg key="c" viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    <svg key="d" viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ]
  return (
    <div id="report-kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
      {KPIS.map((k, i) => (
        <div key={k.label} style={{ ...glassPanel, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 85% 10%, ${k.color}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${k.color}22`, border: `1px solid ${k.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
              {icons[i]}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: k.up ? 'rgba(0,201,105,0.1)' : 'rgba(255,77,106,0.1)', color: k.up ? P.green : P.red }}>
              {k.up ? '↑' : '↓'} {k.delta}
            </span>
          </div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 900, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
          <div style={{ fontSize: 12, color: 'var(--db-text-2)', fontWeight: 500 }}>{k.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Traffic Source Chart ── */
function WorldMapPanel() {
  const [hov, setHov] = useState(null)
  const W = 680, H = 280
  const PAD = { t: 28, r: 16, b: 58, l: 62 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const maxV = parseNum('1.42M')
  const step = iW / MAP_NODES.length
  const barW = step * 0.58

  const total = MAP_NODES.reduce((s, n) => s + parseNum(n.value), 0)

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: PAD.t + f * iH,
    val: f === 0 ? '1.4M' : Math.round(maxV * (1 - f) / 1000) + 'K',
  }))

  return (
    <div style={{ ...glassPanel, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--db-title-color)' }}>Nguồn Traffic Toàn Cầu</div>
          <div style={{ fontSize: 12, color: 'var(--db-text-3)', marginTop: 2 }}>Phân bổ lưu lượng theo khu vực · Tháng 3/2026</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: 'rgba(0,201,105,0.1)', border: '1px solid rgba(0,201,105,0.25)', color: P.green }}>● Live</span>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '14px 24px 0' }}>
        {[
          { label: 'Tổng Traffic', value: (total / 1e6).toFixed(2) + 'M', color: P.blueL },
          { label: 'Khu Vực #1', value: 'Việt Nam', color: P.orange },
          { label: 'Số Thị Trường', value: MAP_NODES.length + ' vùng', color: P.purple },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 14px', borderRadius: 12,
            background: 'var(--db-surface-2)', border: '1px solid var(--db-border)',
          }}>
            <div style={{ fontSize: 10.5, color: 'var(--db-text-3)', fontWeight: 600, marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* SVG Column Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', marginTop: 4 }}>
        <defs>
          {MAP_NODES.map((n, i) => (
            <linearGradient key={i} id={`bc-bar-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={n.color} stopOpacity="0.92" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.18" />
            </linearGradient>
          ))}
          <filter id="bc-glow">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={W - PAD.r} y2={g.y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '4 8'} />
            <text x={PAD.l - 8} y={g.y + 4} fill="rgba(240,245,249,0.28)"
              fontSize="9.5" textAnchor="end" fontFamily="Inter,sans-serif">{g.val}</text>
          </g>
        ))}

        {/* Baseline */}
        <line x1={PAD.l} y1={PAD.t + iH} x2={W - PAD.r} y2={PAD.t + iH}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Bars */}
        {MAP_NODES.map((n, i) => {
          const val = parseNum(n.value)
          const barH = Math.max((val / maxV) * iH, 4)
          const bx = PAD.l + i * step + (step - barW) / 2
          const by = PAD.t + iH - barH
          const isHov = hov === i
          const pct = ((val / total) * 100).toFixed(1)

          return (
            <g key={i} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}>

              {/* Glow when hovered */}
              {isHov && (
                <rect x={bx} y={by} width={barW} height={barH} rx={5}
                  fill={n.color} opacity="0.18" filter="url(#bc-glow)" />
              )}

              {/* Bar fill */}
              <rect x={bx} y={by} width={barW} height={barH} rx={5}
                fill={`url(#bc-bar-${i})`}
                stroke={n.color} strokeWidth={isHov ? 1.5 : 0.6} strokeOpacity={isHov ? 0.9 : 0.3} />

              {/* Top shine */}
              <rect x={bx + 2} y={by + 2} width={barW - 4} height={Math.min(barH * 0.3, 14)} rx={3}
                fill="rgba(255,255,255,0.08)" />

              {/* Value label above bar */}
              <text x={bx + barW / 2} y={by - 6} textAnchor="middle"
                fill={isHov ? n.color : 'rgba(240,245,249,0.6)'}
                fontSize={isHov ? '11' : '10'} fontWeight="800" fontFamily="Outfit,sans-serif">
                {n.value}
              </text>

              {/* X-axis label */}
              <text x={bx + barW / 2} y={PAD.t + iH + 16} textAnchor="middle"
                fill={isHov ? n.color : 'rgba(240,245,249,0.38)'}
                fontSize="9.5" fontFamily="Inter,sans-serif" fontWeight={isHov ? '700' : '400'}>
                {n.label.length > 8 ? n.label.slice(0, 7) + '…' : n.label}
              </text>

              {/* % label below name */}
              <text x={bx + barW / 2} y={PAD.t + iH + 30} textAnchor="middle"
                fill={isHov ? n.color : 'rgba(240,245,249,0.22)'}
                fontSize="9" fontFamily="Inter,sans-serif">
                {pct}%
              </text>

              {/* Hover tooltip */}
              {isHov && (() => {
                const ttx = Math.min(Math.max(bx + barW / 2 - 54, 4), W - 112)
                const tty = Math.max(by - 52, 4)
                return (
                  <g>
                    <rect x={ttx} y={tty} width={110} height={42} rx={8}
                      fill="rgba(6,16,35,0.95)" stroke={n.color} strokeWidth="0.8" strokeOpacity="0.7" />
                    <text x={ttx + 9} y={tty + 16} fill={n.color}
                      fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">{n.label}</text>
                    <text x={ttx + 9} y={tty + 32} fill="rgba(240,245,249,0.85)"
                      fontSize="13" fontWeight="800" fontFamily="Outfit,sans-serif">
                      {n.value} · {pct}%
                    </text>
                  </g>
                )
              })()}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ── Device Donut ── */
function DevicePanel() {
  const R = 68, cx = 120, cy = 120
  const circ = 2 * Math.PI * R
  let cum = 0
  const segs = DEVICES.map(d => {
    const offset = circ * (0.25 - cum / 100)
    cum += d.pct
    return { ...d, dasharray: `${circ * d.pct / 100} ${circ}`, offset }
  })

  return (
    <div style={{ ...glassPanel, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--db-title-color)' }}>Phân Tích Thiết Bị</div>
        <div style={{ fontSize: 12, color: 'var(--db-text-3)', marginTop: 2 }}>Mobile / Desktop / Tablet</div>
      </div>

      {/* Donut */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width={240} height={240} viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
          <defs>
            <filter id="rp-donut-glow">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* 3D shadow layers */}
          {segs.map((s, i) => (
            <circle key={`sh${i}`} cx={cx} cy={cy + 6} r={R}
              fill="none" stroke={s.color} strokeWidth={22} strokeOpacity="0.12"
              strokeDasharray={s.dasharray} strokeDashoffset={s.offset} />
          ))}
          {/* Main segments */}
          {segs.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={R}
              fill="none" stroke={s.color} strokeWidth={20}
              strokeDasharray={s.dasharray} strokeDashoffset={s.offset}
              filter="url(#rp-donut-glow)"
              style={{ transition: 'stroke-width 0.2s' }} />
          ))}
          {/* Inner ring */}
          <circle cx={cx} cy={cy} r={R - 16} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          {/* Center background circle for text readability in both themes */}
          <circle cx={cx} cy={cy} r={R - 12} fill="var(--db-surface)" />
          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--db-title-color)"
            fontSize="28" fontWeight="900" fontFamily="Outfit,sans-serif">3.84M</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--db-text-2)"
            fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">TOTAL</text>
          <text x={cx} y={cy + 30} textAnchor="middle" fill="var(--db-text-3)"
            fontSize="10" fontFamily="Inter,sans-serif">lượt truy cập</text>
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {DEVICES.map(d => (
            <div key={d.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--db-text-2)' }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: d.color, fontFamily: "'Outfit',sans-serif" }}>{d.pct}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: 'var(--db-surface-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.pct}%`, borderRadius: 99, background: `linear-gradient(90deg, ${d.color}, ${d.color}90)`, boxShadow: `0 0 8px ${d.color}60` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--db-border)' }} />

      {/* Traffic sources */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--db-title-color)', marginBottom: 12 }}>Nguồn Traffic</div>
        {SOURCES.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}`, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: 'var(--db-text-2)', flex: 1, fontWeight: 500 }}>{s.label}</span>
            <div style={{ width: 80, height: 4, borderRadius: 99, background: 'var(--db-surface-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 99, opacity: 0.85 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: s.color, minWidth: 30, textAlign: 'right' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Timeline Chart ── */
function TimelinePanel() {
  const [hov, setHov] = useState(null)
  const W = 800, H = 240
  const PAD = { t: 20, r: 24, b: 44, l: 62 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const maxV = Math.max(...TIMELINE.map(d => d.total))
  const minV = Math.min(...TIMELINE.map(d => d.total)) * 0.9

  const pts = TIMELINE.map((d, i) => ({
    x: PAD.l + (i / (TIMELINE.length - 1)) * iW,
    y: PAD.t + (1 - (d.total - minV) / (maxV - minV)) * iH,
    ...d,
  }))

  const mPts = TIMELINE.map((d, i) => ({
    x: PAD.l + (i / (TIMELINE.length - 1)) * iW,
    y: PAD.t + (1 - (d.mobile - minV * 0.55) / (maxV - minV * 0.55)) * iH,
  }))

  const makePath = (arr) => arr.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`
    const prev = arr[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`
  }, '')

  const pathTotal = makePath(pts)
  const pathMobile = makePath(mPts)
  const areaPath = pathTotal + ` L${pts[pts.length - 1].x},${PAD.t + iH} L${pts[0].x},${PAD.t + iH}Z`

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: PAD.t + f * iH,
    val: Math.round((maxV - f * (maxV - minV)) / 1000).toLocaleString('vi') + 'K',
  }))

  const hovPt = hov !== null ? pts[hov] : null

  return (
    <div style={{ ...glassPanel, padding: '22px 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--db-title-color)' }}>Traffic Timeline — Tháng 3/2026</div>
          <div style={{ fontSize: 12, color: 'var(--db-text-3)', marginTop: 2 }}>Tổng lưu lượng theo ngày · 30 ngày gần nhất</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[{ color: P.blueL, label: 'Tổng' }, { color: P.orange, label: 'Mobile' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--db-text-2)', fontWeight: 600 }}>
              <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const mx = (e.clientX - rect.left) / rect.width * W
          const idx = Math.min(Math.max(Math.round((mx - PAD.l) / iW * (TIMELINE.length - 1)), 0), TIMELINE.length - 1)
          setHov(idx)
        }}
        onMouseLeave={() => setHov(null)}>
        <defs>
          <linearGradient id="rp-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.blueL} stopOpacity="0.35" />
            <stop offset="60%" stopColor={P.orange} stopOpacity="0.12" />
            <stop offset="100%" stopColor={P.orange} stopOpacity="0" />
          </linearGradient>
          <filter id="rp-line-glow">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="rp-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={P.blueL} />
            <stop offset="100%" stopColor={P.orange} />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridVals.map((g, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={g.y} x2={W - PAD.r} y2={g.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" />
            <text x={PAD.l - 8} y={g.y + 4} fill="rgba(240,245,249,0.3)" fontSize="10" textAnchor="end" fontFamily="Inter,sans-serif">{g.val}</text>
          </g>
        ))}

        {/* X labels */}
        {pts.filter((_, i) => i % 5 === 0 || i === 29).map((p, i) => (
          <text key={i} x={p.x} y={H - 8} fill="rgba(240,245,249,0.28)" fontSize="10" textAnchor="middle" fontFamily="Inter,sans-serif">{p.label}</text>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#rp-area-grad)" />

        {/* Glow line */}
        <path d={pathTotal} fill="none" stroke="url(#rp-line-grad)" strokeWidth="5" strokeOpacity="0.2"
          filter="url(#rp-line-glow)" strokeLinecap="round" />
        {/* Main line */}
        <path d={pathTotal} fill="none" stroke="url(#rp-line-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Mobile line */}
        <path d={pathMobile} fill="none" stroke={P.orange} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="5 3" strokeLinecap="round" />

        {/* Hover vertical line */}
        {hovPt && (
          <line x1={hovPt.x} y1={PAD.t} x2={hovPt.x} y2={PAD.t + iH}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        )}

        {/* Hover dot */}
        {hovPt && (
          <>
            <circle cx={hovPt.x} cy={hovPt.y} r={8} fill={P.blueL} opacity="0.2" />
            <circle cx={hovPt.x} cy={hovPt.y} r={4} fill={P.blueL} />
            <circle cx={hovPt.x} cy={hovPt.y} r={2} fill="#fff" />
          </>
        )}

        {/* Frosted tooltip */}
        {hovPt && (() => {
          const tx = Math.min(Math.max(hovPt.x - 75, PAD.l), W - PAD.r - 165)
          const ty = Math.max(hovPt.y - 82, PAD.t)
          return (
            <g>
              {/* Tooltip box */}
              <rect x={tx} y={ty} width={158} height={74} rx={10}
                fill="rgba(8,20,40,0.94)" stroke="rgba(26,127,255,0.4)" strokeWidth="1" />
              {/* Accent left bar */}
              <rect x={tx} y={ty + 8} width={3} height={58} rx={2} fill={P.blueL} />
              {/* Date */}
              <text x={tx + 12} y={ty + 20} fill="rgba(240,245,249,0.45)" fontSize="10" fontWeight="600" fontFamily="Inter,sans-serif">{hovPt.label}</text>
              {/* Total value */}
              <text x={tx + 12} y={ty + 40} fill={P.blueL} fontSize="17" fontWeight="900" fontFamily="Outfit,sans-serif">{(hovPt.total / 1000).toFixed(1)}K</text>
              {/* Mobile */}
              <text x={tx + 12} y={ty + 57} fill={P.orange} fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">
                {'● '}Mobile: {(hovPt.mobile / 1000).toFixed(1)}K
              </text>
              {/* Desktop */}
              <text x={tx + 12} y={ty + 70} fill={P.blueL} fontSize="10" fontWeight="600" fontFamily="Inter,sans-serif" fillOpacity="0.65">
                {'● '}Desktop: {(hovPt.desktop / 1000).toFixed(1)}K
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

/* ── Main Export ── */
export default function ReportPage({ theme = 'dark' }) {
  return (
    <div id="report-page" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <KpiRow />
      <div id="report-mid-grid" style={{ display: 'grid', gridTemplateColumns: '1.62fr 1fr', gap: 22 }}>
        <WorldMapPanel />
        <DevicePanel />
      </div>
      <TimelinePanel />
      <style>{`
        @media (max-width: 900px) {
          #report-kpi-row { grid-template-columns: repeat(2, 1fr) !important; }
          #report-mid-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          #report-kpi-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
