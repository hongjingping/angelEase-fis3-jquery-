(function() {

    var Detail = {
        init: function() {
            this.tab();
            this.dataListBg();
            this.generateShareQrCode();
        },

        tab: function() {
            $('.tab-container').on('click', '.tab-item', function() {
                // tab border top style
                $(this).addClass('active-tab-border-top').siblings('.tab-item').removeClass('active-tab-border-top');

                // switch tab content
                $('.content-container').find('.' + $(this).attr('data-item')).css('display', 'block').siblings('div').css('display', 'none');
            });
        },

        // table list background color
        dataListBg: function() {
            $('.investor tr:odd').css('background', '#F8F9FA');
        },
        consultIconHover: function () {
            $('.icon-consult-wrapper').mouseenter(function () {
                $('.icon-consult').hide();
                $('.icon-consult-wrapper').addClass('icon-consult-wrapper-active')
                $('.consult-text').show();
                $('.qrcode-secretary-wrapper').animate({
                    opacity: 1
                },400);
                $('.qrcode-secretary-wrapper').show();
            })
            $('.icon-consult-wrapper').mouseleave(function () {
                $('.consult-text').hide();
                $('.icon-consult-wrapper').removeClass('icon-consult-wrapper-active')
                $('.icon-consult').show();
                $('.qrcode-secretary-wrapper').animate({
                    opacity: 0,
                },400);
                $('.qrcode-secretary-wrapper').hide();
            })
        },
        generateShareQrCode: function () {
            $('.share-wrapper').find('.share-img').attr('src','http://qr.liantu.com/api.php?&w=176&m=2&text='+window.location.href);
        }

    }

    Detail.init();
})();

var request = getRequest();
//项目id
var proId = request.proId;
//用户身份验证code
var user_code = checkUser();
//预购码绑定验证code
var appCode = checkAppointCode();

var cfUserId = request['uid'];
var cfToken = request['token'];

if (cfUserId && cfToken) {
    $.ajax({
        url: host + '/user/loginByToken.htm',
        dataType: 'JSON',
        type: 'post',
        data: {
            token: token_client_data.token,
            clientType: token_client_data.clientType,
            cfUserId : cfUserId,
            cfToken : cfToken
        },
        success: function (data) {
            setToken(data.desc);
        }
    });
}

//用户状态校验
function checkUser() {
    var code;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: token_client_data,
        url: host + 'dream/checkUser.htm',
        dataType: 'JSON',
        success: function(data) {
            code = data.code;
        },
        error: function(e) {
        }
    });
    return code;
}

//港澳台用户校验
function checkCardId() {
    var code;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: token_client_data,
        url: host + 'dream/checkCardId.htm?proId=' + proId,
        dataType: 'JSON',
        success: function(data) {
            code = data.code;
        },
        error: function(e) {
        }
    });
    return code;
}

//预购码验证
function checkAppointCode() {
    var code;
    $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        data: token_client_data,
        url: host + 'active/checkBind.htm?proId=' + proId,
        dataType: 'JSON',
        success: function(data) {
            //alert(data.code);
            code = data.code;
        },
        error: function(e) {
        }
    });
    return code;
}