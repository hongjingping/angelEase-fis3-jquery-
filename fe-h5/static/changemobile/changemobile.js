(function () {

	var ChangeMobile = {
		init: function () {
			this.changeMobileHeader();
            // this.sendMsg();
		},

		changeMobileHeader: function () {
			$('.cmn-header-title').text('更换绑定手机号');
		},

        sendMsg: function() {
            $("#sendSmsCode").click(function() {
                ChangeMobile.countSec(60);
            });
        },

        countSec: function(val) {
            if (val <= 0) {
                $("#sendSmsCode").html("发送验证码");
                $("#sendSmsCode").removeAttr("disabled");
                ChangeMobile.sendMsg();
            } else {
                $("#sendSmsCode").unbind("click");

                $("#sendSmsCode").html(val + "s");
                val--;
                setTimeout(function() {
                    ChangeMobile.countSec(val);
                },1000);
            }
        }
	};

	ChangeMobile.init();
	checkUserLogin();


	// 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;

    $.ajax({
        url: host+"user/getUserInfo.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                $("#phone").val(data.data.mobile.substring(0,3)+"****"+data.data.mobile.substring(7));
                $("#mobile").val(data.data.mobile);
            } else {
            	new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        }
    });
    
    //发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendSmsCode').on("click", sendSmsCode);
            $('#sendSmsCode').html("重新发送");
        }
        else {
            curCount--;
            if (curCount < 10) {
                $('#sendSmsCode').html('0' + curCount + " 秒");
            } else {
                $('#sendSmsCode').html(curCount + " 秒");
            }
        }
    };
    
    $('#sendSmsCode').on('click', sendSmsCode);
    
    // 发送短信
    function sendSmsCode() {
    	var mobile = $("input[name='mobile']").val();
        if (mobile == '' || mobile == undefined) {
            if (mobile == '' || mobile == undefined){
            	new SmartToast({
                    content: '请输入新手机号',
                    type: 'warn',
                    duration: 3
                });
                return false;
            }
        }
        var flag = checkPwd();
        if (!flag) {
        	return flag;
        }
        $('#sendSmsCode').off('click', sendSmsCode);
        var url = host + "user/sendValidateCode.htm?type=login&sendType=7866";
        var data = "mobile=" + $.base64.encode(mobile);
        data += "&clientType=wap&token=" + getToken();
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
            	if (data.code == '0000') {
                    curCount = count;
                    InterValObj = window.setInterval(countdown, 1000);
                    new SmartToast({
                        content: data.desc,
                        type: 'success',
                        duration: 3
                    });
            	} else if (data.code == '4000') {
            		location.href = loginUrl;
            		new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
            	}else if (data.code == '9999') {
            		new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
            	}
            }
        });
    };

    //下一步
	$("#nextBtn").on("click", function () {

        if ($("input[name='code']").val() == '') {
            new SmartToast({
                content: '请填写短信验证码',
                type: 'warn',
                duration: 3
                });
            return false;
        }
        var url = host + "user/checkChangeMobile.htm";
        var data = "&userName=" + $.base64.encode($("input[name='mobile']").val()) +  "&code=" + $.base64.encode($("input[name='code']").val())+"&visitiToken="+getVisitiToken();
        data += "&clientType=wap&token=" + getToken();
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
                if (data.code == '0000') {
                    if (data.data == '1'){
                    	window.location.href = baseUrl + "changemobile/changemobile2.html";
                    }else{
                    	window.location.href = baseUrl + "changemobile/changemobile3.html";
                    }
                } else {
                    if (data.desc.indexOf('上一步') >= 0)
                        window.location.href = baseUrl + "changemobile/changemobile.html";
                        new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                        });
                }
            }
        });
    });

})();

// 校验登录密码
function checkPwd() {
	var boo = false;
    var pwd = $("#userPassword").val();
    if (pwd == '') {
    	new SmartToast({
            content: "请输入登录密码",
            type: 'warn',
            duration: 3
            });
        return false;
    }

    $.ajax({
        url: host + "user/checkPwd.htm",
        data: "passwd=" + $.base64.encode(pwd)+"&clientType=wap&token=" + getToken(),
        type: "post",
        dataType: "json",
        async : false,
        success: function (data) {
            if (data.code == "0000") {
            	boo = true;
            }else if (data.code == '4000') {
        		location.href = loginUrl;
        		new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                    });
        	} else {
        		new SmartToast({
                    content: "密码错误",
                    type: 'warn',
                    duration: 3
                    });
            }
        }
    });
    return boo;
}

