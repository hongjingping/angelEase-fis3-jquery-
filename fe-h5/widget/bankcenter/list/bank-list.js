(function () {

    checkUserLogin();

    var BankList = {
        init: function () {
            this.getBankList();
        },
        getBankList: function () {

            /* ajax data start */
            var tpl = __inline('bank-list.tmpl');
            var fetchBankList  = $.ajax({
                url: host + 'bindbankcard/getBindBankCardList.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });
            fetchBankList.done(function (data) {
                var bankTypeMap = {
                    1: '储蓄卡',
                    2: '信用卡',
                };

                var bankColorMap = {
                    '#478DCA': 'bank-blue-item',
                    '#8BC358': 'bank-green-item',
                    '#ED6B6B': 'bank-red-item',
                };

                var bankCardListEl = '';
                if (data.code == '0000') {
                    var bankListLen = data.data.payBindBankCardList.length;
                    if (bankListLen == 0) {
                        window.location.href = '/page/bankcenter/mybank-without-data.html'
                    }
                    data.data.payBindBankCardList = data.data.payBindBankCardList.map(function(item) {
                        var bankType = item.bankType || 1;
                        var bankColor = item.color || '#478DCA';
                        item.bankTypeName = bankTypeMap[bankType];
                        item.bankColorClass = bankColorMap[bankColor];
                        item.logourl = staticUrl + item.logo
                        return item;
                    });
                     bankCardListEl = tpl(data);
                    if (bankListLen > 0 && bankListLen < 5) {
                        $('#add-bank-card').click(function () {
                            window.location.href = '/page/add-bank-card/add-bank-card.html'
                        })
                    } else {
                        if (bankListLen >= 5) {
                            var limitSmartAlert = new SmartAlert({
                                content: '<div class="icon-wrapper"><i class="ae-mobile ae-mobile-attention notice-attention"></i></div><div class="content-txt">抱歉，您的银行卡绑定已达上限，请解绑后再重新添加。</div>' ,
                                type: 'confirm',
                                okText: '我知道了',
                                maskClosable: false,
                            });
                            $('#add-bank-card').click(function () {
                                limitSmartAlert.open();
                            })
                        }
                    }
                if (bankCardListEl) $('#bank-list-wrapper').html(bankCardListEl);
                } else if (data.code == '9999') {
                    window.location.href = '/page/personal_center/personal-center.html';
                }
            })
            /* ajax data end */
        },
    };

    BankList.init();

})();