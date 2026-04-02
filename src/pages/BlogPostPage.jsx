import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById, getRelatedPosts } from '../data/blogPosts'

/* ── Icon helpers ── */
const IcoShare = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="3"  cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="5" y1="7" x2="11" y2="4"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="5" y1="9" x2="11" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const IcoArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcoBack = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IcoClk = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)
const IcoCal = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="4.5" y1="1" x2="4.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="9.5" y1="1" x2="9.5" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

/* ── Social share buttons ── */
const SOCIALS = [
  { id: 'fb',  label: 'Facebook', color: '#1877F2',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
  { id: 'tw',  label: 'Twitter / X', color: '#1DA1F2',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg> },
  { id: 'li',  label: 'LinkedIn', color: '#0A66C2',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  { id: 'tg',  label: 'Telegram', color: '#26A5E4',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg> },
]

/* ── Content renderer ── */
function ContentBlock({ block }) {
  if (block.type === 'h2') return (
    <h2 id={block.id} className="bpp-h2">{block.text}</h2>
  )
  if (block.type === 'blockquote') return (
    <blockquote className="bpp-blockquote">
      <span className="bpp-bq-bar" aria-hidden="true"/>
      <p>{block.text}</p>
    </blockquote>
  )
  return <p className="bpp-para">{block.text}</p>
}

/* ── Related card ── */
function RelatedCard({ post, onClick }) {
  return (
    <article className="bpp-related-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={post.title}>
      <div className="bpp-rel-thumb">
        <img src={post.image} alt={post.title} loading="lazy"/>
        <div className="bpp-rel-thumb-overlay"/>
      </div>
      <div className="bpp-rel-body">
        <span className="bpp-rel-cat" style={{ color: post.catColor, background: `${post.catColor}22` }}>
          {post.cat}
        </span>
        <h3 className="bpp-rel-title">{post.title}</h3>
        <div className="bpp-rel-meta">
          <IcoCal/> {post.date} &nbsp;·&nbsp; <IcoClk/> {post.readTime}
        </div>
        <span className="bpp-rel-more">Đọc Ngay <IcoArrow/></span>
      </div>
    </article>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════ */
export default function BlogPostPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const post         = getPostById(id)
  const related      = post ? getRelatedPosts(post.relatedIds) : []

  const [activeToc,  setActiveToc]  = useState(post?.toc?.[0]?.id ?? '')
  const [copied,     setCopied]     = useState(false)
  const [readPct,    setReadPct]    = useState(0)
  const contentRef = useRef(null)

  /* scroll spy */
  useEffect(() => {
    window.scrollTo({ top: 0 })
    const onScroll = () => {
      /* reading progress */
      const el   = contentRef.current
      if (el) {
        const { top, height } = el.getBoundingClientRect()
        const pct = Math.max(0, Math.min(100, Math.round((-top / (height - window.innerHeight)) * 100)))
        setReadPct(pct)
      }
      /* toc highlight */
      if (!post) return
      const ids = post.toc.map(t => t.id)
      let active = ids[0]
      for (const tId of ids) {
        const el2 = document.getElementById(tId)
        if (el2 && el2.getBoundingClientRect().top < 140) active = tId
      }
      setActiveToc(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [post])

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!post) return (
    <div className="bpp-notfound">
      <h1>Bài viết không tìm thấy</h1>
      <button className="btn btn-amber" onClick={() => navigate('/blog')}>Quay Lại Blog</button>
    </div>
  )

  return (
    <div className="bpp-root">
      {/* reading progress bar */}
      <div className="bpp-progress-bar" style={{ width: `${readPct}%` }} aria-hidden="true"/>

      {/* ── HERO ── */}
      <section className="bpp-hero" id="bpp-top" aria-labelledby="bpp-title">
        <div className="bpp-hero-bg">
          <img src={post.image} alt="" aria-hidden="true" className="bpp-hero-img-bg"/>
          <div className="bpp-hero-overlay"/>
        </div>

        <div className="section-container bpp-hero-inner">
          {/* back button */}
          <button className="bpp-back-btn" onClick={() => navigate('/blog')} aria-label="Quay lại Blog">
            <IcoBack/> Blog
          </button>

          <span className="bpp-cat-pill" style={{ color: post.catColor, background: `${post.catColor}22`, borderColor: `${post.catColor}55` }}>
            {post.cat}
          </span>

          <h1 className="bpp-title" id="bpp-title">{post.title}</h1>

          <div className="bpp-hero-meta">
            <div className="bpp-author-chip">
              <div className="bpp-avatar" style={{ background: `linear-gradient(135deg, ${post.authorColor}, ${post.authorColor}88)` }}>
                {post.authorAvatar}
              </div>
              <span className="bpp-author-name">{post.author}</span>
            </div>
            <span className="bpp-meta-sep" aria-hidden="true"/>
            <span className="bpp-meta-item"><IcoCal/>{post.date}</span>
            <span className="bpp-meta-sep" aria-hidden="true"/>
            <span className="bpp-meta-item"><IcoClk/>{post.readTime} đọc</span>
          </div>
        </div>
      </section>

      {/* ── BODY LAYOUT ── */}
      <div className="section-container bpp-layout">

        {/* ── SIDEBAR ── */}
        <aside className="bpp-sidebar" aria-label="Sidebar bài viết">
          {/* TOC */}
          <div className="bpp-sidebar-panel" id="bpp-toc">
            <div className="bpp-sidebar-title">Mục Lục</div>
            <nav aria-label="Mục lục bài viết">
              {post.toc.map(t => (
                <a key={t.id}
                  href={`#${t.id}`}
                  className={`bpp-toc-link${activeToc === t.id ? ' bpp-toc-active' : ''}`}
                  onClick={e => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  <span className="bpp-toc-dot" aria-hidden="true"/>
                  {t.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Share */}
          <div className="bpp-sidebar-panel" id="bpp-share">
            <div className="bpp-sidebar-title"><IcoShare/> Chia Sẻ</div>
            <div className="bpp-share-grid">
              {SOCIALS.map(s => (
                <button key={s.id} id={`share-${s.id}`}
                  className="bpp-share-btn"
                  style={{ '--share-color': s.color }}
                  aria-label={`Chia sẻ qua ${s.label}`}
                  title={s.label}
                  onClick={() => {}}>
                  {s.icon}
                </button>
              ))}
            </div>
            <button className="bpp-copy-btn" onClick={handleCopy} aria-label="Copy link bài viết">
              {copied ? '✓ Đã Sao Chép!' : 'Sao Chép Link'}
            </button>
          </div>

          {/* CTA */}
          <div className="bpp-sidebar-cta">
            <div className="bpp-sidebar-cta-glow" aria-hidden="true"/>
            <p className="bpp-sidebar-cta-title">Tăng Traffic Ngay?</p>
            <p className="bpp-sidebar-cta-sub">Thử miễn phí 7 ngày</p>
            <button className="btn btn-amber" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
              onClick={() => navigate('/bao-gia')}>
              Xem Gói Dịch Vụ
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="bpp-content" ref={contentRef} aria-label="Nội dung bài viết">
          <div className="bpp-content-panel">
            {post.content.map((block, i) => (
              <ContentBlock key={i} block={block}/>
            ))}

            {/* Tags */}
            <div className="bpp-tags" aria-label="Tags bài viết">
              {post.tags.map(tag => (
                <span key={tag} className="bpp-tag">#{tag}</span>
              ))}
            </div>

            {/* Author Box */}
            <div className="bpp-author-box" aria-label="Thông tin tác giả">
              <div className="bpp-author-box-glow" aria-hidden="true"/>
              <div className="bpp-author-avatar-lg"
                style={{ background: `linear-gradient(135deg, ${post.authorColor}, ${post.authorColor}88)` }}>
                {post.authorAvatar}
              </div>
              <div className="bpp-author-info">
                <p className="bpp-author-label">Tác giả</p>
                <h3 className="bpp-author-name-lg">{post.author}</h3>
                <p className="bpp-author-bio">{post.authorBio}</p>
              </div>
              <button className="bpp-follow-btn" aria-label={`Theo dõi ${post.author}`}>
                Theo Dõi
              </button>
            </div>
          </div>

          {/* ── Prev/Next hint ── */}
          <div className="bpp-nav-strip">
            <button className="bpp-nav-btn" onClick={() => navigate('/blog')}>
              <IcoBack/> Tất Cả Bài Viết
            </button>
            <button className="bpp-nav-btn bpp-nav-btn-right"
              onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
              <IcoShare/> {copied ? 'Đã sao chép!' : 'Chia Sẻ Bài Viết'}
            </button>
          </div>
        </main>
      </div>

      {/* ── RELATED POSTS ── */}
      {related.length > 0 && (
        <section className="bpp-related" id="bpp-related" aria-labelledby="bpp-related-heading">
          <div className="section-container">
            <header className="bpp-related-header">
              <p className="section-eyebrow">Đọc Thêm</p>
              <h2 className="section-title" id="bpp-related-heading">Bài Viết Liên Quan</h2>
            </header>
            <div className="bpp-related-grid">
              {related.map(rp => (
                <RelatedCard key={rp.id} post={rp}
                  onClick={() => { navigate(`/blog/${rp.id}`); window.scrollTo({ top: 0 }) }}/>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
