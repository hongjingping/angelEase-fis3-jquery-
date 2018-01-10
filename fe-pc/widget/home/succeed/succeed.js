$(function () {

	var Succeed = {
		init: function () {
			this.buildList();
		},

		buildList: function () {
			var me = this;
			var tpl = __inline('succeed-list.tmpl');

			$.ajax({
			    url: host + 'dream/indexPc.htm?status=7',
			    type: 'get',
			    dataType: 'JSON',
			    success: function (data) {
			        if (data.data && data.data.length > 0) {
			            var html = tpl(data);
			            $('.slide-box-container').html(html);
			        } else {
			        	$('.suc-container').hide();
			        }
			    },
			    error: function(e) {
			        //console.log(e);
			    }
			}).done(function () {
				me.slideInit();
				me.showMask();
			});
		},

		slideInit: function () {
			$('.slide-group .slide-box').slide({ 
				mainCell: 'ul',
				vis: 3,
				prevCell: '.s-prev',
				nextCell: '.s-next',
				effect: 'leftLoop'
			});		
		},

		showMask: function () {
			$('.slide-box-container .pic').each(function (index, item) {
				$(this).hover(function () {
					$(this).find('.content-mask').stop().fadeIn();
				}, function () {
					$(this).find('.content-mask').stop().fadeOut();
				});
			});
		}
	};

	Succeed.init();
	
});