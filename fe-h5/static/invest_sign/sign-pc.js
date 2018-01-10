(function () {

    var req = getRequest(); 
    var orderId = req.orderId;
    var encodeStr = req.encodeStr;
    var w = new WritingPad();

	var Sign = {
		init: function () {
			this.signHeader();
		},

		signHeader: function () {
            $('.cmn-header-title').text('签约页');
		}
	};

	Sign.init();

    // 判断是重签还是签约，设置Header部分的名字
    function setHeaderText(token_client_data_pc) {
        $.ajax({
            type: 'POST',
            url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
            data: token_client_data_pc,
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

    if (typeof(encodeStr) != 'undefined') {
        // 扫描pc二维码 做登录动作
        $.ajax({
            url: host + 'sig/doLogin.htm',
            type: 'post',
            dataType: 'json',
            data: {'orderId': orderId,'encodeStr': encodeStr,'clientType': 'wap'},
            async: false,
            success:function (data) {
                if (data.code == '0000') {
                    // alert(data.data);
                    setToken(data.data);
                    var token_client_data_pc = {'token':data.data,'clientType':'wap'};
                    token_client_data = token_client_data_pc;
                    setHeaderText(token_client_data_pc);
                    // alert(orderId);
                    checkOrderIdUser(orderId);

                    checkOrderSign(token_client_data_pc);
                } else if (data.code == '9999') {
                    new SmartToast({
                        content: data.desc,
                        type: 'warn',
                        duration: 3
                    });
                }
            },error:function (e) {
            }
        });
    }

    rejectInfo(orderId);
    
    // 校验订单状态  如果已经签名 跳转到我的订单
    function checkOrderSign (token_client_data_pc) {
        $.ajax({
            type: 'POST',
            url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
            data: token_client_data_pc,
            dataType: 'JSON',
            success: function(data) {
                // alert(data.code);
                if (data.code == "0000") {
                    if(data.data != '0' && data.data != '6' && data.data != '14'){
                        new SmartToast({
                            content: '您已经做过签名，无需再次阅读协议',
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
    }

    $(".btn-wrapper").click(function(){
        $("#saveCanvas").click();
        var image = $("#myImg img").attr("src");
        var dataParam = {"image":image,"orderId":orderId,'type': 'pc'};
        var dataAll = extend(dataParam,token_client_data,{});
        $.ajax({
            type:'post',
            url:host+'order/storeImg.htm',
            data: dataAll,
            cache:false,
            dataType:'json',
            async:false,
            success:function(data){
                if(data.code == '0000'){
                    new SmartToast({
                        content: '签名完成，请继续在pc端进行交易',
                        type: 'success',
                        duration: 3
                    });
                    setTimeout(function(){window.location.href = indexUrl;}, 2000);
                }else if (data.code == '4000') {
                    window.location.href = loginUrl;
                }
            },error:function(e){
            }
        });
   });

})();