import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    quote: '"Sau 3 tháng dùng Traffic24h, website thương mại điện tử của tôi tăng 215% traffic tự nhiên. Doanh thu tháng 3 tăng gần 60% so với trước!"',
    avatar: '/images/avatar1.png',
    initials: 'TV',
    gradient: 'linear-gradient(135deg, #0056CC, #1A7FFF)',
    name: 'Trần Văn An',
    role: 'Founder & CEO, ShopVN',
  },
  {
    id: 2,
    quote: '"Đội ngũ Traffic24h rất chuyên nghiệp. Báo cáo chi tiết theo tuần giúp tôi theo dõi từng chỉ số. Traffic thực 100%, Google Analytics xác nhận rõ ràng!"',
    avatar: '/images/avatar2.png',
    initials: 'NT',
    gradient: 'linear-gradient(135deg, #FF8C00, #FFB347)',
    name: 'Nguyễn Thị Bích',
    role: 'Marketing Manager, TechViet',
  },
  {
    id: 3,
    quote: '"Traffic tự nhiên của shop online tăng 300% chỉ sau 4 tháng. Traffic24h là đối tác traffic tốt nhất tôi từng làm việc — chuyên nghiệp và minh bạch!"',
    avatar: '/images/avatar3.png',
    initials: 'LM',
    gradient: 'linear-gradient(135deg, #003D99, #0056CC)',
    name: 'Lê Minh Đức',
    role: 'E-commerce Director, Lazada VN',
  },
]

export default function Testimonials() {
  const [highlighted, setHighlighted] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setHighlighted(i => (i + 1) % TESTIMONIALS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <section className="testimonials" id="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="section-container">
        <header className="testi-header">
          <p className="section-eyebrow">Khách Hàng Tin Tưởng</p>
          <h2 className="section-title" id="testimonials-heading">Đánh Giá Khách Hàng</h2>
          <p className="section-sub">Hàng trăm doanh nghiệp đã tin tưởng và đạt kết quả traffic thực tế vượt kỳ vọng</p>
        </header>
        <div className="testi-grid" role="list">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              id={`testimonial-${t.id}`}
              className={`testi-card${highlighted === i ? ' highlight' : ''}`}
              onMouseEnter={() => { setPaused(true); setHighlighted(i) }}
              onMouseLeave={() => setPaused(false)}
              role="listitem"
              aria-label={`Đánh giá của ${t.name}`}
            >
              <div className="testi-stars" aria-label="5 sao">★★★★★</div>
              <blockquote className="testi-quote">{t.quote}</blockquote>
              <div className="testi-author">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="testi-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div
                  className="testi-avatar"
                  style={{
                    background: t.gradient,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 800,
                    fontSize: 16,
                    color: 'white',
                    letterSpacing: '-0.5px',
                  }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="testi-info">
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
