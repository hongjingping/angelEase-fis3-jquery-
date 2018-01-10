(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('修改密码');
		},
	};
	    var InterValObj;
	    var count = 10;
	    var curCount;
	    UpdatePAssword.init();
		//业务
	    checkUserLogin()
	    $.ajax({
	        url: host + 'user/CheckUpdateNormalPwdByCode.htm',
	        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
	        dataType: 'json',
	        type: 'post',
	        data: token_client_data,
	        success: function (data) {
	            if (data.code != '0000') {
	                window.location.href = baseUrl + 'password/update-password-one.html';
	            }
	        }
	    });
	    // 倒计时
	    function countdown() {  
	        if (curCount == 0) {
	            window.clearInterval(InterValObj);  
	        }else{  
	            curCount--;  
	        }  
	    }
	  //提交
		$('#nextBtn').on('click', function () {
			if ($('input[name="newPwd"]').val() == '' || $('input[name="newPw2"]').val() == '' || $('input[name="oldPwd"]').val() == '') {
				new SmartToast({
                    content: '请填写密码',
                    type: 'warn',
                    duration: 3
                });
	            return false;
	        }
	        if ($('input[name="newPwd"]').val() != $('input[name="newPwd2"]').val()) {
	        	new SmartToast({
                    content: '两次输入的新密码不一致，请重新输入',
                    type: 'warn',
                    duration: 3
                });
	            return false;
	        }
	        var url = host + 'user/updateNormalPwd.htm';
	        var data = 'oldPassword=' + $.base64.encode($('input[name="oldPwd"]').val())+ '&userPassword=' + $.base64.encode($('input[name="newPwd"]').val())+"&visitiToken="+getVisitiToken();
	        data += '&clientType=wap&token=' + getToken();
	        $.ajax({
	            url: url,
	            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
	            dataType: 'json',
	            type: 'post',
	            data: data,
	            success: function (data) {
	                if (data.code == '0000') {
	                	new SmartToast({
	                        content: '修改成功',
	                        type: 'success',
	                        duration: 3
	                    });
	                	location.href = loginUrl;
	                } else {
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
function checkpass(){
    if ($('input[name="newPwd"]').val() != $('input[name="newPwd2"]').val()) {
    	new SmartToast({
            content: '两次输入的新密码不一致，请重新输入',
            type: 'warn',
            duration: 3
        });
        return false;
    }
}
//校验原密码、新密码
function validatepass(pass){
	if(pass ==''){
		new SmartToast({
            content: '请填写密码',
            type: 'warn',
            duration: 3
        });
        return false;
	}
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
    	new SmartToast({
            content: '密码不是6-18位数字与字母组合，请重新输入',
            type: 'warn',
            duration: 3
        });
        return false;
    }
}
