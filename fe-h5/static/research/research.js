(function () {

    var ResearchPro = {
        init: function () {
            this.cutTab();
        },

        cutTab: function () {
             var me = this;

            $('.school').on('click', function () {
                $('.angel-container').show();
                $('.crowd-container').hide();
                $('.line').animate({left: '10px'});

                me.initMainSlider();
                me.initTopicSlider();
            });

            $('.focus').on('click', function () {
                $('.angel-container').hide();
                $('.crowd-container').show();
                $('.line').animate({left: '118px'});
            });
        },

        initMainSlider: function () {
            $.ajax({
                type:'post',
                url: host + "cFigure/getCarouselFigures.htm?type=3&clientType=wap",
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('../widget/research/slider/slider-item.tmpl');

                    if (data) {
						var html = tpl(data);
						$('.school-wrapper').html(html);
					}
                }
            }).done(function () {
                var mySwiper = new Swiper ('.school-swiper-container', {
                    direction: 'horizontal',
                    loop: true,
                    autoplay : 3000,
                    autoplayDisableOnInteraction : false
                }); 
            }); 
        },

        initTopicSlider: function () {
            $.ajax({
                type:'post',
                url: host + 'focus/getHotArticleList.htm?clientType=wap&type=0',
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('../widget/research/hottopic/topic-item.tmpl');
                    
                    if (data) {
						var html = tpl(data);
                        $('#topic-swiper-wrapper').html(html);
					}
                }
            }).done(function () {
                var topicSwiper = new Swiper ('#topic-container', {
                    direction: 'vertical',
                    loop: true,
                    autoplay : 3000,
                    autoplayDisableOnInteraction : false
                });
            });
        }
    };

    ResearchPro.init();

})();