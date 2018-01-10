/**
 * Created by jingpinghong on 2016/12/15.
 */
(function () {

    //checkUserLogin();
    var  articleList = {
        init: function () {
            this.pageNum;
            this.statusNum;
            this.getArticleList();
        },
        pageNum:1,
        statusNum:1,
        getArticleList: function () {
            var tpl = __inline('total_list.tmpl');
            var page=this.pageNum++;
            var status=this.statusNum++;
            var fetchArticleList = $.ajax({
                url: host + 'focus/getHomePageAngelFocusListPC.htm?type=0&clientType=pc&numPerPage=6&pageNum='+page+'&status='+status,
                //url: 'http://10.36.105.154:8080/rest/' + 'focus/getHomePageAngelFocusListPC.htm?type=0&clientType=pc&numPerPage=6&pageNum='+page+'&status='+status,
                type: 'POST',
                dataType: 'JSON'
            });
            fetchArticleList.done(function (data) {

                var articleListEl = '';
                if (data.code == '0000') {

                    //总共条数加载完'查看更多'就消失
                    if(data.data.resultSize <= 6 ){
                        $("#more").css('visibility','hidden');
                    }
                    data.data = data.data.resultMaps.map(function(item) {
                        item.focusImgURL = staticUrl + item.focusImg;
                        return item;
                    });
                    articleListEl = tpl(data);
                }
                if (articleListEl) {
                    $('#article-list-wrapper').append(articleListEl);
                };

            });
        },
    };
    articleList.init();
    $("#more").on('click',function(){
        articleList.getArticleList();
        //$("#more").hide();
        $("#more").css('visibility','hidden');
    });
})();


