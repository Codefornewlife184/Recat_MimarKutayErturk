import { getProjectCategorySlugs } from './projectCategories.js'
import { localizedProjectDescriptions, localizedProjectTitles } from './projectDescriptionTranslations.js'
import { translateNumbers } from '../utils/numberConverter.js'

const projectImageModules = import.meta.glob(
  '/assets/img/Projeler Webp/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

const folderPrefix = '/assets/img/Projeler Webp/'
const naturalSort = new Intl.Collator('tr-TR', { numeric: true, sensitivity: 'base' })
const projectSlugAliases = {
  'cs-iznik': 'iznik-turizm-tesis-alani-bungalov-koy-projesi',
}
const projectDescriptions = {
  'bademli-anaokulu-cephe-ve-ofis-projesi': {
    paragraphs: [
      "Eğitimhaneler, iş yeri renovasyon konusunda farklı bir yerdedir. Renklerin ahengi, yapının işlevselliği ve ürünün çekiciliği aynı anda öne çıkmalıdır. Ama en önemlisi ise hitap edilen kitlenin çocuklar olması sebebiyle, bu çekiciliğin son derece güvenilir de olması gerekmektedir. Bu yüzden, Özel Bademli Anaokulu'nun dış cephe ve ofis projesinde bu dinamikler üzerinde hassasiyetle durduk.",
    ],
    metaLabel: 'Dizayn',
    metaValue: '2024',
  },
  'nisantasi-mutfak-renovasyon-projesi': {
    paragraphs: [
      "Detayların ve girift düzenin öne çıktığı projeler, ölçüleri santim santim hesapladığımız bir geometrik oyun gibidir. Bu oyunda amaç ise; tüm elemanları rasyonel şekilde konumlandırınca, ortada mümkün olan en büyük boş alanın kalmasıdır. İstanbul'da sayın ÖA için yenilediğimiz mutfak projemiz, sahibi tarafından oldukça beğeni aldı. Güzel günlerde kullanması dileğiyle.",
    ],
    metaLabel: 'Dizayn',
    metaValue: '2026',
  },
  'burgaz-konut-renovasyon-projesi': {
    paragraphs: [
      'Mimari dünyada bir yapıyı sıfırdan inşa etmenin yanı sıra, eski bir yapıyı yenilemenin ve ortaya çıkan değişimi gözlemlemenin tadı gerçekten bir başka. Daha önce de sizlerle buradan “render”larını paylaşmış olduğumuz Burgaz Ev Projesinin renovasyon öncesi ve sonrası görsellerini paylaşmaktan mutluluk duyuyoruz.',
    ],
  },
  'hacibey-kebapcisi-cephe-ve-bahce-projesi': {
    paragraphs: [
      'Köklü bir tarihi ve hikayesi olan yapılara dokunmak her zaman için üst düzey bir itina gerektirir. Ama gereken hassasiyeti gösterdiğiniz zaman sonuçlar da çok tatmin edici oluyor.',
      'Böyle bir itina ile 2025 yılında Bursamızın kendisi gibi bir tarih sahibi olan çarşısı Kayıhan’da tarihi bir lokantaya dokunduk.',
      'Hacıbey Pideli Köfte lokantasının çehresini ve dış görünümünü yeniledik. Kesinlikle tarihi dokusuna tüm saygımızla yaklaştığımız bir çalışma oldu. Özellikle böyle otantik mekanlarda “modernleşme” ve “inovasyon” kavramlarına çok dikkatli yaklaşmak gerekir. Çünkü köktencilik her zaman mazinin dokusuna zarar verir.',
      'Bizim için bu dikkatin sonucu burada “muhafazakar bir renovasyon” oldu.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2025',
  },
  'kutahya-yoncali-tesis-alani-bungalov-koy-projesi': {
    paragraphs: [
      'Evet insanlar doğaya kaçmak isterler, ama bazen yalnızlığa değil de kalabalığa…',
      'Gruplar halinde veya bir komünitenin içinde tabiatla iç içe olma imkanı geçmişten beri cezbediyor insanları zaten.',
      'Bu minvalde Kütahya Yoncalı’da 2020 yılında teslim ettiğimiz proje de adı üstünde bir turizm tesis alanıydı. Toplam 8 bin metrekare alan üzerine kurulu bu modern köy içeriğinde; 45 metrekareden 90 metrekareye kadar bungalov evler, lobi ve lokaller, oyun alanları, restaurant ve yönetim ofisleri gibi bir çok fasilite bulunmaktaydı. Tam anlamıyla doğal ve modern bir köy niteliğinde olan bu projemiz; sayın C.S nin en beğenilen yatırımı olarak yerini almıştı.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2020',
  },
  'alasarkoy-villa-projesi': {
    paragraphs: [
      'Doğaya dönüş pratiklik ve kolaylık getirir mi?',
      'Genelde insanların oturum alanı tercihlerinde en etkili ve caydırıcı nüans bu oluyor. Çünkü villa veya müstakil konaklama beraberinde zorluklar ve ekstra efor mecburiyeti doğuruyor. Ama doğru bir dizayn ve mimari hesaplama bu gerçeği site yaşamından daha avantajlı ve pratik hale getirebilir.',
      '2022 yılında Bursa Alaşarköy’de sayın M.Ç için dizayn ettiğimiz hane projesi bunun yaşayan bir örneği oldu.',
      '1100 metrekare bahçe alanı içinde 250 metrekarelik taban alanına oturtulan düz ayak villamız her noktaya ulaşım ve yaşam kolaylığı açısından sitedeki bir daireden hiç de aşağı kalmıyor. Yine tabiatın kalbinde, pratik bir lüks simgesi haline gelen villamız gerek iç dizayn gerek açık alanda oldukça şık ve ferah bir atmosfere sahip oldu.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2022',
  },
  'kayapa-abay-s-cafe-projesi': {
    paragraphs: [
      'Bizim kültürümüzde kahvehane tarihi oldukça uzun bir maziye dayanıyor ve çeşitlilik açısından da her geçen gün engin bir yelpazeye yayılıyor. Geçmişin han, muhallebici ve pastaneleri içerik açısından da gelişerek günümüzde modern cafeler haline geldiler. Bu modernite dünyasında bazen otantik ve oryantalist çizgiler seçilirken bazen de ferah ve çağdaş desenler uygulanır. İşte 2022 yılında Bursa Kayapa’da dizayn ettiğimiz Abay’s Cafe projemiz de böyle modern, ferah ve naturel çağrışımlar içeren bir ambiyansa sahip.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2022',
  },
  'mobil-moduler-bungalov-projesi': {
    paragraphs: [
      'Fütüristik bir yapıda retro çizgiler mi?',
      '2023 yılında Adana’da Sayın C.S için tasarladığımız bu modüler bungalov projesi tam olarak geleceğin içinde geçmişten bir imzaydı aslında.',
      'Tam burada esin kaynağımızı da anmamız gerekiyor; Finlandiyalı mimar Matti Suuronen.',
      'İsmine “Futuro Pod” denilen bu fiberglas tasarım 1960’larda duyurulmuş sonrasında onlarca farklı yerde inşa edilmişti.',
      'Biz de Suuronen’den aldığımız ilhamla bu sefer kendi Futuro Pod’umuzu yani Ufo görünümüne sahip bungalov evimizi Adana’da dizayn ettik. Dörtlü ayak üzerinde yerden bağımsız taban alanı sayesinde ısıtma ve soğutma imkanını son derece kolaylaştıran bu yapı aynı zamanda oldukça ergonomik bir iç alan kullanım olanağı sunuyor.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2023',
  },
  'nilufer-dagyenice-villa-projesi': {
    paragraphs: [
      'Villa tasarlamanın keyfi de bir başka. Çizdiğimiz her villada tabiki kullanıcıların taleplerini göz önüne alarak, sanki kendimiz yaşayacakmışız gibi; her detayda ergonomi, pragmatizm, keyif, lüks ve elitizmin özgün detaylarında gezinip dururuz. 2018 yılında Dağyenice’de sayın O.B için tasarladığımız bu villada da yine kendine has bir dünya çizdik. En spesifik özelliği ise 400 metrekarelik eğimli bir arazi üzerinde olması sebebiyle müthiş bir manzaraya sahip olmasıydı. 250 metrekarelik kapalı alanda araç otoparkından salona kadar harika bir kompozisyon oluşturduk. Tabiatın tam manasıyla içinde olan bu konağın salonu ise; TV ekranından daha çekici bir pencere dizaynı ve manzaraya sahipti.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2018',
  },
  'vamates-tesisat-teknolojileri-isyeri-renovasyon-projesi': {
    paragraphs: [
      'Bir iş yerinin renovasyonuna ihtiyaç duyuluyorsa, orada yeni bir desen, renk veya şekil değil; işlevsellik açısından yeni ihtiyaçlara cevap vermek gerekir. Bu amaçla; Vamates Endüstriyel Tesisat Teknolojisi Sistemlerinin ofisinde yeni ihtiyaçlara yanıtlar oluşturduk. 2022 yılında teslim ettiğimiz projemizde, ofisimize yalnızca müşteri ilişkileri değil, aynı zamanda personel eğitim alanı ve dinlenme fuaye alanı ekleyerek yeniledik. Tabi ki desen ve çizgilerimizde Vamates’in dinamizmini de yansıtmayı ihmal etmedik.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2022',
  },
  'iznik-turizm-tesis-alani-bungalov-koy-projesi': {
    paragraphs: [
      'Tabiat bizi Nuh’un gemisine çağırdı bu sefer.',
      'Seçkin bir topluluk, doğanın yenileyici ve rahatlatıcı yeni dünyasına toplanacaktı. Biz de bu amaçla 2019 yılında sayın C.S.’nin Bursa İznik’te gerçekleştireceği Bungalov Köy tesisini projelendirdik. 5750 metrekarelik doyumsuz bir yeşil dünyanın tam kalbinde bulunan alana, 25 adet tek katlı ve çift katlı evleri, ekim ve ekoloji alanı, at ve evcil hayvan mekanlarını dikkatlice konumlandırdık. Özellikle kent sakinlerini bazı zamanlar tazelemek için metropolün baş ucuna; yeşil, sıcak ve ferahlatıcı bir yuva düşledik.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2019',
  },
  'ozluce-salon-renovasyon-projesi': {
    paragraphs: [
      '“Akşam eve döndüğünde seni ne rahatlatır?”',
      'Ne zaman bir ev projesi alsak ev sahibine sorduğumuz soruların başında gelir. 2024 yılında sayın A.Ç ve ailesine teslim ettiğimiz bu iç mekan tasarımında ise “göz yormayan, dinginlik veren, spor ama bazen de misafir ağırlayabileceğimiz kadar elegant bir salon” cevabını hayata geçirmeye çalıştık. Yaklaşık 35 metrekare alana sahip salonumuzda Ying Yang felsefesine atıfta bulunan bir siyah beyaz ahengi çizdik.',
      'Bazen spor, bazen avangard; Bazen Ying, Bazen Yang…',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2024',
  },
  'kutahya-bungalov-projesi': {
    paragraphs: [
      'Çoğu insan son zamanlarda güzel vakit geçirme amacıyla “hobi bahçelerine” yoğun ilgi duymakta. Ve bu kitlenin belli bir kısmı ise bu hobi alanlarında daha konforlu ve daha uzun zaman dilimi geçirmek istiyor. İşte bu amaçla 2023 yılında Kütahya’da tamamladığımız Mobil Bungalov projemizi sayın C.S ye teslim ettik. Toplam 150 metrekarelik bir bahçe içinde 21 metrekarelik taban alanında bir konteyner tasarladık. İçinde asma kat bulunan bungalov evimizi tam anlamıyla sıcak bir atmosfer ve güvenli bir yuva çizgisinde düşledik. Rahatlamanın, dinlenmenin ve güzel zaman geçirmenin bir çok argümanını bu bahçede toparlarken; ilerleyen zamanlarda belki farklı lokasyonları denemek isteyen proje sahibinin kolaylığı adına taşınabilir bir konak inşa ettik.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2023',
  },
  'mersin-univeristesi-bmh-sosyal-tesis-alani': {
    paragraphs: [
      'Daha önce showroomunu teslim ettiğimiz Baibars Mekatronik Havacılık firmasının bir sonraki projesi olan üniversite sosyal tesisini tamamladık. Yine 2023 yılında bitirdiğimiz bu proje 100 metrekare taban alanı üzerinde kapalı mekan olarak tasarlandı. İçerisinde üniversite öğrencilerinin günlük yaşamına nefes aldırabilecek dinamik argümanlar uygulandı. Renkleri ve spor yapısı itibariyle ferah bir atmosfer oluşturulan bu mekan tam bir “kafa dağıtma bölgesi”',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2023',
  },
  'adana-seyhan-bmh-showroom-projesi': {
    paragraphs: [
      'Yakın bir geçmişe kadar “fütüristik” diye nitelendirdiğimiz dünyanın argümanlarını kullandığımız günlerdeyiz artık. Bu minvalde bitirdiğimiz bir projeyi paylaşıyoruz şimdi de sizlerle. 2023 yılında Adana’da teslim ettiğimiz bu projemiz; teknolojik donelerin sunumuna yönelik hazırladığımız 300 metrekarelik bir showroomdu. Zirai ilaçlama droneları üretimi gerçekleştiran Baibars firması; tamamen yerli üretim bir katma değer. Biz de bu değerin en önemli ürünlerini başka hiç bir şeyin gölgesinde kalmadan ön planda olmaları için çalıştık.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2023',
  },
  'kayapa-bizim-firin-firin-cafe-projesi': {
    paragraphs: [
      'Gıda sektöründe elegant ve steril standartları pratiklikten ayrı düşünemeyiz. Bu yıl tamamladığımız Bizim Fırın Kayapa projesinde ise en titiz davrandığımız hususlar bunlardı. Neyse ki 400 metrekarelik inşaat sonrası bir alanda hareket kabiliyetimiz fazlasıyla yeterliydi. Fırın-pastane olarak dizayn ettiğimiz işletmemiz için ilk göze çarpan ambiyans ferah bir atmosferin temiz ışıkları oldu. Lezzetli günler dileriz.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2025',
  },
  'zafer-plaza-avm-senoz-satis-magazasi-projesi': {
    paragraphs: [
      'Bursa’nın yerel kahve markası Şenöz’ün bir diğer yatırım projelerinden olan Zafer Plaza AVM satış mağazası için çalışmalarımızı tamamladık. Markanın ve şehrin otantik dokusunu, mağazanın atmosferinde hissettirebilmek için oryantal çizgiler ve nostaljik desenler düşledik. Yaklaşık 45 metrekarelik sınırlı bir alanda köklü bir dünya resmettik.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2025',
  },
  'prestij-park-sitesi-konut-antre-ve-banyo-renovasyon-projesi': {
    paragraphs: [
      '2024 yılında sayın B.Ç’nin halihazırda yaşadığı Odunluk Prestij Park evlerinde bulunan konutuna lokal dokunuşlar gerçekleştirdik. Evin girişi ve banyo mekanlarında yeni, bütünsel bir kompozisyon hayal eden ev sahibi için sade bir şıklık dizayn ettik. Göz yormayan bir konsepte sahip evinde, tüm sakinlerine mutluluklar dileriz.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2024',
  },
  'anatolium-avm-cocuk-oyun-alani': {
    paragraphs: [
      'Bursa Anatolium Avm kampüsü içerisinde sayın C.A. yatırımı olarak tasarladığımız oyun ve eğlence alanı yaklaşık olarak 5 haftalık bir dizayn aşamasından geçerek netleşmiştir.',
      'Toplam 550 metrekare üzerine tasarlanan oyun etkinlik alanı, çevresinde bulunan bir çok alış veriş noktasının güven alanında konumlanmıştır.',
    ],
    metaLabel: 'Design',
    metaValue: '2017',
  },
  'zeplin-ozel-egitim-kursu-renovasyon-projesi': {
    paragraphs: [
      '2024 yılında Aydın’da teslim ettiğimiz bu projemiz bir eğitim kurumuydu. Tabi konu çocuklar için kapalı bir dershane olunca, fazlasıyla hassas olmamız gereken detaylar hayli çoktu. Hem ses ve ısı yalıtımı hem dayanıklılık hem de statik alanlarda gayet titiz çalıştığımız bir proje oldu. 410 metrekare ve 2 kattan oluşan kapalı alan, 200 metrekare açık alan bahçesiyle birlikte toplam 610 metrekarelik bir alanda tasarım uyguladık.',
      'Çocuklar için güven ve aitlik hissi veren bir atmosferde aynı zamanda renkli bir dünya kurduk. Aydın Zeplin Kişisel Gelişim Kursu niş bir eğitimhane oldu.',
    ],
    metaLabel: 'Dizayn',
    metaValue: '2024',
  },
}

function stripFolderIndex(folderName) {
  return folderName.replace(/^\d+\s*-\s*/, '').trim()
}

function cleanProjectTitle(folderName) {
  return stripFolderIndex(folderName).replace(/\s+[Çç]$/, '').trim()
}

function createSlug(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getOrder(folderName) {
  const match = folderName.match(/^(\d+)/)
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
}

function isCoverFile(fileName) {
  const lowered = fileName.toLocaleLowerCase('tr-TR')
  return /^1\.1/i.test(fileName) || lowered.includes('kapak')
}

function getFileName(filePath) {
  const segments = filePath.split('/')
  return segments[segments.length - 1] || ''
}

const projectFolders = Object.entries(projectImageModules).reduce((acc, [filePath, src]) => {
  const relativePath = filePath.slice(folderPrefix.length)
  const [folderName, fileName] = relativePath.split('/')

  if (!folderName || !fileName) return acc

  if (!acc[folderName]) {
    acc[folderName] = []
  }

  acc[folderName].push({
    src,
    fileName,
  })

  return acc
}, {})

export const projectPages = Object.entries(projectFolders)
  .sort(([leftFolder], [rightFolder]) => {
    const orderDiff = getOrder(leftFolder) - getOrder(rightFolder)
    return orderDiff !== 0 ? orderDiff : naturalSort.compare(leftFolder, rightFolder)
  })
  .map(([folderName, images]) => {
    const title = cleanProjectTitle(folderName)
    const slug = createSlug(title)
    const localizedTitle = localizedProjectTitles[slug] || {}
    const sortedImages = [...images].sort((left, right) => naturalSort.compare(left.fileName, right.fileName))
    const coverImage = sortedImages.find((image) => isCoverFile(image.fileName)) || sortedImages[0]
    const gallerySourceImages = sortedImages.filter((image) => image !== coverImage)
    const galleryImages = (gallerySourceImages.length ? gallerySourceImages : sortedImages).map((image, index) => ({
      id: `${slug}-${index + 1}`,
      src: image.src,
      alt: `${title} ${index + 1}`,
      fileName: getFileName(image.fileName),
    }))

    return {
      slug,
      title,
      titles: {
        tr: title,
        en: localizedTitle.en || title,
        ar: localizedTitle.ar || title,
      },
      categories: getProjectCategorySlugs(title),
      folderName,
      order: getOrder(folderName),
      route: `/projects/${slug}`,
      coverImage: coverImage.src,
      coverFileName: coverImage.fileName,
      galleryImages,
      imageCount: galleryImages.length,
      description: projectDescriptions[slug] || null,
    }
  })

export const projectPagesBySlug = Object.fromEntries(
  projectPages.map((project) => [project.slug, project])
)

export function resolveProjectBySlug(slug) {
  return projectPagesBySlug[projectSlugAliases[slug] || slug] || null
}

export function getLocalizedProjectTitle(project, locale = 'tr') {
  if (!project) return ''
  const title = project?.titles?.[locale] || project?.titles?.tr || project.title || ''
  return locale === 'ar' ? translateNumbers(title, 'ar') : title
}

export function getLocalizedProjectDescription(project, locale = 'tr') {
  if (!project?.description) return null

  const baseDescription = project.description
  const translated = localizedProjectDescriptions[project.slug]?.[locale] || {}

  const merged = {
    ...baseDescription,
    ...translated,
    metaValue: translated.metaValue || baseDescription.metaValue,
  }

  if (locale === 'ar') {
    return {
      ...merged,
      paragraphs: merged.paragraphs?.map((p) => translateNumbers(p, 'ar')),
      metaValue: translateNumbers(merged.metaValue, 'ar'),
    }
  }

  return merged
}
