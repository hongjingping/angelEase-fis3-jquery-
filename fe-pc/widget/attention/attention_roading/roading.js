/**
 * Created by jingpinghong on 2017/1/4.
 */
/**
 * Created by jingpinghong on 2017/1/4.
 */
(function () {

    checkUserLogin();

    var RoadingList = {
        init: function () {
            this.getTotalList();
        },

        getTotalList: function () {
            currentpage = 1;
            $('#currentPage').html(currentpage);
            var tpl = __inline('roading.tmpl');
            var pageNum=this.page++;
            var fetchTotalList  = $.ajax({
                url: host + 'praiseAttention/getAttentionProject.htm?status=3&page='+currentpage,
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });
            fetchTotalList.done(function (data) {
                var roadingListEl = '';
                if (data.code == '0000') {
                    if (data.data.resultMaps.length === 0) {
                        $('#roading').css('display', 'none');
                        $('.pagination-wrapper').css('display', 'none');
                        $('#nomsg').css('display', 'block');
                        return;
                    } else if (data.data.resultMaps.length >= 5) {
                        $('.pagination-wrapper').css('display', 'block');
                    }

                    var newData = {
                        data: data.data.resultMaps.map(function(item) {
                            // api provide the four whitespace
                            item.labels = item.lablesName.trim().split('    ');
                            return item;
                        })
                    },
                    roadingListEl = tpl(newData);
                    $('#roading').html(roadingListEl);
                    $('#totalpage').html(data.data.pageCount);
                }
            })
        },
    };

    RoadingList.init();
})();

//分页
function pagecontent(pageNum){
    var tpl = __inline('roading.tmpl');
    currentpage = pageNum;
    $('#currentPage').html(currentpage);
    var fetchTotalList  = $.ajax({
        url: host + 'praiseAttention/getAttentionProject.htm?page='+pageNum,
        type: 'POST',
        data: token_client_data,
        dataType: 'JSON',
    });
    fetchTotalList.done(function (data) {
        var articleListEl = '';
        if (data.code == '0000') {
            if (data.data.resultMaps.length === 0) {
                $('#msg').css('display', 'none');
                $('#nomsg').css('display', 'block');
            }
            var newData = {
                    data: data.data.resultMaps.map(function(item) {
                        // api provide the four whitespace
                        item.labels = item.lablesName.trim().split('    ');
                        return item;
                    })
                },
                articleListEl = tpl(newData);
            $('#msg').html(articleListEl);
        }
    });

    //$.ajax({
    //    url: host + 'praiseAttention/getAttentionProject.htm?page='+pageNum,
    //    dataType: "JSON",
    //    type: "POST",
    //    data:token_client_data,
    //    success: function (result) {
    //        if(result.code == '0000'){
    //            if(result.data.modelList.length > 0){
    //                $('.list').empty();
    //                var contentHtml ='<tr>' +
    //                    '<td #titleCss#>#title#</td>' +
    //                    '<td class="font-gray">宜信众筹</td>' +
    //                    '<td class="font-gray">#date#</td>' +
    //                    '</tr>';
    //                var newHtml = '';
    //                var titleCss = '';
    //                $.each(result.data.modelList , function (index,element){
    //                    newHtml = contentHtml.replace('#title#', '【系统消息】' + element.msgName).
    //                    replace('#date#', element.msgDate).
    //                    replace('#id#', element.msgId);
    //                    if(element.isRead == '1'){
    //                        newHtml = newHtml.replace('#titleCss#', ' style="font-weight: 900;" ');
    //                    }else{
    //                        newHtml = newHtml.replace('#titleCss#', titleCss);
    //                    }
    //                    $('.list').append(newHtml);
    //                });
    //            }else {
    //                $('.list').empty();
    //                var contentHtml ='<tr>' +
    //                    '<td #titleCss#>#title#</td>' +
    //                    '<td class="font-gray">宜信众筹</td>' +
    //                    '<td class="font-gray">#date#</td>' +
    //                    '</tr>';
    //            }
    //        }else if(result.code=='4000'){
    //            location.href = loginUrl;
    //        }
    //    },
    //    error:function(e) {
    //    }
    //});
}

//上一页
function prepage(pre){
    if(currentpage == 1){
        pagecontent(1);
        $(pre).css('color','#808080');
    }else{
        pagecontent(Number(currentpage) -1);
        $(pre).css('color','black');
    }
    $(pre).attr("href",'#?page=' + currentpage);
    $('#nextpage').css('color','black');
}

//下一页
function sufpage(suf){
    var total = $('#totalpage').html();
    if(total == currentpage){
        $(suf).attr('href','#');
        $(suf).css('color','#808080');
    }else{
        pagecontent(Number(currentpage) + 1);
        $(suf).attr('href','#?page=' + currentpage);
        $(suf).css('color','black');
    }
    $('#beforepage').css('color','black');
}

//跳转页
function jumppage(){
    var pages = $('#jumppage').val();
    if(pages == ''){
        var readSmartAlert = new SmartAlert({
            title: '报错',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">请输入跳转页码!</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        return;
    }else if(Number(pages) > Number($('#totalpage').html())){
        var readSmartAlert = new SmartAlert({
            title: '报错',
            content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">跳转页超过总页数!</span>',
            type: 'confirm',
            okText: '我知道了',
            maskClosable: false,
        });
        readSmartAlert.open();
        return;
    }else{
        window.location.href = window.location.href.substring(0,window.location.href.indexOf('html')+4) + '#?page=' + pages;
        pagecontent(pages);
    }
}

//尾页
function lastpages(last){
    window.location.href = window.location.href.substring(0,window.location.href.indexOf('html')+4) + '#?page=' + $('#totalpage').html();
    pagecontent($('#totalpage').html());
}


