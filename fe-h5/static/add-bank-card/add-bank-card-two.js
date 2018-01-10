/**
 * Created by jingpinghong on 2016/11/5.
 */
(function(){
    $(function () {
        var BankCommon = {
            init: function () {
                this.setHeader();
            },
            setHeader: function () {
                $('.cmn-header-title').text('添加银行卡');
            }
        };
        BankCommon.init();

        //获取手机号
        $.ajax({
            type:'post',
            url: host+"/bindbankcard/cacheBindBankCardMobile.htm",
            dataType:'JSON',
            data: {
                token: token_client_data.token,
                clientType: token_client_data.clientType
            },
            //成功响应后调用
            success: function (result) {
                if (result.code == '0000') {
                    var phoneNum = result.data.mobile;
                    $('#phonenumHidden').val(phoneNum);
                    $('#phonenum').text(phoneNew(phoneNum));
                } else if (result.code == '9999') {
                    window.history.back(-1);
                } else {
                    new SmartToast({
                        content: result.desc,
                        type: 'warn',
                        duration: 3
                    });
                }

                $("#settime-btn").click(function(){
                    sendSMS($('#phonenumHidden').val());
                });
                //进去后就初始化，执行倒计时
                sendSMS($('#phonenumHidden').val());
            },
            //错误响应时调用
            error: function (data) {

            },
            //响应完成时调用
            conplete: function (data) {
            }
        });

        function phoneNew(phone) {
            if(phone != '' && phone != null){
                phone2 = phone.replace(/\s/g,"").replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                return phone2;
            }
            return phone;
        }
    });
    checkUserLogin();
//手机验证码获取倒计时60秒
    var clock = '';
    var nums = 60;
    var btn;
    function countDownSmsTime(thisBtn) {
        btn = thisBtn;
        //将按钮置为不可点击
        btn.disabled = true;
        btn.value = nums + '秒';
        btn.style.color = '#3f3f3f';
        //一秒执行一次
        clock = setInterval(doLoop, 1000);
    }
    function doLoop() {
        nums--;
        if(nums > 0){
            btn.value = nums+'秒';
        }else{
            //清除js定时器
            clearInterval(clock);
            btn.disabled = false;
            btn.value = '重新获取';
            btn.style.color = '#E1C078';
            //重置时间
            nums = 60;
        }
    }

    function sendSMS(phone){
        var data = null ;
        //校验手机号格式
        if(is_mobile(phone)) {
            $.ajax({
                type:'post',
                url: host+"bindbankcard/sendMsg.htm",
                dataType:'JSON',
                data: {
                    token: token_client_data.token,
                    clientType: token_client_data.clientType,
                    "mobile" : $.base64.encode(phone)
                },
                //成功响应后调用
                success: function (result) {
                    if (result.code == '0000') {
                        var btn1 = document.getElementById('settime-btn');
                        countDownSmsTime(btn1);
                    }  else {
                        new SmartToast({
                            content: result.desc,
                            type: 'warn',
                            duration: 3
                        });
                    }
                },
                //错误响应时调用
                error: function (data) {

                },
                //响应完成时调用
                conplete: function (data) {
                }
            });
        }
    }

    //校验手机号
    function is_mobile(phone){
        if(phone==null || phone=='' || phone==undefined){
            return false;
        }
        var _phone= phone.replace(/\s/g,"");
        var pattern=/^1\d{10}$/;
        if(!pattern.test(_phone)){
            return false;
        }
        return true;
    }

    //收不到验证码的模态框
    $("#no-receive-phone").click(function(){
        $("#no-phone-num").css('display','block');
    });
    $("#no-phone").click(function(){
        $("#no-phone-num").css('display','none');
    });
    $("#del-phone-num").click(function(){
        $("#no-phone-num").css('display','none');
    });

    //验证码输入框的失去焦点的事件
    $('#phone-code').on("blur",function(){
        checkLength();
    });
    //confirm-btn-two 验证码输入结束后，向后台确认是否绑定成功，通过后发起ajax请求
    $('#confirm-btn-two').click(function() {

        var phonecode = $('#phone-code').val();
        if(phonecode == '' || phonecode == null){
            return;
        }
        var addFrom = storage.get('addBankFrom');
        $.ajax({
            url: host + 'bindbankcard/bindPayBankCard.htm',
            dataType: 'JSON',
            type: 'POST',
            data: {
                token: token_client_data.token,
                clientType: token_client_data.clientType,
                code : phonecode
            },
            success: function (result) {
                if (result.code == '0000') {
                    //如果绑定成功，需要跳到下一个页面
                    $('#bind-success').css('display','block');
                    if (addFrom == 'bankcenter') {
                        window.setInterval(function () {
                            window.location.href = '/page/bankcenter/mybank.html'
                        }, 3000)
                    }else {
                        var req = getRequest();
                        var proId = req.proId;
                        var orderId = req.orderId;
                        var proinveseId = req.proinveseId;
                        var fromPayPage = req.fromPayPage;
                        window.setInterval(function () {
                            window.location.href = '/page/banklist/bank-list.html?proId=' + proId + '&orderId=' + orderId + '&fromPayPage=' + fromPayPage + '&proinveseId=' + proinveseId;
                        }, 3000)
                    }

                } else if (result.code == '4000') {
                    window.location.href = loginUrl;
                }else {
                    new SmartToast({//提示框
                        content: result.desc,
                        type: 'warn',
                        duration: 3
                    });
                }

            },
            //错误响应时调用
            error: function (data) {

            },
            //响应完成时调用
            conplete: function (data) {

            }

        });

    });


    //当验证码不为空的时候,按钮变黄色,获取手机号验证码
    function checkLength() {
        var phoneCode = document.getElementById("phone-code");
        var phoneCode2 = /\d{6}/g;
        if (!phoneCode2.test(phoneCode.value)) {
            new SmartToast({
                content: '您输入的验证码不正确,请确认后再次输入。',
                type: 'warn',
                duration: 3
            });
            $('#confirm-btn-two').css("backgroundColor","");
            return ;
        }else{
            $('#confirm-btn-two').css("backgroundColor","#E1B555");
        }
    }
})();
