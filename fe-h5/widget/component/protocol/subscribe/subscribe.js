(function () {
    var request = getRequest();
    var proId = request.proId;
    var proinveseId = request.proinveseId;
    var proInvAmount = request.proInvAmount;
    var bindBankCardId = request.bindBankCardId;
    var orderId = request.orderId;

    // app用
    var appClient = request.clientType;
    var ajaxData;
    if (appClient == 'app') {
        $('.cmn-header.white_bg').hide();
        ajaxData = {'token':request.token,'clientType':'app'};
    } else {
        ajaxData = token_client_data;
    }

     // 2016-12-22 jihongzhang@creditease.cn 如果有 orderId, 则传 orderId 即可，否则要传 bindBankCardId 等参数
    if (orderId === undefined ) {
        getAppointmentLetterParaUrl = host + 'protocol/getAppointmentLetterPara.htm?proId=' + proId + '&proinveseId=' + proinveseId  + '&bindBankCardId=' + bindBankCardId + '&proInvAmount=' + proInvAmount;
    } else {
        getAppointmentLetterParaUrl = host + 'protocol/getAppointmentLetterPara.htm?orderId=' + orderId + '&proId=' + proId ;
    }

    // 查询该订单协议相关信息
    $.ajax({
        type: 'POST',
        url: getAppointmentLetterParaUrl,
        data: ajaxData,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                var appointmentLetterOfIntent = data.data.appointmentLetterOfIntent;
                insertAppointmentData(appointmentLetterOfIntent);
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

    // 预约意向书
    function insertAppointmentData (appointmentLetterOfIntent) {
        if(null!=appointmentLetterOfIntent.dateStr&&appointmentLetterOfIntent.dateStr!=undefined){
            $('#appointmentLetterOfIntent .dateStr').each(function(){
                $(this).html(appointmentLetterOfIntent.dateStr);
            });
        }

        if(null!=appointmentLetterOfIntent.finacierCompanyName&&appointmentLetterOfIntent.finacierCompanyName!=undefined){
            $('#appointmentLetterOfIntent .finacierCompanyName').each(function(){
                $(this).html(appointmentLetterOfIntent.finacierCompanyName);
            });
        }

        if(null!=appointmentLetterOfIntent.finacierCompanyName2&&appointmentLetterOfIntent.finacierCompanyName2!=undefined){
            $('#appointmentLetterOfIntent .finacierCompanyName2').each(function(){
                $(this).html(appointmentLetterOfIntent.finacierCompanyName2);
            });
        }
        if(null!=appointmentLetterOfIntent.finacierCompanyLegal&&appointmentLetterOfIntent.finacierCompanyLegal!=undefined){
            $('#appointmentLetterOfIntent .finacierCompanyLegal').each(function(){
                $(this).html(appointmentLetterOfIntent.finacierCompanyLegal);
            });
        }
        if(null!=appointmentLetterOfIntent.orderPrice&&appointmentLetterOfIntent.orderPrice!=undefined){
            $('#appointmentLetterOfIntent .orderPrice').each(function(){
                $(this).html(appointmentLetterOfIntent.orderPrice);
            });
        }
        if(null!=appointmentLetterOfIntent.orderPriceCn&&appointmentLetterOfIntent.orderPriceCn!=undefined){
            $('#appointmentLetterOfIntent .orderPriceCn').each(function(){
                $(this).html(appointmentLetterOfIntent.orderPriceCn);
            });
        }
        if(null!=appointmentLetterOfIntent.orderUserBankNo&&appointmentLetterOfIntent.orderUserBankNo!=undefined){
            $('#appointmentLetterOfIntent .orderUserBankNo').each(function(){
                $(this).html(appointmentLetterOfIntent.orderUserBankNo);
            });
        }
        if(null!=appointmentLetterOfIntent.orderUserBankName&&appointmentLetterOfIntent.orderUserBankName!=undefined){
            $('#appointmentLetterOfIntent .orderUserBankName').each(function(){
                $(this).html(appointmentLetterOfIntent.orderUserBankName);
            });
        }
        if(null!=appointmentLetterOfIntent.limitPartnershipName&&appointmentLetterOfIntent.limitPartnershipName!=undefined){
            $('#appointmentLetterOfIntent .limitPartnershipName').each(function(){
                $(this).html(appointmentLetterOfIntent.limitPartnershipName);
            });
        }
        if(null!=appointmentLetterOfIntent.limitPartnershipAccountNum&&appointmentLetterOfIntent.limitPartnershipAccountNum!=undefined){
            $('#appointmentLetterOfIntent .limitPartnershipAccountNum').each(function(){
                $(this).html(appointmentLetterOfIntent.limitPartnershipAccountNum);
            });
        }
        if(null!=appointmentLetterOfIntent.limitPartnershipAccountBank&&appointmentLetterOfIntent.limitPartnershipAccountBank!=undefined){
            $('#appointmentLetterOfIntent .limitPartnershipAccountBank').each(function(){
                $(this).html(appointmentLetterOfIntent.limitPartnershipAccountBank);
            });
        }
    }
})();