/*
 * 注册 重写
 * Date: 2016-8-12
 * 登录、注册验证
 * @登录：验证手机号码是否存在，格式是否正确，手机号码输入3次错误信息，需要输入验证码
 * @注册：图形验证码输入正确后再显示短信验证码选项，若短信验证码输错，则需重新验证图形验证码
 */
(function () {
    var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
    $("#picImg").attr('src', picUrl);
    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;
	// 登录验证
    // @params:手机号码格式验证,是否存在
    $("#btnReg").on("click", function () {
        $("#error").css("visibility", "hidden");
        if ($('#userphone').val() == '') {
            //刷新验证码
            $('.img-code').click();
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入正确的手机号码");
            return false;
        }
        if ($('#userpwd').val() == '') {
            //刷新验证码
            $('.img-code').click();
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入登录密码");
            return false;
        }
        if ($('#picCode').val() == '') {
            //刷新验证码
            $('.img-code').click();
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写图形验证信息");
            return false;
        }
        var boo = checkPic();
    	if(!boo){
    		$(".mobileCode").hide();
    		return ;
    	}
        if ( $('#regCode').val() == '') {
            //刷新验证码
            $('.img-code').click();
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入正确短信验证码信息");
            return false;
        }
        if ($("input[name='agreement']").is(':checked') != true) {
            //刷新验证码
            $('.img-code').click();
        	$("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>请您务必阅读并同意《AngelEase用户服务协议》");
            return;
        }
        doRegister();
    });

    // 图形码切换
    $(".img-code").on("click", function () {
        $("#picImg").attr('src', picUrl + '&rand='+ Math.random());
    });

    function doRegister() {
        var url = host + "user/toRegister.htm";
        var param = "userName=" + $.base64.encode($("#userphone").val()) + "&passwd=" + $.base64.encode($('#userpwd').val()) +
        			"&code=" + $.base64.encode($('#regCode').val()) + "&visitiToken="+getVisitiToken()+
        			"&clientType=pc";
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: param,
            success: function (data) {
                if (data.code == '0000') {
                    setToken(data.desc);
                    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-success success-notice'></i>"+"注册成功");
                    window.location.href = "register-suc";
                } else {
                    $("#count").val(parseInt($("#count").val()) + 1);
                    //刷新验证码
                    $('.img-code').click();
                    if (data.desc.indexOf('验证码') >= 0) {
                        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                    } else {
                        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                    }
                }
            }
        });
    }
 // 发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendCode').html("重新发送验证码").show();
            $('#showCount').hide();
        }
        else {
            curCount--;
            if (curCount < 10) {
                $('#showCount').html('0' + curCount + " 秒重新获取");
            } else {
                $('#showCount').html(curCount + " 秒重新获取");
            }
        }
    }
    $('#sendCode').on('click', sendCode);
    // 发送短信
    function sendCode() {
    	var phoneNum = $('#userphone').val();
        var picCodeBase64 = $.base64.encode($('#picCode').val());
        var emailAddress = phoneNum.substring(phoneNum.indexOf("@") + 1);
        $.ajax({
            url: host + "user/sendValidateCode.htm",
            data: 'type=reg&sendType=7863&mobile=' + $.base64.encode(phoneNum) + '&picCode=' + picCodeBase64 + "&visitiToken="+getVisitiToken(),
            type: "post",
            dataType: "json",
            success: function (data) {
                var mobile = $("#regCode").val();
                //【注册】发送短信的时候，无论后台返回什么都不予显示（安全组要求）
                // 如果发送成功返回code为‘0000’
                if (data.code == "0000") {
                	curCount = count;
                    $('#sendCode').hide();
                    $('#showCount').html(curCount + " 秒重新获取").show();
                    InterValObj = window.setInterval(countdown, 1000);
                    if (mobile == '') {
                        $(".mobileCode").show();
                        $("#error").css("visibility", "hidden");
                    } else {
                        checkMobile(phoneNum);
                    }
                    // $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-success success-notice'></i>"+data.desc);
                } else {
                    //刷新验证码
                    $('.img-code').click();
                    if (mobile != '') {
                        $(".mobileCode").hide();
                        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"图形验证码错误");
                    }
                    // 【注册】发送短信的时候，无论后台返回什么都不予显示（安全组要求）
                	// $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                    if (data.desc != '') {
                        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                        // showError(data.desc);
                    }
                }
            }
        });
    }

    /*删除手机号*/
    var userPhone = $('#userphone').attr('id');
    var closeUsername = $('#close-username').attr('id');
    deleteBtn(userPhone ,closeUsername);

    /*删除密码*/
    var input = $('#userpwd').attr('id');
    var link = $('#close-pwd').attr('id');
    deleteBtn(input ,link);


})();


function checkMobile(phoneNum) {
	var boo = false;
    $.ajax({
        url: host + "user/checkMobile.htm",
        data: "mobile=" + $.base64.encode(phoneNum),
        type: "post",
        dataType: "json",
        async : false,
        success: function (data) {
            if (data.code == "0000") {
                $("#error").css("visibility", "hidden");
                boo = true
            } else {
            	$("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
            }
        }
    });
    return boo;
}

//验证密码
function checkpwdReg(pass){
    $("#error").css("visibility", "hidden");
    if(pass == ''){
    	$("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写密码");
        return false;
    }
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入6位以上数字与字母组合密码");
        $("#userpwd").val("");
        return false;
    }else{
    	return true;
    }
}

function checkPic() {
	var boo = false;
    var phoneNum = $('#userphone').val();
    var picCode = $("#picCode").val();
    if (phoneNum == '') {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写正确手机号");
        $(".mobileCode").hide();
        return false;
    }
    if (picCode == '') {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写图形验证码");
        $(".mobileCode").hide();
        return false;
    }
    if (picCode.length != 4) {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写正确图形验证码");
        $(".mobileCode").hide();
        return false;
    } else {
        $.ajax({
            url: host + "user/checkPicCode.htm",
            data: "picCode=" + $.base64.encode(picCode)+"&visitiToken="+getVisitiToken(),
            type: "post",
            dataType: "json",
            async : false,
            success: function (data) {
                if (data.code == "0000") {
                	boo = true;
                } else {
                    $(".mobileCode").hide();
                    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"图形验证码错误");
                    //2017-01-11 输错就刷新页面
                    var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                    $("#picImg").attr('src', picUrl);
                }
            }
        });
    }
    return boo;
}
//验证手机号
function checkPhoneNum(){
	var phoneNum = $('#userphone').val();
	var boo  = checkMobile(phoneNum);
	if(!boo){
		$(".mobileCode").hide();
		return ;
	}
	$("#error").css("visibility", "hidden");
}
//验证密码
function checkUserpwd(){
	var userpwd = $('#userpwd').val();
	var boo = checkpwdReg(userpwd);
	if(!boo){
		$(".mobileCode").hide();
		return ;
	}
	$("#error").css("visibility", "hidden");
}
//验证图形验证码
function checkMobileCode(){
	var boo = checkPic();
        if(!boo){
		$(".mobileCode").hide();
		return ;
	}
	$("#error").css("visibility", "hidden");
	$(".mobileCode").show();

}
