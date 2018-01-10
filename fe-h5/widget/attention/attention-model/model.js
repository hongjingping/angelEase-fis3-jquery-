/**
 * Created by jingpinghong on 2017/1/3.
 */
(function () {
    var Model = {
        init: function () {
            this.changeTab ();
        },

        changeTab: function () {
            $('.info-txt').click( function () {
                $(this).children().addClass('active').parents().siblings().children().removeClass('active');
            })
        }
    };

    Model.init();

    //业务
    //checkUserLogin();
})();