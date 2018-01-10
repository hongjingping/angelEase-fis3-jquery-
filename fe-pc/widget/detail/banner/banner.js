(function () {
	var Banner = {
		init: function () {
			this.showFollowAndThumbs();
			this.projectInfo();
			this.initQrcode();
			this.triggerWantFund();
		},
		initQrcode: function () {
			this.showQrcode();
			this.qrcodeHeight = $('.detail-header').outerHeight();
		},
		triggerWantFund: function () {
			$('.detail-header #want-fund-btn').on('click', this.triggerTabItem);
		},
		triggerTabItem: function (e) {
			$('.tab-item[data-item=project]').click();
		},
		showFollowAndThumbs: function () {
			var getPraiseAttentionAjax = $.ajax({
				type: 'POST',
	            url: host + 'praiseAttention/getPraiseCountHighlightFlag.htm?proId=' + proId,
	            data: token_client_data,
	            dataType: 'JSON',
			})

			var self = this;
			getPraiseAttentionAjax.done(function (data) {
				if (data.code == '0000') {
					var tpl = __inline('banner.tmpl');
					$('.follow-thumbs-up-wrapper').html(tpl(data));
					self.bindFollowBtnEvent();
					self.bindThumbsBtnEvent();
				}
			})
		},
		bindFollowBtnEvent: function () {
			var self = this;
			var $followBtn = $('.follow-thumbs-up-wrapper .follow.ae-icon');
			$followBtn.on('click', function (e) {
				var $targetEl = $(e.target);
				var isfollowed = $targetEl.parent('.follow-thumbs-up').hasClass('active');
				console.log(isfollowed)
				self.handleFollowFn(isfollowed)
				.done(function (data) {
					if (data.code == '0000') {
						var isfollowed = $targetEl.parent('.follow-thumbs-up').hasClass('active');
						if (isfollowed) {
							$targetEl.parent('.follow-thumbs-up').removeClass('active');
						} else {
							$targetEl.parent('.follow-thumbs-up').addClass('active');
						}
					}
					if (data.code == '4000') {
						window.location.href='/page/login/login.html';
						/*
						 * jingpinghong@creditease.cn
						 * 2017-02-16
						 * */
						// handleLoginTimeout();
					}
				});
			});
		},
		bindThumbsBtnEvent: function () {
			var self = this;
			var $thumbsBtn = $('.follow-thumbs-up-wrapper .ae-icon-un-thumbsup');
			$thumbsBtn.on('click', function (e) {
				var $targetEl = $(e.target);
				console.log('$targetEl')
				console.log($targetEl)
				self.handleThumbsFn()
				.done(function (data) {
					if (data.code == '0000') {
						var parent = $targetEl.parent('.follow-thumbs-up');
						parent.addClass('active');
						var countNumEl = parent.siblings('.thumbsup-num').find('#thumb-num');
						var countNum = parseInt(countNumEl.text());
						if (countNum < 99) {
							countNumEl.text(++countNum);
						} else if (countNum == 99) {
							countNumEl.text('99+');
						}
					}
				});
			});
		},
		handleFollowFn: function (bool) {
			var targetPath = bool ? 'cancel' : 'addPraise';
			var deferred = $.ajax({
				method: 'POST',
				url: host + 'praiseAttention/' + targetPath + 'Attention.htm?proId=' + proId + '&type=1',
				data: token_client_data,
				dataType: 'json'
			});
			return deferred;
		},
		handleThumbsFn: function () {
			var deferred = $.ajax({
				method: 'POST',
				url: host + 'praiseAttention/addPraiseAttention.htm?proId=' + proId + '&type=0',
				data: token_client_data,
				dataType: 'json'
			});
			return deferred;
		},
		showQrcode: function () {
			// var me = this;
			// $('.show-qrcode').css('top', $('.project').outerHeight() + 'px');

			// $(window).on('resize scroll', function () {
			// 	if (!($(window).scrollTop() > $(window).outerHeight())) {
			// 		$('.show-qrcode').css('top', me.qrcodeHeight + $(window).scrollTop() + 'px');
			// 	}
			// });
		},

		checkCode: function () {
			var code = '' ;
			$.ajax({
			    url: host + 'ac/active/code.htm?projectId=' + proId ,
			    type: 'POST',
			    data: token_client_data,
			    async: false,
			    dataType: 'JSON',
			    success: function (data) {
			        if (data.data != null && data.data != ''){
			        	code = data.data.code;
			        }
			    },
			    error: function(e) {
			        // console.log(e);
			    }
			});

			return code;
		},

		//项目信息
		projectInfo: function () {
			var self = this;
			$.ajax({
	            type: 'POST',
	            //cache: false,
	            async: false,
	            url: host + 'dream/detail.htm?id=' + proId,
	            data: token_client_data,
	            dataType: 'JSON',
	            success: function(data) {
	                if (data.code == '0000') {
	                	var op = data.data;
	                    $('.cmn-btn-roadshow').attr('href',baseUrl + 'roadshow/roadshow.html?projectId=' + op.id);

						//路演加接口--2017-01-11 jingpinghong@creditease.cn
						$('.cmn-btn-roadshow').click(function(e){
							e.preventDefault();
							$.ajax({
								type: 'POST',
								url:  host+ 'ac/active/checkAlreadyEnroll.htm',
								//url: 'https://uat-angelease.yixin.com/rest/ac/active/checkAlreadyEnroll.htm',
								dataType: 'JSON',
								data: {
									clientType: 'pc',
									token: getToken(),
									proId: proId
								},
								success: function (data) {
									if(data.code === '4000') {
										//window.location.href = loginUrl;
										/*
										 * jingpinghong@creditease.cn
										 * 2017-02-16
										 * */
										handleLoginTimeout();
									}else if (data.code === '0000') {
										location.href = baseUrl + 'roadshow/roadshow.html?projectId=' + op.id;
									} else if (data.code === '9999') {
										var readSmartAlert = new SmartAlert({
											title: '提示',
											content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">'+data.desc+'</span>',
											type: 'confirm',
											okText: '我知道了',
											maskClosable: false,
										});
										readSmartAlert.open();
									}
								}
							})
						});



						$('.txt-title').html(op.proName);
	                    $('#proStatus').val(op.proStatus);
	                    $('.ae-icon-tag').append(op.lablesName);

	                    $('.left-border p').html(op.proFinancieAmount);

	                    if (op.proFinancier != ''){
	                    	$('.title-company').html('融资人:' + op.proFinancier);
	                    }
	                    $('.desc-company').html(op.proIntroduce);
	                    $('.roadshow img').attr('src', op.proImgBigUrl);
	                    var status = op.proStatus;
						//获取活动code
	                    var code = Banner.checkCode()
						if (status == '2' || status == '3') {
							$('.ratio').html('0%');
							$('.coverline').animate({ 'width': '0%' });
							$('#payAmount').addClass('font-gray').html('--');
							$('#prePayNum').addClass('font-gray').html('--');
							$('#remainDays').addClass('font-gray').html('--');
						}else {
							$('.ratio').html(op.proRaiseSpeed + '%');
							if (parseFloat(op.proRaiseSpeed) >= parseFloat('100')) {
								$('.coverline').animate({ 'width': '100%' });
							} else if (op.proRaiseSpeed == '0'){
								$('.ratio').addClass('gray');
								$('.coverline').animate({ 'width': op.proRaiseSpeed + '%'});
							} else {
								$('.coverline').animate({ 'width': op.proRaiseSpeed + '%'});
							}
							if (op.payAmount == 0 ) {
								$('#payAmount').addClass('font-gray').html(op.payAmount);
							}else{
								$('#payAmount').html(op.payAmount);
							}
							if(op.prePayNum == 0){
								$('#prePayNum').addClass('font-gray').html(op.prePayNum);
							}else{
								$('#prePayNum').html(op.prePayNum);
							}
							$('#remainDays').html(op.remainDays);
						}
	                    if (status == '2' || status == '3') {
							//隐藏投资列表
							$('.no-data').show();
							if(status == '2') {
								$('#statusImg').addClass('preheat');
								window.setInterval(function() {
									ShowCountDown(data.data.proFinanceDays, '.cmn-btn-second');
								}, '1000');
							}
							if(status == '3') {
								//展示二维码
								if (code != '' && code != null){
									Banner.createQrcode(code);
									$('.cmn-btn-roadshow').show();
									// 2016-11-30 jihongzhang@creditease.cn 2.0 版本加了新的咨询和分享按钮之后，路演中项目不需要路演二维码了
									// $('.show-qrcode').show();
								}
								window.setInterval(function() {
									ShowCountDown(data.data.proFinanceDays, '.cmn-btn-second');
								}, '1000');
							}

			    			var _preventDefault = function(e) {
			    				e.preventDefault();
			    			};
							if (appCode == '0000'){
								$('#btn-pre-code').css('display','none');
								$('.detail-header').find('#want-fund-btn').text('我要投资');
								$('#statusImg').addClass('roadon');
								////显示预购码按钮
								//$('#btn-pre-code').css('display','block');
								//$('#want-fund-btn').css({'cursor':'default'}).on('click', _preventDefault);
								////下面一行为路演中项目特有的深灰色按钮
								//$('#want-fund-btn').addClass('cmn-btn-second');
							}else if(appCode == '0020'){
								$('#want-fund-btn').removeClass('cmn-btn-second');
								$('#want-fund-btn').html('已满标').css({
									'background': '#3F3F3F',
									'color': '#9B9B9B'
								})
								// unbind click event for tab item
								.off('click', self.triggerTabItem)
								// prevent default event to avoid page refresh
								.on('click', function(e) {
									e.preventDefault();
								});
							}else {
								$('#statusImg').addClass('roadon');
								//显示预购码按钮
								$('#btn-pre-code').css('display','block');
								$('#want-fund-btn').css({'cursor':'default'}).on('click', _preventDefault);
								//下面一行为路演中项目特有的深灰色按钮
								$('#want-fund-btn').addClass('cmn-btn-second');
								window.setInterval(function() {
									ShowCountDown(data.data.proFinanceDays, '.cmn-btn-second');
								}, '1000');
							}
			    			/* ------- 点击'预购码通道'逻辑 2016-10-17-------- */
			    			$('#btn-pre-code').on('click', function () {
								if (user_code == '0002'){
									location.href = loginUrl;
								} else {
									var preCodeAlert = new SmartAlert({
                                        title: '预购码通道',
                                        content: '<div class="error-reminder" style="visibility:hidden;"><span class="icon-wrapper error-notice"><i class="ae-icon ae-icon-attention error-icon"></i><span id="error1" class="error-txt">券码错误，请您验证后再试一次。</span></span></div><div class="input-wrapper"><input type="text" id="pre-code-val" maxlength="6" class="input-pre-code cmn-input" placeholder="请输入您的预购码"/></div><div class="special-footer"><div class="cmn-btn-gold-w12 check-useful">确认</div></div>',
                                        type: 'confirm',
                                        okText: '确认',
                                        maskClosable: false,
                                        footer: null,
                                        forceDestroy: true,
                                    });
									preCodeAlert.open();
									function showErrorMsg(msg) {
                                        preCodeAlertEl.find('.error-reminder').css('visibility', 'visible');
                                        $('#error1').text(msg);
                                    }
                                    var preCodeAlertEl = preCodeAlert.getEl();
									preCodeAlertEl.find('.smartAlert-body').css('padding', '30px 40px 20px 40px');
									preCodeAlertEl.find('.check-useful').on('click', function () {
										// 获取input内容
										var preCodeVal = preCodeAlertEl.find('#pre-code-val').val();
										if (preCodeVal == ''){
											showErrorMsg('请输入预购码');
											$("input").focus(function(){
													$('input').val('');
	                                                $(".error-reminder").css("visibility","hidden");
                                            });
											// $('.smartAlert').find('.error-reminder').css('visibility', 'visible');
										}else{
											//判断预购码是否可用
											var results = Banner.bindCode(preCodeVal);
											//如果不可用，报错
											if (results.code == '0000') {
												//如果正确，弹框的内容替换成成功的内容
												$('.smartAlert').find('.smartalert-content-wrapper').replaceWith('<div><div class="success-reminder"><span class="icon-wrapper success-notice"><i class="ae-icon ae-icon-success success-icon"></i><span class="success-txt">验证成功，您现在可以预购了。</span></div><div class="btn-close-wrapper"><div class="cmn-btn-gold-w12 btn-close">知道了</div>')
												//点击’知道了‘按钮之后，改变原来的倒计时按钮为’我要投资‘，并且状态为可点击且能链接到投资档位进行投资
												$('.smartAlert').find('.btn-close').on('click', function () {
													$('.smartAlert').css('display', 'none');
													$('.result-btns').find('#btn-pre-code').css('display', 'none');
													$('.detail-header').find('#want-fund-btn').removeClass('cmn-btn-second')
														.text('我要投资').off('click', _preventDefault);
													showPreCode(_preventDefault);
													preCodeAlert.close();
													window.location.reload()
												})
											} else if(results.code == '0020') {
												showErrorMsg(results.desc);
												$("input").focus(function(){
													$("input").val('');
	                                                $(".error-reminder").css("visibility","hidden");
	                                            });
											} else if(results.code == '0019') {
												showErrorMsg(results.desc);
												$("input").focus(function(){
													$("input").val('');
	                                                $(".error-reminder").css("visibility","hidden");
	                                            });
											} else {
												showErrorMsg(results.desc);
												$("input").focus(function(){
													$("input").val('');
	                                                $(".error-reminder").css("visibility","hidden");
	                                            });
											}
										}
									})
								}
			    			});
			    		}else if(status == '4'){
							$('#statusImg').addClass("raise");
							/*
							 * 添加募集路演中状态
							 * 2017-02-14
							 * jingpinghong@creditease.cn
							 * */
							if (code != '' && code != null) {
								$('#statusImg').addClass("roadon");
								/*
								 * 报名人数超过配置的人数
								 * 路演报名按钮
								 * 2017-02-21
								 * jingpinghong@create.cn
								 * */
								$.ajax({
									url: host+'/ac/active/info.htm',
									type: "POST",
									data:{'token':getToken(),'clientType':'pc', activeCode: code},
									dataType:"json",
									success:function(data){
										if (data.code == '0000'){
											if(data.data.count === data.data.active.acMaxNumber){
												//路演活动中的按钮
												$('.cmn-btn-roadshow').hide();
											}else {
												$('.cmn-btn-roadshow').show();
											}
										}
									},
									error:function(){
										iscansend=true;
									}
								});

								//路演活动中的按钮
								$('.cmn-btn-roadshow').show();
							}

			    			$('#want-fund-btn').html('我要投资');

			    		}else if(status == '7' || status == '5'){
			    			if(status == '5') {
								//募集成功
								$('#statusImg').addClass('success');
							} else {
								// 融资成功
				    			$('#statusImg').addClass('fund-success');
							}

			    			$('#want-fund-btn').html('已满标').css({
			    				'background': '#3F3F3F',
			    				'color': '#9B9B9B'
			    			})
			    			// unbind click event for tab item
			    			.off('click', self.triggerTabItem)
			    			// prevent default event to avoid page refresh
			    			.on('click', function(e) {
			    				e.preventDefault();
			    			});
			    		}
			    		//收益权隐藏领头人信息
			    		if (op.proFinanceType === '2') {
			    			$('.content-pro-person').hide();
			    			$('.pro-person').hide();
			    		}
	                }
	            },
	            error: function(e) {
	            }
	        });
		},

		//绑定预购码
		bindCode: function (bcode) {
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
				},
				error: function(e) {
				}
			});
			return results;
		},

		//创建二维码
		createQrcode: function (code) {
        	if(code != ''){
                var url = host + 'wx/activity/index.htm?activeCode=' + code;
                var qrcode = new QRCode('qrcode', {
                  text: url,
                  width: 120,
                  height: 120,
                  colorDark : '#000000',
                  colorLight : '#ffffff',
                  correctLevel : QRCode.CorrectLevel.H
                });
        	}
		}
	};

	Banner.init();

	//显示预购码通道
	function showPreCode(_preventDefault){
		 //Activate Invest Btns
		$('#content-pro-stage').find('.invest-btn').each(function(i, element) {
			$(element).removeClass('status3').removeClass('status7')
				.on('click', function() {
					var card = checkCardId();
					if (card == '0015'){
						var readSmartAlert = new SmartAlert({
							title: '提示',
							content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">本项目仅限中国大陆用户投资,请您谅解</span>',
							type: 'confirm',
							okText: '我知道了',
							maskClosable: false,
						});
						readSmartAlert.open();
						return ;
					}
					var amountId = $(this).attr('amountId');
					var cus = checkUserStatus(amountId);
					if(!cus){
						return;
					}
				})
		});
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
	    	$(divname).html(hour+"小时"+minute+"分"+second+"秒后开始");
	    }
	}
})();

function checkUserStatus(amountId){
	if (user_code == '0002') {
		window.location.href = loginUrl;
	} else if (user_code == '0006') {//实名认证
		window.open(baseUrl + 'realname/result.html','_blank') ;
	} else if (user_code == '0011') {//合格投资人认证
		window.open(baseUrl + 'investor/identification.html','_blank') ;
	} else if (user_code == '0000') {//下单页
		window.open(baseUrl + 'project/project?proId=' + proId + '&proinveseId=' + amountId,'_blank') ;
	} else {
		var readSmartAlert = new SmartAlert({
			title: '错误',
			content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">校验用户身份失败，请联系客服人员。</span>',
			type: 'confirm',
			okText: '我知道了',
			maskClosable: false,
		});
		readSmartAlert.open();
		return false;
	}
}
