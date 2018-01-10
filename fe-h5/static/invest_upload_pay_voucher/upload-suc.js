(function () {

	var Common = {
		init: function () {
			this.setHeader();
		},

		setHeader: function () {
			$('.cmn-header-title').text('上传打款凭证成功页');
		}
	};

	Common.init();

	checkUserLogin();

    checkUserStatus();

    var request = getRequest();
    var orderId = request.orderId;
    checkOrderIdUser(orderId); 

})();