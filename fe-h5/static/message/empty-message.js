(function () {

	var Message = {
		init: function () {
			this.messageHeader();
		},

		messageHeader: function () {
			$('.cmn-header-title').text('我的消息');
		}
	};

	Message.init();
	
})();