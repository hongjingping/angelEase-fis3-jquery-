/*
 *  jingpinhong@creditease.cn
 */
(function () {


    var ModifyPass = {
        init: function () {
            this.renderCommonTitle();
            this.getBankLimitList();
        },

        renderCommonTitle: function () {
            $('#cmn-header').text('添加银行卡');
        },
        getBankLimitList: function () {
             /* ajax请求开始 */
            $.ajax({
                url: host + 'bindbankcard/limitPayment.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
                success: function (data) {
                    //console.log("数据"+JSON.stringify(data));
                    if (data.code == '0000') {
                        var result = data.data.list;
                        banklistData(result);

                    }else if (data.code == '4000') {
                        // window.location.href = loginUrl;
                        handleLoginTimeout();
                    }
                }
            });
    /* ajax请求结束 */
        }
    };

    ModifyPass.init();


    //业务
    checkUserLogin();

    //1127-jingpinghong
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
                // location.href = loginUrl;
                 handleLoginTimeout();

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

//返回上一页的时候,卡类型还保存
    if($('#card-num').val() != '' && $('#card-num').val() != null && $('#card-num').val() != undefined){
        var bankCardNo = $('#card-num').val().replace(/\s/g,"");
        bankcardtype(bankCardNo);
    }



//校验银行卡类型
function bankcardtype(bankCardNo){
    if(bankCardNo != "" && bankCardNo != null && bankCardNo != undefined){
        $('#font-c').css('color','#4A4A4A');
        $('#loadingImg').css('display','block');
        $('#bankCardType').css("display",'block');
        /* ajax开始去后台请求校验银行卡号 */
        $.ajax({
            type:'post',
            //接口地址
            url: host+'bindbankcard/checkBindBankCardType.htm?bankCardNo=' + $.base64.encode(bankCardNo),
            //data发送请求数据
            data:{
                token: token_client_data.token,
                clientType: token_client_data.clientType
            },
            //datatype服务器返回的数据格式
            dataType:'JSON',
            //成功响应后调用
            success: function (result) {
                //书写模板并且进行渲染
                var code=$('#card-num').val();
                if (result.code == '0000') {
                    //银行卡验证成功
                    $('#loadingImg').css('display','block');
                    $('#cardType').html(result.data.bankName +'&nbsp;'+result.data.bankTypeName);
                    $('#cardType').css('color','#000');
                    //成功的时候给隐藏域赋值
                    $('#card-type-check').val(1);
                } else {
                    //银行卡验证失败
                    $('#cardType').html(result.desc);
                    $('#cardType').css('color','#9B9B9B');
                }
            },
            error:function(data){
                //console.log(JSON.stringify(data)+'shibai');
                $('#loadingImg').css('display','none');
                $('#cardType').html('系统错误,请稍后再试');

            },
        });
        /* ajax结束 */
    }
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
/*jingpinghong-1125*/


/*banklist-data start*/
function banklistData(data) {
    var str = "";
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        str += "<tr><td>" + obj.bankName + "</td><td>" + obj.singleQuota + "</td><td>" + obj.dailyQuota + "</td></tr>";
    }
    $("#banklist-Data").html(str);
};
// $('#support-bank').hover(function(){
//    $('#bank-list').css('display','block');
//    //点击页面中任何一个地方隐藏列表
//     document.onclick = function (event) {
//         var e = event || window.event;
//         var elem = e.srcElement||e.target;
//         while(elem) {
//             if(elem.id == "bank-list")
//             {
//                 return;
//             }
//             elem = elem.parentNode;
//         }
//         //隐藏div的方法
//         $("#bank-list").css('display',"none");
//     };


// });

/*banklist-data end*/

/*协议点击选中与否*/
$('#check-icon').on('click',function(){
    if ($(this).hasClass("check-icon1")) {
        //被选中
        $(this).removeClass("check-icon1");
        $(this).addClass("check-icon2");
    } else {
        //不被选中
        $(this).removeClass("check-icon2");
        $(this).addClass("check-icon1");
    }
});

/*鼠标放在小图标,显示提示语*/
// $('#cardName').on('mouseenter',function(){
//     $('#card-name').css('display','block');
// });
// $('#cardName').on('mouseout',function(){
//     $('#card-name').css('display','none');
// });
// $('#cardNum').on('mouseenter',function(){
//     $('#bankCardNum').css('display','block');
// });
// $('#cardNum').on('mouseout',function(){
//     $('#bankCardNum').css('display','none');
// });



function check(){
    if (isNaN($('#card-num').val().replace(/\s/g,''))) {
        // console.log(isNaN($('#card-num').val().replace(/\s/g, '')));
        showError("抱歉，您的卡号输入格式有误，请核实后再试!");
        setTimeout(function(){
            $('#error0').hide();
        },2000);
        return;
    }
}

//1127jingpinghong-放大显示银行卡号
$('#card-num').on('focus keyup change propertychange',function(){
    check();
    if($(this).val().length>0){
        var $this = $(this),
            v = $(this).val();
        /\S{5}/.test(v) && $this.val(v.replace(/\s/g,'').replace(/(.{4})/g, "$1 "));
        $('#textMag').css('display','block');
        //$('#textMag').css('visibility','visible');
        $("#textMag").html($this.val());
    } else {
        $('#textMag').css('display','none');
        //$('#textMag').css('visibility','hidden');
        $("#textMag").html();
    }

});


/*鼠标离开的时候隐藏放大显示的div,并且进行校验*/
$('#card-num').on('blur',function(){
    $('#textMag').css('display','none');
    //$('#textMag').css('visibility','hidden');
    $("#textMag").html();
    //鼠标离开银行卡号后自动检验卡类型
    var bankCardNo = $('#card-num').val().replace(/\s/g,"");
    bankcardtype(bankCardNo);
});


/* 手机号码格式 */
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

var phoneNum = document.getElementById('phoneNum');
$('#phoneNum').keyup(function(){
    var num = phoneNum;
    Mobile(num);
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

//图形验证码
//业务开始,图形验证码
//var picUrl = host + "/bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=pc&rand="+ Math.random();
var picUrl = host + "/bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=pc";
$("#img-code").attr('src', picUrl);


$('#img-code').on('click', function () {
    //console.log('图形');
    var picUrl = host + "bindbankcard/randomPicCode.htm?token="+getToken()+"&clientType=pc";
    $("#img-code").attr('src', picUrl + '&rand='+ Math.random());
});

//点击提交按钮提交,进入下一步
$('#sub-check').on('click',function(){
    if ($('#name').html() == '' || $('#card-num').val() == 'undefined' || $('#card-num').val() == '' || $('#phoneNum').val() == 'undefined' || $('#imgCode').val() == '') {
        showError('请输入正确信息');
        return false;
    }
    //检验输入框是否合法
    if($('#card-num').val() == '' || $('#card-num').val() ==  'undefined' || $('#card-num').val() == null){
        showError('请输入正确的银行卡号');
        return false;
    }
    //检验卡类型是否合法
    if($('#card-type-check').val() != 1){
        showError('卡类型错误,请核对后再试');
        return false;
    }
    var phoneNum = $('#phoneNum').val();
    if(phoneNum == '' || phoneNum.length != 13 || phoneNum ==  null || phoneNum == 'undefined'){
        showError('请输入正确的手机号');
        return false;
    }
    if($('#imgCode').val() == '' || $('#imgCode').val() == null || $('#imgCode').val() == 'undefined' ){
        showError('请输入正确的图形验证码');
        return false;
    }
    if(($('#check-icon').hasClass('check-icon1'))){
        showError('请先同意以上协议');
        return false;
    }


    //鉴权验证
    var bankCardNum = $('#card-num').val().replace(/\s/g,'');
    var phoneNumber = $('#phoneNum').val().replace(/\s+/g, '');
    var picCode = $("#imgCode").val();
    $.ajax({
        type:'post',
        //接口地址
        url: host+'bindbankcard/bindBankCardAuthentication.htm',
        data:{
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            bankCardNo: $.base64.encode(bankCardNum),
            mobile : $.base64.encode(phoneNumber),
            picCode: picCode
        },
        dataType:'JSON',
        //成功响应后调用
        success: function (result) {
            if(result.code == '0000'){
                storage.set('sendMsg', '1');
                window.location.href = '/page/add-bank-card/steptwo.html';
            } else if (result.code == '9999'){
                if(result.desc != ''){
                    showError(result.desc);
                }
            }
        },
        //错误响应时调用
        error: function (data) {
        }
    });
});
})();