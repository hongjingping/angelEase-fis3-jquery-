/**
 * Created by jingpinghong on 2017/1/4.
 */
(function () {
    var attentionRaising = {
        init: function () {
            this.showRaising();
            this.showBar();
        },
        showBar: function () {
            $('.attention-line').show();
        },
        showRaising: function () {
            $('.raising').addClass('active').siblings().removeClass('active');
        }
    };

    attentionRaising.init();
})();
