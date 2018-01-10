/**
 * Created by jingpinghong on 2017/1/3.
 */
(function () {
    var Roading = {
        init: function () {
            this.roadingHeader();
            this.showModel ();
        },

        roadingHeader: function () {
            $('.header-title').text('路演中');
        },

        showModel: function () {
            $('.header-title').click( function () {
                if($(".content-model").css("display") === "none"){
                    $(".content-model").show();
                }else{
                    $(".content-model").hide();
                }
                $('.icon3').addClass('active');
            });
        },
    };

    Roading.init();

    //业务
    //checkUserLogin();
})();