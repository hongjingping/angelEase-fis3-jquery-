(function () {

	var UpdatePAssword = {
		init: function () {
			this.updatePasswordHeader();
			this.checkBoxInit();
		},

		updatePasswordHeader: function () {
			$('.cmn-header-title').text('重签');
		},


		checkBoxInit: function() { 
			$("#i-check-btn").click(function() {
				console.log($(this).hasClass("i-check-unchecked"));
                if ($(this).hasClass("i-check-unchecked")) {
                	$(this).removeClass("i-check-unchecked");
                    $(this).addClass("i-check-checked");
                    
                } else {
                    $(this).addClass("i-check-unchecked");
                    $(this).removeClass("i-check-checked");
                }

			});
		}
	};

	UpdatePAssword.init();

})();