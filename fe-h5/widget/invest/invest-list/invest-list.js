(function () {
	var InvestOrder = {
		init: function () {
			this.orderList('',1);
			$('.tabs-list li:nth-child(1)>a').addClass('Underline');
		},
		orderList: function (status,pageIndex) {
			var tpl = __inline('invest-list.tmpl');
			$.ajax({
			    url: host + 'invest/invest.htm?status=' + status + '&page=' + pageIndex,
			    type: 'POST',
			    data: token_client_data,
			    dataType: 'JSON',
			    success: function (data) {
			    	if (data.code == '0000') {
				        if (data.data.retMaps.length > 0) {
				            var html = tpl(data);
				        } else {
				        	var html = '';
			            	if (data.data.retMaps.length == 0) {
					        	var html = '';
					        	html += '<div class="investment-img-container">';
							    html += '<div class="no-data-img"></div>';
							    html += '<div class="investment-text">当前页面无投资记录</div>';
							    html += '<div style="margin-top:20px;">';
							    html += '<a href="/page/home/home.html" class="nkey-operation-button-normal">去看看项目</a>';
							    html += '</div>';
								html += '</div>';
		            		}
				        }
				        $('#investList').html(html);
				    }else if (data.code == '4000') {
	                	window.location.href = loginUrl;
	            	}
			    },
			    error: function(e) {
			    }
			}).done(function () {
			});
		}
	};

	InvestOrder.init();

	// 投资订单
	$(document).on('click', '.value', function(e) {
	    e.preventDefault();
	    status = $(this).attr('value');
	    currentpage = 1;
    	$('.value').each(function(){
			$(this).removeClass('Underline');
		})
	    $('#hidStatus').val(status);
	    InvestOrder.orderList(status,1);
	})
})();

// 去签约、去重签
function toSignOrResign (orderId, proId, proinveseId, bindBankCardId) {
    // 初期化判断是港澳台实名用户还是身份证实名用户
    $.ajax({
        url: host + 'order/getUserCheck.htm',
        type: 'post',
        dataType: 'json',
        data:token_client_data,
        success:function (result) {
            // 身份证实名用户
            if (result.code == '0000' && result.data.idcardtype == '1') {
                // 初期化判断上传的身份证是否有效
                $.ajax({
                    url: host + 'order/checkCard.htm',
                    type: 'post',
                    dataType: 'json',
                    data:token_client_data,
                    success:function (data) {
                        if (data.code == '0000' && data.data.isValid) {
                            window.location.href = baseUrl + 'invest_sign/agree.html?orderId=' + orderId + '&proId=' + proId;
                        } else if (data.code =='4000') {
                            location.href = loginUrl;
                        } else if (data.code == '9999') {
				            new SmartToast({
				                content: data.desc,
				                type: 'warn',
				                duration: 3
				            });
                        } else {
                        	window.location.href = baseUrl + 'invest_sign_idupload/upload-step-one.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId + '&bindBankCardId=' + bindBankCardId;
                        }
                    },error:function (e) {
                    }
                });
            }
            // 非身份证实名用户
            else {
                window.location.href = baseUrl + 'invest_sign/agree.html?orderId=' + orderId + '&proId=' + proId;
            }
        },error:function (e) {
        }
    });
}