$(function () {

    var Slider = {
        init: function () {
            this.initSlider();
        },

        initSlider: function () {
            $.ajax({
                type:'post',
                url: host + "cFigure/getCarouselFigures.htm?type=1&clientType=wap",
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('items.tmpl');

                    if (data) {
						var html = tpl(data);
						$('.swiper-wrapper').html(html);
					}
                }
            }).done(function (data) {
                var mySwiper = new Swiper ('.swiper-container', {
                    direction: 'horizontal',
                    loop: true,
                    autoplay : 3000,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction : false
                }); 

                if (data.data.length == 1) {
                    mySwiper.lockSwipes();
                }
            }); 
        }
    };

    Slider.init();
    
});