/*
 * 登录 重写
 * Date: 2016-8-12
 * 登录、注册验证
 * @登录：验证手机号码是否存在，格式是否正确，手机号码输入3次错误信息，需要输入验证码
 * @注册：图形验证码输入正确后再显示短信验证码选项，若短信验证码输错，则需重新验证图形验证码
 */
(function () {

	var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
	$.ajax({
        type: 'post',
        url: host + 'user/errorCount.htm',
        data: param,
        dataType: 'JSON',
        success: function (data) {
            if (data.code == '0000' && data.desc >= 3) {
            	$("#count").val(data.desc);
				$(".form-box .captcha").show();
				var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
				$("#picImg").attr('src', picUrl);
            }
        }
    });

	//更换图片验证码
    $(".testZy img").on("click", function () {
        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
		$("#picImg").attr('src', picUrl);
    });

	// 登录验证
    function init(boo){
    	var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
    	$.ajax({
            type: 'post',
	        url: host + 'user/errorCount.htm',
	        data: param,
	        dataType: 'JSON',
	        async: boo,
            success: function (data) {
                if (data.code == '0000' && data.desc >= 3) {
                	$("#count").val(data.desc);
					$(".form-box .captcha").show();
					var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
    				$("#picImg").attr('src', picUrl);
                }
            },
	        error: function (error) {
	            // console.log(error);
            }
        });
    }
    var count = 0;
    $("#loginBtn").on("click", function () {
        // $("#error").hide();
        $('#error').css("visibility", "hidden")
        if ($('#userphone').val() == '') {
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入正确的手机号码");
            $("#error").show();
            return false;
        }
        if ( $('#userpwd').val() == '') {
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入登录密码");
            $("#error").show();
            return false;
        }

        var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
    	$.ajax({
            type: 'post',
	        url: host + 'user/errorCount.htm',
	        data: param,
	        dataType: 'JSON',
	        async: false,
            success: function (data) {
            	if (data.code == '0000' && data.desc >= 3) {
            		if ($(".form-box .captcha").css('display')=='none') {
    					var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
        				$("#picImg").attr('src', picUrl);
                    }
                    $(".form-box .captcha").show();
                    $("#count").val(data.desc);
            	}
            }
        });
        //登录提交3次错误信息，显示验证码
        if ($("#count").val() >= 3) {
            if ($('#loginCode').val() == '') {
                $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写验证码");
                $("#error").show();
                return false;
            }
            doLogin('picCode');
        } else {
            doLogin('');
        }
    })

    function doLogin(type) {
	    var data = {'clientType':'pc','userName':$.base64.encode($('#userphone').val()),'passwd':$.base64.encode($('#userpwd').val()),'visitiToken':getVisitiToken()};
	    if (type != '') {
		    data = {
                'clientType':'pc',
                'userName':$.base64.encode($('#userphone').val()),
                'passwd':$.base64.encode($('#userpwd').val()),
                'visitiToken':getVisitiToken(),
                'picCode':$.base64.encode($('#loginCode').val())};
	    }
        $.ajax({
            type: 'post',
	        url: host + 'user/toLogin.htm',
	        data: data,
	        dataType: 'JSON',
            success: function (data) {
                if (data.code == '0000') {
                    setToken(data.desc);
                    if (document.referrer != '' && document.referrer != null) {
                    	if(document.referrer.indexOf("/page/login/login")>-1
                            || document.referrer.indexOf("/page/login/register")>-1
                            || document.referrer.indexOf("/page/modifypass/stepthree")>-1
                            || document.referrer.indexOf("/page/mphone/stepthree")>-1
                            || document.referrer.indexOf("/page/findpass/last")>-1
                            || document.referrer.indexOf("/page/bankcard/last")>-1){
                    		window.location.href = indexUrl;
                    	}else{
                    		window.location.href = document.referrer;
                    	}
                    } else {
                        window.location.href = indexUrl;
                    }
                } else if (data.code === '0025') {
                    var ageLimitAlert = new SmartAlert({
                        title: '',
                        content: '<i class="ae-icon ae-icon-attention alert-notice-attention"></i><div class="content-txt-wrapper"><span class="content-txt">'+ data.data +'</span></div>',
                        type: 'confirm',
                        okText: '确认',
                        maskClosable: false,
                    });
                    ageLimitAlert.open();
                } else {// 用户名或密码错误
                    //1109-jingpinghong

                        if (data.desc.indexOf('验证码') >= 0) {
                            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                            $("#error").show();
                            //0111-及时刷新图形验证码
                            var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                            $("#picImg").attr('src', picUrl);
                        } else {
                            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc).addClass("indicatorCon countError");
                            $("#error").show();
                        }

	                //if (data.desc.indexOf('验证码') >= 0) {
	                //    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
	                //    $("#error").show();
	                //} else {
	                //    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc).addClass("indicatorCon countError");
	                //    $("#error").show();
	                //}
                }
            },
	        error: function (error) {
	            // console.log(error);
            }
        });
	}


    //回车键的时候调用登录按钮
    $('#userpwd').bind('keypress', function(e) {
        if(e.keyCode==13){
            console.log('enter');
            $("#loginBtn").click();
        }
    });


    $('#loginCode').bind('keypress', function(e) {
        if(e.keyCode==13){
            console.log('enter');
            $("#loginBtn").click();
        }
    });

		/*删除手机号*/
		var userPhone = $('#userphone').attr('id');
		var closeUsername = $('#close-username').attr('id');
		deleteBtn(userPhone ,closeUsername);

		/*删除密码*/
		var input = $('#userpwd').attr('id');
		var link = $('#close-pwd').attr('id');
		deleteBtn(input ,link);

})();
