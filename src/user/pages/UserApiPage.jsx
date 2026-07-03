import { useState } from 'react'

const KEYS = [
  { id: 1, name: 'Production', key: 'ud_live_sk_4f8a2b1c3d5e6f7a8b9c0d1e', created: '15/03/2026', lastUsed: '02/07/2026', status: 'active' },
  { id: 2, name: 'Development', key: 'ud_test_sk_a1b2c3d4e5f6a7b8c9d0e1f2', created: '10/06/2026', lastUsed: '01/07/2026', status: 'active' },
]

const ENDPOINTS = [
  { method: 'GET', path: '/api/v1/links', desc: 'Lấy danh sách tất cả liên kết' },
  { method: 'GET', path: '/api/v1/links/:id', desc: 'Lấy chi tiết một liên kết' },
  { method: 'POST', path: '/api/v1/links', desc: 'Tạo liên kết mới' },
  { method: 'DELETE', path: '/api/v1/links/:id', desc: 'Xóa liên kết' },
  { method: 'GET', path: '/api/v1/stats', desc: 'Lấy thống kê tổng hợp' },
  { method: 'GET', path: '/api/v1/stats/:linkId', desc: 'Lấy thống kê theo link' },
  { method: 'GET', path: '/api/v1/earnings', desc: 'Lấy lịch sử thu nhập' },
  { method: 'POST', path: '/api/v1/withdraw', desc: 'Gửi yêu cầu rút tiền' },
]

const METHOD_COLORS = { GET: '#00C969', POST: '#1A7FFF', DELETE: '#E05555' }

function maskKey(k) { return k.slice(0, 12) + '••••••••' + k.slice(-4) }

export default function UserApiPage() {
  const [showKey, setShowKey] = useState(null)
  const [copied, setCopied] = useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="ud-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="ud-chart-panel" style={{ padding: 24 }}>
        <div className="ud-panel-title" style={{ marginBottom: 6 }}>API Keys</div>
        <div className="ud-text-sm ud-text-muted" style={{ marginBottom: 16 }}>Sử dụng API key để truy cập dữ liệu từ ứng dụng của bạn.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {KEYS.map(k => (
            <div key={k.id} className="ud-chart-panel" style={{ padding: 14 }}>
              <div className="ud-flex ud-items-center ud-justify-between" style={{ marginBottom: 8 }}>
                <div className="ud-flex ud-items-center ud-gap-8">
                  <span className="ud-badge ud-badge-green">Hoạt Động</span>
                  <span className="ud-text-sm ud-font-bold">{k.name}</span>
                </div>
                <div className="ud-text-xs ud-text-muted">Tạo: {k.created} · Cuối: {k.lastUsed}</div>
              </div>
              <div className="ud-flex ud-items-center ud-gap-8">
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--ud-input-bg)', border: '1px solid var(--ud-border)', fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontSize: 12, color: showKey === k.id ? '#1A7FFF' : 'var(--ud-text-2)' }}>
                  {showKey === k.id ? k.key : maskKey(k.key)}
                </div>
                <button className="ud-copy-btn" onClick={() => handleCopy(k.key, k.id)}>{copied === k.id ? '✓' : 'Copy'}</button>
                <button className="ud-btn ud-btn-ghost ud-btn-sm" onClick={() => setShowKey(showKey === k.id ? null : k.id)}>{showKey === k.id ? 'Ẩn' : 'Hiện'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ud-table-panel">
        <div className="ud-panel-header">
          <div className="ud-panel-title">API Endpoints</div>
          <span className="ud-badge ud-badge-blue">{ENDPOINTS.length} endpoints</span>
        </div>
        <div className="ud-table-wrap">
          <table className="ud-table">
            <thead><tr><th>Method</th><th>Path</th><th>Mô tả</th></tr></thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} className="ud-table-row">
                  <td><span className="ud-badge" style={{ background: METHOD_COLORS[ep.method] + '18', color: METHOD_COLORS[ep.method], border: `1px solid ${METHOD_COLORS[ep.method]}30`, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontWeight: 700, fontSize: 10 }}>{ep.method}</span></td>
                  <td style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#1A7FFF' }}>{ep.path}</td>
                  <td className="ud-text-sm ud-text-muted">{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ud-chart-panel" style={{ padding: 20 }}>
        <div className="ud-panel-title" style={{ marginBottom: 12 }}>Ví Dụ Sử Dụng</div>
        <pre style={{ padding: 16, borderRadius: 12, background: 'var(--ud-input-bg)', border: '1px solid var(--ud-border)', fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", fontSize: 12, lineHeight: 1.6, color: 'var(--ud-text)', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
{`curl -X GET https://api.traffic24h.top/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
        </pre>
      </div>
    </div>
  )
}
