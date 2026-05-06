import React, { useEffect } from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import Spacer from '../components/Spacer.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'
import { notifyPageMounted } from '../utils/pageMounted.js'

export default function Comment({ showHeader = true }) {
  const { locale } = useLocale()
  const localizedCommentHtml = getLocalizedStaticHtml('comment', locale)
  const pageClassName = `comment-page${locale === 'ar' ? ' comment-page--ar' : ''}`

  useEffect(() => {
    notifyPageMounted()
  }, [locale])

  return (
    <div className={pageClassName}>
      {showHeader ? <AutoPageHeader /> : null}
      {showHeader ? <Spacer size="md" /> : null}
      <div dangerouslySetInnerHTML={{ __html: localizedCommentHtml }} />
    </div>
  )
}
