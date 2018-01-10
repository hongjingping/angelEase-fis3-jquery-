(function () {
    var BankList = {
        init: function () {
            this.getBankList();
            this.getProductId();
            this.setBankIdFromPayPage();
            this.hideAddBankCard();
        },

        hideAddBankCard: function () {
            var hideFlag = getRequest().fromPayPage;

            if (hideFlag) {
                $('.bank-join').hide();
            }
        },

        getBankList: function () {
            checkUserLogin();

            var me = this;
            var tpl = __inline('bank-items.tmpl');

            $.ajax({
                url: host + 'bindbankcard/getBindBankCardList.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
                success: function (data) {
                    var bankCardList = '';

                    if (data.code === '0000') {
                        bankCardList = tpl(data);
                    }

                    if (bankCardList) {
                        $('.list-wrap').html(bankCardList);
                    }
                }
            }).done(function () {
                me.selectedBankItem();
                me.toFromPage();
            });
        },

        setBankIdFromPayPage: function () {
            var fromPayPageFlag = getRequest().fromPayPage;
            var orderId = getRequest().orderId;

            if (fromPayPageFlag && orderId) {
                $('.list-wrap').attr('from-pay-page', fromPayPageFlag).attr('order-id', orderId);
            }
        },

        selectedBankItem: function () {
			$('.bank-item').click(function() {
				$('.bank-item').each(function() {
					$(this).removeClass('item-selected');
					$(this).find('.tick-icon').hide();
				});

				$(this).addClass('item-selected');
				$(this).find('.tick-icon').show();
			});
		},

        getProductId: function () {
            this.proId = getRequest().proId;
            $('.bank-container').attr('product-id', this.proId);
        },

        toFromPage: function () {
            $('.bank-item').on('click', function () {
                // from oder page data
                var bankCode = $(this).attr('bank-code');
                var _this = this;
                $.ajax({
                      type: 'POST',
                      url: host + '/order/checkOfflineBank.htm',
                      data: $.extend(token_client_data,{bankCode:bankCode}),
                      dataType: 'JSON',
                      success: function(result) {
                          function goPage(t) {
                            var req = getRequest();
                            var proId = req.proId;
                            var proinveseId = req.proinveseId;

                            var bankId = $(t).attr('bank-item-id');
                            var productId = $('.bank-container').attr('product-id');

                            // from pay page data
                            var fromPageFlag = $('.list-wrap').attr('from-pay-page');
                            var orderId = $('.list-wrap').attr('order-id');

                            if (fromPageFlag && fromPageFlag != 'undefined') {
                                console.log('fromPageFlag')
                                // pay page
                                if (bankId && orderId) {
                                    window.location.href = baseUrl + 'payment/paymentmethod.html?bankId=' + bankId + '&fromBankListPage=' + fromPageFlag + '&orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                                }
                            } else {
                                // order page
                                if (bankId && productId) {

                                    window.location.href = baseUrl + 'invest_set_order/set-order.html?bankId=' + bankId+ '&proId=' + productId + '&proinveseId=' + proinveseId + '&noticeType=order';
                                } else {
                                    window.location.href = baseUrl + 'home/home.html';
                                }
                            }
                          }

                          if (result.code === '9999') {
                            $(_this).removeClass('item-selected');
                  					$(_this).find('.tick-icon').hide();
                            $('.bankoff-dialog .dialog-content-text').html(result.desc);
                            $('.bankoff-dialog').show();
                            $('.gray-mask').show();
                            $('.i-know,.dialog-close').click(function() {
                                $('.bankoff-dialog,.gray-mask').hide();
                                goPage(_this);
                            });
                          }else{
                            goPage(_this);
                          }
                      }
                  });
                });
        }
    };

    BankList.init();

})();
