(function () {
    var SchoolPro = {
        init: function () {
            this.getShcoolInfoList();
        },

        getShcoolInfoList: function () {
            $.ajax({
                type:'post',
                url: host + 'focus/getHomePageAngelFocusList.htm?clientType=wap&type=0',
                dataType:'JSON',
                success: function (data) {
                    var tpl = __inline('angel-item.tmpl');
                    
                    if (data) {
						var html = tpl(data);
                        $('.school-container').html(html);
					}
                }
            }); 
        }
    };

    SchoolPro.init();
})();