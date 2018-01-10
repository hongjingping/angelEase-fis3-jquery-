$(function () {
	var hideflag = false;
	var Ongoing = {

		init: function () {
			this.buildList(2);
			this.buildList(3);

		},

		buildList: function (status) {
			var me = this;
			var tpl = __inline('ongoing-list.tmpl');
			$.ajax({
			    url: host + 'dream/indexPc.htm?status=' + status,
			    type: 'POST',
			    contentType: 'text/plain',
			    dataType: 'JSON',
			    success: function (data) {
			        if (data.data && data.data.length > 0 ) {
			            var html = tpl(data);
			            $('.going-list').last().append(html);
			        } else {
						if(hideflag){
							$('.ongoing').hide();
						}
						hideflag = true;
					}
			    },
			    error: function(e) {
			        // console.log(e);
			    }
			}).done(function () {
				me.initOngoingSlider();
				me.sliderAnimation();
				//路演限制
				$('.enroll').each(function(index, el) {
					var proId = $(this).attr('pro-id');
					var code = me.checkCode(proId);

					if (code != null) {
						$(this).attr('href',baseUrl + 'roadshow/roadshow.html?projectId=' + proId);
					}else{
						$(this).css({'background': '#383838','color': '#9B9B9B','border': '0'});
					}
				});

			});
		},

		checkCode: function (proId) {
			var code = null ;
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

		initOngoingSlider: function () {
			$('.ongoing-slider .going-box').slide({ 
				mainCell: 'ul',
				vis: 3,
				prevCell: '.pre-arrow',
				nextCell: '.next-arrow',
				effect: 'leftLoop'
			});	
		},

		sliderAnimation: function () {
			$('.going-list li').each(function (index, item) {
				$(this).find('.going-block').css('height', '190px');

				$(this).hover(
					function () {
						$(this).find('.going-block').stop().animate({height: '328px'});
						$(this).find('.going-phase').stop().fadeIn();
						$(this).find('.going-btn').stop().fadeIn();
					}, 
					function () {
						$(this).find('.going-block').stop().animate({height: '190px'});
						$(this).find('.going-phase').stop().fadeOut()
						$(this).find('.going-btn').stop().fadeOut();
					}
				);
			});
		}
	};

	Ongoing.init();
});