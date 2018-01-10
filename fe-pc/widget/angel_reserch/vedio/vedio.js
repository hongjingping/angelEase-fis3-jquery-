/**
 * Created by jingpinghong on 2016/12/16.
 */
(function () {
    var vedio = {
        init: function () {
            this.fetchvedio();
        },
        fetchvedio: function () {
            var vedio = $.ajax({
                url: host + 'focus/getFocusVideos.htm?type=1&clientType=pc',
                type: 'POST',
                dataType: 'JSON'
            });
            vedio.done((function (data) {
                if (data.code == '0000') {
                    this.fillvedio(data);
                }
            }).bind(this));
        },
        fillvedio: function (data) {
            var vedioData = data.data;
            var vedioItems = vedioData.map(function (item) {
                return  '<div class="vedio-list-content">'+
                    '<div class="list-content-img">'+
                    '<a class="content-img-href" href="../angel_detail/angel_detail.html?id=' + item.id + '" target="_blank"><img src="'+item.videoImg+'" width="320" height="120" ></a>'+
                    '</div>'+
                    '<div class="list-content-info"><a class="content-info-href" href="../angel_detail/angel_detail.html?id=' + item.id + '" target="_blank">'+item.focusTitle+'</a></div>'+
                    '</div>'
            });
            var vedioEl = $('#vedio-list');
            vedioEl.append(vedioItems);
        },
    };
    vedio.init();
})();

