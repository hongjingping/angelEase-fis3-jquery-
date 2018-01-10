(function () {

    var ModifyPhone = {
        init: function () {
            this.renderCommonTitle();
        },

        renderCommonTitle: function () {
            $('#cmn-header').text('修改手机号码');
        }
    };

    ModifyPhone.init();
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
                $("#phone").text(data.data.mobile.substring(0,3)+"****"+data.data.mobile.substring(7));
                $("#mobile").val(data.data.mobile);
            } else {
            	$(".error-notice").attr("style","display:block");
                $("#error-txt-first").html(data.desc)
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
    	var mobile = $("input[name='phone']").val();
        if (mobile == '' || mobile == undefined) {
            mobile = $("input[name='mobile']").val();
            if (mobile == '' || mobile == undefined){
            	$(".error-notice").attr("style","display:block");
                $("#error-txt-first").html("请输入新手机号")
                return false;
            }
        }
        var flag = checkPic();
        if (!flag) {
        	return flag;
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
                	$("#success-txt-first").html(data.desc);
            	} else if (data.code == '4000') {
            		// location.href = loginUrl;
                    handleLoginTimeout();
            		$(".error-notice").attr("style","display:block");
            		$("#error-txt-first").html(data.desc);
            	}else if (data.code == '9999') {
            		$(".error-notice").attr("style","display:block");
            		$("#error-txt-first").html(data.desc);
            	}
            }
        });
    }
	//下一步
	$("#nextBtn").on("click", function () {

        if ($("input[name='code']").val() == '') {
        	$(".error-notice").attr("style","display:block");
            $("#error-txt-first").html("请填写短信验证码");
            return false;
        }
        var url = host + "user/checkChangeMobile.htm";
        var data = "picCode=" + $.base64.encode($("input[name='picCode']").val())+ "&userName=" + $.base64.encode($("input[name='mobile']").val()) +  "&code=" + $.base64.encode($("input[name='code']").val())+"&visitiToken="+getVisitiToken();
        data += "&clientType=pc&token=" + getToken();
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
                if (data.code == '0000') {
                    if (data.data == '1'){
                    	window.location.href = baseUrl + "mphone/steprealname.html";
                    }else{
                    	window.location.href = baseUrl + "mphone/steptwo.html";
                    }
                } else {
                    if (data.desc.indexOf('上一步') >= 0)
                        window.location.href = baseUrl + "mphone/stepone.html";
                    $(".error-notice").attr("style","display:block");
                    $("#error-txt-first").html(data.desc)
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
        $("#error-txt-first").html("请填写图形验证码");
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
            }else if (data.code == '4000') {
        		location.href = loginUrl;
        		$(".error-notice").attr("style","display:block");
        		$("#error-txt-first").html(data.desc);
        	} else {
            	$(".error-notice").attr("style","display:block");
    	        $("#error-txt-first").html("图形验证码错误");
            }
        }
    });
    return boo;
}