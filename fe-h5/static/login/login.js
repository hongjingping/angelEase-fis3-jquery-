(function () {

	var LoginPro = {
		init: function () {
			this.inputEffect();
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
		}
	}

	LoginPro.init();

	//业务开始

	//初始化图片验证码
	var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
	$.ajax({
        type: 'post',
        url: host + 'user/errorCount.htm',
        data: param,
        dataType: 'JSON',
        success: function (data) {
            if (data.code == '0000' && data.desc >= 3) {
            	$("#count").val(data.desc);
        		$("#pic_code_div").show();
    			var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
				$("#picImg").attr('src', picUrl);
            }
        }
    });
	//更换图片验证码
    $(".snd-msg-button1").on("click", function () {
        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
		$("#picImg").attr('src', picUrl);
    });

    $("#loginBtn").on("click", function () {
    	if(checkMobileNum($('#userphone').val()) == false ){
    		return ;
    	}
    	if(checkpwd($('#userpwd').val()) == false){
    		return ;
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
                	if($('#pic_code_div').css('display')=='none'){
                		var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
        				$("#picImg").attr('src', picUrl);
                	}
                	$("#count").val(data.desc);
            		$("#pic_code_div").show();

                }
            }
        });
        //登录提交3次错误信息，显示验证码
        if ($("#count").val() >= 3) {
            if ($('#loginCode').val() == '') {
                showError("请填写验证码");
                return false;
            }
            doLogin('picCode');
        } else {
            doLogin('');
        }
    });



    function doLogin(type) {
	    var data = {'clientType':'wap','userName':$.base64.encode($('#userphone').val()),'passwd':$.base64.encode($('#userpwd').val()),'visitiToken':getVisitiToken()};
	    if (type != '') {
		    data = {'clientType':'wap','userName':$.base64.encode($('#userphone').val()),'passwd':$.base64.encode($('#userpwd').val()),'visitiToken':getVisitiToken(),'picCode':$.base64.encode($('#loginCode').val())};
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
                        //登录页、注册页、找回密码、修改密码跳转到首页，其他均从哪里来到哪里去
                        if(document.referrer.indexOf("/page/login/login")>-1 || document.referrer.indexOf("/page/login/register")>-1 || document.referrer.indexOf("/page/find_password")>-1 || document.referrer.indexOf("/page/password")>-1 || document.referrer.indexOf("/page/user_info/user_info")>-1 ){
                    		window.location.href = indexUrl;
                    	}else{
                    		window.location.href = document.referrer;
                        }
                    } else {
                        window.location.href = indexUrl;
                    }
                } else if (data.code == '0025') {
                    setToken(data.desc);
                    $('#age-model').find('.suc-text').text(data.data);
					$('#age-model').show();

                    $('#age-iknow').click(function () {
                        if (document.referrer) {
                            window.location.href = document.referrer;
                        } else {
                            window.location.href = indexUrl;
                        }
                    });
                } else {// 用户名或密码错误
	                if (data.desc.indexOf('验证码') >= 0) {
	                    showError(data.desc);
                        //0111-登录刷新验证码
                        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                        $("#picImg").attr('src', picUrl);

                    } else {
	                    showError(data.desc);
	                }
                }
            }
        });
	}


    //弹窗关闭
    $("#toastBox").click(function() {
        $('#toastBox').hide();
    });
})();
function showError(desc){
	new SmartToast({
		content:desc,
		type:'warn',
		duration:3
	});
}
//验证手机号
function checkMobileNum(mobile)
{
    if(mobile.length==0)
    {
    	showError("请填写正确的手机号码");
        return false;
    }
    if(mobile.length!=11)
    {
    	showError("请填写正确的手机号码");
        return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!myreg.test(mobile))
    {
    	showError("请填写正确的手机号码");
        return false;
    }
    return true;
}

// 验证密码
function checkpwd(pass){
	if ( pass == '') {
        showError("请输入登录密码");
        return false;
    }
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
    	showError("密码不是6-18位数字与字母组合，请重新输入");
    	return false;
    }
    return true;
}



/*删除手机号*/
var userPhone = $('#userphone').attr('id');
var closeUsername = $('#close-username').attr('id');
deleteBtn(userPhone ,closeUsername);

/*删除密码*/
var input = $('#userpwd').attr('id');
var link = $('#close-pwd').attr('id');
deleteBtn(input ,link);

//删除图形按钮
var picCode = $('#loginCode').attr('id');
var closeImg = $('#closeImg').attr('id');
deleteBtn(picCode ,closeImg);


