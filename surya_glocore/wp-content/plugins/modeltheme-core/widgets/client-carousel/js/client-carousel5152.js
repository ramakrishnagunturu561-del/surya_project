(function ($) {
    'use strict';

    function init($el) {
        var $track = $el.find('.mtfe-client-carousel__track');
        var $orig  = $track.children('.mtfe-client-carousel__item:not([data-cc-clone])');

        if ( ! $orig.length ) { return; }

        // Remove stale clones from previous init
        $track.children('[data-cc-clone]').remove();

        // Measure one full set of original items
        var origWidth = 0;
        $orig.each(function () { origWidth += this.offsetWidth; });
        if ( ! origWidth ) { return; }

        // Clone until track is at least (container width * 2 + origWidth) wide
        // so there is never a gap no matter how slow the speed or how few logos there are
        var needed  = ( $el[0].offsetWidth || window.innerWidth ) * 2 + origWidth;
        var safety  = 1000;

        while ( $track[0].scrollWidth < needed && safety-- > 0 ) {
            $orig.each(function () {
                $track.append(
                    $( this ).clone( false )
                             .attr( 'data-cc-clone', 'true' )
                             .attr( 'aria-hidden', 'true' )
                );
            });
        }

        // Set CSS variable so keyframes translate exactly one original set
        $el[0].style.setProperty( '--mtfe-cc-translate', '-' + origWidth + 'px' );
    }

    function initAll($scope) {
        $scope.find('.mtfe-client-carousel').each(function () { init( $(this) ); });
        if ( $scope.hasClass('mtfe-client-carousel') ) { init($scope); }
    }

    $( document ).ready(function () {
        initAll( $(document) );
    });

    // Re-init on window resize (debounced)
    var resizeTimer;
    $( window ).on('resize', function () {
        clearTimeout( resizeTimer );
        resizeTimer = setTimeout(function () {
            initAll( $(document) );
        }, 200 );
    });

    $( window ).on('elementor/frontend/init', function () {
        if ( typeof elementorFrontend === 'undefined' || ! elementorFrontend.hooks ) { return; }
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/mtfe-client-carousel.default',
            function ($scope) { initAll($scope); }
        );
    });

})(jQuery);
