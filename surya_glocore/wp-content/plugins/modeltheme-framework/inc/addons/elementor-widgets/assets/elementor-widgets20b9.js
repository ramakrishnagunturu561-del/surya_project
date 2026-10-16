(function ($) {
    'use strict';

    /**
     * Elementor burger widget: fullscreen overlay sat above the trigger in the DOM stack.
     * Reparent the wrapper into the panel between overlay and sidebar, fixed at its measured
     * position, so the scrim is below both the icon and the drawer.
     */
    function mtfeRestoreFloatedBurgerIfAny($panel) {
        if (!$panel || !$panel.length) {
            return;
        }
        var $wrap = $panel.children('.mtfe-burger-menu-wrapper.mtfe-burger-menu-wrapper--floated');
        if (!$wrap.length) {
            return;
        }
        var restore = $wrap.data('mtfe-burger-restore');
        $wrap.removeClass('mtfe-burger-menu-wrapper--floated');
        $wrap.css({
            position: '',
            top: '',
            left: '',
            width: '',
            height: '',
            margin: '',
            boxSizing: '',
            zIndex: ''
        });
        if (restore && restore.parent) {
            $wrap.detach();
            var parent = restore.parent;
            var next = restore.nextSibling;
            if (next && next.parentNode === parent) {
                parent.insertBefore($wrap[0], next);
            } else {
                parent.appendChild($wrap[0]);
            }
        }
        $wrap.removeData('mtfe-burger-restore');
    }

    function mtfeFloatBurgerMenuWrapperAboveOverlay($burger, $panel) {
        if (!$panel.hasClass('mtfe-burger-widget')) {
            return;
        }
        var $wrap = $burger.closest('.mtfe-burger-menu-wrapper');
        if (!$wrap.length) {
            return;
        }
        if (!$panel.hasClass('is-active')) {
            mtfeRestoreFloatedBurgerIfAny($panel);
            return;
        }

        var $overlay = $panel.find('.mtfe-off-canvas-overlay').first();
        if (!$overlay.length) {
            return;
        }

        if (!$wrap.data('mtfe-burger-restore')) {
            $wrap.data('mtfe-burger-restore', {
                parent: $wrap.parent()[0],
                nextSibling: $panel[0]
            });
        }

        var r = $wrap[0].getBoundingClientRect();

        if (!$wrap.parent().is($panel)) {
            $wrap.detach().insertAfter($overlay);
        }

        $wrap.addClass('mtfe-burger-menu-wrapper--floated');
        $wrap.css({
            position: 'fixed',
            top: r.top + 'px',
            left: r.left + 'px',
            width: r.width + 'px',
            height: r.height + 'px',
            margin: '0',
            boxSizing: 'border-box'
        });
    }

    jQuery(document).ready(function ($) {

        // Handle burger menu clicks - use a single unified handler
        function handleBurgerMenuClick(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the actual burger menu element from any clicked element
            var $clicked = $(e.target);
            var $burger = null;
            
            // Check if clicked element is the burger menu itself
            if ($clicked.hasClass('mtfe-burger-menu') || $clicked.hasClass('mtfe-nav-mobile-burger')) {
                $burger = $clicked;
            }
            // Check if clicked element is inside the wrapper
            else if ($clicked.closest('.mtfe-nav-mobile-burger-wrapper').length) {
                $burger = $clicked.closest('.mtfe-nav-mobile-burger-wrapper').find('.mtfe-burger-menu, .mtfe-nav-mobile-burger').first();
            }
            // Check if clicked element is a child of burger menu (like .line)
            else if ($clicked.closest('.mtfe-burger-menu, .mtfe-nav-mobile-burger').length) {
                $burger = $clicked.closest('.mtfe-burger-menu, .mtfe-nav-mobile-burger');
            }
            // Check if clicked element is the wrapper itself
            else if ($clicked.hasClass('mtfe-nav-mobile-burger-wrapper')) {
                $burger = $clicked.find('.mtfe-burger-menu, .mtfe-nav-mobile-burger').first();
            }
            
            // Make sure we found a burger menu
            if (!$burger || !$burger.length) {
                return;
            }
            
            var target = $burger.data('target');
            if (target) {
                $burger.toggleClass('is-active');
                var $targetPanel = $('#' + target);
                if ($targetPanel.length) {
                    $targetPanel.toggleClass('is-active');
                    $('body').toggleClass('mtfe-off-canvas-active');
                    if ($targetPanel.hasClass('is-active')) {
                        mtfeFloatBurgerMenuWrapperAboveOverlay($burger, $targetPanel);
                    } else {
                        mtfeRestoreFloatedBurgerIfAny($targetPanel);
                    }
                }
            }
        }
        
        // Attach handler to document with multiple selectors for maximum compatibility
        $(document).on('click', '.mtfe-burger-menu', handleBurgerMenuClick);
        $(document).on('click', '.mtfe-nav-mobile-burger', handleBurgerMenuClick);
        $(document).on('click', '.mtfe-nav-mobile-burger-wrapper', handleBurgerMenuClick);
        $(document).on('click', '.mtfe-burger-menu .line', handleBurgerMenuClick);
        $(document).on('click', '.mtfe-nav-mobile-burger .line', handleBurgerMenuClick);

        $(document).on('click', '.mtfe-off-canvas-close', function () {
            var $panel = $(this).closest('.mtfe-off-canvas-panel');
            mtfeRestoreFloatedBurgerIfAny($panel);
            var panelId = $panel.attr('id');
            $panel.removeClass('is-active');
            $('.mtfe-burger-menu[data-target="' + panelId + '"], .mtfe-nav-mobile-burger[data-target="' + panelId + '"]').removeClass('is-active');
            $('body').removeClass('mtfe-off-canvas-active');
        });

        $(document).on('click', '.mtfe-off-canvas-overlay', function () {
            var $panel = $(this).closest('.mtfe-off-canvas-panel');
            mtfeRestoreFloatedBurgerIfAny($panel);
            var panelId = $panel.attr('id');
            $panel.removeClass('is-active');
            $('.mtfe-burger-menu[data-target="' + panelId + '"], .mtfe-nav-mobile-burger[data-target="' + panelId + '"]').removeClass('is-active');
            $('body').removeClass('mtfe-off-canvas-active');
        });


    });

    $(document).ready(function () {

        function handleMenuOverflow() {
            $('.mtfe-nav-overflow-wrapper').each(function () {
                var $wrapper = $(this);
                var $widget = $wrapper.closest('.elementor-widget-mtfe-navigation');
                var $menu = $wrapper.find('.mtfe-navigation-menu');
                var $moreWrapper = $wrapper.find('.mtfe-nav-more-wrapper');
                var $moreButton = $wrapper.find('.mtfe-nav-more-button');
                var $moreDropdown = $wrapper.find('.mtfe-nav-more-dropdown');
                var $menuItems = $menu.find('> li:not(.mtfe-nav-more-wrapper)');

                // If burger is visible, we are on mobile/tablet - disable overflow logic
                if ($widget.find('.mtfe-nav-mobile-burger').is(':visible')) {
                    $menuItems.removeClass('mtfe-nav-hidden').show();
                    $moreWrapper.hide();
                    $wrapper.addClass('mtfe-nav-ready');
                    return;
                }

                // Skip if wrapper is not visible
                if ($wrapper.is(':hidden')) {
                    return;
                }

                // Reset on each check
                $menuItems.removeClass('mtfe-nav-hidden').show();
                $moreWrapper.hide();
                $moreDropdown.empty();

                // Check if menu overflows
                // We measure the parent width because the wrapper itself might have expanded if parent is inline-block
                var $measureParent = $wrapper.closest('.site-navigation').parent();
                if ($measureParent.length === 0) {
                    $measureParent = $wrapper.closest('.elementor-widget-container');
                }
                if ($measureParent.length === 0) {
                    $measureParent = $wrapper.parent();
                }
                var wrapperWidth = $measureParent.width();

                if (!wrapperWidth || wrapperWidth <= 0) {
                    return;
                }

                // First, check total width without overflow button
                var totalWidth = 0;
                $menuItems.each(function () {
                    totalWidth += $(this).outerWidth(true);
                });

                // If total width is within wrapper, we're done
                if (totalWidth <= wrapperWidth) {
                    $wrapper.addClass('mtfe-nav-ready');
                    return;
                }

                // We have overflow, measure more button width
                $moreWrapper.css({
                    position: 'absolute',
                    visibility: 'hidden',
                    display: 'flex',
                    width: 'auto'
                });
                var moreButtonWidth = $moreWrapper.outerWidth(true) || 40;
                $moreWrapper.css({ position: '', visibility: '', display: 'none', width: '' });

                var hiddenItems = [];
                var availableWidth = wrapperWidth - moreButtonWidth - 10; // 10px safety margin
                var currentWidth = 0;

                $menuItems.each(function () {
                    var $item = $(this);
                    var itemWidth = $item.outerWidth(true);

                    if (currentWidth + itemWidth > availableWidth) {
                        $item.addClass('mtfe-nav-hidden').hide();
                        var $clonedItem = $item.clone(true, true);
                        $clonedItem.removeClass('mtfe-nav-hidden').css('display', 'block');
                        hiddenItems.push($clonedItem);
                    } else {
                        currentWidth += itemWidth;
                    }
                });

                // If there are hidden items, show more button and populate dropdown
                if (hiddenItems.length > 0) {
                    $moreWrapper.show().css('display', 'flex');

                    hiddenItems.forEach(function ($item) {
                        $moreDropdown.append($item);
                    });
                }

                // Add ready class to show the menu after calculations
                $wrapper.addClass('mtfe-nav-ready');
            });
        }
        
        // Run on page load (with delay to ensure DOM is ready)
        setTimeout(handleMenuOverflow, 100);

        // Run after images and fonts load (affects width calculations)
        $(window).on('load', function () {
            setTimeout(handleMenuOverflow, 100);
        });

        // Run on window resize with debounce
        var resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                handleMenuOverflow();
            }, 250);
        });

        // Elementor Editor Support
        if (typeof elementor !== 'undefined' && elementor.on) {
            // Trigger when Elementor frontend is initialized
            elementor.on('frontend:init', function() {
                setTimeout(handleMenuOverflow, 300);
            });

            // Trigger when Elementor panel is shown/hidden (affects available width)
            elementor.on('panel:show', function() {
                setTimeout(handleMenuOverflow, 300);
            });

            elementor.on('panel:hide', function() {
                setTimeout(handleMenuOverflow, 300);
            });

            // Trigger when widget settings are changed
            elementor.hooks.addAction('panel/open_editor/widget/mtfe-navigation', function() {
                setTimeout(handleMenuOverflow, 300);
            });

            // Trigger on elementor:refresh event (when widgets are refreshed)
            elementor.on('element:refresh', function(model) {
                if (model.get('widgetType') === 'mtfe-navigation') {
                    setTimeout(handleMenuOverflow, 300);
                }
            });

            // Trigger when preview device mode changes
            elementor.on('preview:device:change', function() {
                setTimeout(handleMenuOverflow, 400);
            });

            // Periodic check in Elementor editor (fallback)
            if ($('body').hasClass('elementor-editor-active')) {
                var elementorCheckInterval = setInterval(function() {
                    if ($('body').hasClass('elementor-editor-active')) {
                        handleMenuOverflow();
                    } else {
                        clearInterval(elementorCheckInterval);
                    }
                }, 1000);
            }
        }

    });
    
    $(document).ready(function () {
        
        $(document).on('click', '.mtfe-search-icon', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).data('target');
            $('#' + target).addClass('is-active');
            $('body').addClass('mtfe-off-canvas-active').css('overflow', 'hidden');

            setTimeout(function () {
                $('#' + target + ' input[type="search"]').focus();
            }, 600);
        });


        $(document).on('click', '.mtfe-search-close', function () {
            var $overlay = $(this).closest('.mtfe-search-overlay');
            $overlay.removeClass('is-active');
            $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
        });

        // Close search when clicking on overlay backdrop (outside the inner box)
        $(document).on('click', '.mtfe-search-overlay', function (e) {
            // Only close if clicking directly on the overlay, not on children
            if ($(e.target).hasClass('mtfe-search-overlay')) {
                $(this).removeClass('is-active');
                $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
            }
        });

        // Prevent clicks inside the overlay inner from closing
        $(document).on('click', '.mtfe-search-overlay-inner', function (e) {
            e.stopPropagation();
        });


        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                if ($('.mtfe-search-overlay.is-active').length) {
                    $('.mtfe-search-overlay.is-active').removeClass('is-active');
                    $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
                }
            }
        });

        
    });

    $(document).ready(function () {
        
        // Handle account popup trigger click
        $(document).on('click', '.mtfe-account-popup-trigger', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).data('target');
            if (target) {
                $('#' + target).addClass('is-active');
                $('body').addClass('mtfe-off-canvas-active').css('overflow', 'hidden');
            }
        });

        // Close account modal when clicking close button
        $(document).on('click', '.mtfe-account-modal .mt-search-close', function () {
            var $overlay = $(this).closest('.mtfe-account-modal');
            $overlay.removeClass('is-active');
            $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
        });

        // Close account modal when clicking on overlay backdrop (outside the inner box)
        $(document).on('click', '.mtfe-account-modal', function (e) {
            // Only close if clicking directly on the modal, not on children
            if ($(e.target).hasClass('mtfe-account-modal')) {
                $(this).removeClass('is-active');
                $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
            }
        });

        // Prevent clicks inside the modal inner from closing
        $(document).on('click', '.mtfe-account-modal-inner', function (e) {
            e.stopPropagation();
        });

        // Close account modal with Escape key
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                if ($('.mtfe-account-modal.is-active').length) {
                    $('.mtfe-account-modal.is-active').removeClass('is-active');
                    $('body').removeClass('mtfe-off-canvas-active').css('overflow', '');
                }
            }
        });

        // Handle tab switching in account modal
        $(document).on('click', '.mtfe-account-form-tabs button', function (e) {
            e.preventDefault();
            var tab = $(this).data('tab');
            var $tabs = $(this).closest('.mtfe-account-form-tabs');
            var $contents = $tabs.siblings('.mtfe-account-tab-content');
            
            // Update active tab button
            $tabs.find('button').removeClass('active');
            $(this).addClass('active');
            
            // Update active tab content
            $contents.removeClass('active');
            $('#mtfe-' + tab + '-tab').addClass('active');
        });

        // Handle dropdown on mobile (click to toggle)
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 767;
        
        if (isMobile) {
            $(document).on('click', '.mtfe-account-has-dropdown .mtfe-account-icon-wrapper', function (e) {
                var $container = $(this).closest('.mtfe-account-icon-container');
                var $dropdown = $container.find('.mtfe-account-dropdown');
                
                // Toggle dropdown
                if ($dropdown.hasClass('is-active')) {
                    $dropdown.removeClass('is-active');
                } else {
                    // Close other dropdowns
                    $('.mtfe-account-dropdown').removeClass('is-active');
                    $dropdown.addClass('is-active');
                }
                
                // Don't follow the link if dropdown is open
                if ($dropdown.hasClass('is-active')) {
                    e.preventDefault();
                }
            });

            // Close dropdown when clicking outside
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.mtfe-account-icon-container').length) {
                    $('.mtfe-account-dropdown').removeClass('is-active');
                }
            });
        }
        
    });
})(jQuery);