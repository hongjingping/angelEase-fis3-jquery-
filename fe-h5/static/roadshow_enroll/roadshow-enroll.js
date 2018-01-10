(function() {

	var Roadshow = {
		init: function() {
			this.setRoadshowHeader();
			this.checkBoxInit();
			this.inputOnFocus();
			this.inputOnBlur();
			this.sendMsg();
		},

		setRoadshowHeader: function() {
			//$('.cmn-header-title').text('路演报名');
			$('.cmn-header-title').text('');
		},
		//inputEffect: function() {
		//	$(".highlight-input").focus(function() {
		//		console.log(123);
		//		$(this).parent().siblings().find("i").removeClass("name-icon");
		//		$(this).parent().siblings().find("i").addClass("icon-item-active");
        //
		//	})
		//},

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
		},
		
		inputOnFocus: function() {
			$(".highlight-input").focus(function() {
					$(this).parent().siblings().find('i').addClass("icon-item-active");
			});
		},

		inputOnBlur: function () {
			$(".highlight-input").blur(function() {
				$(this).parent().siblings().find('i').removeClass("icon-item-active");
			});
		},

		sendMsg: function() {
			$("#snd-vode-btn").click(function() {
				Roadshow.countSec(60);
			});
		},

		countSec: function(val) {

			if(val <= 0) {
				$("#snd-vode-btn").html("发送验证码");
				$("#snd-vode-btn").removeAttr("disabled");
				Roadshow.sendMsg();
			} else {
				$("#snd-vode-btn").unbind("click");

				$("#snd-vode-btn").html(val + "s");
				val--;
				setTimeout(function() {
					Roadshow.countSec(val);
				}, 1000);
			}
		}
	};

	Roadshow.init();

})();