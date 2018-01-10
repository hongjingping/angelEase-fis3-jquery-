(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('重签');
		}
	};

	UpdatePAssword.init();

	// 返回我的投资列表
	$(".nkey-operation-button-normal").on("click", function () {
		window.location.href = baseUrl + 'personal_my_invest/my-invest.html';
    });
})();