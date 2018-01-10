(function () {

    var w=new WritingPad();
    var tempStatus;
    checkUserLogin();
    var req = getRequest();
    var orderId = req.orderId;
    var proId = req.proId;
    var proinveseId = req.proinveseId;


	var Sign = {
		init: function () {
			this.signHeader();
		},
		signHeader: function () {
            $.ajax({
                type: 'POST',
                url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(data) {
                    if (data.code == "0000") {
                        if(data.data == '6'){
                            tempStatus = data.data;
                            $('.cmn-header-title').text('重签');
                        } else {
                            $('.cmn-header-title').text('签约页');
                        }
                    }
                },
                error: function(e) {
                }
            });

		}
	};
    Sign.init();
	checkOrderIdUser(orderId);
  	if(!checkSign(orderId)){
  		return;
  	}
  	rejectInfo(orderId);

  	// 校验订单状态  如果已经签名 跳转到我的订单
    $.ajax({
        type: 'POST',
        url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                if(data.data != '0' && data.data != '6' && data.data != '14'){
                    new SmartToast({
                        content: '您已经做过签名，无需再次签名',
                        type: 'warn',
                        duration: 3
                    });
                    window.location.href = indexUrl;
                }
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

	$(".btn-wrapper").click(function(){
		$("#saveCanvas").click();
		var image = $("#myImg img").attr("src");
        var dataParam = {"image":image,"orderId":orderId};
        var dataAll = extend(dataParam,token_client_data,{});
    		$.ajax({
            type:'post',
            url:host+'order/storeImg.htm',
            data: dataAll,
            cache:false,
            dataType:'json',
            async:false,
            success:function(data){
              //港澳台自动跳转
            	if(data.code == '0000'){
                    if (tempStatus == '6') {
                        window.location.href = baseUrl + 'invest/signok.html';
                    } else {
                        $.ajax({
                            url: host + 'order/getUserCheck.htm',
                            type: 'post',
                            dataType: 'json',
                            data:token_client_data,
                            success:function (result) {
                                // 身份证实名用户
                                if (result.code == '0000' && result.data.idcardtype != '1') {
                                    // 初期化判断上传的身份证是否有效
                                    window.location.href = baseUrl + 'offlinepayment/offlinepayment.html?orderId=' + orderId;
                                }else{
                                    window.location.href = baseUrl + 'payment/paymentmethod.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                                }
                            }
                        });
                    }
            	}else if (data.code == '4000') {
            		window.location.href = loginUrl;
            	}
            },error:function(e){
        	}
        });
    });

	// 重签成功判断
	function checkSign(orderId) {
		var flag = true;
		$.ajax({
            type:'post',
            url:host+'order/checkResign.htm?orderId=' + orderId,
            data: token_client_data,
            cache:false,
            dataType:'json',
            async:false,
            success:function(data){
            	if(data.code == '0000'){
            		if(data.data.reSign === '2'){
                        new SmartToast({
                            content: '你已重签成功,不能重复操作',
                            type: 'warn',
                            duration: 3
                        });
            			flag = false;
            		}
            	}else if (data.code == '4000') {
            		window.location.href = loginUrl;
            	}
            },error:function(e){
        	}
        });
        return flag;
	}
})();
