(function () {
	
	var Question = {

		init: function () {
			this.questionList();
		},

		questionList: function () {
			var me = this;
			var tpl = __inline('question-list.tmpl');
			$.ajax({
			    url: host + '/dream/faqInfo.htm?id=' + proId,
			    type: 'POST',
			    dataType: 'JSON',
			    data: token_client_data,
			    success: function (data) {
			        if (data.data) {
			            var html = tpl(data);
			            $('.qa').html(html);
			        }
			    },
			    error: function(e) {
			    }
			}).done(function () {
				
			});
		}

	};

	Question.init();

})();