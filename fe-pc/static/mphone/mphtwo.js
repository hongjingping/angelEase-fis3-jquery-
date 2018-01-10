(function(){
	var ModifyPhtwo = {
	        init: function () {
	            this.renderCommonTitle();
	        },

	        renderCommonTitle: function () {
	            $('#cmn-header').text('修改手机号码');
	        }
	    };

	ModifyPhtwo.init();
	checkUserLogin();

    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;

	//加载图片验证码
	$("#imgCode").attr('src',host+"user/picCode.htm?visitiToken="+getVisitiToken());
	//更换图片验证码
	$("#imgCode").on("click", function () {
		$(this).attr("src", $(this).attr("src") + "?date=" + new Date());
	});
	$.ajax({
		url: host+"user/getUserInfo.htm",
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		dataType: "json",
		type: "post",
		data: token_client_data,
		success: function (data) {
			if (data.code == '0000') {
				$("#oldMobile").val(data.data.mobile);
			} else {
				$(".error-notice").attr("style","display:block");
				$("#error-txt-second").html(data.desc)
			}

		}
	});
	$.ajax({
        url: host+"user/checkChangeMobileFinal.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: token_client_data,
        success: function (data) {
            if (data.code != '0000') {
            	window.location.href = baseUrl+"mphone/stepone.html";
            }
        }
    });
	// 发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendSmsCode').on("click", sendSmsCode);
            $('#sendSmsCode').html("重新发送验证码");
        }
        else {
            curCount--;
            if (curCount < 10) {
                $('#sendSmsCode').html('0' + curCount + " 秒后重新获得");
            } else {
                $('#sendSmsCode').html(curCount + " 秒后重新获得");
            }
        }
    }
    $('#sendSmsCode').on('click', sendSmsCode);
    // 发送短信
    function sendSmsCode() {
    	if ($("input[name='mobile']").val() != '' && !(/^1[3|4|5|7|8]\d{9}$/.test($("input[name='mobile']").val()))) {
        	$(".error-notice").attr("style","display:block");
            $("#error-txt-second").html("手机号码有误，请重填");
            return false;
        }
		var mobile = $("input[name='phone']").val();
        if (mobile == '' || mobile == undefined) {
            mobile = $("input[name='mobile']").val();
            if (mobile == '' || mobile == undefined){
            	$(".error-notice").attr("style","display:block");
                $("#error-txt-second").html("请输入新手机号")
                return false;
            }
        }
        var flag = checkPic();
        if (!flag) {
        	return flag;
        }
        var boo = checkMobile();
        if(!boo){
        	return boo;
        }
        $('#sendSmsCode').off('click', sendSmsCode);
        var url = host + "user/sendValidateCode.htm?type=login&sendType=7866";
        var data = "mobile=" + $.base64.encode(mobile);
        data += "&clientType=pc&token=" + getToken();
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
                    $(".success-notice").attr("style","display:block");
                	$("#success-txt-second").html(data.desc);
            	} else if (data.code == '4000') {
            		location.href = loginUrl;
            		$(".error-notice").attr("style","display:block");
            		$("#error-txt-second").html(data.desc);
            	}else if (data.code == '9999') {
            		$(".error-notice").attr("style","display:block");
            		$("#error-txt-second").html(data.desc);
            	}
            }
        });
    }

	//下一步
	$("#nextBtn").on("click", function () {
		if ($("input[name='oldMobile']").val() == '' || $("input[name='mobile']").val() == '') {
			$(".error-notice").attr("style","display:block");
			$("#error-txt-second").html("请填写手机号码");
			return false;
		}
		if ($("input[name='code']").val() == '') {
			$(".error-notice").attr("style","display:block");
            $("#error-txt-second").html("请填写短信验证码");
            return false;
        }
        if ($("input[name='mobile']").val() != '' && !(/^1[3|4|5|7|8]\d{9}$/.test($("input[name='mobile']").val()))) {
        	$(".error-notice").attr("style","display:block");
            $("#error-txt-second").html("手机号码有误，请重填");
            return false;
        }
        if ($("input[name='mobile']").val() == $("input[name='oldMobile']").val()) {
        	$(".error-notice").attr("style","display:block");
            $("#error-txt-second").html("换绑手机号不能和已绑手机号相同");
            return false;
        }
        if ($("input[name='picCode']").val() == '' || $("input[name='code']").val() == '') {
        	$(".error-notice").attr("style","display:block");
            $("#error-txt-second").html("请填写验证信息");
            return false;
        }
        var url = host + "user/changeMobile.htm";
        var data = "picCode=" + $.base64.encode($("input[name='picCode']").val()) + "&mobile=" + $.base64.encode($("input[name='mobile']").val()) + "&userName=" + $.base64.encode($("input[name='mobile']").val()) + "&code=" + $.base64.encode($("input[name='code']").val())+"&visitiToken="+getVisitiToken();
        data += "&clientType=pc&token=" + getToken();
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
                if (data.code == '0000') {
                    window.location.href = baseUrl+"mphone/stepthree.html";
                } else {
                    if (data.desc.indexOf('上一步') >= 0)
                        window.location.href = baseUrl+"mphone/stepone.html";
                    $(".error-notice").attr("style","display:block");
                    $("#error-txt-second").html(data.desc)
                }
            }
        });
    });
})();
function checkPic() {
	$(".error-notice").attr("style","display:none");
	var boo = false;
    var picCode = $("#picCode").val();
    if (picCode == '') {
    	$(".error-notice").attr("style","display:block");
        $("#error-txt-second").html("请填写图形验证码");
        return false;
    }
    $.ajax({
        url: host + "user/checkPicCode.htm",
        data: "picCode=" + $.base64.encode(picCode)+"&visitiToken="+getVisitiToken(),
        type: "post",
        dataType: "json",
        async : false,
        success: function (data) {
            if (data.code == "0000") {
            	boo = true;
            } else if (data.code == '4000') {
        		// location.href = loginUrl;
                handleLoginTimeout();
        		$(".error-notice").attr("style","display:block");
        		$("#error-txt-second").html(data.desc);
        	}else {
            	$(".error-notice").attr("style","display:block");
    	        $("#error-txt-second").html("图形验证码错误");
            }
        }
    });
    return boo;
}
function validatemobile3(mobile)
{
	$(".error-notice").attr("style","display:none");
//    $("#error-txt-second").html("");
    if(mobile.length==0)
    {
    	$(".error-notice").attr("style","display:block");
        $("#error-txt-second").html("请输入手机号码");
        return false;
    }


    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!myreg.test(mobile))
    {
    	$(".error-notice").attr("style","display:block");
        $("#error-txt-second").html("请输入有效的手机号码");
        return false;
    }
    if ($("input[name='mobile']").val() == $("input[name='oldMobile']").val()) {
    	$(".error-notice").attr("style","display:block");
        $("#error-txt-second").html("换绑手机号不能和已绑手机号相同");
        return false;
    }
    var flag = false;
    var url = host + "user/checkMobile.htm";
    var data = "mobile=" + $.base64.encode($("input[name='mobile']").val())+"&visitiToken="+getVisitiToken();
    data += "&clientType=pc&token=" + getToken();
    $.ajax({
        url: url,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: data,
        async : false,
        success: function (data) {
            if (data.code == '0000') {
                flag = true;
            } else {
                $(".error-notice").attr("style","display:block");
                $("#error-txt-second").html(data.desc);
            }
        }
    });
    return flag;
}
function checkMobile(){
	$(".error-notice").attr("style","display:none");
	var boo = false;
    var mobile = $("input[name='mobile']").val();
    if (mobile == '') {
    	$(".error-notice").attr("style","display:block");
        $("#error-txt-second").html("请输入手机号码");
        return false;
    }
    $.ajax({
        url: host + "user/checkMobile.htm",
        data: "mobile=" + $.base64.encode(mobile)+"&visitiToken="+getVisitiToken(),
        type: "post",
        dataType: "json",
        async : false,
        success: function (data) {
            if (data.code == "0000") {
            	boo = true;
            } else if (data.code == '4000') {
        		// location.href = loginUrl;
                handleLoginTimeout();
        	}else {
            	$(".error-notice").attr("style","display:block");
    	        $("#error-txt-second").html(data.desc);
            }
        }
    });
    return boo;
}