(function () {
    
    var NoticeBar = {
        init: function () {
            this.getNoticeTxt();
            this.showNotice();
            this.closeNotice();
            this.animationNotice();
        },

        getNoticeTxt: function () {
            var noticeType = getRequest().noticeType;
            var requestUrl = 'notice/selectNotice.htm?noticeType=1&clientType=wap';
            
            if (noticeType === 'order') {
                requestUrl = 'notice/selectNotice.htm?noticeType=2&clientType=wap';
            }
            
            $.ajax({
                url: host + requestUrl,
                dataType: 'json',
                type: 'post',
                success: function (result) {
                    var noticeTxt = '';

                    if (result.data.length === 0) {
                        $('.notice-wrp').hide();
                        return;
                    }

                    for (var i = 0; i < result.data.length; i++) {
                        noticeTxt += result.data[i].notice + '　　　';
                    }
                    $('#notice-arr-txt').text(noticeTxt);
                }
            });
        },

        showNotice: function () {
            if (getRequest().noticeType === 'order') {
                sessionStorage.getItem('notice-order') ? $('.notice-wrp').hide() : $('.notice-wrp').show();
            } else {
                sessionStorage.getItem('notice-home') ? $('.notice-wrp').hide() : $('.notice-wrp').show();
            }
        },

        closeNotice: function () {
            $('.inner-shut').on('click', function () {
                if (getRequest().noticeType === 'order') {
                    sessionStorage.setItem('notice-order', true);
                    $('.notice-wrp').hide();
                } else {
                    sessionStorage.setItem('notice-home', true);
                    $('.notice-wrp').hide();
                }
            });
        },

        animationNotice: function () {
            $('.notice-wrp').animate({
                height: '40px'
            }, 1000);
        }
    };

    NoticeBar.init();

})();