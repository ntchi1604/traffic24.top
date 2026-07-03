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
import DashboardPage from './buyer/pages/DashboardPage'
import UserDashboardPage from './user/pages/UserDashboardPage'

/* ── Subdomain detection ──
   Production : buyer.traffic24h.top  → buyer dashboard
   Production : user.traffic24h.top   → user dashboard
   Local dev  : buyer.localhost       → buyer dashboard
   Local dev  : user.localhost        → user dashboard
   Otherwise  : public marketing site
*/
const isBuyerSubdomain = window.location.hostname.startsWith('buyer.')
const isUserSubdomain = window.location.hostname.startsWith('user.')

export default function App() {
  /* Render buyer dashboard standalone – no Navbar / Footer */
  if (isBuyerSubdomain) {
    return (
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    )
  }

  /* Render user dashboard standalone – no Navbar / Footer */
  if (isUserSubdomain) {
    return (
      <BrowserRouter>
        <UserDashboardPage />
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
