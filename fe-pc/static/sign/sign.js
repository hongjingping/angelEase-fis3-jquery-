(function () {

    var request = getRequest();
    var orderId = request.orderId;

    // 校验订单状态  如果已经签名 跳转到我的订单
    $.ajax({
        type: 'POST',
        url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                // 待支付
                if(data.data == '1'){
                	var readSmartAlert = new SmartAlert({
                	    title: '提示',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您已经做过签名，无需再次阅读协议。</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                    // window.location.href = indexUrl;

                // 待确认投资结果（已支付待审核）
                }else if(data.data == '3'){
                    window.location.href = indexUrl;
                }
            } else if (data.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

})();