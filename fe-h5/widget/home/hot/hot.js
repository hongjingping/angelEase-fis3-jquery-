//路演
function onGoing(proId) {
    var code = '';
    $.ajax({
        type: 'POST',
        async: false,
        data: {'token':getToken(),'clientType':'wap'},
        url: host + 'ac/active/code.htm?projectId=' + proId ,
        dataType: 'JSON',
        success: function(data) {
            if(data.data != null && data.data != ''){
                code = data.data.code;
            }
        }
    });
    return code;
}

(function () {

    var HotFund = {
        init: function () {
            this.getProjectList();
        },
        getProjectList: function () {
            $.ajax({
                type:'post',
                url: host + 'dream/index.htm?clientType=wap',
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('hot-item.tmpl');
                    if (data) {
						var html = tpl(data);
						$('.project-list').html(html);
					}
                }
            }); 
        }
    };
    HotFund.init();
})();