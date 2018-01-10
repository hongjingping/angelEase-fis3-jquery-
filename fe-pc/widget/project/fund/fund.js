(function () {

    var request = getRequest();
    var proId = request.proId;
    var proinveseId = request.proinveseId;
    var addressesLength = 0;
    var bankItemLength = 0;

	var OrderProject = {
		init: function () {
            this.initDialog();
            this.adjustDialog();
            this.closeDialog();

            this.initSmsDialog();
            this.adjustSmsDialog();
            this.closeSmsDialog();

            this.openSendSmsWin();
            this.showNoSmsTips();

            this.getBankLimitList();
		},

        getBankLimitList: function () {
            $.ajax({
                url: host + 'bindbankcard/limitPayment.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
                success: function (data) {
                    if (data.code == '0000') {
                        var result = data.data.list;
                        banklistData(result);

                    }else if (data.code == '4000') {
                        //window.location.href = loginUrl;
                        /*
                         * jingpinghong@creditease.cn
                         * 2017-02-16
                         * */
                        handleLoginTimeout();
                    }
                }
            });
        },

		showDialog: function () {
			$('.mask').show();
			$('.wgt-dialog-address').show();
		},

		adjustDialog: function () {
		    $(window).on('resize scroll', function () {
		        $('.wgt-dialog-address').css('left', ($(window).width() - $('.wgt-dialog-address').outerWidth()) / 2);
		        $('.wgt-dialog-address').css('top', ($(window).height() - $('.wgt-dialog-address').outerHeight()) / 2 + $(window).scrollTop());
		    });
		},

		initDialog: function () {
		    $('.wgt-dialog-address').css('left', ($(window).width() - $('.wgt-dialog-address').outerWidth()) / 2);
		    $('.wgt-dialog-address').css('top', ($(window).height() - $('.wgt-dialog-address').outerHeight()) / 2);
		},

		closeDialog: function () {
		    $('.wgt-dialog-address').find('.close').click(function () {
		        $('.mask').fadeOut('slow');
		        $('.wgt-dialog-address').fadeOut('slow');
		    });
		},

        showSmsDialog: function () {
			$('.mask').show();
			$('.wgt-dialog-sms').show();
		},

		adjustSmsDialog: function () {
		    $(window).on('resize scroll', function () {
		        $('.wgt-dialog-sms').css('left', ($(window).width() - $('.wgt-dialog-sms').outerWidth()) / 2);
		        $('.wgt-dialog-sms').css('top', ($(window).height() - $('.wgt-dialog-sms').outerHeight()) / 2 + $(window).scrollTop());
		    });
		},

		initSmsDialog: function () {
		    $('.wgt-dialog-sms').css('left', ($(window).width() - $('.wgt-dialog-sms').outerWidth()) / 2);
		    $('.wgt-dialog-sms').css('top', ($(window).height() - $('.wgt-dialog-sms').outerHeight()) / 2);
		},

		closeSmsDialog: function () {
		    $('.wgt-dialog-sms').find('.close').click(function () {
		        $('.mask').fadeOut('slow');
		        $('.wgt-dialog-sms').fadeOut('slow');
		    });
		},

        openSendSmsWin: function () {
            var me = this;
            $('#sub-check').on('click', function () {
                // me.showSmsDialog();
            });
        },

        showNoSmsTips: function () {
            $('#no-Msg').hover(function () {
                $('.no-mag-wrapper').find('.noMsgTips').show();
            }, function () {
                $('.no-mag-wrapper').find('.noMsgTips').hide();
            });
        }
	};

	OrderProject.init();

    checkUserLogin();

    checkUserStatus();


    var request = getRequest();
    var proId = request.proId;
    var proinveseId = request.proinveseId;
    var addressesLength = 0;
    var bankItemLength = 0;

    getOrderCheck();



    //验证预购码
    var acode = checkAppointCode(proId);
    if (acode == '0000'){
        var readSmartAlert = new SmartAlert({
            title: '提示',
            content: '<i class="ae-icon ae-icon-attention notice-attention" style="float:left;"></i><span class="content-txt" style="float:left;width:90%;text-align:left;">您的预购额度将不计入募集进度，在正式募集开始后会优先转为投资额。</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
    }

	$.ajax({
        type: 'POST',
        url: host + 'order/toOrder.htm?proId=' + proId + '&amountId=' + proinveseId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == '0000') {
                if (data.data.isRisaeFlag == '1') {
                    $('#sectionSty').attr('style','');
                }
                $('#proName').html(data.data.proName);
                // 设置回报

                /**
                 * pc 档位定制化需求
                 *
                 * 2017-02-23 jihongzhang@creditease.cn
                 */

                var resData = data.data
                var customedEl = $('.fund-container .is-customed');
                var notCustomed = $('.fund-container .not-customed');
                if (resData.proInvList.isCustomed === 1) {
                    notCustomed.css('display', 'none');
                    customedEl.css('display', 'block');

                    var proListArray = resData.proInvList.proInvAmount;
                    var _idArray = proListArray.map(function(d) {
                        return d.isDefaultAmount;
                    });

                    var $changeBtn = $('.item-box .change-btn');

                    var _index = _idArray.indexOf(true);
                    var currentProIndex = _index > -1 ? _index : 0;
                    // init info of pro item  and status of btns
                    updateProItemInfo();
                    updateBtnStatus();

                    $changeBtn.on('click', function(e) {
                        var isIncrement = $(e.currentTarget).hasClass('increment');
                        if (isIncrement) currentProIndex++;
                        else currentProIndex--;
                        updateProItemInfo();
                        updateBtnStatus();
                    });

                } else {
                    notCustomed.find('#intentionspayment').html('<span id="currentAmount">' + resData.proInvList.proInvAmount[0].amount + '</span><span>元</span>');
                    $('.fund-container').find('#backInfo').html(resData.proInvList.proInvAmount[0].backInfo);
                }

                function updateProItemInfo() {
                    var currentProItem = proListArray[currentProIndex];
                    $('#customed-intentionspayment').html('<span id="currentAmount" data-id="' + currentProItem.id +'">' + currentProItem.amount + '</span><span>元</span>');
                    $('#backInfo').html(currentProItem.backInfo);
                }

                function updateBtnStatus() {
                    $changeBtn.attr('disabled', false);
                    if (currentProIndex === 0) {
                        $changeBtn.filter('.decrement').attr('disabled', true);
                    }

                    if (currentProIndex === _idArray.length - 1) {
                        $changeBtn.filter('.increment').attr('disabled', true);
                    }
                }

                var bankData = data.data.payBindBankCardList;
                if (bankData && bankData.length > 0 && bankData.length <= 5) {
                    // show bankcard list
                    $('.bankcard-no-data').hide();
                    if (bankData.length == 5) {
                        $('#add-bankcard').hide();
                    }
                    $('#bank-table').show();

                    var htmls = '';
                    var bankItems = data.data.payBindBankCardList;
                    bankItemLength = bankItems.length;
                    var bankIndex = storage.get('bankIndex');
                    for (var i = 0; i < bankItemLength; i++) {
                        var lastBankNo = bankItems[i].bankCardNo.slice(-4);
                            if ((bankIndex && bankItems[i].id == bankIndex) || (!bankIndex && i == 0)) {
                                htmls += '<tr class="active">';
                                htmls += '<td><input type="radio" class="addr-radio" name="bank-item" checked value="' + bankItems[i].id + '" data-bankcode="'+bankItems[i].bankCode+'" /></td>';
                            } else {
                                htmls += '<tr><td><input type="radio" class="addr-radio" name="bank-item" value="' + bankItems[i].id + '"data-bankcode="'+bankItems[i].bankCode+ '"/></td>';
                            }
                        htmls += '<td class="bank-logo-wrapper"><img class="bank-logo-img" src=' + staticUrl + bankItems[i].logo + '></td>'
                            + '<td>' + bankItems[i].bankName + '(尾号' + lastBankNo + ')</td>'
                            + '<td>单笔限额' + bankItems[i].singleQuota + '</td>'
                            + '<td>每日限额' + bankItems[i].dailyQuota + '</td>'
                            + '</tr>'
                    }
                    $('#get-bank-list').html(htmls);
                    //add checked bank check off
                    $.ajax({
                        type: 'POST',
                        url: host + '/order/checkOfflineBank.htm',
                        data: $.extend(token_client_data,{bankCode:$('input[name=bank-item]:checked').attr('data-bankcode')}),
                        dataType: 'JSON',
                        success: function(result) {
                          if (result.code === '9999') {
                            new SmartAlert({
                                title: '提示',
                                content: '<div id="uploadError"><i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+result.desc+'</span></div>',
                                type: 'confirm',
                                okText: '确定',
                                maskClosable: true,
                                forceDestroy: true
                            }).open();
                          }
                      }
                    });
                } else if (bankData && bankData.length == 0){
                    // show bankcard with no data
                    $('.bankcard-no-data').show();
                    $('#bank-table').hide();
                } else if (bankData && bankData.length > 5) {
                    $('#add-bankcard').hide();
                }

                //add check bank off
                $('input[name=bank-item]').change(function(e){
                  $.ajax({
                      type: 'POST',
                      url: host + '/order/checkOfflineBank.htm',
                      data: $.extend(token_client_data,{bankCode:$(e.target).attr('data-bankcode')}),
                      dataType: 'JSON',
                      success: function(result) {
                        if (result.code === '9999') {
                          new SmartAlert({
                              title: '提示',
                              content: '<div id="uploadError"><i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+result.desc+'</span></div>',
                              type: 'confirm',
                              okText: '确定',
                              maskClosable: true,
                              forceDestroy: true
                          }).open();
                        }
                    }
                  });
                });

                // 设置地址区域
                reAdress();
            } else if (data.code == '4000') {
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
    }).done(function () {
        $('.updateId').on('click', function () {
            addressInitInfo($(this).attr('data-id'));
        });

        // 点击radio效果
        // $('#get-bank-list').find('tr').on('click', function (index, item) {
        //     $('#get-bank-list').find('tr').removeClass('active')
        //     $(this).addClass('active')
        // });

        $('#get-bank-list').find('input[type="radio"]').on('click', function (e) {
            var targetEl = $(e.target);
            var targetParentEl =  targetEl.parents('tr');
            targetParentEl.siblings('.active').removeClass('active');
            targetParentEl.addClass('active');
        })
    });

    // 订单确认页
    $('#toConfirm').click(function() {
				//check adding bank card
				var bank_checked = $('#get-bank-list .addr-radio:checked').length;

        if (addressesLength == 0) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请添加地址信息</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return false;
        }

        if (bankItemLength == 0 || bank_checked === 0) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请添加银行信息</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return false;
        }

        if (!$('#agreement').is(':checked')) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先同意以上协议。</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return;
        }

        var addressId = $('input:radio[name="address"]:checked').val();
        if (addressId == '') {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先选择地址。</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return;
        }

        // have default selected bank
        var bankItemId = $('input:radio[name="bank-item"]:checked').val();
        var proInvId = proinveseId;
        var orderPrice = $('#currentAmount').html();
        $.ajax({
            type: 'POST',
            url: host + '/order/saveOrderInfo.htm?proId=' + proId + '&addressId=' + addressId + '&proInvId=' + proInvId + '&payBindBankCardId=' + bankItemId + '&orderPrice=' + orderPrice,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    storage.set('addressIndex', addressId)
                    storage.set('bankIndex', bankItemId)
                    window.location.href = 'pay.html?proId=' + proId + '&proinveseId=' + proInvId + '&bankId=' + bankItemId;
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
    });

    // 新增地址按钮
    $('#addAddress').click(function() {
        if (addressesLength >= 5) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">最多只能添加5个地址</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return false;
        }
        getRandomToken();
		OrderProject.showDialog();
        $('.ae-icon-attention').html('');
        $('.ae-icon-close').html('');
        $('#consignee').val('');
        $('#mobile').val('');
        $('#address').val('');
        $('#zipcode').val('');
        $('.notice').hide();
        addressInit('city1','city2','city3','','','');
        $('#city1').parent().find('span').html('所在地区');

    });

    // 返回项目详情页
    $('#backDetail').click(function() {
        window.location.href = baseUrl + 'detail/detail.html?proId=' + proId;
    });

    // 编辑地址（初期化）
    function addressInitInfo(adrId){
        getRandomToken();
        OrderProject.showDialog();
        $('.notice').hide();
        $('.ae-icon-attention').html('');
        if (adrId != '' && typeof(adrId) != 'undefined') {
            $('#adrId').val(adrId);
            $('.detail-header-title').html('编辑地址');
            $.ajax({
                type: 'POST',
                data: token_client_data,
                url: host + '/address/addressInfo.htm?currAddId=' + adrId,
                dataType: 'JSON',
                success: function(result) {
                    if (result.code == '0000' && result.data != null) {
                        $('#consignee').val(result.data.consignee);
                        $('#mobile').val(result.data.mobile);
                        $('#zipcode').val(result.data.zipcode);
                        $('#address').val(result.data.address);
                        addressInit('city1', 'city2', 'city3', result.data.provinceCode, result.data.cityCode, result.data.districtCode);
                        $('#provinceCode').val(result.data.provinceCode);
                        $('#cityCode').val(result.data.cityCode);
                        $('#districtCode').val(result.data.districtCode);
                        $('#city1').parent().find('span').html('所在地区');
                        if (result.data.isDefault != '1') {
                            document.getElementById('isDefault').checked = false;
                        } else {
                            document.getElementById('isDefault').checked = true;
                        }
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
        }
    }

    function getRandomToken () {
        /*
        * 获取随机token，并在提交表单的时候带上 randomToken
        * 2016-11-23 jihongzhang@creditease.cn
        */

        var getRandomTokenAjax = $.ajax({
            type: 'POST',
            url: host + 'address/getAddressToken.htm',
            data: token_client_data,
            dataType: 'JSON',
        })
        getRandomTokenAjax.done(function (data) {
            if (data.code == '0000') {
                storage.set('randomtoken', data.data.token);
            }
        })
    }

    getRandomToken();
    // 保存地址（更新地址）
    $('#saveAddr').click(function() {
        $('#token').val(getToken());

        var cc = checkSubmit();
        if (cc == false) {
            return;
        }

        var randomToken = $.base64.encode(storage.get('randomtoken'))
        var formData = $('#formAdr').serializeArray();
        $.ajax({
            type: 'POST',
            url: host + '/address/addAddress.htm?randomToken=' + randomToken,
            data: formData,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
									/*
                	var readSmartAlert = new SmartAlert({
                	    title: '成功',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">地址信息修改成功</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
										*/
                    $('.mask').fadeOut('slow');
                    $('.wgt-dialog-address').fadeOut('slow');
                    // 刷新地址区域
                    reAdress();
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
    });

    // 刷新地址区域
    function reAdress() {
        $.ajax({
            type: 'POST',
            url: host + 'order/toOrder.htm?proId=' + proId + '&amountId=' + proinveseId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(data) {
                if (!data.data.addresses) {
                    $('.address-no-data').show();
                    $('#order-table').hide();
                } else {
                    $('.address-no-data').hide();
                    $('#order-table').show();
                    if (data.code == '0000') {
                        var htmls = '';
                        var addresses = data.data.addresses;
                        addressesLength = addresses.length;
                        var addressIndex = storage.get('addressIndex');
                        for (var i = 0; i < addresses.length; i++) {
                            if ((addressIndex && addresses[i].id == addressIndex) || (!addressIndex && i == 0)) {
                                htmls += '<tr class="active">';
                                htmls += '<td><input type="radio" class="addr-radio" name="address" checked value="' + addresses[i].id + '" /></td>';
                            } else {
                                 htmls += '<tr><td><input type="radio" class="addr-radio" name="address" value="' + addresses[i].id + '" /></td>';
                            }
                            htmls += '<td>' + addresses[i].consignee + '</td>'
                                + '<td>' + addresses[i].mobile + '</td>'
                                + '<td>' + addresses[i].address + '/' + addresses[i].zipcode + '</td>'
                                + '<td><a class="updateId" data-id="' + addresses[i].id + '">编辑</a></td>'
                                + '</tr>'
                        }
                        $('#addressList').html(htmls);
                        getOrderSelectable();
                    } else if (data.code == '4000') {
                        //window.location.href = loginUrl;
                        /*
                         * jingpinghong@creditease.cn
                         * 2017-02-16
                         * */
                        handleLoginTimeout();
                    }
                }
            },
            error: function(e) {
            }
        }).done(function () {
            $('.updateId').on('click', function () {
                addressInitInfo($(this).attr('data-id'));
            });
        });
    }

    function getOrderSelectable() {
        $('#order-table').find('input[type="radio"]').on('click', function (e) {
            // console.log(e.target);
            var targetEl = $(e.target);
            var targetParentEl =  targetEl.parents('tr');
            targetParentEl.siblings('.active').removeClass('active');
            targetParentEl.addClass('active');
        })
    }

    // 隐藏报错区域
    $('#consignee, #mobile, #city1, #city2, #city3, #address, #zipcode').focus(function() {
       $('.notice').hide();
    });

    // 页面验证
    function checkSubmit() {

        if ($('input[name="consignee"]').val() == '') {
            $('.notice').show();
            $('#error-txt').html('请填写收件人');
            return false;
        }
        if ($('input[name="mobile"]').val() == '') {
            $('.notice').show();
            $('#error-txt').html('请填写联系方式');
            return false;
        } else if (!(/^1[3|4|5|7|8]\d{9}$/.test($('input[name="mobile"]').val()))) {
            $('.notice').show();
            $('#error-txt').html('手机号码有误，请重填');
            return false;
        }
        var provinceVal = $('select[name="province"] option:selected').val();
        var cityVal = $('select[name="city"] option:selected').val();
        var districtVal = $('select[name="district"] option:selected').val();

        if (
            !provinceVal || provinceVal == '--省份--'
            || !cityVal || cityVal == '--城市--'
            || !districtVal
        ) {
            $('.notice').show();
            $('#error-txt').html('请填写地址信息');
            return false;
        }

        if ($('textarea[name="address"]').val().length < 4) {
            $('.notice').show();
            $('#error-txt').html('详细地址,不少于4个字');
            return false;
        }
        if ($('input[name="zipcode"]').val() == '') {
            $('.notice').show();
            $('#error-txt').html('请填写邮编');
            return false;
        }
        $('.notice').hide();
    }

    // 设置是否为默认地址
    $(document).on('click', '#isDefault', function(e) {
        if (document.getElementById('isDefault').checked) {
            $('#isDefault').val('1');
        }else {
             $('#isDefault').val('0');
        }
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
    }

    // 预约意向书

    $('#protocolOrder').click(function() {
        var bindBankCardId = $('input:radio[name="bank-item"]:checked').val();
        var proInvAmount = $('#currentAmount').html();
        window.open(baseUrl + 'protocol/order.html?proId=' + proId + '&proInvAmount=' + proInvAmount + '&bindBankCardId=' + bindBankCardId);
        // window.open(baseUrl + 'protocol/order.html?proId=' + proId + '&proinveseId=' + proInvId + '&bindBankCardId=' + bindBankCardId);
    });

    // 投资风险申明书
    $('#protocolFund').click(function() {
        window.open(baseUrl + 'protocol/fund.html?proId=' + proId);
    });

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
            },
            error: function(e) {
            }
        });
        return code;
    }

    // 添加银行卡
    $('#add-bankcard').click(function() {
		$('#get-bank-list .addr-radio:checked').attr('checked', false);

        $('#add-bankcard').hide();
        $('.bank-list-wrap').hide();
        $('.bankcard-container').show();
    });

    // 取消
    $('.close-panel').click(function() {
		var bank_checked = $('#get-bank-list .addr-radio:checked').length;
        var bankIndex = storage.get('bankIndex');
				if(bankIndex){
					$('#get-bank-list .addr-radio').each(function(k,v){
						if($(v).val() === bankIndex) $(v).click();
					})
				}else{
					$($('#get-bank-list .addr-radio')[0]).click()
				}
        $('#add-bankcard').show();
        $('.bank-list-wrap').show();
        $('.bankcard-container').hide();
    });

    // 发送绑卡短信
    $('#settime-btn').click(function() {
        $.ajax({
            type:'post',
            url: host+'bindbankcard/sendMsg.htm',
            data:{
                token: token_client_data.token,
                clientType: token_client_data.clientType,
                mobile: $.base64.encode($('#mobileNumHidden').val())
            },
            dataType:'JSON',
            success: function (result) {
                if(result.code == '0000'){
                    var setTimeBtn = document.getElementById('settime-btn');
                    countDownSmsTime(setTimeBtn);
                    showSuccess2('短信发送成功');
                    $('.mask').show();
                    $('.wgt-dialog-sms').show();
                } else if (result.code == '9999'){
                    showError2(result.desc);
                }
            },
            error: function (data) {
            }
        });
    });

    function sendMsg(){
       $.ajax({
           type:'post',
           url: host+'bindbankcard/sendMsg.htm',
           data:{
               token: token_client_data.token,
               clientType: token_client_data.clientType,
               mobile: $.base64.encode($('#mobileNumHidden').val())
           },
           dataType:'JSON',
           success: function (result) {
               if(result.code == '0000'){
                   var setTimeBtn = document.getElementById('settime-btn');
                   countDownSmsTime(setTimeBtn);
                   showSuccess('短信发送成功');
                   $('.mask').show();
                   $('.wgt-dialog-sms').show();
               } else if (result.code == '9999'){
                   showError(result.desc);
               }
           },
           error: function (data) {
           }
       });
    }
    // 绑卡
    $('#nextBtn-two').click(function() {
        $.ajax({
            type:'post',
            url: host+'bindbankcard/bindPayBankCard.htm',
            data:{
                token: token_client_data.token,
                clientType: token_client_data.clientType,
                code: $('#code').val()
            },
            dataType:'JSON',
            success: function (result) {
                if(result.code == '0000'){
                    showSuccess('银行卡绑定成功');
                    window.location = baseUrl + '/project/project?proId=' + proId + '&proinveseId=' + proinveseId;
                } else if (result.code == '9999'){
                    showError2(result.desc);
                }
            },
            error: function (data) {
            }
        });
    });

})();

/*
 *  jingpinhong@creditease.cn
 */
(function () {
    //添加银行卡页面用户姓名
    $.ajax({
        url: host + 'user/auth/realNameResult.htm',
        dataType: 'JSON',
        type: 'POST',
        data: {
            token: token_client_data.token,
            clientType: token_client_data.clientType
        },
        success: function (result) {
            if(result.code == '0000'){
                $('#name').html(result.data.realName);
            }else if (result.code == '4000'){
                //location.href = loginUrl;
                /*
                 * jingpinghong@creditease.cn
                 * 2017-02-16
                 * */
                handleLoginTimeout();
            }else if (data.code == '9999') {
                new SmartToast({
                    content: '系统异常，请稍后再试',
                    type: 'warn',
                    duration: 2
                });
            }
        },
        error:function(e) {
        }
    });

    //返回上一页的时候,卡类型还保存
    if($('#card-num').val() != '' && $('#card-num').val() != null && $('#card-num').val() != undefined){
        var bankCardNo = $('#card-num').val();
        bankcardtype(bankCardNo);
    }

})();

//校验银行卡类型
function bankcardtype(bankCardNo){
    if(bankCardNo != "" && bankCardNo != null && bankCardNo != undefined){
        // $('#font-c').css('color','#000');
        $('#loadingImg').css('display','block');
        $('#bankCardType').css("display",'block');
        /* ajax开始去后台请求校验银行卡号 */
        $.ajax({
            type:'post',
            //接口地址
            url: host+'bindbankcard/checkBindBankCardType.htm?bankCardNo=' + $.base64.encode(bankCardNo),
            //data发送请求数据
            data:{
                token: token_client_data.token,
                clientType: token_client_data.clientType
            },
            //datatype服务器返回的数据格式
            dataType:'JSON',
            //成功响应后调用
            success: function (result) {
                //书写模板并且进行渲染
                var code=$('#card-num').val();
                if (result.code == '0000') {
                    //银行卡验证成功
                    $('#loadingImg').css('display','block');
                    $('#cardType').html(result.data.bankName +'&nbsp;'+result.data.bankTypeName);
                    $('#cardType').css('color','#000');
                    //成功的时候给隐藏域赋值
                    $('#card-type-check').val(1);
                } else {
                    //银行卡验证失败
                    $('#cardType').html(result.desc);
                    $('#cardType').css('color','#DFDFDF');
                }
            },
            error:function(data){
                //console.log(JSON.stringify(data)+'shibai');
                $('#loadingImg').css('display','none');
                $('#cardType').html('系统错误,请稍后再试');

            },
        });
        /* ajax结束 */
    }
}

//显示错误信息
function showError(errorDesc){
	$('#error1').text(errorDesc);
	$('#success').hide();
	$('#error0').show();
}
//显示发送短信验证码信息
function showSuccess(successDesc){
	$('#successMsg').text(successDesc);
	$('#error0').hide();
	$('#success').show();
}

//显示错误信息
function showError2(errorDesc){
    $('#error3').text(errorDesc);
    $('#error2').show();
    $('#success2').hide();
}
function showSuccess2(successDesc){
    $('#successMsg2').text(successDesc);
    $('#error2').hide();
    $('#success2').show();
}
/*banklist-data start*/
function banklistData(data) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        str += "<tr><td>" + obj.bankName + "</td><td>" + obj.singleQuota + "</td><td>" + obj.dailyQuota + "</td></tr>";
    }
    $("#banklist-Data").html(str);
};
// $('#support-bank').hover(function(){
//     $('#bank-list').show();

//     /* ajax请求开始 */
//     $.ajax({
//         url: host + 'bindbankcard/limitPayment.htm',
//         type: 'POST',
//         data: token_client_data,
//         dataType: 'JSON',
//         success: function (data) {
//             //console.log("数据"+JSON.stringify(data));
//             if (data.code == '0000') {
//                 var result = data.data.list;
//                 banklistData(result);

//             }else if (data.code == '4000') {
//                 window.location.href = loginUrl;
//             }
//         }
//     });
//     /* ajax请求结束 */
// }, function () {
//     $("#bank-list").hide();
// });

/*banklist-data end*/

/*协议点击选中与否*/
$('#check-icon').on('click',function(){
    if ($(this).hasClass("check-icon1")) {
        //被选中
        $(this).removeClass("check-icon1");
        $(this).addClass("check-icon2");
    } else {
        //不被选中
        $(this).removeClass("check-icon2");
        $(this).addClass("check-icon1");
    }
});

/*鼠标放在小图标,显示提示语*/
$('#cardName').on('mouseenter',function(){
    $('#card-name').css('display','block');
});
$('#cardName').on('mouseout',function(){
    $('#card-name').css('display','none');
});
$('#cardNum').on('mouseenter',function(){
    $('#bankCardNum').css('display','block');
});
$('#cardNum').on('mouseout',function(){
    $('#bankCardNum').css('display','none');
});

// 银行卡号校验
function check(){
    if (isNaN($('#card-num').val().replace(/\s/g,''))) {
        // console.log(isNaN($('#card-num').val().replace(/\s/g, '')));
        showError("抱歉，您的卡号输入格式有误，请核实后再试!");
        setTimeout(function(){
            $('#error0').hide();
        },2000);
        return;
    }
}

//1127jingpinghong-放大显示银行卡号
$('#card-num').on('focus keyup change propertychange',function(){
    check();
    if($(this).val().length>0){
        $('#textMag').css('display','block');
        var i = $('#card-num').val();
        i = $.trim(i);
        var h = i.substring(0, 4);
        i = i.substring(4);
        while (i && i.length > 0) {
            h += " " + i.substring(0, 4);
            i = i.substring(4)
        }
        $("#textMag").html(h);
    }else {
        $('#textMag').css('display','none');
        $("#textMag").html();
    }
});

/*鼠标离开的时候隐藏放大显示的div,并且进行校验*/
$('#card-num').on('blur',function(){
    $('#textMag').css('display','none');
    $("#textMag").html();
    //鼠标离开银行卡号后自动检验卡类型
    var bankCardNo = $('#card-num').val();
    bankcardtype(bankCardNo);
});

/* 手机号码格式 */
//手机号码前面三位后面四位一空格
function Mobile(obj) {
    var value = obj.value;
    value = value.replace(/\s*/g, "");
    var result = [];
    for(var i = 0; i < value.length; i++)
    {
        if (i==3||i==7)
        {
            result.push(" " + value.charAt(i));
        }
        else
        {
            result.push(value.charAt(i));
        }
    }
    obj.value = result.join("");
}

var phoneNum = document.getElementById('phoneNum');
$('#phoneNum').keyup(function(){
    var num = phoneNum;
    Mobile(num);
});

//校验手机号是否合法
function is_mobile(phone){
    if(phone==null || phone=='' || phone==undefined){
        return false;
    }
    var _phone= phone.replace(/\s/g,"");
    var pattern=/^1\d{10}$/;
    if(!pattern.test(_phone)){
        return false;
    }
    return true;
}

//图形验证码
var picUrl = host + "/bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=pc";
$("#img-code").attr('src', picUrl);


$('#img-code').on('click', function () {
    var picUrl = host + "bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=pc";
    $("#img-code").attr('src', picUrl + '&rand='+ Math.random());
});

//点击提交按钮提交,进入下一步
$('#sub-check').on('click',function(){
    if ($('#name').html() == '' || $('#card-num').val() == 'undefined' || $('#card-num').val() == '' || $('#phoneNum').val() == undefined || $('#imgCode').val() == '') {
        showError('请输入正确信息');
        return false;
    }
    //检验输入框是否合法
    if($('#card-num').val() == '' || $('#card-num').val() ==  'undefined' || $('#card-num').val() == null){
        showError('请输入正确的银行卡号');
        return false;
    }
    //检验卡类型是否合法
    if($('#card-type-check').val() != 1){
        showError('卡类型错误,请核对后再试');
        return false;
    }
    var phoneNum = $('#phoneNum').val();
    if(phoneNum == '' || phoneNum.length != 13 || phoneNum ==  null || phoneNum == 'undefined'){
        showError('请输入正确的手机号');
        return false;
    }
    if($('#imgCode').val() == '' || $('#imgCode').val() == null || $('#imgCode').val() == 'undefined' ){
        showError('请输入正确的图形验证码');
        return false;
    }
    if(($('#check-icon').hasClass('check-icon1'))){
        showError('请先同意以上协议');
        return false;
    }

    //鉴权验证
    var bankCardNum = $('#card-num').val();
    var phoneNumber = $('#phoneNum').val().replace(/\s+/g, '');
    var picCode = $("#imgCode").val();
    $.ajax({
        type:'post',
        //接口地址
        url: host+'bindbankcard/bindBankCardAuthentication.htm',
        //data发送请求数据
        data:{
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            bankCardNo: $.base64.encode(bankCardNum),
            mobile : $.base64.encode(phoneNumber),
            picCode: picCode
        },
        //datatype服务器返回的数据格式
        dataType:'JSON',
        //成功响应后调用
        success: function (result) {

            if(result.code === '0000'){
                setBindBankCardMobile();
            } else {
                if(result.desc != ''){
                    showError(result.desc);
                    return ;
                }
            }
        },
        //错误响应时调用
        error: function (data) {
        }
    });
});

// 设置绑卡要发送短信的手机号
function setBindBankCardMobile () {
    $.ajax({
        type:'post',
        url: host+'bindbankcard/cacheBindBankCardMobile.htm',
        data:{
            token: token_client_data.token,
            clientType: token_client_data.clientType
        },
        dataType:'JSON',
        success: function (result) {
            if(result.code == '0000'){
                $('#mobileNum').html(phone(result.data.mobile));
                $('#mobileNumHidden').val(result.data.mobile);
                //jingpinghong@creditease.cn 2016-12-05
                //$('.mask').show();
                $.ajax({
                    type:'post',
                    url: host+'bindbankcard/sendMsg.htm',
                    data:{
                        token: token_client_data.token,
                        clientType: token_client_data.clientType,
                        mobile: $.base64.encode($('#mobileNumHidden').val())
                    },
                    dataType:'JSON',
                    success: function (result) {
                        if(result.code == '0000'){
                            var setTimeBtn = document.getElementById('settime-btn');
                            countDownSmsTime(setTimeBtn);
                            showSuccess2('短信发送成功');
                            $('.mask').show();
                            $('.wgt-dialog-sms').show();
                        } else if (result.code == '9999'){
                            showError2(result.desc);
                            $('.mask').show();
                            $('.wgt-dialog-sms').show();
                        }
                    },
                    error: function (data) {
                    }
                });

                $('.wgt-dialog-sms').show();
            } else if (result.code == '9999'){
                showError(result.desc);
            }
        },
        error: function (data) {
        }
    });
}

//手机验证码获取倒计时60秒
var clock = '';
var nums = 60;
var btn;
function countDownSmsTime(thisBtn) {
    btn = thisBtn;
    btn.disabled = true; //将按钮置为不可点击
    btn.value = nums+'秒';
    btn.style.color = '#C9C9C9';
    clock = setInterval(doLoop, 1000); //一秒执行一次
}

function doLoop() {
    nums--;
    if(nums > 0){
        btn.value = nums+'秒';
    }else{
        clearInterval(clock); //清除js定时器
        btn.disabled = false;
        btn.value = '重新获取';
        btn.style.color = '#E1B555';
        btn.style.backgroundColor = '#fff';
        btn.style.border = '1px solid rgba(255, 180, 0, 0.4)';
        nums = 60; //重置时间
    }
}

function phone(phone) {
    if(phone != '' && phone != null){
        var phoneNew = phone.replace(/\s/g,"").replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return phoneNew;
    }
    return phone;
}
