import React from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'

export default function Blog() {
  const { locale } = useLocale()
  const localizedBlogHtml = getLocalizedStaticHtml('blog', locale)

  return (
    <>
    <AutoPageHeader />
    <div dangerouslySetInnerHTML={{ __html: localizedBlogHtml }} />
    </>
  )
}
