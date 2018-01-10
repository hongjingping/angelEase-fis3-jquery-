(function () {
    var HeaderMain = {
        init: function () {
            this.cacheElements();
            this.activeHitPath();
            // this.navSwitcher();
            this.checUserLogin();
            this.logOut();
            this.skipLogin();
        },
        cacheElements: function () {
            this.$headerMain = $('.header-main-wrapper');
            this.$navItem = this.$headerMain.find('.nav-item');
        },
        activeHitPath: function () {
            var _index = this.getHitIndex()
            if (_index > 0 && _index <= this.$navItem.length) {
                var hitIndex = 0;
                hitIndex = _index - 1;
            }
            this.$navItem.has('.active').removeClass('active');
            this.$navItem.each(function(i, element) {
                if (i === hitIndex) {
                    $(element).addClass('active');
                }
            });
        },
        getHitIndex: function () {
            return this.$headerMain.data('active-index');
        },
        navSwitcher: function () {
            $('.header-main-wrapper').find('.nav-item').on('click', function (e) {
                var targetEl = e.currentTarget;
                $(targetEl).addClass('active').siblings().removeClass('active').find('.nav-item-border').removeClass('borderslide')
                $(targetEl).find('.nav-item-border').addClass('borderslide')
            })
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

    HeaderMain.init();

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
                    userName.html(data.data.name);
                } else if (data.data.type == '2') {
                    userName.html(data.data.name);
                } else if (data.data.type == '3') {
                    userName.html(data.data.name);
                }
            }
        }
    });
}


