(function () {

	var RegisterPro = {
		init: function () {
			$("#ts").val("");
			this.setTitleHeader();
			this.inputEffect();
			this.sendMsg();
			this.initUserInfo();
			this.checkIfRealName();
			this.initCheckAge();
			this.checkFinanerAge();
			this.ageCheckDialog();
		},

		setTitleHeader: function () {
			$('.cmn-header-title').text('实名认证');
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
				},1000);
			}

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
					if (data.code == '0000' && (data.data.userCheckStatus == 1 || data.data.userCheckStatus == 2)) {
						window.location.href = baseUrl + 'real_name_auth/real_name_suc.html';
					} else if (data.code == '4000') {
						window.location.href = baseUrl + 'login/login.html';
					}
				}
			});
		},

		initCheckAge: function () {
			if ($('#idcardtype').val() === '1') {
				$('#document-num').bind('input propertychange', function () {
					if ($(this).val().length === 18) {
						if (isIDCard($(this).val())) {
							$.ajax({
								type: 'POST',
								url: host + 'user/auth/ageCheck.htm?opType=0&idCardNo=' + $(this).val(),
								data: token_client_data,
								dataType: 'JSON',
								success: function (data) {
									console.log(data);
									if (data.code === '0025') {
										$('#age-model').find('.suc-text').text(data.desc);
										$('#age-model').show();
									}
								}
							});
						} else {
							showError('请填写正确的证件号码');
						}
					}
				});
			} else {
				$('#document-num').unbind('input propertychange');
			}
		},

		checkFinanerAge: function () {
			var me = this;
			$('#idcardtype').change(function () {
				me.initCheckAge();
			});
		},

		ageCheckDialog: function () {
			$('#age-iknow,#age-close').click(function () {
				$('#age-model').hide();
			});
		}
	}

	RegisterPro.init();
	//业务开始

	checkUserLogin();
	var req = getRequest();
	var type = req.type;

	 $('#idcardtype').on('change',function(){
		var value = $('#idcardtype').val();
		if(value=='1'){
			$('.gat').css('display','none');
		}else{
			$('.gat').css('display','block');
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
	  		showError('请填写证件号码');
	  		return false;
	  	}
	  	return true;
	}

	//实名认证校验验证码并提交
	$('#nextBtn4').on('click',function(){
		if(validInfo())
			checkValidateCode();
	});
	//校验验证码
	function checkValidateCode(){
		if($('input[name="code"]').val()==''||$('input[name="code"]').val()==undefined){
			showError('请填写短信验证码');
			return false;
		}
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
		var realName = $.newbase64.encode($('input[name="realName"]').val());
		var idCardNo = $.newbase64.encode($('input[name="idCardNo"]').val());
		var cardNo = $('input[name="cardNo"]').val();
		var cardType = $('select[name="cardType"] option:selected').val();
		var idcardtype = $('select[name="idcardtype"] option:selected').val();
		//身份证认证
		if($('select[name="idcardtype"]').val()=='1'){
			var data0 = {'realName':realName,'idCardNo':idCardNo,
					'idcardtype':idcardtype,'token':getToken(),'clientType':'wap'};
			$.ajax({
		        type: 'POST',
		        url: host + 'user/auth/toRealName.htm',
		        dataType: 'JSON',
		        data:data0,
		        success: function (data) {
		        	if (data.code == '0000') {
		        		showSuccess("认证成功");
		    			window.location.href = '/page/real_name_auth/real_name_suc.html';
		        	}else {
						showError(data.desc)
					}
				}
		    });
		}
		//港澳台
		else{
			var certPhoto1 = $('#frontImg').attr('src');
	        if(certPhoto1 == '' || certPhoto1 == null || certPhoto1 == undefined || certPhoto1.indexOf('/resource')>-1){
	        	showError('请选择要上传的图片');
	            return;
	        }
	        var certPhoto2 = $('#backImg').attr('src');
	        if(certPhoto2 == '' || certPhoto2 == null || certPhoto2 == undefined || certPhoto2.indexOf('/resource')>-1){
	        	showError('请选择要上传的图片');
	            return;
	        }
	        var bankPhoto = $('#bankImg').attr('src');
	        if(bankPhoto == '' || bankPhoto == null || bankPhoto == undefined || bankPhoto.indexOf('/resource')>-1){
	        	showError('请选择要上传的图片');
	            return;
	        }
    	  	if ($('input[name="cardNo"]').val()==''||$('input[name="cardNo"]').val()==undefined) {
    	  		showError('请填写银行卡信息');
    	  		return false;
    	  	}
    	  	if( $('select[name="cardType"] option:selected').val()==''|| $('select[name="cardType"] option:selected').val()==undefined){
    	  		showError('请选择银行信息');
    	  		return false;
    	  	}
	    	var data0 = {'realName':realName,'idCardNo':idCardNo,'cardNo':cardNo,
					'cardType':cardType,'idcardtype':idcardtype,'token':getToken(),'clientType':'wap'};
			$.ajax({
		        type: 'POST',
		        url: host + 'user/auth/toRealName.htm',
		        data:data0,
		        dataType: 'JSON',
		        success: function (data) {
		        	if (data.code == '0000') {
		        		showSuccess('认证成功');
		    			window.location.href = '/page/real_name_auth/real_name_suc.html';
		        	}else {
						showError(data.desc)
					}
				}
		    });
		}
	}

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

var editProfile = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
        },
        cacheElements: function() {
            this.uploadInputFront = $('.img-show-left input[type=file]');
            this.uploadInputBack = $('.img-show-right input[type=file]');
            this.uploadInputBank = $('.img-show-bank input[type=file]');
        },
        bindEvents: function() {
            this.uploadInputFront.on('change', this.uploadAvatarFront.bind(this));
            this.uploadInputBack.on('change', this.uploadAvatarBack.bind(this));
            this.uploadInputBank.on('change', this.uploadAvatarBank.bind(this));
        },
        uploadAvatarFront: function(e) {
            if (e.target && e.target.files && e.target.files[0]) {
                var blob = e.target.files[0];
                if(!/image\/\w+/.test(blob.type)){
                    new SmartToast({
                        content: '请确保文件为图像类型',
                        type: 'warn',
                        duration: 3
                    });
                    return false;
                }
                getImageBase64(blob).then(function(src) {
                	var uploadFlag = reduceImg(src,3,'');
                	if(uploadFlag){
                		$('#frontImg').attr('src',src);
                	}
                });
            }
        },
        uploadAvatarBack: function(e) {
            if (e.target && e.target.files && e.target.files[0]) {
                var blob = e.target.files[0];
                if(!/image\/\w+/.test(blob.type)){
                    new SmartToast({
                        content: '请确保文件为图像类型',
                        type: 'warn',
                        duration: 3
                    });
                    return false;
                }
                getImageBase64(blob).then(function(src) {
                	var uploadFlag = reduceImg(src,4,'');
                	if(uploadFlag){
                		$('#backImg').attr('src',src);
                	}
                });
            }
        },
        uploadAvatarBank: function(e) {
            if (e.target && e.target.files && e.target.files[0]) {
                var blob = e.target.files[0];
                if(!/image\/\w+/.test(blob.type)){
                    new SmartToast({
                        content: '请确保文件为图像类型',
                        type: 'warn',
                        duration: 3
                    });
                    return false;
                }
                getImageBase64(blob).then(function(src) {
                	var uploadFlag = reduceImg(src,5,'');
                	if(uploadFlag){
                		$('#bankImg').attr('src',src);
                	}
                });
            }
        }
    }
    editProfile.init();

})();

//发送验证码
function send(){
	var mobile =$('input[name="for_login_userphone"]').val();
	mobile = $.base64.encode(mobile);
	var url = host + 'user/sendValidateCode.htm?type=login&sendType=7867&clientType=wap&token=' + getToken();
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
	new SmartToast({
		content:errorDesc,
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
//业务结束

/*
$(function(){
   $("#openSelect").on('click', function(){

        $("#ts").show();
        var s = $("#ts").attr('size')==1?2:1
        $("#ts").attr('size', s);
        $("#ts").click();
        $("#cert_type").hide();

        alert("click");
        return $("#ts").click();

   });
   $("#ts option").on({
       click: function() {
        $("#ts").attr('size', 1);
        $("#ts").attr('size', 1);
       },
        mouseenter: function() {
           $(this).css({background: '#498BFC', color: '#fff'});
       },
       mouseleave: function() {
           $(this).css({background: '#fff', color: '#000'});
       }
   });
}); */

function certChange(){
    var item = document.getElementById("ts");
    var text = item.options[item.selectedIndex].text;
    $("#cert_type").html(text);
    $("#ts").val("");
}
