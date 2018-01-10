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
        url: host + 'protocol/getPartnerShipFxlPara.htm?orderId=' + orderId,
        data: ajaxData,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                var partnerShipAgreement = data.data.partnerShipAgreement;
                insertpartnerShipAgreementData(partnerShipAgreement);
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

     // 合伙协议
    function insertpartnerShipAgreementData (partnerShipAgreement) {
        if(null!=partnerShipAgreement.dateStr&&partnerShipAgreement.dateStr!=undefined){
            $('#partnerShipAgreement .dateStr').each(function(){
                $(this).html(partnerShipAgreement.dateStr);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipName&&partnerShipAgreement.limitPartnershipName!=undefined){
            $('#partnerShipAgreement .limitPartnershipName').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipName);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipName&&partnerShipAgreement.generalPartnershipName!=undefined){
            $('#partnerShipAgreement .generalPartnershipName').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipName);
            });
        }
        // 有限合伙企业所在地
        if(null!=partnerShipAgreement.limitPartnershipAddress&&partnerShipAgreement.limitPartnershipAddress!=undefined){
            $('#partnerShipAgreement .limitPartnershipAddress').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipAddress);
            });
        }
        // 融资公司名称
        if(null!=partnerShipAgreement.finacierCompanyName&&partnerShipAgreement.finacierCompanyName!=undefined){
            $('#partnerShipAgreement .finacierCompanyName').each(function(){
                $(this).html(partnerShipAgreement.finacierCompanyName);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipmanageArea&&partnerShipAgreement.limitPartnershipmanageArea!=undefined){
            $('#partnerShipAgreement .limitPartnershipmanageArea').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipmanageArea);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipAddress&&partnerShipAgreement.generalPartnershipAddress!=undefined){
            $('#partnerShipAgreement .generalPartnershipAddress').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipAddress);
            });
        }
        if(null!=partnerShipAgreement.proFinancieAmount&&partnerShipAgreement.proFinancieAmount!=undefined){
            $('#partnerShipAgreement .proFinancieAmount').each(function(){
                $(this).html(partnerShipAgreement.proFinancieAmount);
            });
        }
        if(null!=partnerShipAgreement.proFinancieAmountCn&&partnerShipAgreement.proFinancieAmountCn!=undefined){
            $('#partnerShipAgreement .proFinancieAmountCn').each(function(){
                $(this).html(partnerShipAgreement.proFinancieAmountCn);
            });
        }
        if(null!=partnerShipAgreement.proAllTopLimitAmount&&partnerShipAgreement.proAllTopLimitAmount!=undefined){
            $('#partnerShipAgreement .proAllTopLimitAmount').each(function(){
                $(this).html(partnerShipAgreement.proAllTopLimitAmount);
            });
        }
        if(null!=partnerShipAgreement.proAllTopLimitAmountCn&&partnerShipAgreement.proAllTopLimitAmountCn!=undefined){
            $('#partnerShipAgreement .proAllTopLimitAmountCn').each(function(){
                $(this).html(partnerShipAgreement.proAllTopLimitAmountCn);
            });
        }
        if(null!=partnerShipAgreement.invTopLimitAmount&&partnerShipAgreement.invTopLimitAmount!=undefined){
            $('#partnerShipAgreement .invTopLimitAmount').each(function(){
                $(this).html(partnerShipAgreement.invTopLimitAmount);
            });
        }
        if(null!=partnerShipAgreement.invTopLimitAmountCn&&partnerShipAgreement.invTopLimitAmountCn!=undefined){
            $('#partnerShipAgreement .invTopLimitAmountCn').each(function(){
                $(this).html(partnerShipAgreement.invTopLimitAmountCn);
            });
        }
        if(null!=partnerShipAgreement.invLowLimitAmount&&partnerShipAgreement.invLowLimitAmount!=undefined){
            $('#partnerShipAgreement .invLowLimitAmount').each(function(){
                $(this).html(partnerShipAgreement.invLowLimitAmount);
            });
        }
        if(null!=partnerShipAgreement.invLowLimitAmountCn&&partnerShipAgreement.invLowLimitAmountCn!=undefined){
            $('#partnerShipAgreement .invLowLimitAmountCn').each(function(){
                $(this).html(partnerShipAgreement.invLowLimitAmountCn);
            });
        }
        if(null!=partnerShipAgreement.fiscalYearStartDateStr&&partnerShipAgreement.fiscalYearStartDateStr!=undefined){
            $('#partnerShipAgreement .fiscalYearStartDateStr').each(function(){
                $(this).html(partnerShipAgreement.fiscalYearStartDateStr);
            });
        }
        if(null!=partnerShipAgreement.fiscalYearEndDateStr&&partnerShipAgreement.fiscalYearEndDateStr!=undefined){
            $('#partnerShipAgreement .fiscalYearEndDateStr').each(function(){
                $(this).html(partnerShipAgreement.fiscalYearEndDateStr);
            });
        }
        if(null!=partnerShipAgreement.firstFiscalYearStr&&partnerShipAgreement.firstFiscalYearStr!=undefined){
            $('#partnerShipAgreement .firstFiscalYearStr').each(function(){
                $(this).html(partnerShipAgreement.firstFiscalYearStr);
            });
        }
        if(null!=partnerShipAgreement.auditYearStr&&partnerShipAgreement.auditYearStr!=undefined){
            $('#partnerShipAgreement .auditYearStr').each(function(){
                $(this).html(partnerShipAgreement.auditYearStr);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipConAddress&&partnerShipAgreement.limitPartnershipConAddress!=undefined){
            $('#partnerShipAgreement .limitPartnershipConAddress').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConAddress);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipConPhone&&partnerShipAgreement.limitPartnershipConPhone!=undefined){
            $('#partnerShipAgreement .limitPartnershipConPhone').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConPhone);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipConsignee&&partnerShipAgreement.limitPartnershipConsignee!=undefined){
            $('#partnerShipAgreement .limitPartnershipConsignee').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConsignee);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConAddress&&partnerShipAgreement.generalPartnershipConAddress!=undefined){
            $('#partnerShipAgreement .generalPartnershipConAddress').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConAddress);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConPhone&&partnerShipAgreement.generalPartnershipConPhone!=undefined){
            $('#partnerShipAgreement .generalPartnershipConPhone').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConPhone);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConsignee&&partnerShipAgreement.generalPartnershipConsignee!=undefined){
            $('#partnerShipAgreement .generalPartnershipConsignee').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConsignee);
            });
        }
        if(null!=partnerShipAgreement.orderUserName&&partnerShipAgreement.orderUserName!=undefined){
            $('#partnerShipAgreement .orderUserName').each(function(){
                $(this).html(partnerShipAgreement.orderUserName);
            });
        }
        if(null!=partnerShipAgreement.orderPrice&&partnerShipAgreement.orderPrice!=undefined){
            $('#partnerShipAgreement .orderPrice').each(function(){
                $(this).html(partnerShipAgreement.orderPrice);
            });
        }
        if(null!=partnerShipAgreement.orderPriceCn&&partnerShipAgreement.orderPriceCn!=undefined){
            $('#partnerShipAgreement .orderPriceCn').each(function(){
                $(this).html(partnerShipAgreement.orderPriceCn);
            });
        }
        if(null!=partnerShipAgreement.investAmountListImg&&partnerShipAgreement.investAmountListImg!=undefined){
            $('#partnerShipAgreement .investAmountListImg').each(function(){
                var imgStr = '<img src="'+staticUrl+partnerShipAgreement.investAmountListImg+'">';
                $(this).html(imgStr);
            });
        }
        if(null!=partnerShipAgreement.projectIndustry&&partnerShipAgreement.projectIndustry!=undefined){
            $('#partnerShipAgreement .projectIndustry').each(function(){
                $(this).html(partnerShipAgreement.projectIndustry);
            });
        }
        if(null!=partnerShipAgreement.orderUserMobile&&partnerShipAgreement.orderUserMobile!=undefined){
            $('#partnerShipAgreement .orderUserMobile').each(function(){
                $(this).html(partnerShipAgreement.orderUserMobile);
            });
        }
        if(null!=partnerShipAgreement.orderUserAddress&&partnerShipAgreement.orderUserAddress!=undefined){
            $('#partnerShipAgreement .orderUserAddress').each(function(){
                $(this).html(partnerShipAgreement.orderUserAddress);
            });
        }
        if(null!=partnerShipAgreement.orderUserIdcardno&&partnerShipAgreement.orderUserIdcardno!=undefined){
            $('#partnerShipAgreement .orderUserIdcardno').each(function(){
                $(this).html(partnerShipAgreement.orderUserIdcardno);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipRegAddress&&partnerShipAgreement.limitPartnershipRegAddress!=undefined){
            $('#partnerShipAgreement .limitPartnershipRegAddress').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipRegAddress);
            });
        }
        /**
         * jingpinghong@creditease.cn
         * 20170225
         * 12.1.1数据从后端返回
         */
        if(null!=partnerShipAgreement.limitPartnershipConAddress && partnerShipAgreement.limitPartnershipConAddress !=undefined){
            $('#partnerShipAgreement .limitPartnershipConAddress').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConAddress);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipConPhone &&partnerShipAgreement.limitPartnershipConPhone !=undefined){
            $('#partnerShipAgreement .limitPartnershipConPhone').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConPhone);
            });
        }
        if(null!=partnerShipAgreement.limitPartnershipConsignee&&partnerShipAgreement.limitPartnershipConsignee!=undefined){
            $('#partnerShipAgreement .limitPartnershipConsignee').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipConsignee);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConAddress&&partnerShipAgreement.generalPartnershipConAddress!=undefined){
            $('#partnerShipAgreement .generalPartnershipConAddress').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConAddress);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConPhone&&partnerShipAgreement.generalPartnershipConPhone!=undefined){
            $('#partnerShipAgreement .generalPartnershipConPhone').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConPhone);
            });
        }
        if(null!=partnerShipAgreement.generalPartnershipConsignee&&partnerShipAgreement.generalPartnershipConsignee!=undefined){
            $('#partnerShipAgreement .generalPartnershipConsignee').each(function(){
                $(this).html(partnerShipAgreement.generalPartnershipConsignee);
            });
        }





        if(null!=partnerShipAgreement.remainAmount&&partnerShipAgreement.remainAmount!=undefined){
                $('#remain-amount').html(partnerShipAgreement.remainAmount);
        }
        if(null!=partnerShipAgreement.stock&&partnerShipAgreement.stock!=undefined){
                $('#stock').html(partnerShipAgreement.stock);
        }
    }


})();
