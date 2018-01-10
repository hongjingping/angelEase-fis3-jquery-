(function () {

	var CollectDetails = {
		init: function () {
			this.tabSwitch();
			this.scrollButtonStatus();
			this.scollToTop();
			$(".tab-content").hide();
			$("#myTabContent1").show();
			this.showConsult();
			this.closeConsult();
			this.initNoLoginPage();// 显示登陆后页面
		},

		initLoginPage: function() {
            $("#financie-list").hide();
            $("#no-login-list").hide();
            $(".list-table").show();
		},

		initNoLoginPage: function() {
            $("#no-login-list").show();
            $("#financie-list").show();
            $(".list-table").hide();
        },

        showConsult: function () {
        	$('.btn-consult').on('click', function () {
	        	$('#qrcode-div').css('display','block');
	            $('.gray-mask').show();
        	})
        },
        closeConsult: function () {
        	$('.dialog-close').on('click', function () {
        		$('#qrcode-div').css('display','none');
        	})
        },

		tabSwitch: function() {
			$(".content-tab").click(function() {
				var refId = $(this).attr("id-ref");
                $(this).parent().addClass('tab-active').siblings('li').removeClass('tab-active');
				$(".tab-content").hide();
				$("#" + refId).show();
			});
		},

		scollToTop: function() {
			$(".scroll-button").click(function() {
				scrollTo(0,0);
			});

			$(document).scroll(function() {
			     CollectDetails.scrollButtonStatus();
			});
		},

		scrollButtonStatus: function() {
			var scollTop = document.body.scrollTop;
		     if (scollTop < 200) {
                $(".scroll-button").hide();
		     } else {
                $(".scroll-button").show();
		     }
		}
	};

	CollectDetails.init();
	//项目id
	var proId = getRequest().proId;

	//验证已经预购绑定
	var acode = checkAppointCode(proId);
	//用户身份验证
	var cc_user = checkUser();

	// 分享的时候，点击屏幕左上角的后退返回首页
	var isShared = getRequest().isShared;
	if (isShared == '1') {
		$('.cmn-header.white_bg').find('a').attr('href','../../page/home/home.html');
	}

	var ProjectDetail = {
		init: function () {
			this.projectInfo();
			this.teamList();
			this.questionList();
			var cc = checkUser();
			if (cc == '0000') {
	            CollectDetails.initLoginPage();
				this.proFinanceInfo();
				this.proInfoAll();
				this.payList();

			} else {
				checkStatus('#pay-list',cc_user);
				checkStatus('#financie-info',cc_user);
				this.proInfoPart();
			}
		},

		projectInfo: function () {
			$.ajax({
	            type: 'POST',
	            url: host + 'dream/detail.htm?id=' + proId,
	            data: token_client_data,
	            dataType: 'JSON',
	            success: function(result) {
                	var op = result.data;
                    $('.title-div h3').html(op.proName);
                    var s = $('#proStatus').val(op.proStatus);
                    $('#span-status').html(op.statusName);
                    $('.glyphicon-tags').append(op.proIndustry);
					var tags = op.lablesName.split(' ');
					var htmlTpl = '';
					$(tags).each(function(k,v){
						if(v !== '') htmlTpl += '<span class="detail-tag">'+v+'</span>'
					});
                    $('#lablesName').html(htmlTpl);

                    $('#proFinancieAmount').html(op.proFinancieAmount);
                    $('.title-2').html(op.proSlogan);
                    $('.video-div img').attr('src', op.proImgBigUrl);
                    var status = op.proStatus;
					if(status == '2' || status == '3'){
						$('.proNum').html( '0%');
						$('.progress').animate({ 'width': '0%' });
						$('#payAmount').html('--');
						$('#prePayNum').html('--');
						$('#remainDays').html('--');
						//隐藏投资列表
						$('.table-title').hide();
						$('.list-table').hide();
						if(status == '2'){//预热
							$('#span-status').addClass('span-title-preheat');
							if (acode == '0000') {//已绑定预购码
								$('#footer-collect').show();
							}else if (acode == '0020'){//募集超限
								$('#footer-success').show();
							} else{
								$('#footer-prheat').show();
								window.setInterval(function() { ShowCountDown(op.proFinanceDays, '#date-id'); }, '1000');
							}
						}

						if(status == '3') {//路演
							$('#buy-order').css('display','none');
							$('#luyan').css('display','block');

							//路演中的时候显示路演报名按钮
							$('#show-road').show();
							$('#span-status').addClass('span-title-roadshow');
							if (acode == '0000') {//已绑定预购码
								$('#footer-collect').show();
							}else if (acode == '0020'){//募集超限
								$('#footer-success').show();
							} else {
								var activeCode = onGoing(op.id);
								var acUrl = host + 'wx/activity/index.htm?activeCode=' + activeCode;
								if (activeCode != '' && activeCode != null) {
									$('#footer-roadshow').show();
									$('#show-road').attr('href', acUrl);
									window.setInterval(function () {
										ShowCountDown(op.proFinanceDays, '#date-id-road');
									}, '1000');
									//路演加接口
									$('#roadShow').click(function(e){
										e.preventDefault();
										$.ajax({
											type: 'POST',
											url: host + 'ac/active/checkAlreadyEnroll.htm',
											dataType: 'JSON',
											data: {
												clientType:'wap',
												token:getToken(),
												proId:proId
											},
											success: function(data) {
												if(data.code === '4000'){
													window.location.href = loginUrl;
												} else if(data.code === '0000') {
													location.href = acUrl;
												} else if(data.code === '9999') {
													new SmartToast({
														content: data.desc,
														duration: 3
													});
												}
											}
										});
									});
								} else {
									$('#footer-prheat').show();
									window.setInterval(function () {
										ShowCountDown(op.proFinanceDays, '#date-id');
									}, '1000');
								}
							}
						}
					}else if(status == '4'){//募集中
						/*
						* 募集中有路演活动的时候需要显示成路演中的样子
						* 2017-02-17
						* */
                        var activeCode = onGoing(op.id);
                        var acUrl = host + 'wx/activity/index.htm?activeCode=' + activeCode;
						if (activeCode != '' && activeCode != null) {
							/*
							* 报名人数超过配置的人数
							* 路演报名按钮
							* 2017-02-21
							* jingpinghong@create.cn
							* */
							$('#road-ly').attr('href', acUrl);
							$.ajax({
								url: host+'/ac/active/info.htm',
								type: "POST",
								data:{'token':getToken(),'clientType':'wap', activeCode: activeCode},
								dataType:"json",
								success:function(data){
									if (data.code == '0000'){
										if(data.data.count === data.data.active.acMaxNumber){
											$('#road-ly').css('width','0%');
										}
									}
								},
								error:function(){
									iscansend=true;
								}
							});

							$('#span-status').addClass('span-title-roadshow');
							$('#span-status').html('路演中');
							$('#footer-collect').show();
							$('#buy-order').hide();
							$('#luyan').show();
							$('#road-ly').css('width','50%');
							$('.proNum').html(op.proRaiseSpeed + '%');
							if (parseFloat(op.proRaiseSpeed) >= parseFloat('100%')) {
								$('.progress').animate({ 'width': '100%' });
							} else {
								$('.progress').animate({ 'width': op.proRaiseSpeed + '%' });
							}
							$('#payAmount').html(op.payAmount);
							$('#prePayNum').html(op.prePayNum);
							$('#remainDays').html(op.remainDays);
						} else {
							$('.proNum').html(op.proRaiseSpeed + '%');
							if (parseFloat(op.proRaiseSpeed) >= parseFloat('100%')) {
								$('.progress').animate({ 'width': '100%' });
							} else {
								$('.progress').animate({ 'width': op.proRaiseSpeed + '%' });
							}
							$('#payAmount').html(op.payAmount);
							$('#prePayNum').html(op.prePayNum);
							$('#remainDays').html(op.remainDays);
							$('#span-status').addClass('span-title-collect');
							$('#footer-collect').show();
						}


					}else if(status == '7' || status == '5'){//融资成功募集成功
						$('.proNum').html(op.proRaiseSpeed + '%');
						if (parseFloat(op.proRaiseSpeed) >= parseFloat('100%')) {
							$('.progress').animate({ 'width': '100%' });
						} else {
							$('.progress').animate({ 'width': op.proRaiseSpeed + '%' });
						}
						$('#payAmount').html(op.payAmount);
						$('#prePayNum').html(op.prePayNum);
						$('#remainDays').html(op.remainDays);
						$('#span-status').addClass('span-title-success');
						$('#footer-success').show();
					}
	            }
	        });
		},

		//项目缩略信息
		proInfoPart: function () {
			$.ajax({
	            type: 'POST',
	            url: host + 'dream/projectInfo.htm?id=' + proId,
	            dataType: 'JSON',
	            data: token_client_data,
	            success: function(data) {
	                if (data.code == '0000') {
	                    $('#project-info').html(data.data.proInfoPart);
	                }
	            }
	        });
		},

		//项目完整信息
		proInfoAll: function () {
			$.ajax({
	            type: 'POST',
	            url: host + 'dream/projectInfo.htm?id=' + proId,
	            dataType: 'JSON',
	            data: token_client_data,
	            success: function(data) {

	                if (data.code == '0000') {
	                    $('#project-info').html(data.data.proInfoAll);
	                }
	            }
	        });
		},

		//项目融资信息
		proFinanceInfo: function () {
			$.ajax({
	            type: 'POST',
	            url: host + 'dream/proFinanceInfo.htm?id=' + proId,
	            dataType: 'JSON',
	            data: token_client_data,
	            success: function(data) {
	                if (data.code == '0000') {
	                    $('#myTabContent3').html(data.data.proFinanceInfo);
	                }
	            }
	        });
		},

		//投资列表
		payList: function () {
			var tpl = __inline('pay-list.tmpl');
			$.ajax({
			    url: host + 'dream/payList.htm?id=' + proId ,
			    type: 'POST',
			    dataType: 'JSON',
			    success: function (data) {
			        if (data.data.length > 0) {
			            var html = tpl(data);
			            $('.list-table').html(html);
			        } else {
			        	$('.table-title').hide();
			        }
			    }
			});
		},

		//团队信息
		teamList: function () {
			var me = this;
			var tpl = __inline('team-list.tmpl');

			$.ajax({
			    url: host + 'dream/teamInfo.htm?id=' + proId,
			    // url: '/api/detail/team',
			    type: 'POST',
			    dataType: 'JSON',
			    data: token_client_data,
			    success: function (data) {
			        if (data) {
			            var html = tpl(data);
			            $('#myTabContent2').html(html);
			        }
			    }
			});
		},

		//faq信息
		questionList: function () {
			var me = this;
			var tpl = __inline('question-list.tmpl');
			$.ajax({
			    url: host + '/dream/faqInfo.htm?id=' + proId,
			    type: 'POST',
			    dataType: 'JSON',
			    data: token_client_data,
			    success: function (data) {
			        if (data) {
			            var html = tpl(data);
			            $('.faq-area').html(html);
			        }
			    }
			});
		}
	};

	ProjectDetail.init();

	//我要投资
    $("#buy-order,#buy-ordernew").click(function() {
		/**
		 * 实名认证未成功的跳转到实名页面
		 */
		$.ajax({
			type: 'POST',
			url: host + 'baseuser/getUserStatus.htm',
			data:token_client_data,
			dataType: 'JSON',
			success: function (data) {
				//如果已经实名认证，调到结果页
				if (data.code == '0000' && data.data.userCheckStatus == 3 && data.data.investorStatus == 0) {
					window.location.href = baseUrl + 'real_name_auth/real_name_suc.html';
				} else if (data.code == '4000') {
					window.location.href = baseUrl + 'login/login.html';
				}
			}
		});

		//只有募集中的项目才能投资
		var status = $('#proStatus').val();
		//验证港澳台
		var card = checkCardId(proId);
		if (card == '0015'){
			new SmartToast({
				content: '本项目仅限中国大陆用户投资,请您谅解',
				type: 'warn',
				duration: 3
			});
			return;
		}

		//募集中和已经预购 可以购买
		if (status == '4' || ((status == '2' || status == '3') && acode == '0000' )) {
			if (!checkStatus('', cc_user,true)) {
				return ;
			}
		}
    });

	/**************************预购码开始******************************/
	//弹窗
	$('.precodes').click(function() {
		if (cc_user == '0002'){
			location.href = loginUrl;
		}else{
			$('#precode-input').val('');
			$('#precode-dialog').show();
		}
	});

	//绑定code
	$('#commit-code').click(function() {
		var bcode = $('#precode-input').val();
		if (bcode == ''){
			$('#precode-dialog').hide();
			$('#alert-dialog').show();
			$('#content-txt').html('预购码错误，请您验证后再试一次');
		}else {
			var bc = bindCode(bcode);
			if (bc != ''){
				if (bc.code == '0000'){
					$('#precode-dialog').hide();
					new SmartToast({
						content: '验证成功',
						type: 'success',
						duration: 3
					});
					window.setTimeout(location.reload(),8000);
				} else if(bc.code == '0020') {
					$('#precode-dialog').hide();
					$('#alert-dialog').show();
					$('#content-txt').html(bc.desc);
				} else if(bc.code == '0019') {
					$('#precode-dialog').hide();
					$('#alert-dialog').show();
					$('#content-txt').html(bc.desc);
				} else {
					$('#precode-dialog').hide();
					$('#alert-dialog').show();
					$('#content-txt').html(bc.desc);
				}
			}else{
				$('#precode-dialog').hide();
				$('#alert-dialog').show();
				$('#content-txt').html('预购码错误，请您验证后再试一次');
			}
		}
	});

	//重新输入
	$('#reset-code').click(function() {
		$('#alert-dialog').hide();
		$('#precode-input').val('');
		$('#precode-dialog').show();
	});

	// 关闭弹窗
	$('.code-close').on('click', function () {
		$('.mask').hide();
		$('.ae-dialog').hide();
	});

	//绑定预购码
	function bindCode(bcode) {
		var results = '';
		$.ajax({
			type: 'POST',
			cache: false,
			async: false,
			data: token_client_data,
			url: host + 'active/bindCode.htm?proId=' + proId + '&code=' + bcode,
			dataType: 'JSON',
			success: function(data) {
				results = data;
			}
		});
		return results;
	}

	//预购码验证
	function checkAppointCode(proId) {
		var code;
		$.ajax({
			type: 'POST',
			cache: false,
			async: false,
			data: token_client_data,
			url: host + 'active/checkBind.htm?proId=' + proId,
			dataType: 'JSON',
			success: function(data) {
				code = data.code;
			}
		});
		return code;
	}

	/**************************预购码结束******************************/

	function checkStatus(divId,cc,flag){
		if (flag) {
			if (cc == '0002') {
				location.href = loginUrl;
			} else if (cc == '0006') {
				location.href = baseUrl + 'real_name_auth/real_name_auth.html';
			} else if (cc == '0011') {
				location.href = baseUrl + 'investor_cert_part1/investor-cert-form.html';
			}else if (cc == '0000') {
				location.href = baseUrl + 'invest_set_order/set-order.html?proId=' + proId + '&noticeType=order';
			} else {
				$('.modify-suc-text').html('校验用户身份失败，请联系客服人员。');
				$("#toastBox").show();
				return false;
			}
		} else {
			if (cc == '0002') {
				$(divId).attr('href',loginUrl);
			} else if (cc == '0006') {
				$(divId).attr('href',baseUrl + 'real_name_auth/real_name_auth.html');
			} else if (cc == '0011') {
				$(divId).attr('href',baseUrl + 'investor_cert_part1/investor-cert-form.html');
			} else {
				$('.modify-suc-text').html('校验用户身份失败，请联系客服人员。');
				$("#toastBox").show();
				return false;
			}
		}
	}

	//用户状态校验
	function checkUser() {
		var url = host + 'dream/checkUser.htm';
		var code;
		$.ajax({
			type: 'POST',
			cache: false,
			async: false,
			data: token_client_data,
			url: url,
			dataType: 'JSON',
			success: function(data) {
				code = data.code;
			}
		});
		return code;
	}

	//港澳台校验
	function checkCardId(proId) {
		var url = host + 'dream/checkCardId.htm?proId=' + proId;
		var code;
		$.ajax({
			type: 'POST',
			cache: false,
			async: false,
			data: token_client_data,
			url: url,
			dataType: 'JSON',
			success: function(data) {
				code = data.code;
			}
		});
		return code;
	}

	//路演
	function onGoing(proId) {
	    var code = '';
	    $.ajax({
	        type: 'POST',
	        async: false,
	        data: {'token':getToken(),'clientType':'wap'},
	        url: host + 'ac/active/code.htm?projectId=' + proId ,
	        dataType: 'JSON',
	        success: function(data) {
	            if(data.data != null && data.data != ''){
	                code = data.data.code;
	            }
	        }
	    });
	    return code;
	}

	//倒计时
	function ShowCountDown(date, divname) {
	    var now = new Date();
	    var endDate = new Date(date);
	    var leftTime = endDate.getTime() - now.getTime();
	    var time = 24*3600;
	    var leftsecond = parseInt(leftTime / 1000);
	    //var day1=parseInt(leftsecond/(24*60*60*6));
	    var day1 = Math.floor(leftsecond / (60 * 60 * 24));
	    var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
	    var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
	    var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	    if (leftsecond > time){
			$(divname).html((day1 + 1) + "天后开始");
	    } else {
	    	$(divname).html(hour+"小时"+minute+"分"+second+"秒");
	    }
	}

	$("#toastBox").click(function() {
	    $('#toastBox').hide();
	});
})();
