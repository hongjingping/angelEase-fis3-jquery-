(function () {
	var MenuBar = {
		init: function () {
			this.hoverHead();
            this.hoverHeadImg();
		},

		hoverHead: function () {
			$('.menu-bar-head').hover(function () {
				$('.bar-head-mask').show();
			}, function () {
				$('.bar-head-mask').hide();
			});
		},

        hoverHeadImg: function () {
            $('.head-mask').hover ( function () {
                $(".head-mask").stop().animate({opacity: '1'},400);
            }, function () {
                $(".head-mask").stop().animate({opacity: '0'},400);
            });
        }
	};

	MenuBar.init();

	//数据填充
	//获取站内信未读数量
    $.ajax({
		url: host + 'mmessage/unreadConut.htm',
		dataType: "JSON",
		type: "POST",
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if(result.desc != '0'){
//					$('#letter_id').addClass('letter');
					$('#unreadConut').text(result.desc);
				}else{
					$('#unreadConut').hide();
				}
			}else if(result.code=='4000'){
                //location.href = loginUrl;
                /*
                 * jingpinghong@creditease.cn
                 * 2017-02-16
                 * */
                handleLoginTimeout();
            }
		},
		error:function(e) {
			console.log(e);
		}
	});

    //判断实名认证连接跳转
    $.ajax({
        type: 'POST',
        url: host + 'baseuser/getUserStatus.htm',
        data:token_client_data,
        dataType: 'JSON',
        success: function (data) {
        	//如果已经实名认证，调到结果页
        	if(data.data.userCheckStatus && data.data.userCheckStatus!=0){
                //未实名认证的时候,绑卡需要先实名---jingpinghong@creditease.cn  2017-0114
                $("#add-bank").attr('onclick','location.href="/page/bankcardcenter/card-list.html"');
        		$('#certification').attr('onclick','window.location.href="/page/realname/result.html"');
        	} else{
        		$('#certification').attr('onclick','window.location.href="/page/realname/auth.html"');
        		$('#add-bank').attr('onclick','window.location.href="/page/realname/auth.html"');
        	}
		}
    });

    //判断合格投资人认证跳转
    /*$.ajax({
    	url: host + 'user/auth/investor.htm',
    	dataType: 'JSON',
    	type: 'POST',
    	data:token_client_data,
    	success: function (result) {
    		//如果已认证跳转状态页
    		if(result.code == '0000'){
    			if(result.data.investorInfo.status !== ''){
    				$('#investor').attr('onclick','window.location.href="/page/investor/result.html"');
    			}else{
    				$('#investor').attr('onclick','window.location.href="/page/investor/identification.html"');
    			}
    		}else if (result.code == '9999') {
    			//未实名跳转引导实名页
    			if(result.data.url.indexOf('realName') > 0){
    				$('#investor').attr('onclick','window.location.href="/page/realname/auth.html"');
    			}else if(result.data.url.indexOf('investor') > 0){
    				$('#investor').attr('onclick','window.location.href="/page/investor/identification.html"');
    			}
    		}else if(result.code == '4000'){
                location.href = loginUrl;
            }
    	}
    });*/

    $.ajax({
        url: host + 'baseuser/getUserStatus.htm',
        dataType: 'JSON',
        type: 'POST',
        data:token_client_data,
        success: function (result) {
            //如果已认证跳转状态页
            if(result.code == '0000'){
                if(result.data.userCheckStatus == '0'){
                    checkToInvest('/page/realname/auth.html');
                    // $('#investor').attr('onclick','window.location.href="/page/realname/auth.html"');
                }else if(result.data.investorStatus != '0'){
                    checkToInvest('/page/investor/result.html');
                    // $('#investor').attr('onclick','window.location.href="/page/investor/result.html"');
                }else if(result.data.investorStatus == '0'){
                    checkToInvest('/page/investor/identification.html');
                    // $('#investor').attr('onclick','window.location.href="/page/investor/identification.html"');
                }
            }else if(result.code == '4000'){
                //location.href = loginUrl;
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

    /**
     * 2017-02-24 jihong.zhang@creditease.cn
     * 判断用户是否可以进行投资人认证
     *
    */
    function checkToInvest (linkUrl) {
        var getUserInfoAjax = $.ajax({
            type: 'POST',
            url: host + 'user/getUserInfo.htm',
            data: token_client_data,
            dataType: 'JSON'
        });

        getUserInfoAjax.done(function (data) {
            if (data.code === '0000') {
                if (data.data.certificateFlag === 1) {
                    $('#investor').on('click', function () {
                        var ageLimitAlert = new SmartAlert({
                            title: '年龄超限',
                            content: '<i class="ae-icon ae-icon-attention alert-notice-attention"></i><div class="content-txt-wrapper"><span class="content-txt">'+ data.data.denyMsg +'</span></div>',
                            type: 'confirm',
                            okText: '我知道了',
                            maskClosable: false,
                        });
                        ageLimitAlert.open();
                    })
                } else {
                    $('#investor').on('click', function () {
                        window.location.href= linkUrl;
                    })
                }
            }
        })
    }

    //查询当前用户信息
    $.ajax({
        url: host + "/user/auth/selectShowName.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                if (data.data.type == '1') {
                    $('#uName').html(data.data.name);
                } else if (data.data.type == '2') {
                    $('#uName').html(data.data.name);
                } else if (data.data.type == '3') {
                    $('#uName').html(data.data.name);
                }
                if (data.data.headphoto != '' && data.data.headphoto != null) {
                    $("#avatar-img").attr("src", staticUrl + data.data.headphoto);
                }
            }
        }
    });

    /*// 设定是否已经实名认证的样式
    $.ajax({
        url: host + "/baseuser/getUserStatus.htm",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.data.userCheckStatus == '2') {
                $('#cIcon').addClass('bar-ant-cert');
                $('#cIconI').addClass('ae-icon ae-icon-cert-square bar-ant-icon ant-cert');
            } else {
                $('#cIcon').addClass('bar-ant-fund');
                $('#cIconI').addClass('ae-icon ae-icon-cert-square bar-ant-icon');
                $('#cIconII').addClass('ae-icon ae-icon-attention bar-ant-dot');
            }
        }
    });

    // 设定是否已经合格投资人认证的样式
    $.ajax({
        url: host + "/baseuser/getUserStatus.htm",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.data.investorStatus == '2' || data.data.investorStatus == '2' || data.data.investorStatus == '4') {
                $('#iIcon').addClass('bar-ant-cert');
                $('#iIconI').addClass('ae-icon ae-icon-cert-heart bar-ant-icon ant-cert');
            } else {
                $('#iIcon').addClass('bar-ant-fund');
                $('#iIconI').addClass('ae-icon ae-icon-cert-heart bar-ant-icon');
                $('#iIconII').addClass('ae-icon ae-icon-attention bar-ant-dot');
            }
        }
    });*/
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