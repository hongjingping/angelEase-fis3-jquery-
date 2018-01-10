(function () {
    var request = getRequest();
    var orderId = request.orderId;
    var payType = storage.get('payType');
    checkUserLogin();
    checkUserStatus();
    var interval;
    checkOrderIdUser(orderId);
    var success = {
        init: function () {
            this.renderCommonTitle();
            this.cacheElements();
            this.bindEvents();
            this.renderPayType();
            this.bindHref();
        },
        cacheElements: function() {
            this.uploadInput = $('.img-voucher-wrapper input[type=file]');
        },
        bindEvents: function() {
            this.uploadInput.on('change', this.uploadAvatar.bind(this));
        },
        renderPayType: function() {
            if(payType && payType == 'fastPay'){
                $('#fastPay').show();
            }else {
                $('#onlinePay').show();
            }
        },
        uploadAvatar: function(e) {
            var file = e.target.files[0];
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
                var uploadFlag = reduceImg(this.result,2,orderId);
                if(uploadFlag) {
                    $('#uploadImg').attr('src',this.result).css('visibility', 'visible');
                }
            }
        },
        renderCommonTitle: function () {
            $('#cmn-header').text('投资项目');
        },

        bindHref: function () {
            $('.my-invest').on('click', function () {
                window.location.href = baseUrl + 'invest/list.html';
            });

            $('.project-list').on('click', function () {
                window.location.href = baseUrl + 'home/home.html';
            });
        }
    };

    success.init();

    //轮询检验是否支付成功
    function checkPay(){
        $.ajax({
            type: 'POST',
            url: host + 'fastPay/queryPayStatus.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(data) {
                if (data.code == "0000") {
                    clearInterval(interval);
                    if(payType && payType == 'fastPay'){
                        $('#fast-no').hide();
                        $('#fast-ok').show();
                    }else { // 网银支付
                        $('#online-no').hide();
                        $('#online-ok').show();
                    }

                } else if (data.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                } else {
                    clearInterval(interval);
                    $('#fast-no').hide();
                    $('#fast-ok').show();
                    $('.reminder').find('.content').html(data.desc);
                }
            },
            error: function(e) {
                // console.log(e);
            }
        });
    }
    checkPay();

    // 校验订单状态  如果已经签名 跳转到我的订单
    $.ajax({
        type: 'POST',
        url: host + 'order/getOrderStatus.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                if(data.data == '3' && payType != 'fastPay'){
                	var readSmartAlert = new SmartAlert({
                	    title: '提示',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您已经上传过打款凭证，无需再次上传。</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                    location.href = 'proofsuccess.html';
                }else if(data.data == '2'){
                    clearInterval(interval);
                    $('#pay-no').hide();
                    $('#pay-ok').show();
                }
            } else if (data.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
            console.log(e);
        }
    });

    interval = setInterval(checkPay,5000);

    $("#upload").click(function () {

        var imgStr = $('#uploadImg').attr('src');
        if (imgStr == '' || imgStr == null || typeof(imgStr) == undefined) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请选择要上传的图片</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return;
        }

        if (imgStr.length >= 2801747) {
            var readSmartAlert = new SmartAlert({
                title: '提示',
                content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请选择2M以内的图片</span>',
                type: 'confirm',
                okText: '我知道了',
                maskClosable: false,
            });
            readSmartAlert.open();
            return;
        }
        var paramData = {"orderId": orderId};
        var wholeData = extend(paramData, token_client_data, {});
        $.ajax({
            type: 'POST',
            url: host + 'invest/doUploadPaySuccess.htm',
            data: wholeData,
            dataType: 'JSON',
            success: function (data) {
                if (data.code == '0000'){
                	var readSmartAlert = new SmartAlert({
                	    title: '成功',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                    location.href = 'proofsuccess.html';
                } else if (data.code == '4000') {
                    // location.href = loginUrl;
                    handleLoginTimeout();
                } else if (data.code == '5000') {
                    location.href =  indexUrl;
                } else{
                	var readSmartAlert = new SmartAlert({
                	    title: '错误',
                	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                	    type: 'confirm',
                	    okText: '我知道了',
                	    maskClosable: false,
                	});
                	readSmartAlert.open();
                }
            },error:function(e){
                console.log(e);
            }
        });
    });

})();