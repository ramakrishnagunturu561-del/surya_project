(function ($) {
    'use strict';

    function instanceNamespace($section) {
        return '.mtfeSolarisServicesCore.' + ($section.data('instance') || $section.attr('id') || 'default');
    }

    function readGapPx($root) {
        var el = $root[0];
        if (!el || typeof window.getComputedStyle !== 'function') {
            return 18;
        }
        var raw = window.getComputedStyle(el).getPropertyValue('--mtfe-sc-grid-gap').trim();
        var n = parseFloat(raw);
        return isNaN(n) ? 18 : Math.max(0, Math.round(n));
    }

    function inEditMode() {
        return !!(
            window.elementorFrontend &&
            typeof window.elementorFrontend.isEditMode === 'function' &&
            window.elementorFrontend.isEditMode()
        );
    }

    function destroySwiper($section) {
        var sw = $section.data('mtfeScSwiper');
        if (sw && typeof sw.destroy === 'function') {
            try {
                sw.destroy(true, true);
            } catch (e) {
                /* noop */
            }
        }
        $section.removeData('mtfeScSwiper');
    }

    function initSwiper($section) {
        // Services Core now renders as a static integrated grid (no slider behavior).
        destroySwiper($section);
    }

    function teardownCards($section) {
        destroySwiper($section);

        var ns = instanceNamespace($section);
        var $cards = $section.find('[data-service-card]');

        $cards.off('focusin' + ns);
        $cards.off('focusout' + ns);
        $cards.off('mouseenter' + ns);
        $cards.off('mouseleave' + ns);
        $cards.off('click' + ns);
        $cards.off('keydown' + ns);
        $section.off('mouseleave' + ns);

        var observer = $section.data('mtfeScCardsObserver');
        if (observer && typeof observer.disconnect === 'function') {
            observer.disconnect();
        }
        $section.removeData('mtfeScCardsObserver');

        var rafId = $section.data('mtfeScCardsRaf');
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        $section.removeData('mtfeScCardsRaf');
    }

    function initCards($section) {
        teardownCards($section);

        var ns = instanceNamespace($section);
        var $cards = $section.find('[data-service-card]');
        var trackNode = $section.find('.mtfe-solaris-services-core__swiper')[0];

        initSwiper($section);

        if (!$cards.length) {
            return;
        }

        var canHover = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        var reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var clearActive = function () {
            $cards.removeAttr('data-active');
        };

        var cancelScheduledClear = function () {
            var rafId = $section.data('mtfeScCardsRaf');
            if (!rafId) {
                return;
            }
            cancelAnimationFrame(rafId);
            $section.removeData('mtfeScCardsRaf');
        };

        var setActive = function ($card) {
            if (!$card || !$card.length) {
                return;
            }
            cancelScheduledClear();
            clearActive();
            $card.attr('data-active', 'true');
        };

        var scheduleClearActive = function () {
            cancelScheduledClear();
            var rafId = requestAnimationFrame(function () {
                $section.removeData('mtfeScCardsRaf');
                var hoveredCard = $section.find('[data-service-card]:hover').get(0);
                if (hoveredCard) {
                    setActive($(hoveredCard));
                    return;
                }
                clearActive();
            });
            $section.data('mtfeScCardsRaf', rafId);
        };

        $cards.each(function () {
            var $card = $(this);

            $card.on('focusin' + ns, function () {
                setActive($card);
            });

            $card.on('focusout' + ns, function (event) {
                if (this.contains(event.relatedTarget)) {
                    return;
                }
                if (canHover) {
                    clearActive();
                }
            });

            $card.on('mouseenter' + ns, function () {
                if (!canHover || reduceMotion) {
                    return;
                }
                setActive($card);
            });

            $card.on('mouseleave' + ns, function (event) {
                if (!canHover) {
                    return;
                }
                var relatedTarget = event.relatedTarget;
                if (relatedTarget instanceof Element && relatedTarget.closest('[data-service-card]')) {
                    return;
                }
                scheduleClearActive();
            });

            $card.on('click' + ns, function () {
                if (canHover) {
                    return;
                }
                var isActive = $card.attr('data-active') === 'true';
                if (isActive) {
                    $card.removeAttr('data-active');
                    return;
                }
                setActive($card);
            });

            $card.on('keydown' + ns, function (event) {
                if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }
                event.preventDefault();
                setActive($card);
            });
        });

        if (!canHover && 'IntersectionObserver' in window && trackNode) {
            var observer = new IntersectionObserver(
                function (entries) {
                    var visibleCards = entries
                        .filter(function (entry) {
                            return entry.isIntersecting;
                        })
                        .sort(function (a, b) {
                            return b.intersectionRatio - a.intersectionRatio;
                        });

                    if (!visibleCards.length) {
                        return;
                    }
                    setActive($(visibleCards[0].target));
                },
                {
                    root: trackNode,
                    threshold: [0.45, 0.65, 0.85]
                }
            );

            $cards.each(function () {
                observer.observe(this);
            });

            $section.data('mtfeScCardsObserver', observer);
        }

        $section.on('mouseleave' + ns, function () {
            if (!canHover) {
                return;
            }
            scheduleClearActive();
        });
    }

    function destroyInstance($section) {
        teardownCards($section);
        $section.removeData('mtfeSolarisServicesCoreInit');
    }

    function initInstance($section) {
        if (!$section.length || !$section.hasClass('mtfe-solaris-services-core')) {
            return;
        }

        destroyInstance($section);
        initCards($section);
        $section.data('mtfeSolarisServicesCoreInit', true);
    }

    function initAll($scope) {
        var $widgets = $scope.hasClass('mtfe-solaris-services-core')
            ? $scope
            : $scope.find('.mtfe-solaris-services-core');

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

        elementorFrontend.hooks.addAction('frontend/element_ready/mtfe-solaris-services-core.default', function ($scope) {
            initAll($scope);
        });
    });
})(jQuery);
