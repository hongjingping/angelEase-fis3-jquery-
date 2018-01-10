/**
 * Created by jingpinghong on 2016/12/15.
 */

/*banner 轮播图 start*/
(function () {
    var slideBanner = {
        init: function () {
            this.cacheElements();
            this.fetchBannerData();
        },
        cacheElements: function () {
            this.$owlEl = $('#banner-carousel');
        },
        owlCarouselInit: function () {
            var owlEl = $('#banner-carousel');
            owlEl.owlCarousel({
                loop:true,
                items:1,
                center:true,
                dots: true,
                animateOut: 'fadeOut',
                autoplay: true,
                autoplayTimeout: 2000
            });
        },

        fetchBannerData: function () {
            var fetchBanner = $.ajax({
                url: host + 'cFigure/getCarouselFigures.htm?type=3&clientType=pc',
                type: 'POST',
                dataType: 'JSON',
            });
            fetchBanner.done((function (data) {
                if (data.code == '0000') {
                    this.fillBannerItems(data);
                    this.owlCarouselInit();
                    this.changeNavDots(data);
                }
            }).bind(this));
        },
        fillBannerItems: function (data) {
            var bannerData = data.data;
            var owlItems = bannerData.map(function (item) {
                return '<a href="' + item.hyperlink + '" class="item" target="_blank"><img src="'
                    + item.imgPath + '" class="banner-img" height="250px"/><p class="label"><span class="label-txt">'+item.title+'</span></p><p class="title">'+item.label+'</p></a>'
            });
            str = $(".label").text().substr(0,48) + " ...";
            $(".label").text(str);
            var owlEl = $('#banner-carousel');
            this.$owlEl.append(owlItems);
        },
        changeNavDots: function (data) {
        },
    };
    slideBanner.init();
})();
/*轮播图 end*/


/*广告位 轮播图 start*/
(function () {
    var slideBanner = {
        init: function () {
            this.cacheElements();
            this.fetchBannerData();
        },
        cacheElements: function () {
            this.$owlEl = $('#banner-carousel-right');
        },
        owlCarouselInit: function () {
            var owlEl = $('#banner-carousel-right');
            owlEl.owlCarousel({
                loop:true,
                items:1,
                center:true,
                dots: true,
                animateOut: 'fadeOut',
                autoplay: true,
                autoplayTimeout: 2000
            });
        },

        fetchBannerData: function () {
            var fetchBanner = $.ajax({
                url: host + 'cFigure/getCarouselFigures.htm?type=2&clientType=pc',
                type: 'POST',
                dataType: 'JSON',
            });
            fetchBanner.done((function (data) {
                if (data.code == '0000') {
                    this.fillBannerItems(data);
                    this.owlCarouselInit();
                    this.changeNavDots(data);
                }
            }).bind(this));
        },
        fillBannerItems: function (data) {
            var bannerData = data.data;
            var owlItems = bannerData.map(function (item) {
                return '<a href="' + item.hyperlink + '" class="ad-item" target="_blank"><img src="'
                    + item.imgPath + '" class="ad-banner-img" height="250px"/><p class="ad-label"><span class="ad-label-txt">'+item.title+'</span></p><p class="ad-title">'+item.label+'</p></a>'
            });
            var owlEl = $('#banner-carousel-right');
            this.$owlEl.append(owlItems);
        },
        changeNavDots: function (data) {
        },
    };
    slideBanner.init();
})();
/*广告位轮播图 end*/


