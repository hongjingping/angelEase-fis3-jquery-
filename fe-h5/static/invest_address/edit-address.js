(function () {

	var EditAddress = {
		init: function () {
			this.editAddressHeader();
			this.checkBoxInit();
            // this.checkPermission();
		},

		editAddressHeader: function () {
			$('.cmn-header-title').text('编辑地址');
		},
		checkBoxInit: function() {
			$("#i-check-btn").click(function() {
                if ($(this).hasClass("i-check-unchecked")) {
                	$(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");
                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                }

			});
		},
	};
	EditAddress.init();
	checkUserLogin();
    var req = getRequest();
    var adrId = req.id;
    var adrType = req.type;
    var proId = req.proId;


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


    var defaultFlag = req.defaultFlag;
    //判断是添加还是编辑 0:添加 1:编辑
    var addOrUpdateFlag = req.addOrUpdateFlag;
    if(addOrUpdateFlag == '0'){
    	$('.cmn-header-title').text('新增地址');
    }
    if (adrId != '' && typeof(adrId) != 'undefined') {
         /*
    * 权限校验
    * 如果返回是‘0000’， 代表有权限，如果是 ‘9999’ 没有权限
    * 2016-11-25 jihongzhang@creditease.cn
    */
    var checkPermissionAjax = $.ajax({
        type: 'POST',
        url: host + 'address/checkIsPermission.htm?addrId=' + req.id,
        data: token_client_data,
        dataType: 'JSON',
    })
    checkPermissionAjax.done(function (data) {
        if (data.code == '0000') {
            //
        } else if (data.code == '9999') {
            window.location.href = '/page/invest_address/my-address.html'
        }
    })

        $("#adrId").val(adrId);
        $.ajax({
            type: 'POST',
            url: host + 'address/addressInfo.htm?currAddId=' + adrId,
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
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                }
            },
            error: function(e) {
            }
        });
    } else {
        addressInit('city1', 'city2', 'city3', '', '', '');
    }

    if(defaultFlag == 1){
   	     $('#agreement').val(1);
	     $('#i-check-btn').addClass('i-check-checked');
	     $('#i-check-btn').removeClass('i-check-unchecked');
    }else{
   	     $('#agreement').val(0);
    }

    $("#i-check-btn").click(function() {
	    var clickFlag = $('#agreement').val();
	    if ($(this).hasClass("i-check-unchecked")) {
	    	$('#agreement').val(0);
	    	//不被选中
	    	$(this).addClass("i-check-unchecked");
	        $(this).removeClass("i-check-checked");
	    } else {
	    	//被选中
	    	$('#agreement').val(1);
	    	$(this).removeClass("i-check-unchecked");
	        $(this).addClass("i-check-checked");
	    }

    });

    var isCommitted = true;
    $(".key-operation-button-normal").on("click", function () {
        $("#token").val(getToken());
        if (isCommitted == false) {
            return;
        }
        var cc = checkSubmit();
        if (cc == false) {
            return;
        }
        var formData = $("#formAdr").serializeArray();
        var randomtoken = $.base64.encode(storage.get('randomtoken'))
        $.ajax({
            type: 'POST',
            url: host + '/address/addAddress.htm?type='+adrType + '&randomToken=' + randomtoken,
            data: formData,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '0000') {
                    isCommitted = false;
                    if (proId != '' && typeof(proId) != 'undefined') {
                        window.location.href = baseUrl + 'invest_address/my-address.html?proId=' + proId;
                    } else {
                        window.location.href = baseUrl + 'invest_address/my-address.html';
                    }
                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                } else {
                    new SmartToast({
                        content: result.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            },
            error: function(e) {
            }
        });
    })
})();

// 参数验证
function checkSubmit() {
    if ($("input[name='consignee']").val() == '') {
        new SmartToast({
            content: '请填写收件人',
            type: 'warn',
            duration: 3
        });
        return false;
    }
    if ($("input[name='mobile']").val() == '') {
        new SmartToast({
            content: '请填写联系方式',
            type: 'warn',
            duration: 3
        });
        return false;
    } else if (!(/^1[3|4|5|7|8]\d{9}$/.test($("input[name='mobile']").val()))) {
        new SmartToast({
            content: '手机号码有误，请重填',
            type: 'warn',
            duration: 3
        });
        return false;
    }
    if ($("input[name='zipcode']").val().length < 6 ) {
        new SmartToast({
            content: '邮编不少于6位',
            type: 'warn',
            duration: 3
        });
        return false;
    }
    //澳门特别行政区
    var str = $("select[name='province'] option:selected").val();
    var provinceStr = str.substring(str.indexOf("_")+1,str.length);
    if (provinceStr == '澳门特别行政区') {
    	if ($("select[name='province'] option:selected").val() == '' 
            || $("select[name='province'] option:selected").val() == undefined 
            || $("select[name='province'] option:selected").val() == '--省份--' 
            || $("select[name='city'] option:selected").val() == '' 
            || $("select[name='city'] option:selected").val() == undefined 
            || $("select[name='city'] option:selected").val() == '--城市--') {
    		new SmartToast({
    			content: '请填写地址信息',
    			type: 'warn',
    			duration: 3
    		});
    		return false;
    	}
    } else {
        if ($("select[name='province'] option:selected").val() == '' 
            || $("select[name='province'] option:selected").val() == undefined 
            || $("select[name='province'] option:selected").val() == '--省份--' 
            || $("select[name='city'] option:selected").val() == '' 
            || $("select[name='city'] option:selected").val() == undefined 
            || $("select[name='city'] option:selected").val() == '--城市--' ) {
    		new SmartToast({
    			content: '请填写地址信息',
    			type: 'warn',
    			duration: 3
    		});
    		return false;
    	}
    }

    if ($("input[name='address']").val().length < 4) {
        new SmartToast({
            content: '详细地址,不少于4个字',
            type: 'warn',
            duration: 3
        });
        return false;
    }
}

function focusAll(fo) {
    $("#" + fo).html("");
}