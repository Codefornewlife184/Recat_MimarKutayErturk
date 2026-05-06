export const SUPPORTED_LOCALES = ['tr', 'en', 'ar']
export const DEFAULT_LOCALE = 'tr'

export const LOCALE_META = {
  tr: {
    code: 'tr',
    label: 'TR',
    languageName: 'Turkce',
    htmlLang: 'tr',
    dir: 'ltr',
    lowerCaseLocale: 'tr-TR',
    upperCaseLocale: 'tr-TR',
  },
  en: {
    code: 'en',
    label: 'EN',
    languageName: 'English',
    htmlLang: 'en',
    dir: 'ltr',
    lowerCaseLocale: 'en-US',
    upperCaseLocale: 'en-US',
  },
  ar: {
    code: 'ar',
    label: 'AR',
    languageName: 'العربية',
    htmlLang: 'ar',
    dir: 'rtl',
    lowerCaseLocale: 'ar',
    upperCaseLocale: 'ar',
  },
}

const INTERNAL_PATH_PREFIX = new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(?=/|$)`, 'i')

export function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale)
}

export function getLocaleMeta(locale = DEFAULT_LOCALE) {
  return LOCALE_META[locale] || LOCALE_META[DEFAULT_LOCALE]
}

export function stripLocaleFromPath(pathname = '/') {
  const stripped = pathname.replace(INTERNAL_PATH_PREFIX, '')
  return stripped || '/'
}

export function localizePath(pathname = '/', locale = DEFAULT_LOCALE) {
  const safeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
  const [pathWithQuery = '/', hash = ''] = pathname.split('#')
  const [pathOnly = '/', query = ''] = pathWithQuery.split('?')
  const normalizedPath = stripLocaleFromPath(pathOnly || '/')
  const localizedPath = normalizedPath === '/' ? `/${safeLocale}` : `/${safeLocale}${normalizedPath}`
  const querySuffix = query ? `?${query}` : ''
  const hashSuffix = hash ? `#${hash}` : ''
  return `${localizedPath}${querySuffix}${hashSuffix}`
}

export function getLocaleFromPath(pathname = '/') {
  const match = pathname.match(INTERNAL_PATH_PREFIX)
  const locale = match?.[1]?.toLowerCase()
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
}

