(function () {

    var Security = {
        init: function () {
            this.setSecurityHeader();
        },

        setSecurityHeader: function () {
            $('.cmn-header-title').text('更换银行卡');
        },

		initUserInfo: function() {
			$.ajax({
				type: 'POST',
				url: host + 'user/getUserInfo.htm',
				data:token_client_data,
				dataType: 'JSON',
				success: function (data) {
					$('input[name="for_login_userphone"]').val(data.data.mobile);
					var length = data.data.mobile.length;
					$('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-3));
					if(data.code == '4000'  ){
						window.location.href = baseUrl + 'login/login.html';
					}
				}
			});

		},

		// 检验用户状态
		checkIfRealName: function() {
			$.ajax({
				type: 'POST',
				url: host + 'baseuser/getUserStatus.htm',
				data:token_client_data,
				dataType: 'JSON',
				success: function (data) {
					//如果已经实名认证，调到结果页
					if (data.code == '0000' && data.data.userCheckStatus == 2) {
						window.location.href = baseUrl + 'real_name_auth/real_name_suc.html';
					} else if (data.code == '4000') {
						window.location.href = baseUrl + 'login/login.html';
					}
				}
			});
		}
    };

    Security.init();

    //业务
    checkUserLogin();

  //实名认证信息、发送验证码校验
	function validInfo(){
		if ($('input[name="userName"]').val()==''||$('input[name="userName"]').val()==undefined) {
			showError("请填写验证信息");
			return false;
		}
		if ($('input[name="realName"]').val()==''||$('input[name="realName"]').val()==undefined) {
			showError('请填写真实姓名');
			return false;
		}
		if ($('input[name="idCardNo"]').val()==''||$('input[name="idCardNo"]').val()==undefined) {
			showError('请填写身份证信息');
			return false;
		}
		if ($('input[name="cardNo"]').val()==''||$('input[name="cardNo"]').val()==undefined) {
			showError('请填写银行卡信息');
			return false;
		}
		if( $('select[name="cardType"] option:selected').val()==''|| $('select[name="cardType"] option:selected').val()==undefined){
			showError('请选择银行信息');
			return false;
		}
		return true;
	}

	//实名认证校验验证码并提交
	$('#nextBtn0').on('click',function(){
		if($('input[name="code"]').val()==''||$('input[name="code"]').val()==undefined){
			showError('请填写短信验证码');
			return false;
		}
		checkValidateCode('1');
	});

	//校验验证码
	function checkValidateCode(type){
		var data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&code=' + $.base64.encode($('input[name="code"]').val());
		$.ajax({
	        type: 'POST',
	        url: host + 'user/checkValidateCode.htm',
	        data:data,
	        dataType: 'JSON',
	        success: function (data) {
	        	if (data.code == '0000') {
	        		//跳转
	        		if(type == '1'){
	        			getUserCheckInfo();
	        			$('#yzm').css('display','none');
						$('#yhk').css('display','block');
						$('#title1').hide();
						$('#title2').show();
	        		}else if(type == '2'){
	        			submitForm();
	        		}
				} else {
					showError(data.desc);
				}
			}
	    });
	}

	//获取实名信息
	function getUserCheckInfo(){
		//校验用户是否已经实名认证
	    $.ajax({
	        type: 'POST',
	        url: host + 'user/auth/realNameResult.htm',
	        data:token_client_data,
	        dataType: 'JSON',
	        success: function (data) {
	        	//如果已经实名认证，调到结果页
	        	if(data.code == '0000'){
	        		$('input[name="for_login_userphone"]').val(data.data.mobile);
	        		$('input[name="realName"]').val(data.data.realName);
	        		$('input[name="idCardNo"]').val(data.data.idcardno);
	        		$('input[name="userName"]').val(data.data.mobile);
	        		var length = 0;
	        		length = data.data.realName.length;
	        		$('#realName1').text('***'+data.data.realName.substring(length-1));
	        		length = data.data.idcardno.length;
	        		$('#idcardno').text(data.data.idcardno.substring(0,3)+'*******'+data.data.idcardno.substring(length-3));
	        		length = data.data.mobile.length;
	        		$('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-3));
	        	}else{
	        		window.location.href = '/page/realname/auth.html';
	        	}
			}
	    });
	}

	//实名认证校验验证码并提交
	$('#nextBtn4').on('click',function(){
		if($('input[name="code"]').val()==''||$('input[name="code"]').val()==undefined){
			showError('请填写短信验证码');
			return false;
		}
		if(validInfo()){
			checkValidateCode('2');
		}
	});

	//提交表单
	function submitForm(){

		var realName = $("input[name='realName']").val();
		var idCardNo = $("input[name='idCardNo']").val();
		var cardNo = $("input[name='cardNo']").val();
		var cardType = $("select[name='cardType'] option:selected").val();
		var idcardtype = '1';

		var data0 = {'realName':realName,'idCardNo':idCardNo,'cardNo':cardNo,
				'cardType':cardType,'idcardtype':idcardtype,'token':getToken(),'clientType':'wap'};

		//身份证认证
		$.ajax({
	        type: 'POST',
	        url: host + 'user/auth/toRealName.htm',
	        data:data0,
	        dataType: 'JSON',
	        success: function (data) {
	        	if (data.code == '0000') {
	        		showSuccess("更换银行卡成功");
	        		setTimeout("javascript:history.back('-1')",1000);//1秒
	        	}else {
	        		showError('信息有误，更换银行卡失败！');
				}
			}
	    });
	}

})();

//发送验证码
function send(){
	if ($('input[name="for_login_userphone"]').val()==''||$('input[name="for_login_userphone"]').val()==undefined) {
		showError('请填写手机号');
		return false;
	}
	var url = host + 'user/sendValidateCode.htm?type=login&sendType=7868&clientType=wap&token=' + getToken();
	var mobile =$('input[name="for_login_userphone"]').val();
	mobile = $.base64.encode(mobile);
	var desc = sendSmsCode(url,'sendCode',mobile);

	if(desc != ''){
		if(desc.indexOf('发送成功')>-1){
			showSuccess('发送成功');
		}else{
			showError(desc);
		}

	}
}


function showError(desc){
	/*$(".modify-suc-text").html(desc);
	$("#toastBox").show();
	setTimeout("closebox()",1000);*/
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

function closebox(){
	var box=document.getElementById('toastBox');
	box.style.display="none";
}