import { useState } from 'react'

const REF = { code: 'MINH4821', link: 'https://traffic24h.top/ref/MINH4821', rate: 10, totalEarned: 350000, thisMonth: 75000, total: 8, active: 5 }
const HISTORY = [
  { id: 1, date: '01/07', user: 't***n@gmail.com', amount: 750000, commission: 75000, status: 'paid' },
  { id: 2, date: '20/06', user: 'l***a@yahoo.com', amount: 299000, commission: 29900, status: 'paid' },
  { id: 3, date: '15/06', user: 'h***u@outlook.com', amount: 799000, commission: 79900, status: 'paid' },
  { id: 4, date: '10/06', user: 'p***m@gmail.com', amount: 299000, commission: 29900, status: 'pending' },
  { id: 5, date: '05/06', user: 'd***k@gmail.com', amount: 799000, commission: 79900, status: 'paid' },
]

function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ' }

export default function UserReferralPage() {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(REF.link); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-kpi-row">
        {[
          { label: 'Tổng hoa hồng', value: fmtC(REF.totalEarned), color: '#FF8C00' },
          { label: 'Tháng này', value: fmtC(REF.thisMonth), color: '#1A7FFF' },
          { label: 'Tổng người giới thiệu', value: REF.total, color: '#00C969' },
          { label: 'Đang hoạt động', value: REF.active, color: '#A855F7' },
        ].map((k, i) => (
          <div key={i} className="ud-kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="ud-kpi-top"><div className="ud-kpi-icon"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v10M9 10h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div></div>
            <div className="ud-kpi-value">{k.value}</div>
            <div className="ud-kpi-label">{k.label}</div>
            <div className="ud-kpi-glow" />
          </div>
        ))}
      </div>

      <div className="ud-chart-panel" style={{ padding: 24 }}>
        <div className="ud-panel-title" style={{ marginBottom: 12 }}>Link Giới Thiệu Của Bạn</div>
        <div className="ud-flex ud-items-center ud-gap-10" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, padding: '12px 16px', borderRadius: 12, background: 'var(--ud-input-bg)', border: '1px solid var(--ud-border)', fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#1A7FFF', wordBreak: 'break-all' }}>{REF.link}</div>
          <button className={`ud-copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
            {copied ? <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.8"/></svg>}
            {copied ? 'Đã copy!' : 'Copy Link'}
          </button>
        </div>
        <div className="ud-flex ud-gap-10" style={{ marginTop: 12 }}>
          <span className="ud-badge ud-badge-blue">Hoa hồng: {REF.rate}%</span>
          <span className="ud-badge ud-badge-green">Mỗi người mới: 10%</span>
        </div>
      </div>

      <div className="ud-grid-3">
        {[
          { num: '1', title: 'Chia sẻ link', desc: 'Gửi link cho bạn bè, người thân hoặc trên MXH.' },
          { num: '2', title: 'Bạn đăng ký', desc: 'Người được giới thiệu đăng ký tài khoản mới.' },
          { num: '3', title: 'Nhận hoa hồng', desc: `Bạn nhận ${REF.rate}% hoa hồng mỗi lần thanh toán.` },
        ].map(s => (
          <div key={s.num} className="ud-chart-panel" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #E07A00, #FF9520)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>{s.num}</div>
            <div className="ud-panel-title" style={{ marginBottom: 4 }}>{s.title}</div>
            <div className="ud-text-sm ud-text-muted">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="ud-table-panel">
        <div className="ud-panel-header"><div className="ud-panel-title">Lịch Sử Hoa Hồng</div><span className="ud-badge ud-badge-blue">{HISTORY.length} giao dịch</span></div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Ngày</th><th>Người dùng</th><th>Số tiền</th><th>Hoa hồng</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {HISTORY.map(h => (
                <tr key={h.id} className="ud-table-row">
                  <td className="ud-table-stats">{h.date}</td>
                  <td className="ud-table-stats">{h.user}</td>
                  <td className="ud-table-stats">{fmtC(h.amount)}</td>
                  <td className="ud-table-stats" style={{ color: '#00C969', fontWeight: 600 }}>+{fmtC(h.commission)}</td>
                  <td><span className={`ud-status-badge ${h.status === 'paid' ? 'ud-status-active' : 'ud-status-pending'}`}><span className="ud-status-dot" />{h.status === 'paid' ? 'Đã Trả' : 'Đang Chờ'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
