var proIds;
(function () {

	var Common = {
		init: function () {
			this.setHeader();
            this.hideDeleteDailog();
		},

		setHeader: function () {
			$('.cmn-header-title').text('我的地址');
		},

        hideDeleteDailog: function () {
            $('.dialog-close').on('click', function () {
                $('.gray-mask').hide();
                $('.dialog-delete').hide();
            });
        }
	};

	Common.init();

    checkUserLogin();

    var req = getRequest();
    var type = req.type;
    var adrLength = 0;
    var proId = req.proId;
    proIds = proId;
    $.ajax({
        type: 'POST',
        url: host + '/address/addressList.htm',
        data: token_client_data,
        dataType: 'JSON',
        async: false,
        success: function(data) {
            if (data.code == '0000') {
            	adrLength = data.data.length;
                if (data.data.length > 0) {
                    var tpl = __inline('address-list.tmpl');
                    var html = tpl(data);
                    $("#divId").html(html);
                } else {
                    $('.col-cover').hide();
                }
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
        }).done(function () {
            var orderFlag = storage.get('order-to-address');
            if (orderFlag != '1') {
                $('.check-mark').hide();
                $('.clear-both').hide();
            }
    });

    // 添加地址
    $("#addBtn").click(function() {
        if (adrLength >= 5) {
            new SmartToast({
                content: '最多只能添加5个地址',
                type: 'warn',
                duration: 3
            });
            return;
        }
        window.location.href = 'edit-address.html?proId=' + proId+"&addOrUpdateFlag=0";
    })

    // order用
    if ($('.col-auto-height')) {
        $('.col-auto-height').find('.info-list-wrapper').click(function() {
            var orderFlag = storage.get('order-to-address');
            if (orderFlag == '1') {
                var addrId = $(this).attr('data-adr-id');
                storage.remove('order-to-address');
                window.location.href = baseUrl + "invest_set_order/set-order.html?addId=" + addrId + '&proId=' + proId;
            }
        });
    }

    // 删除
    $('.toperation-btn-lis').find('#delBtn').click(function() {
        var addressId = $(this).attr('data-adr-id');

        $('.gray-mask').show();
        $('.dialog-delete').show();

        $('.dialog-delete').find('.confirm-yes').on('click', function () {
            $.ajax({
                type: 'POST',
                url: host + '/address/delAddress.htm?id=' + addressId,
                data: token_client_data,
                dataType: 'JSON',
                async: false,
                success: function(result) {
                    if (result.code == '0000') {
                        window.location.href = baseUrl + 'invest_address/my-address.html?proId=' + proId;
                    } else if (result.code == '4000') {
                        window.location.href = loginUrl;
                    }
                },
                error: function(e) {
                }
            });
        });
    });

})();

// 编辑地址
function editAddress(url) {
     window.location.href = baseUrl + url + '&proId=' + proIds;
}

// 离开地址列表页面，清除storage里面的order-to-address
function removeOrderToAddress() {
    storage.remove('order-to-address');
}