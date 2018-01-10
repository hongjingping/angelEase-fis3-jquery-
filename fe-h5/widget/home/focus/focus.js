(function () {
    var FocusPro = {
        init: function () {
            this.getFocusList();
        },

        getFocusList: function () {
            $.ajax({
                type:'post',
                url: host + 'focus/getHomePageAngelFocusList.htm?clientType=wap&type=1&pageNum=1&numPerPage=3',
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('focus-item.tmpl');
                    
                    if (data) {
						var html = tpl(data);
                        $('.focus-container').find('.focus-content').html(html);
					}
                }
            }); 
        }
    };

    FocusPro.init();
})();