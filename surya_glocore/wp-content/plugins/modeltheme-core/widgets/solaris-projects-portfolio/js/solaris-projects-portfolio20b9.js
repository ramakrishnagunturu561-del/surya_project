(function ($) {
    'use strict';

    function inEditMode() {
        return !!(
            window.elementorFrontend &&
            typeof window.elementorFrontend.isEditMode === 'function' &&
            window.elementorFrontend.isEditMode()
        );
    }

    function readDataYesNo($el, key) {
        return ($el.attr('data-' + key) || '') === 'yes';
    }

    function readDataInt($el, key, fallback) {
        var value = parseInt($el.attr('data-' + key), 10);
        return isNaN(value) ? fallback : value;
    }

    function readDataString($el, key, fallback) {
        var value = $el.attr('data-' + key);
        if (typeof value !== 'string' || value === '') {
            return fallback;
        }
        return value;
    }

    function destroySwiper($section) {
        var sw = $section.data('mtfePpSwiper');
        if (sw && typeof sw.destroy === 'function') {
            try {
                sw.destroy(true, true);
            } catch (e) {
                /* noop */
            }
        }
        $section.removeData('mtfePpSwiper');
    }

    function initSwiper($section) {
        var sliderNode = $section.find('.mtfe-solaris-projects-portfolio__swiper')[0];
        var nextBtnNode = $section.find('.mtfe-solaris-projects-portfolio__nav-btn--next')[0];
        var prevBtnNode = $section.find('.mtfe-solaris-projects-portfolio__nav-btn--prev')[0];
        var counterCurrentNode = $section.find('.mtfe-solaris-projects-portfolio__counter-current')[0];
        var counterTotalNode = $section.find('.mtfe-solaris-projects-portfolio__counter-total')[0];

        if (!sliderNode || !nextBtnNode || !prevBtnNode || typeof Swiper === 'undefined') {
            return;
        }

        destroySwiper($section);

        var slideCount = $(sliderNode).find('.swiper-wrapper > .swiper-slide').length;
        var initialMode = readDataString($section, 'initial-slide-mode', 'middle');
        var initialSlide = initialMode === 'first' ? 0 : (slideCount > 0 ? Math.floor((slideCount - 1) / 2) : 0);
        var centeredSlides = readDataYesNo($section, 'centered-slides');
        var wantLoop = readDataYesNo($section, 'infinite-loop');
        var rewind = readDataYesNo($section, 'rewind');
        var useLoop = wantLoop && slideCount > 1;

        var speed = Math.max(100, readDataInt($section, 'slider-speed', 640));
        var spaceMobile = Math.max(0, readDataInt($section, 'space-mobile', 16));
        var spaceTablet = Math.max(0, readDataInt($section, 'space-tablet', 18));
        var spaceDesktop = Math.max(0, readDataInt($section, 'space-desktop', 20));
        var spaceLarge = Math.max(0, readDataInt($section, 'space-large', 22));

        var updateCounter = function (swiper) {
            if (!swiper || !counterCurrentNode || !counterTotalNode || slideCount < 1) {
                return;
            }
            var idx = typeof swiper.realIndex === 'number' ? swiper.realIndex : (swiper.activeIndex || 0);
            counterCurrentNode.textContent = String(idx + 1);
            counterTotalNode.textContent = String(slideCount);
        };

        var syncCenter = function (swiper) {
            if (!swiper) return;
            if (!centeredSlides || slideCount < 1) {
                updateCounter(swiper);
                return;
            }
            swiper.update();
            swiper.slideTo(initialSlide, 0, false);
            updateCounter(swiper);
        };

        var loopedSlides = useLoop ? Math.max(2, Math.min(slideCount, 8)) : undefined;

        var sw = new Swiper(sliderNode, {
            slidesPerView: 'auto',
            centeredSlides: centeredSlides,
            centeredSlidesBounds: false,
            loop: useLoop,
            loopedSlides: loopedSlides,
            rewind: useLoop ? false : rewind,
            initialSlide: initialSlide,
            speed: speed,
            grabCursor: true,
            watchOverflow: !useLoop,
            observer: false,
            observeParents: false,
            spaceBetween: spaceMobile,
            navigation: {
                nextEl: nextBtnNode,
                prevEl: prevBtnNode
            },
            on: {
                init: function (swiper) {
                    syncCenter(swiper);
                    requestAnimationFrame(function () {
                        syncCenter(swiper);
                    });
                },
                imagesReady: function (swiper) {
                    var sw = swiper || $section.data('mtfePpSwiper');
                    if (!sw || sw.destroyed) return;
                    sw.update();
                    updateCounter(sw);
                    requestAnimationFrame(function () {
                        syncCenter(sw);
                    });
                },
                slideChange: function (swiper) {
                    updateCounter(swiper);
                }
            },
            breakpoints: {
                640: { spaceBetween: spaceTablet },
                1024: { spaceBetween: spaceDesktop },
                1400: { spaceBetween: spaceLarge }
            }
        });

        if (inEditMode()) {
            setTimeout(function () {
                if (sw && !sw.destroyed) {
                    sw.update();
                    syncCenter(sw);
                }
            }, 80);
        }

        $section.data('mtfePpSwiper', sw);
    }

    /* -- Zoom panel ----------------------------------------------------------- */

    var $zoom = null;
    var zoomHideTimer = null;
    var zoomSwitchTimer = null;

    function getOrCreateZoom() {
        if ($zoom && $zoom.length) return $zoom;

        $zoom = $('<div class="mtfe-pp-zoom" aria-hidden="true">' +
            '<img class="mtfe-pp-zoom__img" src="" alt="">' +
            '<div class="mtfe-pp-zoom__panel">' +
                '<p class="mtfe-pp-zoom__type"></p>' +
                '<h3 class="mtfe-pp-zoom__title"></h3>' +
                '<p class="mtfe-pp-zoom__desc"></p>' +
                '<div class="mtfe-pp-zoom__metrics"></div>' +
            '</div>' +
        '</div>');

        $('body').append($zoom);
        return $zoom;
    }

    function positionZoom($card) {
        var rect   = $card[0].getBoundingClientRect();
        var panelW = 520;
        var panelH = 560;
        var margin = 16;
        var overlap = 160; // how many px the panel slides over the card

        // Default: appear to the right, overlapping the card's right edge
        var left = rect.right - overlap;
        if (left + panelW > window.innerWidth - margin) {
            // Flip left: overlap the card's left edge instead
            left = rect.left + overlap - panelW;
        }
        left = Math.max(margin, left);

        var top = rect.top + (rect.height / 2) - (panelH / 2);
        top = Math.max(margin, Math.min(top, window.innerHeight - panelH - margin));

        $zoom.css({ left: left + 'px', top: top + 'px' });
    }

    function populateZoom($card) {
        var $z     = $zoom;
        var imgSrc = $card.attr('data-zoom-img') || $card.find('.mtfe-solaris-projects-portfolio__card-image').attr('src') || '';
        var type   = $card.find('.mtfe-solaris-projects-portfolio__card-type').text().trim();
        var title  = $card.find('.mtfe-solaris-projects-portfolio__card-title').text().trim();
        var desc   = $card.attr('data-zoom-desc') || '';

        $z.find('.mtfe-pp-zoom__img').attr('src', imgSrc).attr('alt', title);
        $z.find('.mtfe-pp-zoom__type').text(type);
        $z.find('.mtfe-pp-zoom__title').text(title);
        $z.find('.mtfe-pp-zoom__desc').text(desc).toggle(desc !== '');

        var metricIcons = [
            '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
            '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
            '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'
        ];

        var $metricsEl = $card.find('.mtfe-solaris-projects-portfolio__metrics');
        var $zMetrics  = $z.find('.mtfe-pp-zoom__metrics').empty();
        var metricIdx  = 0;
        $metricsEl.find('p').each(function () {
            var label     = $(this).find('span').text().trim();
            var value     = $(this).find('strong').text().trim();
            if (label || value) {
                var iconPath  = metricIcons[metricIdx] || metricIcons[0];
                var svgAttrs  = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
                $zMetrics.append(
                    '<div class="mtfe-pp-zoom__metric">' +
                        '<span class="mtfe-pp-zoom__metric-icon"><svg ' + svgAttrs + '>' + iconPath + '</svg></span>' +
                        '<span class="mtfe-pp-zoom__metric-body">' +
                            '<span class="mtfe-pp-zoom__metric-label">' + label + '</span>' +
                            '<strong class="mtfe-pp-zoom__metric-value">' + value + '</strong>' +
                        '</span>' +
                    '</div>'
                );
                metricIdx++;
            }
        });

        // Restart slow zoom-in animation
        var imgEl = $z.find('.mtfe-pp-zoom__img')[0];
        if (imgEl) {
            imgEl.style.animation = 'none';
            imgEl.offsetHeight;
            imgEl.style.animation = '';
        }
    }

    function showZoom($card) {
        if (inEditMode()) return;

        var $z = getOrCreateZoom();
        clearTimeout(zoomHideTimer);
        clearTimeout(zoomSwitchTimer);

        var isVisible = $z.hasClass('is-visible');

        if (!isVisible) {
            // First appearance: populate immediately then fade in
            populateZoom($card);
            positionZoom($card);
            $z.addClass('is-visible');
        } else {
            // Switching between cards: fade out, swap content, fade back in
            $z.css('opacity', '0');
            zoomSwitchTimer = setTimeout(function () {
                populateZoom($card);
                positionZoom($card);
                $z.css('opacity', '');
            }, 300);
        }
    }

    function hideZoom() {
        if (!$zoom) return;
        clearTimeout(zoomHideTimer);
        clearTimeout(zoomSwitchTimer);
        zoomHideTimer = setTimeout(function () {
            $zoom.removeClass('is-visible').css('opacity', '');
        }, 120);
    }

    function initZoomHovers($section) {
        $section.find('.mtfe-solaris-projects-portfolio__card').each(function () {
            var $card = $(this);
            $card.off('mouseenter.mtfezoom mouseleave.mtfezoom');
            $card.on('mouseenter.mtfezoom', function () { showZoom($card); });
            $card.on('mouseleave.mtfezoom', function () { hideZoom(); });
        });
    }

    /* -- Instance ------------------------------------------------------------- */

    function destroyInstance($section) {
        destroySwiper($section);
        $section.find('.mtfe-solaris-projects-portfolio__card').off('.mtfezoom');
        $section.removeData('mtfeSolarisProjectsPortfolioInit');
    }

    function initInstance($section) {
        if (!$section.length || !$section.hasClass('mtfe-solaris-projects-portfolio')) {
            return;
        }

        destroyInstance($section);
        initSwiper($section);
        initZoomHovers($section);
        $section.data('mtfeSolarisProjectsPortfolioInit', true);
    }

    function initAll($scope) {
        var $widgets = $scope.hasClass('mtfe-solaris-projects-portfolio')
            ? $scope
            : $scope.find('.mtfe-solaris-projects-portfolio');

        $widgets.each(function () {
            initInstance($(this));
        });
    }

    $(document).ready(function () {
        initAll($(document));
    });

    $(window).on('elementor/frontend/init', function () {
        if (typeof elementorFrontend === 'undefined' || !elementorFrontend.hooks) {
            return;
        }

        elementorFrontend.hooks.addAction('frontend/element_ready/mtfe-solaris-projects-portfolio.default', function ($scope) {
            initAll($scope);
        });
    });
})(jQuery);

