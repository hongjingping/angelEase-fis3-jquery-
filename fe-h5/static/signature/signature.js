(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('重签');
		}
	};

	UpdatePAssword.init();
	var w=new WritingPad();

})();