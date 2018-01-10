(function () {

    var Title = {
        	init: function () {
                $("#ts").val("");
                this.setTitleHeader();
            },

            setTitleHeader: function () {
             $('.cmn-header-title').text('投资协议');
         }
     };

     Title.init();

})();


$(function() {

    var req = getRequest();
    var orderId = req.orderId;
    var proId = req.proId;
    var proinveseId = req.proinveseId;

    // app用
    var appClient = req.clientType;
    var ajaxData;
    if (appClient == 'app') {
        $('.cmn-header.white_bg').hide();
        $('.read-bottom').hide();
        $('.read-done-button').hide();
        ajaxData = {'token':req.token,'clientType':'app'};
        checkOrderIdUserByApp(orderId, ajaxData)
    } else {
        checkOrderIdUser(orderId);
        ajaxData = token_client_data;
    }

    function bindReadProtocol() {
        $("#read-done-button").click(function() {
            $.ajax({
                type: 'POST',
                url: host + '/order/saveReadFlag.htm?orderId=' + orderId,
                data: ajaxData,
                dataType: 'JSON',
                success: function(result) {
                    if (result.code == '0000') {
                       window.location.href = baseUrl + "invest_sign/agree.html?orderId=" + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                    } else if (result.code == '4000') {
                       window.location.href = loginUrl;
                    }
                },
                error: function(e) {
                }
            });
        });
    }

    $(window).scroll(function(){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
           $("#read-done-button").css("background-color","#E1C078");
           bindReadProtocol();
        }
    });
});
