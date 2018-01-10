(function () {
    getVisitiToken();

     var homePage = {
        init: function () {
            this.toFund();
            this.showAnnouncement();
            this.closeAnnouncement();
            this.checkCfLogin();
        },
        //check from yixincaifu Login
        checkCfLogin:function(){
          var request = getRequest();
          var cfUserId = request['uid'];
          var cfToken = request['token'];
          if (cfUserId && cfToken) {
            $.ajax({
                url: host + '/user/loginByToken.htm',
                dataType: 'JSON',
                type: 'post',
                data: {
                    token: token_client_data.token,
                    clientType: token_client_data.clientType,
                    cfUserId : cfUserId,
                    cfToken : cfToken
                },
                success: function (data) {
                    setToken(data.desc);
                    $.ajax({
                      type: 'POST',
                      url: host + 'user/checkUserFirstLoginFromEase.htm',
                      dataType: 'JSON',
                      data: {'token':getToken(),'clientType':'pc',cfUserId:cfUserId},
                      success:function(re){
                        if(re.data.firstLogin === '1'){
                          $('.yixincaifu-popup').apopup({
                            positionStyle:'absolute',
                            maskColor:'#000',
                            maskClose:false,
                            opacity:'1',
                            position:[0,0],
                            onOpen:function(){
                              $(this).prevAll().hide();
                            },
                            onClose:function(){
                              var _this = this;
                              $.ajax({
                                type: 'POST',
                                url: host + 'user/updateUserFirstStatus.htm',
                                dataType: 'JSON',
                                data: {'token':getToken(),'clientType':'pc',cfUserId:cfUserId},
                                success:function(){
                                  $(_this).prevAll().show();
                                  location.reload();
                                }
                              })
                            }
                          });
                        }
                      }
                    })
                }
            });
          }
        },
        // 开始投资之旅点击跳转到热募中
        toFund: function () {
             // we target both html and body because html will make scroll in Firefox works and body for other browsers.
            // Firefox places the overflow at the html level
            var toFundEl = $('#to-fund');
            toFundEl.on('click', function () {
                var bodyEl = $('body,html');
                bodyEl.animate(
                    {
                        scrollTop: 700
                    }, '500', 'swing');
            })
        },
        compileTemplate: function (selector, data) {
            return Handlebars.compile($(selector).html())(data);
        },

        /**
        * 显示首页公告栏
        * 2016-01-11 jihongzhang@creditease.cn
        */
        showAnnouncement: function () {
            var showAnnouncementAjax = $.ajax({
                type: 'POST',
                url: host + 'notice/selectNotice.htm?noticeType=1&clientType=pc',
                dataType: 'JSON'
            });

            showAnnouncementAjax.done(function (data) {
                if (data.code == '0000') {
                   if (data.data.length > 0) {
                        var compiledData = homePage.compileTemplate($('#announcement-template'),data);
                        $('.announcement-text-wrapper').append(compiledData);
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
                        $('.home-announcement').show();
                   }
                }
            });
        },
        closeAnnouncement: function () {
            $('.home-announcement').find('.icon-close').on('click', function () {
                $('.home-announcement').hide();
            })
        },
    }
    homePage.init();

	// $('.home-ant-line').show();

	// set slider url
	// $('.bee-slide').attr('href', baseUrl + 'detail/detail.html?proId=5');

	// $('.cat-slide').attr('href', baseUrl + 'detail/detail.html?proId=5');
})();
