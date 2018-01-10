(function () {
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
                $('.fund-num').html(formatMoney(result.data.angelOrder.price));
                $('#orderNo').html(result.data.angelOrder.orderNo);
                $('#proName').html(result.data.angelOrder.prejectName);
                $('#proInveseAmount').html(formatMoney(result.data.angelOrder.price) + '元');
                var userName = result.data.angelOrder.extend2;
                $('#userName').html('**' + userName.substring(userName.length-1,userName.length));
                $('#userAddress').html(result.data.angelOrder.address);
                var mobile = result.data.angelOrder.mobile;
                $('#mobile').html(mobile.substring(0,3) + '****' + mobile.substring(7));
                $('#zipCode').html(result.data.angelOrder.zipCode);
                $('.banner-sign').html(getOrderStatus(showCode,orderId,proId,projectStatus,result.data.angelOrder.extend1,result.data.angelOrder.extend3));
                $('.nav-sign').html(getOrderStatusByName(showCode));
                $('.title-para').html(getInvestInfo(showCode,proId));
                // 待支付
                if (showCode == '001') {
                    $('.nav-sign').css('color', '#ff9644');
                }
                // 支付中
                else if (showCode == '015') {
                    $('.nav-sign').css('color', '#9BD560');
                }
                // 待确认投资结果（已支付，待审核）
                else if (showCode == '004') {
                    $('.nav-sign').css('color', '#9BD560');
                    $('.detail-banner').hide();
                } 
                // 待确认投资结果（已支付，审核通过）
                else if (showCode == '005') {
                    $('.nav-sign').css('color', '#9BD560');
                    $('.detail-banner').hide();
                } 
                // 待签约 
                else if (showCode == '006') {
                    $('.nav-sign').css('color', '#ff9644');
                } 
                // 待重签
                else if (showCode == '007') {
                    $('.nav-sign').css('color', '#ff9644');
                } 
                // 待上传打款凭证（已支付，待上传打款凭证）
                else if (showCode == '008') {
                    $('.nav-sign').css('color', '#ff9644');
                } 
                // 投资成功
                else if (showCode == '009') {
                    $('.nav-sign').css('color', '#9BD560');
                    $('.detail-banner').hide();
                } 
                // 投资失败，待退款（全额
                else if (showCode == '010') {
                    $('.nav-sign').css('color', '#9b9b9b');
                    $('.detail-banner').hide();
                } 
                // 投资失败，已退款（全额）
                else if (showCode == '012') {
                    $('.nav-sign').css('color', '#9b9b9b');
                    $('.detail-banner').hide();
                } 
                // 已取消，超时未支付已取消
                else if (showCode == '013') {
                    $('.nav-sign').css('color', '#9b9b9b');
                }
            } else if (result.code == '4000') {
                //window.location.href = loginUrl;
                /*
                 * jingpinghong@creditease.cn
                 * 2017-02-16
                 * */
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

    // 返回
    $('#back').click(function() {
    	window.location.href = '../../page/invest/list.html';
    });

    // 获取订单状态对应投资信息
    function getInvestInfo(showCode,proId) {
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
            $(".detail-title").css('display','block');
            $(".detail-agreement").css('display','block');
            download(orderId);
            hideHrotocol(proId);
            return '投资成功，请您随时关注投后信息';
        }
        // 投资失败，待退款（全额）
        else if (showCode == '010'){
            return '投资失败，待退还投资款';
        }
        // 投资失败，退款中（全额）
        else if (showCode == '011'){
            return '投资失败，正在为您退款';
        }
        // 投资失败，已退款（全额）
        else if (showCode == '012'){
            return '投资失败，投资款已退回您的打款账号';
        }    
        // 已取消，超时未支付已取消 
        else if (showCode == '013'){
            return '订单已取消，您可以重新下单或看看其他项目';
        }
        // 支付中
        else if (showCode == '015'){
            return '订单正在支付中，请您耐心等待';
        }
    }

    // 获取订单状态
    function getOrderStatus(showCode,orderId,proId,projectStatus,proinveseId,bindBankCardId) {
        // 待支付
        if (showCode == '001'){
            return '<a href="#" onclick="getEncodeSign('+orderId+')" class="cmn-btn-gold-w12">去支付</a>';
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
            return '<a href="../../page/sign/sign?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId + '" class="cmn-btn-gold-w12">去签约</a>'
        }
        // 待重签
        else if (showCode == '007'){
            return '<a href="../../page/sign/resign?orderId=' + orderId + '&proId=' + proId + '&proinveseId=' + proinveseId + '&bankId=' + bindBankCardId + '" class="cmn-btn-gold-w12">去重签</a>';
        }
        // 待上传打款凭证（已支付，待上传打款凭证）
        else if (showCode == '008'){
            return '<a href="../../page/success/paysuccess?orderId=' + orderId + '" class="cmn-btn-gold-w12">去上传</a>';
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
             return '<a href="../../page/detail/detail?proId=' + proId + '" class="cmn-btn-gold-w12">重新下单</a>';
        }
    }
})();

// 设置投资成功下载协议
function download(orderId) {
    $.ajax({
        type: 'POST',
        url: host + 'invest/download.htm?orderId=' + orderId,
        dataType: 'JSON',
        data: token_client_data,
        success: function(result) {
            if (result.code == '0000') {
                $('#downLoad').attr('href',result.data);
            } else if (result.code == '4000') {
                //window.location.href = loginUrl;
                /*
                 * jingpinghong@creditease.cn
                 * 2017-02-16
                 * */
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });
}

// 处理众梦平台的老数据，无需显示协议下载
function hideHrotocol(proId) {
    if (proId == '1' || proId == '2' || proId == '4' || proId == '21') {
        $('#orderAgreement').hide();
        $('.detail-agreement').hide();
    }
}