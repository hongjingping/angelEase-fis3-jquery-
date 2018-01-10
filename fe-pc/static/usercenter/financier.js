$(function () {

    //初始化地址组件
    addressInit('city1','city2','city3','','','');

    //点击协议
	$('#agreediv').on('click',function (e) {
		var clickFlag = $('#agreement').val();
		if(clickFlag == 1){
			$('#agreement').val(0);
			$('#agreediv').removeClass('checked');
		}else{
			$('#agreement').val(1);
			$('#agreediv').addClass('checked');
		}
	});

    //PC融资人认证
	$.ajax({
		url: host + 'user/auth/realNameResult.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if (result.code == '0000') {
                $('#real-name').html(result.data.realName);
                $('#mobile').html(result.data.mobile);
			}else if(result.code == '9999'){
				window.location.href = 'status.html';
			}else if(result.code == '4000'){
                // location.href = loginUrl;
                handleLoginTimeout();
            }
		},
		error:function(e) {
		}
	});

    /**
     * 添加图片上传组件
     */
    var imageUploadComps = document.querySelectorAll('.image-upload-comp');
    Array.prototype.forEach.call(imageUploadComps, function (comp) {
        var img = document.createElement('img');
        img.id = comp.getAttribute('data-id');
        var input = document.createElement('input');
        var icon = document.createElement('span');
        icon.className = 'glyphicon glyphicon-plus';
        input.type = 'file';
        input.addEventListener('change', function (event) {
            var file = event.target.files[0];
            getImageBase64(file).then(function (src) {
                img.src = src;
            });
        });
        [img, input, icon].forEach(function (subcomp) {
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
})


/**
 * PC融资人页面信息提交
 * 所有填入内容非空判断和校验
 */
function onSubmit() {
    //校验机构名称
    if ($('input[name=company]').val() == '' || $('input[name=company]').val() == undefined) {
        $('#error').html('请重新填写机构名称!');
        return;
    }
    if ($('input[name=company]').val().length < 2 || $('input[name=company]').val().length > 30) {
        $('#error').html('机构名称应该2-30个字之间!');
        return;
    }
    //公司电话校验
    if ($('input[name=contact]').val() == '' || $('input[name=contact]').val() == undefined) {
        $('#error').html('请重新填写公司电话!');
        return;
    }
    //公司邮箱校验
    if ($('input[name=email]').val() == '' || $('input[name="email"]').val() == undefined || !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test($('input[name="email"]').val()))) {
        $('#error').html('请重新填写公司邮箱!');
        return false;
    }
    //选择省市区校验
    if($('select[name="province"] option:selected').val() == '' || $('select[name="province"] option:selected').val() == undefined ||
        $('select[name="province"] option:selected').val() == '--省份--' || $('select[name="city"] option:selected').val() == '' ||
        $('select[name="city"] option:selected').val() == undefined || $('select[name="city"] option:selected').val() == '--城市--' ||
        $('select[name="district"] option:selected').val() == '' || $('select[name="district"] option:selected').val() == undefined ||
        $('select[name="district"] option:selected').val() == '--区县--') {
        $('#error').html('请详细勾选您所在的省市区域!');
        return;
    }
    //详细地址校验
    if($('textarea[name="contactAddress"]').val() == '' || $('textarea[name="contactAddress"]').val() == undefined) {
        $('#error').html('请重新填写详细地址信息!');
        return;
    }
    //法人姓名校验
    if($('input[name="realname"]').val() == '' || $('input[name="realname"]').val() == undefined) {
        $('#error').html('请重新填写法人姓名!');
        return;
    }
    //法人证件号码校验
    if($('input[name="licenseNumber"]').val() == '' || $('input[name="licenseNumber"]').val() == undefined || $('input[name="licenseNumber"]').val().length < 14) {
        $('#error').html('请重新填写法人证件号码!');
        return;
    }
    //营业执照注册号校验
    if($('input[name="busLic"]').val() == '' || $('input[name="busLic"]').val() == undefined) {
        $('#error').html('请重新填写营业执照注册号!');
        return;
    }
    //组织机构代码校验
    if($('input[name="orgCode"]').val() == '' || $('input[name="orgCode"]').val() == undefined) {
        $('#error').html('请重新填写组织机构代码!');
        return;
    }
    //校验营业执照扫描照
    if($("#certPhoto1").attr("src") == '' || $("#certPhoto1").attr("src") == null || $("#certPhoto1").attr("src") == undefined) {
        $('#error').html('请上传营业执照扫描照!');
        return;
    }
    //组织机构扫描照校验
    if($("#certPhoto2").attr("src") == '' || $("#certPhoto2").attr("src") == null || $("#certPhoto2").attr("src") == undefined) {
        $('#error').html('请上传组织机构代码扫描照!');
        return;
    }
    //协议和声明
    if($('#agreement').val() == '0'){
        $('#error').html('请您务必阅读并同意《融资人声明》及《相关协议》！');
        return;
    } else {
        if(checkOrgNumber($('input[name="orgCode"]').val())) {
            //表单提交
        	investorformSubmit();
        }else{
            $('#error').html('组织机构代码格式错误,请重新填写组织机构代码!');
            return;
        }
    }
}

/**
 * PC组织机构代码校验
 * @param code
 * @returns {boolean}
 */
function checkOrgNumber(code) {
    var ws = [3, 7, 9, 10, 5, 8, 4, 2];
    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var reg = /^([0-9A-Z]){8}-[0-9|X]$/;
    if (!reg.test(code)) {
        $('#error').html('组织机构代码不正确！');
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
        c9='0';
    }

    if(c9 != code.charAt(9)){
        $('#error').html('组织机构代码不正确，请输入正确的企业代码！');
        return false;
    }
    return true;
}

/**
 * 表单提交
 */
//PC提交申请融资人
function investorformSubmit(){
	var data = 'applyType=2'+ '&type=1' + '&legalNumberType=1' + '&realname=' + $('input[name="realname"]').val() + '&licenseNumber=' + $('input[name="licenseNumber"]').val() + '&company=' + $('input[name="company"]').val() + '&busLic=' + $('input[name="busLic"]').val()
				+ '&orgCode=' + $('input[name="orgCode"]').val() + '&province=' + $('select[name="province"] option:selected').val() + '&city=' + $('select[name="city"] option:selected').val() + '&district=' + $('select[name="district"] option:selected').val()
				+ '&contactAddress=' + $('textarea[name="contactAddress"]').val() + '&contact=' + $('input[name="contact"]').val() + '&email=' + $('input[name="email"]').val() + '&certPhoto1=' + $("#certPhoto1").attr("src") + '&certPhoto2=' + $("#certPhoto2").attr("src") + '&certPhoto3=' + '';

    $.ajax({
        type: 'POST',
        url: host + 'user/auth/addFinacier.htm',
		data: data + "&clientType=pc&token=" + getToken() +'&channelId=1',
		dataType: 'JSON',
        success: function(result) {
        	if(result.code == '0000') {
        		if(result.data.applyType == '2'){
        			window.location.href = 'status.html';
        		}else{
        			window.location.href = loginUrl;
        		}
        	}else if(result.code == '9999'){
        		if(result.data.applyType == '2'){
        			window.location.href = 'form.html';
        		}else if(result.data.url.indexOf('realName') > 0){
					window.location.href = 'unautherized.html';
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
