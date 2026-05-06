
(function ($) {
    "use strict";

    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch(e){}
    window.addEventListener('DOMContentLoaded', function(){ try { window.scrollTo(0,0); } catch(e){} });

    // Get Device width
    var device_width = window.innerWidth;

    /*======================================
        Preloader activation
    ========================================*/
    function textAnimationEffect(){
        let TextAnim = gsap.timeline();
        let splitText = new SplitType( ".text-animation-effect", { types: 'chars' });
        if( $('.text-animation-effect .char').length ){
            TextAnim.from(".text-animation-effect .char", { duration: 1, x: 50, autoAlpha: 0, stagger: 0.1 }, "-=1");
        }
    } 

        /* ===============================
        Smooth Preloader
        ================================*/

        var innerBars = document.querySelectorAll(".inner-bar");
var increment = 0;

function animateBars() {
    if (!innerBars || innerBars.length === 0 || typeof gsap === 'undefined') return;

    /* loading bar animation */
    for (var i = 0; i < 2; i++) {

        var randomWidth = Math.floor(Math.random() * 101);

        if (!innerBars[i + increment]) continue;
        gsap.to(innerBars[i + increment], {
            width: randomWidth + "%",
            duration: 0.5,
            ease: "none"
        });
    }

    setTimeout(function () {

        for (var i = 0; i < 2; i++) {

            gsap.to(innerBars[i + increment], {
                width: "100%",
                duration: 0.5,
                ease: "none"
            });
        }

        increment += 2;

        if (increment < innerBars.length) {

            animateBars();

        } else {

            if (document.querySelector(".preloader") && typeof gsap !== 'undefined') {
                var preloaderTL = gsap.timeline();
                preloaderTL.to(".preloader", {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
                preloaderTL.call(function () {
                    if (window.startSliderAfterPreload) {
                        window.startSliderAfterPreload();
                    }
                });
                preloaderTL.set(".preloader", {
                    display: "none"
                });
            } else {
                if (window.startSliderAfterPreload) {
                    try { window.startSliderAfterPreload(); } catch(e){}
                }
            }

            /* ===================================
               OPTIONAL TEXT ANIMATION
            =================================== */

            let splitText = new SplitType(".text-animation-effect", {
                types: "chars"
            });

            if (document.querySelectorAll('.text-animation-effect .char').length) {

                preloaderTL.from(
                    ".text-animation-effect .char",
                    {
                        duration: 1.2,
                        y: 40,
                        autoAlpha: 0,
                        stagger: 0.05,
                        ease: "power2.out"
                    },
                    "-=0.5"
                );
            }
        }

    }, 200);
}

/* start preloader */
animateBars();

    // Panorama Image
    var panorama, panoViewer, panoContainer;
    panoContainer = document.querySelector(".antra-panoroma-img");
    
    if (panoContainer) {
        var antraData = $(".antra-panoroma-img").data("img");
        panorama = new PANOLENS.ImagePanorama(antraData);
        panoViewer = new PANOLENS.Viewer({container: panoContainer});
        panoViewer.add(panorama);
    }
    
    $(window).on("load", function () {
        try { animateBars(); } catch(e){}
        setTimeout(function () {
            try { $(".preloader").remove(); } catch(e){}
        }, 3000);
    });


    $(document).ready(function () {

        // Image Comparison Slider
        $(".antra-image-comparison").twentytwenty({
            default_offset_pct: 0.5,
            orientation: 'horizontal',
            no_overlay: true,
            move_slider_on_hover: true,
            move_with_handle_only: false,
            click_to_move: false
        });

        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
            $('body').addClass('firefox');
        }
        
        var header = $(".header"),
            stickyHeader = $(".primary-header");

        function menuSticky(w) {
            if (w.matches) {
                
                $(window).on("scroll", function () {
                    var scroll = $(window).scrollTop();
                    if (scroll >= 110) {
                        stickyHeader.addClass("fixed");
                    } else {
                        stickyHeader.removeClass("fixed");
                    }
                });
                if ($(".header").length > 0) {    
                    var  headerHeight = document.querySelector(".header"),
                        setHeaderHeight = headerHeight.offsetHeight;	
                    header.each(function () {
                        $(this).css({
                            'height' : setHeaderHeight + 'px'
                        });
                    });
                }
            }
        }

        var minWidth = window.matchMedia("(min-width: 992px)");
        if (header.hasClass("sticky-active")) {
            menuSticky(minWidth);
        }

        function initResponsiveSidebarMenu() {
            var $menu = $(".mobile-menu-items");
            var containerSelector = "#sidebar-area .side-menu-wrap";
            var $container = $(containerSelector);

            if (!$menu.length || !$container.length || $container.find(".mean-bar").length) {
                return;
            }

            $menu.meanmenu({
                meanMenuContainer: containerSelector,
                meanScreenWidth: "992",
                meanMenuCloseSize: "30px",
                meanExpand: ['<i class="fa-solid fa-caret-down"></i>']
            });
        }

        //Mobile Menu Js
        initResponsiveSidebarMenu();

        // Mobile Sidemenu
        $(".mobile-side-menu-toggle").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
        });

        $(".mobile-side-menu-close, .mobile-side-menu-overlay").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass("is-open");
        });

        // Prevent stale mobile/desktop menus when switching between breakpoints
        function resetResponsiveMenus() {
            $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass("is-open");
            $("body").removeClass("open-sidebar");
            $("#popup-search-box").removeClass("toggled");
        }

        $(window).on("resize orientationchange", function () {
            clearTimeout(window.__antraResponsiveMenuTimer);
            window.__antraResponsiveMenuTimer = setTimeout(resetResponsiveMenus, 120);
        });

        // Popup Search Box
        $(function () {
            $("#popup-search-box").removeClass("toggled");

            $(".dl-search-icon").on("click", function (e) {
                e.stopPropagation();
                $("#popup-search-box").toggleClass("toggled");
                $("#popup-search").focus();
            });

            $("#popup-search-box input").on("click", function (e) {
                e.stopPropagation();
            });

            $("#popup-search-box, body").on("click", function () {
                $("#popup-search-box").removeClass("toggled");
            });
        });

        // Popup Sidebox
        function sideBox() {
            $("body").removeClass("open-sidebar");
            $(document).on("click", ".sidebar-trigger", function (e) {
                e.preventDefault();
                $("body").toggleClass("open-sidebar");
            });
            $(document).on("click", ".sidebar-trigger.close, #sidebar-overlay", function (e) {
                e.preventDefault();
                $("body.open-sidebar").removeClass("open-sidebar");
            });
        }

        sideBox();

        // Venobox Video

        function venoboxInit(){
            if (window._vb && typeof window._vb.destroy === 'function') {
                try { window._vb.destroy(); } catch(e){}
            }
            window._vb = new VenoBox({
                selector: ".video-popup, .img-popup",
                bgcolor: "transparent",
                maxWidth: "96vw",
                numeration: true,
                infinigall: true,
                spinner: "plane",
                onPostOpen: function(){
                    setupLightboxZoom();
                },
                onNavComplete: function(){
                    setupLightboxZoom();
                }
            });
        }
        venoboxInit();
        setupLightboxZoom();
        initLightGallery();
        initPhotoSwipe();
        initFullscreenImageGallery();

        // Data Background
        $("[data-background]").each(function () {
            $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
        });

        // Custom Cursor
        function customCursor(viewSelector = '.antra-hover-view') {

            $("body").append('<div class="mt-cursor"></div>');
            $("body").append('<div class="mt-cursor-view"></div>');

            const cursor = $(".mt-cursor");
            const viewButton = $(".mt-cursor-view");

            let targetX = 0;
            let targetY = 0;
            let cursorX = 0;
            let cursorY = 0;
            let viewX = 0;
            let viewY = 0;
            let rafId = null;
            let running = false;

            function animate() {
                if (!running) return;
                cursorX += (targetX - cursorX) * 0.35;
                cursorY += (targetY - cursorY) * 0.35;
                viewX += (targetX - viewX) * 0.18;
                viewY += (targetY - viewY) * 0.18;

                cursor.css({
                    '--tl-cx': `${cursorX}px`,
                    '--tl-cy': `${cursorY}px`,
                    visibility: "inherit",
                });
                viewButton.css({
                    '--tl-vx': `${viewX}px`,
                    '--tl-vy': `${viewY}px`,
                });
                rafId = window.requestAnimationFrame(animate);
            }

            $(window).on("mousemove.cursor", function(e) {
                targetX = e.clientX;
                targetY = e.clientY;
                if (!running) {
                    running = true;
                    rafId = window.requestAnimationFrame(animate);
                }
            });

            $("body").on('mouseenter.cursor', viewSelector, function() {
                viewButton.addClass("active");
                cursor.css("opacity", "0");
            }).on('mouseleave.cursor', viewSelector, function() {
                viewButton.removeClass("active");
                cursor.css("opacity", "1");
            });

            // NEW: hero text effect
            $("body").on("mouseenter.cursor", ".cursor-effect", function() {
                cursor.addClass("cursor-lg cursor-blend");
                })
                .on("mouseleave.cursor", ".cursor-effect", function() {
                cursor.removeClass("cursor-lg cursor-blend");
                });

            window.destroyCustomCursor = function() {
                $(window).off('.cursor');
                $('body').off('.cursor');
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                running = false;
                cursor.remove();
                viewButton.remove();
            };
        }
        customCursor();

        // Price range slider
        var priceRange = $("#price-range"),
            priceOutput = $("#price-output span");
            priceOutput.html(priceRange.val());
            priceRange.on("change input", function () {
            priceOutput.html($(this).val());
        });

        /* Odometer */
        $(".odometer").waypoint(
            function () {
                var odo = $(".odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            },
            {
                offset: "80%",
                triggerOnce: true,
            }
        );

        // Nice Select Js
        $("select").niceSelect();


        function featureHoverGSAP(options) {
            const settings = Object.assign({
                container: ".feature-img",
                image: ".feature-img img",
                text: null,
                trigger: ".feature-item"
            }, options);

            const activeClass = "active";
            const fadeSpeed = 0.28;

            const imgEl = document.querySelector(settings.image);
            const textEl = settings.text ? document.querySelector(settings.text) : null;
            const box = document.querySelector(settings.container);

            let lastItem = null;
            let interactionMode = null;

            const triggerItems = document.querySelectorAll(settings.trigger);

            function activate(item) {
                if (!item || item === lastItem) return;
                lastItem = item;

                const newImg = item.dataset.img;
                const newText = item.dataset.text;

                triggerItems.forEach(el => el.classList.remove(activeClass));
                item.classList.add(activeClass);

                gsap.killTweensOf([box, imgEl, textEl]);

                gsap.to(box, {
                    opacity: 0,
                    y: -8,
                    scale: 0.985,
                    duration: fadeSpeed,
                    ease: "power1.out",
                    onComplete: () => {
                        if (newImg) imgEl.src = newImg;
                        gsap.fromTo(
                            box,
                            { opacity: 0, y: 10, scale: 0.985 },
                            { opacity: 1, y: 0, scale: 1, duration: fadeSpeed, ease: "power1.out" }
                        );

                        if (textEl && newText) {
                            textEl.textContent = newText;
                            gsap.fromTo(
                                textEl,
                                { opacity: 0, y: 10 },
                                { opacity: 1, y: 0, duration: fadeSpeed, ease: "power1.out" }
                            );
                        }
                    }
                });
            }

            triggerItems.forEach(item => {
                // Check if item should use click mode via data attribute
                const useClickMode = item.dataset.mode === "click";
                
                // HOVER MODE (default behavior)
                if (!useClickMode) {
                    item.addEventListener("mouseenter", () => {
                        if (interactionMode === "click") return;
                        interactionMode = "hover";
                        activate(item);
                    });
                }

                // CLICK MODE
                item.addEventListener("click", e => {
                    // Only prevent default if it's a link and we're in click mode
                    if (useClickMode) {
                        e.preventDefault();
                        interactionMode = "click";
                        activate(item);
                    } else {
                        // For non-click mode items, let the link work normally
                        // but still activate the item if needed
                        if (interactionMode !== "hover") {
                            activate(item);
                        }
                    }
                });
            });
        }

        featureHoverGSAP({
            container: ".feature-img",
            image: ".feature-img img",
            text: ".feature-img .img-content p",
            trigger: ".feature-item"
        });

        featureHoverGSAP({
            container: ".team-img",
            image: ".team-img img",
            trigger: ".team-item"
        });

        featureHoverGSAP({
            container: ".award-img",
            image: ".award-img img",
            trigger: ".award-item"
        });

        featureHoverGSAP({
            container: ".service-img-7",
            image: ".service-img-7 img",
            trigger: ".service-item-7"
        });

        function gallaryScroll(){
            gsap.config({
                force3D: true
            });
            var $container=$(".gallary-wrap");

            $container.each(function () {
                const $section = $(this);
                const $imageContainer = $section.find('.gallery-scroll-wrap');
                const windowWidth = $(window).width();

                let scrollDistance = -(windowWidth / 3);

                $imageContainer.append($imageContainer.html());
                // 2️⃣ Re-init venobox after duplication
                // reInitVenoBox();
                if ($section.hasClass('gallery-scroll-direction-ltr')) {
                    scrollDistance = scrollDistance * -1;
                }

                gsap.to($imageContainer, {
                    x: scrollDistance,
                    ease: "sine.out",
                    scrollTrigger: {
                        trigger: $section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.5,
                        markers: false,
                        anticipatePin: 1
                    }
                });
                
            });
        }
        gallaryScroll();

        // Re-init on SPA page mount
        var pageMountedRefreshTimer = null;
        var handlePageMounted = function(){
            window.__antraPendingPageMounted = false;
            clearTimeout(pageMountedRefreshTimer);
            pageMountedRefreshTimer = setTimeout(function(){
            var langDir = ((document.documentElement && document.documentElement.getAttribute('dir')) || '').toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
            var syncSwiperDir = function(swiper, el){
                if (!swiper) return;
                try { if (el && el.setAttribute) el.setAttribute('dir', langDir); } catch(e){}
                try { swiper.changeLanguageDirection && swiper.changeLanguageDirection(langDir); } catch(e){}
                try { swiper.update && swiper.update(); } catch(e){}
            };
            initResponsiveSidebarMenu();
            venoboxInit();
            setupLightboxZoom();
            initLightGallery();
            initPhotoSwipe();
            initFullscreenImageGallery();
            // Generic Swiper update to fix spacing after SPA transitions
            try {
                document.querySelectorAll('.swiper, .swiper-container').forEach(function(el){
                    if (el.swiper && typeof el.swiper.update === 'function') {
                        syncSwiperDir(el.swiper, el);
                    }
                });
            } catch(e){}
            // Fix gallery spacing on SPA transitions (per-carousel init/update)
            try {
                var getGallaryOptions = function(){
                    return {
                        slidesPerView: 3,
                        spaceBetween: 24,
                        loop: true,
                        autoplay: false,
                        grabCursor: true,
                        speed: 800,
                        navigation: {
                            nextEl: '.gallary-carousel-wrap .swiper-next',
                            prevEl: '.gallary-carousel-wrap .swiper-prev',
                        },
                        breakpoints: {
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 }
                        }
                    }
                };
                document.querySelectorAll('.gallary-carousel').forEach(function(el){
                    if (el.swiper && typeof el.swiper.update === 'function') {
                        // Ensure params are consistent, then update
                        try {
                            el.swiper.params.spaceBetween = 24;
                            el.swiper.params.breakpoints = getGallaryOptions().breakpoints;
                        } catch(e){}
                        syncSwiperDir(el.swiper, el);
                    } else if (typeof Swiper !== 'undefined') {
                        try { syncSwiperDir(new Swiper(el, getGallaryOptions()), el); } catch(e){}
                    }
                    if (window.imagesLoaded) {
                        var wrap = el.querySelector('.swiper-wrapper') || el;
                        imagesLoaded(wrap, function(){
                            try { el.swiper && syncSwiperDir(el.swiper, el); } catch(e){}
                        });
                    }
                });
            } catch(e){}
            $("[data-background]").each(function () {
                $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
            });
            // imagesLoaded hook for any swiper-wrapper present
            try {
                if (window.imagesLoaded) {
                    document.querySelectorAll('.swiper-wrapper').forEach(function(wrap){
                        imagesLoaded(wrap, function(){ 
                            try { wrap.closest('.swiper, .swiper-container')?.swiper?.update(); } catch(e){}
                        });
                    });
                }
            } catch(e){}
            try {
                var getHistoryOptions = function(){
                    return {
                        slidesPerView: 4,
                        spaceBetween: 24,
                        slidesPerGroup: 1,
                        loop: true,
                        freeMode: true,
                        freeModeMomentum: false,
                        autoplay: {
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                            waitForTransition: false,
                        },
                        allowTouchMove: true,
                        simulateTouch: true,
                        touchRatio: 1,
                        touchStartPreventDefault: false,
                        passiveListeners: false,
                        grabcursor: true,
                        speed: 5000,
                        observer: true,
                        observeParents: true,
                        breakpoints: {
                            320: { slidesPerView: 1, slidesPerGroup: 1 },
                            767: { slidesPerView: 2, slidesPerGroup: 1 },
                            1024: { slidesPerView: 3, slidesPerGroup: 1 },
                            1200: { slidesPerView: 4, slidesPerGroup: 1 },
                        },
                    }
                };
                document.querySelectorAll('.history-carousel').forEach(function(el){
                    if (el.swiper && typeof el.swiper.update === 'function') {
                        syncSwiperDir(el.swiper, el);
                        try { el.swiper.autoplay && el.swiper.autoplay.start && el.swiper.autoplay.start(); } catch(e){}
                        return;
                    }
                    if (typeof Swiper === 'undefined') return;
                    var historySwiper = new Swiper(el, getHistoryOptions());
                    syncSwiperDir(historySwiper, el);
                    try { historySwiper.autoplay && historySwiper.autoplay.start && historySwiper.autoplay.start(); } catch(e){}
                });
            } catch(e){}
            try {
                document.querySelectorAll('.testi-carousel').forEach(function(el){
                    if (el.swiper && typeof el.swiper.update === 'function') {
                        try {
                            el.swiper.params.loop = true;
                            el.swiper.params.autoplay = {
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            };
                        } catch(e){}
                        syncSwiperDir(el.swiper, el);
                        try { el.swiper.autoplay && el.swiper.autoplay.start && el.swiper.autoplay.start(); } catch(e){}
                        return;
                    }
                    if (typeof Swiper === 'undefined') return;
                    var testiSwiper = new Swiper(el, {
                        slidesPerView: 1,
                        spaceBetween: 24,
                        slidesPerGroup: 1,
                        loop: true,
                        autoplay: {
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        },
                        allowTouchMove: true,
                        simulateTouch: true,
                        touchRatio: 1,
                        touchStartPreventDefault: false,
                        passiveListeners: false,
                        grabCursor: true,
                        speed: 800,
                        observer: true,
                        observeParents: true,
                    });
                    syncSwiperDir(testiSwiper, el);
                    try { testiSwiper.autoplay && testiSwiper.autoplay.start && testiSwiper.autoplay.start(); } catch(e){}
                });

                document.querySelectorAll('.sponsor-carousel').forEach(function(el){
                    if (el.swiper && typeof el.swiper.update === 'function') {
                        syncSwiperDir(el.swiper, el);
                        try { el.swiper.autoplay && el.swiper.autoplay.start && el.swiper.autoplay.start(); } catch(e){}
                        return;
                    }
                    if (typeof Swiper === 'undefined') return;
                    var sponsorSwiper = new Swiper(el, {
                        slidesPerView: 6,
                        spaceBetween: 24,
                        slidesPerGroup: 1,
                        loop: true,
                        freeMode: true,
                        freeModeMomentum: false,
                        autoplay: {
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                            waitForTransition: false,
                        },
                        allowTouchMove: true,
                        simulateTouch: true,
                        touchRatio: 1,
                        touchStartPreventDefault: false,
                        passiveListeners: false,
                        grabcursor: true,
                        speed: 6000,
                        observer: true,
                        observeParents: true,
                        breakpoints: {
                            320: { slidesPerView: 2, slidesPerGroup: 1 },
                            767: { slidesPerView: 4, slidesPerGroup: 1 },
                            1024: { slidesPerView: 4, slidesPerGroup: 1 },
                            1199: { slidesPerView: 6, slidesPerGroup: 1 },
                        },
                    });
                    syncSwiperDir(sponsorSwiper, el);
                    try { sponsorSwiper.autoplay && sponsorSwiper.autoplay.start && sponsorSwiper.autoplay.start(); } catch(e){}
                });
            } catch(e){}
            // Arabic Odometer (odometer-ar) animation logic
            var convertToArabicDigits = function(str) {
                var id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
                return String(str).replace(/[0-9]/g, function(w) { return id[+w]; });
            };
            var animateArabicOdometer = function(el, target) {
                if (el._animating) return;
                el._animating = true;
                var duration = 2000; // 2 seconds
                var startTime = null;
                var step = function(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var value = Math.floor(progress * target);
                    el.textContent = convertToArabicDigits(value);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        el.textContent = convertToArabicDigits(target);
                        el._animating = false;
                    }
                };
                window.requestAnimationFrame(step);
            };

            var els = document.querySelectorAll(".odometer");
            var elsAr = document.querySelectorAll(".odometer-ar");

            // Handle standard odometer
            var ensureOdometerValue = function(el, target) {
                setTimeout(function() {
                    if (!String(el.textContent || "").includes(String(target))) {
                        el.innerHTML = String(target);
                    }
                }, 1200);
            };
            var getCount = function(el) {
                var val = el.getAttribute("data-count") || "";
                var en = val.replace(/[٠-٩]/g, function(d) {
                    return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
                });
                return parseInt(en, 10) || 0;
            };

            if (window.Odometer) {
                var io = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var el = entry.target;
                            var target = getCount(el);
                            if (el.classList.contains("odometer-ar")) {
                                animateArabicOdometer(el, target);
                            } else {
                                if (!el._odometer) {
                                    el._odometer = new Odometer({ el: el, value: 0 });
                                }
                                el._odometer.update(target);
                                ensureOdometerValue(el, target);
                            }
                            io.unobserve(el);
                        }
                    });
                }, { threshold: 0.2 });

                els.forEach(function(el){
                    var target = getCount(el);
                    var rect = el.getBoundingClientRect();
                    var isInView = rect.bottom > 0 && rect.top < window.innerHeight * 0.9;
                    if (isInView) {
                        if (!el._odometer) {
                            el._odometer = new Odometer({ el: el, value: 0 });
                        }
                        el._odometer.update(target);
                        ensureOdometerValue(el, target);
                        return;
                    }
                    io.observe(el);
                    ensureOdometerValue(el, target);
                });

                elsAr.forEach(function(el){
                    var target = getCount(el);
                    var rect = el.getBoundingClientRect();
                    var isInView = rect.bottom > 0 && rect.top < window.innerHeight * 0.9;
                    if (isInView) {
                        animateArabicOdometer(el, target);
                        return;
                    }
                    io.observe(el);
                });
            } else {
                els.forEach(function(el){
                    var target = getCount(el);
                    el.textContent = target;
                });
                elsAr.forEach(function(el){
                    var target = getCount(el);
                    el.textContent = convertToArabicDigits(target);
                });
            }
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
            }, 30);
        };

        $(document).on('page:mounted', handlePageMounted);
        document.addEventListener('page:mounted', handlePageMounted);
        window.__antraPageMountedReady = true;
        if (window.__antraPendingPageMounted) {
            setTimeout(handlePageMounted, 0);
        }

        // Zoom & pan for Venobox images
        function setupLightboxZoom(){
            if (window._vboxZoomSetup) return;
            window._vboxZoomSetup = true;
            const bodyObserver = new MutationObserver((mutations)=>{
                mutations.forEach(m=>{
                    m.addedNodes.forEach(node=>{
                        if (node.nodeType === 1 && node.classList.contains('vbox-container')) {
                            initZoom(node);
                        }
                    });
                });
            });
            bodyObserver.observe(document.body, { childList: true });
            // Eğer lightbox zaten açıksa hemen başlat
            document.querySelectorAll('.vbox-container, .vbox-overlay').forEach(initZoom);
            function initZoom(container){
                // Kontroller zaten varsa tekrar ekleme
                if (container.querySelector('.vbox-zoom-controls')) return;
                let img = container.querySelector('.vbox-content img') || container.querySelector('.vbox-child') || container.querySelector('img');
                let child = img ? img.closest('.vbox-child') : null;
                if (!img) return;
                let scale = 1, tx = 0, ty = 0;
                const clamp = (v, min, max)=>Math.max(min, Math.min(max, v));
                const apply = ()=>{
                    if (child) {
                        child.style.setProperty('width', '100vw', 'important');
                        child.style.setProperty('height', '100vh', 'important');
                        child.style.setProperty('max-width', '100vw', 'important');
                        child.style.setProperty('max-height', '100vh', 'important');
                    }
                    img.style.setProperty('width', '100vw', 'important');
                    img.style.setProperty('height', '100vh', 'important');
                    img.style.setProperty('max-width', '100vw', 'important');
                    img.style.setProperty('max-height', '100vh', 'important');
                    img.style.transformOrigin = 'center center';
                    img.style.willChange = 'transform';
                    img.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
                    img.style.transition = 'transform 0.05s ease-out';
                    img.style.cursor='grab';
                };
                apply();
                // Controls
                const controls = document.createElement('div');
                controls.className = 'vbox-zoom-controls';
                controls.innerHTML = '<button data-z="+">+</button><button data-z="-">-</button><button data-z="reset">reset</button>';
                container.appendChild(controls);
                controls.addEventListener('click', (e)=>{
                    const z = e.target.getAttribute('data-z');
                    if (!z) return;
                    if (z === '+') scale = clamp(scale + 0.2, 1, 4);
                    else if (z === '-') scale = clamp(scale - 0.2, 1, 4);
                    else { scale = 1; tx = 0; ty = 0; }
                    apply();
                });
                // Wheel zoom
                container.addEventListener('wheel', (e)=>{
                    e.preventDefault();
                    const delta = e.deltaY < 0 ? 0.15 : -0.15;
                    scale = clamp(scale + delta, 1, 4);
                    apply();
                }, { passive:false });
                // Drag to pan
                let dragging = false, sx=0, sy=0;
                container.addEventListener('mousedown', (e)=>{ dragging=true; sx=e.clientX; sy=e.clientY; img.style.cursor='grabbing'; });
                container.addEventListener('mousemove', (e)=>{ if (!dragging || scale===1) return; tx += (e.clientX - sx); ty += (e.clientY - sy); sx=e.clientX; sy=e.clientY; apply(); });
                container.addEventListener('mouseup', ()=>{ dragging=false; img.style.cursor='grab'; });
                container.addEventListener('mouseleave', ()=>{ dragging=false; img.style.cursor='grab'; });
                // Double click reset
                container.addEventListener('dblclick', ()=>{ scale=1; tx=0; ty=0; apply(); });
                // Touch pinch-zoom
                let pinchStartDist = 0, pinchStartScale = 1;
                container.addEventListener('touchstart', (e)=>{
                    if (e.touches.length === 2) {
                        const dx = e.touches[0].clientX - e.touches[1].clientX;
                        const dy = e.touches[0].clientY - e.touches[1].clientY;
                        pinchStartDist = Math.hypot(dx, dy);
                        pinchStartScale = scale;
                    } else if (e.touches.length === 1) {
                        dragging = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
                    }
                }, { passive: true });
                container.addEventListener('touchmove', (e)=>{
                    if (e.touches.length === 2 && pinchStartDist) {
                        const dx = e.touches[0].clientX - e.touches[1].clientX;
                        const dy = e.touches[0].clientY - e.touches[1].clientY;
                        const dist = Math.hypot(dx, dy);
                        const factor = dist / pinchStartDist;
                        scale = clamp(pinchStartScale * factor, 1, 4);
                        apply();
                    } else if (e.touches.length === 1 && dragging && scale > 1) {
                        const cx = e.touches[0].clientX, cy = e.touches[0].clientY;
                        tx += (cx - sx); ty += (cy - sy); sx = cx; sy = cy; apply();
                    }
                }, { passive: true });
                container.addEventListener('touchend', ()=>{ dragging=false; pinchStartDist=0; });
            }
        }

        function initFullscreenImageGallery(){
            if (window._customImageGallerySetup) return;
            window._customImageGallerySetup = true;

            const imageHrefPattern = /\.(png|jpe?g|webp|gif)(\?.*)?$/i;

            const overlay = document.createElement('div');
            overlay.className = 'custom-lightbox';
            overlay.setAttribute('aria-hidden', 'true');
            overlay.innerHTML = `
                <button type="button" class="custom-lightbox-close" aria-label="Kapat">&times;</button>
                <button type="button" class="custom-lightbox-nav prev" aria-label="Onceki">&#10094;</button>
                <div class="custom-lightbox-stage">
                    <img class="custom-lightbox-image" alt="">
                    <div class="custom-lightbox-counter"></div>
                </div>
                <button type="button" class="custom-lightbox-nav next" aria-label="Sonraki">&#10095;</button>
            `;
            document.body.appendChild(overlay);

            const imageEl = overlay.querySelector('.custom-lightbox-image');
            const stageEl = overlay.querySelector('.custom-lightbox-stage');
            const counterEl = overlay.querySelector('.custom-lightbox-counter');
            const prevBtn = overlay.querySelector('.custom-lightbox-nav.prev');
            const nextBtn = overlay.querySelector('.custom-lightbox-nav.next');
            const closeBtn = overlay.querySelector('.custom-lightbox-close');

            let items = [];
            let activeIndex = 0;
            let scale = 1;
            let tx = 0;
            let ty = 0;
            let dragging = false;
            let startX = 0;
            let startY = 0;
            let pinchStartDistance = 0;
            let pinchStartScale = 1;
            let lastTouchEndTime = 0;
            let touchStartX = 0;
            let touchStartY = 0;
            let swipeDeltaX = 0;
            let swipeDeltaY = 0;
            let suppressOverlayClick = false;

            const isOpen = () => overlay.classList.contains('is-open');
            const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
            const getTouchDistance = (touches) => {
                if (!touches || touches.length < 2) return 0;
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                return Math.hypot(dx, dy);
            };

            const applyTransform = () => {
                imageEl.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
                imageEl.style.cursor = scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in';
            };

            const resetTransform = () => {
                scale = 1;
                tx = 0;
                ty = 0;
                dragging = false;
                applyTransform();
            };

            const render = () => {
                if (!items.length) return;
                const current = items[activeIndex];
                imageEl.src = current.href;
                imageEl.alt = current.alt || 'Gorsel';
                counterEl.textContent = items.length > 1 ? `${activeIndex + 1} / ${items.length}` : '';
                prevBtn.style.display = items.length > 1 ? 'flex' : 'none';
                nextBtn.style.display = items.length > 1 ? 'flex' : 'none';
                resetTransform();
            };

            const open = (galleryItems, index) => {
                items = galleryItems;
                activeIndex = index;
                render();
                overlay.classList.add('is-open');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.classList.add('custom-lightbox-open');
            };

            const close = () => {
                overlay.classList.remove('is-open');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('custom-lightbox-open');
                imageEl.removeAttribute('src');
                resetTransform();
            };

            const goTo = (direction) => {
                if (items.length < 2) return;
                activeIndex = (activeIndex + direction + items.length) % items.length;
                render();
            };

            prevBtn.addEventListener('click', () => goTo(-1));
            nextBtn.addEventListener('click', () => goTo(1));
            closeBtn.addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (suppressOverlayClick) {
                    suppressOverlayClick = false;
                    return;
                }
                if (e.target === overlay || e.target.classList.contains('custom-lightbox-stage')) {
                    close();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (!isOpen()) return;
                if (e.key === 'Escape') close();
                if (e.key === 'ArrowLeft') goTo(-1);
                if (e.key === 'ArrowRight') goTo(1);
            });

            stageEl.addEventListener('wheel', (e) => {
                if (!isOpen()) return;
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.2 : -0.2;
                scale = clamp(scale + delta, 1, 4);
                if (scale === 1) {
                    tx = 0;
                    ty = 0;
                }
                applyTransform();
            }, { passive: false });

            imageEl.addEventListener('mousedown', (e) => {
                if (scale <= 1) return;
                e.preventDefault();
                dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                applyTransform();
            });

            window.addEventListener('mousemove', (e) => {
                if (!dragging || scale <= 1 || !isOpen()) return;
                tx += e.clientX - startX;
                ty += e.clientY - startY;
                startX = e.clientX;
                startY = e.clientY;
                applyTransform();
            });

            window.addEventListener('mouseup', () => {
                if (!dragging) return;
                dragging = false;
                applyTransform();
            });

            imageEl.addEventListener('dblclick', () => {
                if (scale === 1) {
                    scale = 2;
                } else {
                    scale = 1;
                    tx = 0;
                    ty = 0;
                }
                applyTransform();
            });

            stageEl.addEventListener('touchstart', (e) => {
                if (!isOpen()) return;

                if (e.touches.length === 2) {
                    e.preventDefault();
                    dragging = false;
                    pinchStartDistance = getTouchDistance(e.touches);
                    pinchStartScale = scale;
                    return;
                }

                if (e.touches.length === 1) {
                    const now = Date.now();
                    if (now - lastTouchEndTime < 280) {
                        e.preventDefault();
                        if (scale === 1) {
                            scale = 2;
                        } else {
                            scale = 1;
                            tx = 0;
                            ty = 0;
                        }
                        applyTransform();
                        lastTouchEndTime = 0;
                        return;
                    }

                    dragging = scale > 1;
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                    swipeDeltaX = 0;
                    swipeDeltaY = 0;
                }
            }, { passive: false });

            stageEl.addEventListener('touchmove', (e) => {
                if (!isOpen()) return;

                if (e.touches.length === 2 && pinchStartDistance) {
                    e.preventDefault();
                    const currentDistance = getTouchDistance(e.touches);
                    if (!currentDistance) return;
                    scale = clamp((currentDistance / pinchStartDistance) * pinchStartScale, 1, 4);
                    if (scale === 1) {
                        tx = 0;
                        ty = 0;
                    }
                    applyTransform();
                    return;
                }

                if (e.touches.length === 1 && dragging && scale > 1) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    tx += touch.clientX - startX;
                    ty += touch.clientY - startY;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    applyTransform();
                    return;
                }

                if (e.touches.length === 1 && scale === 1) {
                    const touch = e.touches[0];
                    swipeDeltaX = touch.clientX - touchStartX;
                    swipeDeltaY = touch.clientY - touchStartY;
                    if (Math.abs(swipeDeltaX) > Math.abs(swipeDeltaY)) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });

            stageEl.addEventListener('touchend', () => {
                if (!isOpen()) return;
                if (scale === 1 && Math.abs(swipeDeltaX) > 50 && Math.abs(swipeDeltaX) > Math.abs(swipeDeltaY) * 1.2) {
                    suppressOverlayClick = true;
                    goTo(swipeDeltaX < 0 ? 1 : -1);
                }
                dragging = false;
                pinchStartDistance = 0;
                pinchStartScale = scale;
                swipeDeltaX = 0;
                swipeDeltaY = 0;
                lastTouchEndTime = Date.now();
                applyTransform();
            }, { passive: true });

            document.addEventListener('click', (e) => {
                const link = e.target.closest('a.venobox');
                if (!link) return;

                const href = link.getAttribute('href') || '';
                if (!imageHrefPattern.test(href)) return;

                e.preventDefault();
                e.stopPropagation();
                if (typeof e.stopImmediatePropagation === 'function') {
                    e.stopImmediatePropagation();
                }

                const group = link.getAttribute('data-gall');
                const candidates = Array.from(document.querySelectorAll('a.venobox')).filter((anchor) => {
                    const anchorHref = anchor.getAttribute('href') || '';
                    if (!imageHrefPattern.test(anchorHref)) return false;
                    if (!group) return anchor === link;
                    return anchor.getAttribute('data-gall') === group;
                });

                const galleryItems = candidates.map((anchor) => ({
                    href: anchor.getAttribute('href'),
                    alt: anchor.querySelector('img')?.getAttribute('alt') || '',
                }));
                const index = Math.max(candidates.indexOf(link), 0);

                open(galleryItems, index);
            }, true);
        }

        function initLightGallery(){
            // Disabled to avoid the commercial license warning in dev.
            // PhotoSwipe and Venobox continue to handle gallery/lightbox behavior.
            return;
        }

        // PhotoSwipe
        function initPhotoSwipe(){
            if (typeof PhotoSwipeLightbox !== 'function') return;
            document.querySelectorAll('.gallery-lightbox').forEach(function(el){
                if (el._pswp) return;
                const pswp = new PhotoSwipeLightbox({
                    gallery: el,
                    children: '.gallery-item',
                    pswpModule: PhotoSwipe
                });
                pswp.on('uiRegister', function() {
                    // Zoom button
                    pswp.ui.registerElement({
                        name: 'zoom-button',
                        order: 9,
                        isButton: true,
                        title: 'Zoom',
                        html: '🔍',
                        onClick: function() {
                            const curr = pswp.currSlide;
                            const zoomLevel = pswp.currZoomLevel < pswp.zoomLevels[pswp.zoomLevels.length - 1] ? pswp.zoomLevels[pswp.zoomLevels.length - 1] : pswp.zoomLevels[0];
                            pswp.zoomTo(zoomLevel, { x: pswp.viewportCenter.x, y: pswp.viewportCenter.y }, 300);
                        }
                    });
                });
                pswp.init();
                el._pswp = pswp;
            });
        }


        // Project Carousel

        var swiperProject = new Swiper(".project-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        var swiperProject2 = new Swiper(".project-carousel-2", {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: false,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });

        // Service Carousel
        var swiperService = new Swiper(".service-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Service Carousel
        var swiperService = new Swiper(".service-carousel-3", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
            },
        });

        // Gallary Carousel (About page)
        var swiperGallary = new Swiper(".gallary-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            loop: true,
            autoplay: false,
            grabCursor: true,
            speed: 800,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            watchSlidesProgress: true,
            updateOnWindowResize: true,
            navigation: {
                nextEl: '.gallary-carousel-wrap .swiper-next',
                prevEl: '.gallary-carousel-wrap .swiper-prev',
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 }
            }
        });
        // İlk yüklemede görseller yüklenince metrikleri güncelle
        if (window.imagesLoaded) {
            var gallaryWrap = document.querySelector('.gallary-carousel .swiper-wrapper') || document.querySelector('.gallary-carousel');
            if (gallaryWrap) {
                imagesLoaded(gallaryWrap, function () {
                    try { swiperGallary.update(); } catch(e){}
                });
            }
        }

        // Testi Carousel
        var testiCarouselEl = document.querySelector(".testi-carousel");
        if (testiCarouselEl && !testiCarouselEl.swiper) {
            var swiperTesti = new Swiper(testiCarouselEl, {
                slidesPerView: 1,
                spaceBetween: 24,
                slidesPerGroup: 1,
                loop: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                allowTouchMove: true,
                simulateTouch: true,
                touchRatio: 1,
                touchStartPreventDefault: false,
                passiveListeners: false,
                grabCursor: true,
                speed: 800,
                navigation: {
                    nextEl: '.testi-top-content-wrap .swiper-prev',
                    prevEl: '.testi-top-content-wrap .swiper-next',
                },
            });
            try { swiperTesti.autoplay && swiperTesti.autoplay.start && swiperTesti.autoplay.start(); } catch(e){}
        }

        //Testi Carousel

        var swiperTesti = new Swiper(".testi-carousel-3", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            direction: "vertical",
            mousewheel: {
                enabled: true,
                sensitivity: 4, 
                invert: true,
            },
        });

        var swiperHistory = new Swiper(".testi-carousel-5", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: false,
            grabcursor: true,
            speed: 800,
            navigation: {
                nextEl: '.testi-top-content-wrap-5 .swiper-prev',
                prevEl: '.testi-top-content-wrap-5 .swiper-next',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Project Carousel
        var getHistoryOptions = function(){
            return {
                slidesPerView: 4,
                spaceBetween: 24,
                slidesPerGroup: 1,
                loop: true,
                freeMode: true,
                freeModeMomentum: false,
                autoplay: {
                    delay: 1,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    waitForTransition: false,
                },
                allowTouchMove: true,
                simulateTouch: true,
                touchRatio: 1,
                touchStartPreventDefault: false,
                passiveListeners: false,
                grabcursor: true,
                speed: 5000,
                observer: true,
                observeParents: true,
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    },
                    767: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                    },
                    1024: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                    },
                    1200: {
                        slidesPerView: 4,
                        slidesPerGroup: 1,
                    },
                },
            };
        };
        var swiperHistory = document.querySelector(".history-carousel") ? new Swiper(".history-carousel", getHistoryOptions()) : null;
        try { swiperHistory && swiperHistory.autoplay && swiperHistory.autoplay.start && swiperHistory.autoplay.start(); } catch(e){}

        $(document).off("click.historyCard").on("click.historyCard", ".history-carousel .history-item", function(e){
            if ($(e.target).closest("a").length) return;
            var href = $(this).find(".history-content .title a").attr("href");
            if (href) {
                window.location.href = href;
            }
        });

        // Sponsor Carousel
        var swiperSponsor = new Swiper(".sponsor-carousel", {
            slidesPerView: 6,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            freeMode: true,
            freeModeMomentum: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                waitForTransition: false,
            },
            allowTouchMove: true,
            simulateTouch: true,
            touchRatio: 1,
            touchStartPreventDefault: false,
            passiveListeners: false,
            grabcursor: true,
            speed: 6000,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                },
                1199: {
                    slidesPerView: 6,
                    slidesPerGroup: 1,
                },
            },
        });

        // Blog Carousel
        var swiperBlog = new Swiper(".blog-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1199: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Blog Carousel
        var swiperBlog = new Swiper(".blog-carousel-2", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 800,
            centeredSlides: true,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
                1199: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });


        // Blog Carousel
        var swiperBlog = new Swiper(".blog-carousel-3", {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 800,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1199: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });

        // hover reveal start
            const hoverItems = document.querySelectorAll(".service-hover-reveal-item");

            const OFFSET_X = 120;
            const OFFSET_Y = 0;

            hoverItems.forEach((item) => {
                const img = item.querySelector(".hover-img");
                if (!img) return;

                let tl = gsap.timeline({ paused: true });

                item.addEventListener("mouseenter", () => {
                    const rect = item.getBoundingClientRect();
                    const x = rect.width + OFFSET_X;
                    const y = rect.height / 2 + OFFSET_Y;

                    gsap.set(img, { x, y });

                    tl.clear()
                    .to(img, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power3.out"
                    })
                    .from(img, {
                        x: x + 40,
                        duration: 0.6,
                        ease: "power3.out"
                    }, 0);

                    tl.play();
                });

                item.addEventListener("mouseleave", () => {
                    gsap.to(img, {
                        opacity: 0,
                        scale: 0.95,
                        x: "+=20",
                        duration: 0.4,
                        ease: "power2.inOut"
                    });
                });
            });
	    // hover reveal end

        // Hover Effect Project
        function activateOnHover(selector, activeClass = "active") {
            const elements = document.querySelectorAll(selector);
            let lastActiveElement = null;
            elements.forEach((element) => {
                element.addEventListener("mouseenter", () => {
                    elements.forEach((el) => el.classList.remove(activeClass));
                    element.classList.add(activeClass);
                    lastActiveElement = element;
                });
            });
            if (lastActiveElement) {
                lastActiveElement.classList.add(activeClass);
            }
        }
        // Card Hover
        activateOnHover(".project-accordian .project-card", "active");


        // Project Home 9

        const trigger = document.querySelector(".project-wrap-9");

        if (trigger) {
            const items = trigger.querySelectorAll(".project-item-3");

            items[0].classList.add("active");

            items.forEach(item => {
                item.addEventListener("mouseenter", function() {
                    items.forEach(el => el.classList.remove("active"));
                    this.classList.add("active");
                });
            });
        }

        // carouselTicker initail 
        $('.carouselTicker-nav').carouselTicker({
        });
        $(".carouselTicker-start").carouselTicker({
            direction: "next",
        });

        //Running Animated Text
        const scrollers = document.querySelectorAll(".scroller");

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true);

                const scrollerInner = scroller.querySelector(".scroller__inner");
                const scrollerContent = Array.from(scrollerInner.children);

                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }

        // BG Image Animation
        (function () {
            const parallaxArea = document.querySelector(".parallax-area");
            const parallaxImg  = document.querySelector(".bg-img-parallax");

            // stop silently if elements don't exist
            if (!parallaxArea || !parallaxImg) return;

            gsap.to(parallaxImg, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: parallaxArea,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

        })();

        // Service Animation
        gsap.utils.toArray(".project-item-wrap-2 .project-item-2").forEach((element, index, array) => {
        if (index === array.length - 1) return;

            const delay = parseFloat(element.getAttribute("data-ani-delay")) || 0;
            gsap.to(element, {
                scale: .6,
                opacity: 0,
                duration: 2,
                delay: delay,
                scrollTrigger: {
                    trigger: element,
                    start: "top 15%",
                    end: "bottom 15%",
                    scrub: 2,
                    pin: true,
                    pinSpacing: false,
                    markers: false
                }
            });
        });

        // 

        gsap.registerPlugin(ScrollTrigger);

        const mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {

        const scrollArea = document.querySelector(".scroll-area");
        const scrollImg  = document.querySelector(".scroll-img");

        // ✅ Run only if elements exist
        if (!scrollArea || !scrollImg) return;

        gsap.to(scrollImg, {
            x: -400,
            ease: "none",
            scrollTrigger: {
            trigger: scrollArea,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
            invalidateOnRefresh: true
            }
        });

        // cleanup
        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
            gsap.set(scrollImg, { x: 0 });
        };
        });

        // Sticky Element

        gsap.registerPlugin(ScrollTrigger);
        const localMM = gsap.matchMedia();

        localMM.add("(min-width: 1024px)", () => {

            const pinInner = document.querySelector(".pin-inner");
            const pinBox = document.querySelector(".pin-box");
            const scrollContent = document.querySelector(".scroll-content");

            if (!pinInner || !pinBox || !scrollContent) return;

            const trigger = ScrollTrigger.create({
                trigger: pinInner,
                start: "-150px top",
                endTrigger: scrollContent,
                end: "bottom bottom",
                pin: pinBox
            });

            return () => trigger.kill();
        });

        // Image Reveal

        gsap.registerPlugin(ScrollTrigger);

        let revealContainers = document.querySelectorAll(".reveal");

        revealContainers.forEach((container) => {
        let image = container.querySelector("img");
        let tl = gsap.timeline({
            scrollTrigger: {
            trigger: container,
            toggleActions: "restart none none reset"
            }
        });

        tl.set(container, { autoAlpha: 1 });
            tl.from(container, 1.5, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1.5, {
                xPercent: 100,
                scale: 1.3,
                delay: -1.5,
                ease: Power2.out
            });
        });

        const images = document.querySelectorAll(".img-reveal");

        const removeOverlay = overlay => {
            let tl = gsap.timeline();

            tl.to(overlay, {
                duration: 1.4,
                ease: "Power2.easeInOut",
                width: "0%"
            });

            return tl;
        };

        const scaleInImage = image => {
            let tl = gsap.timeline();

            tl.from(image, {
                duration: 1.4,
                scale: 1.4,
                ease: "Power2.easeInOut"
            });

            return tl;
        };

        images.forEach(image => {
        
            gsap.set(image, {
                visibility: "visible"
            });
        
            const overlay = image.querySelector('.img-overlay');
            const img = image.querySelector("img");

            const masterTL = gsap.timeline({ paused: true });
            masterTL
            .add(removeOverlay(overlay))
            .add(scaleInImage(img), "-=1.4");
        
        
        let options = {
            threshold: 0
        }

            const io = new IntersectionObserver((entries, options) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        masterTL.play();
                    } else {
                masterTL.progress(0).pause()
            }
                });
            }, options);

            io.observe(image);
        });

        // Scroll Animation

        let typeSplit = new SplitType("[data-text-animation]", {
            types: "lines,words, chars",
            className: "line",
        });
        var text_animations = document.querySelectorAll(
            "[data-text-animation]"
            );
            
            function createScrollTrigger(triggerElement, timeline) {
            // Play tl when scrolled into view (60% from top of screen)
            ScrollTrigger.create({
                trigger: triggerElement,
                start: "top 80%",
                onEnter: () => timeline.play(),
                toggleClass: {targets: triggerElement, className: "active"} 
            });
        }

            text_animations.forEach((animation) => {
            let type = "slide-up",
            duration = 0.75,
            offset = 80,
            stagger = 0.6,
            delay = 0,
            scroll = 1,
            split = "line",
            ease = "power2.out";
        // Set attribute
        if (animation.getAttribute("data-stagger")) {
            stagger = animation.getAttribute("data-stagger");
        }
        if (animation.getAttribute("data-duration")) {
            duration = animation.getAttribute("data-duration");
        }
        if (animation.getAttribute("data-text-animation")) {
            type = animation.getAttribute("data-text-animation");
        }
        if (animation.getAttribute("data-delay")) {
            delay = animation.getAttribute("data-delay");
        }
        if (animation.getAttribute("data-ease")) {
            ease = animation.getAttribute("data-ease");
        }
        if (animation.getAttribute("data-scroll")) {
            scroll = animation.getAttribute("data-scroll");
        }
        if (animation.getAttribute("data-offset")) {
            offset = animation.getAttribute("data-offset");
        }
        if (animation.getAttribute("data-split")) {
            split = animation.getAttribute("data-split");
        }
        if (scroll == 1) {
            if (type == "slide-up") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                yPercent: offset,
                duration,
                ease,
                opacity: 0,
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "slide-down") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                yPercent: -offset,
                duration,
                ease,
                opacity: 0,
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "rotate-in") {
            let tl = gsap.timeline({ paused: true });
            tl.set(animation.querySelectorAll(`.${split}`), {
                transformPerspective: 400,
            });
            tl.from(animation.querySelectorAll(`.${split}`), {
                rotationX: -offset,
                duration,
                ease,
                force3D: true,
                opacity: 0,
                transformOrigin: "top center -50",
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "slide-from-left") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                xPercent: -offset,
                duration,
                opacity: 0,
                ease,
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "slide-from-right") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                xPercent: offset,
                duration,
                opacity: 0,
                ease,
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "fade-in") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                duration,
                ease,
                opacity: 0,
                stagger: { amount: stagger },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-right") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    x: 100,
                    autoAlpha: 0,
                    duration,
                    stagger: stagger,
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-bottom-line") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    autoAlpha: 0,
                    rotationX: -80,
                    force3D: true,
                    transformOrigin: "top center -50",
                    delay: 0.3,
                    duration,
                    stagger: stagger,
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-random") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                duration,
                ease,
                opacity: 0,
                stagger: { amount: stagger, from: "random" },
            });
            createScrollTrigger(animation, tl);
            }
            if (type == "scrub") {
            let tl = gsap.timeline({
                scrollTrigger: {
                trigger: animation,
                start: "top 90%",
                end: "top center",
                scrub: true,
                },
            });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0.2,
                duration,
                ease,
                stagger: { amount: stagger },
            });
            }

            // Avoid flash of unstyled content
            gsap.set("[data-text-animation]", { opacity: 1 });
        } else {
            if (type == "slide-up") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                yPercent: offset,
                duration,
                ease,
                opacity: 0,
            });
            }
            if (type == "slide-down") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                yPercent: -offset,
                duration,
                ease,
                opacity: 0,
            });
            }
            if (type == "rotate-in") {
            let tl = gsap.timeline({ paused: true });
            tl.set(animation.querySelectorAll(`.${split}`), {
                transformPerspective: 400,
            });
            tl.from(animation.querySelectorAll(`.${split}`), {
                rotationX: -offset,
                duration,
                ease,
                force3D: true,
                opacity: 0,
                transformOrigin: "top center -50",
            });
            }
            if (type == "slide-from-right") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                xPercent: offset,
                duration,
                opacity: 0,
                ease,
            });
            }
            if (type == "fade-in") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                duration,
                ease,
                opacity: 0,
            });
            }
            if (type == "fade-in-random") {
            let tl = gsap.timeline({ paused: true });
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0,
                duration,
                ease,
                opacity: 0,
                stagger: { amount: stagger, from: "random" },
            });
            }
            if (type == "scrub") {
            tl.from(animation.querySelectorAll(`.${split}`), {
                opacity: 0.2,
                duration,
                ease,
            });
            }
        }
        });

        if ($(".fade-wrapper").length > 0) {
            $(".fade-wrapper").each(function () {
                var section = $(this);
                var fadeItems = section.find(".fade-top");
        
                fadeItems.each(function (index, element) {
                var delay = index * 0.10;
        
                gsap.set(element, {
                    opacity: 0,
                    y: 100,
                });
        
                ScrollTrigger.create({
                    trigger: element,
                    start: "top 100%",
                    end: "bottom 20%",
                    scrub: 0.5,
                    onEnter: function () {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: delay,
                    });
                    },
                    once: true,
                });
                });
            });
        }

        let fadeArray_items = document.querySelectorAll(".slide-anim");
        if (fadeArray_items.length > 0) {
            const fadeArray = gsap.utils.toArray(".slide-anim")
            fadeArray.forEach((item, i) => {
            var fade_direction = "bottom"
            var onscroll_value = 1
            var duration_value = 1.15
            var fade_offset = 50
            var delay_value = 0.15
            var ease_value = "power2.out"
            if (item.getAttribute("data-offset")) {
                fade_offset = item.getAttribute("data-offset");
            }
            if (item.getAttribute("data-duration")) {
                duration_value = item.getAttribute("data-duration");
            }
            if (item.getAttribute("data-direction")) {
                fade_direction = item.getAttribute("data-direction");
            }
            if (item.getAttribute("data-on-scroll")) {
                onscroll_value = item.getAttribute("data-on-scroll");
            }
            if (item.getAttribute("data-delay")) {
                delay_value = item.getAttribute("data-delay");
            }
            if (item.getAttribute("data-ease")) {
                ease_value = item.getAttribute("data-ease");
            }
            let animation_settings = {
                opacity: 0,
                ease: ease_value,
                duration: duration_value,
                delay: delay_value,
            }
            if (fade_direction == "top") {
                animation_settings['y'] = -fade_offset
            }
            if (fade_direction == "left") {
                animation_settings['x'] = -fade_offset;
            }
            if (fade_direction == "bottom") {
                animation_settings['y'] = fade_offset;
            }
            if (fade_direction == "right") {
                animation_settings['x'] = fade_offset;
            }
            if (onscroll_value == 1) {
                animation_settings['scrollTrigger'] = {
                trigger: item,
                start: 'top 85%',
                }
            }
                gsap.from(item, animation_settings);
            })
        }
        
        window.addEventListener("load", (event) => {
            setTimeout(() => {
                function textAnimationEffect(){
                    let TextAnim = gsap.timeline();
                    let splitText = new SplitType( ".text-animation-effect", { types: 'chars' });
                    if( $('.text-animation-effect .char').length ){
                        TextAnim.from(".text-animation-effect .char", { duration: 1, x: 50, autoAlpha: 0, stagger: 0.1 }, "-=1");
                    }
                }
                textAnimationEffect();
            }, 200);
        });

        // scale animation 
        var scale = document.querySelectorAll(".scale");
        var image = document.querySelectorAll(".scale img");
        scale.forEach((item) => {
            gsap.to(item, {
            scale: 1,
            duration: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: "bottom top",
                toggleActions: 'play reverse play reverse'
            }
            });
        });
        image.forEach((image) => {
            gsap.set(image, {
            scale: 1.3,
            });
            gsap.to(image, {
            scale: 1,
            duration: 1,
            scrollTrigger: {
                trigger: image,
                start: 'top bottom',
                end: "bottom top",
                toggleActions: 'play reverse play reverse'
            }
            });
        })

        // Page Scroll Percentage
        function scrollTopPercentage() {
            const scrollPercentage = () => {
                const docEl = document.documentElement;
                const body = document.body;
                const scrollTopPos = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
                const scrollHeight = Math.max(
                    body.scrollHeight || 0,
                    docEl.scrollHeight || 0,
                    body.offsetHeight || 0,
                    docEl.offsetHeight || 0,
                    body.clientHeight || 0,
                    docEl.clientHeight || 0
                );
                const clientHeight = window.innerHeight || docEl.clientHeight || body.clientHeight || 0;
                const calcHeight = Math.max(scrollHeight - clientHeight, 1);
                const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
                const scrollElementWrap = $("#scroll-percentage");

                scrollElementWrap.css("background", `conic-gradient( var(--tl-color-common-white) ${scrollValue}%, var(--tl-color-theme-primary) ${scrollValue}%)`);
                
                // ScrollProgress
                if ( scrollTopPos > 100 ) {
                    scrollElementWrap.addClass("active");
                } else {
                    scrollElementWrap.removeClass("active");
                }

                $("#scroll-percentage-value").html('<i class="fa-sharp fa-regular fa-arrow-up-long"></i>');
            }
            window.addEventListener("scroll", scrollPercentage, { passive: true });
            window.addEventListener("load", scrollPercentage);
            window.addEventListener("resize", scrollPercentage);
            scrollPercentage();

            // Back to Top
            function scrollToTop(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof e.stopImmediatePropagation === "function") {
                        e.stopImmediatePropagation();
                    }
                }
                try {
                    var smoother = window.ScrollSmoother && window.ScrollSmoother.get && window.ScrollSmoother.get();
                    if (smoother && typeof smoother.scrollTo === "function") {
                        smoother.scrollTo(0, true);
                    }
                } catch(err){}

                try {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } catch(err) {
                    window.scrollTo(0, 0);
                }

                try { document.documentElement.scrollTop = 0; } catch(err){}
                try { document.body.scrollTop = 0; } catch(err){}
                requestAnimationFrame(function(){
                    try { window.scrollTo(0, 0); } catch(err){}
                    try { document.documentElement.scrollTop = 0; } catch(err){}
                    try { document.body.scrollTop = 0; } catch(err){}
                });
                setTimeout(function(){
                    try { window.scrollTo(0, 0); } catch(err){}
                    try { document.documentElement.scrollTop = 0; } catch(err){}
                    try { document.body.scrollTop = 0; } catch(err){}
                }, 120);
            }

            var scrollButton = document.getElementById("scroll-percentage");
            if (scrollButton && !scrollButton.dataset.mobileBound) {
                scrollButton.dataset.mobileBound = "true";
                ["click", "touchstart", "pointerup"].forEach(function(eventName){
                    scrollButton.addEventListener(eventName, scrollToTop, { passive: false });
                });
            }
        }

        scrollTopPercentage();
    });

    document.querySelectorAll(".scroll-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            var sectionTarget = btn.getAttribute("data-target");
            gsap.to(window, {duration: 1, scrollTo:{y:sectionTarget, offsetY:70}});
        });
    });

    // Sync WhatsApp FAB with scroll-percentage size and theme color
    function syncWhatsAppFab(){
        try {
            var sp = document.getElementById('scroll-percentage');
            var wa = document.getElementById('whatsapp-fab');
            if (!sp || !wa) return;
            var rect = sp.getBoundingClientRect();
            var size = Math.max(rect.width || 56, rect.height || 56);
            wa.style.width = size + 'px';
            wa.style.height = size + 'px';
            var rootStyles = getComputedStyle(document.documentElement);
            var themeColor = rootStyles.getPropertyValue('--tl-color-theme-primary') || '#a47a4a';
            wa.style.background = themeColor.trim();
        } catch(e){}
    }
    window.addEventListener('load', syncWhatsAppFab);
    window.addEventListener('resize', function(){ clearTimeout(window.__waSyncT); window.__waSyncT = setTimeout(syncWhatsAppFab, 150); });
    $(document).on('page:mounted', syncWhatsAppFab);
 
    const sm = gsap.matchMedia();
	sm.add("(min-width: 768px)", () => {
		if (document.querySelector("#antra-smooth-wrapper") && document.querySelector("#antra-smooth-content")) {
			ScrollSmoother.create({
				wrapper: "#antra-smooth-wrapper",
				content: "#antra-smooth-content",
				smooth: 1.8,
				effects: true,
				smoothTouch: 0.15,
				ignoreMobileResize: true
			});
		}
	});

    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });

})(jQuery);
