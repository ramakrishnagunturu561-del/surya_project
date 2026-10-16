(function () {
	'use strict';

	var SEL_ROOT =
		'.mtfe-solaris-anim-root:not(.mtfe-solaris-anim-root--anim-none):not(.mtfe-solaris-anim-root--in-view)';

	function observeRoots(roots) {
		if (!roots.length || typeof IntersectionObserver !== 'function') {
			return;
		}
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('mtfe-solaris-anim-root--in-view');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				rootMargin: '0px 0px -8% 0px',
				threshold: 0.1,
			}
		);
		roots.forEach(function (el) {
			observer.observe(el);
		});
	}

	function initSolarisEntrance() {
		var roots = document.querySelectorAll(SEL_ROOT);
		observeRoots(roots);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initSolarisEntrance);
	} else {
		initSolarisEntrance();
	}

	function markInViewInScope(scope) {
		var roots = scope.querySelectorAll('.mtfe-solaris-anim-root:not(.mtfe-solaris-anim-root--anim-none)');
		roots.forEach(function (el) {
			el.classList.add('mtfe-solaris-anim-root--in-view');
		});
	}

	if (typeof jQuery !== 'undefined' && typeof elementorFrontend !== 'undefined') {
		jQuery(window).on('elementor/frontend/init', function () {
			if (typeof elementorFrontend.hooks === 'undefined') {
				return;
			}
			var widgets = [
				'mtfe-solaris-our-story.default',
				'mtfe-solaris-cta-contact.default',
				'mtfe-solaris-cta-comparison.default',
				'mtfe-solaris-our-team.default',
				'mtfe-solaris-services-core.default',
				'mtfe-solaris-topic-loop.default',
				'mtfe-solaris-reviews.default',
				'mtfe-solaris-projects-portfolio.default',
				'mtfe-solaris-results-showcase.default',
				'mtfe-solaris-process.default',
				'mtfe-solaris-footer.default',
			];
			widgets.forEach(function (name) {
				elementorFrontend.hooks.addAction('frontend/element_ready/' + name, function ($scope) {
					if (elementorFrontend.isEditMode()) {
						markInViewInScope($scope[0]);
					} else {
						initSolarisEntrance();
					}
				});
			});
		});
	}
})();
