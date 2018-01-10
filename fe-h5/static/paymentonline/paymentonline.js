(function () {


	

	var Loginerror = {
		init: function () {
			this.setLoginerrorHeader();
		},

		setLoginerrorHeader: function () {
			$('.cmn-header-title').text('线上支付页');
		}
	};

	Loginerror.init();

	checkUserLogin();

    checkUserStatus();
    
    var request = getRequest();
    var orderId = request.orderId;
    checkOrderIdUser(orderId);

})();