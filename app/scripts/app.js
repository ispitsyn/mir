import svg4everybody from 'svg4everybody';
import 'owl.carousel';


$(() => {

	(function ($) {
		$.easyPieChart = function (el, options) {
			var addScaleLine, animateLine, drawLine, easeInOutQuad, rAF, renderBackground, renderScale, renderTrack,
				_this = this;
			this.el = el;
			this.$el = $(el);
			this.$el.data("easyPieChart", this);
			this.init = function () {
				var percent, scaleBy;
				_this.options = $.extend({}, $.easyPieChart.defaultOptions, options);
				percent = parseInt(_this.$el.data('percent'), 10);
				_this.percentage = 0;
				_this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "'></canvas>").get(0);
				_this.$el.append(_this.canvas);
				if (typeof G_vmlCanvasManager !== "undefined" && G_vmlCanvasManager !== null) {
					G_vmlCanvasManager.initElement(_this.canvas);
				}
				_this.ctx = _this.canvas.getContext('2d');
				if (window.devicePixelRatio > 1) {
					scaleBy = window.devicePixelRatio;
					$(_this.canvas).css({
						width: _this.options.size,
						height: _this.options.size
					});
					_this.canvas.width *= scaleBy;
					_this.canvas.height *= scaleBy;
					_this.ctx.scale(scaleBy, scaleBy);
				}
				_this.ctx.translate(_this.options.size / 2, _this.options.size / 2);
				_this.ctx.rotate(_this.options.rotate * Math.PI / 180);
				_this.$el.addClass('easyPieChart');
				_this.$el.css({
					width: _this.options.size,
					height: _this.options.size,
					lineHeight: "" + _this.options.size + "px"
				});
				_this.update(percent);
				return _this;
			};
			this.update = function (percent) {
				percent = parseFloat(percent) || 0;
				if (_this.options.animate === false) {
					drawLine(percent);
				} else {
					animateLine(_this.percentage, percent);
				}
				return _this;
			};
			renderScale = function () {
				var i, _i, _results;
				_this.ctx.fillStyle = _this.options.scaleColor;
				_this.ctx.lineWidth = 1;
				_results = [];
				for (i = _i = 0; _i <= 24; i = ++_i) {
					_results.push(addScaleLine(i));
				}
				return _results;
			};
			addScaleLine = function (i) {
				var offset;
				offset = i % 6 === 0 ? 0 : _this.options.size * 0.017;
				_this.ctx.save();
				_this.ctx.rotate(i * Math.PI / 12);
				_this.ctx.fillRect(_this.options.size / 2 - offset, 0, -_this.options.size * 0.05 + offset, 1);
				_this.ctx.restore();
			};
			renderTrack = function () {
				var offset;
				offset = _this.options.size / 2 - _this.options.lineWidth / 2;
				if (_this.options.scaleColor !== false) {
					offset -= _this.options.size * 0.08;
				}
				_this.ctx.beginPath();
				_this.ctx.arc(0, 0, offset, 0, Math.PI * 2, true);
				_this.ctx.closePath();
				_this.ctx.strokeStyle = _this.options.trackColor;
				_this.ctx.lineWidth = _this.options.lineWidth;
				_this.ctx.stroke();
			};
			renderBackground = function () {
				if (_this.options.scaleColor !== false) {
					renderScale();
				}
				if (_this.options.trackColor !== false) {
					renderTrack();
				}
			};
			drawLine = function (percent) {
				var offset;
				renderBackground();
				_this.ctx.strokeStyle = $.isFunction(_this.options.barColor) ? _this.options.barColor(percent) : _this.options.barColor;
				_this.ctx.lineCap = _this.options.lineCap;
				_this.ctx.lineWidth = _this.options.lineWidth;
				offset = _this.options.size / 2 - _this.options.lineWidth / 2;
				if (_this.options.scaleColor !== false) {
					offset -= _this.options.size * 0.08;
				}
				_this.ctx.save();
				_this.ctx.rotate(-Math.PI / 2);
				_this.ctx.beginPath();
				_this.ctx.arc(0, 0, offset, 0, Math.PI * 2 * percent / 100, false);
				_this.ctx.stroke();
				_this.ctx.restore();
			};
			rAF = (function () {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
			})();
			animateLine = function (from, to) {
				var anim, startTime;
				_this.options.onStart.call(_this);
				_this.percentage = to;
				Date.now || (Date.now = function () {
					return +(new Date);
				});
				startTime = Date.now();
				anim = function () {
					var currentValue, process;
					process = Date.now() - startTime;
					if (process < _this.options.animate) {
						rAF(anim);
					}
					_this.ctx.clearRect(-_this.options.size / 2, -_this.options.size / 2, _this.options.size, _this.options.size);
					renderBackground.call(_this);
					currentValue = [easeInOutQuad(process, from, to - from, _this.options.animate)];
					_this.options.onStep.call(_this, currentValue);
					drawLine.call(_this, currentValue);
					if (process >= _this.options.animate) {
						return _this.options.onStop.call(_this, currentValue, to);
					}
				};
				rAF(anim);
			};
			easeInOutQuad = function (t, b, c, d) {
				var easeIn, easing;
				easeIn = function (t) {
					return Math.pow(t, 2);
				};
				easing = function (t) {
					if (t < 1) {
						return easeIn(t);
					} else {
						return 2 - easeIn((t / 2) * -2 + 2);
					}
				};
				t /= d / 2;
				return c / 2 * easing(t) + b;
			};
			return this.init();
		};
		$.easyPieChart.defaultOptions = {
			barColor: '#ef1e25',
			trackColor: '#f2f2f2',
			scaleColor: '#dfe0e0',
			lineCap: 'round',
			rotate: 0,
			size: 110,
			lineWidth: 3,
			animate: false,
			onStart: $.noop,
			onStop: $.noop,
			onStep: $.noop
		};
		$.fn.easyPieChart = function (options) {
			return $.each(this, function (i, el) {
				var $el, instanceOptions;
				$el = $(el);
				if (!$el.data('easyPieChart')) {
					instanceOptions = $.extend({}, options, $el.data());
					return $el.data('easyPieChart', new $.easyPieChart(el, instanceOptions));
				}
			});
		};
		return void 0;
	})(jQuery);

	svg4everybody();

	$('.slider-main').owlCarousel({
		loop: false,
		items: 1,
		stageOuterClass: 'slider__stage-outer',
		stageClass: 'slider__stage',
		dragClass: 'slider_drag_true',
		navContainerClass: 'slider__nav',
		dotsClass: 'slider__dots',
		navClass: ["slider__prev", "slider__next"],
		dotClass: 'slider__dot',
		loadedClass: 'slider_loaded_true',
		nav: false,
		pagination: true,
	});

	$('.slider-apartment').owlCarousel({
		loop: true,
		items: 1,
		stageOuterClass: 'slider__stage-outer',
		stageClass: 'slider__stage',
		dragClass: 'slider_drag_true',
		navContainerClass: 'slider__nav',
		dotsClass: 'slider__dots',
		navClass: ["slider__prev", "slider__next"],
		dotClass: 'slider__dot',
		loadedClass: 'slider_loaded_true',
		nav: true,
		navText: ["", ""],
		dots: false
	});

	!function () {
		var a = function (a, b) {
			var c = document.createElement("canvas");
			"undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(c);
			var d = c.getContext("2d");
			if (c.width = c.height = b.size, a.appendChild(c), window.devicePixelRatio > 1) {
				var e = window.devicePixelRatio;
				c.style.width = c.style.height = [b.size, "px"].join(""), c.width = c.height = b.size * e, d.scale(e, e)
			}
			d.translate(b.size / 2, b.size / 2), d.rotate((-0.5 + b.rotate / 180) * Math.PI);
			var f = (b.size - b.lineWidth) / 2;
			b.scaleColor && b.scaleLength && (f -= b.scaleLength + 2);
			var g = function (a, b, c) {
				c = Math.min(Math.max(0, c || 1), 1), d.beginPath(), d.arc(0, 0, f, 0, 2 * Math.PI * c, !1), d.strokeStyle = a, d.lineWidth = b, d.stroke()
			}, h = function () {
				var a, c, e = 24;
				d.lineWidth = 1, d.fillStyle = b.scaleColor, d.save();
				for (var e = 24; e >= 0; --e) 0 === e % 6 ? (c = b.scaleLength, a = 0) : (c = .6 * b.scaleLength, a = b.scaleLength - c), d.fillRect(-b.size / 2 + a, 0, c, 1), d.rotate(Math.PI / 12);
				d.restore()
			};
			Date.now = Date.now || function () {
				return +new Date
			};
			var i = function () {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) {
					window.setTimeout(a, 1e3 / 60)
				}
			}();
			this.clear = function () {
				d.clearRect(b.size / -2, b.size / -2, b.size, b.size)
			}, this.draw = function (a) {
				this.clear(), b.scaleColor && h(), b.trackColor && g(b.trackColor, b.lineWidth), d.lineCap = b.lineCap;
				var c;
				c = "function" == typeof b.barColor ? b.barColor(a) : b.barColor, a > 0 && g(c, b.lineWidth, a / 100)
			}.bind(this), this.animate = function (a, c) {
				var d = Date.now();
				b.onStart(a, c);
				var e = function () {
					var f = Math.min(Date.now() - d, b.animate), g = b.easing(this, f, a, c - a, b.animate);
					this.draw(g), b.onStep(a, c, g), f >= b.animate ? b.onStop(a, c) : i(e)
				}.bind(this);
				i(e)
			}.bind(this)
		}, b = function (b, c) {
			var d, e = {
				barColor: "#ef1e25",
				trackColor: "#f9f9f9",
				scaleColor: "#dfe0e0",
				scaleLength: 5,
				lineCap: "round",
				lineWidth: 3,
				size: 110,
				rotate: 0,
				animate: 1e3,
				renderer: a,
				easing: function (a, b, c, d, e) {
					return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
				},
				onStart: function () {
				},
				onStep: function () {
				},
				onStop: function () {
				}
			}, f = {}, g = 0, h = function () {
				this.el = b, this.options = f;
				for (var a in e) e.hasOwnProperty(a) && (f[a] = c && "undefined" != typeof c[a] ? c[a] : e[a], "function" == typeof f[a] && (f[a] = f[a].bind(this)));
				f.easing = "string" == typeof f.easing && "undefined" != typeof jQuery && jQuery.isFunction(jQuery.easing[f.easing]) ? jQuery.easing[f.easing] : e.easing, d = new f.renderer(b, f), d.draw(g), b.dataset && b.dataset.percent && this.update(parseInt(b.dataset.percent, 10))
			}.bind(this);
			this.update = function (a) {
				return a = parseInt(a, 10), f.animate ? d.animate(g, a) : d.draw(a), g = a, this
			}.bind(this), h()
		};
		window.EasyPieChart = b
	}();

	var options = {
		scaleColor: false,
		trackColor: '#ccc',
		barColor: 'rgb(147, 185, 66)',
		lineWidth: 3,
		lineCap: 'butt',
		size: 72
	};

	window.addEventListener('DOMContentLoaded', function () {
		var charts = [];
		[].forEach.call(document.querySelectorAll('.chart'), function (el) {
			charts.push(new EasyPieChart(el, options));
		});
	});
	new Tablesort(document.getElementById('table-sort'));
	$(".table-sort").mCustomScrollbar();
	$('.table-filter__slider').slider({
		orientation: "horizontal",
		range: "min",
		min: 1,
		max: 14,
		value: 7
	});
	$(document).tooltip({
		items: "[data-tooltip]",
		position: { my: "left+30 center", at: "right center" },
		content: function () {
			return '' +
				'<div class="tooltip-box">'+
					'<img class="map" alt="" src="images/plan.jpg">' +
					'<div class="button button_size_m button_theme_green">' +
						'<span class="button__text">Купить</span>' +
					'</div>'+
				'</div>';
		}
	});

});
