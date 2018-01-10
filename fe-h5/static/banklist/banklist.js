(function () {
	var BankItems = {
		init: function () {
			this.configHeaderTitle();
			this.toAddBankCardPage();
		},

		configHeaderTitle: function () {
			$('.cmn-header-title').text('选择支付银行卡');
		},

		toAddBankCardPage: function () {
			$('.bank-join').on('click', function () {
				var req = getRequest();
				var proId = req.proId;
				var orderId = req.orderId;
				var proinveseId = req.proinveseId;
				var fromPayPage = req.fromPayPage;

				window.location.href = '/page/add-bank-card/add-bank-card.html?proId=' + proId + '&orderId=' + orderId + '&fromPayPage=' + fromPayPage + '&proinveseId=' + proinveseId;
			});
		}
	};

	BankItems.init();

})();