(function () {
    checkUserLogin();
	var PersonalCenter = {
		init: function () {
			this.personalCenterHeader();
            this.bindCloseBtn();
		},

		personalCenterHeader: function () {
            $('.cmn-header-title').text('AngelEase');
			// $('.cmn-header').remove();
		},

        bindCloseBtn: function () {
            $('.close-icon').click(function() {
                window.location.href = indexUrl;
            });
        }
	};

	PersonalCenter.init();

    $.ajax({
		url: host + 'mmessage/unreadConut.htm',
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.desc != '0'){
					$('#unreadConut').text(result.desc);
					$('#unreadConut').show();
				}else{
					$('#unreadConut').hide();
				}
			}else if(result.code=='4000'){
                location.href = loginUrl;
            }
		},
		error:function(e) {
			console.log(e);
		}
	});

    //判断我的消息链接跳转
    $.ajax({
		url: host + 'mmessage/getMessage.htm',
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.data.modelList.length > 0){
					$('#mymessage').attr('onclick','window.location.href="/page/message/my-message.html"');
				}else {
					$('#mymessage').attr('onclick','window.location.href="/page/message/empty-message.html"');
				}
			}
		}
	});

    //判断实名认证连接跳转
    $.ajax({
        type: 'POST',
        url: host + 'user/auth/realNameResult.htm',
        data:token_client_data,
        dataType: 'JSON',
        success: function (data) {
    		var length = data.data.mobile.length;
    		$('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-3));
        	//如果已经实名认证，调到结果页
        	if(data.code == '0000'){
                // 校验用户实名认证、合格投资人认证状态，非中国大陆用户不可绑卡
                var checkIfGAT =  $.ajax({
                    url: host + 'baseuser/getUserStatus.htm',
                    dataType: 'JSON',
                    type: 'POST',
                    data:token_client_data,
                })

                checkIfGAT.done(function (data) {
                    if (data.code == '0000') {
                        // 2016-12-27 jihongzhang@creditease.cn 港澳台用户也可以绑卡，未实名认证成功的不可点击银行卡， 此处可考虑去掉调用realNameResult接口，全部通过selectUserByApp来调用。
                        if (data.data.userCheckStatus == '2') {
                                var ifHasBank = $.ajax({
                                    url: host + 'bindbankcard/getBindBankCardList.htm',
                                    type: 'POST',
                                    data: token_client_data,
                                    dataType: 'JSON',
                                })

                                ifHasBank.done(function (data) {
                                    if(data.code == '0000') {
                                        var nextPath;
                                        if(data.data.payBindBankCardList.length > 0) {
                                            nextPath = "/page/bankcenter/mybank.html";
                                        } else if (data.data.payBindBankCardList.length == 0) {
                                            nextPath = "/page/bankcenter/mybank-without-data.html";
                                        }
                                        if (nextPath) {
                                            $('#certification').on('click', function() {
                                                window.location.href = nextPath;
                                            });
                                        }
                                    } else if (data.code == '9999') {
                                        $('#certification').on('click', function() {
                                            new SmartToast({
                                                content: '系统异常，请稍后再试',
                                                type: 'warn',
                                                duration: 2
                                            });
                                        });
                                    }
                                })
                        }
                    } else {
                        //
                    }
                })

        	} else {

        	}
		}
    });

    /*
    * 获取用户头像和头像下面的名字（如果有实名就填显示成 **某 ，如果没有实名就显示昵称）
    * 2016-11-22 13:08 jihongzhang@creditease.cn
    */
    var fetchUserInfo = $.ajax({
        url: host + "user/getUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
    })

    fetchUserInfo.done(function (data) {
        if (data.code == '0000') {
            $(".username").html(data.data.nickname);
            if (data.data.headphoto != '' && data.data.headphoto!=null) {
                $("#avatar-img2").css('display','inline-block');
                $("#avatar-img2").attr("src", staticUrl + data.data.headphoto);
            }else{
                $("#avatar-img").css('display','inline-block');
            }
            // 获取实名信息
            var fetchRealNameResult = $.ajax({
                type: 'POST',
                url: host + 'user/auth/realNameResult.htm',
                data:token_client_data,
                dataType: 'JSON',
            })
            fetchRealNameResult.done(function (data) {
                var length = data.data.mobile.length;
                $('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-3));
                if (data.code == '0000') {
                    var realName = data.data.realName;
                    if (realName) {
                        $(".username").html('**' + data.data.realName.substring(data.data.realName.length - 1, data.data.realName.length));
                    }
                } else if (data.code == '9999') {
                        //9999 todo
                }
            })
        }
    })


    // 设定是否已经实名认证的样式
    $.ajax({
        url: host + "/baseuser/getUserStatus.htm",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.data.userCheckStatus == '2') {
                // 通过实名认证，银行卡的颜色为金色
                $('#certification').addClass('card-li-active');
                $('#cIcon').addClass('bar-ant-cert');
                $('#cIconI').addClass('ae-icon ae-icon-cert-square bar-ant-icon ant-cert');
                $('.card-li-info').removeClass('card-li-new').addClass('card-li-new2');

            } else {
                $('#cIcon').addClass('bar-ant-fund');
                $('#cIconI').addClass('ae-icon ae-icon-cert-heart bar-ant-icon');
                $('#cIconII').addClass('ae-icon ae-icon-attention bar-ant-dot');
                $('.card-li-info').removeClass('card-li-new2').addClass('card-li-new1');

            }
            if (data.data.investorStatus == '2' || data.data.investorStatus == '3' || data.data.investorStatus == '4') {
                $('.card-cert-style').removeClass('card-cert-newstyletwo').addClass('card-cert-newstyle');
                $('.card-cert-style').html('合格投资人');
                $('#iIcon').addClass('bar-ant-cert');
                $('#iIconI').addClass('ae-icon ae-icon-cert-square bar-ant-icon ant-cert');
            } else {
                $('.card-cert-style').removeClass('card-cert-newstyle').addClass('card-cert-newstyletwo');
                $('.card-cert-style').html('未认证合格投资人');
                $('#iIcon').addClass('bar-ant-fund');
                $('#iIconI').addClass('ae-icon ae-icon-cert-heart bar-ant-icon');
                $('#iIconII').addClass('ae-icon ae-icon-attention bar-ant-dot');
            }

            if(data.data.userCheckStatus == '0'){
                $('#investor').attr('onclick','window.location.href="/page/real_name_auth/real_name_auth.html"');
            }else if(data.data.investorStatus != '0'){
                $('#investor').attr('onclick','window.location.href="/page/investor_cert_part2/investor-cert-partial-suc.html"');
            }else if(data.data.userCheckStatus == '0'){
                $('#investor').attr('onclick','window.location.href="/page/investor_cert_part1/investor-cert-form.html"');
            }
        }
    });

    // 点击我的投资按钮
    $('#myInvest').click(function() {
        $.ajax({
            url: host + 'invest/invest.htm?status=&page=1',
            type: 'POST',
            data: token_client_data,
            dataType: 'JSON',
            success: function (data) {
                if (data.code == '0000') {
                    var userType = data.data.user.userType;
                    if (userType == 1) {
                        $('#certDiv').css('display','block');
                        $('.gray-mask').show();
                    } else if (userType == 0 || userType == 3) {
                        $('#investorDiv').css('display','block');
                        $('.gray-mask').show();
                    } else {
                        window.location.href = baseUrl + 'personal_my_invest/my-invest.html';
                    }
                }else if (data.code == '4000') {
                    window.location.href = loginUrl;
                }
            },
            error: function(e) {
            }
        }).done(function () {

        });
    });

    // 关闭弹窗
    $('.dialog-close').click(function() {
        $('#investorDiv').css('display','none');
        $('#certDiv').css('display','none');
        $('#ifGATdiv').css('display','none');
    });

    $('#closeGAT').click(function () {
        $('#ifGATdiv').css('display','none');
    });

    // 跳转实名认证
    $('#toCert').click(function() {
        //实名认证未成功的话,跳到结果页面
        var getUserStatusAjax = $.ajax({
            url: host + 'baseuser/getUserStatus.htm',
            type: 'POST',
            data: token_client_data,
            dataType: 'JSON',
        });
        getUserStatusAjax.done(function (data) {
            if(data.code == '0000') {
                if (data.data.userCheckStatus == '0') {
                    window.location.href = baseUrl + 'real_name_auth/real_name_auth.html';
                }else if (data.data.userCheckStatus == '1' || data.data.userCheckStatus == '3') {
                    window.location.href = baseUrl + 'real_name_auth/real_name_suc.html';
                }
            }
        });
        //window.location.href = baseUrl + 'real_name_auth/real_name_auth.html';
    });

    // 跳转合格投资人认证
    $('#toInvestor').click(function() {
        //window.location.href = baseUrl + 'investor_cert_part1/investor-cert-form.html';
        window.location.href = baseUrl + 'investor_cert_part2/investor-cert-partial-suc.html';
    })
})();

function logout() {
    $.ajax({
        url: host + "user/logout.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: "clientType=wap&token=" + getToken(),
        success: function (data) {
            if (data.code == '0000') {
                clearToken();
                window.location.href = "../login/login.html";
            } else {
                $("#error").html(data.desc)
            }

        }
    });
}
