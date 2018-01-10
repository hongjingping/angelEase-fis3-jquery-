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
		        url: host + 'cFigure/getCarouselFigures.htm?type=1&clientType=pc',
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
			var owlItems = $(bannerData).each(function (k,item) {
				var result = $('<a href="' + item.hyperlink + '" class="banner-item" target="_blank"></a>');
				$(result).css('background', 'url(' + item.imgPath + ') center no-repeat');
				$('#banner-carousel').append($(result));

			});
		},
		changeNavDots: function (data) {
			var owlEl = $('#banner-carousel');
			owlEl.find('.owl-dots').wrap('<div class="dots-wrapper"></div>')
			$('.dots-wrapper').addClass('cmn-clearfix')
			if (owlEl.find('.owl-dots .owl-dot.active').length) {
		        $('.owl-dot').each(function(i, element) {
		            // marked as `injected-dot`
		            if (!$(element).hasClass('injected-dot')) {
		            	var dotArray = data.data;
		                var text = dotArray[i].label;
		                $(element).addClass('injected-dot').html('<div class="triangel"></div>' + '<div class="dot-text">' + text + '</div>');
		            }
		        });
		    }
		},
	}

	slideBanner.init();
})();