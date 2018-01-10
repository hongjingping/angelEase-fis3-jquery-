/* 
 * 登录/注册 公用方法
 * Date: 2016-8-12
 * 登录、注册验证
 *@登录：验证手机号码是否存在，格式是否正确，手机号码输入3次错误信息，需要输入验证码
 *@注册：图形验证码输入正确后再显示短信验证码选项，若短信验证码输错，则需重新验证图形验证码
 */

// 验证手机号
function checkMobileNum(mobile)
{
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
function checkpwd(pass){
    $("#error").css("visibility", "hidden").css('display', 'block');
    var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
    if(!reg.test(pass)){
        $("#error").css("visibility", "visible").html("<i class='ae-icon ae-icon-attention error-notice'></i>"+"请输入6位以上数字与字母组合密码");
        $('#error').show();
    }
}