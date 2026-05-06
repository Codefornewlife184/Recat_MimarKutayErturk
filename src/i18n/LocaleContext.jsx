import React, { createContext, useContext, useMemo } from 'react'
import { DEFAULT_LOCALE, getLocaleMeta, isSupportedLocale, localizePath } from './config.js'
import { uiStrings } from './uiStrings.js'

const LocaleContext = createContext({
  locale: DEFAULT_LOCALE,
  dir: 'ltr',
  meta: getLocaleMeta(DEFAULT_LOCALE),
  t: uiStrings[DEFAULT_LOCALE],
  localizePath: (pathname, targetLocale) => localizePath(pathname, targetLocale || DEFAULT_LOCALE),
})

export function LocaleProvider({ locale, children }) {
  const activeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
  const value = useMemo(() => {
    const meta = getLocaleMeta(activeLocale)
    return {
      locale: activeLocale,
      dir: meta.dir,
      meta,
      t: uiStrings[activeLocale] || uiStrings[DEFAULT_LOCALE],
      localizePath: (pathname, targetLocale) => localizePath(pathname, targetLocale || activeLocale),
    }
  }, [activeLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

