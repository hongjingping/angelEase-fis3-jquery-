(function () {

    checkUserLogin();
    checkUserStatus();

    var request = getRequest();
    var orderId = request.orderId;
    var sign = request.sign;

    var bankId = '';
    var proId;
    var proinveseId;
    checkOrderIdUser(orderId);

	var PayProject = {
		init: function () {
			this.setPayHeader();
            this.switchPayTab();
            this.getQuickPayBankList();

            this.showSmsTips();
		},

		setPayHeader: function () {
			$('#cmn-header').text('投资项目');
            storage.set('payType','fastPay');
		},

        switchPayTab: function () {
            $('.pay-tab-title span').on('click', function () {
                var remark = '';
                var tabIndex = $(this).index();
                $(this).addClass('select').siblings('span').removeClass('select');
                $('.pay-content .content-item').eq(tabIndex).show().siblings().hide();
                $('#payType').val($(this).attr("data-id"));
                storage.set('payType',$(this).attr("data-id"));
                if ($('#payType').val() == 'fastPay') {
                    document.location.reload();
                }
                // $.ajax({
                //     url: host + 'fastPay/updatePayOrder.htm?remark=' + $(this).attr("data-id") + '&orderId=' + orderId,
                //     type: 'POST',
                //     data: token_client_data,
                //     dataType: 'JSON',
                //     success: function (result) {

                //     }
                // });
            });
        },

        getQuickPayBankList: function () {
            var me = this;
            $.ajax({
                url: host + 'bindbankcard/getBindBankCardList.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
                success: function (result) {
                    var bankItems = result.data.payBindBankCardList;

                    if (bankItems && bankItems.length > 0) {
                        var htmls = '';
                        for (var i = 0; i < bankItems.length; i++) {
                            var lastBankNo = bankItems[i].bankCardNo.slice(-4);

                            var defaultChecked = false;
                            if (bankId == bankItems[i].id) {
                                defaultChecked = true;
                            }

                            htmls += defaultChecked ? '<tr class="active">' : '<tr>';
                            if (defaultChecked) {
                                htmls += '<td><input type="radio" class="addr-radio" name="bank-item" checked value="' + bankItems[i].id + '" /></td>';
                            } else {
                                htmls += '<td><input type="radio" class="addr-radio" name="bank-item" value="' + bankItems[i].id + '" /></td>';
                            }
                            htmls += '<td><img src=' + staticUrl + bankItems[i].logo + '></td>'
                                + '<td>' + bankItems[i].bankName + '(尾号' + lastBankNo + ')</td>'
                                + '<td>单笔限额' + bankItems[i].singleQuota + '</td>'
                                + '<td>每日限额' + bankItems[i].dailyQuota + '</td>'
                                + '</tr>'
                        }
                        $('#get-bank-list').html(htmls);
                    }
                }
            }).done(function () {
                me.updatePayBankCard();
                me.addPayOrder();
            });
        },

        addPayOrder: function () {
            var addPayOrderAjax = $.ajax({
                url: host + 'fastPay/addPayOrder.htm?orderId=' + orderId,
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON'
            });
            addPayOrderAjax.done(function (result) {
                bankId = result.data.payBindBankCard.id;
                $('input[name="bank-item"]').each(function(){
                    if(bankId == this.value){
                        $(this).attr("checked","checked");
                    }
                });
                //预留银行卡
                var mobile = result.data.payBindBankCard.mobile;



                $('#phone').html(mobile.substring(0,3) + '****' + mobile.substring(7));

                // 2016-12-12 确保 addPayOrder.htm 请求 done 之后再执行 bankShow.htm
                if (result.code == '0000') {
                    var bankStr = '';
                    //$('#payId').val(result.desc);
                    $.each(result.data.onlinePayBankList, function(i, bank) {
                        bankStr = bankStr +
                            '<li>' +
                                '<input type="radio" id="bank-item-'+ bank.bankCode + '" name="bankSelection" class="radio-i" value="'+ bank.bankCode +'" />' +
                                '<label for="bank-item-' + bank.bankCode + '"><img src="'+ staticUrl + bank.logo +'" alt="'+ bank.bankName +'" ></label>' +
                            '</li>';
                    });
                    $('.bank-list').append(bankStr);
                    $('.radio-i').on('click', function (e) {
                        // IE8 don't support CSS Selector [:cheked]
                        var targetEl = $(e.target);
                        targetEl.parent('li').siblings().removeClass('active');
                        targetEl.parent('li').addClass('active');
                    })
                } else if (result.code == '0013') {
                    var readSmartAlert = new SmartAlert({
                        title: '提示',
                        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您这笔订单已经支付，无需再次支付。</span>',
                        type: 'confirm',
                        okText: '我知道了',
                        maskClosable: false,
                    });
                    readSmartAlert.open();
                    window.location.href = indexUrl;
                } else if (result.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                }
            })
        },

        updatePayBankCard: function () {
            // 判断支付银行卡是否是订单页选择银行卡，如果更换进行重签
            $('input[name=bank-item]').on('click', function () {
                if ($(this).val() != bankId) {
                    var changeBankId = $(this).val();

                    var readSmartAlert = new SmartAlert({
                        title: '提示',
                        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">更换绑定新的支付银行卡，需重新签订投资人协议。</span>',
                        okText: '暂不更换',
                        cancelText: '确认',
                        onCancel: function () {
                            $.ajax({
                                url: host + 'order/changePayBankCard.htm?orderId=' + orderId + '&payBindBankCardId=' + changeBankId,
                                type: 'POST',
                                data: token_client_data,
                                dataType: 'JSON',
                                success: function (result) {
                                    bankId = changeBankId;
                                    window.location.href = baseUrl + 'sign/sign.html?orderId=' + orderId + '&proId=' + proId;
                                }
                            });
                        },
                        onOk: function () {
                            $('.addr-radio:radio[value=' + bankId + ']').click();
                        },
                        maskClosable: true,
                    });
                    readSmartAlert.open();
                }
            });
        },

        showSmsTips: function () {
            $('.pay-sms-tips').hover(function () {
                $('.no-mag-wrapper').find('.noMsgTips').show();
            }, function () {
                $('.no-mag-wrapper').find('.noMsgTips').hide();
            });
        }
	};

	PayProject.init();

    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;

    // 校验订单状态  如果已经签名 跳转到我的订单
    $.ajax({
        type: 'POST',
        url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                if (data.data != '1') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">订单状态不符合支付。</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
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

    $.ajax({
        type: 'POST',
        url: host + '/order/getOrderInfo.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                /*
                * 非港澳台用户才有快捷支付
                * 2016-12-21  jingpinghong@creditease.cn
                * */
                if (result.data.userCheck.idcardtype != 1) {
                    $('#payType').val('onlinePay');
                    //12.30 bug chengwei
                    storage.set('payType','onlinePay');
                    $('.shortcut').removeClass('select');
                    $('.ebank').addClass('select');
                    $('.shortcut').css('visibility','hidden');
                    $('#bank-table').css('display','none');
                    $('#pay-notice').css('display','block');
                }

                // 隐藏网银支付
                $('.ebank').css('display','none');
                $('#pay-notice').css('display','none');
                $('#orderNo').html(result.data.angelOrder.orderNo);
                $('#proName').html(result.data.angelOrder.prejectName);
                $('#proInveseAmount').html(formatMoney(result.data.angelOrder.price) + '元');
                $('#userAddress').html(result.data.angelOrder.address);
                var mobile = result.data.angelOrder.mobile;
                $('#mobile').html(mobile.substring(0,3) + '****' + mobile.substring(7));
                $('#zipCode').html(result.data.angelOrder.zipCode);
                $('#proInveseAmountSpan').html(formatMoney(result.data.angelOrder.price));
                var userName = result.data.angelOrder.extend2;
                $('#userName').html('**' + userName.substring(userName.length-1,userName.length));
                $('#pay-quota').html(formatMoney(result.data.angelOrder.price) + '元');
                proId = result.data.angelOrder.prejectId;

                proinveseId = result.data.angelOrder.extend1;
            } else if (result.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

    // 发短信
    function sendCode() {
        $('#sendCode').off('click', sendCode);
        var sendmsgUrl = '';
        if ($('#payType').val() == 'fastPay') {
            sendmsgUrl = host + 'fastPay/paySendMsg.htm?orderId=' + orderId;
        } else if ($('#payType').val() == 'onlinePay') {
            sendmsgUrl = host + 'pay/sendMsg.htm?payType=online&orderId=' + orderId;
        } else if ($('#payType').val() == 'offlinePay') {
            sendmsgUrl = host + 'pay/sendMsg.htm?payType=offline&orderId=' + orderId;
        } else {
            showError('请联系客服人员');
            return false;
        }
        $.ajax({
            url: sendmsgUrl,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    curCount = count;
                    InterValObj = window.setInterval(countdown, 1000);
                    //showSuccess('短信验证码已发送');
                } else if(data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                } else {
                    $('#sendCode').html('60秒');
                    $('#sendCode').on('click', sendCode);
                    showError(data.desc);
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
            $('#sendCode').html('重新获取');
            $('#sendCode').css({
                'background': '#FFF',
                'border': '1px solid rgba(255, 180, 0, 0.4)',
                'color': '#E1B555',
                'height': '38px'
            });
        } else {
            curCount--;
            if (curCount < 10 && curCount != 0) {
                $('#sendCode').html('0' + curCount + '秒');
            } else {
                $('#sendCode').html(curCount + '秒');
            }
        }
    }

    // 获取打款账号
    $('#account').click(function() {

        if ($('#dxInput').val() == '' || $('#dxInput').val() == undefined || $('#dxInput').val() == null) {
            showError('请输入短信验证码');
            return false;
        }else if($('#dxInput').val().length !== 6){
            showError('请输入正确的短信验证码');
            return false;
        }

        $.ajax({
            url: host + 'pay/checkCode.htm?payType=offline&orderId=' + orderId + '&code=' + $('#dxInput').val(),
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    window.clearInterval(InterValObj);
                    $('.wgt-pay-validate').fadeOut('slow');
                    getOfflineInfo();
                    $('.mask').fadeIn('slow');
                    $('.wgt-pay-account').fadeIn('slow');
                    setKey();
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                    showError(data.desc);
                }
            },error:function (e) {
            }
        });
    });

    // 查询线下打款信息
    function getOfflineInfo() {
        $.ajax({
            url: host + 'order/getOfflineInfo.htm?proId=' + proId + '&orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                   $('#accountName').html(data.data.companyName);
                   $('#accountBank').html(data.data.accountBank);
                   $('#accountNum').html(data.data.accountNum);
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                    showError(data.desc);
                }
            },error:function (e) {
            }
        });
    }

    // 设置查看线下打款状态
    function setKey() {
        $.ajax({
            url: host + 'order/setOfflineAccountKey.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },error:function (e) {
            }
        });
    }

    function loadData(datas){
        $('#acqId').val(datas.acqId);
        $('#amount').val(datas.amount);
        $('#bankId').val(datas.bankId);
        $('#bizId').val(datas.bizId);
        $('#bizTp').val(datas.bizTp);
        $('#channelId').val(datas.channelId);
        $('#customerName').val(datas.customerName);
        $('#identNo').val(datas.identNo);
        $('#merchId').val(datas.merchId);
        $('#notifyUrl').val(datas.notifyUrl);
        $('#paymentTp').val(datas.paymentTp);
        $('#returnUrl').val(datas.returnUrl);
        $('#sendTime').val(datas.sendTime);
        $('#userIP').val(datas.userIP);
        $('#versionNo').val(datas.versionNo);
        $('#signInfo').val(datas.signInfo);
    }

    // 支付已完成
    $('#payFinish').click(function() {
        console.log(token_client_data);
        $.ajax({
            url: host + 'pay/online/payFinish.htm?orderId=' + orderId,
            type: "post",
            dataType: 'json',
            data: token_client_data,
            success: function (data) {
                if (data.code == '0000') {
                    window.location.href = baseUrl + 'success/paysuccess.html?orderId=' + orderId;
                } else if (data.code=='4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                } else if (data.code=='9999') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                } else {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            }
        });
    });

    function toPayOnline(){
        $(".signaqrCode").hide();
        var bankId = $('input:radio[name="bankSelection"]:checked').val();
        var payId = $('#payId').val();
        //var paramData =  extend(token_client_data, {}, {});
        $.ajax({
            url: host + 'pay/online/topay.htm',   // 提交的页面
            data: {
               'token': getToken(),
               'clientType':'pc',
               'orgCode':'xinjiesuanonline',
               'bankId':bankId,
               'orderId': orderId
            }, // 从表单中获取数据
            type: 'POST',
            contentType:'application/x-www-form-urlencoded;charset=utf-8',
            dataType:"json",
            success: function(data) {
                if (data.code == '0000') {
                    document.form0.action = data.data.url;
                    loadData(data.data);
                    document.form0.submit();
                    $('.wgt-pay-validate').fadeOut('slow');
                    $('.mask').fadeIn('slow');
                    $('.wgt-pay-confirm').fadeIn('slow');
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                };
            },
            error: function(error) { // 设置表单提交出错
            	var readSmartAlert = new SmartAlert({
            	    title: '报错',
            	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+error+'</span>',
            	    type: 'confirm',
            	    okText: '我知道了',
            	    maskClosable: false,
            	});
            	readSmartAlert.open();
            }
        });
    }

    // check用户订单状态
    function checkOrderStatus(){
        $.ajax({
            url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    if (data.data != '1') {
                    	var readSmartAlert = new SmartAlert({
                    	    title: '提示',
                    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">订单超过三十分钟，请到我的投资列表页重新签约</span>',
                    	    type: 'confirm',
                    	    okText: '我知道了',
                    	    maskClosable: false,
                    	});
                    	readSmartAlert.open();
                        window.location.href = indexUrl;
                    } else if(data.data == '2' || data.data == '3'){
                    	var readSmartAlert = new SmartAlert({
                    	    title: '提示',
                    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您这笔订单已经支付，无需再次支付。</span>',
                    	    type: 'confirm',
                    	    okText: '我知道了',
                    	    maskClosable: false,
                    	});
                    	readSmartAlert.open();
                        window.location.href = indexUrl;
                    }
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },error:function (e) {
            }
        });
    }

    // 查询支付订单状态
    function checkPaySuccess(bizId) {
        var paySuccessInterval = setInterval(function () {
            $.ajax({
                type: 'POST',
                url: host + 'fastPay/queryPayStatus.htm?payNo=' + bizId + '&orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function (data) {
                    if (data.code == "9999") {
                        var readSmartAlert = new SmartAlert({
                            title: '提示',
                            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">' + data.desc + '</span>',
                            okText: '重新支付',
                            cancelText: '我的投资',
                            onOk: function () {
                                readSmartAlert.close();
                            },
                            onCancel: function () {
                                window.location.href = baseUrl + 'invest/list.html';
                            },
                            maskClosable: false,
                        });
                        readSmartAlert.open();
                        clearInterval(paySuccessInterval);
                    }
                }
            });
        }, 2000);
    }

    // 确认支付
    $('#confirmPay').click(function() {

        if ($('#dxInput').val() == '' || $('#dxInput').val() == undefined || $('#dxInput').val() == null) {
            showError('请输入短信验证码');
            return false;
        }else if($('#dxInput').val().length !== 6){
            showError('请输入正确的短信验证码');
            return false;
        }

        $.ajax({
            url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    if (data.data == '0') {// 待签约
                    	var readSmartAlert = new SmartAlert({
                    	    title: '提示',
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
                    	    title: '提示',
                    	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您这笔订单已经支付，无需再次支付。</span>',
                    	    type: 'confirm',
                    	    okText: '我知道了',
                    	    maskClosable: false,
                    	});
                    	readSmartAlert.open();
                        window.location.href = indexUrl;
                    } else{
                        if($('#payType').val() == 'fastPay'){//快捷支付  直接发短信支付
                            $.ajax({
                                url: host + 'fastPay/doPay.htm?orderId=' + orderId + '&smsCode=' + $('#dxInput').val(),
                                type: 'post',
                                dataType: 'json',
                                data:token_client_data,
                                success: function (data) {
                                    if (data.code == '0000') {
                                        window.location.href = baseUrl + 'success/paysuccess?orderId=' + orderId +'&bizId=' + data.data;
                                    } else if (data.code == '4000') {
                                        // location.href = loginUrl;
                                        handleLoginTimeout();
                                    } else if (data.code == '7000') {
                                        $('.error-notice').show().find('.para').html(data.desc);
                                    } else if (data.code == '6000') {
                                        window.clearInterval(InterValObj);
                                        $('.mask').fadeOut();
                                        $('.wgt-pay-validate').fadeOut('slow');

                                        // 查询订单状态，错误弹窗
                                        checkPaySuccess(data.data);
                                    } else {
                                        var readSmartAlert = new SmartAlert({
                                            title: '提示',
                                            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">' + data.desc + '</span>',
                                            type: 'confirm',
                                            okText: '我知道了',
                                            maskClosable: false,
                                        });
                                        readSmartAlert.open();
                                    }
                                }
                            });
                        }else if($('#payType').val() == 'onlinePay') {//网银支付
                            $.ajax({
                                url: host + 'pay/checkCode.htm?payType=online&orderId=' + orderId + '&code=' + $('#dxInput').val(),
                                type: 'post',
                                dataType: 'json',
                                data:token_client_data,
                                success:function (data) {
                                    if (data.code == '0000') {
                                        window.clearInterval(InterValObj);
                                        toPayOnline();
                                    } else if (data.code == '4000') {
                                        // location.href = loginUrl;
                                        handleLoginTimeout();
                                    }
                                    if (data.code == '9999') {
                                        showError(data.desc);
                                    }
                                }
                            });
                        }

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

    });

    // 线下支付
    $('#line').click(function() {
        // PayProject.yetAnotherTab();
        checkUserLogin();
        $.ajax({
            url: host + 'order/checkOfflineAccountKey.htm?orderId=' + orderId,
            type: 'post',
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    if (data.data) {
                        getOfflineInfo();
                        $('.mask').fadeIn('slow');
                        $('.wgt-pay-account').fadeIn('slow');
                    } else {
                        $('#hidPayType').val('pay_offline');
                        $('#sendCode').html('60秒');
                        $('#dxInput').val('');
                        $('#success').hide();
                        $('#successMsg').html('');
                        $('#error').hide();
                        $('#errorMsg').html('');

                        sendCode();
                        // $('#sendCode').on('click', sendCode);
                        $('.mask').fadeIn('slow');
                        $('.wgt-pay-validate').fadeIn('slow');
                        $('#confirmPay').hide();
                        $('#account').show();
                        $('.pay-sms-tips').remove();
                        $('.error-notice').show().find('.para').html('您需要确认开通并使用数字证书后获取打款账号');
                    }
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                }
                if (data.code == '9999') {
                	var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },error:function (e) {
            }
        });

        getUserInfo();
    });

    // 获取用户信息
    function getUserInfo() {
        $.ajax({
            url: host + 'user/getUserBase.htm',
            type: "post",
            dataType: 'json',
            data:token_client_data,
            success:function (data) {
                if (data.code == '0000') {
                    var mobile = data.data.mobileNo;
                    $('#phone').html(mobile.substring(0,3) + '****' + mobile.substring(7));
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                } else {
                    $('#sendCode').off('click', sendCode);
                    var readSmartAlert = new SmartAlert({
                	    title: '报错',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },error:function (e) {
            }
        });
    }

    // 去支付按钮
    $('#next-btn').click(function() {
        var bankCode = '';

        // 初始化发送短信
        $('#sendCode').html('60秒');
        sendCode();

        if($('#payType').val() == 'fastPay'){//快捷支付  直接发短信支付
            bankCode = $('input:radio[name="bank-item"]:checked').val();
        }else if($('#payType').val() == 'onlinePay') {//网银支付
            bankCode = $('input:radio[name="bankSelection"]:checked').val();
        }
        if (bankCode == null) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先选择一个银行!</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return false;
        }

        // $('#sendCode').html('获取验证码');
        $('#dxInput').val('');
        // $('#sendCode').on('click', sendCode);

        /*
        * 数字证书接口
        * 点击去支付的时候，请求此接口
        * 如果 data.code 为 ‘0000’，且 data.data 为 false, 则需要再次让用户获取手机验证码；
        * 如果 data.data 为 true ，则不需要再让用户用户获取手机验证码，直接走后面的支付流程
        * 此处显示的逻辑还有待与宏君一同调试
        * 2016-12-04 jihongzhang@creditease.cn
        */
        if($('#payType').val() == 'fastPay'){//快捷支付  直接发短信支付
            $('.mask').fadeIn('slow');
            $('.wgt-pay-validate').fadeIn('slow');
            $('#account').hide();
            $('.txt-phone').html('您的预留手机号为')

        }else if($('#payType').val() == 'onlinePay'){//网银支付
            var fetchValidateDigitalCerticate = $.ajax({
                type: 'POST',
                url: host + 'pay/validateSmsValid.htm?orderId=' + request.orderId,
                data:token_client_data,
                dataType: 'JSON',
            })

            fetchValidateDigitalCerticate.done(function (data) {
                if (data.code == '0000') {
                    if (data.data == true) {
                        // 直接去支付
                        toPayOnline();
                    } else if (data.data == false) {
                        $('.mask').fadeIn('slow');
                        $('.wgt-pay-validate').fadeIn('slow');
                    }
                }
            })

            // $('.mask').fadeIn('slow');
            // $('.wgt-pay-validate').fadeIn('slow');

            $('#success').hide();
            $('#successMsg').html('');
            $('#error').hide();
            $('#errorMsg').html('');
            $('#confirmPay').show();
            $('#account').hide();

            // 初期化获取用户手机号
            getUserInfo();
        }
    });

    var OrderPay = {
        init: function () {
            this.showDialog();
            this.closeDialog();

            var me = this;

            $('.pay-confirm').on('click', function () {
                $('.mask').fadeIn('slow');
                $('.wgt-pay-confirm').fadeIn('slow');
            });
        },

        showDialog: function () {
            this.initDialog();
            this.adjustDialog();
        },

        adjustDialog: function () {
            $(window).on('resize scroll', function () {
                $('.wgt-pay-confirm').css('left', ($(window).width() - $('.wgt-pay-confirm').outerWidth()) / 2);
                $('.wgt-pay-confirm').css('top', ($(window).height() - $('.wgt-pay-confirm').outerHeight()) / 2 + $(window).scrollTop());
            });
        },

        initDialog: function () {
            $('.wgt-pay-confirm').css('left', ($(window).width() - $('.wgt-pay-confirm').outerWidth()) / 2);
            $('.wgt-pay-confirm').css('top', ($(window).height() - $('.wgt-pay-confirm').outerHeight()) / 2);
        },

        closeDialog: function () {
            $('.wgt-pay-confirm').find('.close').click(function () {
                $('.mask').fadeOut('slow');
                $('.wgt-pay-confirm').fadeOut('slow');
            });
        }
    };

    OrderPay.init();

    var OrderPayAccount = {
        init: function () {
            this.showDialog();
            this.closeDialog();

            var me = this;
        },

        showDialog: function () {
            this.initDialog();
            this.adjustDialog();
        },

        adjustDialog: function () {
            $(window).on('resize scroll', function () {
                $('.wgt-pay-account').css('left', ($(window).width() - $('.wgt-pay-account').outerWidth()) / 2);
                $('.wgt-pay-account').css('top', ($(window).height() - $('.wgt-pay-account').outerHeight()) / 2 + $(window).scrollTop());
            });
        },

        initDialog: function () {
            $('.wgt-pay-account').css('left', ($(window).width() - $('.wgt-pay-account').outerWidth()) / 2);
            $('.wgt-pay-account').css('top', ($(window).height() - $('.wgt-pay-account').outerHeight()) / 2);
        },

        closeDialog: function () {
            $('.wgt-pay-account').find('.close').click(function () {
                $('.mask').fadeOut('slow');
                $('.wgt-pay-account').fadeOut('slow');
            });
        }
    };

    OrderPayAccount.init();

    var OrderPayValidate = {
        init: function () {
            this.showDialog();
            this.closeDialog();
        },

        showDialog: function () {
            this.initDialog();
            this.adjustDialog();
        },

        adjustDialog: function () {
            $(window).on('resize scroll', function () {
                $('.wgt-pay-validate').css('left', ($(window).width() - $('.wgt-pay-validate').outerWidth()) / 2);
                $('.wgt-pay-validate').css('top', ($(window).height() - $('.wgt-pay-validate').outerHeight()) / 2 + $(window).scrollTop());
            });
        },

        initDialog: function () {
            $('.wgt-pay-validate').css('left', ($(window).width() - $('.wgt-pay-validate').outerWidth()) / 2);
            $('.wgt-pay-validate').css('top', ($(window).height() - $('.wgt-pay-validate').outerHeight()) / 2);
        },

        closeDialog: function () {
            $('.wgt-pay-validate').find('.close').click(function () {
                $('.mask').fadeOut('slow');
                $('.wgt-pay-validate').fadeOut('slow');
                window.clearInterval(InterValObj);
                $('#sendCode').off('click', sendCode);
            });
        }
    };

    OrderPayValidate.init();
})();

// 显示错误信息
function showError(errorDesc){
    $('#errorMsg').text(errorDesc);
    $('#success').hide();
    $('#error').show();
}
// 显示成功信息
function showSuccess(successDesc){
    $('#successMsg').text(successDesc);
    $('#error').hide();
    $('#success').show();
}
