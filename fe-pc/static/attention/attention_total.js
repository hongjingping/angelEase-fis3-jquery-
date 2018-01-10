/**
 * Created by jingpinghong on 2017/1/4.
 */
(function () {
    var attentionTotal = {
        init: function () {
            this.showTotal();
            this.showBar();
        },
        showBar: function () {
            $('.attention-line').show();
        },
        showTotal: function () {
            $('.total').addClass('active').siblings().removeClass('active');
        }
    };
    attentionTotal.init();
})();
