$(function () {

	var Amount = {
		init: function () {
			this.amountList();
		},
		amountList: function () {
			var me = this;
			var tpl = __inline('amount-list.tmpl');
			$.ajax({
			    url: host + 'dream/amountList.htm?id=' + proId,
			    type: 'POST',
			    data: token_client_data,
			    dataType: 'JSON',
			    success: function (data) {
			        if (data.data) {
			            var html = tpl(data);
			            $('.pro-stage-title').append(html);
			        }
			    },
			    error: function(e) {

			    }
			}).done(function () {
				//我要投资
				var status = $('#proStatus').val();
				$('.pro-stage-item').each(function(el) {
					if (status == '7' || status == '5') {
						$(this).find('.invest-btn').html('已满标');
						$(this).find('.invest-btn').addClass('status7')
						$('#want-fund-btn').attr('href', '').css('cursor', 'default');
					}
					if ((status == '3' || status == '2')) {
						if (appCode != '0000'){
							// 改变投资档位按钮为可点击样式
							$(this).find('.invest-btn').addClass('status3');
						}
						if (appCode == '0020'){
							$(this).find('.invest-btn').html('已满标');
							$(this).find('.invest-btn').addClass('status7');
							$('#want-fund-btn').attr('href', '').css('cursor', 'default');
						}
					}
					//var code = checkUser(host + 'dream/checkUser.htm?proId=' + proId);
					if (user_code != '0000') {
						$(this).find('.stage-item-txt').hide();
						$(this).find('.stage-blur').show();
					}

					$(this).find('.invest-btn').click(function () {
						var amountId = $(this).attr('amountId');
						if (status == '4' || ((status == '2' || status == '3') && appCode == '0000' )) {
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
							var cus = checkUserStatus(amountId);
							if(!cus){
								return;
							}
						}
					});
				});
			});
		},
	};

	var Project = {

		init: function() {
		    if (user_code == '0000') {
		        this.proInfoAll();
		        this.proFinanceInfo();
		        $('#invest-lead-info').hide();
		        this.proLeadCastInfo();
		        $('#invest-financier-info').hide();
				var status = $('#proStatus').val();
				if (status != '2' && status != '3'){
					Pay.payList();
				}
		    } else {
		        this.proInfoPart();
		        $('#person-invest-info').hide();
		        if (user_code == '0002') {
					$('.project-inv-btn').attr('href',loginUrl);
					$('#invest-lead-info a').attr('href',loginUrl);
					$('#invest-financier-info a').attr('href',loginUrl);
					//投资列表
					$('.investor-btn').attr('href',loginUrl);
				} else if (user_code == '0006') {//实名认证
					$('.project-inv-btn').attr('href',baseUrl + 'realname/result.html');
					$('#invest-lead-info a').attr('href',baseUrl + 'realname/result.html');
					$('#invest-financier-info a').attr('href',baseUrl + 'realname/result.html');
					$('.investor-btn').attr('href',baseUrl + 'realname/result.html');
				} else if (user_code == '0011') {//合格投资人认证
					this.checkToInvest('.project-inv-btn', '/page/investor/identification.html');
					this.checkToInvest('#invest-lead-info a', '/page/investor/identification.html');
					this.checkToInvest('#invest-financier-info a', '/page/investor/identification.html');
					this.checkToInvest('.investor-btn', '/page/investor/identification.html');
					// $('.project-inv-btn').attr('href',baseUrl + 'investor/identification.html');
					// $('#invest-lead-info a').attr('href',baseUrl + 'investor/identification.html');
					// $('#invest-financier-info a').attr('href',baseUrl + 'investor/identification.html');
					// $('.investor-btn').attr('href',baseUrl + 'investor/identification.html');
				}
				$('.project-inv-desc').show();
				$('.investor').hide();
				$('.no-data').show();
				$('.investor-desc').show();
		    }

		    this.fixedMenu();
		},

		/**
	     * 2017-02-24 jihong.zhang@creditease.cn
	     * 判断用户是否可以进行投资人认证
	     *
	    */
	    checkToInvest: function(clickEl, linkUrl) {
	        var getUserInfoAjax = $.ajax({
	            type: 'POST',
	            url: host + 'user/getUserInfo.htm',
	            data: token_client_data,
	            dataType: 'JSON'
	        });

	        getUserInfoAjax.done(function (data) {
	            if (data.code === '0000') {
	                if (data.data.certificateFlag === 1) {
	                    $(clickEl).on('click', function () {
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
	                    $(clickEl).on('click', function () {
	                        window.location.href= linkUrl;
	                    })
	                }
	            }
	        })
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
	                     $('#pro-desc-header').append(data.data.proInfoPart);
	                    //$('.content-pro-fund').hide();
	                   //$('.content-pro-person').hide();
	                }
	            },
	            error: function(e) {

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
	                    $('#pro-desc-header').append(data.data.proInfoAll);
	                }
	            },
	            error: function(e) {
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
	                    $('.pro-fund-content').html(data.data.proFinanceInfo);
	                } else if (data.code == '4000') {
	                    //window.location.href = loginUrl;
						/*
						 * jingpinghong@creditease.cn
						 * 2017-02-16
						 * */
						handleLoginTimeout();
	                } else {
	                	$('.content-pro-fund').hide();
	                }
	            },
	            error: function(e) {
	            }
	        });
		},

		//领头人信息
		proLeadCastInfo: function () {
			$.ajax({
	            type: 'POST',
	            url: host + 'dream/proLeadCastInfo.htm?id=' + proId,
	            dataType: 'JSON',
	            data: token_client_data,
	            success: function(data) {
	                if (data.code == '0000') {
	                    $('.article-cmd-txt').html(data.data.proLeadWord);
	                    $('.content-article-txt').html(data.data.comments);
	                    $('.content-article-header').html(data.data.realName);
	                    var lead = data.data.leadPath;
	                    if (lead != null && lead != '') {
	                    	$('.person-content-header img').attr('src',data.data.leadPath);
	                    } else {
	                    	$('.person-content-header img').attr('src','../../static/detail/resource/images/avatar.jpg');
	                    }
	                } else if (data.code == '4000') {
	                    //window.location.href = loginUrl;
						/*
						 * jingpinghong@creditease.cn
						 * 2017-02-16
						 * */
						handleLoginTimeout();
	                } else {
	                	$('.content-pro-person').hide();
	                }
	            },
	            error: function(e) {
	            }
	        });
		},

		fixedMenu: function () {
			var toTopHeight = $('.project-menu').offset().top;

			$(window).on('scroll', function () {
				if ($(this).scrollTop() + 55 > toTopHeight) {
					$('.project-menu').addClass('fixed-menu');
				} else {
					$('.project-menu').removeClass('fixed-menu');
				}
			});
		}
	};

	/*
	* 2017-02-08
	* jingpinghong@creditease.cn
	* 详情页项目亮点的四个菜单栏在当前位置显示高亮
	* */
	var CurrentLink = {
		init: function () {
			this.CurrentStyle();
		},
		CurrentStyle: function () {
			//$('.pro').on('click',function () {
			//	$(this).addClass('current').siblings().removeClass('current');
			//});

			$('#nav').onePageNav({
				currentClass: 'current',
				changeHash: true,
				scrollSpeed: 500,
				scrollThreshold: 0.3,
				filter: '',
				easing: 'swing'
			});
		}
	};
	CurrentLink.init();
	Project.init();
	Amount.init();
});