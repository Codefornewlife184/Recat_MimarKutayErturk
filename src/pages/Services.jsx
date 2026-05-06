import React from 'react'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { getLocalizedStaticHtml } from '../utils/localizedStaticHtml.js'

export default function Services() {
  const { locale } = useLocale()
  const localizedServicesHtml = getLocalizedStaticHtml('services', locale)

  return (
    <>
    <AutoPageHeader />
    <div dangerouslySetInnerHTML={{ __html: localizedServicesHtml }} />
    </>
  )
}
