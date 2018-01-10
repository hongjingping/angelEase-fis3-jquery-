$(function () {
	checkUserLogin();
	var selHtml = '';
	$('.investor-line').show();
	/*$.ajax({
		url: host + 'user/auth/getInvestor.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				var length = result.data.realName.length;
				$('#real-name').html('**' + result.data.realName.substring(length-1));
				$('#mobile').html(result.data.mobile.substring(0,3) + '***' + result.data.mobile.substring(7));
				var type = '';
				if(result.data.investorInfo.type == '0'){
					type = '个人';
					$('.checkPhoto').hide();
					$('.realname').hide();
					$('.orgcode').hide();
					$('.netAssets').show();
					var investorInfohtml = '';
					if(result.data.investorInfo.netAssets != '' &&　result.data.investorInfo.netAssets != null){
						if(result.data.investorInfo.netAssets == '1'){
							investorInfohtml = '我的金融资产不低于100万元';
						}else if(result.data.investorInfo.netAssets == '2'){
							investorInfohtml = '我的家庭收入不低于60万元';
						}else if(result.data.investorInfo.netAssets == '3'){
							investorInfohtml = '我的个人年收入不低于30万元';
						}else if(result.data.investorInfo.netAssets == '4'){
							investorInfohtml = '我不符合上述任一条件';
						}
					}
					$('#netAssets').html(investorInfohtml);
				}else if(result.data.investorInfo.type == '1'){
					$('.checkPhoto').show();
					$('.realname').show();
					$('.orgcode').show();
					$('.netAssets').hide();
					type = '机构';
					if(result.data.investorInfo.realname != '' && result.data.investorInfo.realname != null){
						$('#realname').html('***' + result.data.investorInfo.realname.substring(2));
					}
					if(result.data.investorInfo.orgCode != '' && result.data.investorInfo.orgCode != null){
						$('#orgcode').html('***********' + result.data.investorInfo.orgCode.substring(7));
					}
				}
				$('#type').html(type);
				$('#hopeindustry').html(result.data.investorInfo.hopeindustry);
				$('#position').html(result.data.investorInfo.position);
				$('#industry').html(result.data.investorInfo.industry);
				if(result.data.investorInfo.idImgPath != '' && result.data.investorInfo.idImgPath != null){
					$('#idImgPath').attr('src',staticUrl+result.data.investorInfo.idImgPath);
					$('#idImgPath').show();
				}
				if(result.data.investorInfo.assetProofImgPath != '' && result.data.investorInfo.assetProofImgPath != null){
					$('#assetProofImgPath').attr('src',staticUrl+result.data.investorInfo.assetProofImgPath);
					$('#assetProofImgPath').show();
				}
				if(result.data.investorInfo.imgPath != '' && result.data.investorInfo.imgPath != null){
					$('#imgPath').attr('src',staticUrl+result.data.investorInfo.imgPath);
					$('#imgPath').show();
				}
//				if(result.data.investorInfo.imgPath2 != '' && result.data.investorInfo.imgPath2 != null){
//					$('#imgPath2').attr('src',staticUrl+result.data.investorInfo.imgPath2);
//				}
				if(result.data.investorInfo.status == '0'){
					$('#submitstatus').show();
				}else if(result.data.investorInfo.status == '1'){
					if(result.data.investorInfo.isInves == '1'){
						$('#successstr').html('恭喜您通过审核！成为合格投资人并具有领投人资格！');
						$('#successstr1').html('现在您可以');
					} else if (result.data.investorInfo.isInves == '2') {
						$('#successstr').html('恭喜您通过审核！成为合格投资人！');
						$('#successstr1').html('现在您可以');
					} else if (result.data.investorInfo.isInves == '0') {
						$('#successstr').html('恭喜您通过审核！成为合格投资人！');
						$('#successstr1').html('现在您可以');
					}
					$('#sucstatus').show();
				}else if(result.data.investorInfo.status == '2'){
					$('#failstatus').show();
					if(result.data.angelInvauditLogInfo.rejectReason != '' && result.data.angelInvauditLogInfo.rejectReason != null){
						$('#reject-reason').html(result.data.angelInvauditLogInfo.rejectReason);
					}
				}else if(result.data.investorInfo.status == '3'){
					$('#failstatus2').show();
				}
			}else if(result.code=='9999'){
                location.href = loginUrl;
			}else if(result.code=='4000'){
                location.href = loginUrl;
            }
		},
		error:function(e) {
		}
	});*/
	$.ajax({
		url: host + 'user/auth/getInvestor.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if (result.data.statusCode == '1001'){
					window.location.href = baseUrl + 'realname/auth.html';
				} else if (result.data.statusCode == '1002'){

					$('#real-name').html(result.data.realName);
					$('#mobile').html(result.data.mobile);
					var type = '';
					if(result.data.type == '0'){
						type = '个人';
						$('.checkPhoto').hide();
						$('.realname').hide();
						$('.orgcode').hide();
						$('.netAssets').show();
						var investorInfohtml = '';
						if(result.data.netAssets == '1'){
							investorInfohtml = '我的金融资产不低于100万元';
						}else if(result.data.netAssets == '2'){
							investorInfohtml = '我的家庭收入不低于60万元';
						}else if(result.data.netAssets == '3'){
							investorInfohtml = '我的个人年收入不低于30万元';
						}else if(result.data.netAssets == '4'){
							investorInfohtml = '我不符合上述任一条件';
						}
						$('#netAssets').html(investorInfohtml);
					}else if(result.data.type == '1'){
						$('.checkPhoto').show();
						$('.realname').show();
						$('.orgcode').show();
						$('.netAssets').hide();
						type = '机构';
						$('#realname').html(result.data.orgRealName);
						//机构代码
						$('#orgcode').html(result.data.orgCode);
					}
					$('#type').html(type);
					$('#hopeindustry').html(result.data.hopeindustry);
					$('#position').html(result.data.position);
					$('#industry').html(result.data.industry);
					if(result.data.idImgPath != '' && result.data.idImgPath != null){
						$('#idImgPath').attr('src',staticUrl + result.data.idImgPath);
						$('#idImgPath').show();
					}
					if(result.data.assetProofImgPath != '' && result.data.assetProofImgPath != null){
						$('#assetProofImgPath').attr('src',staticUrl+result.data.assetProofImgPath);
						$('#assetProofImgPath').show();
					}
					if(result.data.imgPath != '' && result.data.imgPath != null){
						$('#imgPath').attr('src',staticUrl+result.data.imgPath);
						$('#imgPath').show();
					}

					//				if(result.data.investorInfo.imgPath2 != '' && result.data.investorInfo.imgPath2 != null){
					//					$('#imgPath2').attr('src',staticUrl+result.data.investorInfo.imgPath2);
					//				}

					if(result.data.status == '0' || result.data.status == '4'){
						$('#submitstatus').show();
					}else if(result.data.status == '1'){
						if(result.data.isInves == '1'){
							$('#successstr').html('恭喜您通过审核！成为合格投资人并具有领投人资格！');
							$('#successstr1').html('现在您可以');
						} else if (result.data.isInves == '0') {
							$('#successstr').html('恭喜您通过审核！成为合格投资人！');
							$('#successstr1').html('现在您可以');
						}else if (result.data.isInves == '2') {
							$('#successstr').html('恭喜您通过审核！成为合格投资人！');
							$('#successstr1').html('现在您可以');
						}
						$('#sucstatus').show();
					}else if(result.data.status == '2'){
						$('#failstatus').show();
						if(result.data.rejectReason != '' && result.data.rejectReason != null){
							$('#reject-reason').html(result.data.rejectReason);
						}
					}else if(result.data.status == '3'){
						$('#failstatus2').show();
					}

				} else if (result.data.statusCode == '1003'){
					location.href = baseUrl + 'investor/identification.html';
				}

			}else if(result.code=='4000'){
				// location.href = loginUrl;
				handleLoginTimeout();
			}
		},
		error:function(e) {
		}
	});

	//重新认证合格投资人
	$('#toInvestor').click(function(){
		window.location.href = baseUrl + 'investor/identification.html';
	});
})
