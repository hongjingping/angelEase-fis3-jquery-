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
				new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
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
            	window.location.href = baseUrl+"changemobile/changemobile.html";
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
    	if ($("input[name='mobile']").val() != '' && !(/^1[3|4|5|7|8]\d{9}$/.test($("input[name='mobile']").val()))) {
    		new SmartToast({
                content: "手机号码有误，请重填",
                type: 'warn',
                duration: 3
            });
            return false;
        }
		
        var mobile = $("input[name='phone']").val();
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
    }
 
	//下一步
	$("#nextBtn").on("click", function () {
		if ($("input[name='oldMobile']").val() == '' || $("input[name='mobile']").val() == '') {
			new SmartToast({
                content: "请填写手机号码",
                type: 'warn',
                duration: 3
            });
			return false;
		}
		if ($("input[name='code']").val() == '') {
			new SmartToast({
                content: "请填写短信验证码",
                type: 'warn',
                duration: 3
            });
            return false;
        }
        if ($("input[name='mobile']").val() != '' && !(/^1[3|4|5|7|8]\d{9}$/.test($("input[name='mobile']").val()))) {
        	new SmartToast({
                content: "手机号码有误，请重填",
                type: 'warn',
                duration: 3
            });
            return false;
        }
        if ($("input[name='mobile']").val() == $("input[name='oldMobile']").val()) {
        	new SmartToast({
                content: "换绑手机号不能和已绑手机号相同",
                type: 'warn',
                duration: 3
            });
            return false;
        }
        if ($("input[name='picCode']").val() == '' || $("input[name='code']").val() == '') {
        	new SmartToast({
                content: "请填写验证信息",
                type: 'warn',
                duration: 3
            });
            return false;
        }
        var url = host + "user/changeMobile.htm";
        var data = "picCode=" + $.base64.encode($("input[name='picCode']").val()) + "&mobile=" + $.base64.encode($("input[name='mobile']").val()) + "&userName=" + $.base64.encode($("input[name='mobile']").val()) + "&code=" + $.base64.encode($("input[name='code']").val())+"&visitiToken="+getVisitiToken();
        data += "&clientType=wap&token=" + getToken();
        $.ajax({
            url: url,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            type: "post",
            data: data,
            success: function (data) {
                if (data.code == '0000') {
                	 new SmartToast({
                         content: '更换手机号成功',
                         type: 'success',
                         duration: 3
                     });
                	 location.href = loginUrl;
                } else {
                    if (data.desc.indexOf('上一步') >= 0){
                    	window.location.href = baseUrl+"changemobile/changemobile.html";
                    }
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

function checkPic() {
	$(".error-notice").attr("style","display:none");
	var boo = false;
    var picCode = $("#picCode").val();

    if (picCode == '') {
    	new SmartToast({
            content: "请填写图形验证码",
            type: 'warn',
            duration: 3
        });
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
        		new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
        	} else {
        		new SmartToast({
                    content: "图形验证码错误",
                    type: 'warn',
                    duration: 3
                });
            }
        }
    });
    return boo;
}

function validatemobile3(mobile) {
    if(mobile.length==0) {
    	new SmartToast({
            content: "请输入手机号码",
            type: 'warn',
            duration: 3
        });
        return false;
    }
    
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

    if(!myreg.test(mobile)) {
    	new SmartToast({
            content: "请输入有效的手机号码",
            type: 'warn',
            duration: 3
        });
        return false;
    }

    if ($("input[name='mobile']").val() == $("input[name='oldMobile']").val()) {
    	new SmartToast({
            content: "换绑手机号不能和已绑手机号相同",
            type: 'warn',
            duration: 3
        });
        return false;
    }
    var flag = false;
    var url = host + "user/checkMobile.htm";
    var data = "mobile=" + $.base64.encode($("input[name='mobile']").val())  +"&visitiToken="+getVisitiToken();
    data += "&clientType=wap&token=" + getToken();
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
                new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        }
    });
    return flag;
}

function checkMobile(){
	var boo = false;
    var mobile = $("input[name='mobile']").val();

    if (mobile == '') {
    	new SmartToast({
            content: "请输入手机号码",
            type: 'warn',
            duration: 3
        });
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
        		location.href = loginUrl;
        		new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
        	}else {
        		new SmartToast({
                    content: data.desc,
                    type: 'warn',
                    duration: 3
                });
            }
        }
    });
    return boo;
}
