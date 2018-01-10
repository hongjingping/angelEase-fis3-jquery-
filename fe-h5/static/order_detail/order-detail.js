(function () {

	var OrderDetail = {
		init: function () {
			this.setAboutAeHeader();
		},

		setAboutAeHeader: function () {
			$('.cmn-header-title').text('订单详情');
		}
	};

	OrderDetail.init();

    var req = getRequest();
    var orderId = req.orderId;
    var showCode = req.showCode;
    var proId = req.proId;
    var projectStatus = req.projectStatus;

    $.ajax({
        type: 'POST',
        url: host + 'order/getOrderInfo.htm?orderId=' + orderId,
        dataType: 'JSON',
        data: token_client_data,
        success: function(result) {
            if (result.code == '0000') {
            	$('#proName').html(result.data.angelOrder.prejectName);
            	$('#orderNo').html(result.data.angelOrder.orderNo);
            	$('#investPrice').html(formatMoney(result.data.angelOrder.price) + '元');
            	$('#price').html(formatMoney(result.data.angelOrder.price));
                var userName = result.data.angelOrder.extend2;
                $('#consignee').html('**' + userName.substring(userName.length-1,userName.length));
                $('#address').html(result.data.angelOrder.address);
                var mobile = result.data.angelOrder.mobile;
                $('#mobile').html(mobile.substring(0,3) + '****' + mobile.substring(7));
                $('#zipCode').html(result.data.angelOrder.zipCode);
				$('#orderStatusClass').html(getOrderStatusByName(showCode));
                $('#investInfo').html(getInvestInfo(showCode));
                $('.bottom-bar').append(getOrderStatus(showCode,orderId,proId,projectStatus,result.data.angelOrder.extend1));
            } else if (result.code == '4000') {
                window.location.href = loginUrl;
            }
        },
	    error: function(e) {
	    }
		}).done(function () {
			addOrderStatusClass($('#orderStatusClass').html());
		});

    // 获取订单状态对应投资信息
    function getInvestInfo(showCode) {
        // 待支付
        if (showCode == '001'){
            return '请您支付投资款';
        }
        // 待确认投资结果（已支付，待审核）
        else if (showCode == '004'){
            return '投资结果确认中，请您耐心等待';
        }
        // 待确认投资结果（已支付，审核通过）
        else if (showCode == '005'){
            return '投资结果确认中，请您耐心等待';
        }
        // 待签约
        else if (showCode == '006'){
            return '请您签约后进行支付'
        }
        // 去重签
        else if (showCode == '007'){
            return '您的信息提交有误，请重新签约';
        }
        // 待上传打款凭证
        else if (showCode == '008'){
            return '请您上传打款凭证';
        }
        // 投资成功
        else if (showCode == '009'){
            $(".bottom-bar").hide();
            return '投资成功，请您随时关注投后信息';
        }
        // 投资失败，待退款（全额）
        else if (showCode == '010'){
        	$(".bottom-bar").hide();
            return '投资失败，待退还投资款';
        }
        // 投资失败，退款中（全额）
        else if (showCode == '011'){
        	$(".bottom-bar").hide();
            return '投资失败，正在为您退款';
        }
        // 投资失败，已退款（全额）
        else if (showCode == '012'){
        	$(".bottom-bar").hide();
            return '投资失败，投资款已退回您的打款账号';
        }
        // 已取消，超时未支付已取消
        else if (showCode == '013'){
            return '订单已取消，您可以重新下单或看看其他项目';
        }
    }

    // 获取订单状态
    function getOrderStatus(showCode,orderId,proId,projectStatus,proinveseId) {
        // 待支付
        if (showCode == '001'){
            return '<a onclick="getEncodeSign(' + orderId + ',' + proId + ')" >去支付</a>';
        }
        // 待确认投资结果（已支付，待审核）
        else if (showCode == '004'){
            return '';
        }
        // 待确认投资结果（已支付，审核通过）
        else if (showCode == '005'){
            return '';
        }
        // 待签约
        else if (showCode == '006'){
            return '<a onclick="toSignOrResign(' + orderId + ',' + proId + ',' + proinveseId + ')" >去签约</a>';
        }
        // 待重签
        else if (showCode == '007'){
            return '<a onclick="toSignOrResign(' + orderId + ',' + proId + ',' + proinveseId + ')" >去重签</a>';
        }
        // 待上传打款凭证（已支付，待上传打款凭证）
        else if (showCode == '008'){
            return '<a href="../../page/invest_upload_pay_voucher/upload.html?orderId=' + orderId + '" >去上传</a>';
        }
        // 投资成功
        else if (showCode == '009'){
            return '';
        }
        // 投资失败，待退款（全额）
        else if (showCode == '010'){
            return '';
        }
        // 投资失败，已退款（全额）
        else if (showCode == '012'){
            return '';
        }
        // 已取消，超时未支付已取消
        else if (showCode == '013' && (projectStatus =='2' || projectStatus =='3' || projectStatus =='4')){
             return '<a href="../../page/detail/detail.html?proId=' + proId + '" >重新下单</a>';
        }
    }

    // 获取订单状态名称
	function getOrderStatusByName(showCode) {
	    // 待支付
	    if (showCode == '001'){
	        return '待支付';
	    }
	    // 待确认投资结果（已支付，待审核）
	    else if (showCode == '004'){
	        return '待确认投资结果';
	    }
	    // 待确认投资结果（已支付，审核通过）
	    else if (showCode == '005'){
	        return '待确认投资结果';
	    }
	    // 待签约
	    else if (showCode == '006'){
	        return '待签约'
	    }
	    // 待重签
	    else if (showCode == '007'){
	        return '待重签';
	    }
	    // 待上传打款凭证（已支付，待上传打款凭证）
	    else if (showCode == '008'){
	        return '待上传打款凭证';
	    }
	    // 投资成功
	    else if (showCode == '009'){
	        return '投资成功';
	    }
	    // 投资失败，待退款（全额）
	    else if (showCode == '010'){
	        return '投资失败';
	    }
	    // 投资失败，已退款（全额）
	    else if (showCode == '012'){
	        return '投资失败';
	    }
	    // 已取消，超时未支付已取消
	    else if (showCode == '013'){
	        return '已取消';
	    }
	}

	// 添加订单状态的样式
	function addOrderStatusClass(status) {
        // 2016-12-08 状态为【投资成功】，【投资失败】，【投资取消】的头部边框颜色为灰色(#e0e0e0)，其他的为橘色(#ff9544)
        if (showCode != '009' && showCode != '010' && showCode != '012' && showCode != '013') {
            $('.cmn-header').addClass('header-border-orange');
        }
	    // 待支付
	    if (showCode == '001'){
	        $('#orderStatusClass').addClass('status');
	    }
	    // 待确认投资结果（已支付，待审核）
	    else if (showCode == '004'){
	        $('#orderStatusClass').addClass('status');
	    }
	    // 待确认投资结果（已支付，审核通过）
	    else if (showCode == '005'){
	       $('#orderStatusClass').addClass('status');
	    }
	    // 待签约
	    else if (showCode == '006'){
	        $('#orderStatusClass').addClass('status');
	    }
	    // 待重签
	    else if (showCode == '007'){
	        $('#orderStatusClass').addClass('status');
	    }
	    // 待上传打款凭证（已支付，待上传打款凭证）
	    else if (showCode == '008'){
	        $('#orderStatusClass').addClass('status');
	    }
	    // 投资成功
	    else if (showCode == '009'){
	        $('#orderStatusClass').addClass('status_green');
	    }
	    // 投资失败，待退款（全额）
	    else if (showCode == '010'){
	        $('#orderStatusClass').addClass('status_gray');
	    }
	    // 投资失败，已退款（全额）
	    else if (showCode == '012'){
	        $('#orderStatusClass').addClass('status_gray');
	    }
	    // 已取消，超时未支付已取消
	    else if (showCode == '013'){
	        $('#orderStatusClass').addClass('status_gray');
	    }
	}
})();

// 校验是否有签名完成
function getEncodeSign(orderId){
    $.ajax({
        type: 'POST',
        url: host + 'sig/getEncodeSign.htm?orderId=' + orderId,
        data: token_client_data,
        dataType: 'JSON',
        success: function(data) {
            if (data.code == "0000") {
							//港澳台跳线下支付
							$.ajax({
									url: host + 'order/getUserCheck.htm',
									type: 'post',
									dataType: 'json',
									data:token_client_data,
									success:function (result) {
											// 身份证实名用户
											if (result.code == '0000' && result.data.idcardtype != '1') {
													// 初期化判断上传的身份证是否有效
													window.location.href = baseUrl + 'offlinepayment/offlinepayment.html?orderId=' + orderId;
											}else{
						              window.location.href = baseUrl + 'payment/paymentmethod.html?orderId=' + orderId + '&sign=' + data.data;
													//window.location.href = baseUrl + 'payment/paymentmethod.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
											}
									}
							});
            } else if (data.code == '4000') {
                window.location.href = loginUrl;
            }
        },
        error: function(e) {
        }
    });
}

// 去签约、去重签
function toSignOrResign (orderId, proId, proinveseId) {
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
                            window.location.href = baseUrl + 'invest_sign/agree.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                        } else if (data.code =='4000') {
                            location.href = loginUrl;
                        } else if (data.code == '9999') {
                            new SmartToast({
                                content: data.desc,
                                type: 'warn',
                                duration: 3
                            });
                        } else {
                            window.location.href = baseUrl + 'invest_sign_idupload/upload-step-one.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
                        }
                    },error:function (e) {
                    }
                });
            }
            // 非身份证实名用户
            else {
                window.location.href = baseUrl + 'invest_sign/agree.html?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId;
            }
        },error:function (e) {
        }
    });
}
