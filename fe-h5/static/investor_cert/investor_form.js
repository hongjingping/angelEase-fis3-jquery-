
(function () {
	function openSelect(element){
        var e = new MouseEvent("mousedown");
        worked = element.dispatchEvent(e);
	}

	$('label.right_arrow').on('click', function(e) {
		var labelFor = $(this).attr('for');
		if (labelFor) {
			var targetEl = $('#' + labelFor);
			if (targetEl.length && targetEl.get(0).tagName.toLowerCase() === 'select') {
				e.preventDefault();
				openSelect(targetEl.get(0));
			}
		}
	})

	var Title = {
		init: function () {
			this.setTitleHeader();
			this.checkBoxInit();
			this.ageCheckDialog();
		},

		setTitleHeader: function () {
			$('.cmn-header-title').text('投资人认证');
			$('#ts').val(0);
		},

	 	checkBoxInit: function() {
            $("#i-check-btn1").click(function() {
                if ($(this).hasClass("i-check-unchecked")) {
                    $(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");
                    $('#agreement').val(1);
                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                    $('#agreement').val(0);
                }
            });

			$("#i-check-btn3").click(function() {
                if ($(this).hasClass("i-check-unchecked")) {
                    $(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");
                    $('#notneed').val(1);
                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                    $('#notneed').val(0);
                }
            });
        },

		ageCheckDialog: function () {
			$('#age-iknow, #age-close').click(function () {
				$('#age-model').hide();
			});
		}
	};

	Title.init();

	checkUserLogin();
	$('#can').html('--');
	//1：机构  0：个人
	//可投资产变更
	$('#position').change(function () {
		var position = $(this).children('option:selected').val();
		if(position <= 1000){
			$('#msg').show();
			$('#canmsg').hide();
			$('#can').html(position * 0.1);
		}else{
			$('#msg').hide();
			$('#canmsg').show();
			$('#canmsg').html('投资有风险，理财需谨慎');
		}
	});

	//合格投资人
	var selHtml = '';

	$.ajax({
		url: host + 'user/auth/toInvestor.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if (result.code == '0000'){
				if (result.data.statusCode == '1001'){
					window.location.href = baseUrl + 'real_name_auth/real_name_auth.html';
				} else if (result.data.statusCode == '1002'){
					window.location.href = baseUrl + 'investor_cert_part2/investor-cert-partial-suc.html';
				} else if (result.data.statusCode == '1003'){
					$('#real-name').val(result.data.realName);
					$('#mobile').val(result.data.mobile);
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
							var inputEl = '<div class="investment-fields"><input type="checkbox" name="hopeindustry" id="invest-filed-'
								+ p.dictionaryCode
								+ '" value="'
								+ p.dictionaryCode
								+ '">'
								+ '<label for="invest-filed-'
								+ p.dictionaryCode
								+ '">'
								+ p.dictionaryName
								+ '</label></div>'

							selHtml += inputEl
						});
						$('#hopeindustry').html(selHtml);
					}
				}
			}else if(result.code == '4000'){
				location.href = loginUrl;
			}

		},
		error:function(e) {
		}
	});

	//投资人表单验证
	$('#investorbtn').on('click',function () {
		if( $('#ts').val() == '0' && ($('select[name="netAssets"] option:selected').val() == '' || $('select[name="netAssets"] option:selected').val() == undefined || $('select[name="netAssets"] option:selected').val() == '4')) {
			showerror('请选择投资条件!');
			return;
		}else if($('#ts').val() == '1' && ($('input[name="realname"]').val() == '' || $('input[name="realname"]').val() == undefined || $('input[name="orgCode"]').val() == '' || $('input[name="orgCode"]').val() == undefined)){
			showerror('请重新填写机构信息!');
			return;
		}else if($('#ts').val() == '1' && $('input[name="realname"]').val().length < 2 || $('input[name="realname"]').val().length > 30){
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
		if($('#ts').val() == '1'){
			if(($('#backImg1').attr('src') == '' ||
                $('#backImg1').attr('src') == null ||
                $('#backImg1').attr('src') == undefined ||
                $('#backImg1').attr('src').indexOf('/images/id_neg')>-1)){
				showerror('至少需要上传一张资产证明/名片！');
				return;
			}
		}

		if ($('#notneed').val() == '0'){
			showerror('抱歉，根据相关政策，合格投资人必须为非现役军人、非公务员');
			return;
		}

		if ($('#agreement').val() == '0'){
			showerror('请您务必阅读并同意《投资人声明》!');
			return;
		} else {
			if ($('#ts').val() == '0') {
				investorformSubmit();
			} else if ($('#ts').val() == '1'){
				if( checkOrgcode($('input[name="orgCode"]').val()) ){
					investorformSubmit();
				}else{
					showerror('组织机构代码格式错误,请重新填写组织机构代码');
				}
			}
		}
	});

	function investorformSubmit(){
		var spCodesTemps = '';
		$('input:checkbox[name=hopeindustry]:checked').each(function(i){
			if(0 == i){
				spCodesTemps = $(this).val();
			}else{
				spCodesTemps += (","+$(this).val());
			}
		});

		var data = 'applyType=1' + '&type=' + $('#ts').val() + '&position=' + $('select[name="position"] option:selected').val()
			+ '&industry=' + $('select[name="industry"] option:selected').val() + '&hopeindustry=' + spCodesTemps
			+ '&realname=' + $('input[name="realname"]').val() + '&orgCode=' + $('input[name="orgCode"]').val();
		var photosrc1 = '';
		var photosrc2 = '';
		var photosrc3 = '';
		if($('#ts').val() == '1'){
			if($('#backImg1').attr('src') != ''
				&& $('#backImg1').attr('src') != null
				&& $('#backImg1').attr('src') != undefined
				&& $('#backImg1').attr('src') != 'undefined'){
				if($('#backImg1').attr('src').indexOf('/resource/images/id_neg')>-1){
					photosrc1 = '';
				}else{
					photosrc1 = $('#backImg1').attr('src');
				}
			}
			if($('#backImg2').attr('src') != '' && $('#backImg2').attr('src') != null && $('#backImg2').attr('src') != undefined && $('#backImg2').attr('src') != 'undefined' ){
				if($('#backImg2').attr('src').indexOf('/resource/images/id_neg')>-1){
					photosrc2 = '';
				}else{
					photosrc2 = $('#backImg2').attr('src');
				}
			}
			if($('#backImg3').attr('src') != '' && $('#backImg3').attr('src') != null && $('#backImg3').attr('src') != undefined && $('#backImg3').attr('src') != 'undefined'){
				if($('#backImg3').attr('src').indexOf('/resource/images/id_neg')>-1){
					photosrc3 = '';
				}else{
					photosrc3 = $('#backImg3').attr('src');
				}
			}
		}

		var netAssetsstr = '&netAssets=' + $('select[name="netAssets"] option:selected').val();
		if($('#ts').val() == '0'){
			data = data + netAssetsstr;
		}
		// 解决合格投资人认证（机构），图片上传时显示错误的问题
		var certPhoto1Substring;
		var certPhoto2Substring;
		var certPhoto3Substring;
		if ($('#backImg1').attr('src').indexOf('resource') != -1) {
			certPhoto1Substring = '';
		} else {
			certPhoto1Substring = $('#backImg1').attr('src').substring(0, 10);
		}
		if ($('#backImg2').attr('src').indexOf('resource') != -1) {
			certPhoto2Substring = '';
		} else {
			certPhoto2Substring = $('#backImg2').attr('src').substring(0, 10);
		}
		if ($('#backImg3').attr('src').indexOf('resource') != -1) {
			certPhoto3Substring = '';
		} else {
			certPhoto3Substring = $('#backImg3').attr('src').substring(0, 10);
		}
		data = data + '&idImgPathTemp=' + certPhoto1Substring + '&assetProofImgPathTemp=' + certPhoto2Substring + '&imgPathTemp=' + certPhoto3Substring;

		var data1 = "&clientType=wap&token=" + getToken();
		data = data + data1;
		$.ajax({
			type: 'POST',
			url: host + 'user/auth/addInvestor.htm',
			data: data,
			dataType: 'JSON',
			success: function(result) {
				if(result.code == '0000') {
					if(result.data.statusCode == '1005'){
						window.location.href = baseUrl + 'investor_cert_part2/investor-cert-partial-suc.html';
					}
				}else if(result.code == '9999'){
					if(result.data.statusCode == '1001'){
						window.location.href = baseUrl + 'real_name_auth/auth.html';
					}else{
						showerror(result.desc);
					}
				}else if(result.code == '4000'){
					location.href = loginUrl;
				} else if (result.code === '0025') {
					$('#age-model').find('.suc-text').text(result.desc);
					$('#age-model').show();
				}
			},
			error: function(e) {
			}
		});
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
            this.pic1 = $('.pic1 input[type=file]');
            this.pic2 = $('.pic2 input[type=file]');
            this.pic3 = $('.pic3 input[type=file]');
        },
        bindEvents: function() {
            this.pic1.on('change', this.changePic1.bind(this));
            this.pic2.on('change', this.changePic2.bind(this));
            this.pic3.on('change', this.changePic3.bind(this));
        },
        changePic1: function(e) {
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
                	var uploadFlag = reduceImg(src,6,'');
                	if(uploadFlag){
                		$('#backImg1').attr('src',src);
                		$('.pic2').show();
                	}
                });
            }
        },
        changePic2: function(e) {
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
                	var uploadFlag = reduceImg(src,7,'');
                	if(uploadFlag){
                		$('#backImg2').attr('src',src);
                		$('.pic3').show();
                	}
                });
            }
        },
        changePic3: function(e) {
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
                	var uploadFlag = reduceImg(src,8,'');
                	if(uploadFlag){
                		$('#backImg3').attr('src',src);
                	}
                });
            }
        }
    }
    editProfile.init();

})();
function certChange(){
	if($('#ts').val() == 0){
    	$('#netassets').show();
        $('#realnamediv').hide();
        $('#orgCodediv').hide();
        $('#imagediv').hide();
        $('#ts').val(0);
    }else if($('#ts').val() == 1){
    	$('#netassets').hide();
    	$('#realnamediv').show();
        $('#orgCodediv').show();
        $('#imagediv').show();
        $('#ts').val(1);
 	}
    var item = document.getElementById("ts");
    var text = item.options[item.selectedIndex].text;
    $("#cert_type").html(text);
}

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

$('#reminder').on('click', function () {
	var newSmartAlert = new SmartAlert({
		content: '<div class="icon-wrapper"><i class="ae-mobile ae-mobile-attention notice-attention"></i></div><div class="content-txt">您可以上传您的资产证明文件或工作名片，有助于顺利通过认证；（其中资产证明文件包含银行流水、股票、债券、基金股份、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等的认购合约。）</div>' ,
		type: 'confirm',
		okText: '我知道了',
		maskClosable: false,
		});
	newSmartAlert.open();
})

function showerror(errormsg){
	new SmartToast({
		content:errormsg,
		type:'warn',
		duration:3
	});
}
//弹窗关闭
$("#toastBox").click(function() {
    $('#toastBox').hide();
});
//关闭注意事项提示框
function closedia(){
	$('#dialogcontent').hide();
}
//关闭图片提示框
function closeimg(){
	$('#dialogimg').hide();
}
//上传提示框显示
function updateMsg(){
	$('#dialogimg').show();
}
//关闭错误提示框
function closebox(){
	var box=document.getElementById("toastBox");
	box.style.display="none";
}