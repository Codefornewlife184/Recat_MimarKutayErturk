import React from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleContext.jsx'

function toLocalizedUppercase(value, locale) {
  return typeof value === 'string' ? value.toLocaleUpperCase(locale) : value
}

export default function PageHeader({
  title = 'About us',
  bg = '/assets/img/bg-img/page-header-bg.png',
  homeText = 'Home',
  currentText = 'About Us',
  homeTo = '/',
  currentTo = '/about',
  className = ''
}) {
  const { meta } = useLocale()
  const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || '/'
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const rawBg = typeof bg === 'string' ? bg : String(bg || '')
  const bgUrl = /^https?:/i.test(rawBg)
    ? rawBg
    : rawBg.startsWith('/')
      ? rawBg
      : `${normalizedBaseUrl}${rawBg.replace(/^\.\//, '')}`
  const safeBgUrl = String(bgUrl || '').replace(/"/g, '\\"')
  const displayHomeText = toLocalizedUppercase(homeText, meta.upperCaseLocale)
  const displayCurrentText = toLocalizedUppercase(currentText, meta.upperCaseLocale)

  return (
    <section className={`page-header ${className}`.trim()}>
      <div
        className="bg-img"
        style={{ backgroundImage: `url("${safeBgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      ></div>
      <div className="overlay"></div>
      <div className="container">
        <div className="page-header-content">
          <h1 className="title">{title}</h1>
          <h4 className="sub-title">
            <Link className="home" to={homeTo}>{displayHomeText} </Link>
            <span className="icon">-</span>
            <Link className="inner-page" to={currentTo}> {displayCurrentText}</Link>
          </h4>
        </div>
      </div>
    </section>
  )
}
