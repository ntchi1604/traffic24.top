const TOP_LINKS = [
  { name: 'Review iPhone 17 Pro Max', views: 62400, ctr: 8.2 },
  { name: 'MacBook Air M4 Review', views: 55800, ctr: 8.2 },
  { name: 'Xu Hướng AI Năm 2026', views: 41200, ctr: 8.0 },
  { name: 'Bàn Phím Cơ Gear75', views: 38100, ctr: 7.6 },
  { name: 'Biển Mỹ Khê Đẹp Nhất', views: 33600, ctr: 7.3 },
]

const CATS = [{ name: 'Tech', links: 8, views: 268000, pct: 31.6 }, { name: 'Fashion', links: 5, views: 120200, pct: 14.2 }, { name: 'Travel', links: 4, views: 116000, pct: 13.7 }, { name: 'Food', links: 3, views: 73900, pct: 8.7 }, { name: 'Health', links: 3, views: 49900, pct: 5.9 }]

const MONTHLY = [
  { m: 'T1', views: 420000 }, { m: 'T2', views: 510000 }, { m: 'T3', views: 580000 },
  { m: 'T4', views: 650000 }, { m: 'T5', views: 720000 }, { m: 'T6', views: 780000 }, { m: 'T7', views: 847293 },
]

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) }

export default function UserStatisticsPage({ theme }) {
  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-kpi-row">
        {[
          { label: 'Tổng lượt xem', value: fmt(847293), color: '#1A7FFF' },
          { label: 'Tổng clicks', value: fmt(33410), color: '#FF8C00' },
          { label: 'Tổng link', value: '23', color: '#00C969' },
          { label: 'CTR trung bình', value: '7.4%', color: '#A855F7' },
        ].map((k, i) => (
          <div key={i} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="ud-kpi-top"><div className="ud-kpi-icon"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div></div>
            <div className="ud-kpi-value">{k.value}</div>
            <div className="ud-kpi-label">{k.label}</div>
            <div className="ud-kpi-glow" />
          </div>
        ))}
      </div>

      <div className="ud-grid-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="ud-table-panel">
          <div className="ud-panel-header"><div className="ud-panel-title">Link Hiệu Quả Nhất</div></div>
          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead><tr><th>#</th><th>Link</th><th>Lượt xem</th><th>CTR</th></tr></thead>
              <tbody>
                {TOP_LINKS.map((l, i) => (
                  <tr key={i} className="ud-table-row">
                    <td className="ud-table-stats">{i + 1}</td>
                    <td className="ud-table-name">{l.name}</td>
                    <td className="ud-table-stats">{fmt(l.views)}</td>
                    <td className="ud-table-stats">{l.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ud-table-panel">
          <div className="ud-panel-header"><div className="ud-panel-title">Theo Danh Mục</div></div>
          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead><tr><th>Danh mục</th><th>Link</th><th>Lượt xem</th><th>Tỷ lệ</th></tr></thead>
              <tbody>
                {CATS.map(c => (
                  <tr key={c.name} className="ud-table-row">
                    <td className="ud-table-name">{c.name}</td>
                    <td className="ud-table-stats">{c.links}</td>
                    <td className="ud-table-stats">{fmt(c.views)}</td>
                    <td><div className="ud-flex ud-items-center ud-gap-8"><div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--ud-surface-2)', overflow: 'hidden' }}><div style={{ width: c.pct * 3 + '%', height: '100%', borderRadius: 3, background: '#1A7FFF' }} /></div><span className="ud-text-xs ud-text-muted">{c.pct}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="ud-chart-panel">
        <div className="ud-panel-header"><div><div className="ud-panel-title">Tăng Trưởng Theo Tháng</div><div className="ud-panel-sub">7 tháng gần đây</div></div></div>
        <div className="ud-chart-wrap">
          <svg viewBox="0 0 600 200" width="100%" height="220" style={{ display: 'block' }}>
            {(() => {
              const mx = Math.max(...MONTHLY.map(d => d.views))
              const pad = 40, w = 600, h = 200, step = (w - pad * 2) / (MONTHLY.length - 1)
              const pts = MONTHLY.map((d, i) => ({ x: pad + i * step, y: pad + (1 - d.views / mx) * (h - pad * 2) }))
              const line = pts.map(p => `${p.x},${p.y}`).join(' ')
              const area = `${pad},${h - pad} ${line} ${pad + (MONTHLY.length - 1) * step},${h - pad}`
              return <>
                <defs><linearGradient id="us-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1A7FFF" stopOpacity="0.2" /><stop offset="100%" stopColor="#1A7FFF" stopOpacity="0" /></linearGradient></defs>
                {[0.25, 0.5, 0.75].map(f => <line key={f} x1={pad} y1={pad + f * (h - pad * 2)} x2={w - pad} y2={pad + f * (h - pad * 2)} stroke={theme === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'} strokeWidth="1" />)}
                <polygon points={area} fill="url(#us-g)" />
                <polyline points={line} fill="none" stroke="#1A7FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1A7FFF" stroke={theme === 'dark' ? '#0D1B2A' : '#EEF4FF'} strokeWidth="2" />)}
                {MONTHLY.map((d, i) => <text key={i} x={pad + i * step} y={h - 10} textAnchor="middle" fill={theme === 'dark' ? 'rgba(240,245,249,.3)' : 'rgba(10,22,60,.4)'} fontSize="11" fontFamily="Inter">{d.m}</text>)}
              </>
            })()}
          </svg>
        </div>
      </div>
    </div>
  )
}
