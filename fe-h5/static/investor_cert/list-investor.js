(function () {
	var Title = {
		init: function () {
			this.setTitleHeader();
		},

		setTitleHeader: function () {
			$('.cmn-header-title').text('投资人认证');
			$('.white_bg a').attr('href','/page/personal_center/personal-center.html')
		}
	};

	Title.init();

	checkUserLogin();
	var selHtml = '';

	$.ajax({
		url: host + 'user/auth/getInvestor.htm',
		dataType: 'JSON',
		type: 'POST',
		data:token_client_data,
		success: function (result) {
			if(result.code == '0000'){
				if (result.data.statusCode == '1001'){
					window.location.href = baseUrl + 'real_name_auth/real_name_auth.html';
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
						if(result.data.netAssets != '' &&　result.data.netAssets != null){
							if(result.data.netAssets == '1'){
								investorInfohtml = '我的金融资产不低于100万元';
							}else if(result.data.netAssets == '2'){
								investorInfohtml = '我的家庭收入不低于60万元';
							}else if(result.data.netAssets == '3'){
								investorInfohtml = '我的个人年收入不低于30万元';
							}else if(result.data.netAssets == '4'){
								investorInfohtml = '我不符合上述任一条件';
							}
						}
						$('#netAssets').html(investorInfohtml);
					}else if(result.data.type == '1'){
						$('.checkPhoto').show();
						$('.realname').show();
						$('.orgcode').show();
						$('.netAssets').hide();
						type = '机构';
						$('#realname').html(result.data.orgRealName);
						$('#orgcode').html(result.data.orgCode);
					}
					$('#type').html(type);
					$('#hopeindustry').html(result.data.hopeindustry);
					$('#position').html(result.data.position);
					$('#industry').html(result.data.industry);
					if(result.data.idImgPath != '' && result.data.idImgPath != null){
						$('#idImgPath').attr('src',staticUrl+result.data.idImgPath);
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
			
					if(result.data.status == '0' || result.data.status == '4'){
						$('#submitstatus').show();
					}else if(result.data.status == '1'){
						if(result.data.isInves == '1'){
							$('#sucstatus1').show();
						} else if (result.data.isInves == '0') {
							$('#sucstatus2').show();
						}else if (result.data.isInves == '2') {
							$('#sucstatus2').show();
						}
					}else if(result.data.status == '2'){
						$('#failstatus').show();
						$('#reject-reason').html(result.data.rejectReason);
					}else if(result.data.status == '3'){
						$('#sucstatus').show();
					}
				} else if (result.data.statusCode == '1003'){
					window.location.href = baseUrl + 'investor_cert_part1/investor-cert-form.html';
				}
			}else if(result.code=='4000'){
				location.href = loginUrl;
			}
		},
		error:function(e) {
		}
	});
	
	//重新认证合格投资人
	$('#toInvestor').click(function(){
		window.location.href = baseUrl + 'investor_cert_part1/investor-cert-form.html';
	});
})();
