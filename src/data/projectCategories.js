export const projectCategories = [
  {
    slug: 'kurum-projeleri',
    label: 'Kurum Projeleri',
    labels: { tr: 'Ticari Projeler', en: 'Commercial Projects', ar: 'المشاريع التجارية' },
  },
  {
    slug: 'sosyal-tesisler',
    label: 'Sosyal Tesisler',
    labels: { tr: 'Sosyal Tesisler', en: 'Social Facilities', ar: 'المرافق الاجتماعية' },
  },
  {
    slug: 'egitim-projeleri',
    label: 'Eğitim Projeleri',
    labels: { tr: 'Eğitim Projeleri', en: 'Educational Projects', ar: 'المشاريع التعليمية' },
  },
  {
    slug: 'bungalov',
    label: 'Bungalov',
    labels: { tr: 'Bungalov', en: 'Bungalow', ar: 'بنغلو' },
  },
  {
    slug: 'renovasyon',
    label: 'Renovasyon',
    labels: { tr: 'Renovasyon', en: 'Renovation', ar: 'التجديد' },
  },
  {
    slug: 'villa',
    label: 'Villa',
    labels: { tr: 'Villa', en: 'Villa', ar: 'فيلا' },
  },
]

function normalizeText(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
}

export function getProjectCategorySlugs(title) {
  const normalizedTitle = normalizeText(title)
  const categories = []

  if (
    /universitesi|universite|egitim|kursu|anaokulu|okul/.test(normalizedTitle)
  ) {
    categories.push('egitim-projeleri')
  }

  if (
    /turizm|cocuk oyun alani|sosyal|tesis(?!at)/.test(normalizedTitle) && !/vamates|tesisat/.test(normalizedTitle)
  ) {
    categories.push('sosyal-tesisler')
  }

  if (/bungalov/.test(normalizedTitle)) {
    categories.push('bungalov')
  }

  if (
    /renovasyon|mutfak|banyo|salon/.test(normalizedTitle)
  ) {
    categories.push('renovasyon')
  }

  if (/villa/.test(normalizedTitle)) {
    categories.push('villa')
  }

  if (
    /ofis|isyeri|showroom|avm|magazasi|magazasi|cafe|firin|kebapcisi|teknolojileri|kurumsal|cephe/.test(normalizedTitle)
    && !(/bademli/.test(normalizedTitle) && /anaokulu|okul/.test(normalizedTitle))
  ) {
    categories.push('kurum-projeleri')
  }

  if (!categories.length) {
    categories.push('kurum-projeleri')
  }

  return [...new Set(categories)]
}

export function getProjectCategoryLabel(slug, locale = 'tr') {
  const category = projectCategories.find((item) => item.slug === slug)
  return category?.labels?.[locale] || category?.label || slug
}
