$(function () {
	checkUserLogin();
	$('#can').html('--');
	$('.investor-line').show();
	//1：机构  0：个人
    $('.item-radio').change(function () {
        if($(this).val() == 0){
        	$('#netassets').show();
            $('#realnamediv').hide();
            $('#orgCodediv').hide();
            $('#imagediv').hide();
        }else if($(this).val() == 1){
        	$('#netassets').hide();
        	$('#realnamediv').show();
            $('#orgCodediv').show();
            $('#imagediv').show();
	 	}
	 });

	 //点击协议
	 $('#agreement').on('click',function (e) {
		var clickFlag = $('#agreement').val();
		if(clickFlag == 1){
			$('#agreement').val(0);
		}else{
			$('#agreement').val(1);
		}
	});

	//是否领投人
	 $('#isinves').on('click',function (e) {
		var clickFlag = $('#isinves').val();
		if(clickFlag == 1){
			$('#isinves').val(0);
		}else{
			$('#isinves').val(1);
		}
	});

	//可投资产变更
	$('#position').change(function () {
		var position = $(this).children('option:selected').val();
		if(position <= 1000){
			$('#msg').show();
			$('#canmsg').hide();
			$('#remind-text').show();
			$('#can').show();
			$('#can').html(position * 0.1);
		}else{
			$('#msg').hide();
			$('#canmsg').show();
			$('#remind-text').hide();
			$('#can').hide();
			$('#canmsg').html('投资有风险，理财需谨慎');
		}
	});

	//图片上传
	/**
	   * 添加图片上传组件
	   */
	    var imageUploadComps = document.querySelectorAll('.upload-wrap');
	    Array.prototype.forEach.call(imageUploadComps, function (comp) {
		    var img = document.createElement('img');
		    img.id = comp.getAttribute('data-id');
		    img.className = 'cert-photo-preview';
		    var input = document.createElement('input');
//		    var icon = document.createElement('span');
//		    icon.className = 'glyphicon glyphicon-plus';
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
						uploadFlag = reduceImg(this.result,6,'');
					}else if(img.id == 'certPhoto2'){
						uploadFlag = reduceImg(this.result,7,'');
					}else if(img.id == 'certPhoto3'){
						uploadFlag = reduceImg(this.result,8,'');
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

	//重新申请合格投资人
	var selHtml = '';

	$.ajax({
		url: host + 'user/auth/toInvestor.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if (result.code == '0000') {
				if(result.data.url.indexOf('investor') > 0){
					var length = result.data.realName.length;
					$('#real-name').html('**' + result.data.realName.substring(length-1));
					$('#mobile').html(result.data.mobile.substring(0,3) + '***' + result.data.mobile.substring(7));

					if(result.data.position != null){
						selHtml += '<option value="">请选择可投资产</option>';
						$.each(result.data.position, function (i,p) {
							selHtml += '<option value="' + p.dictionaryCode+'">' + p.dictionaryName + '</option>'
						});
						$('#position').html(selHtml);
					}

					if(result.data.industry != null){
						selHtml = '';
						selHtml += '<option value="">请选择所在行业</option>';
						$.each(result.data.industry, function (i,p) {
							selHtml += '<option value="' + p.dictionaryCode+'">' + p.dictionaryName + '</option>'
						});
						$('#industry').html(selHtml);
					}

					if(result.data.hopeindustry != null){
						selHtml ='';
						$.each(result.data.hopeindustry, function (i,p) {
							selHtml += '<span><input type="checkbox" name="hopeindustry" value="' + p.dictionaryCode +'">' + p.dictionaryName + '</span> '
						});
						$('#hopeindustry').html(selHtml);
					}
				}else if(result.data.url.indexOf('realName') > 0){
					window.location.href = baseUrl + 'realname/auth.html';
				}
			}else if(result.code == '9999'){
				window.location.href = baseUrl + 'realname/auth.html';
			}else if(result.code == '4000'){
                // location.href = loginUrl;
                handleLoginTimeout();
            }
		},
		error:function(e) {
		}
	});

	//重新申请投资人表单验证
	$('#investorbtn').on('click',function () {
		if( $('input[type="radio"]:checked').val() == '0' && ($('select[name="netAssets"] option:selected').val() == '' || $('select[name="netAssets"] option:selected').val() == undefined || $('select[name="netAssets"] option:selected').val() == '4')) {
			showerror('请选择投资条件!');
			return;
		}else if($('input[type="radio"]:checked').val() == '1' && ($('input[name="realname"]').val() == '' || $('input[name="realname"]').val() == undefined || $('input[name="orgCode"]').val() == '' || $('input[name="orgCode"]').val() == undefined)){
			showerror('请重新填写机构信息!');
			return;
		}else if($('input[type="radio"]:checked').val() == '1' && $('input[name="realname"]').val().length < 2 || $('input[name="realname"]').val().length > 30){
			showerror('机构名称应该2-30个字之间!');
			return;
		}
		if($('select[name="position"] option:selected').val() == ''){
			showerror('请选择可投资产!');
			return;
		}
		if($('select[name="industry"] option:selected').val() == ''){
			showerror('请选择所在行业!');
			return;
		}

		var spCodesTemp = '';
		$('input:checkbox[name=hopeindustry]:checked').each(function(i){
	       if(0 == i){
	         spCodesTemp = $(this).val();
	       }else{
	        spCodesTemp += (","+$(this).val());
	       }
		});

		if(spCodesTemp == ''){
			showerror('请选择偏好投资领域!');
			return;
		}
		if($('input[type="radio"]:checked').val() == '1'){
			if(($("#certPhoto1").attr("src") == '' || $("#certPhoto1").attr("src") == null || $("#certPhoto1").attr("src") == undefined) &&
					($("#certPhoto2").attr("src") == '' || $("#certPhoto2").attr("src") == null || $("#certPhoto2").attr("src") == undefined) &&
					($("#certPhoto3").attr("src") == '' || $("#certPhoto3").attr("src") == null || $("#certPhoto3").attr("src") == undefined)){
				showerror('至少需要上传一张资产证明/名片！');
				return;
			}
		}
		if($('#agreement').val() == '0'){
			showerror('请您务必阅读并同意《投资人声明》!');
			return;
		}else {
			if ($('input[type="radio"]:checked').val() == '0') {
				investorformSubmit();
			} else if ($('input[type="radio"]:checked').val() == '1'){
				if( checkOrgcode($('input[name="orgCode"]').val()) ){
					investorformSubmit();
				}else{
					showerror('组织机构代码格式错误,请重新填写组织机构代码');
				}
			}
		}
	});

	//重新提交申请投资人
	function investorformSubmit(){
			var spCodesTemps = '';
			$('input:checkbox[name=hopeindustry]:checked').each(function(i){
		       if(0 == i){
		         spCodesTemps = $(this).val();
		       }else{
		        spCodesTemps += (","+$(this).val());
		       }
			});

			var data = 'applyType=1' + '&type=' + $('input[type="radio"]:checked').val() + '&position=' + $('select[name="position"] option:selected').val()
						+ '&industry=' + $('select[name="industry"] option:selected').val() + '&hopeindustry=' + spCodesTemps
						+ '&realname=' + $('input[name="realname"]').val() + '&orgCode=' + $('input[name="orgCode"]').val() + '&isInves=' + $('input[name="isInves"]').val();

			var netAssetsstr = '&netAssets=' + $('select[name="netAssets"] option:selected').val();
			if($('input[type="radio"]:checked').val() == '0'){
				data = data + netAssetsstr;
			}
			// 解决合格投资人认证（机构），图片上传时显示错误的问题
			var certPhoto1Substring;
			var certPhoto2Substring;
			var certPhoto3Substring;
			if (typeof($('#certPhoto1').attr('src')) != 'undefined') {
				certPhoto1Substring = $('#certPhoto1').attr('src').substring(0, 10);
			} else {
				certPhoto1Substring = '';
			}
			if (typeof($('#certPhoto2').attr('src')) != 'undefined') {
				certPhoto2Substring = $('#certPhoto2').attr('src').substring(0, 10);
			} else {
				certPhoto2Substring = '';
			}
			if (typeof($('#certPhoto3').attr('src')) != 'undefined') {
				certPhoto3Substring = $('#certPhoto3').attr('src').substring(0, 10);
			} else {
				certPhoto3Substring = '';
			}
			data = data + '&idImgPathTemp=' + certPhoto1Substring + '&assetProofImgPathTemp=' + certPhoto2Substring + '&imgPathTemp=' + certPhoto3Substring;
			var data1 = "&clientType=pc&token=" + getToken();
			data = data + data1;
			$.ajax({
				type: 'POST',
				url: host + 'user/auth/addInvestor.htm',
				data: data,
				dataType: 'JSON',
				success: function(result) {
					if(result.code == '0000') {
						if(result.data.url.indexOf('investor') > 0){
							window.location.href = baseUrl + 'investor/result.html';
						}
					}else if(result.code == '9999'){
						if(result.data.url.indexOf('investor') > 0){
							window.location.href = baseUrl + 'investor/toInvestor.html';
						}else if(result.data.url.indexOf('realName') > 0){
							window.location.href = baseUrl + 'realname/auth.html';
						}else{
							var readSmartAlert = new SmartAlert({
			            	    title: '报错',
			            	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+result.desc+'</span>',
			            	    type: 'confirm',
			            	    okText: '我知道了',
			            	    maskClosable: false,
			            	});
			            	readSmartAlert.open();
						}
					}else if(result.code == '4000'){
						// location.href = loginUrl;
						handleLoginTimeout();
					}
				},
				error: function(e) {
				}
			});
	}

});

//校验组织机构代码
function checkOrgcode(code){
	var ws = [3, 7, 9, 10, 5, 8, 4, 2];
	var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var reg = /^([0-9A-Z]){8}-[0-9|X]$/;
	if (!reg.test(code)) {
		showerror('组织机构代码不正确！');
		return false;
	}

	var sum = 0;
	for (var i = 0; i < 8; i++) {
		sum += str.indexOf(code.charAt(i)) * ws[i];
	}
	var c9 = 11 - (sum % 11);
	if(c9 == 10){
		c9='X';
	}else if(c9 == 11){
		c9 = '0';
	}

	if(c9 != code.charAt(9)){
		showerror('组织机构代码不正确，请输入正确的企业代码！');
		return false;
	}
	return true;
}

function showerror(errormsg){
	$('#errornotice').show();
	$('#error').html(errormsg)
}