/**
 * Created by jingpinghong on 2016/12/13.
 * 点击toTop-icon返回顶部
 */
/*$(function(){
    $(function () {
        $(window).scroll(function(){
            if ($(window).scrollTop()>100){
                $("#back-to-top").fadeIn(1500);
            }
            else {
                $("#back-to-top").fadeOut(1500);
            }
        });

        //当点击跳转链接后，回到页面顶部位置
        $("#back-to-top").click(function(){
            //$('body,html').animate({scrollTop:0},1000);
            if ($('html').scrollTop()) {
                $('html').animate({ scrollTop: 0 }, 1000);
                return false;
            }
            $('body').animate({ scrollTop: 0 }, 1000);
            return false;
        });
    });
});*/

(function () {
    var toTop = {
        init: function () {
            this.scrollTop();
            this.goTop();
        },

        scrollTop: function () {
            $(window).scroll(function(){
                if ($(window).scrollTop()>100){
                    $("#back-to-top").fadeIn(1500);
                }
                else {
                    $("#back-to-top").fadeOut(1500);
                }
            });
        },

        goTop:function () {
            $("#back-to-top").click(function(){
                if ($('html').scrollTop()) {
                    $('html').animate({ scrollTop: 0 }, 500);
                    return false;
                }
                $('body').animate({ scrollTop: 0 }, 500);
                return false;
            });
        }
    };

    toTop.init();

})();
