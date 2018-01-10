(function () {
	checkUserLogin();
    checkUserStatus();

	var proId = getRequest().proId;
	var orderId = getRequest().orderId;

	var OtherPay = {
		init: function () {
			this.setOfflineTitle();
			this.getAccountInfo();
		},

		setOfflineTitle: function () {
			$('.cmn-header-title').text('其他支付方式');
		},

		getAccountInfo: function () {

			if (proId) {
				$.ajax({
					url: host + 'order/getOfflineInfo.htm?proId=' + proId + '&orderId=' + orderId,
					type: 'post',
					dataType: 'json',
					data: token_client_data,
					success: function (data) {
						if (data.code == '0000') {
						$('#fund-company').val(data.data.companyName);
						$('#fund-bank').val(data.data.accountBank);
						$('#fund-account').val(data.data.accountNum);
						} else if (data.code == '4000') {
							location.href = loginUrl;
						}
						if (data.code == '9999') {
							new SmartToast({
								content: data.desc,
								type: 'warn',
								duration: 3
							});
						}
					}
				});
			}
		}
	};

	OtherPay.init();
})();
