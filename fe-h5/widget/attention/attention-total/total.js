/**
 * Created by jingpinghong on 2017/1/3.
 */
(function () {

    checkUserLogin();
    var flag = true;
    var TotalList = {
        init: function () {
            this.page;
            this.getTotalList();
        },
        page:1,
        getTotalList: function () {
            var tpl = __inline('total.tmpl');
            var pageNum=this.page++;
            var fetchTotalList  = $.ajax({
                url: host + 'praiseAttention/getAttentionProject.htm?page='+pageNum,
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });
            fetchTotalList.done(function (data) {
                if(pageNum > data.data.pageCount){
                    //没有关注内容
                    if (pageNum == 1) {
                        $('#msg').css('display', 'none');
                        $('#nomsg').css('display', 'block');
                    }
                    flag = false;
                    return false;
                }

                var TotalListEl = '';
                if (data.code == '0000') {
                    if (data.data.resultMaps.length === 0) {
                        $('#msg').css('display', 'none');
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
                        TotalListEl = tpl(newData);
                }
                if (TotalListEl ) {
                    $('#msg').append(TotalListEl );
                };

            })
        },
    };
    TotalList.init();

    $(window).scroll(function () {
            //已经滚动到上面的页面高度
            var scrollTop = $(this).scrollTop();
             //页面高度
            var scrollHeight = $(document).height();
              //浏览器窗口高度
            var windowHeight = $(this).height();

        //此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
             if (scrollTop + windowHeight == scrollHeight && flag == true) {
                 TotalList.getTotalList();
             }
         });
})();








