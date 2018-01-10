(function() {

    var RegisterPro = {
        init: function() {
            this.inputEffect();
            this.sendMsg();
            this.checkBoxInit();
        },

        inputEffect: function() {
            $(".highlight-input").focus(function() {
                $(".icon-item-active").each(function() {
                    $(this).addClass("icon-item");
                    $(this).removeClass("icon-item-active");
                });
                $(this).parent().parent().find(".icon-item").each(function() {
                    $(this).removeClass("icon-item");
                    $(this).addClass("icon-item-active");
                });
            });
        },

        sendMsg: function() {
            $("#snd-vode-btn").click(function() {
                RegisterPro.countSec(60);
            });
        },


        countSec: function(val) {

            if (val <= 0) {
                $("#snd-vode-btn").html("发送验证码");
                $("#snd-vode-btn").removeAttr("disabled");
                RegisterPro.sendMsg();
            } else {
                $("#snd-vode-btn").unbind("click");

                $("#snd-vode-btn").html(val + "s");
                val--;
                setTimeout(function() {
                    RegisterPro.countSec(val);
                }, 1000);
            }

        },

        checkBoxInit: function() {
            $("#i-check-btn").click(function() {
                console.log($(this).hasClass("i-check-unchecked"));
                if ($(this).hasClass("i-check-unchecked")) {
                    $(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");

                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                }

            });
        }

    }

    RegisterPro.init();

    //业务开始

    var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
    $("#picImg").attr('src', picUrl);
    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;
	// 登录验证
    // @params:手机号码格式验证,是否存在
    $("#btnReg").on("click", function () {
    	var flag = checkTelAndPwd();
    	if(!flag){
    		return false;
    	}

        if ($('#userphone').val() == '') {
            new SmartToast({
                content: '请输入手机号码',
                type: 'warn',
                duration: 3
            });
            // showError("请输入正确的手机号码");
            return false;
        }

        if ($('#userpwd').val() == '') {
            new SmartToast({
                content: '请输入登录密码',
                type: 'warn',
            });
            // showError("请输入登录密码");
            return false;
        }else{
            //检验密码-2017-01-11 jingpinghong@creditease.cn
            if(!checkpwdReg($('#userPwd').val())) return false;
        }
        if ($('#picCode').val() == '') {
            new SmartToast({
                content: '请填写图形验证信息',
                type: 'warn',
            });
            // showError("请填写图形验证信息");
            return false;
        }
        var phoneNum = $('#userphone').val();
    	var boo  = checkMobile(phoneNum);
    	if(!boo){
    		$('#userphone').val('');
    		$('#userphone').focus();
    		return false;
    	}
        var hideShow = $('#sms_code_div').css('display');
        if(hideShow == 'none'){
            new SmartToast({
                content: '请填写正确的图形验证码',
                type: 'warn',
            });
            //0111-刷新图形验证码
            var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
            $("#picImg").attr('src', picUrl);
        	// showError("请填写正确的图形验证码");
            return false;
        }
        if ( $('#regCode').val() == '') {
            new SmartToast({
                content: '请输入正确短信验证码信息',
                type: 'warn',
            });
            // showError("请输入正确短信验证码信息");
            return false;
        }

        if ($("#i-check-btn").attr("class")=='i-check-unchecked') {
            new SmartToast({
                content: '请您务必阅读并同意《AngelEase用户服务协议》',
                type: 'warn',
            });
        	// showError("请您务必阅读并同意《AngelEase用户服务协议》");
            return;
        }
        doRegister();
    });

    // 图形码切换
    $(".snd-msg-button1").on("click", function () {
        $("#picImg").attr('src', picUrl + '&rand='+ Math.random());
    });

    function doRegister() {
        var url = host + "user/toRegister.htm";
        var param = "userName=" + $.base64.encode($("#userphone").val()) + "&passwd=" + $.base64.encode($('#userPwd').val()) +
        			"&code=" + $.base64.encode($('#regCode').val()) + "&visitiToken="+getVisitiToken()+
        			"&clientType=wap";
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: param,
            success: function (data) {
                if (data.code == '0000') {
                    setToken(data.desc);
                    showSuccess("注册成功");
                    window.location.href = "/page/home/home.html";
                } else {
                    $("#count").val(parseInt($("#count").val()) + 1);
                    if (data.desc.indexOf('验证码') >= 0) {
                        showError(data.desc);
                    } else {
                        showError(data.desc);
                    }
                }
            }
        });
    }

 // 发短信倒计时
    function countdown() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);
            $('#sendCode').on("click", sendCode);
            $('#sendCode').html("重新发送验证码");
        }
        else {
            curCount--;
            if (curCount < 10) {
                $('#sendCode').html('0' + curCount + " 秒后重新获得");
            } else {
                $('#sendCode').html(curCount + " 秒后重新获得");
            }
        }
    }
    $('#sendCode').on('click', sendCode);

    // 发送短信
    function sendCode() {
    	var phoneNum = $('#userphone').val();
        var emailAddress = phoneNum.substring(phoneNum.indexOf("@") + 1);
        var picCodeBase64 = $.base64.encode($('#picCode').val());
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
                	$('#sendCode').off('click', sendCode);
                	curCount = count;
                    InterValObj = window.setInterval(countdown, 1000);
                    if (mobile == '') {
                        $("#sms_code_div").show();
                    } else {
                        checkMobile(phoneNum);
                    }
                } else {
                    if (mobile != '') {
                        $("#sms_code_div").hide();
                        showError("图形验证码错误");
                        //0111-及时刷新图形验证码
                        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                        $("#picImg").attr('src', picUrl);

                    }
                    // 【注册】发送短信的时候，无论后台返回什么都不予显示（安全组要求）
                    if (data.desc != '') {
                    	showError(data.desc);
                    }
                }
            }
        });
    }


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
                boo = true
            } else {
            	showError(data.desc);
            }
        }
    });
    return boo;
}

//验证密码
function checkpwdReg(pass){
    if(pass == ''){
    	showError("请填写密码");
        return false;
    }
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        showError("密码不是6-18位数字与字母组合，请重新输入");
        $("#userPwd").val("");
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
        showError("请填写正确手机号");
        $("#sms_code_div").hide();
        return false;
    }
    if (picCode.length != 4) {
//      showError("请填写正确图形验证码");
//      $("#sms_code_div").hide();
      return false;
  }
//    if (picCode == '') {
//        showError("请填写图形验证码");
//        $("#sms_code_div").hide();
//        return false;
//    }

    else {
        $.ajax({
            url: host + "user/checkPicCode.htm",
            data: "picCode=" + $.base64.encode(picCode)+"&visitiToken="+getVisitiToken(),
            type: "post",
            dataType: "json",
            async : false,
            success: function (data) {
                if (data.code == "0000") {
                	$("#sms_code_div").show();
                	boo = true;
                } else {
                    $("#sms_code_div").hide();
                    showError("图形验证码错误");
                    //0111-及时刷新图形验证码
                    var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                    $("#picImg").attr('src', picUrl);
                }
            }
        });
    }
    return boo;
}
function checkTelAndPwd(){
	var flag = true;
	if ($('#userphone').val() == '' && $('#userpwd').val() == '') {
        new SmartToast({
            content: '请填写电话与密码',
            type: 'warn',
            duration: 3
        });
        flag =  false;
    }
	return flag;
}
//从上至下检查
function checkAll(){
	var phoneNum = $('#userphone').val();
	var boo  = checkMobile(phoneNum);
	if(!boo){
		$("#sms_code_div").hide();
		return ;
	}
	var userpwd = $('#userpwd').val();
	boo = checkpwdReg(userpwd);
	if(!boo){
		$("#sms_code_div").hide();
		return ;
	}
	boo = checkPic();
	if(!boo){
		$("#sms_code_div").hide();
		return ;
	}
	$("#sms_code_div").show();
}

function showError(desc){
	/*$(".modify-suc-text").html(desc);
	$("#toastBox").show();
	setTimeout('javascript:$("#toastBox").hide()',1000);*/
	new SmartToast({
		content:desc,
		type:'warn',
		duration:3
	});
}

function showSuccess(successDesc){

	new SmartToast({
		content:successDesc,
		type:'success',
		duration:3
	});
}

//弹窗关闭
$("#toastBox").click(function() {
    $('#toastBox').hide();
});



/*删除手机号*/
var userPhone = $('#userphone').attr('id');
var delPhone = $('#delPhone').attr('id');
deleteBtn(userPhone ,delPhone);


/*删除密码*/
var userPwd = $('#userPwd').attr('id');
var closePwd = $('#closePwd').attr('id');
deleteBtn(userPwd ,closePwd);

//删除图形按钮
var picCode = $('#picCode').attr('id');
var closeImg = $('#closeImg').attr('id');
deleteBtn(picCode ,closeImg);


//删除验证码
var regCode = $('#regCode').attr('id');
var delCode = $('#delCode').attr('id');
deleteBtn(regCode ,delCode);
