(function () {
    checkUserLogin();

    checkUserStatus();

    var request = getRequest();
    var orderId = request.orderId;
    var proId;
    checkOrderIdUser(orderId);

	var LineDownPayment = {
		init: function () {
			this.lineDownPaymentHeader();
            // this.checkOfflineStatus();
		},
		lineDownPaymentHeader: function () {
			$('.cmn-header-title').text('线下打款');
		},
        // checkOfflineStatus: function () {
        //     $.ajax({
        //         url: host + 'order/checkOfflineAccountKey.htm?orderId=' + orderId,
        //         type: 'post',
        //         dataType: 'json',
        //         data:token_client_data,
        //         success:function (data) {
        //             console.log(data);
        //         }
        //     });
        // }
	};

	LineDownPayment.init();

    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;
    $('#sendCode').on('click', sendCode);

    // 发短信
    function sendCode() {
        $('#sendCode').off('click', sendCode);
        var sendmsgUrl = host + 'pay/sendMsg.htm?payType=offline&orderId=' + orderId;
        $.ajax({
            url: sendmsgUrl,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    curCount = count;
                    InterValObj = window.setInterval(countdown, 1000);
                    new SmartToast({
                        content: '短信验证码已发送',
                        type: 'success',
                        duration: 3
                    });
                } else if(data.code == '4000') {
                    location.href = loginUrl;
                } else {
                    $('#sendCode').on('click', sendCode);
                    new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            },error:function (e) {
            }
        });
    }

    // 发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendCode').on('click', sendCode);
            $('#sendCode').html('重新发送');
        } else {
            curCount--;
            if (curCount < 10 && curCount != 0) {
                $('#sendCode').html('0' + curCount + 's');
            } else {
                $('#sendCode').html(curCount + 's');
            }
        }
    }

    // 初期化获取用户手机号
    $.ajax({
        url: host + 'user/getUserBase.htm',
        type: 'post',
        dataType: 'json',
        data:token_client_data,
        success:function (data) {
            if (data.code == '0000') {
                $('#phone').val(data.data.mobileNo.substring(0,3) + '****' + data.data.mobileNo.substring(7));
            } else if (data.code=='4000') {
                location.href = loginUrl;
            } else {
                $('#sendCode').off('click', sendCode);
                new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        },error:function (e) {
        }
    });

    // 初期化获取proId
    $.ajax({
        url: host + 'order/getOrderInfo.htm?orderId=' + orderId,
        type: 'post',
        dataType: 'json',
        data:token_client_data,
        success:function (data) {
            if (data.code == '0000') {
                proId = data.data.angelOrder.prejectId;
            } else if (data.code=='4000') {
                location.href = loginUrl;
            } else {
                new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        }
    }).done(function () {
        $.ajax({
            url: host + 'order/checkOfflineAccountKey.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    if (data.data) {
                        window.location.href = baseUrl + 'otherpay/other-pay.html?proId=' + proId +'&orderId=' + orderId;
                    }
                }else if (data.code == '4000') {
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
    });

    // 查看打款账户
    $('#account').click(function () {

        if ($('#dxInput').val() == '' || $('#dxInput').val() == undefined || $('#dxInput').val() == null) {
            new SmartToast({
                content: '请输入短信验证码',
                type: 'warn',
                duration: 3
            });
            return false;
        }

        $.ajax({
            url: host + 'pay/checkCode.htm?payType=offline&orderId=' + orderId + '&code=' + $('#dxInput').val(),
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
            if (data.code == '0000') {
                getOfflineInfo();
                // $('#accountHide').show();
                // $('#validDiv').hide();
                // $('#account').hide();
                // $('.change-mobile-next-button').hide();
                setKey();

                if (proId) {
                    window.location.href = baseUrl + 'otherpay/other-pay.html?proId=' + proId +'&orderId=' + orderId;
                }
            }else if (data.code == '4000') {
                location.href = loginUrl;
            }
            if (data.code == '9999') {
                $('#accountHide').hide();
                new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
            },error:function (e) {
                $('#accountHide').hide();
            }
        });
    })

    // 设置查看线下打款状态
    function setKey() {
        $.ajax({
            url: host + 'order/setOfflineAccountKey.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success: function (data) {
                if (data.code == '0000') {

                }else if (data.code == '4000') {
                    location.href = loginUrl;
                }
                if (data.code == '9999') {
                    new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            },error:function (e) {
            }
        });
    }

    // 查询线下打款信息
    function getOfflineInfo() {
        $.ajax({
            url: host + 'order/getOfflineInfo.htm?proId=' + proId + '&orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                   if (proId) {
                        window.location.href = baseUrl + 'otherpay/other-pay.html?proId=' + proId + '&orderId=' + orderId;
                    }
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
            },error:function (e) {
            }
        });
    }
})();
