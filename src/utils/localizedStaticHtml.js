import { normalizeStaticHtmlAssetPaths } from './normalizeStaticHtml.js'
import { translateStaticHtml } from '../i18n/staticHtmlTranslations.js'

const staticHtmlModules = import.meta.glob('/src/static/*.html', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function getLocalizedStaticHtml(pageKey, locale = 'tr') {
  const localizedPath = `/src/static/${pageKey}.${locale}.html`
  const fallbackPath = `/src/static/${pageKey}.html`
  const html = staticHtmlModules[localizedPath] || staticHtmlModules[fallbackPath] || ''
  const translatedHtml = translateStaticHtml(pageKey, html, locale)
  return normalizeStaticHtmlAssetPaths(translatedHtml, locale)
}
