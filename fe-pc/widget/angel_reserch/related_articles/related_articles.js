/**
 * Created by jingpinghong on 2016/12/16.
 */
(function () {
    var article = {
        init: function () {
            this.fetchRelatedArticle();
        },
        fetchRelatedArticle: function () {
            var relatedArticle = $.ajax({
                url: host + 'focus/getRelevantArticleList.htm?type=0&clientType=pc',
                type: 'POST',
                dataType: 'JSON',
            });
            relatedArticle.done((function (data) {
                if (data.code == '0000') {
                    this.fillRelatedArticle(data);
                }
            }).bind(this));
        },
        fillRelatedArticle: function (data) {
            var relatedArticleData = data.data;
            var listItems = relatedArticleData.map(function (item) {
                return '<p class="articles-list-title "><a href="../angel_detail/angel_detail.html?id=' + item.id + '" class="list-title" target="_blank">'+item.focusTitle+'</a></p>'
            });
            var listItemsEl = $('#articles-list');
            listItemsEl.append(listItems);
        },
    };
    article.init();
})();



