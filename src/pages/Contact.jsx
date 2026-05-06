import React from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'

export default function Contact() {
  const { locale } = useLocale()
  const localizedContactHtml = getLocalizedStaticHtml('contact', locale)

  return (
    <>
    <AutoPageHeader />
    <div dangerouslySetInnerHTML={{ __html: localizedContactHtml }} />
    </>
  )
}
