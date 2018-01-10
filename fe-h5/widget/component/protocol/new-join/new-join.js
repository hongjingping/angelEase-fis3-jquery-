(function () {

    var request = getRequest();
    var orderId = request.orderId;

    if(null == orderId || '' == orderId || typeof(orderId) == 'undefined'){
        return false;
    }

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
        //url: host + 'protocol/getJoinPara.htm?orderId=' + orderId,
        url: host + 'protocol/getJoinFxlPara.htm?orderId='+orderId,
        data: ajaxData,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                var partnerShipAgreement2 = data.data.partnerShipAgreement2;
                insertpartnerShipAgreement2Data(partnerShipAgreement2);
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

    // 入伙协议
    function insertpartnerShipAgreement2Data (partnerShipAgreement2) {
        if(null!=partnerShipAgreement2.dateStr&&partnerShipAgreement2.dateStr!=undefined){
            $('#partnerShipAgreement2 .dateStr').each(function(){
                $(this).html(partnerShipAgreement2.dateStr);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipName&&partnerShipAgreement2.limitPartnershipName!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipName').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipName);
            });
        }
        if(null!=partnerShipAgreement2.orderUserName&&partnerShipAgreement2.orderUserName!=undefined){
            $('#partnerShipAgreement2 .orderUserName').each(function(){
                $(this).html(partnerShipAgreement2.orderUserName);
            });
        }
        if(null!=partnerShipAgreement2.orderUserIdcardno&&partnerShipAgreement2.orderUserIdcardno!=undefined){
            $('#partnerShipAgreement2 .orderUserIdcardno').each(function(){
                $(this).html(partnerShipAgreement2.orderUserIdcardno);
            });
        }
        if(null!=partnerShipAgreement2.orderUserAddress&&partnerShipAgreement2.orderUserAddress!=undefined){
            $('#partnerShipAgreement2 .orderUserAddress').each(function(){
                $(this).html(partnerShipAgreement2.orderUserAddress);
            });
        }
        if(null!=partnerShipAgreement2.orderUserMobile&&partnerShipAgreement2.orderUserMobile!=undefined){
            $('#partnerShipAgreement2 .orderUserMobile').each(function(){
                $(this).html(partnerShipAgreement2.orderUserMobile);
            });
        }
        if(null!=partnerShipAgreement2.generalPartnershipName&&partnerShipAgreement2.generalPartnershipName!=undefined){
            $('#partnerShipAgreement2 .generalPartnershipName').each(function(){
                $(this).html(partnerShipAgreement2.generalPartnershipName);
            });
        }
        if(null!=partnerShipAgreement2.generalPartnershipAddress&&partnerShipAgreement2.generalPartnershipAddress!=undefined){
            $('#partnerShipAgreement2 .generalPartnershipAddress').each(function(){
                $(this).html(partnerShipAgreement2.generalPartnershipAddress);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipName&&partnerShipAgreement2.limitPartnershipName!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipName').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipName);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipAddress&&partnerShipAgreement2.limitPartnershipAddress!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipAddress').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipAddress);
            });
        }
        if(null!=partnerShipAgreement2.finacierCompanyName&&partnerShipAgreement2.finacierCompanyName!=undefined){
            $('#partnerShipAgreement2 .finacierCompanyName').each(function(){
                $(this).html(partnerShipAgreement2.finacierCompanyName);
            });
        }
        if(null!=partnerShipAgreement2.orderPrice&&partnerShipAgreement2.orderPrice!=undefined){
            $('#partnerShipAgreement2 .orderPrice').each(function(){
                $(this).html(partnerShipAgreement2.orderPrice);
            });
        }
        if(null!=partnerShipAgreement2.orderUserBankNo&&partnerShipAgreement2.orderUserBankNo!=undefined){
            $('#partnerShipAgreement2 .orderUserBankNo').each(function(){
                $(this).html(partnerShipAgreement2.orderUserBankNo);
            });
        }
        if(null!=partnerShipAgreement2.orderUserBankName&&partnerShipAgreement2.orderUserBankName!=undefined){
            $('#partnerShipAgreement2 .orderUserBankName').each(function(){
                $(this).html(partnerShipAgreement2.orderUserBankName);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipAccountNum&&partnerShipAgreement2.limitPartnershipAccountNum!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipAccountNum').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipAccountNum);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipAccountBank&&partnerShipAgreement2.limitPartnershipAccountBank!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipAccountBank').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipAccountBank);
            });
        }
        if(null!=partnerShipAgreement2.limitPartnershipRegAddress&&partnerShipAgreement2.limitPartnershipRegAddress!=undefined){
            $('#partnerShipAgreement2 .limitPartnershipRegAddress').each(function(){
                $(this).html(partnerShipAgreement2.limitPartnershipRegAddress);
            });
        }
    }
})();