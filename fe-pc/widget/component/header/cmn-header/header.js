(function () {
    var Header = {
        init: function () {
            this.cacheElements();
            this.checUserLogin();
            this.logOut();
            this.skipLogin();
        },
        cacheElements: function () {
            this.$headerMain = $('.header-main-wrapper');
            this.$navItem = this.$headerMain.find('.nav-item');
        },
        checUserLogin: function () {
            var checkUserLoginAjax = $.ajax({
                type: 'POST',
                url: host + 'user/checkUserLogin.htm',
                dataType: 'JSON',
                data: getTokenWithClient()
            });

            checkUserLoginAjax.done(function (data) {
                if (data.code === '0000') {
                    showUserStatusBar();
                } else {
                    //
                }
            });
        },
        skipLogin: function () {
            $('#my-account').on('click',function (){
                $.ajax({
                    type: 'POST',
                    url: host + 'user/checkUserLogin.htm',
                    dataType: 'JSON',
                    data:{'token':getToken(),'clientType':'pc'},
                    async: false,
                    success: function (data) {
                        if(data.code!='0000'){
                            location.href=loginUrl;
                        }else {
                            location.href="/page/invest/list.html";
                        }
                    }, error:function(e){
                        //1111-undefined不弹出

                    }
                });
            });
        },
        logOut: function () {
            //退出事件
            $('#logOut').on('click',function() {
                var logOutAlert = new SmartAlert({
                    title: '安全退出',
                    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">确定退出吗？</span>',
                    okText: '确定',
                    onOk: function () {
                        $.ajax({
                            url: host + "user/logout.htm",
                            contentType: "application/x-www-form-urlencoded;charset=utf-8",
                            dataType: "json",
                            type: "post",
                            data: getTokenWithClient(),
                            success: function (data) {
                                if (data.code == '0000') {
                                    clearToken();
                                    window.location.href = "/page/home/home.html";
                                } else {
                                    $("#error").html(data.desc)
                                }
                            }
                        });
                    },
                    maskClosable: false,
                });
                logOutAlert.open();
            });
        }
    };

    Header.init();

})();

function showUserStatusBar(){
    $.ajax({
        url: host + "/user/auth/selectShowName.htm",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "json",
        type: "post",
        data: getTokenWithClient(),
        success: function (data) {
            if (data.code == '0000') {
                $('.status-link-item').show()
                var userName = $('.status-link-item').find('.username')
                if (data.data.type == '1') {
                    userName.html('**' + data.data.name.substring(data.data.name.length - 1, data.data.name.length));
                } else if (data.data.type == '2') {
                    userName.html(data.data.name);
                } else if (data.data.type == '3') {
                    userName.html(data.data.name);
                }
            }
        }
    });
}



