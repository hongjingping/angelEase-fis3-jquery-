(function () {

	var request = getRequest();
    var orderId = request.orderId;
    $('#cmn-header').text('重签');

    // 重签流程中错误信息提示
    $.ajax({
        type: 'POST',
        url: host + '/order/checkResign.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(result) {
            if (result.code == '0000') {
                var resign = result.data.reSign;
                if (resign == '1') {
                    var reason = '';
                    var clause = result.data.signClause;
                    var cc = clause.split(',');
                    for(var i = 0 ;i<cc.length;i++) {
                        if(cc[i] == '' || typeof(cc[i]) == 'undefined') {
                            cc.splice(i,1);
                            i= i-1;
                        }
                    }
                    var indexK = 1;
                    if (cc != null) {
                        for (var i = 0; i < cc.length; i++) {
                            reason += '<p class="notice-item"><span class="notice-key">'+ indexK + '、' + cc[i] + '</span><span class="notice-val">' + cc[i + 1] + '</span></p>'
                            i++;
                            indexK++;
                        }
                        if (result.data.remark != null && result.data.remark != '') {
                            reason += '<p class="notice-item"><span class="notice-key">补充说明：</span><span class="notice-val">' + result.data.remark + '</span></p>'
                        }
                    }
                    $('.resign-notice').append(reason);
                }
            } else if (result.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

})();