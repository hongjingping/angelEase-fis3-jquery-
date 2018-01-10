(function () {

	var MyInvest = {
		init: function () {
			this.myInvestHeader();
		},

		myInvestHeader: function () {
			$('.cmn-header-title').text('我的投资');
		},
	};

	MyInvest.init();

	checkUserLogin();
})();

// 校验是否有签名完成
function getEncodeSign(orderId, proId){
    $.ajax({
        type: 'POST',
        url: host + 'sig/getEncodeSign.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
							//港澳台跳线下支付
							$.ajax({
									url: host + 'order/getUserCheck.htm',
									type: 'post',
									dataType: 'json',
									data:token_client_data,
									success:function (result) {
											// 身份证实名用户
											if (result.code == '0000' && result.data.idcardtype != '1') {
													// 初期化判断上传的身份证是否有效
													window.location.href = baseUrl + 'offlinepayment/offlinepayment.html?orderId=' + orderId + '&proId=' + proId;
											}else{
						                            window.location.href = baseUrl + 'payment/paymentmethod.html?orderId=' + orderId + '&proId=' + proId + '&sign=' + data.data;
											}
									}
							});
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });
}

// 获取订单状态名称
function getOrderStatusByName(showCode) {
    // 待支付
    if (showCode == '001'){
        return '待支付';
    }
    // 待确认投资结果（已支付，待审核）
    else if (showCode == '004'){
        return '待确认投资结果';
    }
    // 待确认投资结果（已支付，审核通过）
    else if (showCode == '005'){
        return '待确认投资结果';
    }
    // 待签约
    else if (showCode == '006'){
        return '待签约'
    }
    // 待重签
    else if (showCode == '007'){
        return '待重签';
    }
    // 待上传打款凭证（已支付，待上传打款凭证）
    else if (showCode == '008'){
        return '待上传打款凭证';
    }
    // 投资成功
    else if (showCode == '009'){
        return '投资成功';
    }
    // 投资失败，待退款（全额）
    else if (showCode == '010'){
        return '投资失败';
    }
    // 投资失败，已退款（全额）
    else if (showCode == '012'){
        return '投资失败';
    }
    // 已取消，超时未支付已取消
    else if (showCode == '013'){
        return '已取消';
    }
    // 支付中
    else if (showCode == '015'){
        return '支付中';
    }
}
