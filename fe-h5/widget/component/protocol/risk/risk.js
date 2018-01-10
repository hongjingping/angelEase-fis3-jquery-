(function () {
	
	var request = getRequest();

    // app用
    var appClient = request.clientType;
    var ajaxData;
    if (appClient == 'app') {
        $('.cmn-header.white_bg').hide();
        ajaxData = {'token':request.token,'clientType':'app'};
    } else {
        ajaxData = token_client_data;
    }

    // 查询该订单协议相关信息
    $.ajax({
        type: 'POST',
        url: host + 'protocol/getInvestmentRiskPara.htm',
        data: ajaxData,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                var investmenTriskStatement = data.data.investmenTriskStatement;
                insertInvestmenTriskStatementData(investmenTriskStatement);
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

    // 投资风险声明书
    function insertInvestmenTriskStatementData (investmenTriskStatement) {
        if(null!=investmenTriskStatement.dateStr&&investmenTriskStatement.dateStr!=undefined){
            $('#investmenTriskStatement .dateStr').each(function(){
                $(this).html(investmenTriskStatement.dateStr);
            });
        }
    }
})();