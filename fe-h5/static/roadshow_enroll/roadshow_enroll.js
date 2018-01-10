(function() {

	var Roadshow = {
		init: function() {
			this.setRoadshowHeader();
			this.checkBoxInit();
		},

		setRoadshowHeader: function() {
			//$('.cmn-header-title').text('路演报名');
			$('.cmn-header-title').text('');
		},

		checkBoxInit: function() {
			$("#i-check-btn").click(function() {
				console.log($(this).hasClass("i-check-unchecked"));
				if($(this).hasClass("i-check-unchecked")) {
					$(this).removeClass("i-check-unchecked");
					$(this).addClass("i-check-checked");

				} else {
					$(this).addClass("i-check-unchecked");
					$(this).removeClass("i-check-checked");
				}

			});
		}
	};

	Roadshow.init();

})();