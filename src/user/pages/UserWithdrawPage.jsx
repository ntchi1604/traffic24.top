import { useState, useEffect } from 'react'

const BALANCE_VND = 61335534

const REQUESTS = [
  { id: 'WD-3001', date: '28/06', amountVnd: 12500000, amountUsdt: 500, network: 'BEP20', status: 'completed', processed: '29/06', address: '0x1a2b...3c4d' },
  { id: 'WD-3002', date: '15/06', amountVnd: 7500000, amountUsdt: 300, network: 'TRC20', status: 'completed', processed: '15/06', address: 'TJk8...9mNp' },
  { id: 'WD-3003', date: '01/06', amountVnd: 20000000, amountUsdt: 800, network: 'BEP20', status: 'completed', processed: '02/06', address: '0x5e6f...7g8h' },
  { id: 'WD-3004', date: '20/05', amountVnd: 10000000, amountUsdt: 400, network: 'TRC20', status: 'completed', processed: '21/05', address: 'TUy3...4vXz' },
]

const NETWORKS = [
  { id: 'BEP20', label: 'BNB Smart Chain (BEP20)', short: 'BSC', color: '#F3BA2F', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2L6 8l6 6 6-6-6-6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 16l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'TRC20', label: 'Tron (TRC20)', short: 'TRX', color: '#FF0013', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 6l-10 14L2 6h7l3 7 3-7h7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
]

function fmtVND(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ' }
function fmtUSDT(n) { return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) }

export default function UserWithdrawPage() {
  const [showModal, setShowModal] = useState(false)
  const [amountVnd, setAmountVnd] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('BEP20')
  const [error, setError] = useState('')
  const [usdtPrice, setUsdtPrice] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)

  // Fetch USDT/VND price from CoinGecko
  useEffect(() => {
    let cancelled = false
    const fetchPrice = async () => {
      setPriceLoading(true)
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=vnd')
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        if (!cancelled && data?.tether?.vnd) {
          setUsdtPrice(data.tether.vnd)
        }
      } catch {
        // fallback price if API fails
        if (!cancelled) setUsdtPrice(25000)
      } finally {
        if (!cancelled) setPriceLoading(false)
      }
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 60000) // refresh every 60s
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const convertedUsdt = amountVnd && usdtPrice ? Number(amountVnd) / usdtPrice : 0
  const minVnd = 50000
  const minUsdt = usdtPrice ? minVnd / usdtPrice : 2

  const handleWithdraw = () => {
    const numVnd = Number(amountVnd)
    if (!numVnd || numVnd < minVnd) { setError(`Tối thiểu: ${fmtVND(Math.round(minVnd))} (~${minUsdt} USDT)`); return }
    if (numVnd > BALANCE_VND) { setError('Vượt quá số dư khả dụng'); return }
    if (!address.trim() || address.length < 10) { setError('Địa chỉ ví không hợp lệ'); return }
    setError('')
    setShowModal(false)
    setAmountVnd('')
    setAddress('')
  }

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Balance */}
      <div className="ud-chart-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ud-text-3)', textTransform: 'uppercase', letterSpacing: '.8px' }}>Số Dư Khả Dụng</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: '#00C969', marginTop: 4 }}>{fmtVND(BALANCE_VND)}</div>
            {usdtPrice && (
              <div style={{ fontSize: 12, color: 'var(--ud-text-3)', marginTop: 2 }}>
                ~{fmtUSDT(BALANCE_VND / usdtPrice)} USDT
                <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6 }}>1 USDT ≈ {fmtVND(usdtPrice)}</span>
              </div>
            )}
          </div>
          <button className="ud-btn ud-btn-amber" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Rút Tiền
          </button>
        </div>
      </div>

      {/* History */}
      <div className="ud-table-panel">
        <div className="ud-panel-header"><div className="ud-panel-title">Lịch Sử Rút Tiền</div><span className="ud-badge ud-badge-blue">{REQUESTS.length} giao dịch</span></div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Mã</th><th>Ngày</th><th>Số tiền</th><th>Mạng lưới</th><th>Địa chỉ</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {REQUESTS.map(w => {
                const net = NETWORKS.find(n => n.id === w.network)
                return (
                  <tr key={w.id} className="ud-table-row">
                    <td className="ud-table-stats">{w.id}</td>
                    <td className="ud-table-stats">{w.date}</td>
                    <td className="ud-table-stats">
                      <div style={{ color: '#00C969', fontWeight: 600 }}>{w.amountUsdt} USDT</div>
                      <div style={{ fontSize: 11, color: 'var(--ud-text-3)' }}>{fmtVND(w.amountVnd)}</div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20,
                        background: `${net?.color}15`, color: net?.color,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: net?.color }} />
                        {w.network}
                      </span>
                    </td>
                    <td className="ud-table-stats" style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--ud-text-3)' }}>{w.address}</td>
                    <td><span className="ud-badge ud-badge-green">Hoàn Thành</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showModal && (
        <div className="ud-modal-overlay" onClick={() => { setShowModal(false); setError(''); setAmountVnd(''); setAddress('') }}>
          <div className="ud-modal ud-slide-up" onClick={e => e.stopPropagation()}>
            <div className="ud-modal-header">
              <h3 className="ud-modal-title">Rút Tiền</h3>
              <button className="ud-modal-close" onClick={() => setShowModal(false)}><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
            </div>
            <div className="ud-modal-body">
              {/* Amount in VND */}
              <div style={{ marginBottom: 18 }}>
                <label className="ud-form-label">Số tiền (VND)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="ud-input"
                    type="number"
                    placeholder="Nhập số tiền..."
                    value={amountVnd}
                    onChange={e => setAmountVnd(e.target.value)}
                    style={{ paddingRight: 50 }}
                  />
                  <span style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 13, fontWeight: 700, color: 'var(--ud-text-3)',
                  }}>VND</span>
                </div>
                <span className="ud-form-hint">Tối thiểu: {fmtVND(Math.round(minVnd))}</span>
              </div>

              {/* Converted USDT preview */}
              {amountVnd && usdtPrice && convertedUsdt > 0 && (
                <div style={{
                  padding: '12px 16px', borderRadius: 12, marginBottom: 18,
                  background: 'rgba(0,201,105,0.06)', border: '1px solid rgba(0,201,105,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--ud-text-2)' }}>Bạn sẽ nhận</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#00C969', fontFamily: "'Outfit',sans-serif" }}>
                      {fmtUSDT(convertedUsdt)} USDT
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ud-text-3)' }}>
                      1 USDT ≈ {fmtVND(usdtPrice)}
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              <div style={{ marginBottom: 18 }}>
                <label className="ud-form-label">Địa chỉ ví USDT ({network})</label>
                <input
                  className="ud-input"
                  type="text"
                  placeholder={network === 'BEP20' ? '0x...' : 'T...'}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>

              {/* Network selector */}
              <div>
                <label className="ud-form-label">Mạng lưới</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {NETWORKS.map(n => (
                    <div key={n.id}
                      onClick={() => setNetwork(n.id)}
                      style={{
                        padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                        border: network === n.id ? `1.5px solid ${n.color}` : '1px solid var(--ud-border)',
                        background: network === n.id ? `${n.color}12` : 'var(--ud-surface)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: n.color }}>{n.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: network === n.id ? n.color : 'var(--ud-text)' }}>{n.short}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ud-text-3)' }}>{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {error && <div style={{ fontSize: 12, color: '#E05555', marginTop: 10 }}>{error}</div>}
            </div>
            <div className="ud-modal-footer">
              <button className="ud-modal-cancel" onClick={() => { setShowModal(false); setError(''); setAmountVnd(''); setAddress('') }}>Hủy</button>
              <button className="ud-modal-submit" onClick={handleWithdraw}>
                {priceLoading ? 'Đang tải tỷ giá...' : 'Gửi Yêu Cầu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
