import React from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'

export default function ServicesAfterBeforeBefore() {
  const { locale } = useLocale()
  const localizedHtml = getLocalizedStaticHtml('servicesafterbefore', locale)

  return (
    <>
    <AutoPageHeader />
    <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />
    </>
  )
}
