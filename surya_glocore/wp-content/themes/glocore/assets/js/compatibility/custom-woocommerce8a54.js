// Responsive Set Height Products
(function ($) {
    'use strict';

    jQuery(function() {

        if ( jQuery( ".woocommerce-tabs .tabs.wc-tabs" ).length ) {
            jQuery(".woocommerce-tabs .tabs.wc-tabs > li > a").matchHeight({
                byRow: true
            });
        }

        if (jQuery("body").hasClass("woocommerce-js")) {
            jQuery('.products .product .woocommerce-title-metas').matchHeight({
                byRow: true
            });
        }
    });
})(jQuery);

//Begin: WooCommerce Quantity
(function ($) {
    'use strict';

    jQuery( function( $ ) {
    if ( ! String.prototype.getDecimals ) {
        String.prototype.getDecimals = function() {
            var num = this,
                match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if ( ! match ) {
                return 0;
            }
            return Math.max( 0, ( match[1] ? match[1].length : 0 ) - ( match[2] ? +match[2] : 0 ) );
        }
    }
    // Quantity "plus" and "minus" buttons
    $( document.body ).on( 'click', '.plus, .minus', 
        function() {
                
            if (jQuery('form.auction_form.cart').length){
                // nothing
            }else{
                var $qty        = $( this ).closest( '.quantity' ).find( '.qty'),
                    currentVal  = parseFloat( $qty.val() ),
                    max         = parseFloat( $qty.attr( 'max' ) ),
                    min         = parseFloat( $qty.attr( 'min' ) ),
                    step        = $qty.attr( 'step' );

                // Format values
                if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) currentVal = 0;
                if ( max === '' || max === 'NaN' ) max = '';
                if ( min === '' || min === 'NaN' ) min = 0;
                if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

                // Change the value
                if ( $( this ).is( '.plus' ) ) {
                    if ( max && ( currentVal >= max ) ) {
                        $qty.val( max );
                    } else {
                        $qty.val( ( currentVal + parseFloat( step )).toFixed( step.getDecimals() ) );
                    }
                } else {
                    if ( min && ( currentVal <= min ) ) {
                        $qty.val( min );
                    } else if ( currentVal > 0 ) {
                        $qty.val( ( currentVal - parseFloat( step )).toFixed( step.getDecimals() ) );
                    }
                }

                // Trigger change event
                $qty.trigger( 'change' );
            }
        });
    });
})(jQuery);

// Style the select fields
(function ($) {
    'use strict';

    if( jQuery( '.variations select' ).length == 0 ||  jQuery( '.glocore-header-searchform select' ).length == 0 || jQuery( '.widget_archive select' ).length == 0 || jQuery( '.widget_categories select' ).length == 0 || jQuery( '.widget_text select' ).length == 0  || jQuery( '.woocommerce-ordering select' ).length == 0 ) {
        jQuery('.variations select, .glocore-header-searchform select, .widget_archive select, .widget_categories select, .widget_text select, .woocommerce-ordering select').select2({
            containerCssClass: "glocore-select2",
            dropdownCssClass: "glocore-open-dropdown"
        });
    }
})(jQuery);

// Shop filters sidebar button (mobile)
(function ($) {
    'use strict';
    
    $(document).ready(function() {
        jQuery( '.glocore-shop-filters-button' ).on( "click", function(event) {
            event.preventDefault();
            jQuery('.glocore-shop-sidebar').toggleClass('is-active');
        });

        // Shop filters sidebar closing
        jQuery( '.glocore-shop-sidebar-close-btn' ).on( "click", function(event) {
            event.preventDefault();
            jQuery('.glocore-shop-sidebar').removeClass('is-active');
        });
    });
})(jQuery);
