import React from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from './PageHeader.jsx'
import { getLocalizedProjectTitle, resolveProjectBySlug } from '../data/projectPages.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { stripLocaleFromPath } from '../i18n/config.js'

export default function AutoPageHeader() {
  const { t, localizePath, locale } = useLocale()
  const { pathname } = useLocation()
  const normalizedPathname = stripLocaleFromPath(pathname)
  const detailMatch = normalizedPathname.match(/^\/projects\/([^/]+)$/)
  const project = detailMatch ? resolveProjectBySlug(detailMatch[1]) : null
  const projectTitle = project ? getLocalizedProjectTitle(project, locale) : ''
  const metaMap = {
    '/': { title: t.pageMeta.home, currentText: t.pageMeta.home, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/') },
    '/about': { title: t.pageMeta.about, currentText: t.pageMeta.about, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/about') },
    '/aboutus': { title: t.pageMeta.about, currentText: t.pageMeta.about, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/aboutus') },
    '/services': { title: t.pageMeta.projects, currentText: t.pageMeta.projects, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/services') },
    '/blog': { title: t.pageMeta.blog, currentText: t.pageMeta.blog, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/blog') },
    '/contact': { title: t.pageMeta.contact, currentText: t.pageMeta.contact, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/contact') },
    '/categories': { title: t.pageMeta.categories, currentText: t.pageMeta.categories, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/categories') },
    '/projects': { title: t.pageMeta.projects, currentText: t.pageMeta.projects, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/projects') },
    '/servicesafterbefore': { title: t.pageMeta.beforeAfter, currentText: t.pageMeta.beforeAfter, bg: 'assets/img/bg-img/breadcrumb-df.jpg', currentTo: localizePath('/servicesafterbefore') },
  }
  const m = project
    ? {
        title: projectTitle,
        currentText: projectTitle,
        bg: project.coverImage || 'assets/img/bg-img/breadcrumb-df.jpg',
        currentTo: localizePath(project.route),
      }
    : (metaMap[normalizedPathname] || metaMap['/'])
  return (
    <PageHeader
      title={m.title}
      bg={m.bg}
      homeText={t.pageMeta.home}
      currentText={m.currentText}
      homeTo={localizePath('/')}
      currentTo={m.currentTo}
      className={project ? 'project-detail-header' : ''}
    />
  )
}
