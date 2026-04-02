import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DichVuPage from './pages/DichVuPage'
import BaoGiaPage from './pages/BaoGiaPage'
import DangKyPage from './pages/DangKyPage'
import DangNhapPage from './pages/DangNhapPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import DashboardPage from './pages/DashboardPage'

/* ── Subdomain detection ──
   Production : buyer.traffic24h.top  → dashboard
   Local dev  : buyer.localhost       → dashboard (add to hosts file if needed)
   Otherwise  : public marketing site
*/
const isBuyerSubdomain = window.location.hostname.startsWith('buyer.')

export default function App() {
  /* Render dashboard standalone – no Navbar / Footer */
  if (isBuyerSubdomain) {
    return (
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )
  }

  /* Public marketing site */
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dich-vu" element={<DichVuPage />} />
          <Route path="/bao-gia" element={<BaoGiaPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/dang-ky" element={<DangKyPage />} />
          <Route path="/dang-nhap" element={<DangNhapPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
