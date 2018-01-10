(function () {
	
	var Raise = {

		init: function () {
			this.buildList('1');
		},

		buildList: function (flag) {
			var me = this;
			var tpl = __inline('raise-list.tmpl');
			var url = host + 'dream/indexPc.htm?status=4';
			if(flag === '1'){
				url = url + '&flag=' + flag;
			}
			$.ajax({
			    url: url,
			    type: 'POST',
			    dataType: 'JSON',
			    success: function (data) {
			    	if(data.desc == '1'){
			    		$('.load-more').show();
			    	}
			        if (data.data && data.data.length > 0) {
			            var html = tpl(data);	
			            if(flag === '1'){
							$('#raise-project').html(html);
						}else{
			            	$('#raise-project').last().append(html);
						}
			        } else {
			        	$('.project').hide();
			        }
			    },
			    error: function(e) {
			        // console.log(e);
			    }
			});
		}

	};

	//加载更多
	$('.load-more').click(function() {

		Raise.buildList();

		$('.load-more').hide();
	})

	Raise.init();

})();
