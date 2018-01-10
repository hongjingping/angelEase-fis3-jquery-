/* 原定的二维码跟随JS部分，
* 2016-08-30 改为fixed方案实现
* 故注释此部分
*/
// (function () {
// 	var Roadshow = {
// 		init: function () {
// 			this.showQrcode();
// 			this.qrcodeHeight = $('.show-header').outerHeight() + $('.show-nav').outerHeight();
// 		},

// 		showQrcode: function () {
// 			var me = this;
// 			$('.show-qrcode').css('top', $('.show-nav').outerHeight() + 'px');

// 			$(window).on('resize scroll', function () {
// 				if (!($(window).scrollTop() > $(window).outerHeight())) {
// 					$('.show-qrcode').css('top', me.qrcodeHeight + $(window).scrollTop() + 'px');
// 				}
// 			});
// 		}
// 	};

// 	Roadshow.init();
// })();