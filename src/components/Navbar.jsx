import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Trang Chủ', href: '/',        anchor: null },
  { label: 'Dịch Vụ',   href: '/dich-vu', anchor: null },
  { label: 'Báo Giá',   href: '/bao-gia', anchor: null },
  { label: 'Blog',       href: '/blog',    anchor: null },
  { label: 'Liên Hệ',   href: '/',        anchor: 'footer-section' },
]

function LogoImg() {
  return (
    <img
      src="/images/traffic24h.gif"
      alt="Traffic24h Logo"
      style={{ display: 'block' }}
    />
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0 }) }, [location.pathname])

  function handleNavClick(e, href, anchor) {
    e.preventDefault()
    setMenuOpen(false)
    if (anchor) {
      if (location.pathname !== href) {
        navigate(href)
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      navigate(href)
    }
  }

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} role="banner">
      <div className="nav-container">
        {/* Logo */}
        <a href="/" className="logo" id="nav-logo"
          onClick={e => { e.preventDefault(); navigate('/') }}
          aria-label="Traffic24h – Trang chủ">
          <LogoImg />
        </a>

        {/* Nav links */}
        <nav className={`nav-menu${menuOpen ? ' nav-menu-open' : ''}`} aria-label="Navigation chính">
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`nav-link${location.pathname === item.href && !item.anchor ? ' active' : ''}`}
              onClick={e => handleNavClick(e, item.href, item.anchor)}>
              {item.label}
            </a>
          ))}
          {/* Mobile-only auth buttons inside drawer */}
          <div className="nav-mobile-auth">
            <a href="/dang-nhap" className="nav-auth-outline"
              onClick={e => { e.preventDefault(); navigate('/dang-nhap'); setMenuOpen(false) }}>
              Đăng Nhập
            </a>
            <a href="/dang-ky" className="btn btn-amber nav-cta"
              onClick={e => { e.preventDefault(); navigate('/dang-ky'); setMenuOpen(false) }}>
              Đăng Ký Ngay
            </a>
          </div>
        </nav>

        {/* Right CTAs */}
        <div className="nav-auth-btns">
          <a href="/dang-nhap" id="nav-dangnhap-btn"
            className={`nav-auth-outline${location.pathname === '/dang-nhap' ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); navigate('/dang-nhap'); setMenuOpen(false) }}>
            Đăng Nhập
          </a>
          <a href="/dang-ky" id="nav-cta-btn"
            className="btn btn-amber nav-cta"
            onClick={e => { e.preventDefault(); navigate('/dang-ky'); setMenuOpen(false) }}>
            Đăng Ký
          </a>
        </div>

        {/* Hamburger */}
        <button id="nav-menu-toggle"
          className={`nav-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
