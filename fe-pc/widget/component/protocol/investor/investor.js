(function () {

    var request = getRequest();
    var proId = request.proId;

    if(proId == null || proId == '' || typeof(proId) == 'undefined'){
        return false;
    }

    // 查询该订单协议相关信息
    $.ajax({
        type: 'POST',
        url: host + 'protocol/getInvestorStatePara.htm?proId=' + proId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                var investorStatement = data.data.investorStatement;
                insertinvestorStatementData(investorStatement);
            } else if (data.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

    // 投资人声明
    function insertinvestorStatementData (investorStatement) {
        if(null!=investorStatement.dateStr&&investorStatement.dateStr!=undefined){
            $('#investorStatement .dateStr').each(function(){
                $(this).html(investorStatement.dateStr);
            });
        }
    }
})();