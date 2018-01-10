$(function () {
    var Navbar = {
        init: function () {
            this.isLogin();

            // over two times have notice
            this.noticeFinanace();

            // app hide navbar
            this.viaFromApp();
        },

        isLogin: function () {
            $('.cmn-personal').click(function () {
                $.ajax({
                    url: host + 'user/getUserInfo.htm',
                    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                    dataType: 'json',
                    type: 'post',
                    data: {
                        'token': getToken(),
                        'clientType': 'wap'
                    },
                    success: function (data) {
                        if (data.code == '4000') {
                            location.href = loginUrl;
                        } else {
                            window.location.href = baseUrl + 'personal_center/personal-center.html?t=' + new Date().getTime();
                        }
                    }
                });
            });
        },

        noticeFinanace: function () {
            $('.cmn-finance').click(function () {
                checkUserLogin();

                $.ajax({
                    url: host + 'finPro/checkFinProject.htm',
                    dataType: 'json',
                    data: {
                        'token': getToken(),
                        'clientType': 'wap'
                    },
                    type: 'post',
                    success: function (data) {
                        if (data.code === '2001') {
                            $('#notice-model').find('.notice-text').text(data.desc);
                            $('#notice-model').show();
                        } else if (data.code === '2002') {
                            $('#notice-model').find('.notice-text').text(data.desc);
                            $('#notice-model').show();
                        } else if (data.code === '0000') {
                            window.location.href = baseUrl + 'finance/finance.html';
                        } 
                    }
                }).done(function () {
                    $('.confirm-wrapper').click(function () {
                        window.location.href = baseUrl + 'myfinancing/myfinancing.html?tab=1';
                    });

                    $('.dialog-close').click(function () {
                        $('#notice-model').hide();
                    });
                });
            });
        },

        viaFromApp: function () {
            if (getRequest().clientType === 'app') {
                $('.navbar-container').hide();
            }
        }
    };

    Navbar.init();
});