

const SERVICE_LINKS = [
  {
    label: 'Traffic Search',
    href: '/dich-vu',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  },
  {
    label: 'Traffic Direct',
    href: '/dich-vu',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    label: 'Traffic Social',
    href: '/dich-vu',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7l4.5-2M5.5 9l4.5 2" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
]

const CONTACT_LINKS = [
  {
    label: 'Telegram Hỗ Trợ',
    href: 'https://t.me/traffic24htop',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  }
]

const SUPPORT_LINKS = [
  {
    label: 'Câu Hỏi Thường Gặp',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6.2 6.2A1.8 1.8 0 018 5a1.8 1.8 0 010 3.6V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="8" cy="12" r=".7" fill="currentColor" /></svg>,
  },
  {
    label: 'Chính Sách Bảo Mật',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5L3 3.5v4c0 3.3 2.1 6 5 7 2.9-1 5-3.7 5-7v-4L8 1.5z" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
  {
    label: 'Điều Khoản Dịch Vụ',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  },
  {
    label: 'Hoàn Tiền',
    icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8a6 6 0 1012 0A6 6 0 002 8z" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  },
]

export default function Footer() {
  return (
    <footer className="footer" id="footer-section" aria-label="Footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#" id="footer-logo" className="logo footer-logo" aria-label="Traffic24h – Trang chủ">
            <img
              src="/images/traffic24h.gif"
              alt="Traffic24h logo"
              style={{ display: 'block' }}
            />
          </a>
          <p className="footer-tagline">Đối Tác Tin Cậy</p>
          <p className="footer-desc">
            Tăng traffic user thực cho website của bạn với chiến lược bền vững, minh bạch và hiệu quả. Được tin dùng bởi hàng nghìn doanh nghiệp Việt Nam.
          </p>
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Dịch Vụ</h4>
          {SERVICE_LINKS.map(l => (
            <a key={l.label} href={l.href} id={`footer-link-${l.label.toLowerCase().replace(/ /g, '-')}`} className="footer-link footer-link-icon">
              <span className="footer-link-ico" aria-hidden="true">{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Hỗ Trợ</h4>
          {SUPPORT_LINKS.map(l => (
            <a key={l.label} href="#" id={`footer-support-${l.label.toLowerCase().replace(/ /g, '-')}`} className="footer-link footer-link-icon">
              <span className="footer-link-ico" aria-hidden="true">{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <h4 className="footer-col-title">Liên Hệ</h4>
          {CONTACT_LINKS.map(l => (
            <a key={l.label} href={l.href} id={`footer-contact-${l.label.toLowerCase().replace(/ /g, '-')}`} className="footer-link footer-link-icon">
              <span className="footer-link-ico" aria-hidden="true">{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Traffic24h Solutions. All rights reserved.</p>
        <p className="footer-made">Designed by <a href="https://t.me/tchis_dev" target="_blank" rel="noopener noreferrer">TChis.Dev</a></p>
      </div>
    </footer>
  )
}
