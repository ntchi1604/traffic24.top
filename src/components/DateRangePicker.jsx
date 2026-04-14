import { useState, useRef, useEffect } from 'react'

const PRESETS = [
  { key: 7, label: '7 ngày' },
  { key: 14, label: '14 ngày' },
  { key: 30, label: '30 ngày' },
  { key: 90, label: '90 ngày' },
]

/* Today fixed for mock data */
const TODAY = '2026-04-03'

function isCustomActive(v) {
  return v?.mode === 'custom'
}

export default function DateRangePicker({ value, onChange, id = 'drp' }) {
  const [showCustom, setShowCustom] = useState(isCustomActive(value))
  const [fromVal, setFromVal] = useState(value?.from || '2026-03-01')
  const [toVal, setToVal] = useState(value?.to || TODAY)
  const panelRef = useRef(null)

  /* Keep showCustom in sync if value changes externally */
  useEffect(() => {
    setShowCustom(isCustomActive(value))
  }, [value?.mode])

  const applyCustom = () => {
    if (!fromVal || !toVal || fromVal > toVal) return
    const diffMs = new Date(toVal) - new Date(fromVal)
    const days = Math.round(diffMs / 86400000) + 1
    onChange({ mode: 'custom', days, from: fromVal, to: toVal })
  }

  const selectPreset = (days) => {
    setShowCustom(false)
    onChange({ mode: 'preset', days })
  }

  const toggleCustom = () => {
    const next = !showCustom
    setShowCustom(next)
    if (!next && isCustomActive(value)) {
      // revert to last preset
      onChange({ mode: 'preset', days: 30 })
    }
  }

  const isPresetActive = (days) => value?.mode === 'preset' && value?.days === days

  /* input date style */
  const dateInput = {
    padding: '5px 8px',
    borderRadius: 8,
    border: '1px solid var(--db-border)',
    background: 'var(--db-surface)',
    color: 'var(--db-text)',
    fontSize: 12,
    fontFamily: "'Inter',sans-serif",
    outline: 'none',
    cursor: 'pointer',
    minWidth: 0,
    width: 'min(128px, 38vw)',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {/* Preset pill bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'var(--db-surface-2)',
        border: '1px solid var(--db-border)',
        borderRadius: 12, padding: 4,
      }}>
        {/* Calendar icon */}
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"
          style={{ color: 'var(--db-text-3)', marginLeft: 5, flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        {PRESETS.map(r => (
          <button
            key={r.key}
            id={`${id}-preset-${r.key}`}
            onClick={() => selectPreset(r.key)}
            style={{
              padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
              border: isPresetActive(r.key) ? '1px solid rgba(26,127,255,0.4)' : '1px solid transparent',
              background: isPresetActive(r.key) ? 'rgba(26,127,255,0.14)' : 'transparent',
              color: isPresetActive(r.key) ? '#1A7FFF' : 'var(--db-text-2)',
              fontSize: 12.5, fontWeight: isPresetActive(r.key) ? 700 : 500,
              fontFamily: "'Inter',sans-serif",
              transition: 'all 0.18s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isPresetActive(r.key)) e.currentTarget.style.color = 'var(--db-text)' }}
            onMouseLeave={e => { if (!isPresetActive(r.key)) e.currentTarget.style.color = 'var(--db-text-2)' }}
          >{r.label}</button>
        ))}

        {/* Custom toggle button */}
        <button
          id={`${id}-custom-toggle`}
          onClick={toggleCustom}
          style={{
            padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
            border: showCustom ? '1px solid rgba(245,158,11,0.45)' : '1px solid transparent',
            background: showCustom ? 'rgba(245,158,11,0.13)' : 'transparent',
            color: showCustom ? '#F59E0B' : 'var(--db-text-2)',
            fontSize: 12.5, fontWeight: showCustom ? 700 : 500,
            fontFamily: "'Inter',sans-serif",
            transition: 'all 0.18s', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
          onMouseEnter={e => { if (!showCustom) e.currentTarget.style.color = 'var(--db-text)' }}
          onMouseLeave={e => { if (!showCustom) e.currentTarget.style.color = 'var(--db-text-2)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Tùy chọn
        </button>
      </div>

      {/* Custom date inputs */}
      {showCustom && (
        <div
          ref={panelRef}
          className="drp-custom-panel"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            flexWrap: 'wrap',
            padding: '6px 10px',
            background: 'var(--db-surface)',
            border: '1px solid rgba(245,158,11,0.35)',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            animation: 'drpSlideIn 0.18s ease',
            width: '100%',
          }}
        >
          <span style={{ fontSize: 11.5, color: 'var(--db-text-3)', whiteSpace: 'nowrap' }}>Từ</span>
          <input
            type="date"
            id={`${id}-from`}
            value={fromVal}
            max={toVal || TODAY}
            onChange={e => setFromVal(e.target.value)}
            style={dateInput}
          />
          <span style={{ fontSize: 11.5, color: 'var(--db-text-3)' }}>—</span>
          <input
            type="date"
            id={`${id}-to`}
            value={toVal}
            min={fromVal}
            max={TODAY}
            onChange={e => setToVal(e.target.value)}
            style={dateInput}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              id={`${id}-apply`}
              onClick={applyCustom}
              disabled={!fromVal || !toVal || fromVal > toVal}
              style={{
                padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                background: (!fromVal || !toVal || fromVal > toVal) ? 'var(--db-surface-2)' : '#F59E0B',
                border: 'none',
                color: (!fromVal || !toVal || fromVal > toVal) ? 'var(--db-text-3)' : '#000',
                fontSize: 12, fontWeight: 700,
                fontFamily: "'Inter',sans-serif",
                transition: 'all 0.15s', whiteSpace: 'nowrap',
                opacity: (!fromVal || !toVal || fromVal > toVal) ? 0.5 : 1,
              }}
            >
              Áp dụng
            </button>
            {/* show computed days */}
            {fromVal && toVal && fromVal <= toVal && (
              <span style={{
                fontSize: 11.5, color: '#F59E0B', fontWeight: 700,
                background: 'rgba(245,158,11,0.12)',
                padding: '3px 8px', borderRadius: 6,
                whiteSpace: 'nowrap',
              }}>
                {Math.round((new Date(toVal) - new Date(fromVal)) / 86400000) + 1} ngày
              </span>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes drpSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.5; cursor: pointer;
          filter: var(--db-date-icon-filter, none);
        }
        @media (max-width: 480px) {
          .drp-custom-panel input[type="date"] {
            width: calc(50vw - 52px) !important;
            font-size: 11.5px !important;
            padding: 4px 6px !important;
          }
        }
      `}</style>
    </div>
  )
}
