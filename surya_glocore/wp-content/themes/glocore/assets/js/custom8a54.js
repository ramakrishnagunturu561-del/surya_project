/*
 Project name:       glocore
 Project author:     ModelTheme
 File name:          Custom JS
*/

(function ($) {
    'use strict';

    $(document).ready(function() {

        // Superfish: hover on desktop, click-only on tablet/mobile
        var superfishBreakpoint = 1024;
        var $mainNavUl = $('.main-navigation ul');

        var toggleSpanClass = 'nav-dropdown-toggle';
        // Menus that get toggle on tablet/mobile: main nav, off-canvas, and page-list (menu-all-pages / mtfe-navigation-menu)
        var $mobileMenus = $('.main-navigation ul, .mtfe-off-canvas-panel .nav-menu, ul.mtfe-navigation-menu, #menu-all-pages').filter('ul');

        function initSuperfishDesktop() {
            $(document).off('click.superfishTabletMobile touchstart.superfishTabletMobile');
            $mobileMenus.find('.' + toggleSpanClass).remove();
            if ($mainNavUl.data('sfOptions')) {
                $mainNavUl.superfish('destroy');
            }
            $mainNavUl.superfish({
                delay: 800,
                animation: { opacity: 'show', height: 'show' },
                speed: 'fast',
                autoArrows: true
            });
        }

        function handleDropdownToggleClick(e) {
            var $toggle = $(e.target).closest('.' + toggleSpanClass);
            if (!$toggle.length) return;
            e.preventDefault();
            e.stopPropagation();
            var $menu = $toggle.closest('ul');
            var $li = $toggle.closest('li');
            var $sub = $li.children('.sub-menu, .children');
            if ($sub.length) {
                var isOpen = $li.hasClass('sfHover');
                $menu.find('li.menu-item-has-children, li.page_item_has_children').removeClass('sfHover');
                $menu.find('.sub-menu, .children').slideUp(200);
                if (!isOpen) {
                    $li.addClass('sfHover');
                    $sub.slideDown(200);
                }
            }
        }

        function initNavTabletMobile() {
            if ($mainNavUl.data('sfOptions')) {
                $mainNavUl.superfish('destroy');
            }
            $mobileMenus.find('.sub-menu, .children').hide();
            $mobileMenus.find('li').removeClass('sfHover');

            // Add toggle span to all menus (main nav + off-canvas)
            $mobileMenus.find('li.menu-item-has-children > a, li.page_item_has_children > a').each(function () {
                var $a = $(this);
                if ($a.find('.' + toggleSpanClass).length === 0) {
                    $a.append('<span class="' + toggleSpanClass + '" aria-label="Toggle submenu" role="button"><span class="nav-icon-angle" aria-hidden="true"></span></span>');
                }
            });

            $(document).off('click.superfishTabletMobile touchstart.superfishTabletMobile');
            $(document).on('click.superfishTabletMobile', '.' + toggleSpanClass, handleDropdownToggleClick);
        }

        function checkNavMode() {
            if ($(window).width() > superfishBreakpoint) {
                initSuperfishDesktop();
            } else {
                initNavTabletMobile();
            }
        }

        checkNavMode();
        var navResizeTimer;
        $(window).on('resize', function () {
            clearTimeout(navResizeTimer);
            navResizeTimer = setTimeout(checkNavMode, 150);
        });

         // Toggle Mobile Menu
        $(document).on('click', '.mtfe-nav-mobile-burger', function (e) {
            e.preventDefault();
            var targetId = $(this).data('target');
            var $panel = $('#' + targetId);

            $(this).toggleClass('is-active');
            $panel.toggleClass('is-active');
            $('body').toggleClass('mtfe-off-canvas-active');
        });

        // Close Mobile Menu via Close Button or Overlay
        $(document).on('click', '.mtfe-nav-mobile-close, .mtfe-off-canvas-overlay', function (e) {
            e.preventDefault();
            var $panel = $(this).closest('.mtfe-off-canvas-panel');
            var targetId = $panel.attr('id');

            $('.mtfe-nav-mobile-burger[data-target="' + targetId + '"]').removeClass('is-active');
            $panel.removeClass('is-active');
            $('body').removeClass('mtfe-off-canvas-active');
        });

        // Mobile Sub-menu Accordion - only prevent default if clicking on toggle button
        // Allow normal link navigation when clicking on the link text
        $(document).on('click', '.mtfe-off-canvas-panel .menu-item-has-children > a', function (e) {
            if ($(window).width() <= 1024) {
                var $link = $(this);
                var $clickedElement = $(e.target);
                
                // If clicking on dropdown toggle or menu toggle, let that handler manage it (no link nav)
                if ($clickedElement.closest('.mtfe-menu-toggle, .nav-dropdown-toggle').length) {
                    return;
                }
                
                // If clicking on the link itself (not toggle), allow normal navigation
                // Don't prevent default - let the link navigate normally
                // Only prevent if link is # or empty
                var href = $link.attr('href');
                if (!href || href === '#') {
                    e.preventDefault();
                    // Toggle submenu for empty links
                    var $li = $link.parent();
                    var $subMenu = $li.find('> .sub-menu');
                    if ($li.hasClass('is-open')) {
                        $li.removeClass('is-open');
                        $subMenu.slideUp();
                    } else {
                        $li.siblings('.is-open').removeClass('is-open').find('> .sub-menu').slideUp();
                        $li.addClass('is-open');
                        $subMenu.slideDown();
                    }
                }
                // Otherwise, allow normal navigation (don't prevent default)
            }
        });

        // Handle clicking outside mobile menu to close it (fallback)
        $(document).on('click touchstart', function (e) {
            if ($(window).width() <= 1024) {
                var $activePanel = $('.mtfe-off-canvas-panel.is-active');
                if ($activePanel.length > 0) {
                    var $target = $(e.target);
                    // If target is not inside the content and not the burger
                    if (!$target.closest('.mtfe-off-canvas-content').length && !$target.closest('.mtfe-nav-mobile-burger').length) {
                        $('.mtfe-nav-mobile-burger').removeClass('is-active');
                        $activePanel.removeClass('is-active');
                        $('body').removeClass('mtfe-off-canvas-active');
                    }
                }
            }
        });

        //Header part
        jQuery('.h-cart').on('hover', function() {
            /* Stuff to do when the mouse enters the element */
            jQuery('.header_mini_cart').addClass('visible_cart');
        }, function() {
            /* Stuff to do when the mouse leaves the element */
            jQuery('.header_mini_cart').removeClass('visible_cart');
        });

        jQuery('.header_mini_cart').on('hover', function() {
            /* Stuff to do when the mouse enters the element */
            jQuery(this).addClass('visible_cart');
        }, function() {
            /* Stuff to do when the mouse leaves the element */
            jQuery(this).removeClass('visible_cart');
        });


        // CHECKBOX TO LAYERED NAVIGATION
        if ( jQuery( ".woocommerce-widget-layered-nav-list" ).length ) {
            jQuery('.widget .product-categories > li').addClass('active');
            jQuery('.woocommerce-widget-layered-nav-list .chosen .checkbox').prop('checked', true);
            jQuery('.woocommerce-widget-layered-nav-list .checkbox').on('click', function(){
                jQuery(this).next()[0].click();
            });
        } 

        //Instant search in header
        jQuery('.glocore-header-searchform input#keyword').on('blur', function(){
            jQuery('.data_fetch').removeClass('focus');
        }).on('focus', function(){
            jQuery('.data_fetch').addClass('focus');
        });

        //Begin: Search Form
        if ( jQuery( "#glocore-search" ).length ) {
            new UISearch( document.getElementById( 'glocore-search' ) );
        }
        //End: Search Form

        // browser window scroll (in pixels) after which the "back to top" link is shown
        var offset = 300,
        //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        offset_opacity = 1200,
        //duration of the top scrolling animation (in ms)
        scroll_top_duration = 300,
        //grab the "back to top" link
        $back_to_top = jQuery('.glocore-back-to-top');

        //hide or show the "back to top" link
        jQuery(window).scroll(function(){
            ( jQuery(this).scrollTop() > offset ) ? $back_to_top.addClass('glocore-is-visible') : $back_to_top.removeClass('glocore-is-visible glocore-fade-out');
            if( jQuery(this).scrollTop() > offset_opacity ) { 
                $back_to_top.addClass('glocore-fade-out');
            }
        });

         $back_to_top.on('click touchstart', function(event){
            // event.preventDefault();
            $('body,html').animate({
                scrollTop: 0 ,
                }, scroll_top_duration
            );
        });

    });
    

    jQuery('.fixed-search-overlay .icon-close').on( "click touchstart tap", function() {
        jQuery('.fixed-search-overlay').removeClass('visible');
    });
    jQuery(document).keyup(function(e) {
         if (e.keyCode == 27) { // escape key maps to keycode `27`
            jQuery('.fixed-search-overlay').removeClass('visible');
            jQuery('.fixed-sidebar-menu').removeClass('open');
            jQuery('.fixed-sidebar-menu-overlay').removeClass('visible');
        }
    });
    
    var baseUrl = document.location.origin;
    if ($(window).width() < 768) { 
        jQuery("#dropdown-user-profile").on("click touchstart tap", function() {
            window.location.href = (baseUrl + '/my-account');
        });
    } 

} (jQuery) );


//Header part : Category button
(function ($) {
    'use strict';

    var openBtn = $('.category_button_wrap'),
    slideMenu = $('.button_dropdown'),
    headerBotClass = $('header');
    
    if (jQuery(window).width() > 1024) {
        if (slideMenu.hasClass("cat_open_default")) {
            openBtn.addClass("active");
            slideMenu.addClass("active");
            slideMenu.slideDown(300);
        }
    } else {
        slideMenu.slideUp(0);
        openBtn.removeClass("active");
        slideMenu.removeClass("active");
    }

    openBtn.on("click", function() {
        if (slideMenu.is(':hidden')) {
            slideMenu.slideDown(300);
            openBtn.addClass("active");
            openBtn.removeClass("close");
        } else {
            slideMenu.slideUp(300);
            openBtn.removeClass("active");
            openBtn.addClass("close");
            slideMenu.removeClass("active");
        }
    });
   
})(jQuery);

//Header part : Category button
(function ($) {
    'use strict';

    jQuery("#dropdown-user-profile").on({
        mouseenter: function () {
            jQuery(this).addClass("open");
        },
        mouseleave: function () {
            if(jQuery(this).hasClass("open")) {
                jQuery(this).removeClass("open");
            }
        }
    });
})(jQuery);


//Begin: Sticky Head
(function ($) {
    'use strict';

    jQuery(function(){
        if (jQuery('body').hasClass('glocore_is_nav_sticky')) {
            var topSpacing = 0;
            // Account for WordPress admin bar
            if (jQuery('body').hasClass('admin-bar')) {
                topSpacing = 32;
            }
            jQuery(".site-header").sticky({
                topSpacing: topSpacing
            });
        }
    });
})(jQuery);


// Navigation Submenus dropdown direction (right or left)
(function ($) { 
    'use strict';

            
})(jQuery);

/*LOGIN MODAL */
(function ($) {
    'use strict';

    var ModalEffects = (function() {
        function init_modal() {

            var overlay = document.querySelector( '.modeltheme-overlay' );
            var overlay_inner = document.querySelector( '.modeltheme-overlay-inner' );
            var modal_holder = document.querySelector( '.modeltheme-modal-holder' );
            var html = document.querySelector( 'html' );

            [].slice.call( document.querySelectorAll( '.modeltheme-trigger' ) ).forEach( function( el, i ) {

                var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
                    close = modal.querySelector( '.modeltheme-close' );

                function removeModal( hasPerspective ) {
                    classie.remove( modal, 'modeltheme-show' );
                    classie.remove( modal_holder, 'modeltheme-show' );
                    classie.remove( html, 'modal-open' );

                    if( hasPerspective ) {
                        classie.remove( document.documentElement, 'modeltheme-perspective' );
                    }
                }

                function removeModalHandler() {
                    removeModal( classie.has( el, 'modeltheme-setperspective' ) ); 
                }

                el.addEventListener( 'click', function( ev ) {
                    classie.add( modal, 'modeltheme-show' );
                    classie.add( modal_holder, 'modeltheme-show' );
                    classie.add( html, 'modal-open' );
                    overlay.removeEventListener( 'click', removeModalHandler );
                    overlay.addEventListener( 'click', removeModalHandler );

                    overlay_inner.removeEventListener( 'click', removeModalHandler );
                    overlay_inner.addEventListener( 'click', removeModalHandler );

                    if( classie.has( el, 'modeltheme-setperspective' ) ) {
                        setTimeout( function() {
                            classie.add( document.documentElement, 'modeltheme-perspective' );
                        }, 25 );
                    }
                });
            });
        }

        if (!jQuery("body").hasClass("login-register-page")) {
            init_modal();
        }

    })();

    jQuery("#modal-log-in #register-modal").on("click",function(){                       
        jQuery("#login-modal-content").fadeOut("fast", function(){
            jQuery("#signup-modal-content").fadeIn(500);
        });
    }); 
    jQuery("#modal-log-in .btn-login-p").on("click",function(){                       
        jQuery("#signup-modal-content").fadeOut("fast", function(){
            jQuery("#login-modal-content").fadeIn(500);
        });
    }); 

    jQuery("#login-content-shortcode .btn-register-shortcode").on("click",function(){                       
        jQuery("#login-content-shortcode").fadeOut("fast", function(){
           jQuery("#register-content-shortcode").fadeIn(500);
        });
    });    

    jQuery('#nav-menu-login').on("click",function(){ 
        jQuery(".modeltheme-show ~ .modeltheme-overlay, .modeltheme-show .modeltheme-overlay-inner").on("click",function(){ 
            jQuery("#signup-modal-content").fadeOut("fast");
            jQuery("#login-modal-content").fadeIn(500);
        });
    });

    jQuery('#register .user-role input[value="customer"]').on('click', function() {
        if(jQuery(this).is(':checked')) {
            jQuery('#signup-modal-content .show_if_seller').hide();
            jQuery('#signup-modal-content .show_if_seller input').each(function(){
                jQuery(this).prop('disabled', true);
            });
        }
    });

    jQuery('#register .user-role input[value="seller"]').on('click', function() {
        if(jQuery(this).is(':checked')) {
            jQuery('#register .show_if_seller').show(300);
            jQuery('#register .show_if_seller input').each(function(){
                jQuery(this).prop('disabled', false);
            });
        }
    });

    jQuery('#register .user-role input[value="customer"]').on('click', function() {
        if(jQuery(this).is(':checked')) {
            jQuery('#register .show_if_seller').hide(300);
        }
    });
    
    //accordeon footer
    if(jQuery(window).width() <= 991) {
        jQuery(".footer-column .widget-area .widget").each(function(){
            var heading = jQuery(this).find('h3.widget-title');
            jQuery(heading).on('click', function(){
                jQuery(heading).toggleClass("active");
                var siblings = jQuery(this).nextAll();
                jQuery(siblings).slideToggle();
            })
        });
    }   

})(jQuery);


(function ($) {
    'use strict';

    jQuery('.hamburger').on( "click", function() {
            // jQuery(this).toggleClass('open');
            jQuery('.fixed-sidebar-menu').toggleClass('open');
            jQuery(this).parent().find('#navbar').toggleClass('hidden');
            jQuery('.fixed-sidebar-menu-overlay').addClass('visible');
        });

        /* Click on Overlay - Hide Overline / Slide Back the Sidebar header */
        jQuery('.fixed-sidebar-menu-overlay').on( "click", function() {
            jQuery('.fixed-sidebar-menu').removeClass('open');
            jQuery(this).removeClass('visible');
        });    
        /* Click on Overlay - Hide Overline / Slide Back the Sidebar header */
        jQuery('.fixed-sidebar-menu .icon-close').on( "click", function() {
            jQuery('.fixed-sidebar-menu').removeClass('open');
            jQuery('.fixed-sidebar-menu-overlay').removeClass('visible');
        });
})(jQuery);


//eamo theme
(function ($) {
    'use strict';

    jQuery('#field_7').val('Relationship');
    jQuery('#field_2').val('Women'); 
    jQuery('#field_6_range').val('20');
    jQuery('input[name="field_6_range[max]"]').val('29');
})(jQuery);

//MT Preloader
(function ($) {
    'use strict';

    var $holder    = jQuery('.glocore_preloader_holder');
    if (!$holder.length) return;

    var isGarage   = $holder.hasClass('glocore_preloader_holder--garage');
    var minDelay   = isGarage ? 3100 : 400;
    var startTime  = Date.now();
    var faded      = false;

    function hidePreloader() {
        if (faded) return;
        faded = true;
        var elapsed = Date.now() - startTime;
        var wait    = Math.max(0, minDelay - elapsed);
        setTimeout(function () {
            $holder.fadeOut(isGarage ? 300 : 500, function () { jQuery(this).remove(); });
        }, wait);
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        jQuery(window).on('load', hidePreloader);
    }

    setTimeout(hidePreloader, 3000);
})(jQuery);

//mt mega menu expand
(function ($) {
'use strict';

if (jQuery(window).width() < 768) {
    var expand = '<span class="nav-toggle-icon"><i class="nav-icon-angle"></i></span>';
    jQuery('.nav-menu-mobile .mega_menu').append(expand);
            jQuery(".mega_menu .nav-toggle-icon").on("click",function() {
            jQuery('.nav-menu-mobile .cf-mega-menu').toggle();
            jQuery('.nav-menu-mobile .cf-mega-menu').toggleClass("show-menu");
        });
} else {
   var expand = '<span class="nav-icon-angle">&nbsp;</span>';
    jQuery('.site-navigation .mega_menu .link-before').append(expand); 
}
})(jQuery);

// Elementor custom header: reveal soon after DOM ready (faster than waiting for full load)
(function() {
    'use strict';

    var header = document.querySelector('.site-header.header-custom-layout.glocore-header-fade-in');
    if (!header) {
        return;
    }

    function reveal() {
        header.classList.add('glocore-header-visible');
    }

    function runReveal() {
        requestAnimationFrame(function() {
            requestAnimationFrame(reveal);
        });
    }

    var delay = 60;
    function scheduleReveal() {
        setTimeout(runReveal, delay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleReveal);
    } else {
        scheduleReveal();
    }
})();

(function( $ ) {
    'use strict';

    $('.zoom-img--main')
        // tile mouse actions
        .on('mouseover', function(){
          $(this).children('.zoom-img--main__img').css({'transform': 'scale(1.2)'});
        })
        .on('mouseout', function(){
          $(this).children('.zoom-img--main__img').css({'transform': 'scale(1)'});
        })
        .on('mousemove', function(e){
          $(this).children('.zoom-img--main__img').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
        })
        // tiles set up
        .each(function(){
          $(this)
            // add a image container
            .append('<div class="zoom-img--main__img"></div>')
            // set up a background image for each tile based on data-image attribute
            .children('.zoom-img--main__img').css('background-image', 'url(' + $(this).find('img').attr('src') + ')');

        });
})( jQuery );

// AJAX search
function glocore_fetch_products(){
    jQuery.ajax({
        url: glocore_ajax.url,
        type: 'post',
        data: {
            action: 'glocore_search_form_data_fetch',
            keyword: jQuery('.search-keyword').val(),
            category_slug: jQuery('.search-form-product select option:selected').val()
        },
        success: function(data) {
            jQuery('.data_fetch').html( data );
        }
    });
} 