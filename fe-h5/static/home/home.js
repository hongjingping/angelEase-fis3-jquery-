/*
 * 宜信财富跳转过来的用户首先出现遮罩层,点击按钮后进入正常的
 * 20170209
 * jingpinghong@creditease.cn
 * */
(function () {
    var homePro = {
        init: function () {
            this.checkUserFirstLogin();
            this.updateUserFirstStatus();
        },
        checkUserFirstLogin: function () {
            var request = getRequest();
            var cfUserId = request['uid'];
            var cfToken = request['token'];
            $.ajax({
                type: 'post',
                url: host + 'user/checkUserFirstLoginFromEase.htm',
                data: {
                    token: token_client_data.token,
                    clientType: token_client_data.clientType,
                    cfUserId : cfUserId,
                    cfToken : cfToken
                },
                dataType: 'JSON',
                success: function (data) {
                    if (data.code == '0000') {
                        //首次登陆
                        if ( data.data.firstLogin === '1' ) {
                            $('.contentBox').css('display','block');
                            $('.main-layout-content').css('display','none');
                        } else if ( data.data.firstLogin === '2' ) {

                        }

                    }
                },
                error: function (error) {
                    // console.log(error);
                }
            });
        },
        updateUserFirstStatus: function () {
            $(".delBtn").on('click',function () {
                var request = getRequest();
                var cfUserId = request['uid'];
                var cfToken = request['token'];
                $.ajax({
                    type: 'post',
                    url: host + 'user/updateUserFirstStatus.htm',
                    data: {
                        token: token_client_data.token,
                        clientType: token_client_data.clientType,
                        cfUserId : cfUserId,
                        cfToken : cfToken
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        if (data.code == '0000') {
                            $('.contentBox').css('display','none');
                            $('.main-layout-content').css('display','block');
                        }
                    },
                    error: function (error) {
                        // console.log(error);
                    }
                });
            });
        }
    };
    homePro.init();
})();

// handle from creditease caifu
(function handleCaifuChannel(){
    var request = getRequest();
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
})();


