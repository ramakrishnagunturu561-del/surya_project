/**
 * MT CPT Page Animations – GSAP ScrollTrigger
 *
 * Handles scroll-in animations for:
 *   1. Taxonomy / archive grids  → card-level stagger (no inner elements)
 *   2. Single page sections      → grouped section reveals
 *   3. Related post grids        → card-level stagger
 *
 * Uses [data-mt-anim-section] on individual sections and
 * [data-mt-anim-grid] on grid wrappers.
 */
(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    /* Disable animations on mobile – they don't reliably trigger */
    if (!window.matchMedia('(min-width: 992px)').matches) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ------------------------------------------------------------------
       Preset → GSAP "from" values
    ------------------------------------------------------------------ */
    var PRESETS = {
        'fade-up':    function (d) { return { autoAlpha: 0, y: d }; },
        'fade-down':  function (d) { return { autoAlpha: 0, y: -d }; },
        'fade-left':  function (d) { return { autoAlpha: 0, x: d }; },
        'fade-right': function (d) { return { autoAlpha: 0, x: -d }; },
        'zoom-in':    function ()  { return { autoAlpha: 0, scale: 0.85 }; },
        'fade-in':    function ()  { return { autoAlpha: 0 }; },
        'slide-up':   function (d) { return { y: d }; },
        'blur-in':    function ()  { return { autoAlpha: 0, filter: 'blur(10px)' }; }
    };

    function getFrom(preset, dist) {
        var d = parseFloat(dist) || 50;
        var fn = PRESETS[preset];
        return fn ? fn(d) : { autoAlpha: 0, y: d };
    }

    /* Shared "to" values – clear only transform/filter, keep visibility inline */
    var CLEAR_TO = {
        autoAlpha: 1, x: 0, y: 0, scale: 1,
        rotation: 0, rotationX: 0, filter: 'blur(0px)',
        clearProps: 'transform,filter'
    };

    /* ------------------------------------------------------------------
       1. GRID ANIMATIONS  [data-mt-anim-grid]
       Used on taxonomy pages + related sections.
       Animates direct grid-item children with stagger, cards only.
    ------------------------------------------------------------------ */
    function initGrid(container) {
        if (container.hasAttribute('data-mt-anim-init')) return;
        container.setAttribute('data-mt-anim-init', '1');

        var preset   = container.getAttribute('data-mt-anim-grid') || 'fade-up';
        var distance = parseFloat(container.getAttribute('data-mt-grid-distance')) || 50;
        var duration = parseFloat(container.getAttribute('data-mt-grid-duration')) || 0.7;
        var stagger  = parseFloat(container.getAttribute('data-mt-grid-stagger'))  || 0.1;
        var trigger  = parseInt(container.getAttribute('data-mt-grid-trigger'), 10) || 88;

        /* Find grid items: any class ending in -grid-item */
        var items = container.querySelectorAll(
            '.mt-service-grid-item, .mt-team-grid-item, .mt-portfolio-grid-item, .mt-events-grid-item, .mt-careers-grid-item'
        );
        if (!items.length) return;

        var from = getFrom(preset, distance);
        gsap.set(items, from);

        gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top ' + trigger + '%',
                once: true
            }
        }).to(items, Object.assign({}, CLEAR_TO, {
            duration: duration,
            ease: 'power2.out',
            stagger: stagger
        }));
    }

    /* ------------------------------------------------------------------
       2. SECTION ANIMATIONS  [data-mt-anim-section]
       Each section animates independently when scrolled into view.
       Supports optional data-mt-section-children to stagger children.
    ------------------------------------------------------------------ */
    function initSection(el) {
        if (el.hasAttribute('data-mt-anim-init')) return;
        el.setAttribute('data-mt-anim-init', '1');

        var preset   = el.getAttribute('data-mt-anim-section') || 'fade-up';
        var distance = parseFloat(el.getAttribute('data-mt-section-distance')) || 40;
        var duration = parseFloat(el.getAttribute('data-mt-section-duration')) || 0.7;
        var delay    = parseFloat(el.getAttribute('data-mt-section-delay'))    || 0;
        var trigger  = parseInt(el.getAttribute('data-mt-section-trigger'), 10) || 90;
        var childSel = el.getAttribute('data-mt-section-children');

        if (childSel) {
            /* Stagger children instead of animating the container */
            var children = el.querySelectorAll(childSel);
            if (!children.length) return;

            var stagger = parseFloat(el.getAttribute('data-mt-section-stagger')) || 0.08;
            var from = getFrom(preset, distance);
            gsap.set(children, from);

            gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: 'top ' + trigger + '%',
                    once: true
                }
            }).to(children, Object.assign({}, CLEAR_TO, {
                duration: duration,
                ease: 'power2.out',
                stagger: stagger,
                delay: delay
            }));
        } else {
            /* Animate the section element itself */
            var from = getFrom(preset, distance);
            gsap.set(el, from);

            gsap.to(el, Object.assign({}, CLEAR_TO, {
                duration: duration,
                ease: 'power2.out',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top ' + trigger + '%',
                    once: true
                }
            }));
        }
    }

    /* ------------------------------------------------------------------
       Boot
    ------------------------------------------------------------------ */
    function boot() {
        document.querySelectorAll('[data-mt-anim-grid]').forEach(initGrid);
        document.querySelectorAll('[data-mt-anim-section]').forEach(initSection);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    /* Re-run after full page load – fixes mobile viewport miscalculations
       (URL-bar resize, lazy images shifting layout, Elementor deferred render) */
    window.addEventListener('load', function () {
        boot();
        ScrollTrigger.refresh();
    });
})();
