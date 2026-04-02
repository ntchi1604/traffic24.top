import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { POSTS, CATEGORIES } from '../data/blogPosts'


const PER_PAGE = 6

function PostCardIcon({ catColor }) {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="200" height="120" fill="rgba(0,26,51,0.8)" />
      <rect x="20" y="70" width="20" height="40" rx="3" fill={catColor} opacity="0.6" />
      <rect x="46" y="55" width="20" height="55" rx="3" fill={catColor} opacity="0.7" />
      <rect x="72" y="40" width="20" height="70" rx="3" fill={catColor} opacity="0.8" />
      <rect x="98" y="50" width="20" height="60" rx="3" fill={catColor} opacity="0.65" />
      <rect x="124" y="30" width="20" height="80" rx="3" fill={catColor} opacity="0.9" />
      <rect x="150" y="45" width="20" height="65" rx="3" fill={catColor} opacity="0.7" />
      <path d="M30 70 L56 55 L82 40 L108 50 L134 30 L160 45" stroke={catColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="160" cy="45" r="5" fill={catColor} />
    </svg>
  )
}

function FeaturedPostIcon() {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="400" height="240" fill="rgba(0,26,51,0.5)" />
      <defs>
        <radialGradient id="fglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0056CC" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#001A33" stopOpacity="0" />
        </radialGradient>
        <filter id="fg"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse cx="200" cy="220" rx="180" ry="40" fill="url(#fglow)" />
      {/* 3D bar chart */}
      {[
        [60, 180, 60, 80, '#FF8C00'],
        [100, 160, 60, 100, '#FFB347'],
        [140, 130, 60, 130, '#1A7FFF'],
        [180, 110, 60, 150, '#FF8C00'],
        [220, 80, 60, 180, '#1A7FFF'],
        [260, 90, 60, 170, '#FFB347'],
        [300, 65, 60, 195, '#5CFFA0'],
      ].map(([x, y, w, h, c], i) => (
        <rect key={i} x={x} y={y} width={w - 10} height={h} rx="4" fill={c} opacity="0.75" filter="url(#fg)" />
      ))}
      <path d="M65 180 L105 160 L145 130 L185 110 L225 80 L265 90 L305 65" stroke="#FFB347" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#fg)" />
      <circle cx="305" cy="65" r="7" fill="#FFB347" filter="url(#fg)">
        <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Nodes */}
      {[[340, 50, '#1A7FFF'], [360, 100, '#FF8C00'], [20, 60, '#5CFFA0'], [30, 130, '#FFB347']].map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={c} opacity="0.7" filter="url(#fg)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

export default function BlogPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [hovered, setHovered] = useState(null)

  const featured = POSTS[0]
  const rest = POSTS.slice(1)

  const filtered = useMemo(() => {
    return rest.filter(p =>
      (!activeCat || p.cat === activeCat) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
    )
  }, [activeCat, search])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="page-blog">
      <div className="ph-blur ph-blur-1" aria-hidden="true" />
      <div className="ph-blur ph-blur-2" aria-hidden="true" />

      {/* Page hero */}
      <section className="page-hero blog-page-hero" id="blog-hero">
        <div className="section-container ph-content">
          <p className="section-eyebrow">Kiến Thức &amp; Tin Tức</p>
          <h1 className="page-hero-title" id="blog-heading" style={{ fontSize: 'clamp(28px,4vw,46px)' }}>
            Blog Traffic24h
          </h1>
          <p className="page-hero-desc">Cập nhật mới nhất về SEO, traffic và tăng trưởng website</p>
        </div>
      </section>

      {/* Featured post */}
      <section className="blog-featured-section" id="featured-post" aria-label="Bài viết nổi bật">
        <div className="section-container">
          <article className="blog-featured-card" id={`blog-featured-${featured.id}`} aria-label={featured.title}
            onClick={() => navigate(`/blog/${featured.id}`)} style={{ cursor: 'pointer' }}>
            <div className="bfc-visual" aria-hidden="true">
              <img src={featured.image} alt={featured.title} className="bfc-visual-img" />
              <div className="bfc-visual-overlay" />
            </div>
            <div className="bfc-content">
              <div className="bfc-meta">
                <span className="blog-cat" style={{ color: featured.catColor, background: `${featured.catColor}22`, borderColor: `${featured.catColor}44` }}>
                  {featured.cat}
                </span>
                <span className="bfc-date">{featured.date}</span>
                <span className="bfc-read">{featured.readTime} đọc</span>
              </div>
              <h2 className="bfc-title">{featured.title}</h2>
              <p className="bfc-excerpt">{featured.excerpt}</p>
              <div className="bfc-author">
                <div className="bfc-avatar" aria-hidden="true"
                  style={{ background: `linear-gradient(135deg, ${featured.authorColor ?? '#0056CC'}, ${featured.authorColor ?? '#1A7FFF'}88)` }}>
                  {featured.authorAvatar ?? featured.author?.charAt(0)}
                </div>
                <span className="bfc-author-name">{featured.author}</span>
              </div>
              <a href={`/blog/${featured.id}`} id="featured-read-more" className="btn bfc-btn"
                onClick={e => { e.preventDefault(); navigate(`/blog/${featured.id}`) }}>
                ĐỌC TIẾP
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div className="bfc-glow" aria-hidden="true" />
          </article>
        </div>
      </section>

      {/* Main: grid + sidebar */}
      <section className="blog-main-section" id="blog-main" aria-label="Danh sách bài viết">
        <div className="section-container">
          <div className="blog-layout">

            {/* Articles grid */}
            <div className="blog-grid-area" role="feed" aria-label="Bài viết">
              {paged.length === 0 ? (
                <div className="blog-empty">Không tìm thấy bài viết phù hợp.</div>
              ) : (
                <div className="blog-cards-grid">
                  {paged.map(post => (
                    <article
                      key={post.id}
                      id={`blog-card-${post.id}`}
                      className={`blog-full-card${hovered === post.id ? ' blog-card-hover' : ''}`}
                      onMouseEnter={() => setHovered(post.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(`/blog/${post.id}`)}
                      style={{ cursor: 'pointer' }}
                      aria-label={post.title}
                    >
                      <div className="bcard-thumb" aria-hidden="true">
                        <img src={post.image} alt={post.title} loading="lazy" className="bcard-thumb-img" />
                        <div className="bcard-thumb-overlay" />
                      </div>
                      <div className="bcard-body">
                        <div className="bcard-meta">
                          <span className="blog-cat" style={{ color: post.catColor, background: `${post.catColor}22`, borderColor: `${post.catColor}44`, fontSize: 10 }}>
                            {post.cat}
                          </span>
                          <span className="bcard-date">{post.date}</span>
                        </div>
                        <h3 className="bcard-title">{post.title}</h3>
                        <p className="bcard-excerpt">{post.excerpt}</p>
                        <a href={`/blog/${post.id}`} id={`blog-readmore-${post.id}`} className="bcard-more"
                          onClick={e => { e.preventDefault(); navigate(`/blog/${post.id}`) }}>
                          Xem Thêm →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="blog-pagination" aria-label="Phân trang">
                  <button id="blog-prev-btn" className="pgn-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Trang trước">← Trước</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} id={`blog-page-${n}`} className={`pgn-btn${page === n ? ' pgn-active' : ''}`} onClick={() => setPage(n)} aria-label={`Trang ${n}`} aria-current={page === n ? 'page' : undefined}>{n}</button>
                  ))}
                  <button id="blog-next-btn" className="pgn-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Trang tiếp">Tiếp →</button>
                </nav>
              )}
            </div>

            {/* Sidebar */}
            <aside className="blog-sidebar" aria-label="Sidebar blog">
              {/* Search */}
              <div className="sidebar-panel" id="blog-search-panel">
                <h3 className="sidebar-title">Tìm Kiếm</h3>
                <div className="sidebar-search-wrap">
                  <input
                    id="blog-search-input"
                    type="search"
                    className="sidebar-search"
                    placeholder="Tìm kiếm bài viết..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    aria-label="Tìm kiếm bài viết"
                  />
                  <svg className="sidebar-search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="5.5" stroke="rgba(26,127,255,0.6)" strokeWidth="1.5" />
                    <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="rgba(26,127,255,0.6)" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="sidebar-panel" id="blog-categories-panel">
                <h3 className="sidebar-title">Danh Mục</h3>
                <ul className="sidebar-cats" role="list">
                  <li>
                    <button id="cat-all" className={`sidebar-cat-btn${!activeCat ? ' sidebar-cat-active' : ''}`} onClick={() => { setActiveCat(null); setPage(1) }} aria-pressed={!activeCat}>
                      <span className="cat-dot" style={{ background: 'rgba(255,255,255,0.4)' }} />
                      Tất Cả
                      <span className="cat-count">{rest.length}</span>
                    </button>
                  </li>
                  {CATEGORIES.map((c, i) => (
                    <li key={i}>
                      <button id={`cat-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`sidebar-cat-btn${activeCat === c.id ? ' sidebar-cat-active' : ''}`}
                        onClick={() => { setActiveCat(c.id); setPage(1) }}
                        aria-pressed={activeCat === c.id}
                      >
                        <span className="cat-dot" style={{ background: c.color }} />
                        {c.name}
                        <span className="cat-count">{c.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular posts */}
              <div className="sidebar-panel" id="blog-popular-panel">
                <h3 className="sidebar-title">Bài Viết Nổi Bật</h3>
                <ol className="sidebar-popular" role="list">
                  {POSTS.slice(0, 3).map((post, i) => (
                    <li key={post.id} id={`popular-${post.id}`} className="popular-item">
                      <span className="popular-num" style={{ color: i === 0 ? '#FF8C00' : i === 1 ? '#1A7FFF' : '#5CFFA0' }} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="popular-body">
                        <a href="#" className="popular-title" onClick={e => e.preventDefault()}>{post.title}</a>
                        <span className="popular-date">{post.date}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* CTA widget */}
              <div className="sidebar-panel sidebar-cta-panel" id="blog-cta-widget">
                <div className="sidebar-cta-glow" aria-hidden="true" />
                <h3 className="sidebar-cta-title">Bắt Đầu Tăng Traffic?</h3>
                <p className="sidebar-cta-sub">Thử miễn phí 7 ngày. Không cần thẻ tín dụng.</p>
                <a href="/bao-gia" id="blog-cta-btn" className="btn btn-amber" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={e => { e.preventDefault(); navigate('/bao-gia') }}>
                  Xem Gói Dịch Vụ
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
