/*
 * 首页募集中的项目如果有路演中的状态的话就改成路演中,然后添加路演报名活动
 * 2017-02-17
 * jingpignhong@creditease.cn
 * */

function checkCode(proId) {
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
};

(function () {
    var hotRaise = {
        init: function () {
            this.fetchHotRaiseData()
            .then((function() {
                this.cacheElements();
                this.hignlightsAutoSwitch();
            }).bind(this));
        },
        cacheElements: function () {
            this.$raiseItemsWrapper = $('#raise-items-wrapper');
            this.$hignlightsEl = this.$raiseItemsWrapper.find('.project-hignlights');
            this.$leadInfoEl = this.$raiseItemsWrapper.find('.lead-info');
        },


        fetchHotRaiseData: function () {
            var tpl = __inline('hotraise.tmpl');
            var fetchHotRaiseAjax = $.ajax({
                url: host + 'dream/index.htm?clientType=pc',
                type: 'POST',
                dataType: 'JSON',
            });


            var hotRaiseListEl = '';
            return fetchHotRaiseAjax.done(function (data) {
                if (data.code === '0000') {
                    if (data.data.length === 0) {
                        $('.hot-raise-wrapper').css('display', 'none');
                    }
                    var newData = {
                        data: data.data.map(function(item) {
                            // api provide the four whitespace
                            item.labels = item.lablesName.trim().split(' ');
                            return item;
                        })
                    };
                    hotRaiseListEl = tpl(newData);
                    $('#raise-items-wrapper').html(hotRaiseListEl);
                }
            })
        },


        showHignlights: function () {
            var hignlightPart = this.$hignlightsEl;
            var leadinfoPart = this.$leadInfoEl;
            if (hignlightPart.hasClass('active')) {
                hignlightPart.animate({
                    opacity: 0
                }, 400).removeClass('active');
                leadinfoPart.animate({
                    opacity: 1
                }, 400).addClass('active');
                return;
            }
            if (leadinfoPart.hasClass('active')) {
                leadinfoPart.animate({
                    opacity: 0
                }, 400).removeClass('active');
                hignlightPart.animate({
                    opacity: 1
                }, 400).addClass('active');
                return;
            }
        },
        hignlightsAutoSwitch: function () {
            window.setInterval(this.showHignlights.bind(this), 5000);
        }
    };

    hotRaise.init();
})();