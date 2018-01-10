(function () {

	var IconPro = {
		init: function () {
			this.icons = $('.ae-mobile');

			this.showIconClass();
		},

		showIconClass: function () {
			this.icons.each(function(index, el) {
				$(el).on('click', function () {
					alert($(this).attr('class'));
				});
			});
		}
	};

	IconPro.init();
	
})();