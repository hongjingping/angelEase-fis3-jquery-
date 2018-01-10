(function () {

	var FindPass = {
		init: function () {
			this.renderCommonTitle();
		},

		renderCommonTitle: function () {
			$('#cmn-header').text('找回密码');
		}
	};

	FindPass.init();

	// 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;

	// 页面初期化获取图形验证码
    $('#imgId1').attr('src', host + 'user/picCode.htm?visitiToken='+getVisitiToken());

    // 找回密码find-password-one（更换银行卡copy代码 ）
    $('#nextBtn0').on('click', function () {
        if ($('input[name="for_login_userphone"]').val() == '' || $('input[name="for_login_userphone"]').val() == undefined) {
            showError('请输入正确的手机号码');
            return false;
        }
        if ($('input[name="for_login_code"]').val() == '' || $('input[name="for_login_code"]').val() == undefined) {
            showError('请填写正确验证码信息');
            return false;
        }
        checkUserAndPicCode();
    })

    //  更新密码
    $('#nextBtn2').on('click', function () {

        if ($('input[name="for_login_userphone"]').val() == '' || $('input[name="for_login_userphone"]').val() == undefined || $('input[name="for_login_pwd"]').val() == '' || $('input[name="for_login_pwd"]').val() == undefined) {
            showError('请填写正确信息');
            return false;
        }

		url = host + 'user/updateUserPwd.htm';
        var msgCode = storage.get('msgcode')
        data = 'mobile=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&userPassword=' + $.base64.encode($('input[name="for_login_pwd"]').val());
        data += '&clientType=pc&token=' + getToken();
        data += '&msgCode=' + msgCode;
	    $.ajax({
	        type: 'POST',
	        data: data,
	        url: url,
	        dataType: 'JSON',
	        success: function(data) {
	            if (data.code == '0000') {
					window.location.href = baseUrl + 'findpass/last.html';
	            }else {
	            	showError(data.desc);
	            }
	        },
	        error: function(e) {
	        }
	    });
    })

    // 验证手机号和图形验证码
	function checkUserAndPicCode() {

		url = host + 'user/toUpdatePwdByPicCode.htm';
		data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&picCode=' + $.base64.encode($('input[name="picCode"]').val())+'&visitiToken='+getVisitiToken();
		data += '&clientType=pc&token=' + getToken();
	    $.ajax({
	        type: 'POST',
	        data: data,
	        url: url,
	        dataType: 'JSON',
	        success: function(data) {
	            if (data.code == '0000') {
	                if (data.data.userName != undefined && data.data.userName != '') {
	                    checkUserAndCode();
	                } else {
	                	$('#error0').hide();
	                    showError(data.desc);
	                }
	            }
	        },
	        error: function(e) {
	        }
	    });

	}

    // 验证手机号和验证码
	function checkUserAndCode() {
	    url = host + 'user/toUpdatePwdByCode.htm';
	    data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&code=' + $.base64.encode($('input[name="for_login_code"]').val());
	    data += '&clientType=pc&token=' + getToken();
		$.ajax({
		    type: 'POST',
		    data: data,
		    url: url,
		    dataType: 'JSON',
		    success: function(data) {
		        if (data.code == '0000') {
                    var msgcode = $.base64.encode($('input[name="for_login_code"]').val());
                    storage.set('msgcode', msgcode);
		            window.location.href = baseUrl + 'findpass/next.html';
		        } else if (data.code == '0101') {
                    showError(data.desc);
                } else{
		        	showError('验证码错误');
		        }
		    },
		    error: function(e) {
		    }
		});
	}

	// 发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendCode3').on("click", sendCode);
            $('#sendCode3').html("重新发送验证码");
        }
        else {
            curCount--;
            if (curCount < 10) {
                $('#sendCode3').html('0' + curCount + " 秒后重新获得");
            } else {
                $('#sendCode3').html(curCount + " 秒后重新获得");
            }
        }
    }

	// 发送短信验证码
	function sendCode() {
        var mobile = $('input[name="for_login_userphone"]').val();
        if (mobile == '' || mobile == undefined) {
            mobile = $('input[name="mobile"]').val();
            if (mobile == '' || mobile == undefined){
            	showError('请输入新手机号')
                return false;
            }
        }
        var picCodeBase64 = $.base64.encode($('#picCode').val());

		url = host + 'user/sendValidateCode.htm?type=login&sendType=7864' + '&picCode=' + picCodeBase64 + "&visitiToken="+getVisitiToken();
		data = 'mobile=' + $.base64.encode(mobile);
		data += '&clientType=pc&token=' + getToken();
		$.ajax({
		    type: 'POST',
		    data: data,
		    url: url,
		    dataType: 'JSON',
		    success: function(data) {
		        if (data.code == '0000') {
		        	curCount = count;
                    $('#sendCode3').off('click', sendCode);
                    InterValObj = window.setInterval(countdown, 1000);
                    // 【找回密码】发送短信的时候，无论后台返回什么都不予显示（安全组要求）
                    // 如果发送成功返回code为‘0000’
		            // showSuccess(data.desc);
		        } else {
                    // 【找回密码】发送短信的时候，无论后台返回什么都不予显示（安全组要求）
                    if (data.desc != '') {
                        showError(data.desc);
                    }
		        	// showError(data.desc);
		        }
		    },
		    error: function(e) {
		    }
		});

	}

	// 更换图形验证码
	$('.testZy img').on('click', function () {
	        $(this).attr('src', $(this).attr('src') + '?date=' + new Date());
	})

    $('#sendCode3').on('click', sendCode);
})();
//登录验证手机号
function validatemobile(mobile) {
	$('#error0').hide();
	if(mobile.length==0)
    {
        showError('请输入手机号码');
        return false;
    }
    if(mobile.length!=11)
    {
        showError('请输入有效的手机号码');
        return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!myreg.test(mobile))
    {
        showError('请输入有效的手机号码');
        return false;
    }
}

// 找回密码验证图形验证码是否正确find-password-one
function checkPic2() {
    if ($('input[name="for_login_userphone"]').val() == '' || $('input[name="for_login_userphone"]').val() == undefined) {
        showError('请填写正确手机号');
        $('.mobileCode').hide();
        return;
    }
    if ($('#picCode').val().length != 4) {
    	$('#error0').hide();
        $('.mobileCode').hide();
        return;
    } else {
        $.ajax({
            url: host + 'user/checkPicCode.htm',
            data: 'picCode=' + $.base64.encode($('input[name="picCode"]').val())+'&visitiToken='+getVisitiToken()+'&clientType=pc&token=' + getToken(),
            type: 'post',
            dataType: 'json',
            success: function (data) {
                var mobile1 = $('input[name="mobile"]').val();
                if (data.code == '0000') {
                        var mobile = $('input[name="for_login_userphone"]').val();
                        $.ajax({
                            url: host + 'user/checkMobile.htm',
                            data: 'mobile=' + $.base64.encode(mobile),
                            type: 'post',
                            dataType: 'json',
                            success: function (data) {
                                if (data.code == '0000') {
                                    $('.mobileCode').hide();
                                    if (data.desc != '') {
                                        showError(data.desc);
                                    }
                                } else {
                                    $('.mobileCode').show();
                                }
                            }
                        });
                } else {
                    $('.mobileCode').hide();
                    showError('图形验证码错误');
                }
            }
        });
    }
}

// 登录验证密码，找回密码find-password-two验证密码
function validatepass(pass){
	$('#error0').hide();
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        showError('请输入6位以上数字与字母组合密码');
    }
}

//显示错误信息
function showError(errorDesc){
	$('#error1').text(errorDesc);
	$('#success').hide();
	$('#error0').show();
}
//显示错误信息
function showSuccess(successDesc){
	$('#successMsg').text(successDesc);
	$('#error0').hide();
	$('#success').show();
}