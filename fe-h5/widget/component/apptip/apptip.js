$(function () {

    var AppTip = {
        init: function () {
            this.closeTip();
            this.downloadApp();
            this.showTip();
        },

        downloadApp: function () {
            if (!isWeiXin()) {
                $('.app-tip-container').show();

                if (device.android()) {
                    $('.tip-download').attr('href', 'http://app-ae.yixin.com/ae-android.apk');
                }

                if (device.ios()) {
                    $('.tip-download').attr('href', 'https://itunes.apple.com/us/app/yi-tian-shi/id1178533945?l=zh&ls=1&mt=8');
                }
            } else {
                $('.app-tip-container').remove();
            }
        },

        showTip: function () {
            sessionStorage.getItem('apptip') ? $('.app-tip-container').hide() : $('.app-tip-container').show();
        },

        closeTip: function () {
            $('.tip-close').on('click', function () {
                sessionStorage.setItem('apptip', true);
                $('.app-tip-container').hide();
            });
        }
    };

    AppTip.init();
});