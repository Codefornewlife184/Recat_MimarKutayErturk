import React, { useEffect } from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import Spacer from '../components/Spacer.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'
import { notifyPageMounted } from '../utils/pageMounted.js'

export default function About({ showHeader = true }) {
  const { locale } = useLocale()
  const localizedAboutHtml = getLocalizedStaticHtml('about', locale)
  const pageClassName = `about-page${locale === 'ar' ? ' about-page--ar' : ''}`

  useEffect(() => {
    notifyPageMounted()
  }, [locale])

  return (
    <div className={pageClassName}>
      {showHeader ? <AutoPageHeader /> : null}
      {showHeader ? <Spacer size="md" /> : null}
      <div dangerouslySetInnerHTML={{ __html: localizedAboutHtml }} />
    </div>
  )
}
