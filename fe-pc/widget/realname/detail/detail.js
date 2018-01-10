(function () {

	var RealIdent = {
		init: function () {
			this.changeCardType();
			this.initUserInfo();
			this.checkIfRealName();
		},

		changeCardType: function () {
			$('.select-card-type').on('change', function () {
				if ($(this).val() == 1) {
					$('.item-ident-card').hide();
				} else {
					$('.item-ident-card').show();
				}
			});
		},

		initUserInfo: function() {
			$.ajax({
				type: 'POST',
				url: host + 'user/getUserInfo.htm',
				data:token_client_data,
				dataType: 'JSON',
				success: function (data) {
					$('input[name="userName"]').val(data.data.mobile);
					$('input[name="for_login_userphone"]').val(data.data.mobile);
					var length = data.data.mobile.length;
					$('#phone').text(data.data.mobile.substring(0,3)+'****'+data.data.mobile.substring(length-4));
					if(data.code == '4000'  ){
						//window.location.href = baseUrl + 'login/login.html';
						/*
						 * jingpinghong@creditease.cn
						 * 2017-02-16
						  * */
						handleLoginTimeout();
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
						window.location.href = baseUrl + 'realname/result.html';
					} else if (data.code == '4000') {
						//window.location.href = baseUrl + 'login/login.html';
						/*
						 * jingpinghong@creditease.cn
						 * 2017-02-16
						 * */
						handleLoginTimeout();
					}
				}
			});
		}
	};

	RealIdent.init();

	//业务
	checkUserLogin();
	var req = getRequest();
	var type = req.type;

    $('#idcardtype').on('change',function(){
    	var value = $('#idcardtype').val();
    	if(value=='1'){
    		$('.gat').css('display','none');
			/*
			* 大陆用户无需银行卡验证
			* jingpinghong@creditease.cn
			* 2016-12-22*/
			$('.bank').css('display','none');
			$('.item-line').css('display','none');
    	}else{
    		$('.gat').css('display','block');
			$('.bank').css('display','block');
			$('.item-line').css('display','block');
    	}
    });

  	//实名认证信息、发送验证码校验
  	function validInfo(){
	  	if ($('input[name="userName"]').val()==''||$('input[name="userName"]').val()==undefined) {
	  		showError('请填写验证信息');
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
	  	//if ($('input[name="cardNo"]').val()==''||$('input[name="cardNo"]').val()==undefined) {
	  	//	showError('请填写银行卡信息');
	  	//	return false;
	  	//}
	  	//if( $('select[name="cardType"] option:selected').val()==''|| $('select[name="cardType"] option:selected').val()==undefined){
	  	//	showError('请选择银行信息');
	  	//	return false;
	  	//}
	  	return true;
  	}

  	//实名认证校验验证码并提交
  	$('#nextBtn4').on('click',function(){
  		if($('input[name="code"]').val()==''||$('input[name="code"]').val()==undefined){
  			showError('请填写短信验证码');
  			return false;
  		}
  		if(validInfo())
  			checkValidateCode();
  	});
  	//校验验证码
  	function checkValidateCode(){
  		var data = 'userName=' + $.base64.encode($('input[name="for_login_userphone"]').val()) + '&code=' + $.base64.encode($('input[name="code"]').val());
  		$.ajax({
  	        type: 'POST',
  	        url: host + 'user/checkValidateCode.htm',
  	        data:data,
  	        dataType: 'JSON',
  	        success: function (data) {
  	        	if (data.code == '0000') {
  					submitForm();
  				} else {
  					showError(data.desc)
  				}
  			}
  	    });
  	}

  //提交表单
	function submitForm(){

		var realName =  $.newbase64.encode($('input[name="realName"]').val());
		var idCardNo =  $.base64.encode($('input[name="idCardNo"]').val());
		var cardNo = $('input[name="cardNo"]').val();
        var identificationCard = $('input[name="idCardNo"]').val();
		var cardType = $('select[name="cardType"] option:selected').val();
		var idcardtype = $('select[name="idcardtype"] option:selected').val();
		//身份证认证
		if($('select[name="idcardtype"]').val()=='1'){
			/*
			* 大陆用户不需要银行卡
			* jingpinghong@creditease.cn
			* 2016-12-23*/
			var data0 = {'realName':realName,'idCardNo':idCardNo,'cardNo':cardNo,
					'cardType':cardType,'idcardtype':idcardtype,'token':getToken(),'clientType':'pc'};

            var ageCheckAjax = $.ajax({
                type: 'POST',
                url: host + 'user/auth/ageCheck.htm?idCardNo=' + identificationCard + '&opType=0',
                data: {'token':getToken(),'clientType':'pc'},
                dataType: 'JSON'
            });

            ageCheckAjax.done(function (data) {
                if (data.code === '0025') {
                    var ageLimitAlert = new SmartAlert({
                        title: '年龄超限',
                        content: '<i class="ae-icon ae-icon-attention alert-notice-attention"></i><div class="content-txt-wrapper"><span class="content-txt">'+ data.desc +'</span></div>',
                        okText: '确认',
                        maskClosable: false,
                        onOk: function () {
                            $.ajax({
                                type: 'POST',
                                url: host + 'user/auth/toRealName.htm',
                                dataType: 'JSON',
                                data:data0,
                                success: function (data) {
                                    if (data.code == '0000') {
                                        showSuccess("认证成功");
                                        window.location.href = 'result.html';
                                    } else {
                                        showError(data.desc)
                                    }
                                }
                            });
                        }
                    });
                    ageLimitAlert.open();
                } else if (data.code === '4000') {
                    handleLoginTimeout();
                } else {
        			$.ajax({
        		        type: 'POST',
        		        url: host + 'user/auth/toRealName.htm',
        		        dataType: 'JSON',
        		        data:data0,
        		        success: function (data) {
        		        	if (data.code == '0000') {
        		        		showSuccess("认证成功");
        		    			window.location.href = 'result.html';
                            } else {
        						showError(data.desc)
        					}
        				}
        		    });
                }
            })
		}
		//港澳台
		else{
			if ($('input[name="cardNo"]').val()==''||$('input[name="cardNo"]').val()==undefined) {
				showError('请填写银行卡信息');
				return false;
			}
			if( $('select[name="cardType"] option:selected').val()==''|| $('select[name="cardType"] option:selected').val()==undefined){
				showError('请选择银行信息');
				return false;
			}

			var certPhoto1 = $('#certPhoto1').attr('src');
	        if(certPhoto1 == '' || certPhoto1 == null || certPhoto1 == undefined){
	        	showError('请选择要上传的图片');
	            return;
	        }
	        var certPhoto2 = $('#certPhoto2').attr('src');
	        if(certPhoto2 == '' || certPhoto2 == null || certPhoto2 == undefined){
	        	showError('请选择要上传的图片');
	            return;
	        }
	        var bankPhoto = $('#bankPhoto').attr('src');
	        if(bankPhoto == '' || bankPhoto == null || bankPhoto == undefined){
	        	showError('请选择要上传的图片');
	            return;
	        }
	    	var data0 = {'realName':realName,'idCardNo':idCardNo,'cardNo':cardNo,
					'cardType':cardType,'idcardtype':idcardtype,'token':getToken(),'clientType':'pc'};

            /**
             * 2017-02-24 jihongzhang@creditease.cn
             * 港澳台用户证件号无法判断年龄，直接进行实名认证，待后台审核
             *
            */
            $.ajax({
                type: 'POST',
                url: host + 'user/auth/toRealName.htm',
                data:data0,
                dataType: 'JSON',
                success: function (data) {
                    if (data.code == '0000') {
                        window.location.href = 'result.html';
                    } else {
                        showError(data.desc)
                    }
                }
            });

		}
	}


	/**
     * 添加图片上传组件
     */
    var imageUploadComps = document.querySelectorAll('.upload-wrap');
    Array.prototype.forEach.call(imageUploadComps, function (comp) {
	    var img = document.createElement('img');
	    img.id = comp.getAttribute('data-id');
	    img.className = 'cert-photo-preview';
	    var input = document.createElement('input');
//	    var icon = document.createElement('span');
//	    icon.className = 'glyphicon glyphicon-plus';
	    input.className = 'upload-file';
	    input.type = 'file';
	    input.addEventListener('change', function (event) {
    	var file = event.target.files[0];
            if(!/image\/\w+/.test(file.type)){
                var readSmartAlert = new SmartAlert({
                    title: '报错',
                    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请确保文件为图像类型</span>',
                    type: 'confirm',
                    okText: '我知道了',
                    maskClosable: false,
                });
                readSmartAlert.open();
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                var uploadFlag = false;
	    		if(img.id == 'certPhoto1'){
    				uploadFlag = reduceImg(this.result,3,'');
    			}else if(img.id == 'certPhoto2'){
    				uploadFlag = reduceImg(this.result,4,'');
    			}else if(img.id == 'bankPhoto'){
    				uploadFlag = reduceImg(this.result,5,'');
    			}
    			if(uploadFlag) {
					img.src = this.result;
				}
            }
	    });
    	[img, input].forEach(function (subcomp) {
    		comp.appendChild(subcomp);
    	});
    });

    /**
     * 将图片转为base64格式
	 * @private
	 */
  function getImageBase64(file) {
    var fr = new FileReader();
    return new Promise(function (resolve) {
      fr.onload = function () {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
  }
})();

//发送验证码
function send(){
	var mobile =$('input[name="for_login_userphone"]').val();
	mobile = $.base64.encode(mobile);
    var token = getToken();
	var url = host + 'user/sendValidateCode.htm?type=login&sendType=7867&clientType=pc&token=' + token;
	var desc = sendSmsCode(url,'sendCode',mobile);
	if(desc != ''){
		if(desc.indexOf('发送成功')>-1){
			showSuccess('发送成功');
		}else{
			showError(desc);
		}

	}
}

function showError(errorDesc){
	$('#success').hide();
	$("#error1").html(errorDesc);
	$('#error').show();
}

function showSuccess(successDesc){
	$('#error').hide();
	$("#success1").html(successDesc);
	$("#success").show(successDesc);
}