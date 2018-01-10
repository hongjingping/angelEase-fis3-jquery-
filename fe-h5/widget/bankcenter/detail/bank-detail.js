(function () {

    checkUserLogin();

    var BankDetail = {
        init: function () {
            this.getQueryResult();
            this.getBankDetail();
        },
        getQueryResult: function () {
            var queryResult = window.location.search.slice(1)
            .split('&').reduce(function (prev, next) {
                var result = next.split('=');
                prev[result[0]] = result[1];
                return prev;
            }, {});

            if (queryResult.id) {
                return queryResult.id;
            } else {
                // back to bank list
                window.location.href = '/page/bankcenter/mybank.html'
            }
        },
        getBankDetail: function () {
            var paramId = this.getQueryResult();

            var fetchData = $.ajax({
                url: host + 'bindbankcard/getBindBankCardDetail.htm',
                type: 'POST',
                data: {
                    token: token_client_data.token,
                    clientType: token_client_data.clientType,
                    bindBankCardId: paramId
                },
                dataType: 'JSON',
            });

            fetchData.done(function (data) {
                 var bankTypeMap = {
                    1: '储蓄卡',
                    2: '信用卡',
                };

                var bankColorMap = {
                    '#478DCA': 'bank-blue-item',
                    '#8BC358': 'bank-green-item',
                    '#ED6B6B': 'bank-red-item',
                };
                var tpl = __inline('bank-detail.tmpl');
                var bankDetailEl = '';
                if (data.code == '0000') {
                     /* for bankType transfer */
                    var bankType = data.data.payBindBankCard.bankType || 1;
                    data.data.payBindBankCard.bankTypeName = bankTypeMap[bankType];

                    /* for bankColor transfer */
                    var bankColor = data.data.payBindBankCard.color || '#478DCA';
                    data.data.payBindBankCard.bankColorClass = bankColorMap[bankColor];
                    data.data.payBindBankCard.logourl = staticUrl + data.data.payBindBankCard.logo
                    bankDetailEl = tpl(data);
                    var bankNumber = data.data.payBindBankCard.bankCardNo.slice(-4);
                    $('#unbind-model').find('.unbind-text').html('确认解除绑定尾号为' + bankNumber + ' 的银行卡？');
                    $('#unbind-card').on('click', function () {
                        $('#unbind-model').show();
                        $('#unbind-model').find('.gray-mask').show();
                        // var unbindALert = confirm('确认解除绑定尾号为 ' + data.data.payBindBankCard.bankCardNo.slice(-4) + ' 的银行卡？');
                        $('.unbind-cancel').on('click', function () {
                            $('#unbind-model').hide();
                        })
                          // 关闭弹窗
                        $('.dialog-close').on('click', function () {
                            $('#unbind-model').hide();
                        })

                        $('.unbind-yes').on('click', function () {
                            $('#unbind-model').hide();
                            var unbindCard = $.ajax({
                                url: host + 'bindbankcard/unbindPayBankCard.htm',
                                type: 'POST',
                                data: {
                                    token: token_client_data.token,
                                    clientType: token_client_data.clientType,
                                    bindBankCardId: paramId
                                },
                                dataType: 'JSON',
                            });
                            unbindCard.done(function (data) {
                                if(data.code == '0000') {
                                    new SmartToast({
                                        content: '解绑成功',
                                        type: 'success',
                                        duration: 2
                                    });
                                    window.setInterval(function () {
                                        window.location.href = '/page/bankcenter/mybank.html';
                                    }, 3000);
                                } else {
                                    new SmartToast({
                                        content: data.desc,
                                        type: 'warn',
                                        duration: 3
                                    });
                                }
                            })
                        })
                    })
                }
                if (data.code == '4000') {
                    window.location.href = loginUrl;
                }
                if (bankDetailEl) $('#card-detail').html(bankDetailEl);
            });
        }
    };

    BankDetail.init();

})();