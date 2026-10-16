(function () {
    'use strict';

    function initDualHeader() {
        var widgets = document.querySelectorAll('.mtfe-dual-header-wrapper:not(.mtfe-dual-header--in-view):not(.mtfe-dual-header--anim-none)');
        if ( ! widgets.length ) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mtfe-dual-header--in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.1
            }
        );

        widgets.forEach(function (el) {
            observer.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDualHeader);
    } else {
        initDualHeader();
    }

    // Elementor editor support
    if (typeof jQuery !== 'undefined' && typeof elementorFrontend !== 'undefined') {
        jQuery(document).on('elementor/frontend/init', function () {
            elementorFrontend.hooks.addAction(
                'frontend/element_ready/mtfe-dual-header.default',
                function ($scope) {
                    if (elementorFrontend.isEditMode()) {
                        $scope.find('.mtfe-dual-header-wrapper').addClass('mtfe-dual-header--in-view');
                    } else {
                        setTimeout(initDualHeader, 100);
                    }
                }
            );
        });
    }
})();
