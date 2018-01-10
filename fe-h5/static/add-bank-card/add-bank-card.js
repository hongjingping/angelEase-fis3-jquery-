/**
 * Created by hongjingping on 16/11/2.
 */
(function () {

    var BankCommon = {
        init: function () {
            this.setHeader();
            this.addFrom();
        },
        setHeader: function () {
            $('.cmn-header-title').text('添加银行卡');
        },
        addFrom: function () {
            if (document.referrer != '' && document.referrer != null) {
                var pageArray = [
                    '/page/bankcenter/mybank',
                    '/page/bankcenter/mybank-without-data',
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
        },
    };
    BankCommon.init();


    //业务开始,图形验证码
    var picUrl = host + "/bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=wap";
    $("#picImg").attr('src', picUrl);


    $('#picImg').on('click', function () {
        var picUrl = host + "bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=wap";
        $("#picImg").attr('src', picUrl + '&rand='+ Math.random());
    });


    //点击小图标弹出持卡人模态框
    $("#person-tip").click(function(){
        $("#person-model").css('display','block');
    });
    $("#tips-words").click(function(){
        $("#person-model").css('display','none');
    });
    $("#del-person-model").click(function(){
        $("#person-model").css('display','none');
    });

    //点击小图标弹出手机号码模态框
    $("#mobile-tips").click(function(){
        $("#phone-model").css('display','block');
    });
    $("#tipsWord").click(function(){
        $("#phone-model").css('display','none');
    });
    $("#del-phone").click(function(){
        $("#phone-model").css('display','none');
    });


    //添加银行卡页面用户姓名
    $.ajax({
        url: host + 'user/auth/realNameResult.htm',
        dataType: 'JSON',
        type: 'POST',
        data: {
            token: token_client_data.token,
            clientType: token_client_data.clientType
        },
        success: function (result) {
            if(result.code == '0000'){
                $('#name').html(result.data.realName);
            }else if (result.code == '4000'){
                location.href = loginUrl;
            }else if (data.code == '9999') {
                        new SmartToast({
                            content: '系统异常，请稍后再试',
                            type: 'warn',
                            duration: 2
                        });
                }
        },
        error:function(e) {
        }
    });
    if($('#account').val() != null && $('#account').val() != undefined && $('#account').val() != ''){
        var bankCardNo = $('#account').val().replace(/\s/g,"");
        bankcardtype(bankCardNo);
    }
})();

//校验银行卡类型
function bankcardtype(bankCardNo){
    if(bankCardNo != "" && bankCardNo != null){
        $('#bankCardType').css("display",'block');
        //去后台请求校验银行卡号
        $.ajax({
            type:'post',
            url: host+'bindbankcard/checkBindBankCardType.htm?bankCardNo=' + $.base64.encode(bankCardNo),
            data:{
                token: token_client_data.token,
                clientType: token_client_data.clientType
            },
            dataType:'JSON',
            //成功响应后调用
            success: function (result) {
                var code=$('#account').val();
                var _code= code.replace(/\s/g,"");
                if (result.code == '0000') {
                    //银行卡验证成功
                    $('#check-text').html(result.data.bankName +'&nbsp;'+result.data.bankTypeName);
                } else {
                    //银行卡验证失败
                    $('#account').val('');
                    var oInput = document.getElementById("account");
                    oInput.focus();
                    $('#check-text').html(result.desc);
                }
            },
            //错误响应时调用
            error: function (data) {
            },
            //响应完成时调用
            conplete: function (data) {
            }
        })
    }else{
    }
}

checkUserLogin();
//银行卡号4位一个空格
function formatBankNo (BankNo){
    if (BankNo.value == "") return;
    var account = new String (BankNo.value);
    account = account.substring(0,24);
    //帐号的总数, 包括空格在内
    if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
        //对照格式
        if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
            var accountNumeric = accountChar = "", i;
            for (i=0;i<account.length;i++){
                accountChar = account.substr (i,1);
                if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i=0;i<accountNumeric.length;i++){
                if (i == 4) account = account + " ";
                if (i == 8) account = account + " ";
                if (i == 12) account = account + " ";
                if (i == 16) account = account + " ";
                account = account + accountNumeric.substr (i,1)
            }
        }
    } else {
        account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
    }if (account != BankNo.value) BankNo.value = account;
};

//鼠标离开银行卡号后自动检验卡类型
$('#account').blur(function(){
    var bankCardNo = $('#account').val().replace(/\s/g,"");
    bankcardtype(bankCardNo);
});

//手机号码前面三位后面四位一空格
function Mobile(obj) {
    var value = obj.value;
    value = value.replace(/\s*/g, "");
    var result = [];
    for(var i = 0; i < value.length; i++)
    {
        if (i==3||i==7)
        {
            result.push(" " + value.charAt(i));
        }
        else
        {
            result.push(value.charAt(i));
        }
    }
    obj.value = result.join("");
}

//控制next-btn点击颜色变化
$('#name,#account,#bankCardType,#mobile,#picCode').on("focus change keyup blur",function(){
    if($("#name").html() != '' && $('#account').val() != '' && $('#picCode').val() != '' && $('#bankCardType').text() != '' && is_mobile($('#mobile').val()) && $('#i-check-btn').hasClass('i-check-checked')){
        $(".next-btn").css("backgroundColor","#E1B555");
        $('.next-btn').attr("disabled",false);
    }else{
        $(".next-btn").css("backgroundColor","");
        $('.next-btn').attr("disabled",true);
    }
});

//校验手机号是否合法
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


//控制同意书的显示隐藏以及按钮的变色
$('#i-check-btn').click(function() {
    if ($(this).hasClass('i-check-unchecked')) {
        $(this).removeClass('i-check-unchecked');
        $(this).addClass('i-check-checked');
        //判断上面的内容是否为空,不为空的时候按钮变黄色
        if($("#name").html() != ''  && $("#picCode ").val() != ''&& $('#account').val() != '' && $('#bankCardType').text() != ''
            && is_mobile($('#mobile').val() ) ){
            $(".next-btn").css("backgroundColor","#E1B555");
            $('.next-btn').attr("disabled",false);

        }
    } else {
        $(this).addClass('i-check-unchecked');
        $(this).removeClass('i-check-checked');
        $(".next-btn").css("backgroundColor","");
        $('.next-btn').attr("disabled",false);
    }
});


// next-btn按钮跳转(判断以上都合法在进行跳转)
$('#toConfirm').click(function() {
    if(!($("#name").html() != '' && $('#account').val() != '' && $('#bankCardType').text() != '' && is_mobile($('#mobile').val())&& $('#picCode').val() != '' &&   $('#i-check-btn').hasClass('i-check-checked'))){
        return;
    }
    //判断持卡人/银行卡/以及手机号码合法
    var name = $('#name').html();
    var account = $('#account').val();
    var mobilenum = $('#mobile').val();
    if (name == '' || name == null) {
        new SmartToast({
            content: '请输入姓名',
            type: 'warn',
            duration: 3
        });
        return;
    }
    if (account == '' || account == null ) {
        new SmartToast({
            content: '抱歉，您的卡号输入格式有误，请核对后在尝试',
            type: 'warn',
            duration: 3
        });
        return;
    }
    if (!is_mobile(mobilenum)) {
        new SmartToast({
            content: '您当前输入手机号码有误，请核对后在尝试',
            type: 'warn',
            duration: 3
        });
        return;
    }
    //图形验证码
    if ($('#picCode').val() == '') {
        new SmartToast({
            content: '请填写图形验证信息',
            type: 'warn',
        });
        // showError("请填写图形验证信息");
        return false;
    }
    if ($('#picCode').val() == '') {
        new SmartToast({
            content: '请填写图形验证信息',
            type: 'warn',
        });
        // showError("请填写图形验证信息");
        return false;
    }
    if ($('#i-check-btn').hasClass('i-check-unchecked')) {
        new SmartToast({
            content: '请先同意以上协议',
            type: 'warn',
            duration: 3
        });
        return;
    }


    var picCode = $("#picCode").val();
    var banknum = $('#account').val().replace(/\s+/g, '');;
    var phonenum = $('#mobile').val().replace(/\s+/g, '');;
    //后台鉴权接口
    $.ajax({
        type:'post',
        url: host+'bindbankcard/bindBankCardAuthentication.htm',
        data:{
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            bankCardNo: $.base64.encode(banknum),
            mobile : $.base64.encode(phonenum),
            picCode: picCode
        },
        dataType:'JSON',
        //成功响应后调用
        success: function (result) {
            if(result.code == '0000'){
                var userphone = $('#mobile').val().replace(/\s+/g, '');
                var req = getRequest();
                var proId = req.proId;
                var orderId = req.orderId;
                var proinveseId = req.proinveseId;
                var fromPayPage = req.fromPayPage;
                window.location.href = '/page/add-bank-card/add-bank-card-two.html?proId=' + proId + '&orderId=' + orderId + '&fromPayPage=' + fromPayPage + '&proinveseId=' + proinveseId;
            } else {
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
    });
});











