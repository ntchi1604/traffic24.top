import { useState } from 'react'

const TXNS = [
  { id: 'TXN-9001', date: '01/07/2026', desc: 'Thu nhập views — thoimoda.vn', amount: 45200, type: 'income', method: '—', bal: 1250000 },
  { id: 'TXN-9002', date: '28/06/2026', desc: 'Rút tiền — Chuyển khoản NH', amount: -500000, type: 'withdraw', method: 'Vietcombank ****4821', bal: 1204800 },
  { id: 'TXN-9003', date: '25/06/2026', desc: 'Thu nhập views — techblog.vn', amount: 62400, type: 'income', method: '—', bal: 1704800 },
  { id: 'TXN-9004', date: '20/06/2026', desc: 'Referral commission', amount: 75000, type: 'referral', method: '—', bal: 1642400 },
  { id: 'TXN-9005', date: '15/06/2026', desc: 'Rút tiền — MoMo', amount: -300000, type: 'withdraw', method: 'MoMo 0912***8821', bal: 1567400 },
  { id: 'TXN-9006', date: '10/06/2026', desc: 'Thu nhập views — shopxanh.vn', amount: 38100, type: 'income', method: '—', bal: 1867400 },
  { id: 'TXN-9007', date: '05/06/2026', desc: 'Bonus campaign', amount: 100000, type: 'bonus', method: '—', bal: 1829300 },
  { id: 'TXN-9008', date: '01/06/2026', desc: 'Rút tiền — Chuyển khoản NH', amount: -800000, type: 'withdraw', method: 'Vietcombank ****4821', bal: 1729300 },
]

function fmtC(n) { return new Intl.NumberFormat('vi-VN').format(Math.abs(n)) + 'đ' }

export default function UserTransactionHistoryPage() {
  const [tab, setTab] = useState('all')
  const filtered = TXNS.filter(t => tab === 'all' || t.type === tab)

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-tabs" style={{ width: 'fit-content' }}>
        {[['all', 'Tất cả'], ['income', 'Thu nhập'], ['withdraw', 'Rút tiền'], ['referral', 'Referral']].map(([k, l]) => (
          <button key={k} className={`ud-tab ${tab === k ? 'ud-tab-active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      <div className="ud-table-panel">
        <div className="ud-panel-header">
          <div className="ud-panel-title">Lịch Sử Giao Dịch</div>
          <span className="ud-badge ud-badge-blue">{filtered.length} giao dịch</span>
        </div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Mã GD</th><th>Ngày</th><th>Mô tả</th><th>Số tiền</th><th>Phương thức</th><th>Số dư</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="ud-table-row">
                  <td className="ud-table-stats">{t.id}</td>
                  <td className="ud-table-stats">{t.date}</td>
                  <td className="ud-table-name">{t.desc}</td>
                  <td className="ud-table-stats" style={{ color: t.amount > 0 ? '#00C969' : '#E05555', fontWeight: 600 }}>{t.amount > 0 ? '+' : '−'}{fmtC(t.amount)}</td>
                  <td className="ud-text-sm ud-text-muted">{t.method}</td>
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
