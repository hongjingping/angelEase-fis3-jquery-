(function() {
    checkUserLogin();
    var req = getRequest();
    var type = req.type;
    var adrLength = 0;
    //初始化
    var adrList = '<ul class="addressList">';
    $.ajax({
        type: 'POST',
        url: host + '/address/addressList.htm',
        data: token_client_data,
        dataType: 'JSON',
        async: false,
        success: function(result) {
            if (result.code == '0000') {
                adrLength = result.data.length;
                if (result.data != null && result.data != '') {
                	var newHtml = '';
                    $.each(result.data, function(i, adr) {
                        var adrs= ''+
                        '	<tr>' +
                        '		<td>#consignee#</td>' +
                        '		<td>#ssx#</td>'+
                        '		<td>#detail#</td>' +
                        '		<td>#zipCode#</td>' +
                        '		<td>#mobile#</td>' +
                        '       <td class="center-do">' +
                        '			<i class="ae-icon ae-icon-edit icon-address-edit" onclick="javascript:edit(#edit_adrId#)"></i>'+
                        '			<i class="ae-icon ae-icon-delete" onclick="javascript:del(#del_adrId#)"></i>'+
                        '		</td>'+
                        '		#default#' +
                        '	</tr>';
                        newHtml = adrs.replace('#consignee#',adr.consignee).
                        			   replace('#ssx#',adr.ssx).
                        			   replace('#detail#',adr.detail).
                        			   replace('#zipCode#',adr.zipCode).
                        			   replace('#mobile#',adr.mobile).
                        			   replace('#edit_adrId#',adr.adrId).
                        			   replace('#del_adrId#',adr.adrId);
                        if(adr.default == 1){
                        	newHtml = newHtml.replace('#default#','<td class="default-address">默认地址</td>');
                        }else{
                        	newHtml = newHtml.replace('#default#','<td><button class="btn" onclick="javascript:setDefault('+adr.adrId+')">设为默认</button></td>');
                        }
                        $('#address_list').append(newHtml);
                    });
                }
            } else if (result.code == '4000') {
                // window.location.href = loginUrl;
                handleLoginTimeout();
            }
        },
        error: function(e) {
        }
    });

    //添加地址
    $('#addBtn').click(function() {
        if (adrLength >= 5) {
        	var readSmartAlert = new SmartAlert({
        	    title: '提示',
        	    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">最多只能添加5个地址</span>',
        	    type: 'confirm',
        	    okText: '我知道了',
        	    maskClosable: false,
        	});
        	readSmartAlert.open();
            return false;
        }
        window.location.href = 'editaddress.html?type=' + type;
    });

    if ($('.addressList')) {
        $('.addressList').find('.basic-i').click(function() {
            var orderFlag = storage.get('order-to-address');
            if (orderFlag == '1') {
                var addrId = $(this).attr('data-adr');
                storage.remove('order-to-address');
                window.location.href = '../order/order?addrId=' + addrId;
            }
        });
    }
})();

//设置默认
function setDefault(addrId){
    var changeDefaultSmartAlert = new SmartAlert({
        title: '信息',
        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">确定要设为默认吗？</span>',
        // type: 'confirm',
        okText: '确定',
        onOk: function () {
            $.ajax({
                type: 'POST',
                url: host + '/address/setDefault.htm?addrId='+addrId,
                data: token_client_data,
                dataType: 'JSON',
                success:function(result){
                    if(result.code == '0000'){
                        window.location.href = 'myaddress.html';
                    }else{
                        $('#error').text('设置默认地址失败');
                    }
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        maskClosable: false,
    });
    changeDefaultSmartAlert.open();
	// if (confirm('确定要设为默认吗？')) {
	// 	$.ajax({
	// 		type: 'POST',
	//         url: host + '/address/setDefault.htm?addrId='+addrId,
	//         data: token_client_data,
	//         dataType: 'JSON',
	//         success:function(result){
	//         	if(result.code == '0000'){
	//         		window.location.href = 'myaddress.html';
	//         	}else{
	//         		$('#error').text('设置默认地址失败');
	//         	}
	//         },
	//         error:function(e){
	//         	console.log(e);
	//         }
	// 	});
	// }
}

//编辑
function edit(addrId){
	window.location.href = 'editaddress.html?addrId='+addrId;
}
//删除
function del(addrId){
    var deleteAddressSmartAlert = new SmartAlert({
        title: '信息',
        content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">确定要删除吗？</span>',
        // type: 'confirm',
        okText: '确定',
        onOk: function () {
             $.ajax({
                type: 'POST',
                url: host + '/address/delAddress.htm?id=' + addrId,
                dataType: 'JSON',
                data: token_client_data,
                success: function(result) {
                    if (result.code == '0000') {
                        window.location.href = baseUrl + 'address/myaddress';
                    } else if (result.code == '4000') {
                        // window.location.href = loginUrl;
                        handleLoginTimeout();
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        maskClosable: false,
    });
    deleteAddressSmartAlert.open();
	// if (confirm('确定要删除吗？')) {
 //        $.ajax({
 //            type: 'POST',
 //            url: host + '/address/delAddress.htm?id=' + addrId,
 //            dataType: 'JSON',
 //            data: token_client_data,
 //            success: function(result) {
 //                if (result.code == '0000') {
 //                    window.location.href = baseUrl + 'address/myaddress';
 //                } else if (result.code == '4000') {
 //                    window.location.href = loginUrl;
 //                }
 //            },
 //            error: function(e) {
 //                console.log(e);
 //            }
 //        });
 //    }
}
