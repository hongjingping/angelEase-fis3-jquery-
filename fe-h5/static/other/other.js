(function () {
    var HelpCenter = {
        init: function () {
            this.setHeaderTitle();
        },

        setHeaderTitle: function () {
            $('.cmn-header-title').text('帮助中心');
        }
    }

    HelpCenter.init();

    // app用
    var request = getRequest();
    var appClient = request.clientType;
    if (appClient == 'app') {
        $('.cmn-header.white_bg').hide();
    }
})();