(function () {

	var Cards = {
		init: function () {
			this.myCards();
		},

		myCards: function () {
			$('.cmn-header-title').text('');
			$('.cmn-header-title').append('<span style="display:inline-block; margin-left:85px;">银行卡</span>');
			$('.cmn-header-title').append('<span style="font-size:14px;color:#E1C078;font-family: PingFangSC-Regular;float:right;margin-right:15px;">更换银行卡</span>');
		}
	};

	Cards.init();
	checkUserLogin();
	//校验用户是否已经实名认证
    $.ajax({
        type: 'POST',
        url: host + 'user/auth/realNameResult.htm',
        data:token_client_data,
        dataType: 'JSON',
        success: function (data) {
        	//如果已经实名认证，调到结果页
        	if(data.code == '0000'){
        		$('span[name="bankName"]').val(data.data.bankName);
        		$('span[name="idCardNo"]').val(data.data.idcardno);
        		var length = 0;
        		length = data.data.realName.length;
        		$('#bankName').text(data.data.bankName);
        		/*length = data.data.idcardno.length;*/
        		$('#idCardNo').text(data.data.idcardno.substring(0,3)+'*******'+data.data.idcardno.substring(length-3));
        		/*length = data.data.mobile.length;
        		$('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-3));*/
        	}else{
        		window.location.href = '/page/realname/auth.html';
        	}
		}
    });
})();