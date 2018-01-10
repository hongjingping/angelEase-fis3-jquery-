/*
 * 登录 重写
 * Date: 2016-8-12
 * 登录、注册验证
 * @登录：验证手机号码是否存在，格式是否正确，手机号码输入3次错误信息，需要输入验证码
 * @注册：图形验证码输入正确后再显示短信验证码选项，若短信验证码输错，则需重新验证图形验证码
 */
(function () {

    var quickLogin = {
        init : function () {
            this.checUserLogin();

        },
        checUserLogin: function () {
            var checkUserLoginAjax = $.ajax({
                type: 'POST',
                url: host + 'user/checkUserLogin.htm',
                dataType: 'JSON',
                data: {'token':getToken(),'clientType':'pc'}
            });

            checkUserLoginAjax.done(function (data) {
                if (data.code === '0000') {
                    $('.logged-wrapper').show();
                    showHasLogin();
                } else {
                    $('.login-wrapper').show();
                    var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
                    $.ajax({
                        type: 'post',
                        url: host + 'user/errorCount.htm',
                        data: param,
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.code == '0000' && data.desc >= 3) {
                                $("#count").val(data.desc);
                                $(".form-box .captcha").show();
                                var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
                                $("#picImg").attr('src', picUrl);
                            }
                        }
                    });

                    //更换图片验证码
                    $(".testZy img").on("click", function () {
                        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                        $("#picImg").attr('src', picUrl);
                    });

                    // 登录验证
                    function init(boo){
                        var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
                        $.ajax({
                            type: 'post',
                            url: host + 'user/errorCount.htm',
                            data: param,
                            dataType: 'JSON',
                            async: boo,
                            success: function (data) {
                                if (data.code == '0000' && data.desc >= 3) {
                                    $("#count").val(data.desc);
                                    $(".form-box .captcha").show();
                                    var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken();
                                    $("#picImg").attr('src', picUrl);
                                }
                            },
                            error: function (error) {
                            }
                        });
                    }

                    var count = 0;
                    $("#loginBtn").on("click", function () {
                        $('#error').css("visibility", "hidden")
                        if ($('#userphone').val() == '') {
                            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入正确的手机号码");
                            $("#error").show();
                            return false;
                        }
                        if ( $('#userpwd').val() == '') {
                            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入登录密码");
                            $("#error").show();
                            return false;
                        }

                        var param = {'userName':$.base64.encode($('#userphone').val()),'visitiToken':getVisitiToken()};
                        $.ajax({
                            type: 'post',
                            url: host + 'user/errorCount.htm',
                            data: param,
                            dataType: 'JSON',
                            async: false,
                            success: function (data) {
                                if (data.code == '0000' && data.desc >= 3) {
                                    if ($(".form-box .captcha").css('display')=='none') {
                                        var picUrl = host + "user/picCode.htm?visitiToken="+getVisitiToken()+"&date="+new Date();
                                        $("#picImg").attr('src', picUrl);
                                    }
                                    $(".form-box .captcha").show();
                                    $("#count").val(data.desc);
                                }
                            }
                        });
                        //登录提交3次错误信息，显示验证码
                        if ($("#count").val() >= 3) {
                            if ($('#loginCode').val() == '') {
                                $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请填写验证码");
                                $("#error").show();
                                return false;
                            }
                            doLogin('picCode');
                        } else {
                            doLogin('');
                        }
                    })

                    function doLogin(type) {
                        var data = {'clientType':'pc','userName':$.base64.encode($('#userphone').val()),'passwd':$.base64.encode($('#userpwd').val()),'visitiToken':getVisitiToken()};
                        if (type != '') {
                            data = {'clientType':'pc','userName':$.base64.encode($('#userphone').val()),'passwd':$.base64.encode($('#userpwd').val()),'visitiToken':getVisitiToken(),'picCode':$.base64.encode($('#loginCode').val())};
                        }

                        var toLoginAjax = $.ajax({
                            type: 'post',
                            url: host + 'user/toLogin.htm',
                            data: data,
                            dataType: 'JSON'
                        });

                        toLoginAjax.done(function(data) {
                            if (data.code == '0000') {
                                $('.login-wrapper').hide();
                                $('.logged-wrapper').show();
                                setToken(data.desc);
                                document.location.reload();
                                // showHasLogin();
                            } else if (data.code === '0025') {
                                var ageLimitAlert = new SmartAlert({
                                    title: '',
                                    content: '<i class="ae-icon ae-icon-attention alert-notice-attention"></i><div class="content-txt-wrapper"><span class="content-txt">'+ data.data +'</span></div>',
                                    type: 'confirm',
                                    okText: '确认',
                                    maskClosable: false,
                                });
                                ageLimitAlert.open();
                            } else {
                                // 用户名或密码错误
                                //1109-jingpinghong
                                if (data.desc.indexOf('验证码') >= 0) {
                                    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc);
                                    $("#error").show();
                                } else {
                                    $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+data.desc).addClass("indicatorCon countError");
                                    $("#error").show();
                                }
                            }
                        });
                    }

                    //回车键的时候调用登录按钮
                    $('#userpwd').bind('keypress', function(e) {
                        if(e.keyCode==13){
                            console.log('enter');
                            $("#loginBtn").click();
                        }
                    });


                    $('#loginCode').bind('keypress', function(e) {
                        if(e.keyCode==13){
                            console.log('enter');
                            $("#loginBtn").click();
                        }
                    });
                }
            });
        },
    }

    quickLogin.init();

    /*删除手机号*/
    var userPhone = $('#userphone').attr('id');
    var closeUsername = $('#close-username').attr('id');
    deleteBtn(userPhone ,closeUsername);

    /*删除密码*/
    var input = $('#userpwd').attr('id');
    var link = $('#close-pwd').attr('id');
    deleteBtn(input ,link);

})();

/*
 * 登录/注册 公用方法
 * Date: 2016-8-12
 * 登录、注册验证
 *@登录：验证手机号码是否存在，格式是否正确，手机号码输入3次错误信息，需要输入验证码
 *@注册：图形验证码输入正确后再显示短信验证码选项，若短信验证码输错，则需重新验证图形验证码
 */

// 验证手机号
function checkMobileNum(mobile) {
    $('#error').css('display', 'block').css('visibility', 'hidden');
    if(mobile.length==0)
    {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入手机号码");
        $('#error').show();
        return false;
    }
    if(mobile.length!=11)
    {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入有效的手机号码");
        $('#error').show();
        return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!myreg.test(mobile))
    {
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入有效的手机号码");
        $('#error').show();
        return false;
    }
}

// 验证密码
function checkpwd(pass) {
    $("#error").css("visibility", "hidden").css('display', 'block');
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        //$("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"密码不是6-18位数字与字母组合，请重新输入");
        //$("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入6位以上数字与字母组合密码");
        //$('#error').show();
        if($("#userpwd").val() != '') {
            $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入6位以上数字与字母组合密码");
            $('#error').show();
        }
    }
}

function showHasLogin(){
    $.ajax({
        url: host + "/user/auth/selectShowName.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: getTokenWithClient(),
        success: function (data) {
            if (data.code == '0000') {
                if (data.data.type == '1') {
                    $('#quick-username').html('**' + data.data.name.substring(data.data.name.length - 1, data.data.name.length) + '，');
                } else if (data.data.type == '2') {
                    $('#quick-username').html(data.data.name);
                } else if (data.data.type == '3') {
                    $('#quick-username').html(data.data.name);
                }
            }
        }
    });
}
