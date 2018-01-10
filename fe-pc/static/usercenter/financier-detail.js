$(function () {
//	checkUserLogin();

	//PC融资人查询
	$.ajax({
		url: host + 'user/auth/getInvestor.htm?applyType=2',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				var length = result.data.realName.length;
				$('#real-name').html('**' + result.data.realName.substring(length-1));
				$('#mobile').html(result.data.mobile.substring(0,3) + '***' + result.data.mobile.substring(7));
				var type = '个人';
				$('#type').html(type);
				if(result.data.investorInfo.company != ''){
					$('#company').html('***' + result.data.investorInfo.company.substring(2));
				}
				if(result.data.investorInfo.orgCode != ''){
					$('#orgcode').html('***********' + result.data.investorInfo.orgCode.substring(7));
				}
				if(result.data.investorInfo.contact != ''){
					$('#contact').html(result.data.investorInfo.contact.substring(0,3) + '***' + result.data.investorInfo.contact.substring(7));
				}
				$('#email').html(result.data.investorInfo.email);
				$('#provinceaddr').html(result.data.investorInfo.province + result.data.investorInfo.city + result.data.investorInfo.district);
				$('#contactAddress').html(result.data.investorInfo.contactAddress);
				var legalNumberTypestr = '';
				if(result.data.investorInfo.legalNumberType == '1'){
					legalNumberTypestr = '身份证';
				}else{
					legalNumberTypestr = '其他';
				}
				$('#legalNumberType').html(legalNumberTypestr);
				if(result.data.investorInfo.licenseNumber != ''){
					$('#licenseNumber').html(result.data.investorInfo.licenseNumber.substring(0,3) + '***********' + result.data.investorInfo.licenseNumber.substring(14));
				}
				if(result.data.investorInfo.busLic != ''){
					$('#busLic').html(result.data.investorInfo.busLic.substring(0,3) + '***********' + result.data.investorInfo.busLic.substring(6));
				}
				if(result.data.investorInfo.idImgPath != ''){
					$('#certPhoto1').attr('src',staticUrl+result.data.investorInfo.idImgPath);
				}
				if(result.data.investorInfo.idImgPath != ''){
					$('#certPhoto2').attr('src',staticUrl+result.data.investorInfo.assetProofImgPath);
				}
				if(result.data.investorInfo.status == '0'){
					$('.success').css('display','block');
				}else if(result.data.investorInfo.status == '1'){
					$('.text-danger').html('恭喜您认证成功！');
				}else{
					$('.text-danger').html('很遗憾您的认证未通过！');
					$('.err-data').css('display','block');
//					if(result.data.angelInvauditLogInfo.rejectReason != '' && result.data.angelInvauditLogInfo.rejectReason != undefined){
//						$('.err-text').html(result.data.angelInvauditLogInfo.rejectReason);
//					}
				}
			}else if(result.code=='4000'){
                // location.href = loginUrl;
                handleLoginTimeout();
            }
		},
		error:function(e) {
		}
	});

	//PC重新认证
	$('#toFinancier').click(function(){
		window.location.href = '../financier/toFinancier.html';
	});
})
