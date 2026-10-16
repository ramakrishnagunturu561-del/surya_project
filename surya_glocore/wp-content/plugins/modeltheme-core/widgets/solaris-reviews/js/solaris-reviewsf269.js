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


    function cleanupLoopClones($wrapper) {
        $wrapper.children('[data-mtfe-rev-clone="true"]').remove();
    }

    function ensureMinSlidesForLoop($section, $wrapper, loopEnabled, minSlides) {
        cleanupLoopClones($wrapper);
        if (!loopEnabled || minSlides < 2) {
            return;
        }

        var $sourceSlides = $wrapper.children('.swiper-slide');
        var baseCount = $sourceSlides.length;
        if (!baseCount || baseCount >= minSlides) {
            return;
        }

        var duplicateIndex = 0;
        while ($wrapper.children('.swiper-slide').length < minSlides) {
            var source = $sourceSlides.get(duplicateIndex % baseCount);
            if (!source) {
                break;
            }
            var $clone = $(source).clone(false, false);
            $clone.attr('data-mtfe-rev-clone', 'true');
            $clone.addClass('mtfe-solaris-reviews__slide--clone');
            $wrapper.append($clone);
            duplicateIndex += 1;
        }
    }


    function destroySwiper($section) {
        var sw = $section.data('mtfeRevSwiper');
        if (sw && typeof sw.destroy === 'function') {
            try {
                sw.destroy(true, true);
            } catch (e) {
                /* noop */
            }
        }
        $section.removeData('mtfeRevSwiper');

        var $wrapper = $section.find('.mtfe-solaris-reviews__slider .swiper-wrapper').first();
        var originalSlidesHtml = $section.data('mtfeRevOriginalSlidesHtml');
        if ($wrapper.length && typeof originalSlidesHtml === 'string') {
            $wrapper.html(originalSlidesHtml);
        }
    }

    function initSwiper($section) {
        var sliderNode = $section.find('.mtfe-solaris-reviews__slider')[0];
        var $wrapper = $section.find('.mtfe-solaris-reviews__slider .swiper-wrapper').first();
        if (!sliderNode || !$wrapper.length || typeof Swiper === 'undefined') {
            return;
        }

        destroySwiper($section);

        if (typeof $section.data('mtfeRevOriginalSlidesHtml') !== 'string') {
            $section.data('mtfeRevOriginalSlidesHtml', $wrapper.html());
        } else {
            $wrapper.html($section.data('mtfeRevOriginalSlidesHtml'));
        }

        var loopEnabled = readDataYesNo($section, 'enable-loop');
        var slidesMobile  = Math.max(1, readDataInt($section, 'slides-mobile', 1));
        var slidesTablet  = Math.max(1, readDataInt($section, 'slides-tablet', 2));
        var slidesDesktop = Math.max(1, readDataInt($section, 'slides-desktop', 3));

        ensureMinSlidesForLoop($section, $wrapper, loopEnabled, slidesDesktop * 2);

        var sw = new Swiper(sliderNode, {
            loop: loopEnabled,
            speed: 600,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            grabCursor: true,
            centeredSlides: true,
            watchSlidesProgress: true,
            slidesPerView: slidesMobile,
            spaceBetween: 16,
            simulateTouch: true,
            allowTouchMove: true,
            breakpoints: {
                768: {
                    slidesPerView: slidesTablet,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: slidesDesktop,
                    spaceBetween: 24
                }
            }
        });

        if (inEditMode()) {
            setTimeout(function () {
                if (!sw || sw.destroyed) { return; }
                sw.update();
            }, 80);
        }

        $section.data('mtfeRevSwiper', sw);
    }

    function destroyInstance($section) {
        destroySwiper($section);
        $section.removeData('mtfeSolarisReviewsInit');
    }

    function initInstance($section) {
        if (!$section.length || !$section.hasClass('mtfe-solaris-reviews')) {
            return;
        }

        destroyInstance($section);
        initSwiper($section);
        $section.data('mtfeSolarisReviewsInit', true);
    }

    function initAll($scope) {
        var $widgets = $scope.hasClass('mtfe-solaris-reviews')
            ? $scope
            : $scope.find('.mtfe-solaris-reviews');

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

        elementorFrontend.hooks.addAction('frontend/element_ready/mtfe-solaris-reviews.default', function ($scope) {
            initAll($scope);
        });
    });
})(jQuery);

