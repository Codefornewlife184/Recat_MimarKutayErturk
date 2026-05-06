import React, { useEffect } from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import Spacer from '../components/Spacer.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'
import Comment from './Comment.jsx'
import { notifyPageMounted } from '../utils/pageMounted.js'

export default function AboutUs({ showHeader = true }) {
  const { locale } = useLocale()
  const localizedAboutUsHtml = getLocalizedStaticHtml('aboutus', locale)
  const pageClassName = `about-page${locale === 'ar' ? ' about-page--ar' : ''}`

  useEffect(() => {
    notifyPageMounted()
  }, [locale])

  return (
    <div className={pageClassName}>
      {showHeader ? <AutoPageHeader /> : null}
      {showHeader ? <Spacer size="md" /> : null}
      <div dangerouslySetInnerHTML={{ __html: localizedAboutUsHtml }} />
      <Comment showHeader={false} />
    </div>
  )
}
