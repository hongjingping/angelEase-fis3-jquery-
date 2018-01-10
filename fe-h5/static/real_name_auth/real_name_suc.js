(function () {

var Title = {
	init: function () {
		$("#ts").val("");
		this.setTitleHeader();
		this.closeAgeCheckDialog();
	},
	setTitleHeader: function () {
		$('.cmn-header-title').text('实名认证');
	},
	closeAgeCheckDialog: function () {
		$('#age-close,#age-iknow').click(function () {
			$('#age-model').hide();
		});
	}
};
Title.init();

//业务开始
	checkUserLogin();
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
				var realName = data.data.realName;
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
				var idcardno = data.data.idcardno
				$('#idcardno').text(idcardno);
				$('#bankName').text(data.data.bankName);
				length = data.data.bankNo.length;
				if (length !== 0) {
					var bankNo = data.data.bankNo;
					$('#bankNo').text(bankNo);
				}
				if(data.data.idcardtype == '1'){
					$('.sfz').css('display','block');
					if(data.data.isInvest == '1')
						$('.isinvest').css('display','none');
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
						$('.isinvest').css('display','none');
				}
			}else{
				window.location.href = '/page/real_name_auth/real_name_auth.html';
			}
		},
		error:function(){
			window.location.href = '/page/login/login.html';
		}
	});
})();
//重新认证
function recheck(){
	window.location.href='/page/real_name_auth/real_name_auth.html?type=noskip';
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


//更换绑定银行卡
function update(){
	window.location.href ='/page/modify_card/modify-card-one.html';
}

/**
 * age check (69)
 */
function ageCheck() {
	
}

//合格投资人认证
function toInvestor(){
	$.ajax({
		type: 'POST',
		url: host + 'baseuser/getUserStatus.htm',
		data: token_client_data,
		dataType: 'JSON',
		success: function (data) {
			if (data.code === '0000') {
				if (data.data.investorStatus == 0) {
					$.ajax({
						url: host + 'user/getUserInfo.htm',
						dataType: 'JSON',
						type: 'POST',
						data:token_client_data,
						success: function (result) {
							console.log(result.data.certificateFlag);
							// 身份证用户年龄验证不通过，阻止进入合格投资人认证
							if (result.data.certificateFlag === 1) {
								$('#age-model').find('.suc-text').text(result.data.denyMsg);
								$('#age-model').show();
							} else {
								// 红色 认证页  
								window.location.href= '/page/investor_cert_part1/investor-cert-form.html'; 
							}
						}
					});
				} else if (data.data.investorStatus == 1 || data.data.investorStatus == 5) {
					// 红色 结果页
					window.location.href = '/page/investor_cert_part2/investor-cert-partial-suc.html';
				} else if (data.data.investorStatus == 2 || data.data.investorStatus == 3 || data.data.investorStatus == 4) {
					window.location.href = '/page/investor_cert_part2/investor-cert-partial-suc.html';
				}
			}
			
		}
	});
}