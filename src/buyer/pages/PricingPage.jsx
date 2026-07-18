import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────── DATA ──────────────────────── */
const DURATIONS = ['60s', '90s', '120s', '150s', '200s']

const TRAFFIC = [
  {
    id: 'organic',
    label: 'Google Search',
    color: '#3b82f6',
    dim: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.28)',
    glow: 'rgba(59,130,246,0.2)',
    prices: { '60s': [900, 800], '90s': [1100, 1000], '120s': [1200, 1100], '150s': [1400, 1300], '200s': [1700, 1500] },
  },
  {
    id: 'direct',
    label: 'Direct Traffic',
    color: '#10b981',
    dim: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.28)',
    glow: 'rgba(16,185,129,0.2)',
    prices: { '60s': [700, 600], '90s': [900, 800], '120s': [1100, 800], '150s': [1200, 1000], '200s': [1500, 1400] },
  },
  {
    id: 'social',
    label: 'Social Traffic',
    color: '#a855f7',
    dim: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.28)',
    glow: 'rgba(168,85,247,0.2)',
    prices: { '60s': [990, 880], '90s': [1090, 1090], '120s': [1320, 1100], '150s': [1550, 1320], '200s': [1700, 1540] },
  },
]

/* ─────────────────────────────── ICONS ─────────────────────── */
const IcGoogle = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M21.53 12.2c0-.68-.06-1.33-.17-1.96H12v3.71h5.34a4.56 4.56 0 01-1.98 2.99v2.48h3.2C20.44 17.67 21.53 15.12 21.53 12.2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.2-2.49c-.9.6-2.04.95-3.41.95-2.62 0-4.84-1.77-5.63-4.15H3.07v2.57A9.99 9.99 0 0012 22z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.37 13.89A6.02 6.02 0 016.05 12c0-.66.11-1.3.32-1.89V7.54H3.07A9.99 9.99 0 002 12c0 1.61.38 3.13 1.07 4.46l3.3-2.57z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 5.96c1.47 0 2.8.51 3.84 1.5l2.88-2.88C16.96 3.04 14.7 2 12 2a9.99 9.99 0 00-8.93 5.54l3.3 2.57C7.16 7.73 9.38 5.96 12 5.96z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)
const IcDirect = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const IcSocial = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <circle cx="18" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="19" r="2.8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5L8.6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const ICONS = { organic: IcGoogle, direct: IcDirect, social: IcSocial }

/* ─────────────────────────────── HELPERS ───────────────────── */
const vnd = n => n.toLocaleString('vi-VN') + 'đ'

/* ─────────────────────────────── VERSION EXPLAINER ─────────── */
function VersionExplainer() {
  return (
    <div className="pricing-explainer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
      {[
        {
          tag: 'V1', tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.1)', tagBorder: 'rgba(245,158,11,0.28)',
          title: 'Version 1 — 2 bước', badge: 'Chất lượng cao hơn',
          steps: ['Chờ X giây (thời lượng chọn)', 'Click link nội bộ trang', 'Ở lại thêm 25–35 giây'],
          pros: ['Tín hiệu hành vi tự nhiên hơn', 'Bounce rate thấp hơn', 'Pageview trang nội bộ'],
          note: 'Phù hợp khi cần cải thiện bounce rate & depth',
        },
        {
          tag: 'V2', tagColor: '#60a5fa', tagBg: 'rgba(96,165,250,0.1)', tagBorder: 'rgba(96,165,250,0.28)',
          title: 'Version 2 — 1 bước', badge: 'Đơn giản & nhanh',
          steps: ['Chờ đủ X thời gian là xong'],
          pros: ['Cấu hình đơn giản, nhanh hơn', 'Giá thấp hơn V1', 'Phù hợp tăng traffic thuần'],
          note: 'Phù hợp khi chỉ cần tăng lượt truy cập đơn thuần',
        },
      ].map((v, vi) => (
        <div key={vi} style={{
          borderRadius: 16, overflow: 'hidden',
          background: 'var(--db-surface)', border: '1px solid var(--db-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }}>
          {/* header */}
          <div style={{
            padding: '12px 18px', background: v.tagBg,
            borderBottom: `1px solid ${v.tagBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 20, fontWeight: 900, color: v.tagColor }}>{v.tag}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--db-title-color)' }}>{v.title}</span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
              background: v.tagBg, border: `1px solid ${v.tagBorder}`, color: v.tagColor,
            }}>{v.badge}</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', gap: 20 }}>
            {/* steps */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--db-text-3)', marginBottom: 8 }}>Luồng hoạt động</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {v.steps.map((s, si) => (
                  <div key={si} style={{ display: 'flex', gap: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 7, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: v.tagBg, border: `1px solid ${v.tagBorder}`,
                        color: v.tagColor, fontSize: 9, fontWeight: 900,
                      }}>{si + 1}</div>
                      {si < v.steps.length - 1 && (
                        <div style={{ width: 1, minHeight: 14, background: `linear-gradient(180deg,${v.tagBorder},transparent)`, marginTop: 2 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: si < v.steps.length - 1 ? 10 : 0, paddingTop: 2 }}>
                      <span style={{ fontSize: 11.5, color: 'var(--db-text)' }}>{s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* pros */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: 'var(--db-text-3)', marginBottom: 8 }}>Lợi ích</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {v.pros.map((p, pi) => (
                  <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 15, height: 15, borderRadius: 5, flexShrink: 0,
                      background: v.tagBg, border: `1px solid ${v.tagBorder}`, color: v.tagColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg viewBox="0 0 12 12" fill="none" width="8" height="8">
                        <path d="M1.5 6l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--db-text-2)' }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '7px 10px', borderRadius: 8, background: v.tagBg, border: `1px solid ${v.tagBorder}`, fontSize: 11, color: v.tagColor, lineHeight: 1.5 }}>
                {v.note}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════ */
export default function PricingPage() {
  const navigate = useNavigate()
  const [showExplain, setShowExplain] = useState(true)
  const [hovRow, setHovRow] = useState(null)
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Use ResizeObserver to detect actual container width (not viewport)
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < 700)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleOrder = (trafficId, version, durationStr) => {
    navigate('/create', {
      state: { trafficType: trafficId, version, duration: parseInt(durationStr) }
    })
  }

  return (
    <>
      <div ref={containerRef} style={{ padding: '4px 0 48px' }} id="pricing-page">
        {/* ══════ VERSION EXPLAINER ══════ */}
        {showExplain && <VersionExplainer />}

        {/* ══════ FULL PRICING TABLE (desktop) ══════ */}
        {!isMobile && (
        <div className="pricing-card" style={{
          borderRadius: 20, overflow: 'hidden',
          background: 'var(--db-surface)',
          border: '1px solid var(--db-border)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
          marginBottom: 20,
        }}>
          <div className="pricing-scroll-wrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: 'var(--db-border) transparent' }}>
            <div style={{ minWidth: 700 }}>

              {/* ── Traffic type column headers ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '140px repeat(3, 1fr)',
                borderBottom: '1px solid var(--db-border)',
              }}>
                {/* Corner */}
                <div style={{
                  padding: '16px 18px',
                  borderRight: '1px solid var(--db-border)',
                  display: 'flex', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--db-text-3)' }}>
                    Thời lượng
                  </span>
                </div>

                {/* Traffic type headers */}
                {TRAFFIC.map((t, ti) => {
                  const Icon = ICONS[t.id]
                  return (
                    <div key={t.id} style={{
                      padding: '14px 16px',
                      background: `linear-gradient(135deg, ${t.dim}, transparent 70%)`,
                      borderRight: ti < TRAFFIC.length - 1 ? '1px solid var(--db-border)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)`,
                          boxShadow: `0 4px 12px ${t.glow}`, color: '#fff',
                        }}>
                          <Icon />
                        </div>
                        <div>
                          <div style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 13, fontWeight: 800, color: 'var(--db-title-color)' }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--db-text-3)', marginTop: 1 }}>
                            {DURATIONS.length} mức thời lượng
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Sub-header: V1 / V2 per traffic type ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '140px repeat(3, 1fr)',
                borderBottom: '1px solid var(--db-border)',
                background: 'rgba(0,0,0,0.18)',
              }}>
                <div style={{ padding: '8px 18px', borderRight: '1px solid var(--db-border)' }} />
                {TRAFFIC.map((t, ti) => (
                  <div key={t.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 100px',
                    borderRight: ti < TRAFFIC.length - 1 ? '1px solid var(--db-border)' : 'none',
                  }}>
                    <div style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.6px', color: '#f59e0b' }}>Giá V1</div>
                      <div style={{ fontSize: 9, color: 'var(--db-text-3)', opacity: 0.7, marginTop: 1 }}>2 bước</div>
                    </div>
                    <div style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.6px', color: '#60a5fa' }}>Giá V2</div>
                      <div style={{ fontSize: 9, color: 'var(--db-text-3)', opacity: 0.7, marginTop: 1 }}>1 bước</div>
                    </div>
                    <div style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--db-text-3)' }}>Đặt mua</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Data rows ── */}
              {DURATIONS.map((dur, ri) => {
                const isHov = hovRow === ri
                const isLast = ri === DURATIONS.length - 1
                return (
                  <div
                    key={dur}
                    id={`row-${dur}`}
                    onMouseEnter={() => setHovRow(ri)}
                    onMouseLeave={() => setHovRow(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '140px repeat(3, 1fr)',
                      borderBottom: isLast ? 'none' : '1px solid var(--db-border)',
                      background: isHov ? 'rgba(255,255,255,0.02)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Duration cell */}
                    <div style={{
                      padding: '14px 18px',
                      borderRight: '1px solid var(--db-border)',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: isHov ? 'rgba(148,163,184,0.15)' : 'var(--db-surface-2)',
                        border: '1px solid var(--db-border)',
                        transition: 'all 0.2s',
                      }}>
                        <span style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 14, fontWeight: 900, lineHeight: 1, color: 'var(--db-title-color)' }}>
                          {parseInt(dur)}
                        </span>
                        <span style={{ fontSize: 8, color: 'var(--db-text-3)', marginTop: 1 }}>giây</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--db-text)' }}>{dur} session</div>
                        <div style={{ fontSize: 10, color: 'var(--db-text-3)', marginTop: 1 }}>/ 1 lượt visit</div>
                      </div>
                    </div>

                    {/* Per-traffic columns */}
                    {TRAFFIC.map((t, ti) => {
                      const [v1, v2] = t.prices[dur]
                      return (
                        <div key={t.id} style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr 100px',
                          alignItems: 'center',
                          borderRight: ti < TRAFFIC.length - 1 ? '1px solid var(--db-border)' : 'none',
                          background: isHov ? t.dim : 'transparent',
                          transition: 'background 0.15s',
                        }}>
                          {/* V1 price */}
                          <div style={{ padding: '14px 10px', textAlign: 'center' }}>
                            <div style={{
                              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                              padding: '6px 10px', borderRadius: 10,
                              background: isHov ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.06)',
                              border: `1px solid ${isHov ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.12)'}`,
                              transition: 'all 0.15s',
                            }}>
                              <span style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 15, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
                                {vnd(v1)}
                              </span>
                            </div>
                          </div>

                          {/* V2 price */}
                          <div style={{ padding: '14px 10px', textAlign: 'center' }}>
                            <div style={{
                              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                              padding: '6px 10px', borderRadius: 10,
                              background: isHov ? 'rgba(96,165,250,0.1)' : 'rgba(96,165,250,0.06)',
                              border: `1px solid ${isHov ? 'rgba(96,165,250,0.35)' : 'rgba(96,165,250,0.12)'}`,
                              transition: 'all 0.15s',
                            }}>
                              <span style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 15, fontWeight: 900, color: '#60a5fa', lineHeight: 1 }}>
                                {vnd(v2)}
                              </span>
                            </div>
                          </div>

                          {/* CTA buttons */}
                          <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
                            <button
                              id={`btn-${t.id}-v1-${dur}`}
                              onClick={() => handleOrder(t.id, 1, dur)}
                              style={{
                                width: '100%', padding: '5px 0', borderRadius: 8,
                                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                background: isHov ? 'rgba(245,158,11,0.18)' : 'rgba(245,158,11,0.07)',
                                color: '#f59e0b', border: '1px solid rgba(245,158,11,0.28)',
                                transition: 'all 0.15s',
                              }}
                            >
                              Đặt V1
                            </button>
                            <button
                              id={`btn-${t.id}-v2-${dur}`}
                              onClick={() => handleOrder(t.id, 2, dur)}
                              style={{
                                width: '100%', padding: '5px 0', borderRadius: 8,
                                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                background: isHov
                                  ? `linear-gradient(135deg, ${t.color}, ${t.color}bb)`
                                  : t.dim,
                                color: isHov ? '#fff' : t.color,
                                border: `1px solid ${isHov ? 'transparent' : t.border}`,
                                boxShadow: isHov ? `0 3px 10px ${t.glow}` : 'none',
                                transition: 'all 0.15s',
                              }}
                            >
                              Đặt V2
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {/* ── Table footer ── */}
            </div>{/* end minWidth */}
          </div>{/* end scroll wrap */}

          {/* Table footer - outside scroll */}
          <div
            className="pricing-table-footer"
            style={{
              padding: '12px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
              borderTop: '1px solid var(--db-border)',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--db-text-3)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: 'rgba(245,158,11,0.6)', display: 'inline-block' }} />
                V1 đắt hơn — 2 bước, tự nhiên hơn
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--db-text-3)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: 'rgba(96,165,250,0.6)', display: 'inline-block' }} />
                V2 rẻ hơn — 1 bước, cấu hình nhanh
              </span>
              <span style={{ fontSize: 11, color: 'var(--db-text-3)' }}>
                · Giá tính theo 1 lượt visit thực giao
              </span>
            </div>
            <a
              id="btn-bulk-quote"
              href="https://t.me/traffic24htop"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 11, fontSize: 12, fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', border: 'none', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
              }}
            >
              Báo giá khối lượng lớn
              <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
        )}{/* end desktop table */}

        {/* ══════ MOBILE LAYOUT ══════ */}
        {isMobile && (
        <div style={{ marginBottom: 20 }}>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--db-text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: 'rgba(245,158,11,0.6)', display: 'inline-block' }} />
              V1 — 2 bước
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--db-text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: 'rgba(96,165,250,0.6)', display: 'inline-block' }} />
              V2 — 1 bước
            </span>
          </div>

          {DURATIONS.map((dur, di) => (
            <div key={dur} style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'var(--db-surface)',
              border: '1px solid var(--db-border)',
              marginBottom: di < DURATIONS.length - 1 ? 12 : 0,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}>
              {/* Duration header */}
              <div style={{
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(0,0,0,0.2)',
                borderBottom: '1px solid var(--db-border)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--db-surface-2)', border: '1px solid var(--db-border)',
                }}>
                  <span style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 16, fontWeight: 900, lineHeight: 1, color: 'var(--db-title-color)' }}>
                    {parseInt(dur)}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--db-text-3)' }}>giây</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--db-title-color)' }}>{dur} session</div>
                  <div style={{ fontSize: 11, color: 'var(--db-text-3)', marginTop: 2 }}>Chọn loại traffic bên dưới</div>
                </div>
              </div>

              {/* Traffic rows */}
              {TRAFFIC.map((t, ti) => {
                const [v1, v2] = t.prices[dur]
                const Icon = ICONS[t.id]
                return (
                  <div key={t.id} style={{
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    borderBottom: ti < TRAFFIC.length - 1 ? '1px solid var(--db-border)' : 'none',
                    background: 'transparent',
                  }}>
                    {/* Traffic type + prices */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: t.dim, border: `1px solid ${t.border}`, color: t.color,
                      }}>
                        <Icon />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--db-title-color)', lineHeight: 1.2 }}>{t.label}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, color: 'rgba(245,158,11,0.8)', fontWeight: 700 }}>V1: {v1.toLocaleString('vi-VN')}đ</span>
                          <span style={{ fontSize: 10, color: 'rgba(96,165,250,0.9)', fontWeight: 700 }}>V2: {v2.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                    {/* Buttons row */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        id={`mob-${t.id}-v1-${dur}`}
                        onClick={() => handleOrder(t.id, 1, dur)}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 9,
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          background: 'rgba(245,158,11,0.1)',
                          color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)',
                        }}
                      >
                        Đặt V1
                      </button>
                      <button
                        id={`mob-${t.id}-v2-${dur}`}
                        onClick={() => handleOrder(t.id, 2, dur)}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 9,
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          background: t.dim, color: t.color,
                          border: `1px solid ${t.border}`,
                        }}
                      >
                        Đặt V2
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {/* Mobile bulk CTA */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              id="btn-bulk-quote-mobile"
              href="https://t.me/traffic24htop"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
              }}
            >
              Báo giá khối lượng lớn
              <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
        )}{/* end mobile view */}

        {/* ══════ CTA BANNER ══════ */}
        <div
          id="pricing-cta"
          style={{
            padding: '24px 28px',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap',
            background: 'var(--db-surface)',
            border: '1px solid var(--db-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -24, left: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(28px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -24, right: -24, width: 120, height: 120, borderRadius: '50%', background: 'rgba(139,92,246,0.07)', filter: 'blur(28px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: `Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif`, fontSize: 16, fontWeight: 800, color: 'var(--db-title-color)', marginBottom: 5 }}>
              Cần báo giá cho khối lượng lớn?
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--db-text-3)', margin: 0, lineHeight: 1.6 }}>
              Liên hệ qua Telegram · Hỗ trợ 24/7 · Ưu đãi riêng cho agency &amp; volume cao
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <a
              id="btn-tele-secondary"
              href="https://t.me/traffic24htop"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '11px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: 'var(--db-surface-2)', color: 'var(--db-text-2)',
                border: '1.5px solid var(--db-border)', textDecoration: 'none',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              Telegram
            </a>
            <a
              id="btn-tele-primary"
              href="https://t.me/traffic24htop"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '11px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff', border: 'none', textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(59,130,246,0.32)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Liên hệ ngay
            </a>
          </div>
        </div>

      </div>

      <style>{`
      /* ── Version explainer: 2 cols → 1 col ── */
      @media (max-width: 560px) {
        .pricing-explainer-grid {
          grid-template-columns: 1fr !important;
        }
      }

      /* ── CTA banner: stack ── */
      @media (max-width: 560px) {
        #pricing-cta {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 14px !important;
        }
        #pricing-cta > div:last-child {
          width: 100%; display: flex !important; gap: 8px;
        }
        #pricing-cta a { flex: 1; justify-content: center; }
      }

      /* ── Scrollbar style for desktop table ── */
      .pricing-scroll-wrap::-webkit-scrollbar { height: 5px; }
      .pricing-scroll-wrap::-webkit-scrollbar-track { background: transparent; }
      .pricing-scroll-wrap::-webkit-scrollbar-thumb { background: var(--db-border); border-radius: 99px; }
    `}</style>
    </>
  )
}
