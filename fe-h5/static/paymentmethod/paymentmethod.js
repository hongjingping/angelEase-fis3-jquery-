(function () {
	checkUserLogin();
    checkUserStatus();

    var request = getRequest();
    var orderId = request.orderId;
    var proId = request.proId;
    var proinveseId = request.proinveseId;

    checkOrderIdUser(orderId);

	var Payment = {
		init: function () {
			this.setLoginerrorHeader();
            this.noticeLoseValCode();
            this.getOrderInfo();

            this.sendSMSCode();
            this.invokeSendSMScode();
            this.toOfflinePayPage();
		},

		setLoginerrorHeader: function () {
			$('.cmn-header-title').text('下单页');
		},

        noticeLoseValCode: function () {
            $('.lose-code').on('click', function () {
                $('.notice-mask').show();
                $('.phone-notice').show();
            });

            $('.notice-close, .notice-know').on('click', function () {
                $('.phone-notice').hide();
                $('.notice-mask').hide();
            });
        },

        getOrderInfo: function () {
            var me = this;
            var orderId = getRequest().orderId;

            if (orderId) {
                $.ajax({
                    type: 'POST',
                    url: host + 'fastPay/addPayOrder.htm?orderId='+ orderId,
                    data: token_client_data,
                    dataType: 'JSON',
                    success: function (result) {

                        // pay detail
                        var projectDetail = result.data;

                        if (projectDetail) {
                            $('.invest-project').text(projectDetail.projectName);
                            $('.invest-fund').text(formatMoney(projectDetail.price) + '元');
                        }

                        // bind card detail
                        var bankDetail = result.data.payBindBankCard;

                        if (bankDetail) {
                            $('#bank-detail').attr('current-bank-id', bankDetail.id);
                            $('.onside-phone').text(bankDetail.mobile.slice(0, 3) + '****' + bankDetail.mobile.slice(-4));
                            $('.bank-logo').attr('src', staticUrl + bankDetail.logo);
                            $('.bank-title').text(bankDetail.bankName + '(尾号' + bankDetail.bankCardNo.slice(-4) + ')');
                            $('.quota').text('单笔限额' + bankDetail.singleQuota);
                        }
                    }
                }).done(function () {
                    me.toBankCardList();
                    me.confirmChangeBankCard();
                    me.isChangeBankCard();
                });
            } else {
                alert('订单信息获取失败');
            }
        },

        showChangeBankNotice: function () {
            $('.notice-mask').show();
            $('.change-bankcard').show();
            $('.notice-close').hide();
        },

        closeChangeBankNotice: function () {
            $('.notice-mask').hide();
            $('.change-bankcard').hide();
            $('.notice-close').hide();
        },

        isChangeBankCard: function () {
            var me = this;
            var fromBankListFlag = getRequest().fromBankListPage;
            var bankId = getRequest().bankId;
            var currentBankId = $('#bank-detail').attr('current-bank-id');

            if (fromBankListFlag) {
                // contrast transfer bank card id with current bank id
                if (!(bankId == currentBankId)) {
                    me.showChangeBankNotice();

                    // update bank card id
                    $('#bank-detail').attr('current-bank-id', bankId);
                }
            }
        },

        confirmChangeBankCard: function () {
            var me = this;

            $('.bank-change').on('click', function () {
                me.closeChangeBankNotice();
            });

            $('.bank-confirm').on('click', function () {
                // update bind card info
                var updateBankId = $('#bank-detail').attr('current-bank-id');

                if (updateBankId) {
                    $.ajax({
                        type: 'POST',
                        data: token_client_data,
                        url: host + 'order/changePayBankCard.htm?orderId=' + orderId + '&payBindBankCardId=' + updateBankId,
                        dataType: 'JSON',
                        success: function (result) {
                            if (result.code === '0000') {
                                window.location.href = baseUrl + 'invest_sign/agree.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                            }
                        }
                    });
                }

                me.closeChangeBankNotice();
            });
        },

        toBankCardList: function () {
            $('#bank-detail').on('click', function () {
                window.location.href = baseUrl + 'banklist/bank-list.html?fromPayPage=1&orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
            });
        },

        sendSMSCode: function () {
            var me = this;

            $('#sms-code').on('click', function () {
                me.countDown(60);

                $.ajax({
                    type: 'POST',
                    data: token_client_data,
                    url: host + 'fastPay/paySendMsg.htm?orderId=' + orderId,
                    dataType: 'JSON',
                    success: function (result) {
                        if (result.code === '9999') {
                            new SmartToast({
                                content: result.desc,
                                type: 'warn',
                                duration: 3
                            });
                        }
                    }
                });
            });
        },

        countDown: function (secondVal) {
            var me = this;
            if (secondVal <= 0) {
                $('#sms-code').html('重新发送').css('color', '#E1B555');
                me.sendSMSCode();
            } else {
                $('#sms-code').unbind('click');
                $('#sms-code').html(secondVal + ' 秒').css('color', '#3F3F3F');

                secondVal--;
                setTimeout(function () {
                    Payment.countDown(secondVal);
                }, 1000);
            }
        },

        invokeSendSMScode: function () {
            var me = this;
            var smsCode = $('#sms-val').val().trim();
            var canPay = false;

            $('#sms-val').on('input propertychange', function () {
                if ($('#sms-val').val().length == 6) {
                    if ((/^[0-9]{6}$/.test($('#sms-val').val().trim()))) {
                        $('.pay-confirm').css('background', '#E1C078').attr('data-pay', 'true');
                    } else {
                        $('.pay-confirm').css('background', '#DFDFDF').attr('data-pay', 'false');
                        new SmartToast({
                            content: "您输入的验证码不正确，请确认后再次输入",
                            type: 'warn',
                            duration: 3
                        });
                    }
                }
            });

            $('.pay-confirm').on('click', function () {
                if ($('.pay-confirm').attr('data-pay')) {

                    $.ajax({
                        url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
                        type: 'post',
                        dataType: 'json',
                        data:token_client_data,
                        success:function (data) {
                            if (data.code == '0000') {
                                if (data.data == '0') {// 待签约
                                    var readSmartAlert = new SmartAlert({
                                        title: '警告',
                                        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">订单超过三十分钟，请到我的投资列表页重新签约</span>',
                                        type: 'confirm',
                                        okText: '我知道了',
                                        maskClosable: false,
                                    });
                                    readSmartAlert.open();
                                    window.location.href = indexUrl;
                                } else if(data.data == '15'){// 支付中
                                    var readSmartAlert = new SmartAlert({
                                        title: '提示',
                                        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您这笔订单已经在支付中，无需再次支付。</span>',
                                        type: 'confirm',
                                        okText: '我知道了',
                                        maskClosable: false,
                                    });
                                    readSmartAlert.open();
                                    window.location.href = indexUrl;
                                } else if(data.data == '2' || data.data == '3'){
                                    var readSmartAlert = new SmartAlert({
                                        title: '警告',
                                        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您这笔订单已经支付，无需再次支付。</span>',
                                        type: 'confirm',
                                        okText: '我知道了',
                                        maskClosable: false,
                                    });
                                    readSmartAlert.open();
                                    window.location.href = indexUrl;
                                } else{
                                    $.ajax({
                                        type: 'POST',
                                        cache: false,
                                        data: token_client_data,
                                        url: host + 'fastPay/doPay.htm?orderId=' + orderId + '&smsCode=' + $('#sms-val').val().trim(),
                                        dataType: 'JSON',
                                        success: function (result) {
                                            if (result.code === '0000') {
                                                window.location.href = baseUrl + 'payment/pay-success.html';
                                            } else if (result.code === '4000') {
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
                                }
                            } else if (data.code == '4000') {
                                location.href = loginUrl;
                            }
                            if (data.code == '9999') {
                                showError(data.desc);
                            }
                        },error:function (e) {
                        }
                    });
                }
            });
        },

        toOfflinePayPage: function () {
            $('.other-pay').on('click', function () {
                if (orderId) {
                    window.location.href = baseUrl + 'offlinepayment/offlinepayment.html?orderId=' + orderId;
                }
            });
        }
	};

    Payment.init();


    /* deprecated */
	//线上支付
	$('.image1').click(function(){
		var url = baseUrl + 'paymentonline/paymentonline.html?orderId=' + orderId;
        editOnline(1,url);
	})

	//线下支付
	$('.image2').click(function(){
		var url = baseUrl + 'offlinepayment/offlinepayment.html?orderId=' + orderId;
        editOnline(0,url);
	})

	//更改线上线下状态
    function editOnline(isOnline,onUrl) {
        $.ajax({
            type: 'POST',
            cache: false,
            data: token_client_data,
            url: host + 'order/editOnline.htm?id=' + orderId + '&isOnline=' + isOnline,
            dataType: 'JSON',
            success: function(data) {
                if (data.code == '0000') {
                    location.href = onUrl;
                } else if (data.code=='4000') {
                    location.href = loginUrl;
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
})();
