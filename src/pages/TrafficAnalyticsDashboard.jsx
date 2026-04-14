import { useState, useMemo, useRef, useEffect } from 'react'

import DateRangePicker from '../components/DateRangePicker'

/* ══════════════════════════════════════════════════════════════
   DATE UTILITIES
══════════════════════════════════════════════════════════════ */
const TODAY_STR = '2026-04-03'
const TODAY = new Date(TODAY_STR)

function addDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d
}
function toISO(d) { return d.toISOString().slice(0, 10) }
function dayLabel(d) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

/* Build array of ISO date strings from a range */
function buildDateArray(from, to) {
  const arr = []; let cur = new Date(from)
  const end = new Date(to)
  while (cur <= end) { arr.push(toISO(cur)); cur = addDays(cur, 1) }
  return arr
}

/* Resolve a range object → { from, to, days, labels[] } */
function resolveRange(range) {
  if (!range || (range.mode === 'preset' && !range.days)) {
    range = { mode: 'preset', days: 7 }
  }
  let from, to
  if (range.mode === 'custom' && range.from && range.to) {
    from = range.from; to = range.to
  } else {
    const d = range.days ?? 7
    to = TODAY_STR
    from = toISO(addDays(TODAY, -(d - 1)))
  }
  const dates = buildDateArray(from, to)
  const labels = dates.map(d => dayLabel(d))
  return { from, to, days: dates.length, dates, labels }
}

/* ══════════════════════════════════════════════════════════════
   MOCK DATA — 90-day base (generated once)
   Each item has 90 daily values. We slice to selected range.
══════════════════════════════════════════════════════════════ */
const MAX_DAYS = 90

function genValues(base, phase = 1) {
  return Array.from({ length: MAX_DAYS }, (_, i) =>
    Math.max(10, Math.round(base * (1 + 0.3 * Math.sin(i * phase * 0.7)) * (1 + 0.18 * Math.sin(i * 1.3 + phase)))))
}

const RAW_DATA = {
  campaigns: [
    {
      id: 'seo-blog', name: 'SEO Blog Cốt Lõi',
      type: 'organic', typeLabel: 'Organic', color: '#3B82F6',
      items: [
        { id: 'kw-seo', name: 'từ khóa seo', values90: genValues(1500, 1.1) },
        { id: 'kw-traffic', name: 'traffic user', values90: genValues(1050, 0.9) },
      ],
    },
    {
      id: 'fb-boost', name: 'Đẩy bài Facebook',
      type: 'social', typeLabel: 'Social', color: '#F59E0B',
      items: [
        { id: 'fb-post', name: 'fb.com/post/123', values90: genValues(3800, 1.4) },
      ],
    },
    {
      id: 'gg-ads', name: 'Google Ads Search',
      type: 'paid', typeLabel: 'Paid', color: '#10B981',
      items: [
        { id: 'gg-brand', name: 'brand keyword vn', values90: genValues(850, 0.8) },
        { id: 'gg-mua', name: 'mua điện thoại online', values90: genValues(560, 1.6) },
      ],
    },
  ],
}

/* Slice values by resolved range (last N days) */
function sliceValues(values90, rangeInfo) {
  const start = Math.max(0, MAX_DAYS - rangeInfo.days)
  return values90.slice(start, start + rangeInfo.days)
}

/* ── Helpers ── */
const sumArr = arr => arr.reduce((a, b) => a + b, 0)
const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
const fmtFull = n => n.toLocaleString('vi-VN')
const fmtN = n => n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n)

/* ── Palette & static chart data ── */
const PC = { blue: '#0056CC', blueL: '#1A7FFF', orange: '#FF8C00', green: '#00C969', purple: '#7B3FDB', cyan: '#00D4FF' }
const MAP_SCALE = { 7: 0.23, 30: 1, 90: 2.8 }
function genMapNodes(days) {
  const s = MAP_SCALE[Math.min(days, 90)] || MAP_SCALE[30]
  return [
    { label: 'Việt Nam', value: Math.round(1.42e6 * s), color: PC.orange },
    { label: 'Hoa Kỳ', value: Math.round(680e3 * s), color: PC.blueL },
    { label: 'Châu Âu', value: Math.round(420e3 * s), color: PC.cyan },
    { label: 'Nhật Bản', value: Math.round(310e3 * s), color: PC.purple },
    { label: 'Nigeria', value: Math.round(180e3 * s), color: PC.green },
    { label: 'Brazil', value: Math.round(145e3 * s), color: PC.blueL },
    { label: 'Australia', value: Math.round(98e3 * s), color: PC.orange },
  ]
}
const DEVICES = [
  { label: 'Mobile', pct: 58, color: PC.orange },
  { label: 'Desktop', pct: 32, color: PC.blueL },
  { label: 'Tablet', pct: 10, color: PC.purple },
]

function useContainerWidth(ref) {
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return w
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

/* ── WorldMapPanel (compact bar chart) ── */
function WorldMapPanel({ isDark, days }) {
  const [hov, setHov] = useState(null)
  const ref = useRef(null)
  const cW = useContainerWidth(ref)
  const nodes = genMapNodes(days)
  const W = 640, H = 220
  const PAD = { t: 26, r: 10, b: 56, l: 52 }
  const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b
  const maxV = Math.max(...nodes.map(n => n.value))
  const total = nodes.reduce((s, n) => s + n.value, 0)
  const step = iW / nodes.length, barW = step * 0.60
  const fS = cW > 10 ? Math.min(1.6, W / cW) : 1
  const gc = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,40,120,0.07)'
  const lc = isDark ? 'rgba(240,245,249,0.45)' : 'rgba(10,22,60,0.52)'
  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: PAD.t + f * iH, v: fmtN(Math.round(maxV * (1 - f))) }))
  return (
    <div style={{
      background: 'var(--db-surface)', border: '1px solid var(--db-border)',
      borderRadius: 20, boxShadow: 'var(--db-shadow)', overflow: 'hidden',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--db-title-color)', fontFamily: "'Outfit',sans-serif" }}>Nguồn Traffic Toàn Cầu</div>
          <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginTop: 2 }}>{fmtN(total)} lượt · {days} ngày</div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ label: 'Tổng', val: fmtN(total), c: PC.blueL }, { label: '#1', val: nodes[0]?.label, c: PC.orange }].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, color: 'var(--db-text-3)' }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.c, fontFamily: "'Outfit',sans-serif" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref} style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 320, width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            {nodes.map((n, i) => (
              <linearGradient key={i} id={`wmp-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.2" />
              </linearGradient>
            ))}
          </defs>
          {gridVals.map((g, i) => (
            <g key={i}>
              <line x1={PAD.l} x2={PAD.l + iW} y1={g.y} y2={g.y} stroke={gc} strokeWidth="1" strokeDasharray="4 5" />
              <text x={PAD.l - 6} y={g.y + 4} fill={lc} fontSize={9.5 * fS} textAnchor="end" fontFamily="Inter,sans-serif">{g.v}</text>
            </g>
          ))}
          <line x1={PAD.l} x2={PAD.l + iW} y1={PAD.t + iH} y2={PAD.t + iH} stroke={gc} strokeWidth="1" />
          {nodes.map((n, i) => {
            const barH = Math.max((n.value / maxV) * iH, 20)
            const bx = PAD.l + i * step + (step - barW) / 2
            const by = PAD.t + iH - barH
            const isH = hov === i
            const pct = ((n.value / total) * 100).toFixed(1)
            return (
              <g key={i} style={{ cursor: 'default' }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
                <rect x={bx} y={by} width={barW} height={barH}
                  fill={`url(#wmp-${i})`} rx="5"
                  opacity={isH ? 1 : 0.78}
                  style={{ filter: isH ? `drop-shadow(0 0 8px ${n.color}99)` : 'none', transition: 'all 0.15s' }} />
                {/* Always-visible value label above bar */}
                <text x={bx + barW / 2} y={by - 5} textAnchor="middle"
                  fill={n.color} fontSize={10 * fS} fontWeight="700" fontFamily="Outfit,sans-serif"
                  opacity={isH ? 1 : 0.85}>
                  {fmtN(n.value)}
                </text>
                <text x={bx + barW / 2} y={PAD.t + iH + 15 * fS} textAnchor="middle"
                  fill={isH ? n.color : lc} fontSize={10 * fS} fontFamily="Inter,sans-serif" fontWeight={isH ? '700' : '500'}>{n.label}</text>
                <text x={bx + barW / 2} y={PAD.t + iH + 28 * fS} textAnchor="middle"
                  fill={isH ? n.color : lc} fontSize={9 * fS} fontWeight="600" fontFamily="Inter,sans-serif" opacity="0.75">{pct}%</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

/* ── DevicePanel (donut) ── */
function DevicePanel({ days }) {
  const [hovIdx, setHovIdx] = useState(null)
  const winW = useWindowWidth()
  const isMobile = winW < 640
  const donutSize = isMobile ? 160 : 150
  const R = donutSize * 0.38, r = donutSize * 0.24, cx = donutSize / 2, cy = donutSize / 2
  let angle = -90
  const slices = DEVICES.map((d, i) => {
    const deg = (d.pct / 100) * 360
    const start = angle, end = angle + deg
    angle += deg
    const toRad = a => (a * Math.PI) / 180
    const x1 = cx + R * Math.cos(toRad(start)), y1 = cy + R * Math.sin(toRad(start))
    const x2 = cx + R * Math.cos(toRad(end)), y2 = cy + R * Math.sin(toRad(end))
    const ix1 = cx + r * Math.cos(toRad(end)), iy1 = cy + r * Math.sin(toRad(end))
    const ix2 = cx + r * Math.cos(toRad(start)), iy2 = cy + r * Math.sin(toRad(start))
    const large = deg > 180 ? 1 : 0
    return { ...d, path: `M${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} L${ix1},${iy1} A${r},${r},0,${large},0,${ix2},${iy2} Z`, mid: start + deg / 2 }
  })
  const hov = hovIdx !== null ? slices[hovIdx] : null
  return (
    <div style={{
      background: 'var(--db-surface)', border: '1px solid var(--db-border)',
      borderRadius: 20, boxShadow: 'var(--db-shadow)', padding: '16px 20px',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--db-title-color)', fontFamily: "'Outfit',sans-serif", marginBottom: 2 }}>Phân Tích Thiết Bị</div>
      <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginBottom: 14 }}>{days} ngày gần nhất</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 24 : 20, flexWrap: 'wrap' }}>
        <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} style={{ flexShrink: 0 }}>
          {slices.map((s, i) => {
            const isH = hovIdx === i
            const toRad = a => a * Math.PI / 180
            const mx = cx + (R + r) / 2 * Math.cos(toRad(s.mid)), my = cy + (R + r) / 2 * Math.sin(toRad(s.mid))
            const dx = isH ? Math.cos(toRad(s.mid)) * 6 : 0, dy = isH ? Math.sin(toRad(s.mid)) * 6 : 0
            return (
              <g key={i} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                transform={`translate(${dx},${dy})`}
                onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}>
                <path d={s.path} fill={s.color} opacity={isH ? 1 : 0.82}
                  style={{ filter: isH ? `drop-shadow(0 0 8px ${s.color}88)` : 'none', transition: 'all 0.18s' }} />
              </g>
            )
          })}
          <circle cx={cx} cy={cy} r={r - 2} fill="var(--db-surface)" />
          {hov ? (
            <>
              <text x={cx} y={cy - 7} textAnchor="middle" fill={hov.color} fontSize={isMobile ? 22 : 18} fontWeight="900" fontFamily="Outfit,sans-serif">{hov.pct}%</text>
              <text x={cx} y={cy + 11} textAnchor="middle" fill="var(--db-text-3)" fontSize={isMobile ? 11 : 10} fontFamily="Inter,sans-serif">{hov.label}</text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - 5} textAnchor="middle" fill="var(--db-title-color)" fontSize={isMobile ? 24 : 20} fontWeight="900" fontFamily="Outfit,sans-serif">100%</text>
              <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--db-text-3)" fontSize={isMobile ? 12 : 10} fontFamily="Inter,sans-serif">Tất cả</text>
            </>
          )}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {slices.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', padding: '6px 10px', borderRadius: 10,
              background: hovIdx === i ? `color-mix(in srgb, ${s.color} 10%, transparent)` : 'transparent',
              border: `1px solid ${hovIdx === i ? `color-mix(in srgb, ${s.color} 25%, transparent)` : 'transparent'}`,
              transition: 'all 0.15s',
            }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: 'var(--db-text-2)', flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: "'Outfit',sans-serif" }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════════════════ */
const Icons = {
  globe: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M2 12h20M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  folder: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  tag: <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="7" r="1.5" fill="currentColor" /></svg>,
  right: <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  left: <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  traffic: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M22 12H2M16 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M3 3v18h18M7 16l4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  peak: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  wave: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M2 12h4l3-8 4 16 3-8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  card: <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /><path d="M6 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const traffic = payload.find(p => p.dataKey === 'traffic')
  const cost = payload.find(p => p.dataKey === 'cost')
  return (
    <div style={{
      background: 'var(--db-modal-bg)', border: '1px solid var(--db-border)',
      borderRadius: 14, padding: '12px 16px',
      backdropFilter: 'blur(16px)', boxShadow: 'var(--db-shadow)',
      minWidth: 160,
    }}>
      <div style={{ fontSize: 12, color: 'var(--db-text-3)', marginBottom: 8 }}>{label}</div>
      {traffic && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--db-title-color)', marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
          {fmtFull(traffic.value)} lượt
        </div>
      )}
      {cost && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: '#A78BFA' }}>
          <span style={{ width: 8, height: 2, borderRadius: 99, background: '#A78BFA', display: 'inline-block' }} />
          {(cost.value * 25.4).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}K₫ chi phí
        </div>
      )}
    </div>
  )
}

function KPICard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        flex: '1 1 140px', minWidth: 120,
        background: 'var(--db-surface)', border: '1px solid var(--db-border)',
        borderRadius: 12, padding: '12px 14px',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--db-shadow)',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        position: 'absolute', top: -16, right: -16,
        width: 60, height: 60, borderRadius: '50%',
        background: color, opacity: 0.1, filter: 'blur(18px)', pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--db-text-3)' }}>{label}</span>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: `color-mix(in srgb, ${color} 14%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Outfit', sans-serif", color, lineHeight: 1.1, marginBottom: 3, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: 'var(--db-text-3)' }}>{sub}</div>}
    </div>
  )
}

function Panel({ children, style }) {
  return (
    <div style={{
      background: 'var(--db-surface)', border: '1px solid var(--db-border)',
      borderRadius: 20, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      boxShadow: 'var(--db-shadow)', overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

function TableRow({ rank, label, sub, badge, value, maxVal, color, canDrill, showBadgeCol, showDrillCol, onClick }) {
  const [hov, setHov] = useState(false)
  const pct = maxVal > 0 ? (value / maxVal) * 100 : 0
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: '1px solid var(--db-border)',
        background: hov ? 'var(--db-row-hover)' : 'transparent',
        cursor: canDrill ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}
    >
      <td style={{ padding: '12px 16px', width: 44 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 7,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800,
          background: rank <= 3 ? `color-mix(in srgb, ${color} 14%, transparent)` : 'var(--db-surface-2)',
          border: `1px solid color-mix(in srgb, ${color} ${rank <= 3 ? 30 : 0}%, var(--db-border))`,
          color: rank <= 3 ? color : 'var(--db-text-3)',
        }}>{rank}</span>
      </td>
      <td style={{ padding: '12px 8px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: hov && canDrill ? color : 'var(--db-title-color)', transition: 'color 0.15s', marginBottom: sub ? 2 : 0 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--db-text-3)' }}>{sub}</div>}
      </td>
      {showBadgeCol && (
        <td style={{ padding: '12px 8px' }}>
          {badge && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap',
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
              color,
            }}>{badge}</span>
          )}
        </td>
      )}
      <td style={{ padding: '12px 8px', minWidth: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--db-surface-2)', border: '1px solid var(--db-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 70%, transparent))`, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--db-pct-color)', width: 34, textAlign: 'right', flexShrink: 0 }}>{Math.round(pct)}%</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color }}>{fmtFull(value)}</span>
        <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginTop: 1 }}>lượt</div>
      </td>
      {showDrillCol && (
        <td style={{ padding: '12px 12px 12px 4px', width: 32 }}>
          {canDrill && (
            <span style={{ color: hov ? color : 'var(--db-text-3)', transition: 'color 0.15s, transform 0.15s', display: 'inline-flex', transform: hov ? 'translateX(2px)' : 'translateX(0)' }}>
              {Icons.right}
            </span>
          )}
        </td>
      )}
    </tr>
  )
}

/* Table head cell style */
const TH = {
  padding: '10px 16px', textAlign: 'left', fontSize: 11,
  fontWeight: 700, color: 'var(--db-th-color)',
  textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap',
}

/* ──────────────────────────────────────────────────────────────
────────────────────────────────────────────────────────────── */
function AnalyticsLineChart({ data, isDark }) {
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

  const W = Math.max(cW, 300), H = 160
  const PAD = { t: 18, r: 64, b: 38, l: 58 }
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b

  const labels = data.map(d => d.name)
  const traffic = data.map(d => d.traffic)
  const cost = data.map(d => d.cost)
  const n = Math.max(traffic.length - 1, 1)
  const maxT = Math.max(...traffic, 1)
  const maxC = Math.max(...cost, 0.01)

  const ptsT = traffic.map((v, i) => ({ x: PAD.l + (i / n) * innerW, y: PAD.t + (1 - v / maxT) * innerH, label: labels[i], v }))
  const ptsC = cost.map((v, i) => ({ x: PAD.l + (i / n) * innerW, y: PAD.t + (1 - v / maxC) * innerH, v }))

  const makePath = pts => pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1], cpx = (prev.x + p.x) / 2
    return acc + ` C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')
  const pathT = ptsT.length > 1 ? makePath(ptsT) : ''
  const pathC = ptsC.length > 1 ? makePath(ptsC) : ''
  const areaT = pathT ? pathT + ` L ${ptsT[ptsT.length - 1].x} ${PAD.t + innerH} L ${ptsT[0].x} ${PAD.t + innerH} Z` : ''

  const gridLines = [0, .25, .5, .75, 1].map(f => ({ y: PAD.t + f * innerH, vT: Math.round(maxT * (1 - f)).toLocaleString(), vC: Math.round(maxC * (1 - f)) }))
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'

  const handleMouseMove = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let closest = 0, minDist = Infinity
    ptsT.forEach((p, i) => {
      const d = Math.abs(p.x - svgX)
      if (d < minDist) { minDist = d; closest = i }
    })
    setHovIdx(closest)
  }

  const hp = hovIdx !== null ? ptsT[hovIdx] : null
  const hc = hovIdx !== null ? ptsC[hovIdx] : null
  const ttW = 158, ttH = 82
  const ttX = hp ? Math.min(Math.max(hp.x - ttW / 2, 4), W - ttW - 4) : 0
  const ttY = hp ? Math.max(PAD.t - ttH - 10, 0) : 0
  const ttBg = isDark ? 'rgba(10,20,50,0.92)' : 'rgba(255,255,255,0.96)'
  const ttText = isDark ? 'rgba(240,245,255,0.9)' : 'rgba(10,22,60,0.9)'

  if (!ptsT.length) return null
  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: H, display: 'block', cursor: 'crosshair', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="tad-lineT" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0056CC" />
            <stop offset="100%" stopColor="#7B3FDB" />
          </linearGradient>
          <linearGradient id="tad-areaT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0056CC" stopOpacity={isDark ? '0.28' : '0.14'} />
            <stop offset="100%" stopColor="#0056CC" stopOpacity="0.02" />
          </linearGradient>
          <filter id="tad-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="tad-shadow"><feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="rgba(0,0,0,0.3)" /></filter>
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
        {areaT && <path d={areaT} fill="url(#tad-areaT)" />}
        {pathT && <path d={pathT} fill="none" stroke="url(#tad-lineT)" strokeWidth="5" strokeOpacity="0.2" filter="url(#tad-glow)" strokeLinecap="round" />}
        {pathT && <path d={pathT} fill="none" stroke="url(#tad-lineT)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        {ptsT.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y}
            r={hovIdx === i ? 6 : 3}
            fill={isDark ? '#fff' : '#0056CC'} stroke="url(#tad-lineT)"
            strokeWidth={hovIdx === i ? 2.5 : 1.5}
            style={{ transition: 'r 0.1s, stroke-width 0.1s' }} />
        ))}

        {/* Cost line */}
        {pathC && <path d={pathC} fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />}
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
                strokeWidth="1" filter="url(#tad-shadow)" />
              <text x={tx + 12} y={ty + 20} fill={isDark ? 'rgba(200,210,240,0.7)' : 'rgba(10,22,60,0.5)'}
                fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">{hp.label}</text>
              <circle cx={tx + 14} cy={ty + 37} r="4" fill="#0056CC" />
              <text x={tx + 24} y={ty + 41} fill={ttText} fontSize="11" fontFamily="Inter,sans-serif">Traffic</text>
              <text x={tx + ttW - 10} y={ty + 41} fill="#1A7FFF" fontSize="13" fontWeight="800"
                textAnchor="end" fontFamily="Outfit,sans-serif">{hp.v.toLocaleString()}</text>
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


/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function TrafficAnalyticsDashboard({ theme = 'dark', range: externalRange }) {
  const isDark = theme === 'dark'
  const winW = useWindowWidth()
  const isMobile = winW < 640
  /* Date range – use parent's if provided, else own state */
  const [ownRange, setOwnRange] = useState({ mode: 'preset', days: 7 })
  const range = externalRange ?? ownRange
  const setRange = externalRange != null ? () => { } : setOwnRange
  const rangeInfo = useMemo(() => resolveRange(range), [range])

  /* Drill-down: null = global, string = campaignId, string2 = itemId */
  const [selectedCampId, setSelectedCampId] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const selectedCamp = useMemo(() => RAW_DATA.campaigns.find(c => c.id === selectedCampId) || null, [selectedCampId])
  const selectedItem = useMemo(() => {
    if (!selectedCamp) return null
    return selectedCamp.items.find(it => it.id === selectedItemId) || null
  }, [selectedCamp, selectedItemId])

  const scope = !selectedCamp ? 'global' : !selectedItem ? 'campaign' : 'item'

  const goBack = () => {
    if (scope === 'item') setSelectedItemId(null)
    else if (scope === 'campaign') { setSelectedCampId(null); setSelectedItemId(null) }
  }
  const drillInto = (id) => {
    if (scope === 'global') { setSelectedCampId(id); setSelectedItemId(null) }
    else if (scope === 'campaign') setSelectedItemId(id)
  }

  /* ── Compute daily values for selected scope, sliced to range ── */
  const chartData = useMemo(() => {
    const { labels } = rangeInfo
    const addCost = (t) => Math.round(t / 1000 * 1.5 * 100) / 100
    if (scope === 'global') {
      return labels.map((lbl, di) => {
        const traffic = RAW_DATA.campaigns.reduce((s, c) =>
          s + c.items.reduce((ss, it) => ss + sliceValues(it.values90, rangeInfo)[di], 0), 0)
        return { name: lbl, traffic, cost: addCost(traffic) }
      })
    }
    if (scope === 'campaign') {
      return labels.map((lbl, di) => {
        const traffic = selectedCamp.items.reduce((s, it) => s + sliceValues(it.values90, rangeInfo)[di], 0)
        return { name: lbl, traffic, cost: addCost(traffic) }
      })
    }
    const sliced = sliceValues(selectedItem.values90, rangeInfo)
    return labels.map((lbl, di) => ({ name: lbl, traffic: sliced[di], cost: addCost(sliced[di]) }))
  }, [scope, selectedCamp, selectedItem, rangeInfo])

  /* ── KPIs ── */
  const totalTraffic = useMemo(() => chartData.reduce((s, d) => s + d.traffic, 0), [chartData])
  const avgDaily = Math.round(totalTraffic / rangeInfo.days)
  const peakDay = chartData.reduce((b, d) => d.traffic > b.traffic ? d : b, chartData[0] ?? { name: '–', traffic: 0 })
  const totalCost = totalTraffic > 0 ? (totalTraffic / 1000 * 1.5) : 0
  const fmtCost = totalCost >= 1000 ? `${(totalCost * 25.4).toFixed(0)}K₫` : `${Math.round(totalCost * 25400).toLocaleString('vi-VN')}₫`

  const scopeColor = selectedCamp?.color ?? '#3B82F6'

  /* ── Table rows ── */
  const tableRows = useMemo(() => {
    if (scope === 'global') {
      return RAW_DATA.campaigns.map(c => {
        const total = c.items.reduce((s, it) => s + sumArr(sliceValues(it.values90, rangeInfo)), 0)
        return { id: c.id, label: c.name, color: c.color, badge: c.typeLabel, sub: `${c.items.length} từ khóa/URL`, value: total, canDrill: true }
      }).sort((a, b) => b.value - a.value)
    }
    if (scope === 'campaign') {
      return selectedCamp.items.map(it => {
        const total = sumArr(sliceValues(it.values90, rangeInfo))
        return { id: it.id, label: it.name, color: selectedCamp.color, badge: null, sub: `${fmtFull(total)} lượt tổng`, value: total, canDrill: true }
      }).sort((a, b) => b.value - a.value)
    }
    const sliced = sliceValues(selectedItem.values90, rangeInfo)
    return rangeInfo.labels.map((lbl, i) => ({
      id: `day-${i}`, label: lbl, color: selectedCamp.color, badge: null, sub: null, value: sliced[i], canDrill: false,
    }))
  }, [scope, selectedCamp, selectedItem, rangeInfo])

  const maxTableVal = Math.max(...tableRows.map(r => r.value), 1)

  /* ── Labels ── */
  const chartTitle = !selectedCamp ? 'Traffic Toàn Hệ Thống'
    : !selectedItem ? selectedCamp.name
      : selectedItem.name

  const tableTitle = !selectedCamp ? 'Chi Tiết Theo Chiến Dịch'
    : !selectedItem ? `Chi Tiết: ${selectedCamp.name}`
      : `Lịch Sử: ${selectedItem.name}`

  /* Breadcrumb */
  const breadcrumb = useMemo(() => {
    const parts = [{ label: 'Tổng quan', icon: Icons.home, action: () => { setSelectedCampId(null); setSelectedItemId(null) } }]
    if (selectedCamp) parts.push({ label: selectedCamp.name, icon: Icons.folder, action: () => setSelectedItemId(null) })
    if (selectedItem) parts.push({ label: selectedItem.name, icon: Icons.tag, action: null })
    return parts
  }, [selectedCamp, selectedItem])

  return (
    <div style={{ fontFamily: "'Inter', 'Outfit', sans-serif", color: 'var(--db-text)' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 20 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: 'var(--db-text-3)' }}>{Icons.right}</span>}
              <button onClick={crumb.action || undefined} disabled={!crumb.action}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', padding: '2px 6px', borderRadius: 6,
                  cursor: crumb.action ? 'pointer' : 'default',
                  fontSize: 12.5, fontWeight: i === breadcrumb.length - 1 ? 700 : 500,
                  color: i === breadcrumb.length - 1 ? 'var(--db-text)' : 'var(--db-text-3)',
                  fontFamily: "'Inter', sans-serif",
                }}>
                <span style={{ color: i === breadcrumb.length - 1 ? scopeColor : 'var(--db-text-3)', lineHeight: 0 }}>{crumb.icon}</span>
                {crumb.label}
              </button>
            </span>
          ))}
        </nav>

        {/* Title + back + date picker */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {scope !== 'global' && (
                <button
                  id="tad-back-btn"
                  onClick={goBack}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 13px', borderRadius: 10, cursor: 'pointer',
                    background: 'var(--db-surface-2)', border: '1px solid var(--db-border)',
                    color: 'var(--db-text-2)', fontSize: 12.5, fontWeight: 600,
                    fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = scopeColor; e.currentTarget.style.color = scopeColor }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--db-border)'; e.currentTarget.style.color = 'var(--db-text-2)' }}
                >
                  {Icons.left} Quay lại
                </button>
              )}
            </div>
            <p style={{ margin: '5px 0 0', fontSize: 12.5, color: 'var(--db-text-3)' }}>
              {scope === 'global' && 'Nhấn vào hàng để xem chi tiết chiến dịch'}
              {scope === 'campaign' && `Chiến dịch: ${selectedCamp.name} · Nhấn vào từ khóa/URL`}
              {scope === 'item' && `Dữ liệu từng ngày: ${selectedItem.name}`}
              {' · '}
              {rangeInfo.days} ngày ({rangeInfo.from} – {rangeInfo.to})
            </p>
          </div>

          {/* Date picker – only show if NOT controlled by parent */}
          {externalRange == null && (
            <DateRangePicker value={ownRange} onChange={setOwnRange} id="tad" />
          )}
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div id="tad-kpi-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        <KPICard label="Tổng Traffic" value={fmt(totalTraffic)} sub={`${fmtFull(totalTraffic)} lượt`} color={scopeColor} icon={Icons.traffic} />
        <KPICard label="Trung Bình / Ngày" value={fmt(avgDaily)} sub={`${fmtFull(avgDaily)} lượt/ngày`} color="#F59E0B" icon={Icons.chart} />
        <KPICard label="Ngày Cao Nhất" value={peakDay?.name || '–'} sub={peakDay ? `${fmtFull(peakDay.traffic)} lượt` : ''} color="#10B981" icon={Icons.peak} />
        <KPICard label="Đã Chi Tiêu" value={fmtCost} sub={`25.4K₫ / 1,000 lượt · ${rangeInfo.days} ngày`} color="#A78BFA" icon={Icons.card} />
      </div>

      {/* ── WORLD MAP + DEVICE (responsive grid) ── */}
      <div id="tad-panels-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 12, marginBottom: 14 }}>
        <WorldMapPanel isDark={isDark} days={rangeInfo.days} />
        <DevicePanel days={rangeInfo.days} />
      </div>

      {/* ── AREA CHART ── */}
      <section className="db-chart-panel" style={{ marginBottom: 14 }}>
        <div className="db-panel-header">
          <div>
            <h2 className="db-panel-title">
              Traffic / Chi Phí {rangeInfo.days <= 1 ? 'Hôm Nay' : `${rangeInfo.days} Ngày Qua`}
            </h2>
            <p className="db-panel-sub">
              {rangeInfo.days <= 1
                ? 'Hoạt động theo giờ · Cập nhật mỗi 5 phút'
                : `Dữ liệu tổng hợp theo ngày · ${rangeInfo.from} → ${rangeInfo.to}`}
            </p>
          </div>
          <div className="db-chart-legend">
            <span className="db-legend-dot" style={{ background: '#0056CC' }} />
            <span className="db-legend-label">Traffic ({rangeInfo.days <= 1 ? 'lượt/giờ' : 'lượt/ngày'})</span>
            <span className="db-legend-dot" style={{ background: '#FF8C00', marginLeft: 10 }} />
            <span className="db-legend-label">Chi Phí (VNĐ)</span>
          </div>
        </div>
        <div className="db-chart-wrap">
          <AnalyticsLineChart data={chartData} isDark={isDark} />
        </div>
      </section>

      {/* ── DATA TABLE ── */}
      <Panel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--db-border)', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--db-title-color)', fontFamily: "'Outfit', sans-serif" }}>{tableTitle}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--db-text-3)' }}>
              {scope === 'item' ? `${rangeInfo.days} ngày` : `${tableRows.length} mục · Nhấn vào hàng để xem chi tiết`}
            </p>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: `color-mix(in srgb, ${scopeColor} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${scopeColor} 25%, transparent)`, fontSize: 12, fontWeight: 700, color: scopeColor }}>
            {Icons.traffic} {fmtFull(totalTraffic)} lượt
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--db-border)' }}>
                <th style={TH}>#</th>
                <th style={TH}>{scope === 'global' ? 'Chiến Dịch' : scope === 'campaign' ? 'Từ Khóa / URL' : 'Ngày'}</th>
                {scope !== 'item' && <th style={TH}>{scope === 'global' ? 'Loại' : ''}</th>}
                <th style={TH}>Tỷ Lệ</th>
                <th style={{ ...TH, textAlign: 'right' }}>Lượt / Tổng</th>
                {scope !== 'item' && <th style={TH}></th>}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <TableRow
                  key={row.id} rank={i + 1}
                  label={row.label} sub={row.sub} badge={row.badge}
                  value={row.value} maxVal={maxTableVal} color={row.color}
                  canDrill={row.canDrill}
                  showBadgeCol={scope !== 'item'} showDrillCol={scope !== 'item'}
                  onClick={row.canDrill ? () => drillInto(row.id) : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', borderTop: '1px solid var(--db-border)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--db-text-3)' }}>{tableRows.length} mục</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--db-text-3)' }}>Tổng: <strong style={{ color: 'var(--db-title-color)', fontFamily: "'Outfit',sans-serif" }}>{fmtFull(totalTraffic)}</strong></span>
            <span style={{ fontSize: 12, color: 'var(--db-text-3)' }}>TB/ngày: <strong style={{ color: 'var(--db-title-color)', fontFamily: "'Outfit',sans-serif" }}>{fmtFull(avgDaily)}</strong></span>
          </div>
        </div>
      </Panel>

      <style>{`
        @media (max-width: 860px) {
          #tad-panels-grid { grid-template-columns: 1fr !important; }
          #tad-kpi-grid    { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          #tad-panels-grid { gap: 12px !important; }
          #tad-kpi-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
