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
    var recommandScript = {
        init: function () {
            this.fetchListData()
            .then((function(data) {
                this.cacheElements();
                this.attachTpl(data);
            }).bind(this));
        },
        cacheElements: function () {
            this.$recommandItems = $('.recommand-items');
        },
        fetchListData: function () {
            var deferred = $.ajax({
                url: host + 'dream/indexOfRec.htm?clientType=pc',
                type: 'POST',
                dataType: 'JSON',
            });
            return deferred;
        },
        attachTpl: function (data) {
            if (data.code === '0000') {
                if (data.data.length === 0) {
                    $('#recommand-wrapper').hide();
                } else {
                    var tpl = __inline('recommand.tmpl');
                    this.$recommandItems.append(tpl(data));
                }
            }
        }
    }

    recommandScript.init();
})();