/**
 * Created by jingpinghong on 2017/2/10.
 */
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
            //var cfUserId = request['uid'];
            var cfUserId = '27189';
            //var cfToken = request['token'];
            var cfToken = '267f6de1ec7a44379bf7aa1aa1bc88a3';
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
                //var cfUserId = request['uid'];
                var cfUserId = "27189";
                //var cfToken = request['token'];
                var cfToken = '267f6de1ec7a44379bf7aa1aa1bc88a3';

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
                        }
                    },
                    error: function (error) {
                        // console.log(error);
                    }
                });
            });
        },
    };
    homePro.init();

    /*
     * 宜信财富跳转过来的用户首先出现遮罩层,点击按钮后进入正常的
     * 0124-jingpinghong@creditease.cn
     * */
    //$('.contentBox').css('display','block');
    //$(".delBtn").on('click',function () {
    //    $('.contentBox').css('display','none');
    //});
})();