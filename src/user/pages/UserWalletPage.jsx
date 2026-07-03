import { useState, useMemo } from 'react'

const BALANCE = 1250000
const PENDING = 125000
const TOTAL_WITHDRAWN = 3500000
const METHODS = [{ label: 'Chuyển khoản NH', sub: 'Vietcombank ****4821', color: '#1A7FFF' }, { label: 'Ví MoMo', sub: '0912***8821', color: '#AE00FF' }]

const TXNS = [
  { id: 'TXN-9001', date: '01/07', desc: 'Thu nhập views — thoimoda.vn', amount: 45200, bal: 1250000, type: 'income' },
  { id: 'TXN-9002', date: '28/06', desc: 'Rút tiền — Chuyển khoản NH', amount: -500000, bal: 1204800, type: 'withdraw' },
  { id: 'TXN-9003', date: '25/06', desc: 'Thu nhập views — techblog.vn', amount: 62400, bal: 1704800, type: 'income' },
  { id: 'TXN-9004', date: '20/06', desc: 'Referral commission', amount: 75000, bal: 1642400, type: 'income' },
  { id: 'TXN-9005', date: '15/06', desc: 'Rút tiền — MoMo', amount: -300000, bal: 1567400, type: 'withdraw' },
  { id: 'TXN-9006', date: '10/06', desc: 'Thu nhập views — shopxanh.vn', amount: 38100, bal: 1867400, type: 'income' },
  { id: 'TXN-9007', date: '05/06', desc: 'Bonus campaign', amount: 100000, bal: 1829300, type: 'income' },
]

function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(Math.abs(n)) + 'đ' }

export default function UserWalletPage() {
  const [tab, setTab] = useState('all')
  const filtered = useMemo(() => TXNS.filter(t => tab === 'all' || t.type === tab), [tab])

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-chart-panel" style={{ padding: 24 }}>
        <div className="ud-grid-3">
          <div><div className="ud-text-xs ud-text-muted ud-font-bold" style={{ textTransform: 'uppercase', letterSpacing: '.8px' }}>Số Dư Hiện Tại</div><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: '#00C969', marginTop: 4 }}>{fmtC(BALANCE)}</div></div>
          <div><div className="ud-text-xs ud-text-muted ud-font-bold" style={{ textTransform: 'uppercase', letterSpacing: '.8px' }}>Đang Chờ</div><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: '#E07A00', marginTop: 4 }}>{fmtC(PENDING)}</div></div>
          <div><div className="ud-text-xs ud-text-muted ud-font-bold" style={{ textTransform: 'uppercase', letterSpacing: '.8px' }}>Đã Rút</div><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ud-text)', marginTop: 4 }}>{fmtC(TOTAL_WITHDRAWN)}</div></div>
        </div>
      </div>

      <div className="ud-chart-panel">
        <div className="ud-panel-header"><div className="ud-panel-title">Phương Thức Rút Tiền</div></div>
        <div className="ud-flex ud-gap-14" style={{ padding: 16 }}>
          {METHODS.map((m, i) => (
            <div key={i} className="ud-chart-panel" style={{ flex: 1, padding: 16 }}>
              <div className="ud-flex ud-items-center ud-gap-10">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: m.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ color: m.color }}><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/></svg>
                </div>
                <div><div className="ud-table-name">{m.label}</div><div className="ud-text-xs ud-text-muted">{m.sub}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ud-table-panel">
        <div className="ud-panel-header">
          <div className="ud-panel-title">Lịch Sử Giao Dịch</div>
          <div className="ud-tabs">
            {[['all', 'Tất cả'], ['income', 'Thu'], ['withdraw', 'Rút']].map(([k, l]) => (
              <button key={k} className={`ud-tab ${tab === k ? 'ud-tab-active' : ''}`} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Mã GD</th><th>Ngày</th><th>Mô Tả</th><th>Số tiền</th><th>Số dư</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="ud-table-row">
                  <td className="ud-table-stats">{t.id}</td>
                  <td className="ud-table-stats">{t.date}</td>
                  <td className="ud-table-name">{t.desc}</td>
                  <td className="ud-table-stats" style={{ color: t.amount > 0 ? '#00C969' : '#E05555' }}>{t.amount > 0 ? '+' : '-'}{fmtC(t.amount)}</td>
                  <td className="ud-table-stats">{fmtC(t.bal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
