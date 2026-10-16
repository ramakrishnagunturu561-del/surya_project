(function ($) {
    'use strict';

    function readDataInt($el, key, fallback) {
        var v = parseInt($el.attr('data-' + key), 10);
        return isNaN(v) ? fallback : v;
    }

    function readDataYesNo($el, key) {
        return ($el.attr('data-' + key) || '') === 'yes';
    }

    function inEditMode() {
        return !!(
            window.elementorFrontend &&
            typeof window.elementorFrontend.isEditMode === 'function' &&
            window.elementorFrontend.isEditMode()
        );
    }

    function destroySwiper($section) {
        var sw = $section.data('mtfeProcSwiper');
        if (sw && typeof sw.destroy === 'function') {
            try {
                sw.destroy(true, true);
            } catch (e) {
                /* noop */
            }
        }
        $section.removeData('mtfeProcSwiper');
    }

    function teardownEnergy($section) {
        var tl = $section.data('mtfeProcEnergyTimeline');
        if (tl && typeof tl.kill === 'function') {
            tl.kill();
        }
        $section.removeData('mtfeProcEnergyTimeline');

        if (typeof window.gsap !== 'undefined') {
            var energyWrapNode = $section.find('.mtfe-solaris-process__energy-wrap')[0];
            var energyCircleNode = $section.find('.mtfe-solaris-process__energy-circle')[0];
            var energyIconNode = $section.find('.mtfe-solaris-process__energy-circle svg')[0];
            window.gsap.set(
                [energyWrapNode, energyCircleNode, energyIconNode].filter(Boolean),
                { clearProps: 'transform,opacity,width,margin' }
            );
        }

        var io = $section.data('mtfeProcEnergyIo');
        if (io && typeof io.disconnect === 'function') {
            io.disconnect();
        }
        $section.removeData('mtfeProcEnergyIo');

        $section.removeClass('mtfe-solaris-process--energy-ready');
    }

    function initSwiper($section) {
        var sliderEl = $section.find('.mtfe-solaris-process__slider')[0];
        if (!sliderEl || typeof Swiper === 'undefined') {
            return;
        }

        destroySwiper($section);

        var slidesMobile = Math.max(1, readDataInt($section, 'slides-mobile', 1));
        var slidesTablet = Math.max(1, readDataInt($section, 'slides-tablet', 2));
        var slidesDesktop = Math.max(1, readDataInt($section, 'slides-desktop', 4));
        var spaceMobile = Math.max(0, readDataInt($section, 'space-mobile', 16));
        var spaceTablet = Math.max(0, readDataInt($section, 'space-tablet', 18));
        var spaceDesktop = Math.max(0, readDataInt($section, 'space-desktop', 30));
        var speed = Math.max(100, readDataInt($section, 'speed', 1000));
        var touchDesktop = readDataYesNo($section, 'touch-desktop');

        var sw = new Swiper(sliderEl, {
            slidesPerView: slidesMobile,
            spaceBetween: spaceMobile,
            speed: speed,
            grabCursor: true,
            simulateTouch: true,
            breakpoints: {
                768: {
                    slidesPerView: slidesTablet,
                    spaceBetween: spaceTablet,
                    grabCursor: true,
                    simulateTouch: true
                },
                1024: {
                    slidesPerView: slidesDesktop,
                    spaceBetween: spaceDesktop,
                    grabCursor: touchDesktop,
                    simulateTouch: touchDesktop,
                    allowTouchMove: touchDesktop
                }
            }
        });

        $section.data('mtfeProcSwiper', sw);
    }

    function initEnergy($section) {
        teardownEnergy($section);

        var enableEnergy = readDataYesNo($section, 'enable-energy');
        var prefersReducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!enableEnergy || prefersReducedMotion || inEditMode()) {
            $section.addClass('mtfe-solaris-process--energy-ready');
            return;
        }

        var headerNode = $section.find('.mtfe-solaris-process__header')[0];
        var energyWrapNode = $section.find('.mtfe-solaris-process__energy-wrap')[0];
        var energyCircleNode = $section.find('.mtfe-solaris-process__energy-circle')[0];
        var energyIconNode = $section.find('.mtfe-solaris-process__energy-circle svg')[0];

        var useGsap =
            typeof window.gsap !== 'undefined' &&
            typeof window.ScrollTrigger !== 'undefined' &&
            headerNode &&
            energyWrapNode &&
            energyCircleNode &&
            energyIconNode;

        if (useGsap) {
            if (typeof window.gsap.registerPlugin === 'function') {
                window.gsap.registerPlugin(window.ScrollTrigger);
            }
            var tl = window.gsap.timeline({
                scrollTrigger: {
                    trigger: headerNode,
                    start: 'top 85%',
                    end: 'top 45%',
                    scrub: 1.2
                }
            });

            tl.to(
                energyWrapNode,
                {
                    width: '1.2em',
                    margin: '0 0.2em',
                    ease: 'power2.inOut'
                },
                0
            )
                .fromTo(
                    energyCircleNode,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, ease: 'power2.inOut' },
                    0
                )
                .fromTo(
                    energyIconNode,
                    { scale: 0, rotation: -90 },
                    { scale: 1, rotation: 0, ease: 'back.out(1.5)' },
                    0
                );

            $section.data('mtfeProcEnergyTimeline', tl);
            return;
        }

        if (!headerNode) {
            $section.addClass('mtfe-solaris-process--energy-ready');
            return;
        }

        if (typeof IntersectionObserver === 'undefined') {
            $section.addClass('mtfe-solaris-process--energy-ready');
            return;
        }

        var io = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    $section.addClass('mtfe-solaris-process--energy-ready');
                    observer.disconnect();
                });
            },
            { root: null, threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
        );

        io.observe(headerNode);
        $section.data('mtfeProcEnergyIo', io);
    }

    function initInstance($section) {
        if (!$section.length || !$section.hasClass('mtfe-solaris-process')) {
            return;
        }

        initSwiper($section);
        initEnergy($section);

        $section.data('mtfeSolarisProcessInit', true);
    }

    function initAll($scope) {
        var $widgets = $scope.hasClass('mtfe-solaris-process')
            ? $scope
            : $scope.find('.mtfe-solaris-process');

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

        elementorFrontend.hooks.addAction('frontend/element_ready/mtfe-solaris-process.default', function ($scope) {
            initAll($scope);
        });
    });
})(jQuery);
