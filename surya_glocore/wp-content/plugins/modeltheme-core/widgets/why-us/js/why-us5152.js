(function () {
    'use strict';

    function initReveal( scope ) {
        var root    = scope || document;
        var targets = root.querySelectorAll( '.mtfe-why-us .reveal:not(.in-view), .mtfe-why-us .img-reveal:not(.in-view)' );
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

    function init( scope ) {
        initReveal( scope );
    }

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', function () { init(); } );
    } else {
        init();
    }

    if ( typeof jQuery !== 'undefined' && typeof elementorFrontend !== 'undefined' ) {
        jQuery( document ).on( 'elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction(
                'frontend/element_ready/mtfe-why-us.default',
                function ( $scope ) {
                    if ( elementorFrontend.isEditMode() ) {
                        $scope[0].querySelectorAll( '.reveal, .img-reveal' ).forEach( function ( el ) {
                            el.classList.add( 'in-view' );
                        } );
                    } else {
                        setTimeout( function () { init( $scope[0] ); }, 100 );
                    }
                }
            );
        } );
    }
} )();
