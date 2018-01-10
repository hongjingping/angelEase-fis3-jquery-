(function () {

	var ProjectMod = {
		init: function() {
			this.setHeader();
            this.showAnnouncement();
            this.closeAnnouncement();
		},

		setHeader: function () {
			$('#cmn-header').text('投资项目');
		},
        compileTemplate: function (selector, data) {
            return Handlebars.compile($(selector).html())(data);
        },
        /**
        * 显示首页公告栏
        * 2016-01-13 jihongzhang@creditease.cn
        */
        showAnnouncement: function () {
            var self = this;
            var showAnnouncementAjax = $.ajax({
                type: 'POST',
                url: host + 'notice/selectNotice.htm?noticeType=2&clientType=pc',
                dataType: 'JSON'
            });

            showAnnouncementAjax.done(function (data) {
                if (data.code == '0000') {
                    if (data.data.length > 0) {
                        var compiledData = self.compileTemplate($('#announcement-template'),data);
                        $('.announcement-text-wrapper').append(compiledData);
                        $('.pay-announcement').show();
                        var owlEl = $('#announcement-carousel');
                        owlEl.owlCarousel({
                            loop:true,
                            items:1,
                            center:true,
                            dots: false,
                            autoplay: true,
                            animateIn: 'fadeInUp',
                            animateOut: 'fadeOutUp',
                            autoplayTimeout: 5000,
                        });

                    }
                }
            });
        },
        closeAnnouncement: function () {
            $('.pay-announcement').find('.icon-close').on('click', function () {
                $('.pay-announcement').hide();
            })
        }
	};

	ProjectMod.init();

})();