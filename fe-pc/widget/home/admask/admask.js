(function () {
    var adMask = {
        init: function () {
            this.showMask();
            this.closeAd();
        },
        // 如果在一次session会话中关闭过广告浮层，则在本次会话中不再显示广告浮层。
        showMask: function () {
            var ifShowMask = sessionStorage.getItem('showMask');
            if (ifShowMask === '1') {
                $('#admask-wrapper').hide();
            } else {
                $('#admask-wrapper').show();
            }
        },
        closeAd: function () {
            $('#close-btn').on('click', function () {
                $('#admask-wrapper').hide();
                sessionStorage.setItem('showMask', '1');
            })
        }
    }
    adMask.init();
})();