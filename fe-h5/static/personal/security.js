(function () {

	var Security = {
		init: function () {
			this.setSecurityHeader();
		},

		setSecurityHeader: function () {
			$('.cmn-header-title').text('安全中心');
		}
	};

	Security.init();

})();