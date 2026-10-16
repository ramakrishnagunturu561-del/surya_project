(function () {
    'use strict';

    /**
     * Observe .reveal and .reveal-badge elements within .mtfe-about-us wrappers
     * and add the 'in-view' class when they enter the viewport.
     *
     * @param {Element|Document} scope  Root element to search within.
     */
    function initAboutUsReveal( scope ) {
        var root    = scope || document;
        var targets = root.querySelectorAll(
            '.mtfe-about-us:not(.mtfe-about-us--no-anim) .reveal:not(.in-view),' +
            '.mtfe-about-us:not(.mtfe-about-us--no-anim) .reveal-badge:not(.in-view)'
        );

        if ( ! targets.length ) return;

        var io = new IntersectionObserver(
            function ( entries ) {
                entries.forEach( function ( entry ) {
                    if ( entry.isIntersecting ) {
                        entry.target.classList.add( 'in-view' );
                        io.unobserve( entry.target );
                    }
                } );
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        targets.forEach( function ( el ) {
            io.observe( el );
        } );
    }

    /* -- Init on page load -------------------------------------------------- */

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', function () {
            initAboutUsReveal();
        } );
    } else {
        initAboutUsReveal();
    }

    /* -- Elementor frontend integration ------------------------------------- */

    if ( typeof jQuery !== 'undefined' && typeof elementorFrontend !== 'undefined' ) {
        jQuery( document ).on( 'elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction(
                'frontend/element_ready/mtfe-about-us.default',
                function ( $scope ) {
                    if ( elementorFrontend.isEditMode() ) {
                        // In the editor make everything visible immediately.
                        $scope.find( '.reveal, .reveal-badge' ).addClass( 'in-view' );
                    } else {
                        setTimeout( function () {
                            initAboutUsReveal( $scope[0] );
                        }, 100 );
                    }
                }
            );
        } );
    }
} )();
