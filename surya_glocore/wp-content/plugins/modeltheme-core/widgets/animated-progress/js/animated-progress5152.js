/* ============================================================
   MT Animated Progress – Elementor Widget
   ============================================================ */

( function () {
    'use strict';

    /**
     * Animate all fills inside a single .mtfe-ap-wrap element.
     *
     * @param {HTMLElement} wrap
     */
    function animateWrap( wrap ) {
        if ( wrap.dataset.mtApDone ) return;
        wrap.dataset.mtApDone = '1';

        var duration = parseInt( wrap.dataset.duration, 10 ) || 1200;
        var delay    = parseInt( wrap.dataset.delay,    10 ) || 150;
        var easing   = wrap.dataset.easing || 'ease-out';

        wrap.querySelectorAll( '.mtfe-ap-fill' ).forEach( function ( fill ) {
            var pct   = parseFloat( fill.dataset.pct ) || 0;
            var index = parseInt( fill.dataset.index, 10 ) || 0;
            var itemDelay = delay * index;

            /* Small rAF so the browser registers the initial width: 0 */
            requestAnimationFrame( function () {
                requestAnimationFrame( function () {
                    fill.style.transition = 'width ' + duration + 'ms ' + easing + ' ' + itemDelay + 'ms';
                    fill.style.width      = pct + '%';
                    fill.classList.add( 'is-animating' );

                    var totalTime = duration + itemDelay;
                    setTimeout( function () {
                        fill.classList.remove( 'is-animating' );
                        fill.classList.add( 'is-done' );
                    }, totalTime );
                } );
            } );
        } );
    }

    /**
     * Set up a single .mtfe-ap-wrap.
     *
     * @param {HTMLElement} wrap
     */
    function initWrap( wrap ) {
        var trigger = wrap.dataset.trigger || 'scroll';

        if ( trigger === 'load' ) {
            animateWrap( wrap );
            return;
        }

        /* Scroll trigger via IntersectionObserver */
        if ( 'IntersectionObserver' in window ) {
            var observer = new IntersectionObserver(
                function ( entries, obs ) {
                    entries.forEach( function ( entry ) {
                        if ( entry.isIntersecting ) {
                            animateWrap( entry.target );
                            obs.unobserve( entry.target );
                        }
                    } );
                },
                { threshold: 0.2 }
            );
            observer.observe( wrap );
        } else {
            /* Fallback for very old browsers */
            animateWrap( wrap );
        }
    }

    /**
     * Bootstrap all widgets on the page.
     */
    function init() {
        document.querySelectorAll( '.mtfe-ap-wrap' ).forEach( function ( wrap ) {
            initWrap( wrap );
        } );
    }

    /* ---- Standard page load ---- */
    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init();
    }

    /* ---- Elementor live-editor re-render hook ---- */
    function registerElementorHook() {
        window.elementorFrontend.hooks.addAction(
            'frontend/element_ready/mtfe-animated-progress.default',
            function ( $scope ) {
                var wrap = $scope[0].querySelector( '.mtfe-ap-wrap' );
                if ( wrap ) {
                    /* Reset so it can re-animate after editor changes */
                    delete wrap.dataset.mtApDone;
                    wrap.querySelectorAll( '.mtfe-ap-fill' ).forEach( function ( f ) {
                        f.style.transition = 'none';
                        f.style.width      = '0%';
                        f.classList.remove( 'is-animating', 'is-done' );
                    } );
                    initWrap( wrap );
                }
            }
        );
    }

    if ( window.elementorFrontend && window.elementorFrontend.hooks ) {
        registerElementorHook();
    } else {
        window.addEventListener( 'elementor/frontend/init', registerElementorHook );
    }

} )();
