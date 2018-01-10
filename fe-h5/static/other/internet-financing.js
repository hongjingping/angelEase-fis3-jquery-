(function () {

	var InternetFinancing = {
		init: function () {
			this.internetFinancingHeader();
		},

		internetFinancingHeader: function () {
			$('.cmn-header-title').text('互联网非公开股权融资');
		}
	};

	InternetFinancing.init();

    // app用
    var request = getRequest();
    var appClient = request.clientType;
    if (appClient == 'app') {
        $('.cmn-header.white_bg').hide();
    }
})();