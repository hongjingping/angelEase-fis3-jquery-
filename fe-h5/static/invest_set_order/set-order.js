(function () {
    checkUserLogin();
    checkUserStatus();

    var req = getRequest();
    var proId = req.proId;

	var InvestOrder = {
		init: function () {
			this.setHeader();
			this.bindMask();
			this.checkBoxInit();

            // 银行卡支付提示
            this.bankcardNotcie();

            // notice animation
            this.animateNotice();
		},
        animateNotice: function () {
            $('.notice-container').animate({
                top: '10px'
            }, 1000);
        },
		setHeader: function () {
			$('.cmn-header-title').text('下单页');
		},
		bindMask: function() {
             $('.i-know').click(function() {
                 $('.over-fund-dialog').hide();
                 $('.gray-mask').hide();
             });

             $('.over-fund-close').on('click', function() {
                 $('.over-fund-dialog').hide();
                 $('.gray-mask').hide();
             });
		},
		showMask: function() {
        	$('.over-fund-dialog').show();
        	$('.gray-mask').show();
		},
		hideMask: function() {
        	$('.over-fund-dialog').hide();
        	$('.gray-mask').hide();
		},
        bankcardNotcie: function () {
            $('.side-icon').on('click', function () {
                $('.gray-mask').show();
                $('.bankcard-dialog').show();
            });

            $('.bankcard-know').on('click', function () {
                $('.gray-mask').hide();
                $('.bankcard-dialog').hide();
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
		},

        // common method
        setBankData: function (bankDetailData) {
            if (bankDetailData) {
                var lastNum = bankDetailData.bankCardNo;
                lastNum = '(尾号' + lastNum.slice(-4) + ')';

                $('.bank-item').show();

                // set bank id
                $('.bank-item').attr('bank-id', bankDetailData.id);
                $('.bank-logo').attr('src', staticUrl + bankDetailData.logo);
                $('.bank-title').text(bankDetailData.bankName);
                $('.quota').text('单笔限额' + bankDetailData.singleQuota);
                $('.bank-num').text(lastNum);
            }
        }
	};

	InvestOrder.init();

    var proinveseId;
    var proInvAmount;
    var addId = 0;
    if (req.addId != null) {
        addId = req.addId;
        checkAddressIsDel(addId,proId);
    }
    $('#proId').val(proId);
    var selHtml = '';
    var selAmount = {};
    var selBackinfo = {};
    var amountArr = {};
    var isCustomed = {};
    var selIndex = 0;
    var selLength = 0;
    getOrderCheck();
    //预购码校验
    var acode = checkAppointCode(proId);
    if( acode == '0000'){
        new SmartToast({
            content: '您的预购额度将不计入募集进度，在正式募集开始后会优先转为投资额。',
            type: 'warn',
            duration: 3
        });
    }
    $.ajax({
        type: 'POST',
        url: host + '/order/toOrder.htm?proId=' + proId + '&addId=' + addId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {

            if (result.code == '0000') {
                // 超募提示
                if (result.data.isRisaeFlag == '1'){
                    InvestOrder.showMask();
                }

                if (result.data.adrFlag == '1') {
                    var addressInfo = result.data.address;
                    $('.detail-address-label').html('<span class="username">'+ addressInfo.consignee + '</span>'   + addressInfo.mobile + '<br />'+'<span class="addr">'+addressInfo.province + addressInfo.city + addressInfo.district + addressInfo.address+'</span>');
                    $('#addrId').val(addressInfo.id);
                    $('#addDiv').hide();
                } else {
                    $('#addrId').val('');
                    $('.address-panel').hide();
                    $('#addDiv').show();
                }
                $('#proName').html(result.data.proName);

                if (result.data.proInvList) {
                    $.each(result.data.proInvList, function(i, a) {
                        if (i == 0) {
                            /**
                             * 进入页面就判断是否为定制化档位
                             */
                            if (a.isCustomed === 1) {
                                new SmartToast({
                                    content: '定制档无法保证全额投资，最终投资金额以合同为准，请您确认后继续操作',
                                    type: 'warn',
                                    duration: 3
                                });
                            }
                            $('#backInfo').html(a.backInfo);
                            $('#sel_intentionspayment').html(formatMoney(a.amount) + '<span class="small-case">元</span><br/><span class="legal-amount">' + numToCny(a.amount)) + '</span>';
                            $('#amountId').val(a.id);
                            $('#proInvAmount').val(a.amount);
                            proinveseId = a.id;
                            proInvAmount = a.amount;
                        }
                        selBackinfo[i] = a.backInfo;
                        selAmount[i] = a.amount;
                        amountArr[i] = a.id;
                        isCustomed[i] = a.isCustomed;
                        selLength = i;
                    });
                }

                // larger payment
                if (result.data.payBindBankCardList.length == 0) {
                    var req = getRequest();
                    var proId = req.proId;
                    var orderId = req.orderId;
                    var proinveseId = req.proInvId;
                    var proInvAmount = req.proInvAmount;
                    var fromPayPage = req.fromPayPage;
                    // to add bankcard page
                    $('.bank-item').hide();
                    $('.bankcard-add').show().on('click', function () {
                        window.location.href = '/page/add-bank-card/add-bank-card.html?proId=' + proId + '&orderId=' + orderId + '&fromPayPage=' + fromPayPage + '&proinveseId=' + proinveseId + '&proInvAmount=' + proInvAmount;
                    });
                } else {
                    // get user's default account
                    var bankDetailData = result.data.payBindBankCardList[0];

                    // invoke this method here may not be elegant
                    InvestOrder.setBankData(bankDetailData);
                }

            } else if (result.code == '4000') {
                window.location.href = loginUrl;
            }
        }
    }).done(function () {
        $('.bank-item').on('click', function () {
            proId = $('#proId').val();
            var proInvId = $('#amountId').val();
            var addressId = $('#addrId').val();
            var finalBankId = $('.bank-item').attr('bank-id');

            if (proInvId == '' || proInvId == null) {
                new SmartToast({
                    content: '请先选择投资档位',
                    type: 'warn',
                    duration: 3
                });
                return;
            }
            if (addressId == '') {
                new SmartToast({
                    content: '请先选择地址',
                    type: 'warn',
                    duration: 3
                });
                return;
            }

            if (!finalBankId) {
                new SmartToast({
                    content: '请选择一个银行进行支付',
                    type: 'warn',
                    duration: 3
                });
                return;
            }

            $.ajax({
                type: 'POST',
                url: host + '/order/saveOrderInfo.htm?proId=' + proId + '&addressId=' + addressId + '&proInvId=' + proInvId + '&payBindBankCardId=' + finalBankId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(result) {
                    var selectedBankId = $('.bank-item').attr('bank-id');

                    if (result.code == '0000') {
                        window.location.href = '/page/banklist/bank-list.html?'
                            + 'proId=' + proId
                            + '&proinveseId=' + proInvId
                            + '&bankId=' + selectedBankId;

                    } else if (result.code == '4000') {
                        window.location.href = loginUrl;
                    }
                }
            });
        });

        if (req.bankId) {
            $.ajax({
                type: 'POST',
                url: host + 'bindbankcard/getBindBankCardDetail.htm?bindBankCardId=' + req.bankId,
                data: token_client_data,
                dataType: 'JSON',
                success: function (result) {
                    var bankItemData = result.data.payBindBankCard;
                    InvestOrder.setBankData(bankItemData);
                }
            });
        }
    });

    // 增加档位
    $('.add-amount-btn').click(function() {
      $('.add-amount-btn,.sub-amount-btn').removeClass('unable');
        if (selLength == selIndex) {
            $('.add-amount-btn').addClass('unable');
    		return;
    	}
        /*
          * 定制档位化弹出提示框
          * jingpinghong@creditease.cn
          * 2017-02-24
          * */
        if( isCustomed[selIndex+1] == 1 ){
            new SmartToast({
                content: '定制档无法保证全额投资，最终投资金额以合同为准，请您确认后继续操作',
                type: 'warn',
                duration: 3
            });
        }

        selIndex++;
    	$('#sel_intentionspayment').html(formatMoney(selAmount[selIndex]) + '<span class="small-case">元</span><br/><span class="legal-amount">' + numToCny(selAmount[selIndex])) + '</span>';
    	$('#backInfo').html(selBackinfo[selIndex]);
    	$('#amountId').val(amountArr[selIndex]);
        $('#proInvAmount').val(selAmount[selIndex]);
        proinveseId = amountArr[selIndex];
        proInvAmount = selAmount[selIndex];
        if (selLength == selIndex) {
           $('.add-amount-btn').addClass('unable');
            return;
        }
    });

    // 减小档位
    $('.sub-amount-btn').click(function() {
      $('.add-amount-btn,.sub-amount-btn').removeClass('unable');
    	if (selIndex <= 0) {
        $('.sub-amount-btn').addClass('unable');
    		return;
    	}
        /*
         * 定制档位化弹出提示框
         * jingpinghong@creditease.cn
         * 2017-02-24
         * */
        if( isCustomed[selIndex-1] == 1 ){
            new SmartToast({
                content: '定制档无法保证全额投资，最终投资金额以合同为准，请您确认后继续操作',
                type: 'warn',
                duration: 3
            });
        }

    	selIndex--;
    	$('#sel_intentionspayment').html(formatMoney(selAmount[selIndex]) + '<span class="small-case">元</span><br/><span class="legal-amount">' + numToCny(selAmount[selIndex])) + '</span>';
    	$('#backInfo').html(selBackinfo[selIndex]);
    	$('#amountId').val(amountArr[selIndex]);
        $('#proInvAmount').val(selAmount[selIndex]);
        proinveseId = amountArr[selIndex];
        proInvAmount = selAmount[selIndex];
        if (selIndex <= 0) {
           $('.sub-amount-btn').addClass('unable');
            return;
        }
    });

    // 订单确认页
    $('#toConfirm').click(function() {
        if ($('#i-check-btn').hasClass('i-check-unchecked')) {
            new SmartToast({
                content: '请先同意以上协议',
                type: 'warn',
                duration: 3
            });
            return;
        }
        proId = $('#proId').val();
        var proInvId = $('#amountId').val();
        var addressId = $('#addrId').val();
        var finalBankId = $('.bank-item').attr('bank-id');
        var orderPrice = $('#proInvAmount').val();
        if (proInvId == '' || proInvId == null) {
            new SmartToast({
                content: '请先选择投资档位',
                type: 'warn',
                duration: 3
            });
            return;
        }
        if (addressId == '') {
            new SmartToast({
                content: '请先选择地址',
                type: 'warn',
                duration: 3
            });
            return;
        }

        if (!finalBankId) {
            new SmartToast({
                content: '请选择一个银行进行支付',
                type: 'warn',
                duration: 3
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: host + '/order/saveOrderInfo.htm?proId=' + proId + '&addressId=' + addressId + '&proInvId=' + proInvId + '&payBindBankCardId=' + finalBankId + "&orderPrice=" + orderPrice,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                var selectedBankId = $('.bank-item').attr('bank-id');
                if (result.code == '0000') {
                    window.location.href = baseUrl + 'invest_order_confirm/order_confirm.html?'
                        + 'proId=' + proId
                        + '&proinveseId=' + proInvId
                        + '&bankId=' + selectedBankId
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                }
            }
        });
    })

    // 获取用户实名信息
    function getOrderCheck() {
        $.ajax({
            type: 'POST',
            url: host + '/order/getUserCheck.htm',
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    $('#investorName').html(result.data.name);
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
    }

    // 跳转地址
    $('#investAddress').click(function() {
        storage.set('order-to-address', '1');
        window.location.href = baseUrl + 'invest_address/my-address.html?proId=' + proId + '&proInvAmount=' + proInvAmount;;
    })

    // 预约意向书
    $('#protocolOrder').click(function() {
        var bindBankCardId = $('.bank-item').attr('bank-id');
        var proinveseId = $('#amountId').val();
        var proInvAmount = $('#proInvAmount').val();
        window.location.href = baseUrl + 'protocol/subscribe.html?proId=' + proId + '&proinveseId=' + proinveseId + '&bindBankCardId=' + bindBankCardId + '&proInvAmount=' + proInvAmount;
    });

    // 投资风险申明书
    $('#protocolFund').click(function() {
        window.location.href = baseUrl + 'protocol/risk.html?proId=' + proId + '&proInvAmount=' + proInvAmount;
    });

})();

// 校验下单时候，删除地址然后返回下单页
function checkAddressIsDel(addressId,proId) {
    $.ajax({
        type: 'POST',
        url: host + '/address/addressInfo.htm?currAddId=' + addressId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                if (result.data.isValid == '0') {
                    window.location.href = baseUrl + 'invest_set_order/set-order.html?proId=' + proId + '&noticeType=order';
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
}
//预购码验证
function checkAppointCode(proId) {
    var code;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: token_client_data,
        url: host + 'active/checkBind.htm?proId=' + proId,
        dataType: 'JSON',
        success: function(data) {
            //alert(data.code);
            code = data.code;
        }
    });
    return code;
}
