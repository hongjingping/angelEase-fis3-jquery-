$(function () {
	checkUserLogin();
	//校验用户是否已经实名认证
    $.ajax({
        type: 'POST',
        url: host + 'user/auth/realNameResult.htm',
        data:token_client_data,
        dataType: 'JSON',
        success: function (data) {
            alert(data.code);
        	//如果已经实名认证，调到结果页
        	if(data.code == '0000'){
        		var length = 0;
        		length = data.data.realName.length;
        		$('#realName1').text(data.data.realName);
				//$('.isinvest').css('display','block');
        		if(data.data.idcardtype == '1'){
        			$('#idcardtype').text('大陆居民身份证');
        		}else if(data.data.idcardtype == '3'){
        			$('#idcardtype').text('港澳回乡证');
        		}else if(data.data.idcardtype == '4'){
        			$('#idcardtype').text('台胞证');
        		}else if(data.data.idcardtype == '5'){
        			$('#idcardtype').text('外籍护照');
        		}
        		length = data.data.idcardno.length;
        		$('#idcardno').text(data.data.idcardno.substring(0,3)+'*******'+data.data.idcardno.substring(length-3));
        		$('#bankName').text(data.data.bankName);
        		length = data.data.bankNo.length;
                if (length !== 0) {
            		$('#bankNo').text(data.data.bankNo.substring(0,3)+'*******'+data.data.bankNo.substring(length-3));
                }
        		if(data.data.idcardtype == '1'){
        			$('.sfz').css('display','block');
        			if(data.data.isInvest == '1')
					{
						//$('.isinvest').css('display','none');
					}
        		}else{
        			if(data.data.status == '2'){
        				$('.reason').text('原因:'+data.data.msg);
        			}
        			var css = '.gat_'+data.data.status;
        			$(css).css('display','block');
        			$('#pic1').attr('src',staticUrl+data.data.pic1);
        			$('#pic2').attr('src',staticUrl+data.data.pic2);
        			$('#pic3').attr('src',staticUrl+data.data.pic3);
        			$('.gat').css('display','block');
        			if(data.data.isInvest == '1')
					{
						//$('.isinvest').css('display','none');
					}
        		}
        	}else{
        		window.location.href = '/page/realname/auth.html';
        	}
		},
		error:function(){
			//window.location.href = '/page/login/login.html';
		}
    });
});
//重新认证
function recheck(){
	window.location.href='/page/realname/auth.html?type=noskip';
}
//更换绑定银行卡
function update(){
	window.location.href ='/page/bankcard/ident.html';
}

//合格投资人认证
function toInvestor(){
	window.location.href='/page/investor/identification.html';
}
