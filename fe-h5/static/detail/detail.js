$(function () {
	var request = getRequest();
	var productId = getRequest().proId;

	//back history
	$('.detail-back').click(function(){
		if (history.length > 2 || document.referrer.length > 0) {
			window.history.go(-1);
		}else{
			location.href = '/page/home/home.html';
		}
	});

	// 当弹窗输入内容获取焦点禁止页面滚动
	$('.precode').focus(function () {
		document.body.addEventListener('touchmove', function (event) {
		    event.preventDefault();
		}, false);
	});


	// 关闭弹窗
	$('.code-close').on('click', function () {
		$('.mask').hide();
		$('.ae-dialog').hide();
	});

	//set share qrcode
	$('.share-popup img').attr('src','http://qr.liantu.com/api.php?&w=300&text=' + window.location.href);

	// share action
	$('.share-icon').click(function(){
		if (!isWeiXin()) {
			//browser
			var img=new Image();
			img.src='http://qr.liantu.com/api.php?&w=300&text=' + window.location.href;
			img.onload = function () {
				var apopup = $('.share-popup').apopup({
					maskColor:'#000',
					opacity:'.3'
				},function(){
				});
			};
		} else {
			//weixin
			var apopup = $('.share-img').apopup({
				maskColor:'#000',
				opacity:'.3',
				position:[$(window).width() - 200,0]
				},function(){
			});
		}
	});

	$('.star-icon').click(function () {
		if (!$('.star-icon').attr('data-star')) {
			// focus
			$.ajax({
				type: 'POST',
				url: host + 'praiseAttention/addPraiseAttention.htm?type=1&proId=' + productId,
				data: token_client_data,
				dataType: 'JSON',
				success: function(result) {
					if (result.code === '0000') {
						$('.i-star').css('opacity', '0');
						$('.i-unstar').css({'opacity': '1'});
						$('.star-icon').attr('data-star', 'true')
					} else if (result.code === '4000') {
						window.location.href = loginUrl;
					}
				}
			});
		} else {
			// cancel
			$.ajax({
				type: 'POST',
				url: host + 'praiseAttention/cancelAttention.htm?type=1&proId=' + productId,
				data: token_client_data,
				dataType: 'JSON',
				success: function(result) {
					if (result.code === '0000') {
						$('.i-star').css('opacity', '1');
						$('.i-unstar').css('opacity', '0');
						$('.star-icon').removeAttr('data-star')
					} else if (result.code === '4000') {
						window.location.href = loginUrl;
					}
				}
			});
		}
	});

	// init zan and praise status
	function initZanAndPraise() {
		$.ajax({
			type: 'POST',
			url: host + 'praiseAttention/getPraiseCountHighlightFlag.htm?proId=' + productId,
			data: token_client_data,
			dataType: 'JSON',
			success: function(result) {
				if (result.data.praiseFlag === 0) {
					// zan
					$('.i-zan').css('opacity', '0');
					$('.i-unzan').css('opacity', '1');
				}

				// focus status
				if (result.data.attentionFlag === 0) {
					// focus
					$('.i-star').css('opacity', '0');
					$('.i-unstar').css('opacity', '1');
					$('.star-icon').attr('data-star', 'true');
				}

				// zan status
				var zanCount = result.data.praiseCount;

				if (zanCount > 99) {
					$('#zanCount').text('99+');
				} else {
					$('#zanCount').text(zanCount);
				}
			}
		});
	}

	initZanAndPraise();

	// zan
	$('.zan-icon i').click('click', function () {
		$.ajax({
			type: 'POST',
			url: host + 'praiseAttention/addPraiseAttention.htm?type=0&proId=' + productId,
			data: token_client_data,
			dataType: 'JSON',
		}).done(function (data) {
			// console.log(data);
			if (data.code === '0000') {
				$('.i-zan').css('opacity', '0');
				$('.i-unzan').css('opacity', '1');

				var increseCount = parseInt($('#zanCount').text());

				if (increseCount > 99) {
					$('#zanCount').text('99+');
				} else {
					$('#zanCount').text(increseCount + 1);
				}
			} else if (data.code === '9999') {
				new SmartToast({
                    content: data.desc,
                    type: 'warn'
                });
			}
		});
	});
});
