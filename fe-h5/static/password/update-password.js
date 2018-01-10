(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
//			this.sendMsg();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('修改密码');
		},

        sendMsg: function() {
            $("#sendSmsCode").click(function() {
                UpdatePAssword.countSec(60);
            });
        },


        countSec: function(val) {

            if (val <= 0) {
                $("#sendSmsCode").html("发送验证码");
                $("#sendSmsCode").removeAttr("disabled");
                UpdatePAssword.sendMsg();
            } else {
                $("#sendSmsCode").unbind("click");

                $("#sendSmsCode").html(val + "s");
                val--;
                setTimeout(function() {
                    UpdatePAssword.countSec(val);
                },1000);
            }

        }
	};

	UpdatePAssword.init();
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
                $("#mobile").text(data.data.mobile.substring(0,3)+"****"+data.data.mobile.substring(7));
                $("#for_login_userphone").val(data.data.mobile);
            } else {
            	new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        }
    });
	// 发短信倒计时
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
    }

    $('#sendSmsCode').on('click', sendSmsCode);
	// 发送短信
    function sendSmsCode() {
    	var mobile = $("input[name='for_login_userphone']").val();
        if (mobile == '' || mobile == undefined) {
            mobile = $("input[name='mobile']").val();
            if (mobile == '' || mobile == undefined){
            	new SmartToast({
                    content: "请输入新手机号",
                    type: 'warn',
                    duration: 3
                });
                return false;
            }
        }

        $('#sendSmsCode').off('click', sendSmsCode);
        var url = host + "user/sendValidateCode.htm?type=login&sendType=7865";
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

		if ($('input[name="for_login_userphone"]').val() == '' || $('input[name="for_login_userphone"]').val() == undefined || $('input[name="for_login_code"]').val() == '' || $('input[name="for_login_code"]').val() == undefined) {
			new SmartToast({
                content: '请填写验证信息',
                type: 'warn',
                duration: 3
            });
            return false;
        }
		var url = host + 'user/updateNormalPwdByCode.htm';
        var data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&code=' + $.base64.encode($('input[name="for_login_code"]').val())+"&visitiToken="+getVisitiToken();
        data += '&clientType=wap&token=' + getToken();
        $.ajax({
            url: url,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data) {
                if (data.code == '0000' && data.data.userName != undefined && data.data.userName != '') {
                	window.location.href = baseUrl + 'password/update-password-two.html';
                }else{
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
