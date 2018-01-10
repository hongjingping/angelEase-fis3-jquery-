/**
 * Created by jingpinghong on 2017/1/4.
 */
(function () {

    checkUserLogin();

    var raisingList = {
        init: function () {
            this.page;
            this.getRaisingList();
        },
        page:1,
        getRaisingList: function () {
            currentpage = 1;
            $('#currentPage').html(currentpage);
            var tpl = __inline('raising.tmpl');
            var fetchTotalList  = $.ajax({
                url: host + 'praiseAttention/getAttentionProject.htm?status=4&page='+currentpage,
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });
            fetchTotalList.done(function (data) {
                var articleListEl = '';
                if (data.code == '0000') {
                    if (data.data.resultMaps.length === 0) {
                        $('#raising').css('display', 'none');
                        $('.pagination-wrapper').css('display', 'none');
                        $('#nomsg').css('display', 'block');
                        return;
                    } else if (data.data.resultMaps.length >= 5){
                        $('.pagination-wrapper').css('display', 'block');
                    }
                    var newData = {
                        data: data.data.resultMaps.map(function(item) {
                            // api provide the four whitespace
                            item.labels = item.lablesName.trim().split('    ');
                            return item;
                        })
                    },
                    articleListEl = tpl(newData);
                    $('#raising').html(articleListEl);
                    $('#totalpage').html(data.data.pageCount);
                }
            })
        },
    };

    raisingList.init();
})();

//分页
function pagecontent(pageNum){
    var tpl = __inline('raising.tmpl');
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
                return flase;
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
