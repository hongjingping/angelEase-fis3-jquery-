(function () {

    var generateCodeUrl;
    var readFlag = false;
    var request = getRequest();
    var orderId = request.orderId;

    var interval;
    var PaySign = {
        init: function () {
            this.setHeaderTitle();
            $.ajax({
                type: 'POST',
                url: host + 'order/getReadFlag.htm?orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(data) {
                    if (data.code == '4000') {
                        // window.location.href = loginUrl;
                        handleLoginTimeout();
                    }
                    readFlag = data.data;
                },
                error: function(e) {
                }
            });
        },
        setHeaderTitle: function () {
            $('#cmn-header').text('投资项目');
        }
    };

    var scrollEnsure = {
        init: function() {
            this.cacheElements();
            this.bindEvents();
            this.$ensureBtn.attr('disabled', false);
        },
        cacheElements: function() {
            this.$signArticle = $('.sign-container .sign-article');
            this.$ensureBtn = $('.sign-confirm button')
        },
        bindEvents: function() {
            this.$signArticle.on('scroll', this.handleScrollEnsure.bind(this));
        },
        handleScrollEnsure: function(e) {
            var targetEl = e.target;
            var distance = targetEl.scrollHeight - ($(targetEl).innerHeight() + targetEl.scrollTop);
            if (distance < 100) {
                this.changeEnsureBtnStatus();
                this.$signArticle.off('scroll');
            }
        },
        changeEnsureBtnStatus: function() {
            readFlag = true;
            $.ajax({
                type: 'POST',
                url: host + '/order/saveReadFlag.htm?orderId=' + orderId,
                data: token_client_data,
                dataType: 'JSON',
                success: function(result) {
                   if (result.code == '4000') {
                       // window.location.href = loginUrl;
                       handleLoginTimeout();
                   }
                },
                error: function(e) {
                }
            });
        }
    };

    PaySign.init();
    scrollEnsure.init();

    checkUserLogin();

    checkUserStatus();

    checkOrderIdUser(orderId);

    var qrcodeSmartAlert = new SmartAlert({
        title: '提示',
        content: '<div class="center-title">打开微信扫一扫继续签约</div><span class="content-txt"></span><div class="qrcode" id="qrcode"></div>',
        type: 'confirm',
        // okText: ' ',
        footer: null,
        maskClosable: false,
    });

    // 生成二维码，草签用
    function generateCode(generateCodeUrl){
        $.ajax({
            type: 'POST',
            url: host + 'sig/generateCode.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(data) {
                if (data.code == "0000") {
                    var url = wapUrl + generateCodeUrl + '&encodeStr=' + data.data;
                    $('.qrcode').html('');
                    // OrderProtocol.init();
                    var qrcode = new QRCode('qrcode', {
                      text: url,
                      width: 200,
                      height: 200,
                      colorDark : '#000000',
                      colorLight : '#ffffff',
                      correctLevel : QRCode.CorrectLevel.H
                    });
                    qrcodeSmartAlert.open();
                } else if (data.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                }
            },
            error: function(e) {
            }
        });
    }

    // 校验是否有签名完成
    function checkSignFlag(){
        $.ajax({
            type: 'POST',
            url: host + 'sig/getSigFlag.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(data) {
                if (data.code == '0000' && data.desc == '1') {
                    clearInterval(interval);
                    if($('#resignFlag').val() == '0'){
                        window.location.href = baseUrl + 'pay/pay?orderId=' + orderId + '&sign=' + data.data;
                    }else{
                        // 重签成功
                        window.location.href = indexUrl;
                    }
                } else if (data.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                }
            },
            error: function(e) {
            }
        });
    }

    // 订单确认页
    $('#btnConfirm').click(function() {
        checkReadFlag();
        if($('#apply-protocol').is(':checked')){
            if(!readFlag){
                var readSmartAlert = new SmartAlert({
                    title: '报错',
                    content: '<i class="ae-icon ae-icon-attention notice-attention" style="float:left;"></i><span class="content-txt" style="float:left;width:90%;text-align:left;">您还未看完所有的协议，请拉动滚动条看完所有的协议才可以进行下一步投资步骤。</span>',
                    type: 'confirm',
                    okText: '我知道了',
                    maskClosable: false,
                });
                readSmartAlert.open();
                return false;
            } else {
               setGenerateCodeUrl();
            }
        }else{
            var newSmartAlert = new SmartAlert({
                title: '报错',
                content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请先同意以上条款。</span>' ,
                type: 'confirm',
                okText: '我知道了',
                maskClosable: false,
            });
            newSmartAlert.open();
        }
    });

    // 判断是否阅读过协议
    function checkReadFlag(){
        $.ajax({
            type: 'POST',
            url: host + 'order/getReadFlag.htm?orderId=' + orderId,
            data: token_client_data,
            dataType: 'JSON',
            success: function(result) {
                if (result.code == '4000') {
                    // window.location.href = loginUrl;
                    handleLoginTimeout();
                }
                readFlag = result.data;
            },
            error: function(e) {
            }
        });
    }

    // 设置扫码签约、重签的URL
    function setGenerateCodeUrl() {
        $.ajax({
            url: host + 'order/getUserCheck.htm',
            type: 'post',
            dataType: 'json',
            data: token_client_data
        }).then(function (data) {
            var defer = $.Deferred();
            // 身份证实名用户
            if (data.code == '0000' && data.data.idcardtype == '1') {
                $.ajax({
                    url: host + 'order/checkCard.htm',
                    type: 'post',
                    dataType: 'json',
                    data: token_client_data
                }).then(function (data) {
                    if (data.code == '0000' && data.data.isValid) {
                        generateCodeUrl = 'invest_sign/sign-pc.html?orderId=' + orderId;
                    } else if (data.code == '4000') {
                        // location.href = loginUrl;
                        handleLoginTimeout();
                    } else if (data.code == '9999') {
                        var newSmartAlert = new SmartAlert({
                            title: '报错',
                            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">' + data.desc + '</span>',
                            type: 'confirm',
                            okText: '我知道了',
                            maskClosable: false,
                        });
                        newSmartAlert.open();
                    } else {
                        generateCodeUrl = 'invest_sign_idupload/upload-idcard-pc.html?orderId=' + orderId;
                    }
                    defer.resolve();
                });
            } else if (data.code == '0000' && data.data.idcardtype != '1') {
                generateCodeUrl = 'invest_sign/sign-pc.html?orderId=' + orderId;
                defer.resolve();
            }
            return defer.promise();
        }).then(function () {
            generateCode(generateCodeUrl);
            interval = setInterval(checkSignFlag, 2000);
        });
    }
    /************************************************* Dialog *********************************************************/
    var OrderProtocol = {
        init: function () {
            this.showDialog();
            this.closeDialog();
        },

        showDialog: function () {
            this.initDialog();
            this.adjustDialog();
        },

        adjustDialog: function () {
            $(window).on('resize scroll', function () {
                $('.wgt-dialog-protocol').css('left', ($(window).width() - $('.wgt-dialog-protocol').outerWidth()) / 2);
                $('.wgt-dialog-protocol').css('top', ($(window).height() - $('.wgt-dialog-protocol').outerHeight()) / 2 + $(window).scrollTop());
            });
        },

        initDialog: function () {
            $('.wgt-dialog-protocol').css('left', ($(window).width() - $('.wgt-dialog-protocol').outerWidth()) / 2);
            $('.wgt-dialog-protocol').css('top', ($(window).height() - $('.wgt-dialog-protocol').outerHeight()) / 2 );
        },

        closeDialog: function () {
            $('.wgt-dialog-protocol').find('.close').click(function () {
                $('.mask').fadeOut('slow');
                $('.wgt-dialog-protocol').fadeOut('slow');
            });
        }
    }

})();