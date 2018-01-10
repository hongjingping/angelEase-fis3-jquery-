(function () {

    checkUserLogin();

    checkUserStatus();

    var request = getRequest();
    var proId = request.proId;
    var proinveseId = request.proinveseId;
    var bankId = request.bankId;

    $.ajax({
        type: 'POST',
        url: host + '/order/toConfirmOrder.htm?proId=' + proId + '&bindBankCardId=' + bankId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                $('#proName').html(result.data.proName);
                $('#proInveseAmount').html(formatMoney(result.data.proInveseAmount) + '元');
                $('#userAddress').html(result.data.userAddress);
                var mobile = result.data.mobile;
                $('#mobile').html(mobile.substring(0,3) + '****' + mobile.substring(7));
                $('#zipCode').html(result.data.zipCode);
                $('#proInveseAmountSpan').html(formatMoney(result.data.proInveseAmount));
                var userName = result.data.userName;
                $('#userName').html('**' + userName.substring(userName.length-1,userName.length));
            } else if (result.code == '0014') {
            	var readSmartAlert = new SmartAlert({
            	    title: '提示',
            	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先填写订单信息。</span>',
            	    type: 'confirm',
            	    okText: '我知道了',
            	    maskClosable: false,
            	});
            	readSmartAlert.open();
                window.location.href = indexUrl;
            } else if (result.code == '4000') {
                //window.location.href = loginUrl;
                /*
                 * jingpinghong@creditease.cn
                 * 2017-02-16
                 * */
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

    // 去签名页
    $('#toSign').click(function() {
        $.ajax({
            type: 'POST',
            url: host + '/order/doSaveOrder.htm?proId=' + proId + '&payBindBankCardId=' + bankId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    storage.remove('addressIndex');
                    storage.remove('bankIndex');
                    var orderId = result.data.id;
                    var isValid = result.data.isValid;
                    window.location.href = baseUrl + 'sign/sign.html?orderId=' + orderId + '&proId=' + proId;
                } else if (result.code == '4000') {
                    //window.location.href = loginUrl;
                    /*
                     * jingpinghong@creditease.cn
                     * 2017-02-16
                     * */
                    handleLoginTimeout();
                } else {
                	var readSmartAlert = new SmartAlert({
                	    title: '错误',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+result.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },
            error: function(e) {
            }
        });
    })

    // 返回修改
    $('#backEdit').click(function() {
        window.location.href = baseUrl + 'project/project.html?orderId=' + orderId + '&proId=' + proId;
    })

})();