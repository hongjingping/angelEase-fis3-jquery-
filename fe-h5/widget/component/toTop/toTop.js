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
                } else {
                    $("#back-to-top").fadeOut(1500);
                }
            });
        },

        goTop:function () {
            $("#back-to-top").click(function(){
                $('body').animate({ scrollTop: 0 }, 500);
                return false;
            });
        }
    };

    toTop.init();

})();
