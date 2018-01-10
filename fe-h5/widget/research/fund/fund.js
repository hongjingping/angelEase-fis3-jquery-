(function () {
    var FundPro = {
        init: function () {
            this.getFocusInfoList();
        },

        getFocusInfoList: function () {
            $.ajax({
                type:'post',
                url: host + 'focus/getHomePageAngelFocusList.htm?clientType=wap&type=1',
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('fund-item.tmpl');
                    
                    if (data) {
						var html = tpl(data);
                        $('.fund-container').html(html);
					}
                }
            }); 
        }
    };

    FundPro.init();
})();