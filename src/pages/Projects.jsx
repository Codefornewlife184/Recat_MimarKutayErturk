import React from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { getLocalizedProjectTitle, projectPages } from '../data/projectPages.js'
import { getProjectCategoryLabel, projectCategories } from '../data/projectCategories.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { translateNumbers } from '../utils/numberConverter.js'

export default function Projects() {
  const { locale, t, localizePath } = useLocale()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const filteredProjects = activeCategory
    ? projectPages.filter((project) => project.categories.includes(activeCategory))
    : projectPages
  const sectionTitle = activeCategory ? getProjectCategoryLabel(activeCategory, locale) : t.nav.projects

  return (
    <>
      <AutoPageHeader />
      <section className="newsletter-section overflow-hidden mt-80">
        <div className="container">
          <div className="newsletter-wrap">
            <div className="section-heading text-center project-list-heading">
              <h2 className="section-title"><span>{sectionTitle}</span></h2>
              <div className="project-category-pills">
                <Link
                  to={localizePath('/projects')}
                  className={`project-category-pill${!activeCategory ? ' active' : ''}`}
                >
                  {t.nav.allProjects}
                </Link>
                {projectCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to={localizePath(`/projects?category=${category.slug}`)}
                    className={`project-category-pill${activeCategory === category.slug ? ' active' : ''}`}
                  >
                    {getProjectCategoryLabel(category.slug, locale)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="service-inner pb-130">
        <div className="container container-2">
          <div className="row gy-5">
            {filteredProjects.map((project) => (
              <div key={project.slug} className="col-lg-4 col-md-6">
                <article className="service-item-3 antra-hover-view project-service-card">
                  <div className="service-thumb">
                    <Link to={localizePath(project.route)}>
                      <img src={project.coverImage} alt={getLocalizedProjectTitle(project, locale)} />
                    </Link>
                  </div>
                  <div className="service-content">
                    <span className="project-service-meta">
                      {translateNumbers(project.imageCount, locale)} {t.projects.imageCountSuffix}
                    </span>
                    <h5 className="title">
                      <Link to={localizePath(project.route)}>{getLocalizedProjectTitle(project, locale)}</Link>
                    </h5>
                    
                  </div>
                </article>
              </div>
            ))}
            {filteredProjects.length === 0 ? (
              <div className="col-12">
                <div className="project-category-empty">
                  {t.projects.emptyCategory}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
