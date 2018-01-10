/**
 * Created by jingpinghong on 2017/1/3.
 */
(function () {
    var Raising = {
        init: function () {
            this.raisingHeader();
            this.showModel();
        },

        raisingHeader: function () {
            $('.header-title').text('募集中');
        },

        showModel: function () {
            $('.header-title').click( function () {
                if($(".content-model").css("display") === "none"){
                    $(".content-model").show();
                }else{
                    $(".content-model").hide();
                }
                $('.icon2').addClass('active');
            });
        },

    };

    Raising.init();

    //业务
    //checkUserLogin();
})();