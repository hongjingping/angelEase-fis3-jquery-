(function () {

    checkUserLogin();
    checkUserStatus();

    var req = getRequest();
    var proId = req.proId;
    var proinveseId = req.proinveseId;
    var bankId = req.bankId;
    var proInvId = req.proInvId;
    var proInvAmount = req.proInvAmount;

	var OrderConfirm = {
		init: function () {
			this.setHeader();
			this.checkBoxInit();
            this.setBankId();
		},
		setHeader: function () {
			$('.cmn-header-title').text('下单页');
		},
		checkBoxInit: function() {
            $("#i-check-btn").click(function() {
                if ($(this).hasClass("i-check-unchecked")) {
                    $(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");
                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                }
            });
        },

        setBankId: function () {
            $('.card-holder').attr('bank-id', bankId);
            // storage bank id for other page
            storage.set('bank-id', bankId);
        }
	};

	OrderConfirm.init();

    $.ajax({
        type: 'POST',
        url: host + '/order/toConfirmOrder.htm?proId='+ proId + '&bindBankCardId=' + bankId ,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                $("#proName2").html(result.data.proName);
                $("#proInveseAmount").html(formatMoney(result.data.proInveseAmount) + '元');
                //$("#proInveseAmount").html(formatMoney(proInvAmount) + '元');
                $("#proInveseAmountSpan").html(formatMoney(result.data.proInveseAmount)) + '元';
                //$("#proInveseAmountSpan").html(formatMoney(proInvAmount)) + '元';

                $('#card-owner').text(result.data.cardholder);
                $('#card-serial').append(result.data.payBindBankCard.bankName + "<span class='tail-num'>(尾号" +result.data.payBindBankCard.bankCardNo.slice(-4) + ")</span>");
                $('#reserve-phone').text(result.data.payBindBankCard.mobile);
            } else if (result.code == '0014') {
                new SmartToast({
                    content: '请先填写订单信息',
                    type: 'warn',
                    duration: 3
                });
                window.location.href = indexUrl;
            }  else if (result.code == '4000') {
                window.location.href = loginUrl;
            }
        }
    });

    // 去签名页
    $("#toSign").click(function() {
        var saveBankId = $('.card-holder').attr('bank-id');

        $.ajax({
            type: 'POST',
            url: host + '/order/doSaveOrder.htm?proId=' + proId + '&payBindBankCardId=' + saveBankId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    var orderId = result.data.id;
                    var isValid = result.data.isValid;
                    if (isValid) {
                        window.location.href = baseUrl + "invest_sign/agree.html?orderId=" + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId + '&bindBankCardId=' + bankId;
                    } else {
                        window.location.href = baseUrl + "invest_sign_idupload/upload-step-one.html?orderId=" + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId + '&bindBankCardId=' + bankId;
                    }
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                } else {
                    new SmartToast({
                        content: result.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            }
        });
    })
})();