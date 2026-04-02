import { useNavigate } from 'react-router-dom'
import { POSTS } from '../data/blogPosts'

export default function Blog() {
  const navigate = useNavigate()
  const latest = POSTS.slice(0, 3)

  return (
    <section className="blog-teaser" id="blog-section" aria-labelledby="blog-heading">
      <div className="section-container">
        <header className="blog-header">
          <p className="section-eyebrow">Kiến Thức Chuyên Sâu</p>
          <h2 className="section-title" id="blog-heading">Kiến Thức Traffic Mới Nhất</h2>
          <p className="section-sub">Cập nhật xu hướng &amp; chiến thuật tăng traffic hiệu quả nhất hiện nay</p>
        </header>

        <div className="blog-grid">
          {latest.map(p => (
            <article
              key={p.id}
              id={`home-blog-card-${p.id}`}
              className="blog-card blog-card-img"
              onClick={() => navigate(`/blog/${p.id}`)}
              style={{ cursor: 'pointer' }}
              aria-label={p.title}
            >
              {/* Thumbnail */}
              <div className="blog-card-thumb">
                <img src={p.image} alt={p.title} loading="lazy" className="blog-card-img-el"/>
                <div className="blog-card-thumb-overlay"/>
                <span className="blog-card-cat-pill"
                  style={{ color: p.catColor, background: `${p.catColor}22`, borderColor: `${p.catColor}55` }}>
                  {p.cat}
                </span>
              </div>

              {/* Body */}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-meta-item">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <rect x="1" y="1.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <line x1="1" y1="4.5" x2="11" y2="4.5" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    {p.date}
                  </span>
                  <span className="blog-card-meta-dot" aria-hidden="true"/>
                  <span className="blog-card-meta-item">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M6 3.5V6.5L8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {p.readTime}
                  </span>
                </div>

                <h3 className="blog-card-title">{p.title}</h3>
                <p className="blog-card-excerpt">{p.excerpt}</p>

                <div className="blog-card-footer">
                  <div className="blog-card-author">
                    <div className="blog-card-avatar"
                      style={{ background: `linear-gradient(135deg, ${p.authorColor ?? '#0056CC'}, ${p.authorColor ?? '#1A7FFF'}88)` }}>
                      {p.authorAvatar ?? p.author?.charAt(0)}
                    </div>
                    <span className="blog-card-author-name">{p.author}</span>
                  </div>
                  <span className="blog-card-read-more">
                    Đọc ngay
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M2 6.5h9M7 2l4 4.5-4 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            id="home-blog-view-all"
            className="btn btn-outline"
            onClick={() => navigate('/blog')}
          >
            Xem Tất Cả Bài Viết →
          </button>
        </div>
      </div>
    </section>
  )
}
