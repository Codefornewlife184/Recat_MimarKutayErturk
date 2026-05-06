import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { projectCategories, getProjectCategoryLabel } from '../data/projectCategories.js'
import { projectPages } from '../data/projectPages.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { translateNumbers } from '../utils/numberConverter.js'

export default function Categories() {
  const { locale, t, localizePath } = useLocale()

  const categoriesWithMeta = useMemo(() => {
    return projectCategories.map((category) => {
      const projectsInCategory = projectPages.filter((project) => project.categories.includes(category.slug))
      const coverProject = projectsInCategory[0] || null
      return {
        ...category,
        count: projectsInCategory.length,
        coverImage: coverProject?.coverImage || '',
      }
    })
  }, [])

  return (
    <>
      <AutoPageHeader />
      <section className="newsletter-section overflow-hidden mt-80">
        <div className="container">
          <div className="newsletter-wrap">
            <div className="section-heading text-center project-list-heading">
              <h2 className="section-title"><span>{t.pageMeta.categories}</span></h2>
            </div>
          </div>
        </div>
      </section>

      <section className="service-inner pb-130">
        <div className="container container-2">
          <div className="row gy-5">
            {categoriesWithMeta.map((category) => (
              <div key={category.slug} className="col-lg-4 col-md-6">
                <article className="service-item-3 antra-hover-view project-service-card">
                  <div className="service-thumb">
                    <Link to={localizePath(`/projects?category=${category.slug}`)}>
                      {category.coverImage ? (
                        <img src={category.coverImage} alt={getProjectCategoryLabel(category.slug, locale)} />
                      ) : (
                        <div className="category-thumb-fallback" />
                      )}
                    </Link>
                  </div>
                  <div className="service-content">
                    <span className="project-service-meta">
                      {translateNumbers(category.count, locale)} {t.categories.countSuffix}
                    </span>
                    <h5 className="title">
                      <Link to={localizePath(`/projects?category=${category.slug}`)}>
                        {getProjectCategoryLabel(category.slug, locale)}
                      </Link>
                    </h5>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
