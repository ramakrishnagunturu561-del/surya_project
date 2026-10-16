(function () {
    'use strict';

    /* -- Scroll-reveal -------------------------------------------------------- */

    function initReveal( scope ) {
        var root    = scope || document;
        var targets = root.querySelectorAll(
            '.mtfe-projects-dropdown:not(.mtfe-projects-dropdown--no-anim) .reveal:not(.in-view)'
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

        targets.forEach( function ( el ) { io.observe( el ); } );
    }

    /* -- Accordion toggle ---------------------------------------------------- */

    function initAccordion( scope ) {
        var root  = scope || document;
        var wraps = root.querySelectorAll( '.mtfe-projects-dropdown' );

        wraps.forEach( function ( wrap ) {
            var isAccordion = wrap.getAttribute( 'data-accordion' ) !== 'false';

            wrap.querySelectorAll( '.mtfe-pd__action' ).forEach( function ( btn ) {
                btn.addEventListener( 'click', function () {
                    var row    = btn.closest( '.mtfe-pd__row' );
                    var isOpen = row.classList.contains( 'is-open' );

                    if ( isAccordion ) {
                        wrap.querySelectorAll( '.mtfe-pd__row' ).forEach( function ( r ) {
                            r.classList.remove( 'is-open' );
                            var b = r.querySelector( '.mtfe-pd__action' );
                            if ( b ) {
                                b.setAttribute( 'aria-expanded', 'false' );
                                b.setAttribute( 'aria-label', 'Expand' );
                            }
                        } );
                    }

                    if ( ! isOpen ) {
                        row.classList.add( 'is-open' );
                        btn.setAttribute( 'aria-expanded', 'true' );
                        btn.setAttribute( 'aria-label', 'Collapse' );
                    }
                } );
            } );
        } );
    }

    /* -- Bootstrap ----------------------------------------------------------- */

    function init( scope ) {
        initReveal( scope );
        initAccordion( scope );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', function () { init(); } );
    } else {
        init();
    }

    /* -- Elementor integration ----------------------------------------------- */

    if ( typeof jQuery !== 'undefined' && typeof elementorFrontend !== 'undefined' ) {
        jQuery( document ).on( 'elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction(
                'frontend/element_ready/mtfe-projects-dropdown.default',
                function ( $scope ) {
                    if ( elementorFrontend.isEditMode() ) {
                        $scope.find( '.reveal' ).addClass( 'in-view' );
                        initAccordion( $scope[0] );
                    } else {
                        setTimeout( function () { init( $scope[0] ); }, 100 );
                    }
                }
            );
        } );
    }
} )();
