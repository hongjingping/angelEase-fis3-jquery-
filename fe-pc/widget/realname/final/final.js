$(function () {
	checkUserLogin();

    // 校验用户实名认证、合格投资人认证状态
    var checkUserStatus =  $.ajax({
        url: host + 'baseuser/getUserStatus.htm',
        dataType: 'JSON',
        type: 'POST',
        data:token_client_data,
    })

    checkUserStatus.done(function (data) {
        if (data.code == '0000') {
            if (data.data.userCheckStatus == 0){
				window.location.href="/page/realname/auth.html"
			}else if (data.data.investorStatus == 0) {
				// $('.to-invest').on('click', function () {
				// 	window.location.href='/page/investor/identification.html'
				// })
                checkToInvest('/page/investor/identification.html');
			} else {
                // $('.to-invest').on('click', function () {
                //     window.location.href='/page/investor/result.html'
                // })
                checkToInvest('/page/investor/result.html');
            }
        }
    })

    /**
     * 2017-02-24 jihong.zhang@creditease.cn
     * 判断用户是否可以进行投资人认证
     *
    */
    function checkToInvest (linkUrl) {
        var getUserInfoAjax = $.ajax({
            type: 'POST',
            url: host + 'user/getUserInfo.htm',
            data: token_client_data,
            dataType: 'JSON'
        });

        getUserInfoAjax.done(function (data) {
            if(data.data.certificateFlag === 1) {
                $('.to-invest').on('click', function () {
                    var ageLimitAlert = new SmartAlert({
                        title: '年龄超限',
                        content: '<i class="ae-icon ae-icon-attention alert-notice-attention"></i><div class="content-txt-wrapper"><span class="content-txt">'+ data.data.denyMsg +'</span></div>',
                        type: 'confirm',
                        okText: '我知道了',
                        maskClosable: false,
                    });
                    ageLimitAlert.open();
                })
            } else {
                $('.to-invest').on('click', function () {
                    window.location.href= linkUrl;
                })
            }
        })
    }



	//校验用户是否已经实名认证
    $.ajax({
        type: 'POST',
        url: host + 'user/auth/realNameResult.htm',
        data:token_client_data,
        dataType: 'JSON',
        success: function (data) {
        	//如果已经实名认证，调到结果页
        	if(data.code == '0000'){
        		var length = 0;
        		length = data.data.realName.length;
                var realName = data.data.realName
        		$('#realName1').text(realName);
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
                var idcardno = data.data.idcardno;
        		$('#idcardno').text(idcardno);
        		$('#bankName').text(data.data.bankName);
        		length = data.data.bankNo.length;
                var bankNo = data.data.bankNo;
                if (length !== 0) {
            		$('#bankNo').text(bankNo);
                }
        		if(data.data.idcardtype == '1'){
        			$('.sfz').css('display','block');
        			if(data.data.isInvest == '1'){
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
        			if(data.data.isInvest == '1'){
						//$('.isinvest').css('display','none');
					}
        		}
        	}else{
        		window.location.href = '/page/realname/auth.html';
        	}
		},
		error:function(){
			window.location.href = '/page/login/login.html';
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

// 2016-12-23 jihongzhang@creditease.cn 姓名脱敏，只显示第一个字符，如 章**，刘*
function showUserName (name) {
    return name.slice(0, 1) +  new Array(name.length).join('*');
}

// 2016-12-23 jihongzhang@creditease.cn 身份证号、港澳通行证脱敏，不管多少位，只显示前三位，其他的用 * 代替
function showIdCard (idcard) {
   return idcard.slice(0,3) + new Array(idcard.length-2).join('*');
}

// 2016-12-23 jihongzhang@creditease.cn 银行卡号脱敏，不管多少位，只显示后四位，其他的用 * 代替
function showBankCardId (bankno) {
    return new Array(bankno.length-3).join('*') + bankno.slice(-4);
}


//合格投资人认证
function toInvestor(){
    // $.ajax({
    //     url: host + '/aiuser/selectUserByApp.htm',
    //     dataType: 'JSON',
    //     type: 'POST',
    //     data:token_client_data,
    //     success: function (data) {
    //         if (data.code == '0000') {
    //             if (data.data.investorStatus == 0) {
    //                 window.location.href='/page/investor/identification.html'
    //             } else {
    //                 console.log('success')
    //                 window.location.href='/page/investor/result.html'
    //             }
    //         }
    //     },
    //     error:function(e) {
    //     }
    // })
    window.location.href='/page/investor/identification.html'
}
