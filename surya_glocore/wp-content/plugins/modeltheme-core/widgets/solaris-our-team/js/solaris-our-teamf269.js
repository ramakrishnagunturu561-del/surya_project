(function ($) {
    'use strict';

    function teardownFallbacks($section) {
        var ns = $section.data('mtfeTeamFallbackNs');
        if (!ns) {
            return;
        }
        $section.find('img[data-fallback-src]').off('.' + ns);
        $section.removeData('mtfeTeamFallbackNs');
    }

    function initFallbacks($section) {
        teardownFallbacks($section);

        var ns = (String($section.attr('data-instance') || 'default')).replace(/[^a-zA-Z0-9_-]/g, '');
        if (!ns) {
            ns = 'default';
        }
        $section.data('mtfeTeamFallbackNs', ns);

        $section.find('img[data-fallback-src]').each(function () {
            var $img = $(this);
            var fallback = ($img.attr('data-fallback-src') || '').trim();
            if (!fallback) {
                return;
            }

            $img.off('error.' + ns).on('error.' + ns, function () {
                if ($img.attr('data-fallback-applied') === '1') {
                    return;
                }
                $img.attr('data-fallback-applied', '1');
                $img.attr('src', fallback);
            });
        });
    }

    function destroyInstance($section) {
        teardownFallbacks($section);
        $section.removeData('mtfeSolarisOurTeamInit');
    }

    function initInstance($section) {
        if (!$section.length || !$section.hasClass('mtfe-solaris-our-team')) {
            return;
        }

        destroyInstance($section);
        initFallbacks($section);
        $section.data('mtfeSolarisOurTeamInit', true);
    }

    function initAll($scope) {
        var $widgets = $scope.hasClass('mtfe-solaris-our-team')
            ? $scope
            : $scope.find('.mtfe-solaris-our-team');

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

        elementorFrontend.hooks.addAction('frontend/element_ready/mtfe-solaris-our-team.default', function ($scope) {
            initAll($scope);
        });
    });
})(jQuery);
