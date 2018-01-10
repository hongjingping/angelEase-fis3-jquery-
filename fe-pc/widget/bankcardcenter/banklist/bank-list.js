(function () {

    checkUserLogin();

    var BankList = {
        init: function () {
            this.getBankList();
        },
        getBankList: function () {

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

                var bankCardListEl = '';
                if (data.code == '0000') {
                    var bankListLen = data.data.payBindBankCardList.length;
                    data.data.payBindBankCardList = data.data.payBindBankCardList.map(function(item) {
                        var bankType = item.bankType || 1;
                        item.bankTypeName = bankTypeMap[bankType];
                        item.logourl = staticUrl + item.logo
                        return item;
                    });
                    if (bankListLen == 0) {
                        //
                        $('#bank-list-wrapper').hide();
                    }
                    if (bankListLen > 0 && bankListLen <= 5) {
                        $('#no-bank-wrapper').hide();
                        bankCardListEl = tpl(data);
                        $('#add-bank-card').click(function () {
                            window.location.href = '/page/add-bank-card/add-bank-card.html'
                        })
                    }
                    if (bankCardListEl) {
                        $('#bank-list-wrapper').html(bankCardListEl);
                    }

                    // 解绑逻辑
                    $('.unbind').on('click', function (e) {
                        var bindBankCardId = $(e.target).parents('.bank-item').attr('id')
                        var bankNumber = $(e.target).parent('.phone-number-wrapper').siblings('.bank-number-wrapper').find('.bank-tail-number').html()
                        var unbindConfirmSmartAlert = new SmartAlert({
                            title: '解绑银行卡',
                            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">确定解除尾号为' + bankNumber + '的银行卡吗？</span>',
                            okText: '确定',
                            onOk: function () {
                                var unbindAjax = $.ajax({
                                    url: host + 'bindbankcard/unbindPayBankCard.htm',
                                    type: 'POST',
                                    data: {
                                        token: token_client_data.token,
                                        clientType: token_client_data.clientType,
                                        bindBankCardId: bindBankCardId
                                    },
                                    dataType: 'JSON',
                                })
                                unbindAjax.done(function (data) {
                                    if(data.code == '0000') {
                                        document.location.reload()
                                    } else if (data.code == '9999'){
                                        var unbindSmartAlert = new SmartAlert({
                                            title: 'error',
                                            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
                                            type: 'confirm',
                                            okText: '我知道了',
                                            maskClosable: false,
                                        });
                                        unbindSmartAlert.open();
                                    }
                                })
                            },
                            maskClosable: false,
                        });
                        unbindConfirmSmartAlert.open();
                    })
                } else if (data.code == '9999') {
                    $('#bank-list-wrapper').hide();
                }
            })
        },
    };

    BankList.init();
})();