/*
 *  jingpinhong@creditease.cn
 */
(function () {

    var ModifyPass = {
        init: function () {
            this.renderCommonTitle();
            this.addFrom();
        },

        renderCommonTitle: function () {
            $('#cmn-header').text('添加银行卡');
        },
        //去到个人中心页面
        addFrom: function () {
            if (document.referrer != '' && document.referrer != null) {
                var pageArray = [
                    '/page/add-bank-card/stepone.html'
                ];
                var hitResult = pageArray.some(function(item) {
                    return ~document.referrer.indexOf(item)
                });

                if (hitResult) {
                    storage.set('addBankFrom', 'bankcenter');
                } else {
                    storage.set('addBankFrom', 'order');
                }
            }
        }
    };

    ModifyPass.init();

    //业务
    checkUserLogin();


    //1127jingpinghong

    //获取手机号
    $.ajax({
        type:'post',
        //接口地址
        url: host+"/bindbankcard/cacheBindBankCardMobile.htm",
        //datatype服务器返回的数据格式
        dataType:'JSON',
        data: {
            token: token_client_data.token,
            clientType: token_client_data.clientType
        },
        //成功响应后调用
        success: function (result) {
            if (result.code == '0000') {//成功
                var phoneNum = result.data.mobile;
                $('#msg-code').val(phoneNum);
                $('#phoneNum').html(phoneNew(phoneNum));
                /* 获取验证码 */
                var sendMsgFlag = storage.get('sendMsg');
                if (sendMsgFlag == '1') {
                    sendSMS(phoneNum);
                    storage.remove('sendMsg');
                }

            } else {
                showError( result.desc);
            }

            $("#settime-btn").click(function(){
                sendSMS($('#msg-code').val());
                $("#settime-btn").removeClass('timeout-num');
                $("#settime-btn").addClass('timeout');
            });

        },
        //错误响应时调用
        error: function (data) {

        },
        //响应完成时调用
        conplete: function (data) {
        }
    });
    function phoneNew(phone) {
        phone2 = phone.replace(/\s/g,"").replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        return phone2;
    }


//显示错误信息
function showError(errorDesc){
    $('#error1').text(errorDesc);
    $('#success').hide();
    $('#error0').show();
}
//显示发送短信验证码信息
function showSuccess(successDesc){
    $('#successMsg').text(successDesc);
    $('#error0').hide();
    $('#success').show();
}

//收不到短信提示语
//$('#no-Msg').on('mouseenter',function(){
//    $('.noMsgTips').css('display','block');
//});
//$('#no-Msg').on('mouseout',function(){
//    $('.noMsgTips').css('display','none');
//});

//倒计时
//手机验证码获取倒计时60秒
var clock = '';
var nums = 60;
var btn;
function countDownSmsTime(thisBtn) {
    btn = thisBtn;
    btn.disabled = true; //将按钮置为不可点击
    btn.value = nums+'秒';
    btn.style.color = '#3F3F3F';
    clock = setInterval(doLoop, 1000); //一秒执行一次


}

function doLoop() {
    nums--;
    if(nums > 0){
        btn.value = nums+'秒';
    }else{
        clearInterval(clock); //清除js定时器
        btn.disabled = false;
        btn.value = '重新获取';
        btn.style.color = '#E1C078';
        $("#settime-btn").removeClass('timeout-num');
        $("#settime-btn").addClass('timeout');
        nums = 60; //重置时间

    }
}
//校验手机号是否合法
function is_mobile(phone){
    if(phone==null || phone=='' || phone==undefined){
        return false;
    }
    var _phone= phone.replace(/\m/g,"");
    var pattern=/^1\d{10}$/;
    if(!pattern.test(_phone)){
        return false;
    }
    return true;
}

//如果后台返回大于1个参数,就在形参里面往后
    function sendSMS(phone){
    var data = null ;
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
                    $("#settime-btn").removeClass('timeout');
                    $("#settime-btn").addClass('timeout-num');

                } else if (result.code == '4000') {
                    //window.location.href = loginUrl;
                     handleLoginTimeout();
                } else {
                    showError( result.desc);
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

//nextBtn-two 验证码输入结束后，向后台确认是否绑定成功，通过后发起ajax请求
$('#nextBtn-two').click(function() {
    var code = $('#code').val();
    if(code == '' || code == null || code == undefined){
        return;
    }
    //调用ajax，发送数据请求
    $.ajax({
        url: host + 'bindbankcard/bindPayBankCard.htm',
        dataType: 'JSON',
        type: 'POST',
        data: {
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            //短信验证码
            code : code
        },
        success: function (result) {
            //调到数据进行渲染页面
            if (result.code == '0000') {  //成功
                //如果绑定成功，需要跳到下一个页面
                window.location.href = '/page/add-bank-card/stepthree.html' ;
            } else {
                showError(result.desc);
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

})();

