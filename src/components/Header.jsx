import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLocalizedProjectTitle, projectPages } from "../data/projectPages.js";
import {
  getProjectCategoryLabel,
  projectCategories,
} from "../data/projectCategories.js";
import { SUPPORTED_LOCALES } from "../i18n/config.js";
import { useLocale } from "../i18n/LocaleContext.jsx";

export default function Header() {
  const { locale, meta, t, localizePath } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const phoneIconStyle = { fontSize: "26px", lineHeight: 1 };
  const whatsappIconStyle = { fontSize: "30px", lineHeight: 1 };
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeText = (value) =>
    String(value || "")
      .toLocaleLowerCase(meta.lowerCaseLocale)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const searchItems = useMemo(
    () => [
      {
        title: t.nav.home,
        path: localizePath("/"),
        keywords: `${t.nav.home} mimar kutay erturk home`,
      },
      {
        title: t.nav.about,
        path: localizePath("/aboutus"),
        keywords: `${t.nav.about} architect mimar kutay erturk`,
      },
      {
        title: t.nav.projects,
        path: localizePath("/services"),
        keywords: `${t.nav.projects} services portfolio design architecture`,
      },
      {
        title: t.nav.projects,
        path: localizePath("/projects"),
        keywords: `${t.nav.projects} portfolio gallery detail`,
      },
      {
        title: t.pageMeta.blog,
        path: localizePath("/blog"),
        keywords: `${t.pageMeta.blog} articles news journal`,
      },
      {
        title: t.nav.beforeAfter,
        path: localizePath("/servicesafterbefore"),
        keywords: `${t.nav.beforeAfter} before after renovation`,
      },
      {
        title: t.nav.contact,
        path: localizePath("/contact"),
        keywords: `${t.nav.contact} phone whatsapp email address`,
      },
      ...projectCategories.map((category) => ({
        title: getProjectCategoryLabel(category.slug, locale),
        path: localizePath(`/projects?category=${category.slug}`),
        keywords: `${getProjectCategoryLabel(category.slug, locale)} ${category.slug}`,
      })),
      ...projectPages.map((project) => ({
        title: getLocalizedProjectTitle(project, locale),
        path: localizePath(project.route),
        keywords: `${getLocalizedProjectTitle(project, locale)} project detail gallery`,
      })),
    ],
    [locale, t, localizePath],
  );

  const searchResults = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    if (!normalizedQuery) return [];

    return searchItems
      .map((item) => {
        const haystack = normalizeText(`${item.title} ${item.keywords}`);
        let score = 0;
        if (haystack.includes(normalizedQuery)) score += 3;
        if (normalizeText(item.title).startsWith(normalizedQuery)) score += 2;
        normalizedQuery.split(" ").forEach((word) => {
          if (word && haystack.includes(word)) score += 1;
        });
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [searchItems, searchQuery]);

  const scrollToTop = () => {
    const smoother =
      (window.ScrollSmoother &&
        window.ScrollSmoother.get &&
        window.ScrollSmoother.get()) ||
      null;
    if (smoother && smoother.scrollTo) {
      try {
        smoother.scrollTo(0, true);
      } catch (e) {}
    } else {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  };

  const closeSearchPopup = () => {
    const popup = document.getElementById("popup-search-box");
    if (popup) popup.classList.remove("toggled");
  };

  const closeMobileMenu = (instant = false) => {
    const mobileMenu = document.querySelector(".mobile-side-menu");
    const mobileOverlay = document.querySelector(".mobile-side-menu-overlay");

    if (instant) {
      mobileMenu?.classList.add("instant-close");
      mobileOverlay?.classList.add("instant-close");
    }

    mobileMenu?.classList.remove("is-open");
    mobileOverlay?.classList.remove("is-open");
    document.body.classList.remove("open-sidebar");

    if (instant) {
      window.setTimeout(() => {
        mobileMenu?.classList.remove("instant-close");
        mobileOverlay?.classList.remove("instant-close");
      }, 0);
    }
  };

  const goToSearchResult = (path) => {
    navigate(path);
    scrollToTop();
    closeSearchPopup();
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      goToSearchResult(searchResults[0].path);
    }
  };

  const currentLocalizedPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    const mobileMenu = document.querySelector(".mobile-side-menu");
    if (!mobileMenu) return undefined;

    const handleMobileMenuClick = (event) => {
      const link = event.target.closest(".mean-nav a");
      if (!link || link.classList.contains("mean-expand")) return;

      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        /^(tel:|mailto:|javascript:)/i.test(href)
      )
        return;

      let nextUrl;
      try {
        nextUrl = new URL(href, window.location.origin);
      } catch (error) {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;

      event.preventDefault();
      closeMobileMenu(true);
      scrollToTop();
      navigate(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    };

    mobileMenu.addEventListener("click", handleMobileMenuClick);
    return () => mobileMenu.removeEventListener("click", handleMobileMenuClick);
  }, [navigate]);

  return (
    <>
      <header className="header sticky-active">
        <div className="primary-header">
          <div className="container">
            <div className="primary-header-inner">
              <div className="header-left-wrap">
                <div className="header-logo d-lg-block m-3">
                  <Link to={localizePath("/")} onClick={scrollToTop}>
                    <img src="/assets/img/logo/logo-mke-beyaz.png" alt="logo" />
                  </Link>
                </div>
                <div className="header-menu-wrap">
                  <div className="mobile-menu-items">
                    <ul>
                      <li>
                        <Link to={localizePath("/")} onClick={scrollToTop}>
                          {t.nav.home}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={localizePath("/aboutus")}
                          onClick={scrollToTop}
                        >
                          {t.nav.about}
                        </Link>
                      </li>
                      <li className="menu-item-has-children">
                        <Link
                          to={localizePath("/projects")}
                          onClick={scrollToTop}
                        >
                          {t.nav.projects}
                        </Link>
                        <ul>
                          <li>
                            <Link
                              to={localizePath("/projects")}
                              onClick={scrollToTop}
                            >
                              {t.nav.allProjects}
                            </Link>
                          </li>
                          {projectCategories.map((category) => (
                            <li key={category.slug}>
                              <Link
                                to={localizePath(
                                  `/projects?category=${category.slug}`,
                                )}
                                onClick={scrollToTop}
                              >
                                {getProjectCategoryLabel(category.slug, locale)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <Link
                          to={localizePath("/contact")}
                          onClick={scrollToTop}
                        >
                          {t.nav.contact}
                        </Link>
                      </li>
                      <li className="mobile-only-language-link">
                        <Link
                          to={localizePath(currentLocalizedPath, "tr")}
                          onClick={() => {
                            scrollToTop();
                            closeMobileMenu();
                          }}
                        >
                          TR
                        </Link>
                      </li>
                      <li className="mobile-only-language-link">
                        <Link
                          to={localizePath(currentLocalizedPath, "en")}
                          onClick={() => {
                            scrollToTop();
                            closeMobileMenu();
                          }}
                        >
                          EN
                        </Link>
                      </li>

                      <li className="mobile-only-language-link">
                        <Link
                          to={localizePath(currentLocalizedPath, "ar")}
                          onClick={() => {
                            scrollToTop();
                            closeMobileMenu();
                          }}
                        >
                          AR
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="header-right-wrap">
                <a
                  href="tel:+9005555572208"
                  className="search-icon"
                  aria-label="Telefon ile ara"
                >
                  <span className="icon">
                    <i
                      className="fa-regular fa-phone"
                      style={phoneIconStyle}
                    ></i>
                  </span>
                  <span className="content">
                    <span className="call-number"></span>
                  </span>
                </a>
                <a
                  href="https://wa.me/905555572208"
                  className="search-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp ile yaz"
                >
                  <span className="icons">
                    <i
                      className="fab fa-whatsapp"
                      style={whatsappIconStyle}
                    ></i>
                  </span>
                  <span className="content">
                    <span className="call-number"></span>
                  </span>
                </a>
                <div className="language-switcher desktop-language-switcher">
                  {SUPPORTED_LOCALES.map((languageCode) => (
                    <Link
                      key={languageCode}
                      to={localizePath(currentLocalizedPath, languageCode)}
                      className={`search-icon language-switcher-link${locale === languageCode ? " active" : ""}`}
                      onClick={scrollToTop}
                      aria-label={`Switch language to ${languageCode.toUpperCase()}`}
                    >
                      <span className="language-switcher-text">
                        {languageCode.toUpperCase()}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="search-icon dl-search-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="sidebar-icon">
                  <button className="sidebar-trigger open">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 2C11 0.89543 11.8954 0 13 0H14C15.1046 0 16 0.895431 16 2V3C16 4.10457 15.1046 5 14 5H13C11.8954 5 11 4.10457 11 3V2Z"
                        fill="white"
                      />
                      <path
                        d="M0 2C0 0.89543 0.895431 0 2 0H3C4.10457 0 5 0.895431 5 2V3C5 4.10457 4.10457 5 3 5H2C0.89543 5 0 4.10457 0 3V2Z"
                        fill="white"
                      />
                      <path
                        d="M0 13C0 11.8954 0.895431 11 2 11H3C4.10457 11 5 11.8954 5 13V14C5 15.1046 4.10457 16 3 16H2C0.89543 16 0 15.1046 0 14V13Z"
                        fill="white"
                      />
                      <path
                        d="M11 13C11 11.8954 11.8954 11 13 11H14C15.1046 11 16 11.8954 16 13V14C16 15.1046 15.1046 16 14 16H13C11 16 11 15.1046 11 14V13Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="popup-search-box">
        <div className="box-inner-wrap d-flex align-items-center">
          <form
            id="form"
            action="#"
            method="get"
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <input
              id="popup-search"
              type="text"
              name="s"
              placeholder={t.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.trim() && (
              <div className="search-results-list">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      className="search-result-item"
                      onClick={() => goToSearchResult(item.path)}
                    >
                      {item.title}
                    </button>
                  ))
                ) : (
                  <div className="search-result-empty">{t.search.noResult}</div>
                )}
              </div>
            )}
          </form>
          <div className="search-close">
            <i className="fa-sharp fa-regular fa-xmark"></i>
          </div>
        </div>
      </div>

      <div id="sidebar-area" className="sidebar-area">
        <button className="sidebar-trigger close">
          <svg
            className="sidebar-close"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="16px"
            height="12.7px"
            viewBox="0 0 16 12.7"
            style={{ enableBackground: "new 0 0 16 12.7" }}
            xmlSpace="preserve"
          >
            <g>
              <rect
                x="0"
                y="5.4"
                transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.1569 7.5208)"
                width="16"
                height="2"
              ></rect>
              <rect
                x="0"
                y="5.4"
                transform="matrix(0.7071 0.7071 -0.7071 0.7071 6.8431 -3.7929)"
                width="16"
                height="2"
              ></rect>
            </g>
          </svg>
        </button>
        <div className="side-menu-content">
          <div className="side-menu-logo">
            <a className="dark-img" href={localizePath("/")}>
              <img src="/assets/img/logo/logo-mke-beyaz.png" alt="logo" />
            </a>
            <a className="light-img" href={localizePath("/")}>
              <img src="/assets/img/logo/logo-mke-siyah.png" alt="logo" />
            </a>
          </div>
          <div className="side-menu-wrap"></div>
          <div className="side-menu-about">
            <h4 className="title">Mimar Kutay Ertürk</h4>
            <h3 className="title" style={{ color: "#caa05c" }}>
              {t.nav.projects}
            </h3>
          </div>
          <div className="side-menu-gallary">
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-1.png"
                  alt="img"
                />
              </Link>
            </div>
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-2.png"
                  alt="img"
                />
              </Link>
            </div>
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-3.png"
                  alt="img"
                />
              </Link>
            </div>
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-4.png"
                  alt="img"
                />
              </Link>
            </div>
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-5.png"
                  alt="img"
                />
              </Link>
            </div>
            <div className="side-menu-gallary-item">
              <Link
                to={localizePath("/projects")}
                onClick={() => {
                  scrollToTop();
                  document.body.classList.remove("open-sidebar");
                }}
              >
                <img
                  src="/assets/img/project/sidebar-gallary-6.png"
                  alt="img"
                />
              </Link>
            </div>
          </div>
          <div className="side-menu-contact">
            <ul className="side-menu-list">
              <li>
                Bademli
                <br /> BURSA <br />
                TÜRKİYE
              </li>
              <li>
                <a href="tel:+0555572208">+90(555) 557-22-08</a>
              </li>
              <li>
                <a className="" href="mailto:info@mimarkutayerturk.com">
                  info@mimarkutayerturk.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="sidebar-overlay"></div>

      <div className="mobile-side-menu">
        <div className="side-menu-content">
          <div className="side-menu-head">
            <a href={localizePath("/")}>
              <img src="/assets/img/logo/logo-2.png" alt="logo" />
            </a>
            <button className="mobile-side-menu-close">
              <i className="fa-regular fa-xmark"></i>
            </button>
          </div>
          <div className="side-menu-wrap"></div>
          <div className="side-menu-contact">
            <div className="side-menu-header">
              <h3>{t.nav.contact}</h3>
            </div>
            <ul className="side-menu-list">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <p>Bademli, Bursa, Türkiye</p>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <a href="tel:+905555572208">+90 (555) 557-22-08</a>
              </li>
              <li>
                <i className="fas fa-envelope-open-text"></i>
                <a href="mailto:info@mimarkutayerturk.com">
                  info@mimarkutayerturk.com
                </a>
              </li>
            </ul>
          </div>
          <ul className="side-menu-social">
            <li className="facebook">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li className="instagram">
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li className="twitter">
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li className="g-plus">
              <a href="#">
                <i className="fab fa-google-plus"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mobile-side-menu-overlay"></div>
    </>
  );
}
