(function () {

    var ModifyPass = {
        init: function () {
            this.renderCommonTitle();
        },

        renderCommonTitle: function () {
            $('#cmn-header').text('修改密码');
        }
    };

    ModifyPass.init();
    
    //业务
    checkUserLogin();
    
    // 发短信倒计时用
    var InterValObj;
    var count = 60;
    var curCount;
    
    $.ajax({
        url: host + 'user/getUserInfo.htm',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        type: 'post',
        data: token_client_data,
        success: function (data) {
            if (data.code == '0000') {
                $('#mobile').html(data.data.mobile.substring(0, 3) + '****' + data.data.mobile.substring(7));
                $('#for_login_userphone').val(data.data.mobile);
            } else {
                showError(data.desc)
            }
        }
    });
    
    // 发短信倒计时
    function countdown() {  
        if (curCount == 0) {
            window.clearInterval(InterValObj);  
            $('#sendCode3').on("click", sendSmsCode); 
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
    
    $('#sendCode3').on('click', sendSmsCode);
    
    //发送短信验证码
    
    function sendSmsCode() {
    	var mobile = $('input[name="for_login_userphone"]').val();
        if (mobile == '' || mobile == undefined) {
            mobile = $('input[name="mobile"]').val();
            if (mobile == '' || mobile == undefined){
                $('#error-phone').html('请输入新手机号')
                return false;
            }
        }
        
        var url = host + 'user/sendValidateCode.htm?type=login&sendType=7865';
        var data = 'mobile=' + $.base64.encode(mobile);
        data += '&clientType=pc&token=' + getToken();
        $.ajax({
            url: url,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data) {
            	if (data.code == '0000') {
                    $('#sendCode3').off('click', sendSmsCode);
            		curCount = count;
                    InterValObj = window.setInterval(countdown, 1000);
		            showSuccess(data.desc);
		        } else {
		        	showError(data.desc);
		        }
            }
        });
    };
    
    //提交
    $('#nextBtn8').on('click', function () {
        if ($('input[name="for_login_userphone"]').val() == '' || $('input[name="for_login_userphone"]').val() == undefined || $('input[name="for_login_code"]').val() == '' || $('input[name="for_login_code"]').val() == undefined) {
            showError('请填写验证信息');
            return false;
        }
        var url = host + 'user/updateNormalPwdByCode.htm';
        var data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&code=' + $.base64.encode($('input[name="for_login_code"]').val());
        data += '&clientType=pc&token=' + getToken();
        $.ajax({
            url: url,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data) {
                if (data.code == '0000' && data.data.userName != undefined && data.data.userName != '') {
                    window.location.href = baseUrl + 'modifypass/steptwo.html';
                }else{
                	showError(data.desc);
                }
            }
        });
    });

})();

//显示错误信息
function showError(errorDesc){
	$('#error1').text(errorDesc);
	$('#success').hide();
	$('#error0').show();
}
//显示发送短信验证码信息
function showSuccess(successDesc){
	$('#successMsg').text(successDesc);
	$('#error0').hide();
	$('#success').show();
}