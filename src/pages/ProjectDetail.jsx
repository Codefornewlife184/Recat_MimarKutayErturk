import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AutoPageHeader from '../components/AutoPageHeader.jsx'
import { getLocalizedProjectDescription, getLocalizedProjectTitle, resolveProjectBySlug } from '../data/projectPages.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import { notifyPageMounted } from '../utils/pageMounted.js'

function GalleryImage({ project, image }) {
  return (
    <div className="gallary-inner-item-2">
      <a href={image.src} className="venobox gallery-item" data-gall={project.slug}>
        <img src={image.src} alt={image.alt} />
      </a>
    </div>
  )
}

function chunkImages(images, chunkSize = 5) {
  const chunks = []

  for (let index = 0; index < images.length; index += chunkSize) {
    chunks.push(images.slice(index, index + chunkSize))
  }

  return chunks
}

export default function ProjectDetail() {
  const { locale, t } = useLocale()
  const { slug } = useParams()
  const project = resolveProjectBySlug(slug)
  const projectDescription = project ? getLocalizedProjectDescription(project, locale) : null
  const projectTitle = project ? getLocalizedProjectTitle(project, locale) : ''

  useEffect(() => {
    const refreshProjectPage = () => {
      notifyPageMounted()
      if (window.ScrollTrigger) {
        try { window.ScrollTrigger.refresh() } catch (e) {}
      }
    }

    refreshProjectPage()
    const timers = [60, 180, 400].map((delay) => setTimeout(refreshProjectPage, delay))

    const galleryImages = Array.from(document.querySelectorAll('.gallery-lightbox img'))
    const removeListeners = galleryImages.map((img) => {
      const onLoad = () => refreshProjectPage()
      if (!img.complete) {
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
        return () => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onLoad)
        }
      }
      return () => {}
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      removeListeners.forEach((remove) => remove())
    }
  }, [slug, project?.galleryImages.length])

  if (!project) {
    return (
      <>
        <AutoPageHeader />
        <section className="service-inner pt-130 pb-130">
          <div className="container container-2 text-center">
            <h3>{t.projects.notFound}</h3>
            <p>{t.projects.notFoundText}</p>
          </div>
        </section>
      </>
    )
  }

  const galleryBlocks = chunkImages(project.galleryImages, 5)

  return (
    <>
      <AutoPageHeader />
      <section className="gallery-inner project-detail-gallery bg-white pt-130 pb-130">
        <div className="container container-2">
          <div className="gallery-lightbox">
            {galleryBlocks.length > 0 ? (
              <>
                {galleryBlocks.map((block, blockIndex) => {
                  const featuredImage = block[0]
                  const gridImages = block.slice(1, 5)

                  if (!featuredImage) return null

                  return (
                    <div key={`${project.slug}-block-${blockIndex + 1}`} className="row gallary-inner-top">
                      <div className="col-lg-6 col-md-6">
                        <GalleryImage project={project} image={featuredImage} />
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="gallary-inner-items">
                          {gridImages.map((image) => (
                            <GalleryImage key={image.id} project={project} image={image} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : null}

            {project.galleryImages.length === 0 ? (
              <div className="row">
                <div className="col-12">
                  <div className="project-empty-state">
                    <h3>{projectTitle}</h3>
                    <p>{t.projects.emptyProjectText}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {projectDescription ? (
              <div className="row">
                <div className="col-12">
                  <div className="project-detail-description">
                    {projectDescription.paragraphs?.map((paragraph, index) => (
                      <p key={`${project.slug}-description-${index + 1}`}>{paragraph}</p>
                    ))}
                    {projectDescription.metaLabel && projectDescription.metaValue ? (
                      <p className="project-detail-description-meta">
                        <strong>{projectDescription.metaLabel}:</strong> {projectDescription.metaValue}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
