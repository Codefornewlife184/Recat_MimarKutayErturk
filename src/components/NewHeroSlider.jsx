import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { translateNumbers } from '../utils/numberConverter.js'

export default function NewHeroSlider({ items }) {
  const { t, localizePath, locale } = useLocale()
  const slides = items || [
    {
      bg: '/assets/img/Projeler Webp/9-Mobil Modüler Bungalov Projesi/5.webp',
      k: 'fast-reliable',
      title: t.hero.slide1Title,
      stat: translateNumbers('260+', locale),
      thumb: '/assets/img/images/slider-thumb-1.png'
    },
    {
      bg: '/assets/img/Projeler Webp/7-Alaşarköy Villa Projesi/1.webp',
      k: 'unique-style',
      title: t.hero.slide2Title,
      stat: translateNumbers('260+', locale),
      thumb: '/assets/img/images/slider-thumb-1.png'
    }
  ]
  return (
    <section className="hero-modern">
      <Swiper
        className="hero-modern-swiper"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1200}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.k || i}>
            <div className="hero-modern-slide" style={{ backgroundImage: `url("${s.bg}")` }}>
              <div className="hero-modern-overlay" />
              <div className="hero-modern-inner">
                <div className="hero-modern-left">
                  <span className="badge">{t.hero.badge}</span>
                  <h2 className="title">{s.title}</h2>
                  <p className="desc">{s.desc}</p>
                  <a href={localizePath('/contact')} className="tl-primary-btn white-btn">{t.cta.contactLong} <span className="icon"><i className="fa-regular fa-arrow-right" /></span></a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
