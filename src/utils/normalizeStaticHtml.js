import { localizePath } from '../i18n/config.js'

const STATIC_PAGE_NAMES = new Set([
  'about',
  'services',
  'blog',
  'contact',
  'comment',
  'projects',
  'projects2',
  'servicesafterbefore',
])

function localizeHref(href, locale) {
  if (!href) return href

  const lowerHref = href.toLowerCase()
  if (
    lowerHref.startsWith('#') ||
    lowerHref.startsWith('mailto:') ||
    lowerHref.startsWith('tel:') ||
    lowerHref.startsWith('javascript:') ||
    lowerHref.startsWith('http://') ||
    lowerHref.startsWith('https://') ||
    lowerHref.startsWith('//') ||
    lowerHref.startsWith('/assets/') ||
    lowerHref.startsWith('assets/')
  ) {
    return href
  }

  const htmlMatch = href.match(/^(?:\.\/)?([a-z0-9-]+)\.html$/i)
  if (htmlMatch && STATIC_PAGE_NAMES.has(htmlMatch[1])) {
    return localizePath(`/${htmlMatch[1]}`, locale)
  }

  if (href.startsWith('/')) {
    return localizePath(href, locale)
  }

  if (STATIC_PAGE_NAMES.has(href)) {
    return localizePath(`/${href}`, locale)
  }

  if (href.startsWith('projects/') || href.startsWith('projects2/')) {
    return localizePath(`/${href}`, locale)
  }

  return href
}

export function normalizeStaticHtmlAssetPaths(html, locale = 'tr') {
  return html
    .replace(/((?:src|href|data-background)=["'])assets\//g, '$1/assets/')
    .replace(/(url\(["']?)assets\//g, '$1/assets/')
    .replace(/href=(["'])([^"']+)\1/g, (_, quote, href) => `href=${quote}${localizeHref(href, locale)}${quote}`)
}
