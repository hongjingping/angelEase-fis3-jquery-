(function () {
	
	var Team = {

		init: function () {
			this.teamList();
		},

		teamList: function () {
			var me = this;
			var tpl = __inline('team-list.tmpl');

			$.ajax({
			    url: host + 'dream/teamInfo.htm?id=' + proId,
			    // url: '/api/detail/team',
			    type: 'POST',
			    dataType: 'JSON',
			    data: token_client_data,
			    success: function (data) {
			        if (data.data) {
			            var html = tpl(data);
			            $('.team').html(html);
			        }
			    },
			    error: function(e) {
			    }
			}).done(function () {
				
			});
		}

	};

	Team.init();

})();