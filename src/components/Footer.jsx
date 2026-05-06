import React from 'react'
import { Link } from 'react-router-dom'
import { getProjectCategoryLabel, projectCategories } from '../data/projectCategories.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { translateNumbers } from '../utils/numberConverter.js'

export default function Footer() {
  const { locale, t, localizePath } = useLocale()

  const scrollToTop = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    const scrollTargets = [
      document.scrollingElement,
      document.documentElement,
      document.body,
      document.getElementById('antra-smooth-content'),
      document.getElementById('antra-smooth-wrapper'),
    ].filter(Boolean)

    try {
      const smoother = window.ScrollSmoother && window.ScrollSmoother.get && window.ScrollSmoother.get()
      if (smoother && typeof smoother.scrollTo === 'function') {
        smoother.scrollTo(0, true)
      }
    } catch (error) {}

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      window.scrollTo(0, 0)
    }

    scrollTargets.forEach((target) => {
      try {
        target.scrollTop = 0
      } catch (error) {}
      try {
        if (typeof target.scrollTo === 'function') {
          target.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error) {
        try {
          if (typeof target.scrollTo === 'function') target.scrollTo(0, 0)
        } catch (innerError) {}
      }
    })

    requestAnimationFrame(() => {
      try { window.scrollTo(0, 0) } catch (error) {}
      scrollTargets.forEach((target) => {
        try { target.scrollTop = 0 } catch (error) {}
      })
    })

    setTimeout(() => {
      try { window.scrollTo(0, 0) } catch (error) {}
      scrollTargets.forEach((target) => {
        try { target.scrollTop = 0 } catch (error) {}
      })
    }, 180)
  }

  return (
    
    <>
    <footer className="footer-section overflow-hidden">
      <div className="footer-bg" data-background="/assets/img/bg-img/banner-process-1.png"></div>
      <div className="footer-shade"></div>
      <div className="container container-2">
        <div className="row footer-wrap">
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget">
              <div className="widget-header">
                <div className="footer-logo">
                  <Link to={localizePath('/')}><img src="/assets/img/logo/logo-mke-beyaz.png" alt="logo" /></Link>
                </div>
              </div>
              <p className="mb-10">{t.footer.slogan}</p>
              <p className="mb-0">
                {String(t.footer.address || '')
                  .split(/<br\s*\/?>|\n/gi)
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .map((part, idx, arr) => (
                    <React.Fragment key={`${idx}-${part}`}>
                      {translateNumbers(part, locale)}
                      {idx < arr.length - 1 ? <br /> : null}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget footer-col-2">
              <h5 style={{color: '#caa05c'}}>{t.nav.projects}</h5><br/>
              <ul className="footer-list">
                <li><Link to={localizePath('/')}>{t.nav.home}</Link></li>
                <li><Link to={localizePath('/aboutus')}>{t.nav.about}</Link></li>
                <li><Link to={localizePath('/services')}>{t.nav.projects}</Link></li>
                <li><Link to={localizePath('/contact')}>{t.nav.contact}</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget footer-col-2 pl-0">
              <h5 style={{color: '#caa05c'}}>{locale === 'ar' ? 'الفئات' : locale === 'en' ? 'Categories' : 'Kategoriler'}</h5><br/>
              <ul className="footer-list">
                {projectCategories.map((category) => (
                  <li key={category.slug}>
                    <Link to={localizePath(`/projects?category=${category.slug}`)}>{getProjectCategoryLabel(category.slug, locale)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget">
              <div className="footer-address">
              <h5 style={{color: '#caa05c'}}>{t.nav.contact}</h5><br/>
                <a className="number" href="tel:+(0555) 557-2208">{translateNumbers('(0555) 557-2208', locale)}</a>
                <a className="mail" href="mailto:info@mimarkutayerturk.com">
                  {locale === 'ar' ? 'البريد الإلكتروني: info@mimarkutayerturk.com' : 'info@mimarkutayerturk.com'}
                </a>
                <a className="mail" href="https://www.instagram.com/p/DSkKq1vDaNB/" target="_blank" rel="noreferrer"><span className="fa-brands fa-instagram"></span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area" style={{marginBottom: "-40px"}}>
        
        <div className="container">
          <div className="copyright-content">
            <p>©{translateNumbers('2026', locale)} Mimar Kutay Ertürk</p>
            <p>{t.footer.rights}</p>
            <p>
              {t.footer.webDesign}&nbsp;
              <a
                href="https://webcenter.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                title="Web Center"
                style={{ color: "#10adad", fontWeight: 700 }}
              >
                Web Center
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
    <button
      id="scroll-percentage"
      type="button"
      aria-label={locale === 'ar' ? 'العودة إلى أعلى الصفحة' : locale === 'en' ? 'Back to top' : 'Sayfanın başına dön'}
      onClick={scrollToTop}
      onTouchEnd={scrollToTop}
    >
      <span id="scroll-percentage-value"></span>
    </button>
    <a id="whatsapp-fab" href="https://wa.me/905555572208" aria-label="WhatsApp" target="_blank" rel="noreferrer">
      <i className="fa-brands fa-whatsapp"></i>
    </a>
    </>
  )
}
