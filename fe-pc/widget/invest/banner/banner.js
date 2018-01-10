checkUserLogin();

// 查询已投资金额和已投资数
$.ajax({
    type: 'POST',
    url: host + 'invest/getInvestInfo.htm',
    data: token_client_data,
    dataType: 'JSON',
    success: function(data) {
        var htmls = '';
        if (data.code == '0000') {
            $('#amount').html(formatMoney(data.data.investAmount));
            $('#count').html(data.data.investCount);
        } else if (data.code == '4000') {
            //window.location.href = loginUrl;
            /*
             * jingpinghong@creditease.cn
             * 2017-02-16
             * */
            handleLoginTimeout();
        } 
    },
    error: function(e) {
    }
});
