/**
 * Created by jingpinghong on 2017/1/3.
 */
(function () {
    var Attention = {
        init: function () {
            this.attentionHeader ();
            this.showModel ();
        },

        attentionHeader: function () {
            $('.header-title').text('我的关注');
        },

        showModel: function () {
            $('.header-title').click( function () {
                if($(".content-model").css("display") === "none"){
                    $(".content-model").show();
                    $('.icon1').addClass('active');
                }else{
                    $(".content-model").hide();
                }
            });
        },

    };

    Attention.init();

    //业务
    //checkUserLogin();
})();