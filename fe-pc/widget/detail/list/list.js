var Pay = {
	payList: function () {
		var tpl = __inline('pay-list.tmpl');
		$.ajax({
		    url: host + 'dream/payList.htm?id=' + proId ,
		    type: 'POST',
		    dataType: 'JSON',
		    success: function (data) {
		        if (data.data && data.data.length > 0) {
		            var html = tpl(data);
		            $('.investor').html(html);
		        } else {
		        	$('.no-data').show();
		        }
		    },
		    error: function(e) {
		    }
		});
	}
};
