/**
 * Created by jingpinghong on 2017/1/5.
 */

(function () {

    checkUserLogin();
    var flag = true;
    var RoadingList = {
        init: function () {
            this.page;
            this.getTotalList();
        },
        page:1,
        getTotalList: function () {

            var tpl = __inline('roading.tmpl');
            var pageNum=this.page++;
            var fetchTotalList  = $.ajax({
                url: host + 'praiseAttention/getAttentionProject.htm?status=3&page='+pageNum,
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });
            fetchTotalList.done(function (data) {
                if(pageNum > data.data.pageCount){
                    if (pageNum == 1) {
                        $('#msg').css('display', 'none');
                        $('#nomsg').css('display', 'block');
                    }
                    flag = false;
                    return false;
                }

                var roadingListEl = '';
                if (data.code == '0000') {
                    if (data.data.resultMaps.length === 0) {
                        $('#roading').css('display', 'none');
                        $('#nomsg').css('display', 'block');
                        return;
                    }
                    var newData = {
                            data: data.data.resultMaps.map(function(item) {
                                // api provide the four whitespace
                                item.labels = item.lablesName.trim().split('    ');
                                return item;
                            })
                        },
                        roadingListEl = tpl(newData);
                }
                if (roadingListEl) {
                    $('#roading').append(roadingListEl);
                };

            })
        },
    };

    RoadingList.init();

    $(window).scroll(function () {
        //已经滚动到上面的页面高度
        var scrollTop = $(this).scrollTop();
        //页面高度
        var scrollHeight = $(document).height();
        //浏览器窗口高度
        var windowHeight = $(this).height();
        //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
        if (scrollTop + windowHeight == scrollHeight && flag == true) {

            RoadingList.getTotalList();
        }
    });
})();
