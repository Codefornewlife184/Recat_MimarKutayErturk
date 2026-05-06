import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export default function NewHeroSlider({ items }) {
  const slides = items || [
    {
      bg: '/assets/img/bg-img/slider-img-1.png',
      k: 'fast-reliable',
      title: 'The Art Of\nStunning Interior Design',
      stat: '260+',
      thumb: '/assets/img/images/slider-thumb-1.png'
    },
    {
      bg: '/assets/img/bg-img/slider-img-2.png',
      k: 'unique-style',
      title: 'Elegant Spaces\nTimeless Design',
      stat: '260+',
      thumb: '/assets/img/images/slider-thumb-1.png'
    }
  ]
  return (
    <section className="hero-modern">
      <Swiper
        className="hero-modern-swiper"
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
                  <span className="badge">FAST AND RELIABLE</span>
                  <h2 className="title">{s.title}</h2>
                  <p className="desc">{s.desc}</p>
                  <a href="/contact" className="tl-primary-btn white-btn">Take Counsel <span className="icon"><i className="fa-regular fa-arrow-right" /></span></a>
                </div>
                <div className="hero-modern-right">
                  <div className="glass stats">
                    <h3>{s.stat}</h3>
                    <span>Successful projects<br />and counting</span>
                    <p>Tech Specifications<br />Design Project<br />3D visualisation</p>
                  </div>
                  <div className="glass thumb">
                    <img src={s.thumb} alt="slider" />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
