(function () {

	var Helpcenter = {
		init: function () {
			this.findDefaultPart();
			this.changeCenter();
			this.changeSubCenter();
			this.showMenuLine();
			this.fixedMenu();
		},
		findDefaultPart: function () {
			var defaultItem = 'help-default';
			var hash = document.URL.substr(document.URL.indexOf('#')+1);
			var listItems = $('.help-center .center-item');
			var defaultList = [];
			listItems.each(function (index, element) {
				defaultList.push($(element).data('item'));
			})
			if (hash && ~defaultList.indexOf(hash)) {
				defaultItem = hash;
			}

			var self = this;
			listItems.each(function (index, element) {
				var itemName = $(element).data('item');
				if (itemName === defaultItem) {
					self.itemSwitcher(element);
				}
			});
			this.changeLocationHash(defaultItem);
		},
		// left menu list
		changeCenter: function () {
			var self = this;
			$('.center-menu').find('.center-item').on('click', function (e) {
				var targetElement = e.target;
				self.itemSwitcher(targetElement);
			});
		},
		itemSwitcher: function(element) {
			// scroll to top
			$(window).scrollTop(0)
			// add style
			$(element).addClass('menu-border').siblings('.center-item').removeClass('menu-border');

			// content
			var activeItemName = $(element).attr('data-item');
			$('.center-content').find('.' + activeItemName).addClass('active').siblings().removeClass('active');
			this.changeLocationHash(activeItemName);

		},
		changeLocationHash: function(str) {
			location.replace('#' + str.replace(/^#/, ''))
		},
		// 帮助中心二级tab切换
		changeSubCenter: function () {
			$('.sub-nav').find('.sub-nav-item').on('click', function () {
				$(this).addClass('active-sub-nav').siblings('.sub-nav-item').removeClass('active-sub-nav');
				$('.sub-nav-content').find('.' + $(this).attr('data-item')).addClass('active').siblings().removeClass('active');
			})
		},

		showMenuLine: function () {
			$('.help-ant-line').show();
		},
		fixedMenu: function () {
			var toTopHeight = $('.center-menu').offset().top;
			$(window).on('scroll', function () {
				if ($(this).scrollTop() + 60 > toTopHeight) {
					$('.center-menu').addClass('fixed-menu');
				} else {
					$('.center-menu').removeClass('fixed-menu');
				}
			});
		}
	};

	Helpcenter.init();

})();