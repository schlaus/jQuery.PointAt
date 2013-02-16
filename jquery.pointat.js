/**
 * @name jQuery PointAt
 * @version 1.0
 * @author Klaus Karkia
 * @license MIT license
 * 
 * Last update: 12.2.2013
 * 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Website: http://pointat.idenations.com
 * Contact: pointat@idenations.com
 *
 * Requires jqueryrotate, http://code.google.com/p/jqueryrotate/
 * or a similar library that offers $("#element").rotate(angle) functionality
 * 
 */

(function($){
	
	var settings, defaults, methods = {		
		init: function(options) {
			defaults = {
				hookScroll: true,
				hookDrag: true,
				draggable: null,
				pointAtInit: true,
				defaultDirection: "up",
				angleLessThanFunc: null,
				angleGreaterThanFunc: null,
				getAngleFrom: null,
				passAngleTo: null,
				xCorrection: 0,
				yCorrection: 0,
				pause: false
			};
			settings = $.extend({}, defaults, options);
			return this.each(function() {
				var nr = $("body").data("pointatcount"),
					myid = $(this).data("myid.pointat"),
					nspace = ".pointat",
					$this = this;
				myid = +myid || 0;	
				nspace = ".pointat" + myid;
				if (myid > 0) {
					oldsettings = $(this).data("settings.pointat");
					$.each(settings, function(index, value) {
						if (value === defaults[index]) {
							settings[index] = oldsettings[index];
						}
					});
					$(this).data("settings.pointat", settings);
				} else {
					nr = +nr || 0;
					nr++;
					nspace = ".pointat" + nr;
					$(this).data("settings.pointat", settings);
					$(this).data("myid.pointat", nr);
					$("body").data("pointatcount", nr);
				}
				if(settings.hookScroll) {
					scrollnspace = "scroll" + nspace;
					$(window).bind(scrollnspace, function() {
						methods.updateRotation.apply($this);
					});
				}
				
				if(settings.hookDrag) {
					if(settings.draggable !== null) {
						$(settings.draggable).bind("drag.pointat", function() {
							methods.updateRotation.apply($this);
						});
					} else {
						$($this).bind("drag.pointat", function() {
							methods.updateRotation.apply($this);	
						});
					}
				}
				if(settings.pointAtInit) {
					methods.updateRotation.apply(this);
				}
			});
			
		},
		
		getAngle: function() {
			settings = $(this).data("settings.pointat");
			if (!settings) {
				$.error( 'Method getAngle used on an element that does not have jQuery.PointAt initialized.');
			}
			var tpos,
				apos = $(settings.target).offset(),
				angle = 0;
			
			if (settings.getAngleFrom !== null) {
				tpos = $(settings.getAngleFrom).offset();
			} else {
				tpos = $(this).offset();
			}

			angle = Math.atan2(((apos.left + settings.xCorrection) - tpos.left), ((apos.top + settings.yCorrection) - tpos.top)) * 180 / Math.PI;
				
			angle = 180 - Math.ceil(angle);
			
			if (settings.defaultDirection === "right") {
				angle = angle - 90;
			} else if (settings.defaultDirection === "down") {
				angle = angle - 180;
			} else if (settings.defaultDirection === "left") {
				angle = angle - 270;
			} else if (settings.defaultDirection === "up") {
				// No modification needed
			} else {
				angle = angle - parseInt(settings.defaultDirection, 10);
			}
			if (angle < 0) {
				angle = 360 + angle;
			} else if (angle > 360) {
				angle = 0 + angle;
			}
			return angle;			
		},
		
		updateRotation: function() {
			return $(this).each(function() {
				settings = $(this).data("settings.pointat");
				if (!settings) {
					$.error( 'Method updateRotation used on an element that does not have jQuery.PointAt initialized.');
				}
				var	angle = methods.getAngle.apply(this);
	
				if (settings.angleLessThanFunc !== null) {
					if (angle < settings.angleLessThan) {
						settings.angleLessThanFunc.apply(this);
					}
				}
				if (settings.angleGreaterThanFunc !== null) {
					if (angle > settings.angleGreaterThan) {
						settings.angleGreaterThanFunc.apply(this);
					}
				}
				if (settings.passAngleTo !== null) {
					if ($(settings.passAngleTo).is("input")) {
						$(settings.passAngleTo).val(angle);
					} else {
						$(settings.passAngleTo).html(angle);					
					}
				}
				if (settings.pause === false) {
					$(this).rotate(angle);
				}
			});
		},

		destroy: function() {
			return this.each(function() {
				settings = $(this).data("settings.pointat");
				if (!settings) {
					$.error( 'Method destroy used on an element that does not have jQuery.PointAt initialized.');
				}
				var myid = $(this).data("myid.pointat"),
					nspace = ".pointat";
				myid = +myid || 0;	
				nspace = ".pointat" + myid;
				$(window).unbind(nspace);
				if(settings.hookDrag) {
					if(settings.draggable !== null) {
						$(settings.draggable).unbind("drag.pointat");
					} else {
						$(this).unbind("drag.pointat");
					}
				}
				$(this).removeData('settings.pointat');
				$(this).removeData('myid.pointat');
			});
		},
		
		pause: function() {
			return this.each(function() {
				settings = $(this).data("settings.pointat");
				if (settings) {
					settings.pause = true;
					$(this).data("settings.pointat", settings);
				} else {
					$.error( 'Method pause used on an element that does not have jQuery.PointAt initialized.');
				}
			});
		},

		resume: function() {
			return this.each(function() {
				settings = $(this).data("settings.pointat");
				if (settings) {
					settings.pause = false;
					$(this).data("settings.pointat", settings);
				} else {
					$.error( 'Method resume used on an element that does not have jQuery.PointAt initialized.');
				}
			});
		}
};
	
	$.fn.pointat = function(method){

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.pointat' );
		}    
	};

})(jQuery);