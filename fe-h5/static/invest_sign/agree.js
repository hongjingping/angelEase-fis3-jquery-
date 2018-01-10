(function () {

    var req = getRequest();
    var orderId = req.orderId;
    var proId = req.proId;
    var proinveseId = req.proinveseId;
    var bankId = req.bindBankCardId;
    checkUserLogin();
    checkUserStatus();
    checkOrderIdUser(orderId);

	var Sign = {
		init: function () {
			this.signHeader();
			this.checkBoxInit();
		},
		signHeader: function () {
            $.ajax({
                type: 'POST',
                url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(data) {
                    if (data.code == "0000") {
                        if(data.data == '6'){
                            tempStatus = data.data;
                            $('.cmn-header-title').text('重签');
                        } else {
                            $('.cmn-header-title').text('签约页');
                        }
                    }
                },
                error: function(e) {
                }
            });
		},
		checkBoxInit: function() {
			$('#i-check-btn').click(function() {
                if ($(this).hasClass('i-check-unchecked')) {
                	$(this).removeClass('i-check-unchecked');
                    $(this).addClass('i-check-checked');

                } else {
                    $(this).addClass('i-check-unchecked');
                    $(this).removeClass('i-check-checked');
                }
			});
		}
	};

	Sign.init();
    rejectInfo(orderId);
    $('.read-contract-col').click(function() {
		window.location.href = baseUrl + 'protocol/protocol.html?orderId=' + orderId + '&proId=' + proId;
	})

    // 下一页
    $('.next-btn').click(function() {
        // proId = $("#proId").val();
        if($('#i-check-btn').hasClass('i-check-unchecked')){
            new SmartToast({
                content: '请先同意以上协议',
                type: 'warn',
                duration: 3
            });
            return;
        }
        $.ajax({
            type: 'POST',
            url: host + 'order/getReadFlag.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    if (result.data) {
                        window.location.href = baseUrl + 'invest_sign/sign.html?orderId=' + orderId  + '&proId=' + proId + '&proinveseId=' + proinveseId;;
                    } else {
                        window.location.href = baseUrl + 'protocol/protocol.html?orderId=' + orderId  + '&proId=' + proId;
                    }
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                } else {
                    new SmartToast({
                        content: '请先阅读完协议内容,再操作',
                        type: 'warn',
                        duration: 3
                    });
		            return;
                }
            },
            error: function(e) {
            }
        });
    })
})();