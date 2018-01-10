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
		        autoplayTimeout: 5000
		    });
		},
		fetchBannerData: function () {
			var fetchBanner = $.ajax({
		        url: host + 'cFigure/getCarouselFigures.htm?type=1&clientType=2',
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
				return '<a href="' + item.hyperlink + '" class="banner-item" target="_blank"><img src="'
				+ item.imgPath + '" class="banner-img" height="250"/></a>'
			});
			var owlEl = $('#banner-carousel');
			this.$owlEl.append(owlItems);
		},
		changeNavDots: function (data) {
		}
	}

	slideBanner.init();

})();
