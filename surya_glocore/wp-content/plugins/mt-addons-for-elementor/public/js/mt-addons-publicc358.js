// Row Overlay mover outside column 
(function ($) {
	'use strict';
    

    $(document).ready(function () {
        MTProgressBar.init();
    });
     
    var MTProgressBar = {
        init: function () {
            var bars = $('.mt-addons-progress-bar');

            if (bars.length) {
                bars.each(function (i) {
                    // Getting progress bar attrs
                    var thisItem = $(this), 
                        thisItem_id = thisItem.attr('id'),
                        thisItem_id_attr = thisItem.attr('data-progressbar-id'),
                        color = thisItem.attr('data-progressbar-color'),
                        trail_color = thisItem.attr('data-progressbar-trail-color'),
                        duration = thisItem.attr('data-progressbar-duration'),
                        number = thisItem.attr('data-progressbar-data-number'),
                        stroke_width = thisItem.attr('data-progressbar-data-bar-stroke'),
                        bar_height = thisItem.attr('data-progressbar-data-bar-height'),
                        trail_width = thisItem.attr('data-progressbar-data-trail-width'),
                        percentageType = thisItem.attr('data-progressbar-percentage-type');
         				
					if (color == '') {
                        color = '#FFEA82';
                    }
                    
                    if (trail_color == '') {
                        trail_color = '#eee';
                    }else{
                        trail_color = trail_color;
                    }
                    if (duration == '') {
                        duration = 1400;
                    }else{
                        duration = parseInt(duration);
                    }
 					if (number == '') {
                      number = 0.5;
                    }else{
                      number = number;
                    }
                    if (stroke_width == '') {
                        stroke_width = 4;
                    }else{
                        stroke_width = stroke_width;
                    }
                    if (bar_height == '') {
                        bar_height = 100;
                    }else{
                        bar_height = bar_height;
                    }
                    if (trail_width == '') {
                        trail_width = 100;
                    }else{
                        trail_width = trail_width;
                    }
                    var bar = new ProgressBar.Line("#"+thisItem_id,
                    {
					  strokeWidth: stroke_width,
                      easing: 'bounce',
					  duration: duration,
					  color: color,
					  trailColor: trail_color,
					  trailWidth: trail_width,
					  svgStyle: {
					  	width: '100%', 
					  	height: bar_height,
					  },
					  text: {
						className: percentageType,

					    style: {
					      // Text color.
					      // Default: same as stroke color (options.color)
					      color: '#999',
					      position: 'absolute',
					      right: '0',
					      top: '30px',
					      padding: 0,
					      margin: 0,
					      transform: null
					    },
					    autoStyleContainer: false
					  },
					  from: {color: '#FFEA82'},
					  to: {color: '#ED6A5A'},
					  step: (state, bar) => {
					    bar.setText(Math.round(bar.value() * 100) + ' %');
					  }

					});
					bar.animate( number );  // Number from 0.0 to 1.0
                });
            }
        }
    };
    

	jQuery(document).ready(function () {
	    // Buttons
	    if ( jQuery( ".mt-addons_button_holder .mt-addons_button" ).length ) {
		    jQuery( ".mt-addons_button_holder .mt-addons_button" ).mouseover(function() {
		        // bg
		        var hover_color_bg = jQuery( this ).attr('data-bg-hover');
		        // color
		        var hover_color_text = jQuery( this ).attr('data-text-color-hover');
		        //border
		        var border_color_hover = jQuery( this ).attr('data-border-hover');

		        jQuery( this ).css("background",hover_color_bg);
		        jQuery( this ).css("color",hover_color_text);
		        jQuery( this ).css("border",border_color_hover);
		    }).mouseout(function() {

		        var color_text = jQuery( this ).attr('data-text-color');
		        var color_bg = jQuery( this ).attr('data-bg');
		        var border_color = jQuery( this ).attr('data-border');
		        
		        jQuery( this ).css("background",color_bg);
		        jQuery( this ).css("color",color_text);
		        jQuery( this ).css("border",border_color);
		    });
		}

		// Buttons
	    if ( jQuery( ".mt-addons-products-list .category" ).length ) {
			jQuery( ".mt-addons-products-list .category" ).mouseover(function() {
				// bg
				var hover_color_bg = jQuery( this ).attr('data-bg-hover');
				// color
				var hover_color_text = jQuery( this ).attr('data-text-color-hover');

				jQuery( this ).css("background",hover_color_bg);
				jQuery( this ).css("color",hover_color_text);
			}).mouseout(function() {
				var color_text = jQuery( this ).attr('data-text-color');
				var color_bg = jQuery( this ).attr('data-bg');

				jQuery( this ).css("background",color_bg);
				jQuery( this ).css("color",color_text);
			});
		}

    });


    $(document).ready(function () {
        MTAddonsRowOverlay.init();
    });
    
    var MTAddonsRowOverlay = {
        init: function () {
            var $rowOverlays = $('.mt_addons-row-overlay');
            
            if ($rowOverlays.length) {
                $rowOverlays.each(function (i) {
                    var thisItem = $(this),
                        thisItemParent_InRow = $(this).parent().parent().parent().parent(),
                        thisItemParent_InCol = $(this).parent().parent(),
                        thisItem_data_in_col = $(this).attr('data-inner-column');
                    
                    if (thisItem_data_in_col == 'yes') {
                        // in col
                        thisItem.prependTo(thisItemParent_InCol);
                    }else{
                        // in row
                        thisItem.prependTo(thisItemParent_InRow);
                    }
                });
            }
        }
    };
    
    // Stacking Cards
    $(document).ready(function () {
        MTAddonsStackingCards.init();
    });
    
    var MTAddonsStackingCards = {
        init: function () {
            var stackingCards = $('.card');
            
            if (stackingCards.length) {
                let cards = document.querySelectorAll(".card");
            }
        }
    };
    

    jQuery(document).ready(function () {
    	// TIMELINE VERTICAL
		jQuery(document).ready(function(jQuery){
		  var timelineBlocks = jQuery('.mt-addons-timeline-item'),
		    offset = 0.8;

		  //hide timeline blocks which are outside the viewport
		  hideBlocks(timelineBlocks, offset);

		  //on scolling, show/animate timeline blocks when enter the viewport
		  jQuery(window).on('scroll', function(){
		    (!window.requestAnimationFrame) 
		      ? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
		      : window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
		  });

		  function hideBlocks(blocks, offset) {
		    blocks.each(function(){
		      ( jQuery(this).offset().top > jQuery(window).scrollTop()+jQuery(window).height()*offset ) && jQuery(this).find('.mt-addons-timeline-img, .mt-addons-timeline-content, .mt-addons-timeline-date, .mt-addons-timeline-title, .mt-addons-timeline-desc').addClass('is-hidden');
		    });
		  }

		  function showBlocks(blocks, offset) {
		    blocks.each(function(){
		      ( jQuery(this).offset().top <= jQuery(window).scrollTop()+jQuery(window).height()*offset && jQuery(this).find('.mt-addons-timeline-img').hasClass('is-hidden') ) && jQuery(this).find('.mt-addons-timeline-img, .mt-addons-timeline-content, .mt-addons-timeline-date, .mt-addons-timeline-title, .mt-addons-timeline-desc').removeClass('is-hidden').addClass('bounce-in');
		    });
		  }
		});

		//Start Webticker
		jQuery(document).ready(function($) { 
		    $('.mt-addons-ticker-list').each(function() {
		        var direction = $(this).attr('data-direction') || 'left';
		        var hoverpauseAttr = $(this).attr('data-disable-hoverpause') || 'false';
		        var hoverpause = (hoverpauseAttr !== undefined && hoverpauseAttr.toLowerCase() === 'true') ? false : true;
		        $(this).webTicker({
		            height: 'auto', 
		            duplicate: true,
		            startEmpty: false, 
		            rssfrequency: 5,
		            direction: direction,
		            hoverpause: hoverpause, 
		        });
		    });
		});
		//End Webticker
		
    	//Start Portfolio Grid Images
    	jQuery(document).ready(function($) {
	    	const portfolioGridImagesWidget = document.querySelector('.elementor-widget-mtfe-portfolio-grid-images');
	    	if (portfolioGridImagesWidget !== null) {
		    	document.querySelector('.elementor-widget-mtfe-portfolio-grid-images').addEventListener("mousemove", function(n) {
		        	t.style.left = n.clientX + "px", 
				    t.style.top = n.clientY + "px", 
				    e.style.left = n.clientX + "px", 
				    e.style.top = n.clientY + "px", 
				    i.style.left = n.clientX + "px", 
				    i.style.top = n.clientY + "px"
				    });
				    var t = document.getElementById("mt-portfolio-grid-image-cursor"),
				        e = document.getElementById("mt-portfolio-grid-image-cursor2"),
				        i = document.getElementById("mt-portfolio-grid-image-cursor3");
				    function n(t) {
				        e.classList.add("hover"), i.classList.add("hover")
				    }
				    function s(t) {
				        e.classList.remove("hover"), i.classList.remove("hover")
				    }
				    s();
				    for (var r = document.querySelectorAll(".mt-portfolio-grid-images-hover-target"), a = r.length - 1; a >= 0; a--) {
				        o(r[a])
				    }
				    function o(t) {
				        t.addEventListener("mouseover", n), t.addEventListener("mouseout", s)
				    }
				  
				    $(document).ready(function() {
				      $(document).on('mouseenter', '.mt-portfolio-grid-images-name', function() {
				        var index = $(this).index() + 1;

				        // Remove show class from existing shown image
				        $('.mt-portfolio-grid-images li.show').removeClass('show');

				        // Add show class to the corresponding image based on the index
				        $('.mt-portfolio-grid-images li:nth-child(' + index + ')').addClass('show');

				        // Handle other actions specific to the hovered item
				      });

				      $('.mt-portfolio-grid-images-name:nth-child(1)').trigger('mouseenter');
				    });
			}
		});
    	//End

		//Start Product Category tabs
		jQuery(document).ready(function () {
	    	jQuery('.mt-addons-category-nav a').on('click', function (event) {
	        	event.preventDefault();
	        
	        	jQuery('.tab-active').removeClass('tab-active');
	        	jQuery(this).parent().addClass('tab-active');
	        	jQuery('.mt-addons-products-wrap section').hide();
	        	jQuery(jQuery(this).attr('href')).show();
	    	});

	    	jQuery('.mt-addons-category-nav a:first').trigger('click');
		});
		//End product category tabs


		//Start Tabs v2
		jQuery(document).ready(function () {
		    jQuery('.mt-addons-tabs-v2').each(function () {
		        var $container = jQuery(this);

		        // Handle tab click events within this container
		        $container.find('.mt-addons-tabs-nav-v2 a').on('click', function (event) {
		            event.preventDefault();

		            // Remove active class from all tabs and add it to the clicked tab
		            $container.find('.tab-active').removeClass('tab-active');
		            jQuery(this).parent().addClass('tab-active');

		            // Hide all tab contents and show the one corresponding to the clicked tab
		            $container.find('.mt-addons-tab-content-v2 section').hide();
		            $container.find(jQuery(this).attr('href')).show();
		        });

		        // Trigger click on the first tab to initialize the tab state
		        $container.find('.mt-addons-tabs-nav-v2 a:first').trigger('click');
		    });
		});

		//End Tabs v2
		
    	//Start Map Pins
    	jQuery(document).ready(function(jQuery){

		    //open interest point description
		    jQuery('.mt-addons-map-single-point').children('a').on('click', function(){
		        var selectedPoint = jQuery(this).parent('li');
		        if( selectedPoint.hasClass('is-open') ) {
		            selectedPoint.removeClass('is-open').addClass('visited');
		        } else {
		            selectedPoint.addClass('is-open').siblings('.mt-addons-map-single-point').removeClass('is-open');
		        }
		    });
		    //close interest point description
		    jQuery('.mt-addons-pin-close').on('click', function(event){
		        event.preventDefault();        
		        jQuery(this).parents('.mt-addons-map-single-point').eq(0).removeClass('is-open').addClass('visited');
		    });
		});
    	//End Map Pins
    	
    	//Start Video
    	jQuery(document).ready(function () {
		      jQuery('.mt-addons-video-link').on('click', function (event) {
		        event.preventDefault();
		        var modalId = jQuery(this).data('target');
		        jQuery(modalId).show();
		        jQuery('.mt-addons-video-overlay').show();
		    });
		    jQuery('.close, .mt-addons-video-overlay').click(function(){
		        jQuery('.mt-addons-video-modal').hide();
		        jQuery('.mt-addons-video-overlay').hide();
		    });
		});	
    	//End Video
    	
    	//Begin: Accordion
    	jQuery(document).ready(function() {
	  		jQuery('.mt-addons-accordion-holder:first-child .mt-addons-accordion-header').addClass('active');
	  		jQuery('.mt-addons-accordion-holder:first-child').addClass('active');
		});

		jQuery(".mt-addons-accordion-header").click(function(){
		    jQuery(".mt-addons-accordion-header").each(function(){
		      jQuery(this).parent().removeClass("active");
		      jQuery(this).removeClass("active");
		    });
		    jQuery(this).parent().addClass("active");
		    jQuery(this).addClass("active");
		});
    	//End Accordion
    	
    	// Start Tab
		jQuery('.mt-addons-tabs-nav a').on('click', function (event) {
		    event.preventDefault();
		        
		    jQuery('.tab-active').removeClass('tab-active');
		    jQuery(this).parent().addClass('tab-active');
		    jQuery('.mt-addons-tab-content section').hide();
		    jQuery(jQuery(this).attr('href')).show();
		});

		jQuery('.mt-addons-tabs-nav a:first').trigger('click');
    	//End Tab

	    //Begin: Skills
	    if (jQuery('.mt-addons-skill-counter-stats-content').length) {
    		jQuery('.mt-addons-skill-counter-stats-content').appear(function () {
        		var $this = jQuery(this);
        		var countTo = $this.attr('data-perc');

        		jQuery({ countNum: $this.text() }).animate({
            		countNum: countTo
        		},
        		{
		            duration: 2000, // Adjust the duration of the counting animation
		            easing: 'linear',
		            step: function () {
		                $this.text(Math.floor(this.countNum));
		            },
		            complete: function () {
		                $this.text(this.countNum);
		            }
        		});
    		});  
		}
	    //End: Skills 

	    //Start: Highlighted text
	    setTimeout(function() {
		  var animating = document.querySelectorAll('.mt-addons-text-highlighted.animating');
		  for (var i = 0; i < animating.length; i++) {
		    animating[i].classList.remove('animating');
		  }
		}, 2000);

	    //End: Highlighted text 
	    //Start: WooCommerce Categories 
	    if ( jQuery( ".woocommerce_categories" ).length ) {
	        jQuery(".category a").click(function () {
	            var attr = jQuery(this).attr("class");

	            jQuery(".products_by_category").removeClass("active");
	            jQuery(attr).addClass("active");

	            jQuery('.category').removeClass("active");
	            jQuery(this).parent('.category').addClass("active");

	        });  
	        jQuery('.mt-addons-products-list-category .products_by_category:first').addClass("active");
	        jQuery('.mt_addons_categories_shortcode .category:first').addClass("active");
	    }
	    //End: WooCommerce Categories 
    }); 

    $(document).ready(function () {
        MTAddonsRowOverlay.init();
    });
    
    var MTAddonsRowOverlay = {
        init: function () {
            var $rowOverlays = $('.mt_addons-row-overlay');
            
            if ($rowOverlays.length) {
                $rowOverlays.each(function (i) {
                    var thisItem = $(this),
                        thisItemParent_InRow = $(this).parent().parent().parent().parent(),
                        thisItemParent_InCol = $(this).parent().parent(),
                        thisItem_data_in_col = $(this).attr('data-inner-column');
                    
                    if (thisItem_data_in_col == 'yes') {
                        // in col
                        thisItem.prependTo(thisItemParent_InCol);
                    }else{
                        // in row
                        thisItem.prependTo(thisItemParent_InRow);
                    }
                });
            }
        }
    };


})(jQuery);

