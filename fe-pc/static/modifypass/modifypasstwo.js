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
    checkUserLogin()
    $.ajax({
        url: host + 'user/CheckUpdateNormalPwdByCode.htm',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        dataType: 'json',
        type: 'post',
        data: token_client_data,
        success: function (data) {
            if (data.code != '0000') {
                window.location.href = baseUrl + 'modifypass/stepone.html';
            }
        }
    });
    
	//提交
	$('#nextBtn5').on('click', function () {
		$('#error0').hide();
        //if ($('input[name="newPwd"]').val() == '' || $('input[name="newPw2"]').val() == '' || $('input[name="oldPwd"]').val() == '') {
        if ($('input[name="newPwd"]').val() == '' || $('input[name="newPw2"]').val() == '' ) {
            showError('请填写密码');
            return false;
        }
        if ($('input[name="newPwd"]').val() != $('input[name="newPwd2"]').val()) {
            showError('二次输入的新密码不一致，请重新输入');
            return false;
        }
        var url = host + 'user/updateNormalPwd.htm';
        /*
        * 0120
        * 修改密码无需输入旧密码
        * jingpinghong@creditease.cn
        * */
        var data = '&userPassword=' + $.base64.encode($('input[name="newPwd"]').val());
        data += '&clientType=pc&token=' + getToken();
        $.ajax({
            url: url,
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data) {
                if (data.code == '0000') {
                    //showError(data.desc);
                    window.location.href = baseUrl + 'modifypass/stepthree.html';
                } else {
                    showError(data.desc)
                }
            }
        });
    });

})();

function checkpass(){
    if ($('input[name="newPwd"]').val() != $('input[name="newPwd2"]').val()) {
        showError('两次输入的新密码不一致，请重新输入');
        return false;
    }
}

//显示错误信息
function showError(errorDesc){
	$('#error1').text(errorDesc);
	$('#error0').show();
}

//登录验证密码，找回密码验证密码
function validatepass(pass){
	$('#error0').hide();
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        showError('请输入6位以上数字与字母组合密码');
    }
}