(function () {
    var request = getRequest();
    var orderId = request.orderId;

    //var host = 'http://127.0.0.1:8080/rest/';

    //var orderId = '930';

    if(null==orderId||''==orderId|| typeof(orderId) == 'undefined'){
        return false;
    }

    // 查询该订单协议相关信息
    $.ajax({
        type: 'POST',
        url: host + 'protocol/getProtocolPara.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
                console.info(data.data);
                var appointmentLetterOfIntent = data.data.appointmentLetterOfIntent;
                var investmentShareTransferAgreement = data.data.investmentShareTransferAgreement;
                var investorStatement = data.data.investorStatement;
                var partnerShipAgreement2 = data.data.partnerShipAgreement2;
                var partnerShipAgreement = data.data.partnerShipAgreement;
                var investmenTriskStatement = data.data.investmenTriskStatement;
                insertAppointmentData(appointmentLetterOfIntent);
                insertInvestmentShareTransferAgreementData(investmentShareTransferAgreement);
                insertinvestorStatementData(investorStatement);
                insertpartnerShipAgreement2Data(partnerShipAgreement2);
                insertpartnerShipAgreementData(partnerShipAgreement);
                insertInvestmenTriskStatementData(investmenTriskStatement);
                
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });

    //预约意向书
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

    //投资份额转让协议
    function insertInvestmentShareTransferAgreementData (investmentShareTransferAgreement) {
        if(null!=investmentShareTransferAgreement.finacierCompanyName&&investmentShareTransferAgreement.finacierCompanyName!=undefined){
            $('#investmentShareTransferAgreement .finacierCompanyName').each(function(){
                $(this).html(investmentShareTransferAgreement.finacierCompanyName);
            });
        }
            
        if(null!=investmentShareTransferAgreement.finacierCompanyLegal&&investmentShareTransferAgreement.finacierCompanyLegal!=undefined){
            $('#investmentShareTransferAgreement .finacierCompanyLegal').each(function(){
                $(this).html(investmentShareTransferAgreement.finacierCompanyLegal);
            });
        }
        if(null!=investmentShareTransferAgreement.finacierCompanyAddress&&investmentShareTransferAgreement.finacierCompanyAddress!=undefined){
            $('#investmentShareTransferAgreement .finacierCompanyAddress').each(function(){
                $(this).html(investmentShareTransferAgreement.finacierCompanyAddress);
            });
        }
        if(null!=investmentShareTransferAgreement.orderUserName&&investmentShareTransferAgreement.orderUserName!=undefined){
            $('#investmentShareTransferAgreement .orderUserName').each(function(){
                $(this).html(investmentShareTransferAgreement.orderUserName);
            });
        }
        if(null!=investmentShareTransferAgreement.orderUserIdcardno&&investmentShareTransferAgreement.orderUserIdcardno!=undefined){
            $('#investmentShareTransferAgreement .orderUserIdcardno').each(function(){
                $(this).html(investmentShareTransferAgreement.orderUserIdcardno);
            });
        }
        if(null!=investmentShareTransferAgreement.cruYear&&investmentShareTransferAgreement.cruYear!=undefined){
            $('#investmentShareTransferAgreement .cruYear').each(function(){
                $(this).html(investmentShareTransferAgreement.cruYear);
            });
        }
        if(null!=investmentShareTransferAgreement.proInvAmount&&investmentShareTransferAgreement.proInvAmount!=undefined){
            $('#investmentShareTransferAgreement .proInvAmount').each(function(){
                $(this).html(investmentShareTransferAgreement.proInvAmount);
            });
        }
        if(null!=investmentShareTransferAgreement.proAccountName&&investmentShareTransferAgreement.proAccountName!=undefined){
            $('#investmentShareTransferAgreement .proAccountName').each(function(){
                $(this).html(investmentShareTransferAgreement.proAccountName);
            });
        }
        if(null!=investmentShareTransferAgreement.proAccountBankName&&investmentShareTransferAgreement.proAccountBankName!=undefined){
            $('#investmentShareTransferAgreement .proAccountBankName').each(function(){
                $(this).html(investmentShareTransferAgreement.proAccountBankName);
            });
        }
        if(null!=investmentShareTransferAgreement.proAccountBankNo&&investmentShareTransferAgreement.proAccountBankNo!=undefined){
            $('#investmentShareTransferAgreement .limitPartnershipAccountNum').each(function(){
                $(this).html(investmentShareTransferAgreement.proAccountBankNo);
            });
        }
        if(null!=investmentShareTransferAgreement.divisionOfIncome&&investmentShareTransferAgreement.divisionOfIncome!=undefined){
            $('#investmentShareTransferAgreement .divisionOfIncome').each(function(){
                $(this).html(investmentShareTransferAgreement.divisionOfIncome);
            });
        }
        if(null!=investmentShareTransferAgreement.investorRightsAndObligations&&investmentShareTransferAgreement.investorRightsAndObligations!=undefined){
            $('#investmentShareTransferAgreement .investorRightsAndObligations').each(function(){
                $(this).html(investmentShareTransferAgreement.investorRightsAndObligations);
            });
        }
        if(null!=investmentShareTransferAgreement.rightsAndObligationsOfPartyA&&investmentShareTransferAgreement.rightsAndObligationsOfPartyA!=undefined){
            $('#investmentShareTransferAgreement .rightsAndObligationsOfPartyA').each(function(){
                $(this).html(investmentShareTransferAgreement.rightsAndObligationsOfPartyA);
            });
        }
        if(null!=investmentShareTransferAgreement.liabilityForBreachOfContract&&investmentShareTransferAgreement.liabilityForBreachOfContract!=undefined){
            $('#investmentShareTransferAgreement .liabilityForBreachOfContract').each(function(){
                $(this).html(investmentShareTransferAgreement.liabilityForBreachOfContract);
            });
        }
        if(null!=investmentShareTransferAgreement.orderUserAddress&&investmentShareTransferAgreement.orderUserAddress!=undefined){
            $('#investmentShareTransferAgreement .orderUserAddress').each(function(){
                $(this).html(investmentShareTransferAgreement.orderUserAddress);
            });
        }
        if(null!=investmentShareTransferAgreement.orderUserMobile&&investmentShareTransferAgreement.orderUserMobile!=undefined){
            $('#investmentShareTransferAgreement .orderUserMobile').each(function(){
                $(this).html(investmentShareTransferAgreement.orderUserMobile);
            });
        }
        if(null!=investmentShareTransferAgreement.dateStr&&investmentShareTransferAgreement.dateStr!=undefined){
            $('#investmentShareTransferAgreement .dateStr').each(function(){
                $(this).html(investmentShareTransferAgreement.dateStr);
            });
        }
    }

    //投资人声明
    function insertinvestorStatementData (investorStatement) {
        if(null!=investorStatement.dateStr&&investorStatement.dateStr!=undefined){
            $('#investorStatement .dateStr').each(function(){
                $(this).html(investorStatement.dateStr);
            });
        }
    }

    //入伙协议
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
    }


    //合伙协议
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
        //有限合伙企业所在地
        if(null!=partnerShipAgreement.limitPartnershipAddress&&partnerShipAgreement.limitPartnershipAddress!=undefined){
            $('#partnerShipAgreement .limitPartnershipAddress').each(function(){
                $(this).html(partnerShipAgreement.limitPartnershipAddress);
            });
        }
        //融资公司名称
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
    }


    //投资风险声明书
    function insertInvestmenTriskStatementData (investmenTriskStatement) {
        if(null!=investmenTriskStatement.dateStr&&investmenTriskStatement.dateStr!=undefined){
            $('#investmenTriskStatement .dateStr').each(function(){
                $(this).html(investmenTriskStatement.dateStr);
            });
        }
    }

})();