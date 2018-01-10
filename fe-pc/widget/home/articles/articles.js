(function () {
    var articlesPart = {
        init: function () {
            this.cacheElements();
            this.fetchFundingData();
            this.fetchResearchData();
        },
        cacheElements: function () {
            this.$fundingSpot = $('#funding-spot');
        },
        fetchFundingData: function () {
            var fundingData = $.ajax({
                url: host + 'focus/getHomePageAngelFocusList.htm?type=1&clientType=1',
                type: 'POST',
                dataType: 'JSON',
            });
            fundingData.done(function (data) {
                if (data.code === '0000') {
                    data.data = data.data.map(function(item) {
                        item.focusImgUrl = staticUrl + item.focusImg;
                        return item;
                    });
                    var tpl = __inline('fund-list.tmpl');
                    $('#funding-spot').html(tpl(data));
                }
            })
        },
        fetchResearchData: function () {
            var researchData = $.ajax({
                url: host + 'focus/getHomePageAngelFocusList.htm?type=0&clientType=1&numPerPage=8&pageNum=1',
                type: 'POST',
                dataType: 'JSON',
            });
            researchData.done(function (data) {
                if (data.code === '0000') {
                    var tpl = __inline('research-list.tmpl');
                    $('#angel-research').html(tpl(data));
                }
            })
        }
    }
    articlesPart.init();
})();