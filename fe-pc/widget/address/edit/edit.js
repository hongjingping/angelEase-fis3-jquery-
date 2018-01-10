$(function() {
    checkUserLogin();
    $('.address-line').show();

    var req = getRequest();
    var adrId = req.addrId;
    var adrType = req.type;


    /*
    * 获取随机token，并在提交表单的时候带上 randomToken
    * 2016-11-23 jihongzhang@creditease.cn
    */

    var getRandomTokenAjax = $.ajax({
        type: 'POST',
        url: host + 'address/getAddressToken.htm',
        data: token_client_data,
        dataType: 'JSON',
    })
    getRandomTokenAjax.done(function (data) {
        if (data.code == '0000') {
            storage.set('randomtoken', data.data.token);
        }
    })


    if (adrId != '' && typeof(adrId) != 'undefined') {
        /*
        * 权限校验
        * 如果返回是‘0000’， 代表有权限，如果是 ‘9999’ 没有权限
        * 2016-11-25 jihongzhang@creditease.cn
        */
        var checkPermissionAjax = $.ajax({
            type: 'POST',
            url: host + 'address/checkIsPermission.htm?addrId=' + req.addrId,
            data: token_client_data,
            dataType: 'JSON',
        })
        checkPermissionAjax.done(function (data) {
            if (data.code == '0000') {
                //
            } else if (data.code == '9999') {
                window.location.href = '/page/address/myaddress.html'
            }
        })

        $('#adrId').val(adrId);
        $('.detail-header-title').html('编辑地址');
        $.ajax({
            type: 'POST',
            url: host + '/address/addressInfo.htm?currAddId=' + adrId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000' && result.data != null) {
                    $('#consignee').val(result.data.consignee);
                    $('#mobile').val(result.data.mobile);
                    $('#zipcode').val(result.data.zipcode);
                    $('#address').val(result.data.address);
                    addressInit('city1', 'city2', 'city3', result.data.provinceCode, result.data.cityCode, result.data.districtCode);
                    $('#provinceCode').val(result.data.provinceCode);
                    $('#cityCode').val(result.data.cityCode);
                    $('#districtCode').val(result.data.districtCode);
                    if (result.data.isDefault != '1') {
                        $('#agreement').removeAttr('checked');
                    }
                } else if (result.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                }
            },
            error: function(e) {

                console.log(e);
            }
        });
    }else{
    	$('.detail-header-title').html('添加地址');
    }

    addressInit('city1','city2','city3','','','');
    //让省市区默认
    /*$('#city1').parent().find('span').html('--省份--')
    $('#city2').parent().find('span').html('--城市--');
    $('#city3').parent().find('span').html('--区县--');*/
    $(document).on('click', '.err-tips', function(e) {
        e.preventDefault();
        var clickFlag = $('.sprites').val();
        if (clickFlag == 1) {
            $('.sprites').val(0);
            $('#agreeDiv').removeClass('checked');
        } else {
            $('.sprites').val(1);
            $('#agreeDiv').addClass('checked');
        }
    });


    $(document).on('click', '.err-tips', function(e) {
        e.preventDefault();
        var clickFlag = $('#agreement').val();
        if (clickFlag == 1) {
            $('#agreement').val(0);
            $('#agreeDiv').removeClass('checked');
        } else {
            $('#agreement').val(1);
            $('#agreeDiv').addClass('checked');
        }
    });

    //var adrLength = req.adrLength;
    var isCommitted = true;
    $('#btn').click(function() {
        $('#token').val(getToken());
        if (isCommitted == false) {
            return;
        }
        var cc = checkSubmit();
        if (cc == false) {
            return;
        }

        $('#btn').off('click');

        var formData = $('#formAdr').serializeArray();
        var randomtoken = $.base64.encode(storage.get('randomtoken'))
        var testtoken = $.base64.encode('123')
        // 添加地址
        $.ajax({
            type: 'POST',
            url: host + 'address/addAddress.htm?type='+adrType + '&randomToken=' + randomtoken,
            data: formData,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    isCommitted = false;
                    if (result.data.proId != '' && result.data.proId != null) {
                        window.location.href = '../order/order.html';
                    } else {
                        window.location.href = '/page/address/myaddress.html';
                    }
                } else if (result.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                } else {
                	showError(result.desc);
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    });

    $('.clean').each(function () {
        $(this).click(function() {
            $(this).prev().val('');
        });
    })

    $('.warm-tips').find('span').click(function() {
        $('.warm-tips').hide();
    })

});

function checkSubmit() {
    if ($('input[name="consignee"]').val() == '') {
        showError('请填写收件人');
        return false;
    }
    if ($('input[name="mobile"]').val() == '') {
    	showError('请填写联系方式');
        return false;
    } else if (!(/^1[3|4|5|7|8]\d{9}$/.test($('input[name="mobile"]').val()))) {
    	showError('手机号码有误，请重填');
        return false;
    }
  //澳门特别行政区
    var str = $("select[name='province'] option:selected").val();
    var provinceStr = str.substring(str.indexOf("_")+1,str.length);
    if(provinceStr == '澳门特别行政区'){
    	if ($("select[name='province'] option:selected").val() == '' || $("select[name='province'] option:selected").val() == undefined || $("select[name='province'] option:selected").val() == '--省份--' || $("select[name='city'] option:selected").val() == '' || $("select[name='city'] option:selected").val() == undefined || $("select[name='city'] option:selected").val() == '--城市--') {
    		showError('请填写地址信息');
    		return false;
    	}
    }else{
    	// if ($("select[name='province'] option:selected").val() == '' || $("select[name='province'] option:selected").val() == undefined || $("select[name='province'] option:selected").val() == '--省份--' || $("select[name='city'] option:selected").val() == '' || $("select[name='city'] option:selected").val() == undefined || $("select[name='city'] option:selected").val() == '--城市--' || $("select[name='district'] option:selected").val() == '' || $("select[name='district'] option:selected").val() == undefined || $("select[name='district'] option:selected").val() == '--区县--') {
            if ($("select[name='province'] option:selected").val() == '' || $("select[name='province'] option:selected").val() == undefined || $("select[name='province'] option:selected").val() == '--省份--' || $("select[name='city'] option:selected").val() == '' || $("select[name='city'] option:selected").val() == undefined || $("select[name='city'] option:selected").val() == '--城市--' ) {
    		showError('请填写地址信息');
    		return false;
    	}
    }
    if ($('textarea[name="address"]').val().length < 4) {
    	showError('详细地址,不少于4个字');
        return false;
    }
    if ($('input[name="zipcode"]').val() == '') {
    	showError('请填写邮编');
        return false;
    }
    if ($('input[name="zipcode"]').val().length != '6') {
    	showError('请填写正确的邮编');
        return false;
    }
}

function showError(errorDesc){
	$('#error1').text(errorDesc);
	$('#error0').show();
}

function focusAll(fo) {
    $('#' + fo).html('');
}
